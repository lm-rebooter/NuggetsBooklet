此前我们学习基础类型标注、字面量类型与枚举、函数与 Class 等概念时，实际上一直在用 JavaScript 的概念来进行映射，或者说这可以看作是 JavaScript 代码到 TypeScript 代码的第一步迁移。而这一节，我们要学习的则是，**如何使用 TypeScript 提供的内置类型在类型世界里获得更好的编程体验**。

首先是内置的可用于标注的类型，包括 any、unknown 与 never，加上这一部分我们就掌握了 TypeScript 中所有的内置类型标注。然后是类型断言这一重要能力，我们会介绍它的正确使用场景、双重断言与非空断言等，以及类型断言的幕后原理——类型层级。

这一节是全新的知识，JavaScript 中基本没有类似的概念。但你也不用担心，我们会一步一步从 0 开始学习，让你顺利进入类型编程的世界。

> 本节代码见：[Any & Unknown & Never](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Flinbudu599%2FTypeScript-Tiny-Book%2Ftree%2Fmain%2Fpackages%2F04-any-unknown-never)

## 内置类型：any 、unknown 与 never

有些时候，我们的 TS 代码并不需要十分精确严格的类型标注。比如 console.log 方法就能够接受任意类型的参数，不管你是数组、字符串、对象或是其他的，统统来者不拒。那么，我们难道要把所有类型用联合类型串起来？

这当然不现实，为了能够表示“任意类型”，TypeScript 中提供了一个内置类型 any ，来表示所谓的任意类型。此时我们就可以使用 any 作为参数的类型：

```typescript
log(message?: any, ...optionalParams: any[]): void
```

在这里，一个被标记为 any 类型的参数可以接受任意类型的值。除了 message 是 any 以外，optionalParams 作为一个 rest 参数，也使用 `any[]` 进行了标记，这就意味着你可以使用任意类型的任意数量类型来调用这个方法。除了显式的标记一个变量或参数为 any，在某些情况下你的变量/参数也会被隐式地推导为 any。比如使用 let 声明一个变量但不提供初始值，以及不为函数参数提供类型标注：

```typescript
// any
let foo;

// foo、bar 均为 any
function func(foo, bar){}
```

以上的函数声明在 tsconfig 中启用了 `noImplicitAny` 时会报错，你可以显式为这两个参数指定 any 类型，或者暂时关闭这一配置（不推荐）。而 any 类型的变量几乎无所不能，它可以在声明后再次接受任意类型的值，同时可以被赋值给任意其它类型的变量：

```typescript
// 被标记为 any 类型的变量可以拥有任意类型的值
let anyVar: any = "linbudu";

anyVar = false;
anyVar = "linbudu";
anyVar = {
  site: "juejin"
};

anyVar = () => { }

// 标记为具体类型的变量也可以接受任何 any 类型的值
const val1: string = anyVar;
const val2: number = anyVar;
const val3: () => {} = anyVar;
const val4: {} = anyVar;
```

你可以在 any 类型变量上任意地进行操作，包括赋值、访问、方法调用等等，此时可以认为类型推导与检查是被完全禁用的：

```typescript
let anyVar: any = null;

anyVar.foo.bar.baz();
anyVar[0][1][2].prop1;
```

而 any 类型的主要意义，其实就是为了表示一个**无拘无束的“任意类型”，它能兼容所有类型，也能够被所有类型兼容**。这一作用其实也意味着类型世界给你开了一个外挂，无论什么时候，你都可以使用 any 类型跳过类型检查。当然，运行时出了问题就需要你自己负责了。

> any 的本质是类型系统中的顶级类型，即 Top Type，这是许多类型语言中的重要概念，我们会在类型层级部分讲解。

any 类型的万能性也导致我们经常滥用它，比如类型不兼容了就 any 一下，类型不想写了也 any 一下，不确定可能会是啥类型还是 any 一下。此时的 TypeScript 就变成了令人诟病的 AnyScript。为了避免这一情况，我们要记住以下使用小 tips ：

