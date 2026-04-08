如果说类型系统是 TypeScript 中的重要基础知识，那么类型层级就是类型系统中的重要概念之一。对于没有类型语言经验学习的同学，说类型层级是最重要的基础概念也不为过。

类型层级一方面能帮助我们明确各种类型的层级与兼容性，而兼容性问题往往就是许多类型错误产生的原因。另一方面，类型层级也是我们后续学习条件类型必不可少的前置知识。我也建议你能同时学习这两篇内容，遇到不理解、不熟悉的地方可以多看几遍。

类型层级实际上指的是，**TypeScript 中所有类型的兼容关系，从最上面一层的 any 类型，到最底层的 never 类型。那么，从上至下的类型兼容关系到底长什么样呢？** 这一节，我们就从原始类型变量和字面量类型开始比较，分别向上、向下延伸，依次把这些类型串起来形成层级链，让你能够构建出 TypeScript 的整个类型体系。

> 本节代码见：[Type Levels](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Flinbudu599%2FTypeScript-Tiny-Book%2Ftree%2Fmain%2Fpackages%2F08-type-levels)

## 判断类型兼容性的方式

在开始前，我们需要先了解一下如何直观地判断两个类型的兼容性。本节中我们主要使用条件类型来判断类型兼容性，类似这样：

```typescript
type Result = 'linbudu' extends string ? 1 : 2;
```

如果返回 1，则说明 `'linbudu'` 为 string 的子类型。否则，说明不成立。但注意，不成立并不意味着 string 就是 `'linbudu'` 的子类型了。还有一种备选的，通过赋值来进行兼容性检查的方式，其大致使用方式是这样的：

```typescript
declare let source: string;

declare let anyType: any;
declare let neverType: never;

anyType = source;

// 不能将类型“string”分配给类型“never”。
neverType = source;
```

对于变量 a = 变量 b，如果成立，意味着 `<变量 b 的类型> extends <变量 a 的类型>` 成立，即 **b 类型是 a 类型的子类型**，在这里即是 `string extends never` ，这明显是不成立的。

觉得不好理解？那可以试着这么想，我们有一个“狗”类型的变量，还有两个分别是“柯基”类型与“橘猫”类型的变量。

- 狗 = 柯基，意味着将柯基作为狗，这是没问题的。
- 狗 = 橘猫，很明显不对，程序对“狗”这个变量的使用，都建立在它是一个“狗”类型的基础上，你给个猫，让后面咋办？

这两种判断方式并没有明显的区别，只在使用场景上略有差异。在需要判断多个类型的层级时，条件类型更为直观，而如果只是两个类型之间的兼容性判断时，使用类型声明则更好理解一些，你可以依据自己的习惯来进行选择。

## 从原始类型开始

了解了类型兼容性判断的方式后，我们就可以开始探讨类型层级了。首先，我们从原始类型、对象类型（后文统称为基础类型）和它们对应的字面量类型开始。

```typescript
type Result1 = "linbudu" extends string ? 1 : 2; // 1
type Result2 = 1 extends number ? 1 : 2; // 1
type Result3 = true extends boolean ? 1 : 2; // 1
type Result4 = { name: string } extends object ? 1 : 2; // 1
type Result5 = { name: 'linbudu' } extends object ? 1 : 2; // 1
type Result6 = [] extends object ? 1 : 2; // 1
```

很明显，一个基础类型和它们对应的字面量类型必定存在父子类型关系。严格来说，object 出现在这里并不恰当，因为它实际上代表着**所有非原始类型的类型，即数组、对象与函数类型**，所以这里 Result6 成立的原因即是`[]`这个字面量类型也可以被认为是 object 的字面量类型。我们将结论简记为，**字面量类型 < 对应的原始类型**。

接下来，我们就从这个原始类型与字面量出发，向上、向下去探索类型层级。

## 向上探索，直到穹顶之上

### 联合类型

我们之前讲过，在联合类型中，只需要符合其中一个类型，我们就可以认为实现了这个联合类型，用条件类型表达是这样的：

```typescript
type Result7 = 1 extends 1 | 2 | 3 ? 1 : 2; // 1
type Result8 = 'lin' extends 'lin' | 'bu' | 'du' ? 1 : 2; // 1
type Result9 = true extends true | false ? 1 : 2; // 1
```

在这一层面上，并不需要联合类型的**所有成员均为字面量类型**，或者**字面量类型来自于同一基础类型**这样的前提，只需要这个类型存在于联合类型中。

对于原始类型，联合类型的比较其实也是一致的：

