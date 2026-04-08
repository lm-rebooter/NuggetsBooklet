上一节我们介绍了构建相关的 TSConfig 配置，包括源码相关、解析相关、产物相关等几个部分，这一节我们会接着来介绍类型检查与工程相关的 TSConfig。

> 本节代码见：[Project References](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Flinbudu599%2FTypeScript-Tiny-Book%2Ftree%2Fmain%2Fpackages%2F22-project-references%2F)

## 检查相关

这部分的配置主要控制对源码中语法与类型检查的严格程度，这也是导致 TypeScript 项目下限与上限差异巨大的主要原因，检查全开与全关下的 TypeScript 简直就是两门不同的语言。但并不是说检查越严格越好，更好的方式是依据实际需要来调整检查的严格程度，比如小小 demo 就不需要太严格检查啦。

对于推荐使用的配置，我也会在介绍时指出。

### 允许类

这一部分的配置关注的语法通常是有害的，且默认情况下为禁用或者给出警告，因此需要显式通过配置来允许这些有害语法，它们的名称均为 allowXXX 这种形式。

#### allowUmdGlobalAccess

这一配置会允许你直接使用 UMD 格式的模块而不需要先导入，比如你通过 CDN 引入或是任何方式来确保全局一定会有这个变量。而 UMD 格式其实就是通用模块规范，兼容了 AMD 与 CommonJs（通过判断当前环境下哪种规范可用就使用哪种规范），示例如下：

```js
// 源码
export const handler = () => { };

// UMD 编译结果
(function (global, factory) {
    // 尝试使用 CommonJs
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    // 尝试使用 AMD
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
    // 兜底，使用全局变量挂载
    else {
      (global = global || self, global.handle = factory());
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.handler = void 0;
    const handler = () => { };
    exports.handler = handler;
});
```

可以看到，它依次判断了 CommonJS 与 AMD 的情况，并最后使用了全局变量来进行兜底。因此你既可以导入它来使用，也可以直接在全局访问它。

#### allowUnreachableCode

Unreachable Code 通常指的是无法执行到的代码，也称 Dead Code，常见的 Unreachable Code 包括 return 语句、throw 语句以及 `process.exit` 后的代码：

```typescript
function foo() {
  return 599;
  console.log('Dead Code'); // Dead Code
}

function bar() {
  throw new Error('Oops!');
  console.log('Dead Code'); // Dead Code
}
```

allowUnreachableCode 配置的默认值为 undefined，表现为在编译过程中并不会抛出阻止过程的错误，而只是一个警告。它也可以配置为 true（完全允许）与 false （抛出一个错误）。

#### allowUnusedLabels

[Label](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FStatements%2Flabel) 并不是我们经常会接触的概念，它的语法大致是这样：

```js
someLabel:
	statement
```

statement 语句会被标记为 someLabel ，然后在别的地方你就可以用 someLabel 来引用这段语句。如标记一个函数（非严格模式下）：

```js
L: function F() {}
```

如果在一个代码块中使用 label ，效果和对象字面量非常相似：

```js
{
  L: function F() {}
}
```

为了区分 label 与对象字面量，这条规则禁止了声明但没有被实际使用的 label 标记：

```typescript
function verifyAge(age: number) {
  if (age > 18) {
    // Unused label.
    verified: true;
  }
}
```

这段代码实际上想返回一个对象字面量，但却忘记了 return ，导致这里错误地声明了一个 Label。

类似于 allowUnreachableCode，这条配置也可使用 undefined（默认）、true、false 三个值，且效果也一致。

### 禁止类

这部分配置的关注点其实除了类型，也包括实际的代码逻辑，它们主要关注未被妥善处理的逻辑代码与无类型信息（手动标注与自动推导均无）的部分。另外，部分代码逻辑检查实际上 ESLint 也可以提供。

这部分配置的值通常只有 true 或者 false，因此我们在下面只会对存在额外特殊情况的配置值做讲解。

#### 类型检查

##### noImplicitAny