- 如果是类型不兼容报错导致你使用 any，考虑用类型断言替代，我们下面就会开始介绍类型断言的作用。
- 如果是类型太复杂导致你不想全部声明而使用 any，考虑将这一处的类型去断言为你需要的最简类型。如你需要调用 `foo.bar.baz()`，就可以先将 foo 断言为一个具有 bar 方法的类型。
- 如果你是想表达一个未知类型，更合理的方式是使用 unknown。

unknown 类型和 any 类型有些类似，一个 unknown 类型的变量可以再次赋值为任意其它类型，但只能赋值给 any 与 unknown 类型的变量：

```typescript
let unknownVar: unknown = "linbudu";

unknownVar = false;
unknownVar = "linbudu";
unknownVar = {
  site: "juejin"
};

unknownVar = () => { }

const val1: string = unknownVar; // Error
const val2: number = unknownVar; // Error
const val3: () => {} = unknownVar; // Error
const val4: {} = unknownVar; // Error

const val5: any = unknownVar;
const val6: unknown = unknownVar;
```

unknown 和 any 的一个主要差异体现在赋值给别的变量时，any 就像是 **“我身化万千无处不在”** ，所有类型都把它当自己人。而 unknown 就像是 **“我虽然身化万千，但我坚信我在未来的某一刻会得到一个确定的类型”** ，只有 any 和 unknown 自己把它当自己人。简单地说，any 放弃了所有的类型检查，而 unknown 并没有。这一点也体现在对 unknown 类型的变量进行属性访问时：

```typescript
let unknownVar: unknown;

unknownVar.foo(); // 报错：对象类型为 unknown
```

要对 unknown 类型进行属性访问，需要进行类型断言（别急，马上就讲类型断言！），即“虽然这是一个未知的类型，但我跟你保证它在这里就是这个类型！”：

```typescript
let unknownVar: unknown;

(unknownVar as { foo: () => {} }).foo();
```

在类型未知的情况下，更推荐使用 unknown 标注。这相当于你使用额外的心智负担保证了类型在各处的结构，后续重构为具体类型时也可以获得最初始的类型信息，同时还保证了类型检查的存在。当然，unknown 用起来很麻烦，一堆类型断言写起来可不太好看。归根结底，到底用哪个完全取决于你自己，毕竟语言只是工具嘛。

如果说，any 与 unknown 是比原始类型、对象类型等更广泛的类型，也就是说它们更上层一些，就像 string 字符串类型比 `'linbudu'` 字符串字面量更上层一些，即 any/unknown -> 原始类型、对象类型 -> 字面量类型。那么，**是否存在比字面量类型更底层一些的类型**？

这里的上层与底层，其实即意味着包含类型信息的多少。any 类型包括了任意的类型，字符串类型包括任意的字符串字面量类型，而字面量类型只表示一个精确的值类型。如要还要更底层，也就是再少一些类型信息，那就只能什么都没有了。

而内置类型 never 就是这么一个“什么都没有”的类型。此前我们已经了解了另一个“什么都没有”的类型，void。但相比于 void ，never 还要更加空白一些。

### 虚无的 never 类型

是不是有点不好理解？我们看一个联合类型的例子就能 get 到一些了。

```typescript
type UnionWithNever = "linbudu" | 599 | true | void | never;
```

将鼠标悬浮在类型别名之上，你会发现这里显示的类型是`"linbudu" | 599 | true | void`。never 类型被直接无视掉了，而 void 仍然存在。这是因为，void 作为类型表示一个空类型，就像没有返回值的函数使用 void 来作为返回值类型标注一样，void 类型就像 JavaScript 中的 null 一样代表“这里有类型，但是个空类型”。

而 never 才是一个“什么都没有”的类型，它甚至不包括空的类型，严格来说，**never 类型不携带任何的类型信息**，因此会在联合类型中被直接移除，比如我们看 void 和 never 的类型兼容性：

```typescript
declare let v1: never;
declare let v2: void;

v1 = v2; // X 类型 void 不能赋值给类型 never

v2 = v1;
```

在编程语言的类型系统中，never 类型被称为 **Bottom Type**，是**整个类型系统层级中最底层的类型**。和 null、undefined 一样，它是所有类型的子类型，但只有 never 类型的变量能够赋值给另一个 never 类型变量。

