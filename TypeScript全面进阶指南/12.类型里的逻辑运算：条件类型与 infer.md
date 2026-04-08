在完成类型层级一节的学习后，这一节学习条件类型对你来说已经没有什么困难了，因为你已经完全理解了它的判断逻辑！那我们直接开始这一节的学习吧！

> 本节代码见：[Conditional Types](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Flinbudu599%2FTypeScript-Tiny-Book%2Ftree%2Fmain%2Fpackages%2F09-conditional-types)

## 条件类型基础

条件类型的语法类似于我们平时常用的三元表达式，它的基本语法如下（伪代码）：

```typescript
ValueA === ValueB ? Result1 : Result2;
TypeA extends TypeB ? Result1 : Result2;
```

但需要注意的是，条件类型中使用 extends 判断类型的兼容性，而非判断类型的全等性。这是因为在类型层面中，对于能够进行赋值操作的两个变量，我们**并不需要它们的类型完全相等，只需要具有兼容性**，而两个完全相同的类型，其 extends 自然也是成立的。

条件类型绝大部分场景下会和泛型一起使用，我们知道，泛型参数的实际类型会在实际调用时才被填充（类型别名中显式传入，或者函数中隐式提取），而条件类型在这一基础上，可以基于填充后的泛型参数做进一步的类型操作，比如这个例子：

```typescript
type LiteralType<T> = T extends string ? "string" : "other";

type Res1 = LiteralType<"linbudu">; // "string"
type Res2 = LiteralType<599>; // "other"
```

同三元表达式可以嵌套一样，条件类型中也常见多层嵌套，如：

```typescript
export type LiteralType<T> = T extends string
	? "string"
	: T extends number
	? "number"
	: T extends boolean
	? "boolean"
	: T extends null
	? "null"
	: T extends undefined
	? "undefined"
	: never;

type Res1 = LiteralType<"linbudu">; // "string"
type Res2 = LiteralType<599>; // "number"
type Res3 = LiteralType<true>; // "boolean"
```

而在函数中，条件类型与泛型的搭配同样很常见。考考你，以下这个函数，我们应该如何标注它的返回值类型？

```typescript
function universalAdd<T extends number | bigint | string>(x: T, y: T) {
    return x + (y as any);
}
```

当我们调用这个函数时，由于两个参数都引用了泛型参数 T ，因此泛型会被填充为一个联合类型：

```typescript
universalAdd(599, 1); // T 填充为 599 | 1
universalAdd("linbudu", "599"); // T 填充为 linbudu | 599
```

那么此时的返回值类型就需要从这个字面量联合类型中推导回其原本的基础类型。在类型层级一节中，我们知道**同一基础类型的字面量联合类型，其可以被认为是此基础类型的子类型**，即 `599 | 1` 是 number 的子类型。

因此，我们可以使用嵌套的条件类型来进行字面量类型到基础类型地提取：

```typescript
function universalAdd<T extends number | bigint | string>(
	x: T,
	y: T
): LiteralToPrimitive<T> {
	return x + (y as any);
}

export type LiteralToPrimitive<T> = T extends number
	? number
	: T extends bigint
	? bigint
	: T extends string
	? string
	: never;

universalAdd("linbudu", "599"); // string
universalAdd(599, 1); // number
universalAdd(10n, 10n); // bigint
```

条件类型还可以用来对更复杂的类型进行比较，比如函数类型：

```typescript
type Func = (...args: any[]) => any;

type FunctionConditionType<T extends Func> = T extends (
  ...args: any[]
) => string
  ? 'A string return func!'
  : 'A non-string return func!';

//  "A string return func!"
type StringResult = FunctionConditionType<() => string>;
// 'A non-string return func!';
type NonStringResult1 = FunctionConditionType<() => boolean>;
// 'A non-string return func!';
type NonStringResult2 = FunctionConditionType<() => number>;
```

在这里，我们的条件类型用于判断两个函数类型是否具有兼容性，而条件中并不限制参数类型，仅比较二者的返回值类型。

与此同时，存在泛型约束和条件类型两个 extends 可能会让你感到疑惑，但它们产生作用的时机完全不同，泛型约束要求你传入符合结构的类型参数，相当于**参数校验**。而条件类型使用类型参数进行条件判断（就像 if else），相当于**实际内部逻辑**。