在你没有为变量或参数指定类型，同时 TypeScript 也无法自动推导其类型时，这里变量的类型就会被推导为 any。而推导为 any 类型就意味着丧失了类型检查：

```typescript
function fn(s) {
  console.log(s.includes('linbudu'));
}

fn(42);
fn(true);
fn({});
```

在这个例子中函数 fn 的参数 s 没有声明类型，因而被推导为 any，这就导致你可以使用任意类型的值来调用，这无疑是非常危险的。如果你希望禁止这一类行为，可以启用 noImplicitAny 配置，然后这种由于无类型标注导致的隐式 any 类型推导就会抛出一个错误。当然，你仍然可以显式地标记一个类型为 any，但这时就意味着，**你确实希望它是一个 any 类型**。

##### useUnknownInCatchVariables

启用此配置后，try/catch 语句中 catch 的 error 类型会被更改为 unknown （否则是 any 类型）。这样可以在类型层面确保在 catch 语句中对 error 进行更妥当的处理：

```typescript
try {
  // ...
  // 一个自定义的错误类
  throw new NetworkError();
} catch (err) {
  if (err instanceof NetworkError) {}
  if (err instanceof AuthError) {}
  if (err instanceof CustomError) {}
}
```

#### 逻辑检查

##### noFallthroughCasesInSwitch

这一配置确保在你的 switch case 语句中不会存在连续执行多个 case 语句的情况。注意，连续执行指的是某一个 case 中自己执行了专属逻辑后，由于没有 break / return 语句导致继续向下执行。

```typescript
const a: number = 0;
 
switch (a) {
  case 0:
    console.log("zero");
  case 1:
    console.log("one");
  case 2:
    console.log("two");
    break;
}
```

在这个例子中，case 0、case 1、case 2 的语句都会执行！这是因为在 JavaScript 中，当 switch case 语句执行完毕匹配的那个 case 子句后，如果没有 break 或者 return，就会接着往下执行下一个 case，而不论其条件是否匹配。

##### noImplicitOverride

在函数与 Class 一节我们有讲到，在派生类继承于基类时，通常我们**不希望去覆盖基类已有的方法**（SOLID 原则），这样可以确保在任何需要基类的地方，我们都可以放心地传入一个派生类。

在真的需要覆盖基类方法时，推荐的方式是使用 override 关键字，标明此方法覆盖了基类中的方法。而 `noImplicitOverride` 这一配置的作用，就是避免你在不使用 override 关键字的情况下就覆盖了基类方法。

```typescript
class Base {
  print() { }
}

class Derived1 extends Base {
  override print() {
    // ...
  }
}

class Derived2 extends Base {
  // 错误！没有使用 override 关键字
  print() {
    // ...
  }
}
```

##### noImplicitReturns

这一配置会确保所有返回值类型中不包含 undefined 的函数，在其内部所有的执行路径上都需要有 return 语句：

```typescript
// 函数缺少结束 return 语句，返回类型不包括 "undefined"。
function handle(color: 'blue' | 'black'): string {
  if (color === 'blue') {
    return 'beats';
  } else {
    ('bose');
  }
}
```

我们在 else 分支忘记了 return，这里立刻就给到了一个报错。这一配置可以确保在存在复杂嵌套路径的函数中，所有路径最后都显式执行了 return 。举例来说，假设我们的函数希望先检查一遍参数，如果不符要求就提前返回，此时如果忘记添加 return，会导致后面的逻辑仍然错误执行。

##### noImplicitThis

JavaScript 代码中，我们其实经常见到 this，this 的指向也一直是一个很烦人的问题。虽然在 ES6 占据主导地位的今天，我们通常只会在 Class 内部使用 this，TypeScript 还是为 this 留了一席之地。比如函数与 Class 的方法中，实际上第一个参数是 this：

```typescript
function foo(this: any, name: string) {}
```

这个 this 参数实际上就是函数执行时指向的 this，你可以在实际情况中灵活地指定 this 为具体类型。如果你并不声明 this 类型而是直接访问，就会得到一个错误：

```typescript
function foo(name: string) {
  // "this" 隐式具有类型 "any"，因为它没有类型注释。
  this.name = name;
}
```