```typescript
type Result10 = string extends string | false | number ? 1 : 2; // 1
```

结论：**字面量类型 < 包含此字面量类型的联合类型，原始类型 < 包含此原始类型的联合类型。**

而如果一个联合类型由同一个基础类型的类型字面量组成，那这个时候情况又有点不一样了。既然你的所有类型成员都是字符串字面量类型，那你岂不就是我 string 类型的小弟？如果你的所有类型成员都是对象、数组字面量类型或函数类型，那你岂不就是我 object 类型的小弟？

```typescript
type Result11 = 'lin' | 'bu' | 'budu' extends string ? 1 : 2; // 1
type Result12 = {} | (() => void) | [] extends object ? 1 : 2; // 1
```

结论：**同一基础类型的字面量联合类型 < 此基础类型。**

合并一下结论，去掉比较特殊的情况，我们得到了这个最终结论：**字面量类型 < 包含此字面量类型的联合类型（同一基础类型） < 对应的原始类型**，即：

```typescript
// 2
type Result13 = 'linbudu' extends 'linbudu' | '599'
  ? 'linbudu' | '599' extends string
    ? 2
    : 1
  : 0;
```

对于这种嵌套的联合类型，我们这里直接观察最后一个条件语句的结果即可，因为如果所有条件语句都成立，那结果就是最后一个条件语句为真时的值。另外，由于联合类型实际上是一个比较特殊的存在，大部分类型都存在至少一个联合类型作为其父类型，因此在后面我们不会再体现联合类型。

现在，我们关注的类型变成了基础类型，即 string 与 object 这一类。

### 装箱类型

在「原始类型与对象类型」一节中，我们已经讲到了 JavaScript 中装箱对象 String 在 TypeScript 中的体现： String 类型，以及在原型链顶端傲视群雄的 Object 对象与 Object 类型。

很明显，string 类型会是 String 类型的子类型，String 类型会是 Object 类型的子类型，那中间还有吗？还真有，而且你不一定能猜到。我们直接看从 string 到 Object 的类型层级：

```typescript
type Result14 = string extends String ? 1 : 2; // 1
type Result15 = String extends {} ? 1 : 2; // 1
type Result16 = {} extends object ? 1 : 2; // 1
type Result18 = object extends Object ? 1 : 2; // 1
```

这里看着像是混进来一个很奇怪的东西，`{}` 不是 object 的字面量类型吗？为什么能在这里比较，并且 String 还是它的子类型？

这时请回忆我们在结构化类型系统中一节学习到的概念，假设我们把 String 看作一个普通的对象，上面存在一些方法，如：

```typescript
interface String {
  replace: // ...
  replaceAll: // ...
  startsWith: // ...
  endsWith: // ...
  includes: // ...
}
```

这个时候，是不是能看做 String 继承了 `{}` 这个空对象，然后自己实现了这些方法？当然可以！**在结构化类型系统的比较下，String 会被认为是 `{}` 的子类型**。这里从 `string < {} < object` 看起来构建了一个类型链，但实际上 `string extends object` 并不成立：

```typescript
type Tmp = string extends object ? 1 : 2; // 2
```

由于结构化类型系统这一特性的存在，我们能得到一些看起来矛盾的结论：

```typescript
type Result16 = {} extends object ? 1 : 2;
type Result18 = object extends {} ? 1 : 2;

type Result17 = object extends Object ? 1 : 2;
type Result20 = Object extends object ? 1 : 2;

type Result19 = Object extends {} ? 1 : 2;
type Result21 = {} extends Object ? 1 : 2;
```

16-18 和 19-21 这两对，为什么无论如何判断都成立？难道说明 `{}` 和 object 类型相等，也和 `Object` 类型一致？

当然不，这里的 `{} extends `和 `extends {}` 实际上是两种完全不同的比较方式。`{} extends object` 和 `{} extends Object` 意味着， `{}` 是 object 和 Object 的字面量类型，是从**类型信息的层面**出发的，即**字面量类型在基础类型之上提供了更详细的类型信息**。`object extends {}` 和 `Object extends {}` 则是从**结构化类型系统的比较**出发的，即 `{}` 作为一个一无所有的空对象，几乎可以被视作是所有类型的基类，万物的起源。如果混淆了这两种类型比较的方式，就可能会得到 `string extends object` 这样的错误结论。

而 `object extends Object` 和 `Object extends object` 这两者的情况就要特殊一些，它们是因为“系统设定”的问题，Object 包含了所有除 Top Type 以外的类型（基础类型、函数类型等），object 包含了所有非原始类型的类型，即数组、对象与函数类型，这就导致了你中有我、我中有你的神奇现象。