我们上面讲到的这些条件类型，本质上就是在泛型基于调用填充类型信息的基础上，新增了**基于类型信息的条件判断**。看起来很不错，但你可能也发现了一个无法满足的场景：提取传入的类型信息。

## infer 关键字

在上面的例子中，假如我们不再比较填充的函数类型是否是 `(...args: any[]) => string` 的子类型，而是要拿到其返回值类型呢？或者说，我们希望拿到填充的类型信息的一部分，而不是只是用它来做条件呢？

TypeScript 中支持通过 infer 关键字来**在条件类型中提取类型的某一部分信息**，比如上面我们要提取函数返回值类型的话，可以这么放：

```typescript
type FunctionReturnType<T extends Func> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;
```

看起来是新朋友，其实还是老伙计。上面的代码其实表达了，当传入的类型参数满足 `T extends (...args: any[] ) => infer R` 这样一个结构（不用管 `infer R`，当它是 any 就行），返回 `infer R `位置的值，即 R。否则，返回 never。

`infer`是 `inference` 的缩写，意为推断，如 `infer R` 中 `R` 就表示 **待推断的类型**。 `infer` 只能在条件类型中使用，因为我们实际上仍然需要**类型结构是一致的**，比如上例中类型信息需要是一个函数类型结构，我们才能提取出它的返回值类型。如果连函数类型都不是，那我只会给你一个 never 。

这里的**类型结构**当然并不局限于函数类型结构，还可以是数组：

```typescript
type Swap<T extends any[]> = T extends [infer A, infer B] ? [B, A] : T;

type SwapResult1 = Swap<[1, 2]>; // 符合元组结构，首尾元素替换[2, 1]
type SwapResult2 = Swap<[1, 2, 3]>; // 不符合结构，没有发生替换，仍是 [1, 2, 3]
```

由于我们声明的结构是一个仅有两个元素的元组，因此三个元素的元组就被认为是不符合类型结构了。但我们可以使用 rest 操作符来处理任意长度的情况：

```typescript
// 提取首尾两个
type ExtractStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...any[],
  infer End
]
  ? [Start, End]
  : T;

// 调换首尾两个
type SwapStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...infer Left,
  infer End
]
  ? [End, ...Left, Start]
  : T;

// 调换开头两个
type SwapFirstTwo<T extends any[]> = T extends [
  infer Start1,
  infer Start2,
  ...infer Left
]
  ? [Start2, Start1, ...Left]
  : T;
```

是的，infer 甚至可以和 rest 操作符一样同时提取一组不定长的类型，而 `...any[]` 的用法是否也让你直呼神奇？上面的输入输出仍然都是数组，而实际上我们完全可以进行结构层面的转换。比如从数组到联合类型：

```typescript
type ArrayItemType<T> = T extends Array<infer ElementType> ? ElementType : never;

type ArrayItemTypeResult1 = ArrayItemType<[]>; // never
type ArrayItemTypeResult2 = ArrayItemType<string[]>; // string
type ArrayItemTypeResult3 = ArrayItemType<[string, number]>; // string | number
```

原理即是这里的 `[string, number]` 实际上等价于 `(string | number)[]`。

除了数组，infer 结构也可以是接口：

```typescript
// 提取对象的属性类型
type PropType<T, K extends keyof T> = T extends { [Key in K]: infer R }
  ? R
  : never;

type PropTypeResult1 = PropType<{ name: string }, 'name'>; // string
type PropTypeResult2 = PropType<{ name: string; age: number }, 'name' | 'age'>; // string | number

// 反转键名与键值
type ReverseKeyValue<T extends Record<string, unknown>> = T extends Record<infer K, infer V> ? Record<V & string, K> : never

type ReverseKeyValueResult1 = ReverseKeyValue<{ "key": "value" }>; // { "value": "key" }
```

在这里，为了体现 infer 作为类型工具的属性，我们结合了索引类型与映射类型，以及使用 `& string` 来确保属性名为 string 类型的小技巧。

为什么需要这个小技巧，如果不使用又会有什么问题呢？

```typescript
// 类型“V”不满足约束“string | number | symbol”。
type ReverseKeyValue<T extends Record<string, string>> = T extends Record<
  infer K,
  infer V
>
  ? Record<V, K>
  : never;
```

明明约束已经声明了 V 的类型是 string，为什么还是报错了？

这是因为，泛型参数 V 的来源是从键值类型推导出来的，TypeScript 中这样对键值类型进行 infer 推导，将导致类型信息丢失，而不满足索引签名类型只允许 `string | number | symbol` 的要求。