这就是 `noImplicitThis` 配置所关注的内容，它确保你在使用 this 语法时一定能够确定 this 的具体类型，当然，你仍然可以使用 any 。

##### noPropertyAccessFromIndexSignature 与 noUncheckedIndexedAccess

在索引类型一节我们知道，可以通过索引签名类型来声明一个仅确定键值类型而不确定具体属性的接口：

```typescript
interface AllStringTypes {
  name: string;
  [key: string]: string;
}

type PropType1 = AllStringTypes['unknownProp']; // string
type PropType2 = AllStringTypes['name']; // string
```

索引类型签名的确可以帮助你快速生成一个随意使用的接口结构，但在某些时候也会带来危险，比如你忘记了检查这个属性是不是真的存在。

这两条配置的功能就是让对基于索引签名类型声明的结构属性访问更安全一些，其中 `noPropertyAccessFromIndexSignature` 配置禁止了对未知属性（如 `'unknownProp'`）的访问，即使它们已在索引类型签名中被隐式声明。而对于具体声明的已知属性访问，如 `name` 则不会有问题。

而 `noUncheckedIndexedAccess` 配置则宽松一些，它会将一个 undefined 类型附加到对未知属性访问的类型结果上，比如 `PropType1` 的类型会是 `string | undefined`，这样能够提醒你在对这个属性进行读写时进行一次空检查。

##### noUnusedLocals 与 noUnusedParameters

是否允许存在**声明但未使用的变量和函数参数**，就像 ESLint 一样，这里就不做介绍了。

### 严格检查

#### exactOptionalPropertyTypes

这一配置会使得 TypeScript 对可选属性（即使用 `?` 修饰的属性）启用更严格检查，如以下这个例子：

```typescript
interface ITheme {
  prefer?: "dark" | "light";
}
```

默认情况下，prefer 属性的类型实际为 `"dark" | "light" | undefined`，也就是说你可以这么做：

```typescript
interface ITheme {
  prefer?: "dark" | "light";
}

declare const theme: ITheme;

theme.prefer = "dark";
theme.prefer = "light";
theme.prefer = undefined;
```

将这个属性设置为 undefined 其实很容易造成困惑，你是希望这个属性被移除掉呢，还是希望表示这个属性目前没有值（这时难道不应该用 null 吗）？

为了避免这一情况，你可以启用 `exactOptionalPropertyTypes` 配置，此时 undefined 不会再被允许作为可选属性的值，除非你显式添加一个 undefined 类型。

```typescript
// 类型 “undefined” 不能分配给“exactOptionalPropertyTypes: true”的类型 “"dark" | "light"”。请考虑将 “undefined” 添加到目标类型。
theme.prefer = undefined;

interface ITheme {
  // 需要这么做才可以
  prefer?: "dark" | "light" | undefined;
}
```

#### alwaysStrict

还记得 ES5 中的严格模式吗？这一配置就是它在 TS 中的体现，alwaysStrict 配置会使得 TS 对所有文件使用严格模式进行检查（表现在会禁用掉一部分语法），同时生成的 js 文件开头也会有 `'use strict'` 标记。

#### strict

strict 其实是一组规则的开关，开启 strict 会默认将这些规则全部启用，包括：

- `alwaysStrict`、`useUnknownInCatchVariables`
- `noFallthroughCasesInSwitch`、`noImplicitAny`、`noImplicitThis`
- `strictNullChecks`、`strictBindCallApply`、`strictFunctionTypes`、`strictPropertyInitialization`

这些规则我们均会在接下来介绍。

#### strictBindCallApply

JavaScript 中可以通过 bind、call、apply 来改变一个函数的 this 指向，绝大部分情况下即使改变了 this 指向，函数的入参也应当是不变的。这条配置会确保在使用 bind、call、apply 方法时，其第二个入参（即**将用于调用原函数的入参**）需要与原函数入参类型保持一致：

```typescript
function fn(x: string) {
  return parseInt(x);
}

const n1 = fn.call(undefined, '10');

// 类型“boolean”的参数不能赋给类型“string”的参数。
const n2 = fn.call(undefined, false);
```

