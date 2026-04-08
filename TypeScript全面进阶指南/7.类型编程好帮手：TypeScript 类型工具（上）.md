上一节，我们了解了 TypeScript 中的内置类型 any、unknown 与 never，也提到这些内置类型实际上是最基础的“积木”。那想要利用好这些“积木”，我们还需要一些实用的类型工具。它们就像是锤子、锯子和斧子，有了它们的帮助，我们甚至可以拼装出摩天大楼！

在实际的类型编程中，为了满足各种需求下的类型定义，我们通常会结合使用这些类型工具。因此，我们一定要清楚这些类型工具各自的使用方法和功能。

所以，接下来我们会用两节课的时间来聊聊这些类型工具。类型工具顾名思义，它就是对类型进行处理的工具。如果按照使用方式来划分，类型工具可以分成三类：**操作符、关键字与专用语法**。我们会在这两节中掌握这些不同的使用方式，以及如何去结合地进行使用。

而按照使用目的来划分，类型工具可以分为 **类型创建** 与 **类型安全保护** 两类。这一节我们将学习的类型工具就属于类型创建，它们的作用都是基于已有的类型创建新的类型，这些类型工具包括类型别名、交叉类型、索引类型与映射类型。

> 本节代码见：[Internal Type Tools](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Flinbudu599%2FTypeScript-Tiny-Book%2Ftree%2Fmain%2Fpackages%2F05_1-internal-type-tools)

## 类型别名

类型别名可以说是 TypeScript 类型编程中最重要的一个功能，从一个简单的函数类型别名，到让你眼花缭乱的类型体操，都离不开类型别名。虽然很重要，但它的使用却并不复杂：

```typescript
type A = string;
```

我们通过 `type` 关键字声明了一个类型别名 A ，同时它的类型等价于 string 类型。类型别名的作用主要是对一组类型或一个特定类型结构进行封装，以便于在其它地方进行复用。

比如抽离一组联合类型：

```typescript
type StatusCode = 200 | 301 | 400 | 500 | 502;
type PossibleDataTypes = string | number | (() => unknown);

const status: StatusCode = 502;
```

抽离一个函数类型：

```typescript
type Handler = (e: Event) => void;

const clickHandler: Handler = (e) => { };
const moveHandler: Handler = (e) => { };
const dragHandler: Handler = (e) => { };
```

声明一个对象类型，就像接口那样：

```typescript
type ObjType = {
  name: string;
  age: number;
}
```

> 关于接口和类型别名的取舍，请参考原始类型与对象类型一节。

看起来类型别名真的非常简单，不就是声明了一个变量让类型声明更简洁和易于拆分吗？如果真的只是把它作为类型别名，用来进行特定类型的抽离封装，那的确很简单。然而，类型别名还能作为工具类型。**工具类同样基于类型别名，只是多了个泛型**。

如果你还不了解泛型也无需担心，现阶段我们只要了解它和类型别名相关的使用就可以了。至于更复杂的泛型使用场景，我们后面会详细了解。

在类型别名中，类型别名可以这么声明自己能够接受泛型（我称之为泛型坑位）。一旦接受了泛型，我们就叫它工具类型：

```typescript
type Factory<T> = T | number | string;
```

虽然现在类型别名摇身一变成了工具类型，但它的基本功能仍然是创建类型，只不过工具类型能够接受泛型参数，实现**更灵活的类型创建功能**。从这个角度看，工具类型就像一个函数一样，泛型是入参，内部逻辑基于入参进行某些操作，再返回一个新的类型。比如在上面这个工具类型中，我们就简单接受了一个泛型，然后把它作为联合类型的一个成员，返回了这个联合类型。

```typescript
const foo: Factory<boolean> = true;
```

当然，我们一般不会直接使用工具类型来做类型标注，而是再度声明一个新的类型别名：

```typescript
type FactoryWithBool = Factory<boolean>;

const foo: FactoryWithBool = true;
```

同时，泛型参数的名称（上面的 T ）也不是固定的。通常我们使用大写的 T / K / U / V / M / O ...这种形式。如果为了可读性考虑，我们也可以写成大驼峰形式（即在驼峰命名的基础上，首字母也大写）的名称，比如：

```typescript
type Factory<NewType> = NewType | number | string;
```

声明一个简单、有实际意义的工具类型：

```typescript
type MaybeNull<T> = T | null;
```