还记得映射类型的判断条件吗？需要同时满足其两端的类型，我们使用 `V & string` 这一形式，就确保了最终符合条件的类型参数 V 一定会满足 `string | never` 这个类型，因此可以被视为合法的索引签名类型。

infer 结构还可以是 Promise 结构！

```typescript
type PromiseValue<T> = T extends Promise<infer V> ? V : T;

type PromiseValueResult1 = PromiseValue<Promise<number>>; // number
type PromiseValueResult2 = PromiseValue<number>; // number，但并没有发生提取
```

就像条件类型可以嵌套一样，infer 关键字也经常被使用在嵌套的场景中，包括对类型结构深层信息地提取，以及对提取到类型信息的筛选等。比如上面的 PromiseValue，如果传入了一个嵌套的 Promise 类型就失效了：

```typescript
type PromiseValueResult3 = PromiseValue<Promise<Promise<boolean>>>; // Promise<boolean>，只提取了一层
```

这种时候我们就需要进行嵌套地提取了：

```typescript
type PromiseValue<T> = T extends Promise<infer V>
  ? V extends Promise<infer N>
    ? N
    : V
  : T;
```

当然，在这时应该使用递归来处理任意嵌套深度：

```typescript
type PromiseValue<T> = T extends Promise<infer V> ? PromiseValue<V> : T;
```

条件类型在泛型的基础上支持了基于类型信息的动态条件判断，但无法直接消费填充类型信息，而 infer 关键字则为它补上了这一部分的能力，让我们可以进行更多奇妙的类型操作。TypeScript 内置的工具类型中还有一些基于 infer 关键字的应用，我们会在内置工具类型讲解一章中了解它们的具体实现。而我们上面了解的 rest infer（`...any[]`），结合其他类型工具、递归 infer 等，都是日常比较常用的操作，这些例子应当能让你再一次意识到“类型编程”的真谛。

## 分布式条件类型

分布式条件类型听起来真的很高级，但这里和分布式和分布式服务并不是一回事。**分布式条件类型（\*Distributive Conditional Type\*），也称条件类型的分布式特性**，只不过是条件类型在满足一定情况下会执行的逻辑而已。我们来看一个例子：

```typescript
type Condition<T> = T extends 1 | 2 | 3 ? T : never;

// 1 | 2 | 3
type Res1 = Condition<1 | 2 | 3 | 4 | 5>;

// never
type Res2 = 1 | 2 | 3 | 4 | 5 extends 1 | 2 | 3 ? 1 | 2 | 3 | 4 | 5 : never;
```

这个例子可能让你感觉充满了疑惑，某些地方似乎和我们学习的知识并不一样？先不说这两个理论上应该执行结果一致的类型别名，为什么在 Res1 中诡异地返回了一个联合类型？

仔细观察这两个类型别名的差异你会发现，唯一的差异就是在 Res1 中，进行判断的联合类型被作为泛型参数传入给另一个独立的类型别名，而 Res2 中直接对这两者进行判断。

记住第一个差异：**是否通过泛型参数传入**。我们再看一个例子：

```typescript
type Naked<T> = T extends boolean ? "Y" : "N";
type Wrapped<T> = [T] extends [boolean] ? "Y" : "N";

// "N" | "Y"
type Res3 = Naked<number | boolean>;

// "N"
type Res4 = Wrapped<number | boolean>;
```

现在我们都是通过泛型参数传入了，但诡异的事情又发生了，为什么第一个还是个联合类型？第二个倒是好理解一些，元组的成员有可能是数字类型，显然不兼容于 `[boolean]`。再仔细观察这两个例子你会发现，它们唯一的差异是条件类型中的**泛型参数是否被数组包裹**了。

同时，你会发现在 Res3 的判断中，其联合类型的两个分支，恰好对应于分别使用 number 和 boolean 去作为条件类型判断时的结果。

把上面的线索理一下，其实我们就大致得到了条件类型分布式起作用的条件。首先，你的类型参数需要是一个联合类型 。其次，类型参数需要通过泛型参数的方式传入，而不能直接在外部进行判断（如 Res2 中）。最后，条件类型中的泛型参数不能被包裹。

而条件类型分布式特性会产生的效果也很明显了，即将这个联合类型拆开来，每个分支分别进行一次条件类型判断，再将最后的结果合并起来（如 Naked 中）。如果再严谨一些，其实我们就得到了官方的解释：