#### strictFunctionTypes

对函数类型启用更严格的检查，即我们在函数类型比较一节中讲到的，对参数类型启用逆变检查。

```typescript
function fn(x: string) {
  console.log('Hello, ' + x.toLowerCase());
}

type StringOrNumberFunc = (ns: string | number) => void;

// 不能将类型“string | number”分配给类型“string”。
let func: StringOrNumberFunc = fn;
```

需要注意的是，对于接口中的函数类型，只有通过 property 形式声明才会接受严格检查，即以下代码不会被检查出错误：

```typescript
type Methodish = {
  func(x: string | number): void;
};
 
function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}
 
const m: Methodish = {
  // 没有对函数参数类型进行逆变检查
  func: fn,
};

// 实际运行将会报错
m.func(10);
```

#### strictNullChecks

**这是在任何规模项目内都应该开启的一条规则**。在这条规则关闭的情况下，null 和 undefined 会被隐式地视为任何类型的子类型，还记得我们前面的例子吗？

```typescript
// 以下两个仅在关闭 strictNullChecks 时成立
const tmp3: string = null;
const tmp4: string = undefined;
```

在某些可能产生 `string | undefined` 类型的方法中，如果关闭了 strictNullChecks 检查，就意味着很可能下面会遇到一个 ***cannot read property 'xxx' of undefined*** 的错误：

```typescript
const matcher: string = "budu";

const list = ['linbudu', '599'];

// 为 string 类型
const target = list.find((u) => u.includes(matcher));

console.log(target.replace('budu', 'wuhu'));
```

在这里，target 的类型应该是 `string | undefined`，下面的 `target.replace` 访问并不一定能成功。但关闭了 strictNullChecks 检查之后，我们就不能及时发现这一点了。

#### strictPropertyInitialization

这一配置要求 Class 中的所有属性都需要存在一个初始值，无论是在声明时就提供还是在构造函数中初始化。

```typescript
class Foo {
  prop1: number = 599;
  prop2: number;
  // 属性“prop3”没有初始化表达式，且未在构造函数中明确赋值。
  prop3: number;

  constructor(public prop4: number) {
    this.prop2 = prop4;
  }
}
```

这条配置有时候也不完全合理，如我们将初始化逻辑放在一个单独函数中：

```typescript
class Foo {
  prop1: number = 599;
  prop2: number;
  // 属性“prop3”没有初始化表达式，且未在构造函数中明确赋值。
  prop3: number;

  constructor(public prop4: number) {
    this.prop2 = prop4;
    this.init();
  }

  init() {
    this.prop3 = 599;
  }
}
```

此时报错仍然存在，但我们其实已经确保了有初始值的存在。这种情况下可以依据实际需要使用非空断言或可选修饰：

```typescript
class Foo {
  prop3!: number;
  _prop3?: number;
}
```

### skipLibCheck 与 skipDefaultLibCheck

默认情况下，TypeScript 会对加载的类型声明文件也进行检查，包括内置的 `lib.d.ts` 系列与 `@types/` 下的声明文件。在某些时候，这些声明文件可能存在冲突，比如两个不同来源的声明文件使用不同的类型声明了一个全局变量。此时，你就可以使用 skipLibCheck 跳过对这些类型声明文件的检查，这也能进一步加快编译速度。

`skipDefaultLibCheck` 类似于 `skipLibCheck` ，但它只会跳过那些使用了 `/// <reference no-default-lib="true"/>` 指令的声明文件（如内置的 `lib.d.ts`），这一三斜线指令的作用即是**将此文件标记为默认库声明**，因此开启这一配置后，编译器在处理其文件时不会再尝试引入默认库声明。

## 工程相关

### Project References

Project References 这一配置使得你可以将整个工程拆分成多个部分，比如你的 UI 部分、Hooks 部分以及主应用等等。这一功能和 Monorepo 非常相似，但它并不需要各个子项目拥有自己独立的 package.json、独立安装依赖、独立构建等。通过 Project References ，我们可以定义这些部分的引用关系，为它们使用独立的 tsconfig 配置。