通常我们不会显式地声明一个 never 类型，它主要被类型检查所使用。但在某些情况下使用 never 确实是符合逻辑的，比如一个只负责抛出错误的函数：

```typescript
function justThrow(): never {
  throw new Error()
}
```

在类型流的分析中，一旦一个返回值类型为 never 的函数被调用，那么下方的代码都会被视为无效的代码（即无法执行到）：

```typescript
function justThrow(): never {
  throw new Error()
}

function foo (input:number){
  if(input > 1){
    justThrow();
    // 等同于 return 语句后的代码，即 Dead Code
    const name = "linbudu";
  }
}
```

我们也可以显式利用它来进行类型检查，即上面在联合类型中 never 类型神秘消失的原因。假设，我们需要对一个联合类型的每个类型分支进行不同处理：

```typescript
declare const strOrNumOrBool: string | number | boolean;

if (typeof strOrNumOrBool === "string") {
  console.log("str!");
} else if (typeof strOrNumOrBool === "number") {
  console.log("num!");
} else if (typeof strOrNumOrBool === "boolean") {
  console.log("bool!");
} else {
  throw new Error(`Unknown input type: ${strOrNumOrBool}`);
}
```

如果我们希望这个变量的每一种类型都需要得到妥善处理，在最后可以抛出一个错误，但这是运行时才会生效的措施，是否能在类型检查时就分析出来？

实际上，由于 TypeScript 强大的类型分析能力，每经过一个 if 语句处理，`strOrNumOrBool` 的类型分支就会减少一个（因为已经被对应的 typeof 处理过）。而在最后的 else 代码块中，它的类型只剩下了 never 类型，即一个无法再细分、本质上并不存在的虚空类型。在这里，我们可以利用 never 类型变量仅能赋值给 never 类型变量的特性，来巧妙地分支处理检查：

```typescript
if (typeof strOrNumOrBool === "string") {
    // 一定是字符串！
  strOrNumOrBool.charAt(1);
} else if (typeof strOrNumOrBool === "number") {
  strOrNumOrBool.toFixed();
} else if (typeof strOrNumOrBool === "boolean") {
  strOrNumOrBool === true;
} else {
  const _exhaustiveCheck: never = strOrNumOrBool;
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`);
}
```

假设某个粗心的同事新增了一个类型分支，`strOrNumOrBool` 变成了 `strOrNumOrBoolOrFunc`，却忘记新增对应的处理分支，此时在 else 代码块中就会出现将 Function 类型赋值给 never 类型变量的类型错误。这实际上就是利用了类型分析能力与 never 类型只能赋值给 never 类型这一点，来确保联合类型变量被妥善处理。

前面我们提到了主动使用 never 类型的两种方式，而 never 其实还会在某些情况下不请自来。比如说，你可能遇到过这样的类型错误：

```typescript
const arr = [];

arr.push("linbudu"); // 类型“string”的参数不能赋给类型“never”的参数。
```

此时这个未标明类型的数组被推导为了 `never[]` 类型，这种情况仅会在你启用了 `strictNullChecks` 配置，同时禁用了 `noImplicitAny` 配置时才会出现。解决的办法也很简单，为这个数组声明一个具体类型即可。关于这两个配置的具体作用，我们会在后面有详细的介绍。

在这一部分，我们了解了 TypeScript 中 **Top Type**(any / unknown) 与 **Bottom Type**（never）它们的表现。在讲 any 的时候，我们在小 tips 中提到，可以使用类型断言来避免对 any 类型的滥用。那么接下来，我们就来学习类型断言这一概念。

## 类型断言：警告编译器不准报错

类型断言能够显式告知类型检查程序当前这个变量的类型，可以进行类型分析地修正、类型。它其实就是一个将变量的已有类型更改为新指定类型的操作，它的基本语法是 `as NewType`，你可以将 any / unknown 类型断言到一个具体的类型：

```typescript
let unknownVar: unknown;