这个工具类型会接受一个类型，并返回一个包括 null 的联合类型。这样一来，在实际使用时就可以确保你处理了可能为空值的属性读取与方法调用：

```typescript
type MaybeNull<T> = T | null;

function process(input: MaybeNull<{ handler: () => {} }>) {
  input?.handler();
}
```

类似的还有 MaybePromise、MaybeArray。这也是我在日常开发中最常使用的一类工具类型：

```typescript
type MaybeArray<T> = T | T[];

// 函数泛型我们会在后面了解~
function ensureArray<T>(input: MaybeArray<T>): T[] {
  return Array.isArray(input) ? input : [input];
}
```

另外，类型别名中可以接受任意个泛型，以及为泛型指定约束、默认值等，这些内容我们都会在泛型一节深入了解。

总之，对于工具类型来说，它的主要意义是**基于传入的泛型进行各种类型操作**，得到一个新的类型。而这个类型操作的指代就非常非常广泛了，甚至说类型编程的大半难度都在这儿呢，这也是这本小册占据篇幅最多的部分。

## 联合类型与交叉类型

在原始类型与对象类型一节，我们了解了联合类型。但实际上，联合类型还有一个和它有点像的孪生兄弟：**交叉类型**。它和联合类型的使用位置一样，只不过符号是`&`，即按位与运算符。

实际上，正如联合类型的符号是`|`，它代表了按位或，即只需要符合联合类型中的一个类型，既可以认为实现了这个联合类型，如`A | B`，只需要实现 A 或 B 即可。

而代表着按位与的 `&` 则不同，你需要符合这里的所有类型，才可以说实现了这个交叉类型，即 `A & B`，**需要同时满足 A 与 B 两个类型**才行。

我们声明一个交叉类型：

```typescript
interface NameStruct {
  name: string;
}

interface AgeStruct {
  age: number;
}

type ProfileStruct = NameStruct & AgeStruct;

const profile: ProfileStruct = {
  name: "linbudu",
  age: 18
}
```

很明显这里的 profile 对象需要同时符合这两个对象的结构。从另外一个角度来看，ProfileStruct 其实就是一个新的，同时包含 NameStruct 和 AgeStruct 两个接口所有属性的类型。这里是对于对象类型的合并，那对于原始类型呢？

```typescript
type StrAndNum = string & number; // never
```

我们可以看到，它竟然变成 never 了！看起来很奇怪，但想想我们前面给出的定义，新的类型会同时符合交叉类型的所有成员，存在既是 string 又是 number 的类型吗？当然不。实际上，这也是 never 这一 BottomType 的实际意义之一，描述**根本不存在的类型**嘛。

对于对象类型的交叉类型，其内部的同名属性类型同样会按照交叉类型进行合并：

```typescript
type Struct1 = {
  primitiveProp: string;
  objectProp: {
    name: string;
  }
}

type Struct2 = {
  primitiveProp: number;
  objectProp: {
    age: number;
  }
}

type Composed = Struct1 & Struct2;

type PrimitivePropType = Composed['primitiveProp']; // never
type ObjectPropType = Composed['objectProp']; // { name: string; age: number; }
```

如果是两个联合类型组成的交叉类型呢？其实还是类似的思路，既然只需要实现一个联合类型成员就能认为是实现了这个联合类型，那么各实现两边联合类型中的一个就行了，也就是两边联合类型的交集：

```typescript
type UnionIntersection1 = (1 | 2 | 3) & (1 | 2); // 1 | 2
type UnionIntersection2 = (string | number | symbol) & string; // string
```

总结一下交叉类型和联合类型的区别就是，联合类型只需要符合成员之一即可（`||`），而交叉类型需要严格符合每一位成员（`&&`）。

## 索引类型

索引类型指的不是某一个特定的类型工具，它其实包含三个部分：**索引签名类型**、**索引类型查询**与**索引类型访问**。目前很多社区的学习教程并没有这一点进行说明，实际上这三者都是独立的类型工具。唯一共同点是，**它们都通过索引的形式来进行类型操作**，但索引签名类型是**声明**，后两者则是**读取**。接下来，我们来依次介绍三个部分。

### 索引签名类型

索引签名类型主要指的是在接口或类型别名中，通过以下语法来**快速声明一个键值类型一致的类型结构**：

```typescript
interface AllStringTypes {
  [key: string]: string;
}

type AllStringTypes = {
  [key: string]: string;
}
```