**对于属于裸类型参数的检查类型，条件类型会在实例化时期自动分发到联合类型上。**（***Conditional types in which the checked type is a naked type parameter are called distributive conditional types. Distributive conditional types are automatically distributed over union types during instantiation.***）

这里的自动分发，我们可以这么理解：

```typescript
type Naked<T> = T extends boolean ? "Y" : "N";

// (number extends boolean ? "Y" : "N") | (boolean extends boolean ? "Y" : "N")
// "N" | "Y"
type Res3 = Naked<number | boolean>;
```

写成伪代码其实就是这样的：

```typescript
const Res3 = [];

for(const input of [number, boolean]){
  if(input extends boolean){
    Res3.push("Y");
  } else {
    Res.push("N");
  }
}
```

而这里的裸类型参数，其实指的就是泛型参数是否完全裸露，我们上面使用数组包裹泛型参数只是其中一种方式，比如还可以这么做：

```typescript
export type NoDistribute<T> = T & {};

type Wrapped<T> = NoDistribute<T> extends [boolean] ? "Y" : "N";
```

需要注意的是，我们并不是只会通过裸露泛型参数，来确保分布式特性能够发生。在某些情况下，我们也会需要包裹泛型参数来禁用掉分布式特性。最常见的场景也许还是联合类型的判断，即我们不希望进行联合类型成员的分布判断，而是希望直接判断这两个联合类型的兼容性判断，就像在最初的 Res2 中那样：

```typescript
type CompareUnion<T, U> = [T] extends [U] ? true : false;

type CompareRes1 = CompareUnion<1 | 2, 1 | 2 | 3>; // true
type CompareRes2 = CompareUnion<1 | 2, 1>; // false
```

通过将参数与条件都包裹起来的方式，我们对联合类型的比较就变成了数组成员类型的比较，在此时就会严格遵守类型层级一文中联合类型的类型判断了（子集为其子类型）。

另外一种情况则是，当我们想判断一个类型是否为 never 时，也可以通过类似的手段：

```typescript
type IsNever<T> = [T] extends [never] ? true : false;

type IsNeverRes1 = IsNever<never>; // true
type IsNeverRes2 = IsNever<"linbudu">; // false
```

这里的原因其实并不是因为分布式条件类型。我们此前在类型层级中了解过，当条件类型的判断参数为 any，会直接返回条件类型两个结果的联合类型。而在这里其实类似，当通过泛型传入的参数为 never，则会直接返回 never。

需要注意的是这里的 never 与 any 的情况并不完全相同，any 在直接**作为判断参数时**、**作为泛型参数时**都会产生这一效果：

```typescript
// 直接使用，返回联合类型
type Tmp1 = any extends string ? 1 : 2;  // 1 | 2

type Tmp2<T> = T extends string ? 1 : 2;
// 通过泛型参数传入，同样返回联合类型
type Tmp2Res = Tmp2<any>; // 1 | 2

// 如果判断条件是 any，那么仍然会进行判断
type Special1 = any extends any ? 1 : 2; // 1
type Special2<T> = T extends any ? 1 : 2;
type Special2Res = Special2<any>; // 1
```

而 never 仅在作为泛型参数时才会产生：

```typescript
// 直接使用，仍然会进行判断
type Tmp3 = never extends string ? 1 : 2; // 1

type Tmp4<T> = T extends string ? 1 : 2;
// 通过泛型参数传入，会跳过判断
type Tmp4Res = Tmp4<never>; // never

// 如果判断条件是 never，还是仅在作为泛型参数时才跳过判断
type Special3 = never extends never ? 1 : 2; // 1
type Special4<T> = T extends never ? 1 : 2;
type Special4Res = Special4<never>; // never
```

这里的 any、never 两种情况都不会实际地执行条件类型，而在这里我们通过包裹的方式让它不再是一个孤零零的 never，也就能够去执行判断了。

之所以分布式条件类型要这么设计，我个人理解主要是为了处理联合类型这种情况。就像我们到现在为止的伪代码都一直使用数组来表达联合类型一样，在类型世界中联合类型就像是一个集合一样。通过使用分布式条件类型，我们能轻易地进行集合之间的运算，比如交集：

```typescript
type Intersection<A, B> = A extends B ? A : never;

type IntersectionRes = Intersection<1 | 2 | 3, 2 | 3 | 4>; // 2 | 3
```