(unknownVar as { foo: () => {} }).foo();
```

还可以 as 到 any 来为所欲为，跳过所有的类型检查：

```typescript
const str: string = "linbudu";

(str as any).func().foo().prop;
```

也可以在联合类型中断言一个具体的分支：

```typescript
function foo(union: string | number) {
  if ((union as string).includes("linbudu")) { }

  if ((union as number).toFixed() === '599') { }
}
```

但是类型断言的正确使用方式是，在 TypeScript 类型分析不正确或不符合预期时，将其断言为此处的正确类型：

```typescript
interface IFoo {
  name: string;
}

declare const obj: {
  foo: IFoo
}

const {
  foo = {} as IFoo
} = obj
```

这里从 `{}` 字面量类型断言为了 `IFoo` 类型，即为解构赋值默认值进行了预期的类型断言。当然，更严谨的方式应该是定义为 `Partial<IFoo>` 类型，即 IFoo 的属性均为可选的。

除了使用 as 语法以外，你也可以使用 `<>` 语法。它虽然书写更简洁，但效果一致，只是在 TSX 中尖括号断言并不能很好地被分析出来。你也可以通过 TypeScript ESLint 提供的 [`consistent-type-assertions`](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftypescript-eslint%2Ftypescript-eslint%2Fblob%2Fmain%2Fpackages%2Feslint-plugin%2Fdocs%2Frules%2Fconsistent-type-assertions.md) 规则来约束断言风格。

需要注意的是，类型断言应当是在迫不得己的情况下使用的。虽然说我们可以用类型断言纠正不正确的类型分析，但类型分析在大部分场景下还是可以智能地满足我们需求的。

总的来说，在实际场景中，还是 `as any` 这一种操作更多。但这也是让你的代码编程 AnyScript 的罪魁祸首之一，请务必小心使用。

### 双重断言

如果在使用类型断言时，原类型与断言类型之间差异过大，也就是指鹿为马太过离谱，离谱到了指鹿为霸王龙的程度，TypeScript 会给你一个类型报错：

```typescript
const str: string = "linbudu";

// 从 X 类型 到 Y 类型的断言可能是错误的，blabla
(str as { handler: () => {} }).handler()
```

此时它会提醒你先断言到 unknown 类型，再断言到预期类型，就像这样：

```typescript
const str: string = "linbudu";

(str as unknown as { handler: () => {} }).handler();

// 使用尖括号断言
(<{ handler: () => {} }>(<unknown>str)).handler();
```

这是因为你的断言类型和原类型的差异太大，需要先断言到一个通用的类，即 any / unknown。这一通用类型包含了所有可能的类型，因此**断言到它**和**从它断言到另一个类型**差异不大。

### 非空断言

非空断言其实是类型断言的简化，它使用 `!` 语法，即 `obj!.func()!.prop` 的形式标记前面的一个声明一定是非空的（实际上就是剔除了 null 和 undefined 类型），比如这个例子：

```typescript
declare const foo: {
  func?: () => ({
    prop?: number | null;
  })
};