这时，即使你还没声明具体的属性，对于这些类型结构的属性访问也将全部被视为 string 类型：

```typescript
interface AllStringTypes {
  [key: string]: string;
}

type PropType1 = AllStringTypes['linbudu']; // string
type PropType2 = AllStringTypes['599']; // string
```

在这个例子中我们声明的键的类型为 string（`[key: string]`），这也意味着在实现这个类型结构的变量中**只能声明字符串类型的键**：

```typescript
interface AllStringTypes {
  [key: string]: string;
}

const foo: AllStringTypes = {
  "linbudu": "599"
}
```

但由于 JavaScript 中，对于 `obj[prop]` 形式的访问会将**数字索引访问转换为字符串索引访问**，也就是说， `obj[599]` 和 `obj['599']` 的效果是一致的。因此，在字符串索引签名类型中我们仍然可以声明数字类型的键。类似的，symbol 类型也是如此：

```typescript
const foo: AllStringTypes = {
  "linbudu": "599",
  599: "linbudu",
  [Symbol("ddd")]: 'symbol',
}
```

索引签名类型也可以和具体的键值对类型声明并存，但这时这些具体的键值类型也需要符合索引签名类型的声明：

```typescript
interface AllStringTypes {
  // 类型“number”的属性“propA”不能赋给“string”索引类型“boolean”。
  propA: number;
  [key: string]: boolean;
}
```

这里的符合即指子类型，因此自然也包括联合类型：

```typescript
interface StringOrBooleanTypes {
  propA: number;
  propB: boolean;
  [key: string]: number | boolean;
}
```

索引签名类型的一个常见场景是在重构 JavaScript 代码时，为内部属性较多的对象声明一个 any 的索引签名类型，以此来暂时支持**对类型未明确属性的访问**，并在后续一点点补全类型：

```typescript
interface AnyTypeHere {
  [key: string]: any;
}

const foo: AnyTypeHere['linbudu'] = 'any value';
```

### 索引类型查询

刚才我们已经提到了索引类型查询，也就是 keyof 操作符。严谨地说，它可以将对象中的所有键转换为对应字面量类型，然后再组合成联合类型。注意，**这里并不会将数字类型的键名转换为字符串类型字面量，而是仍然保持为数字类型字面量**。

```typescript
interface Foo {
  linbudu: 1,
  599: 2
}

type FooKeys = keyof Foo; // "linbudu" | 599
```

如果觉得不太好理解，我们可以写段伪代码来模拟 **“从键名到联合类型”** 的过程。

```typescript
type FooKeys = Object.keys(Foo).join(" | ");
```

除了应用在已知的对象类型结构上以外，你还可以直接 `keyof any` 来生产一个联合类型，它会由所有可用作对象键值的类型组成：`string | number | symbol`。也就是说，它是由无数字面量类型组成的，由此我们可以知道， **keyof 的产物必定是一个联合类型**。

> 

### 索引类型访问

在 JavaScript 中我们可以通过 `obj[expression]` 的方式来动态访问一个对象属性（即计算属性），expression 表达式会先被执行，然后使用返回值来访问属性。而 TypeScript 中我们也可以通过类似的方式，只不过这里的 expression 要换成类型。接下来，我们来看个例子：

```typescript
interface NumberRecord {
  [key: string]: number;
}

type PropType = NumberRecord[string]; // number
```

这里，我们使用 string 这个类型来访问 NumberRecord。由于其内部声明了数字类型的索引签名，这里访问到的结果即是 number 类型。注意，其访问方式与返回值均是类型。

更直观的例子是通过字面量类型来进行索引类型访问：

```typescript
interface Foo {
  propA: number;
  propB: boolean;
}

type PropAType = Foo['propA']; // number
type PropBType = Foo['propB']; // boolean
```

看起来这里就是普通的值访问，但实际上这里的`'propA'`和`'propB'`都是**字符串字面量类型**，**而不是一个 JavaScript 字符串值**。索引类型查询的本质其实就是，**通过键的字面量类型（`'propA'`）访问这个键对应的键值类型（`number`）**。

看到这你肯定会想到，上面的 keyof 操作符能一次性获取这个对象所有的键的字面量类型，是否能用在这里？当然，这可是 TypeScript 啊。

```typescript
interface Foo {
  propA: number;
  propB: boolean;
  propC: string;
}

type PropTypeUnion = Foo[keyof Foo]; // string | number | boolean
```