```json
{
    "compilerOptions": {},
    "references": [
        { "path": "../ui-components" },
        { "path": "../hooks" },
      	{ "path": "../utils" },
    ]
}
```

> 关于具体项目，请参考我们仓库中的示例。

这一特性实际上也让 tsc 不再只是一个编译器了，它现在还可以是一个类似于 lerna 那样的 Script Runner，即在多个子项目之间去确定一条顺序正确的构建链路。也因此，在使用 Project References 的项目中，需要使用 `tsc --build` 而非 `tsc` 来进行构建，此时 tsc 会首先确定整个引用关系图，然后检查上面作为子结点的项目是否是最新构建的，最后才基于引用顺序去构建这些非最新的项目。

我们可以来实际体验一下，假设要构建的项目结构是这样的：

```text
PROJECT
├── app
│   ├── index.ts
│   ├── tsconfig.json
├── core
│   ├── index.ts
│   ├── tsconfig.json
├── ui
│   ├── index.ts
│   ├── tsconfig.json
├── utils
│   ├── index.ts
│   ├── tsconfig.json
├── tsconfig.base.json
```

这四个项目的引用关系是这样的：

```text
app -> core, ui, utils
core -> utils
```

这四个项目可以使用完全独立的 TSConfig 配置，如 utils 的 target 为 ES5，而 app 的 target 则可以是 ESNext ，那么检查配置、功能配置等自然也可以不同。

首先，在 `app/tsconfig.json` 中定义引用关系：

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "baseUrl": ".",
    "outDir": "../dist/app"
  },
  "include": ["./**/*.ts"],
  "references": [
    {
      "path": "../utils"
    },
    {
      "path": "../core"
    },
    {
      "path": "../ui"
    }
  ]
}
```

这里的 outDir 被配置为父级目录，因为我们仍然希望这四个项目的构建产物被放置在同一个文件夹下，你也可以根据自己的实际需要定制。

core 、utils、ui 这三个项目中也是类似：

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "outDir": "../dist/core"
  },
  "include": ["./**/*.ts"],
  "references": [
    {
      "path": "../utils"
    }
  ]
}
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "target": "ES5",
    "module": "commonjs",
    "baseUrl": ".",
    "outDir": "../dist/utils"
  },
  "include": ["./**/*.ts"]
}
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "outDir": "../dist/ui"
  },
  "include": ["./**/*.ts"]
}
```

在 `app/index.ts` 中去引用其余三个项目：

```typescript
import { util } from '../utils';
import { core } from '../core';
import { ui } from '../ui';

export const app = () => {
  ui();
  core();
  util();
  console.log('app!');
};
```

其他三个项目的导出函数也只是一个简单函数，这里就不展示代码了。

现在来执行构建命令：

```bash
tsc --build app
```

> `tsc --build` 命令下无需也不能使用 `--project` 配置，直接指定文件夹即可。

构建后的产物是这样的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad4c509346b84c9e85bc66aaa80af458~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以看到 app 中声明的子项目引用也被一同构建，同时这些子项目的构建产物中会有 `tsconfig.tsbuildinfo` 文件来缓存本次的构建信息。

你也可以在 build 模式下启用监听：

```bash
tsc --build --watch app
```

此时如果你修改一个子项目，tsc 会自动进行增量构建，跳过没有发生变化的项目，只构建那些发生了更改的部分。

另外，如果你在某个项目内通过 Ctrl /Command + 点击的方式跳转到一个导入的实现，你会发现能够直接跳转到这个实现的源码而非类型定义，这同样能帮助你的开发效率 up up！

#### composite

composite 属于 compilerOptions 内部的配置，在 Project References 的被引用子项目 `tsconfig.json` 中必须为启用状态，它通过一系列额外的配置项，确保你的子项目能被 Project References 引用，而在子项目中必须启用 declaration ，必须通过 files 或 includes 声明子项目内需要包含的文件等。

### 兼容性

#### isolatedModules