进一步的，当联合类型的组成是一个对象的属性名（`keyof IObject`），此时对这样的两个类型集合进行处理，得到属性名的交集，那我们就可以在此基础上获得两个对象类型结构的交集。除此以外，还有许多相对复杂的场景可以降维到类型集合，即联合类型的层面，然后我们就可以愉快地使用分布式条件类型进行各种处理了。关于类型层面的集合运算、对象结构集合运算，我们都会在小册的后续章节有详细的讲解。

## 总结与预告

在这一节，我们详细地解读了条件类型这一重要类型工具的使用方式、使用场景、分布式特性以及 infer 关键字。对于条件类型最核心的部分，即 extends 所代表的类型兼容性，由于在上一节我们已经了解了整个 TypeScript 类型系统的类型层级，因此在实际学习时其实基本没有什么压力，毕竟你已经参透了它最基础的运行规则。而对于 infer 关键字的使用，除了我们已经了解的，在函数结构、对象结构、数组结构等不同结构中的使用以外，请你不妨再试试它在更复杂场景下的使用，感受一下模式匹配的魅力。

在下一节，我们会开始探秘 TypeScript 内置的工具类型，看看它们是如何设计，以及又是用来解决什么问题的，并且思考如何让它们变得更完善。而在更后面，我们会了解更多类型系统的知识与更复杂的工具类型实现，欢迎与我一起深入类型编程的世界。

## 扩展阅读：IsAny 与 IsUnknown

上面我们通过比较 hack 的手段得到了 IsNever，那你一定会想是否能实现 IsAny 与 IsUnknown ？当然可以，只不过它们的实现稍微复杂一些，并且并不完全依赖分布式条件类型。

首先是 IsAny，上面已经提到我们并不能通过 `any extends Type` 这样的形式来判断一个类型是否是 any 。而是要利用 any 的另一个特性：身化万千：

```typescript
type IsAny<T> = 0 extends 1 & T ? true : false;
```

`0 extends 1` 必然是不成立的，而交叉类型 `1 & T` 也非常奇怪，它意味着同时符合字面量类型 1 和另一个类型 T 。在学习交叉类型时我们已经了解，对于 1 这样的字面量类型，只有传入其本身、对应的原始类型、包含其本身的联合类型，才能得到一个有意义的值，并且这个值一定只可能是它本身：

```typescript
type Tmp1 = 1 & (0 | 1); // 1
type Tmp2 = 1 & number; // 1
type Tmp3 = 1 & 1; // 1
```

这是因为交叉类型**就像短板效应一样，其最终计算的类型是由最短的那根木板**，也就是最精确的那个类型决定的。这样看，无论如何 `0 extends 1` 都不会成立。

但作为代表任意类型的 any ，它的存在就像是开天辟地的基本规则一样，如果交叉类型的其中一个成员是 any，那短板效应就失效了，此时最终类型必然是 any 。

```typescript
type Tmp4 = 1 & any; // any
```

而对于 unknown 并不能享受到这个待遇，因为它并不是“身化万千”的：

```typescript
type Tmp5 = 1 & unknown; // 1
```

因此，我们并不能用这个方式来写 IsUnknown。其实现过程要更复杂一些，我们需要过滤掉其他全部的类型来只剩下 unknown 。这里直接看实现：

```typescript
type IsUnknown<T> = IsNever<T> extends false
  ? T extends unknown
    ? unknown extends T
      ? IsAny<T> extends false
        ? true
        : false
      : false
    : false
  : false;
```

首先过滤掉 never 类型，然后对于 `T extends unknown` 和 `unknown extends T`，只有 any 和 unknown 类型能够同时符合（还记得我们在类型层级一节进行的尝试吗？），如果再过滤掉 any，那肯定就只剩下 unknown 类型啦。

更新：感谢评论区 [红花绿叶肉夹馍](https://juejin.cn/user/4459274891701224) 同学的指出，这里的 IsUnknown 类型其实可以使用更简单的方式实现。利用 `unknown extends T` 时仅有 T 为 any 或 unknown 时成立这一点，我们可以直接将类型收窄到 any 与 unknown，然后在去掉 any 类型时，我们仍然可以利用上面的身化万千特性：

```typescript
type IsUnknown<T> = unknown extends T
  ? IsAny<T> extends true
    ? false
    : true
  : false;
```