使用字面量联合类型进行索引类型访问时，其结果就是将联合类型每个分支对应的类型进行访问后的结果，重新组装成联合类型。**索引类型查询、索引类型访问通常会和映射类型一起搭配使用**，前两者负责访问键，而映射类型在其基础上访问键值类型，我们在下面一个部分就会讲到。

注意，在未声明索引签名类型的情况下，我们不能使用 `NumberRecord[string]` 这种原始类型的访问方式，而只能通过键名的字面量类型来进行访问。

```typescript
interface Foo {
  propA: number;
}

// 类型“Foo”没有匹配的类型“string”的索引签名。
type PropAType = Foo[string]; 
```

索引类型的最佳拍档之一就是映射类型，同时映射类型也是类型编程中常用的一个手段。

## 映射类型：类型编程的第一步

不同于索引类型包含好几个部分，映射类型指的就是一个确切的类型工具。看到映射这个词你应该能联想到 JavaScript 中数组的 map 方法，实际上也是如此，映射类型的主要作用即是**基于键名映射到键值类型**。概念不好理解，我们直接来看例子：

```typescript
type Stringify<T> = {
  [K in keyof T]: string;
};
```

这个工具类型会接受一个对象类型（假设我们只会这么用），使用 keyof 获得这个对象类型的键名组成字面量联合类型，然后通过映射类型（即这里的 in 关键字）将这个联合类型的每一个成员映射出来，并将其键值类型设置为 string。

具体使用的表现是这样的：

```typescript
interface Foo {
  prop1: string;
  prop2: number;
  prop3: boolean;
  prop4: () => void;
}

type StringifiedFoo = Stringify<Foo>;

// 等价于
interface StringifiedFoo {
  prop1: string;
  prop2: string;
  prop3: string;
  prop4: string;
}
```

我们还是可以用伪代码的形式进行说明：

```typescript
const StringifiedFoo = {};
for (const k of Object.keys(Foo)){
  StringifiedFoo[k] = string;
}
```

看起来好像很奇怪，我们应该很少会需要把一个接口的所有属性类型映射到 string？这有什么意义吗？别忘了，既然拿到了键，那键值类型其实也能拿到：

```typescript
type Clone<T> = {
  [K in keyof T]: T[K];
};
```

这里的`T[K]`其实就是上面说到的索引类型访问，我们使用键的字面量类型访问到了键值的类型，这里就相当于克隆了一个接口。需要注意的是，这里其实只有`K in `属于映射类型的语法，`keyof T `属于 keyof 操作符，`[K in keyof T]`的`[]`属于索引签名类型，`T[K]`属于索引类型访问。

## 总结与预告

这一节，我们认识了类型工具中的类型别名、联合类型、索引类型以及映射类型。这些工具代表了类型工具中用于创建新类型的部分，但它们实现创建的方式却五花八门，以下这张表格概括了它们的实现方式与常见搭配

| 类型工具     | 创建新类型的方式                                             | 常见搭配           |
| ------------ | ------------------------------------------------------------ | ------------------ |
| 类型别名     | 将一组类型/类型结构封装，作为一个新的类型                    | 联合类型、映射类型 |
| 工具类型     | 在类型别名的基础上，基于泛型去动态创建新类型                 | 基本所有类型工具   |
| 联合类型     | 创建一组类型集合，满足其中一个类型即满足这个联合类型（\|\|） | 类型别名、工具类型 |
| 交叉类型     | 创建一组类型集合，满足其中所有类型才满足映射联合类型（&&）   | 类型别名、工具类型 |
| 索引签名类型 | 声明一个拥有任意属性，键值类型一致的接口结构                 | 映射类型           |
| 索引类型查询 | 从一个接口结构，创建一个由其键名字符串字面量组成的联合类型   | 映射类型           |
| 索引类型访问 | 从一个接口结构，使用键名字符串字面量访问到对应的键值类型     | 类型别名、映射类型 |
| 映射类型     | 从一个联合类型依次映射到其内部的每一个类型                   | 工具类型           |
|              |                                                              |                    |



在下一节，我们会继续来介绍类型工具中的类型查询操作符 typeof 以及类型守卫，如果说这一节我们了解的工具主要是生产新的类型，那类型守卫就像是流水线的质量检查员一样，它可以帮助你的代码进一步提升类型安全性。