在这里，我们暂时只关注从类型信息层面出发的部分，即结论为：**原始类型 < 原始类型对应的装箱类型 < Object 类型。**

现在，我们关注的类型为 Object 。

### Top Type

再往上，我们就到达了类型层级的顶端（是不是很快），这里只有 any 和 unknown 这两兄弟。我们在[探秘内置类型：any、unknown 与 never](https://juejin.cn/book/7086408430491172901/section/7100487738020855811) 一节中已经了解，any 与 unknown 是系统中设定为 Top Type 的两个类型，它们无视一切因果律，是类型世界的规则产物。因此， Object 类型自然会是 any 与 unknown 类型的子类型。

```typescript
type Result22 = Object extends any ? 1 : 2; // 1
type Result23 = Object extends unknown ? 1 : 2; // 1
```

但如果我们把条件类型的两端对调一下呢？

```typescript
type Result24 = any extends Object ? 1 : 2; // 1 | 2
type Result25 = unknown extends Object ? 1 : 2; // 2
```

你会发现，any 竟然调过来，值竟然变成了 `1 | 2`？我们再多试几个看看：

```typescript
type Result26 = any extends 'linbudu' ? 1 : 2; // 1 | 2
type Result27 = any extends string ? 1 : 2; // 1 | 2
type Result28 = any extends {} ? 1 : 2; // 1 | 2
type Result29 = any extends never ? 1 : 2; // 1 | 2
```

是不是感觉匪夷所思？实际上，还是因为“系统设定”的原因。any 代表了任何可能的类型，当我们使用 `any extends` 时，它包含了“**让条件成立的一部分**”，以及“**让条件不成立的一部分**”。而从实现上说，在 TypeScript 内部代码的条件类型处理中，如果接受判断的是 any，那么会直接**返回条件类型结果组成的联合类型**。

因此 `any extends string` 并不能简单地认为等价于以下条件类型：

```typescript
type Result30 = ("I'm string!" | {}) extends string ? 1 : 2; // 2
```

这种情况下，由于联合类型的成员并非均是字符串字面量类型，条件显然不成立。

在前面学习 any 类型时，你可能也感受到了奇怪之处，在赋值给其他类型时，any来者不拒，而 unknown 则只允许赋值给 unknown 类型和 any 类型，这也是由于“系统设定”的原因，即 **any 可以表达为任何类型**。你需要我赋值给这个变量？那我现在就是这个变量的子类型了，我是不是很乖巧？

另外，any 类型和 unknown 类型的比较也是互相成立的：

```typescript
type Result31 = any extends unknown ? 1 : 2;  // 1
type Result32 = unknown extends any ? 1 : 2;  // 1
```

虽然还是存在系统设定的部分，但我们仍然只关注类型信息层面的层级，即结论为：**Object < any / unknown**。而到这里，我们已经触及了类型世界的最高一层，接下来我们再回到字面量类型，只不过这一次我们要向下探索了。

## 向下探索，直到万物虚无

向下地探索其实就简单多了，首先我们能确认一定有个 never 类型，因为它代表了“虚无”的类型，一个根本不存在的类型。对于这样的类型，它会是任何类型的子类型，当然也包括字面量类型：

```typescript
type Result33 = never extends 'linbudu' ? 1 : 2; // 1
```

但你可能又想到了一些特别的部分，比如 null、undefined、void。

```typescript
type Result34 = undefined extends 'linbudu' ? 1 : 2; // 2
type Result35 = null extends 'linbudu' ? 1 : 2; // 2
type Result36 = void extends 'linbudu' ? 1 : 2; // 2
```

上面三种情况当然不应该成立。别忘了在 TypeScript 中，void、undefined、null 都是**切实存在、有实际意义的类型**，它们和 string、number、object 并没有什么本质区别。

> 我们在此前了解过，关闭 `--strictNullCheckes` 的情况下，null 会被视为 string 等类型的子类型。但正常情况下我们不会这么做，因此这里不做讨论，而是将其视为与 string 等类型同级的一个类型。

因此，这里我们得到的结论是，**never < 字面量类型**。这就是类型世界的最底层，有点像我的世界那样，当你挖穿地面后，出现的是一片茫茫的空白与虚无。

那现在，我们可以开始组合整个类型层级了。

## 类型层级链

结合我们上面得到的结论，可以书写出这样一条类型层级链：

```typescript
type TypeChain = never extends 'linbudu'
  ? 'linbudu' extends 'linbudu' | '599'
  ? 'linbudu' | '599' extends string
  ? string extends String
  ? String extends Object
  ? Object extends any
  ? any extends unknown
  ? unknown extends any
  ? 8
  : 7
  : 6
  : 5
  : 4
  : 3
  : 2
  : 1
  : 0
```

其返回的结果为 8 ，也就意味着所有条件均成立。当然，结合上面的结构化类型系统与类型系统设定，我们还可以构造出一条更长的类型层级链：

```typescript
type VerboseTypeChain = never extends 'linbudu'
  ? 'linbudu' extends 'linbudu' | 'budulin'
  ? 'linbudu' | 'budulin' extends string
  ? string extends {}
  ? string extends String
  ? String extends {}
  ? {} extends object
  ? object extends {}
  ? {} extends Object
  ? Object extends {}
  ? object extends Object
  ? Object extends object
  ? Object extends any
  ? Object extends unknown
  ? any extends unknown
  ? unknown extends any
  ? 8
  : 7
  : 6
  : 5
  : 4
  : 3
  : 2
  : 1
  : 0
  : -1
  : -2
  : -3
  : -4
  : -5
  : -6
  : -7
  : -8
```

结果仍然为 8 。

## 其他比较场景

除了我们上面提到的类型比较，其实还存在着一些比较情况，我们稍作补充。

- 对于基类和派生类，通常情况下**派生类会完全保留基类的结构**，而只是自己新增新的属性与方法。在结构化类型的比较下，其类型自然会存在子类型关系。更不用说派生类本身就是 extends 基类得到的。

- 联合类型的判断，前面我们只是判断联合类型的单个成员，那如果是多个成员呢？

  ```typescript
  type Result36 = 1 | 2 | 3 extends 1 | 2 | 3 | 4 ? 1 : 2; // 1
  type Result37 = 2 | 4 extends 1 | 2 | 3 | 4 ? 1 : 2; // 1
  type Result38 = 1 | 2 | 5 extends 1 | 2 | 3 | 4 ? 1 : 2; // 2
  type Result39 = 1 | 5 extends 1 | 2 | 3 | 4 ? 1 : 2; // 2
  ```

  实际上，对于联合类型地类型层级比较，我们只需要比较**一个联合类型是否可被视为另一个联合类型的子集**，即**这个联合类型中所有成员在另一个联合类型中都能找到**。

- 数组和元组

  数组和元组是一个比较特殊的部分，我们直接来看例子：

  ```typescript
  type Result40 = [number, number] extends number[] ? 1 : 2; // 1
  type Result41 = [number, string] extends number[] ? 1 : 2; // 2
  type Result42 = [number, string] extends (number | string)[] ? 1 : 2; // 1
  type Result43 = [] extends number[] ? 1 : 2; // 1
  type Result44 = [] extends unknown[] ? 1 : 2; // 1
  type Result45 = number[] extends (number | string)[] ? 1 : 2; // 1
  type Result46 = any[] extends number[] ? 1 : 2; // 1
  type Result47 = unknown[] extends number[] ? 1 : 2; // 2
  type Result48 = never[] extends number[] ? 1 : 2; // 1
  ```

  我们一个个来讲解：

  - 40，这个元组类型实际上能确定其内部成员全部为 number 类型，因此是 `number[]` 的子类型。而 41 中混入了别的类型元素，因此认为不成立。
  - 42混入了别的类型，但其判断条件为 `(number | string)[]` ，即其成员需要为 number 或 string 类型。
  - 43的成员是未确定的，等价于 `never[] extends number[]`，44 同理。
  - 45类似于41，即可能存在的元素类型是符合要求的。
  - 46、47，还记得身化万千的 any 类型和小心谨慎的 unknown 类型嘛？
  - 48，类似于 43、44，由于 never 类型本就位于最下方，这里显然成立。只不过 `never[]` 类型的数组也就无法再填充值了。

## 总结与预告

在这一节，我们从一个原始类型开始构造类型层级链，向上触及了 Top Type，向下也见到了 Bottom Type。而在构造过程中，除了父子类型，我们还了解了**联合类型的子类型判定**、**基于结构化类型系统的子类型判定**、**基于类型系统基本规则**的子类型判定，基本包括了会见到的各种特殊情况。

基础的类型层级可以用以下这张图表示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8459e958e581479faa284390e3c6a09c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

而学习了类型层级以后，下一节的条件类型学习起来就简单多了。但条件类型中可不仅仅是类型层级，我们还要见识 infer 关键字、分布式条件类型等新朋友，可别完全掉以轻心，它们同样是类型编程中具有一定难度的概念。