我们常常提到的，构建过程会使用 TypeScript 配合其他构建器，如 ESBuild、SWC、Babel 等。通常在这个过程中，类型相关的检查会完全交由 TypeScript 处理，因为这些构建器只能执行语法降级与打包。

由于这些构建器通常是独立地处理每个文件，这也就意味着如果存在如类型导入、namespace 等特殊语法时，它们无法像 tsc 那样去全面分析这些关系后再进行处理。此时我们可以启用 isolatedModules 配置，它会确保每个文件都能被视为一个独立模块，因此也就能够被这些构建器处理。

启用 isolatedModules 后，所有代码文件（不包括声明文件）都需要至少存在一个导入或导出语句（比如最简单的情况下可以使用 `export {}`），无法导出类型（ESBuild 并不知道这个值是类型还是值）以及无法使用 namespace 与常量枚举（常量枚举在构建后会被内联到产物中）。

除了这些构建器以外，isolatedModules 配置也适用于使用 TS Compiler API 中的 transpileModule 方法，这个方法类似于 Babel，不会生成声明文件，只会进行单纯的语法降级。

#### JavaScript 相关

##### allowJs

只有在开启此配置后，你才能在 `.ts` 文件中去导入 `.js` / `.jsx` 文件。

##### checkJs

checkJs 通常用于配合 allowJs 使用，为 `.js` 文件提供尽可能全面的类型检查。我们在类型指令一节学习过 `@ts-check` 指令，这一配置就相当于为所有 JavaScript 文件标注了 `@ts-check`。

如果你希望禁用对部分 JavaScript 文件的检查，或者仅对部分 JavaScript 文件进行检查，可以对应地使用 `@ts-nocheck` 和 `@ts-check`。

#### 模块相关

##### esModuleInterop 与 allowSyntheticDefaultImports

这两个配置主要还是为了解决 ES Module 和 CommonJS 之间的兼容性问题。

通常情况下，ESM 调用 ESM，CJS 调用 CJS，都不会有问题。但如果是 ESM 调用 CJS ，就可能遇到奇怪的问题。比如 React 中的源码中是这样导出的：

```js
// react/cjs/react.development.js
exports.Children = Children;
exports.useState = useState;
exports.memo = memo;
exports.useEffect = useEffect;
```

假设我们分别使用具名导入、默认导入和命名空间导入来导入 React：

```typescript
import { useRef } from "react"; // 具名导入（named import）
import React from "react"; // 默认导入（default import）
import * as ReactCopy from "react"; // 命名空间导入（namespace import）

console.log(useRef);
console.log(React.useState)
console.log(ReactCopy.useEffect)
```