foo.func().prop.toFixed();
```

此时，func 在 foo 中不一定存在，prop 在 func 调用结果中不一定存在，且可能为 null，我们就会收获两个类型报错。如果不管三七二十一地坚持调用，想要解决掉类型报错就可以使用非空断言：

```typescript
foo.func!().prop!.toFixed();
```

其应用位置类似于可选链：

```typescript
foo.func?.().prop?.toFixed();
```

但不同的是，非空断言的运行时仍然会保持调用链，因此在运行时可能会报错。而可选链则会在某一个部分收到 undefined 或 null 时直接短路掉，不会再发生后面的调用。

非空断言的常见场景还有 `document.querySelector`、`Array.find` 方法等：

```typescript
const element = document.querySelector("#id")!;
const target = [1, 2, 3, 599].find(item => item === 599)!;
```

为什么说非空断言是类型断言的简写？因为上面的非空断言实际上等价于以下的类型断言操作：

```typescript
((foo.func as () => ({
  prop?: number;
}))().prop as number).toFixed();
```

怎么样，非空断言是不是简单多了？你可以通过 [`non-nullable-type-assertion-style`](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftypescript-eslint%2Ftypescript-eslint%2Fblob%2Fmain%2Fpackages%2Feslint-plugin%2Fdocs%2Frules%2Fnon-nullable-type-assertion-style.md) 规则来检查代码中是否存在类型断言能够被简写为非空断言的情况。

类型断言还有一种用法是作为代码提示的辅助工具，比如对于以下这个稍微复杂的接口：

```typescript
interface IStruct {
  foo: string;
  bar: {
    barPropA: string;
    barPropB: number;
    barMethod: () => void;
    baz: {
      handler: () => Promise<void>;
    };
  };
}
```

假设你想要基于这个结构随便实现一个对象，你可能会使用类型标注：

```typescript
const obj: IStruct = {};
```

这个时候等待你的是一堆类型报错，你必须规规矩矩地实现整个接口结构才可以。但如果使用类型断言，我们可以在保留类型提示的前提下，不那么完整地实现这个结构：

```typescript
// 这个例子是不会报错的
const obj = <IStruct>{
  bar: {
    baz: {},
  },
};
```

类型提示仍然存在：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa8331c0f2e7484784c442dc822a2c98~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

在你错误地实现结构时仍然可以给到你报错信息：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/533a1b0315934f0fb4e6a831970b71c0~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## 总结与预告

在这一节中，我们学习了 TypeScript 中的内置类型 any、unknown 与 never，包括它们的类型兼容性表现与使用场景。而在另外一部分类型断言中，我们了解了类型断言的基本使用，以及结合内置类型 any 的使用场景。

在下一节，我们会开始对 TypeScript 类型工具的学习，进一步探索 TypeScript 的类型世界，包括类型别名、交叉类型、索引类型、映射类型等等。如果说基础类型是积木，那这些类型工具就是积木工厂？它们在基础类型的基础之上进行类型编程运算如组合、过滤等，得到更贴近你实际需要形状的积木，也带你认识到，原来不止可以对变量进行编程，类型也可以！

## 扩展阅读

### 类型层级初探

这一节的知识点其实都和 TypeScript 的类型层级有所关联，我们会在后面的类型系统部分有专门一节进行详细地讲述，这里只做简单地描述来供有兴趣的同学提前了解。

前面我们已经说到，any 与 unknown 属于 **Top Type**，表现在它们包含了所有可能的类型，而 never 属于 **Bottom Type**，表现在它是一个虚无的、不存在的类型。那么加上此前学习的原始类型与字面量类型等，按照类型的包含来进行划分，我们大概能梳理出这么个类型层级关系。

- 最顶级的类型，any 与 unknown
- 特殊的 Object ，它也包含了所有的类型，但和 Top Type 比还是差了一层
- String、Boolean、Number 这些装箱类型
- 原始类型与对象类型
- 字面量类型，即更精确的原始类型与对象类型嘛，需要注意的是 null 和 undefined 并不是字面量类型的子类型
- 最底层的 never

> 实际上这个层级链并不完全，因为还有联合类型、交叉类型、函数类型的情况，我们会在后面专门有一节进行讲解~

而实际上类型断言的工作原理也和类型层级有关，在判断断言是否成立，即差异是否能接受时，实际上判断的即是这两个类型是否能够找到一个公共的父类型。比如 `{ }` 和 `{ name: string }` 其实可以认为拥有公共的父类型 `{}`（一个新的 `{}`！你可以理解为这是一个基类，参与断言的 `{ }` 和 `{ name: string }` 其实是它的派生类）。

如果找不到具有意义的公共父类型呢？这个时候就需要请出 **Top Type** 了，如果我们把它先断言到 **Top Type**，那么就拥有了公共父类型 **Top Type**，再断言到具体的类型也是同理。你可以理解为先向上断言，再向下断言，比如前面的双重断言可以改写成这样：

```typescript
const str: string = "linbudu";

(str as (string | { handler: () => {} }) as { handler: () => {} }).handler();
```

这一部分的扩展阅读只是为了让你提前意识到类型层级的存在，并不需要完全理解，毕竟我们后面还有一整节会讲类型系统层级呢。