这样的代码在默认情况下（即没有启用 esModuleInterop）会被编译为：

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_2 = require("react");
const ReactCopy = require("react");
console.log(react_1.useRef);
console.log(react_2.default.useState);
console.log(ReactCopy.useEffect);
```

可以看到，默认导入的调用被转换为了 `react_2.default`，而具名导入和命名空间则不变，三种导入语句都被转换为了 CJS。

这是因为 TypeScript 默认将 CommonJs 也视为 ES Module 一样，对于具名导入，可以直接将 `module.exports.useRef = useRef` 和 `export const useRef = useRef `等价。但是由于 CommonJs 中并没有这个“默认导出”这个概念， 只能将 ES Module 中的默认导出 `export default` 强行等价于 `module.exports.default`，如上面的编译结果中的 `react_2.default`。这里的 default 就是一个属性名，和 `module.exports.foo` 是一个概念。

但 CommonJs 下存在着类似“命名空间导出”的概念，即 `const react = require("react") `可以等价于 `import * as React from "react"`。

很明显，对于默认导出的情况，由于 React 中并没有使用 `module.exports.default` 提供（模拟）一个默认导出，因此 `react_2.default` 只可能是 undefined。

为了解决这种情况，TypeScript 中支持通过 esModuleInterop 配置来在 ESM 导入 CJS 这种情况时引入额外的辅助函数，进一步对兼容性进行支持，如上面的代码在开启配置后的构建产物会是这样的：

```js
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) { //... }));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) { //... });
var __importStar = (this && this.__importStar) || function (mod) { //... };
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
  
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_2 = __importDefault(require("react"));
const ReactCopy = __importStar(require("react"));
console.log(react_1.useRef);
console.log(react_2.default.useState);
console.log(ReactCopy.useEffect);
```

这些辅助函数会确保 ESM 的默认导入（`__importDefault`） 与命名空间导入 （`__importStar`）能正确地对应到 CJS 中的导出，如` __importDefault` 会检查目标模块的使用规范，对 ESM 模块直接返回，否则将其挂载在一个对象的 default 属性上：

```js
const react_2 = __importDefault(require("react"));1

// 转换结果等价于以下
const react_2 = { default: { useState: {} } }
```

而 `__importStar` （即命名空间导入的辅助函数）的实现则要复杂一些：

```js
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
```

它会在目标模块不是 ESM 规范时，将模块中除了 default 属性以外的导出都挂载到返回对象上（`__createBinding`），然后将这个对象的 default 属性设置为原本的模块信息（`__setModuleDefault`）。这样你既可以 `ReactCopy.useEffect` 访问某个值，也可以 `ReactCopy.default` 访问原本的模块。

这些辅助方法也属于 `importHelpers` 中的 helper，因此你也可以通过启用 `importHelpers` 配置来从 tslib 导入这些辅助方法。

实际上，由于 React 本身是通过 CommonJs 导出的，在你使用默认导入时， TS 也会提醒你此模块只能在启用了 `esModuleInterop` 的情况下使用默认导入。

启用 `esModuleInterop` 配置的同时，也会启用 `allowSyntheticDefaultImports` 配置，这一配置会为没有默认导出的 CJS 模块“模拟”出默认的导出，以提供更好的类型提示。如以下代码：

```js
// handlers.js
module.exports = {
  errorHandler: () => {}
}

// index.js
import handlers from "./handlers";

window.onerror = handlers.errorHandler;
```

虽然这段代码转换后的实际逻辑没有问题，但由于这里并不存在 `module.exports.default` 导出，会导致在类型上出现一个错误。

启用 `allowSyntheticDefaultImports` 配置会在这种情况下将 handlers 中的代码模拟为以下的形式：

```js
const allHandlers = {
  errorHandler: () => {}
}

module.exports = allHandlers;
module.exports.default = allHandlers;
```

然后在导入方就能够获得正确的类型提示了，实际上这也是 Babel 实际的构建效果，但需要注意的是在 TypeScript 中 `allowSyntheticDefaultImports` 配置并不会影响最终的代码生成（不像 `esModuleInterop` 那样），只会对类型检查有帮助。

### 编译器相关

#### incremental

incremental 配置将启用增量构建，在每次编译时首先 diff 出发生变更的文件，仅对这些文件进行构建，然后将新的编译信息通过 `.tsbuildinfo` 存储起来。你可以使用 tsBuildInfoFile 配置项来控制这些编译信息文件的输出位置。

#### watch 相关

我们可以通过 `tsc --watch` 来启动一个监听模式的 tsc，它会在代码文件发生变化（同样会对 node_modules 文件夹的变化进行监听，但只到文件夹级别）时重新进行编译。通常我们会搭配 incremental 选项。

你可以通过与 compilerOptions 同级的 watchOptions 来配置监听行为：

```json
{
  "compilerOptions": {
    "target": "es2020",
    "moduleResolution": "node"
    // ...
  },
  "watchOptions": {
    // 如何监听文件
    "watchFile": "useFsEvents",
    // 如何监听目录
    "watchDirectory": "useFsEvents",
    "fallbackPolling": "dynamicPriority",
    "synchronousWatchDirectory": true,
    "excludeDirectories": ["**/node_modules", "_build"],
    "excludeFiles": ["build/fileWhichChangesOften.ts"]
  }
}
```

对于 `watchFile` 与 `watchDirectory` 选项，TS 提供了 `useFsEvents`（使用操作系统的原生事件来进行监听）、`fixedPollingInterval`（不进行具体监听，而只是在每秒以固定的时间间隔后去检查发生变更的文件）、`priorityPollingInterval`（类似 fixedPollingInterval ，但对某些特殊类型文件的检查频率会降低）、`dynamicPriorityPolling`（对变更不频繁的文件，检查频率降低）、`useFsEventsOnParentDirectory`（对文件/目录的父文件夹使用原生事件监听） 等数个监听方式选择。

其他常用的选项则主要是用于减小监听范围的 `excludeDirectories` 与 `excludeFiles` 。

#### 编译器检查

这里的配置主要用于检查编译器的工作情况，或者在你需要进行编译器性能优化时使用，它们会生成编译器工作的分析报告，包括本次编译包含了哪些文件，以及各个编译阶段（I/O、Type Checking 等）的耗时。

- diagnostics 与 extendedDiagnostics，输出诊断信息，其中 diagnostics 会生成可读性更好的版本。

- generateCpuProfile，生成 CPU 的耗时报告，用于了解构建缓慢的可能原因。

- listFiles 与 listEmittedFiles，其中 listFiles 会罗列所有被纳入本次编译过程的文件，可以用于检查是否携带了非预期的文件。而 listEmittedFiles 则会罗列输出的文件，你可以利用这些文件信息进行额外处理，比如拷贝文件。

- traceResolution，输出一份跟踪模块解析策略与路径的信息，比如这样：

  ```text
  ======== Resolving module 'typescript' from 'src/app.ts'. ========
  Module resolution kind is not specified, using 'NodeJs'.
  Loading module 'typescript' from 'node_modules' folder.
  File 'src/node_modules/typescript.ts' does not exist.
  File 'src/node_modules/typescript.tsx' does not exist.
  File 'src/node_modules/typescript.d.ts' does not exist.
  File 'src/node_modules/typescript/package.json' does not exist.
  File 'node_modules/typescript.ts' does not exist.
  File 'node_modules/typescript.tsx' does not exist.
  File 'node_modules/typescript.d.ts' does not exist.
  Found 'package.json' at 'node_modules/typescript/package.json'.
  'package.json' has 'types' field './lib/typescript.d.ts' that references 'node_modules/typescript/lib/typescript.d.ts'.
  File 'node_modules/typescript/lib/typescript.d.ts' exist - use it as a module resolution result.
  ======== Module name 'typescript' was successfully resolved to 'node_modules/typescript/lib/typescript.d.ts'. ========
  ```

### 其它工程相关

#### extends

这一配置可以类比到 ESLint 配置中的 extends，作用就是复用已有的文件，在这里即是一个已存在的 TSConfig 配置文件。其作用包括在 Monorepo 下统一各个子项目的基础配置：

```json
// <root>/packages/pkg/tsconfig.json
{
  "extends": "../../tsconfig.base.json"
}

// <root>/tsconfig.base.json
{
  "compilerOptions": { }
}
```

或者在团队的所有项目间使用基本统一的配置：

```json
{
  "extends": "team-config/tsconfig.json"
}
```

其中 team-config 是一个 npm 包。

## 总结与预告

在这一节，我们了解了检查相关和工程相关的 TSConfig ，其中有些配置涉及前端领域的其他知识，如在 esModuleInterop 中，我们了解了 ESM 与 CJS 之间调用的问题，以及 TypeScript 是如何解决的。在工程部分，我们了解了 Project References 这一工程领域的重磅特性，以及如何通过 isolatedModules 来使其它编译器也能妥善处理 TS 代码。

另外，这两节的内容其实并不包含所有 TSConfig 配置，除了省略了一些纯做兼容性的配置（如 outFile 的前身 `out` 配置）以外，还有部分没有介绍的配置我们会在后续的漫谈篇中使用专门的一节来进行介绍，如从定义编辑器插件的 `plugins` 配置到编辑器插件的开发。

在下一节，我们会进入完全的实战环节，使用 TypeScript + NestJs + Prisma 开发一个博客 API，从项目搭建、基本语法、数据库 与 ORM、请求链路到部署，让你拥有一个完整的，属于自己的 API 服务。