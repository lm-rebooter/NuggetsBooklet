这一节，我们来讲解 TypeScript 与 ECMAScript 之间的关系。

首先，我们来理清经常看到的 ES / ECMAScript / TC39 等等概念到底是个啥。然后，一起看看 TypeScript 都提前实现了哪些 ECMAScript 语法，它们怎么用，到底有多好用。最后，在扩展阅读中，我们会聊到更多有趣的、正在进行中的 TC39 提案。要相信，未来的 JavaScript 一定会变得越来越好。

> 本节代码见：[ECMAScript](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Flinbudu599%2FTypeScript-Tiny-Book%2Ftree%2Fmain%2Fpackages%2F20-ecmascript)

## ECMAScript 与 TC39

首先是 ECMAScript 这个单词，虽然 JavaScript 和 Java 没有关系，但 ECMAScript 和 ECMA （正确发音近似于**诶可码**（Script））确实是有关系的。ECMA 的全称是 [European Computer Manufacturers Association](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ecma-international.org%2F)，即**欧洲计算机制造商协会**。它并不是为了卖货而生的，这一国际组织的存在主要是维护各种计算机的相关标准，从硬件到软件到编程语言等等。

最初创建 JavaScript 这门语言的公司是网景（Netscape），主推产品即为网景浏览器。由于在和微软 IE 的竞争中落得下风，为了避免从此 Web 脚本的主导权从此落入微软手中，在 1996 年，网景将 JavaScript 的标准制定权交给了 ECMA 协会，因此有了 ECMAScript —— 也就是 JavaScript 的语言规范。**而 ECMAScript 并不是一门语言，而是一门规范。** 我们说的 ES5 / ES6 / ESNext 等等概念，实际上指的都是 JavaScript 这门语言规范的新版本。

ECMA 维护着数百条规范，这些规范的领域差异非常大。因此 ECMA 采用技术小组（**Technical Committee，也称为技术委员会**）的方式来管理这个规范，ECMAScript 对应的技术小组即是 TC39。目前 TC39 委员会的绝大部分成员来自于浏览器引擎厂商、互联网巨头公司等等，并且定期召开会议来讨论各个提案的进展。

那么，提案又是什么？首先，ECMAScript 中的新语法并不是委员会成员坐下来开个简单的会就决定引入到 JavaScript 中的。一个新语法必须先从草稿，也就是从提案开始。你可以把新语法想象成一条新法律，得要有人首先提出这条法律能解决目前的某一问题，然后法律专家、法院、国家都要通过，它才能最终被写到法律条文中。在 ECMAScript 中，一个提案被纳入规范要经历 5 个阶段。

- stage 0（**strawman**）：任何 TC39 的成员都可以提交。
- stage 1（**proposal**）：进入此阶段就意味着这一提案被认为是**正式**的了，需要对此提案的场景与API进行详尽描述。要想进入 Stage 1，需要一位 TC39 成员作为负责人（champion）对这个提案具体的**语法、语义和现有语法的冲突风险**都进行详细讨论分析。
- stage 2（**draft**）：要进入 Stage 2，需要完成**包含提案所有内容的标准文本的初稿**。理论上来说，这一阶段的提案，如果能最终被纳入规范，这之后的阶段中就不会被大改了，只接受增量修改。因为如果要大改，往往需要废弃掉整个提案，让 V2 版本从 Stage 0 开始重新来一遍（有点像删号重开）。
- stage 3（**candidate**）：这一阶段的提案只有在遇到了重大问题才会修改，需要撰写非常完善的规范文档。进入 Stage 3 的前提条件是在规范文档的基础上，ECMAScript 官方的编辑以及指定 TC39 委员会成员签署了同意意见。通常来说提案进入这一阶段后，我们就能通过 Babel 插件或者各种 Polyfill 等提前试用上。
- stage 4（**finished**）：这一阶段的提案将会被纳入到 ES 每年发布的规范之中，正式与大家见面。想要完成这最后一步，需要完成所有对应到提案内容的测试用例（用来给引擎产商们检查实现的兼容程度），以及官方编辑同意将其合并到 [tc39/ecma262](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fecma262) 仓库。

目前 TC39 会议的频率大概是两月一次，并且由于疫情的原因也从线上、线下结合改成了完全线上的模式。上面我们提到的 ecma262，这里的 262 意为 ECMAScript 是 ECMA 维护的第 262 条标准，目前它的最新版本是 2022 年发布的[第 13 版](https://link.juejin.cn/?target=https%3A%2F%2F262.ecma-international.org%2F13.0%2F)，即 ES2022 或 ES13。当然，各位同学最熟悉的肯定还是 2015 年发布的 ES2015，即 ES6 这一版本。网上很多说法是将 ES2015 后的版本统称为 ES6，我不太认同的原因也就在于此。

说了这么多，想必你现在至少对 ECMAScript 和 TC39 到底是什么、它们的存在意义以及工作方式等等都有了一个大致了解。如果你想了解更多历史故事，我推荐阅读雪碧老师的作品： [JavaScript 二十年](https://link.juejin.cn/?target=https%3A%2F%2Fcn.history.js.org%2Fpart-1.html)。

那么，ECMAScript 和 TypeScript 的关系又是啥？知道了 ECMAScript 的具体意义就比较好懂了。上面说到一个新语法从提出到最终成为 ECMAScript 的一部分，需要走完漫长的 Stage 0-4，如果这个语法真的究极无敌好用（比如我们下面要说的可选链、空值合并以及装饰器），实在是等不及想用怎么办？

聪明的你一定会想到 Babel，它能够将 ECMAScript 未纳入标准的语法进行降级（或将标准语法按照运行时环境降级），这样我们就可以放心使用未来的新语法，Babel 会帮我们编译好的。而 TypeScript 也支持这么个功能，或者说这就是它的核心功能之一。正如我们在开篇说的那样，TypeScript 其实就是类型能力加上一些新语法，而这些新语法绝大部分都来自于 ECMAScript，并且是在这些语法提案还没正式进入标准时，TypeScript 就对其进行了支持。在编译时，类型标注会直接被抹除，而这些新语法也会按照我们在 `tsconfig` 中的 `target` 配置进行对应降级。

那么，有哪些语法享受到了这一待遇？下面我们就来聊一聊 TypeScritp 中的部分 ESMAScript 语法，感受一下它们是不是真的如此好用。

## TypeScript 中的 ECMAScript 语法

目前在 TypeScript 中，已经合入的 ECMAScript 语法主要有这么几个：

- 可选链 Optional Chainning，即 `?.` 语法。
- 空值合并 Nullish Coalescing，即 `??` 语法。
- 逻辑赋值 Logical Assignment，即 `&&=`, `??=` 这一类语法。
- 装饰器，我们会用两节专门来讲解。
- 一些新增的方法，如 replaceAll 等。
- Class 相关，如基于 `#` 的私有成员标注等。

这篇文章中我们并不关注新增的方法以及 Class 相关语法，因为它们真的就是看一下文档的事。对于这些新增的方法，TypeScript 中可以通过在 `tsconfig` 的 `compilerOptions.lib` 配置中新增 `es2021`（对应的 es 版本）/`esnext` 来启用这些新的语法，而在 JavaScript 中想要使用则需要运行时支持或者使用 Polyfill（CoreJs，ES-Shims 等）。

对于可选链、空值合并以及逻辑赋值，前两者在 TS 3.7 版本引入，逻辑赋值则在 4.0 版本被引入，它们早在 ECMAScript 2021 就被正式吸收，你现在甚至可以在浏览器控制台使用这几个语法。而装饰器就是比较特殊的一位了，我们会在下一节装饰器一章详细地聊聊它的演进历史。

接下来，我们就来讲一讲可选链、空值合并以及逻辑赋值这三个语法，感受一下这些语法糖到底有多甜。

### 可选链 Optional Chainning

在 JavaScript 中，如果访问一个嵌套多层的属性，为了避免出现 `Cannot read property of undefined` 这样的错误，我们通常会使用**逻辑与** `&&` 语法来确保在某一层出现空值时及时短路掉访问：

```javascript
const inner = obj && obj.data && obj.data.innerProperty;
```

这种写法虽然丑陋，但它确实能在一定程度上避免对空值的读取，但也只是一定程度上，为什么这么说？

上面的代码看起来很安全，但在某一步访问出现空值时，它返回的是上一步的值，而在属性的读取过程中，我们通常希望的是如果某一环节短路了，那返回一个 undefined 给我就好。否则，如果下面还存在对 `inner` 进行真值假值判断（`if(inner)`）的话，反而容易引发 Bug。

另外，逻辑与短路在属性嵌套过深时简直就是噩梦，使用可选链的 `?.` 语法，我们可以把它改写成这样：

```javascript
const inner = obj?.data?.innerProperty;
```

除了更简洁的写法以外，可选链也更符合我们的预期：**它会在短路时返回一个 undefined**。可选链不仅能应用在属性访问，也可以用在计算属性访问以及方法调用上：

```typescript
obj?.[expr];
obj?.[++a];
// 对应到 obj.func && obj.func()
obj?.func();
```

在所有情况下，如果 `?.` 的左侧发生了短路，那么就会直接停止后续操作，比如不会去运行并计算表达式 `expr` 以及 `++a` 。通常可选链和空值合并搭配有奇效，我们继续往下看。

### 空值合并 Nullish Coalescing

如果说可选链是为了取代**逻辑与**（`&&`），那么空值合并就是为了取代**逻辑或**（`||`）。而逻辑或的主要使用场景之一就是提供默认值，如：

```javascript
const foo = someValue || fallbackValue;
```

逻辑或会在 `||` 左边被判断为 false 时，执行右边的逻辑，在这里即是赋值行为。看起来一切好像都很美好，但别忘了，由于 JavaScript 中无处不在的隐式转换，如果 `||` 左边是 `""`/ `0` / `false`，都会被视为 false（false 虽然是 false，但它也是个值！），而我们希望的是**仅在左边为 undefined 或 null 时，才去应用默认值**。

大部分情况下我们可以直接使用 `??` 代替 `||`：

```javascript
const foo = someValue ?? fallbackValue;
```

配合可选链：

```javascript
const bar = obj?.a?.b?.c() ?? fallbackValue;
```

空值合并就如它的名字一样，只会对真正意义上的空值（null 与 undefined）进行处理。

而空值合并的语法如此近似于逻辑操作（`||`, `&&`），会不会有些基于逻辑操作的语法也能直接套用空值合并？当然可以，不然我们怎么介绍下面的逻辑赋值。

### 逻辑赋值 Logical Assignment

实际上，逻辑赋值是在复合赋值的基础上演进而来（或者说关系一致）的，都是将一个操作符和赋值符号结合在一起。比如我们最常见的复合赋值：

```javascript
a = a + b;
a += b;

a = a - b;
a -= b;

a = a * b;
a *= b;

// 还有除法运算，就不演示了
```

复合赋值其实就是先执行操作，再将操作结果赋值给左边的变量。如 `a += b` 就是执行 `a + b`，然后将结果赋值给 `a`。

而逻辑赋值也是一样：

```javascript
a = a || b;
a ||= b;

a = a && b;
a &&= b;
```

类比一下，逻辑赋值就是**先执行逻辑操作，然后将结果赋值给左边的变量**。这一语法其实在实际开发中有奇效，如 `a ||= b` 其实可以替代掉以下这段代码：

```javascript
if(!a) a = b;

// 或者
a = a ? a : b;
```

既然逻辑操作符可以，那没道理我空值合并不行，毕竟我们长得这么像：

```javascript
a = a ?? b;
a ??=b;
```

这个时候为了区分逻辑赋值，我们可以称其为**短路赋值**。短路赋值在一些需要懒初始化的场景中非常好用，比如：

```typescript
let arr: string[];

(arr ??= []).push("linbudu");

// 等价于以下这段
arr = arr ?? []; // 假设 arr 有可能在多处被初始化
arr.push("linbudu");
```

同样，秉持着“一点一点精通 TypeScript ”的思路，我仍然推荐你在学习完本节后，使用可选链、空值合并以及短路赋值来替换部分老项目中的代码，并且在未来遇到短路与默认值场景时首先考虑这三位新同学。

## 总结与预告

这一节，我们了解了让人傻傻分不清楚的 ECMAScript、TypeScript、TC39 等概念之间的联系与实际意义，认识了三位对你来说或许是首次见面的新朋友：可选链、空值合并以及短路赋值。从现在开始，你可以在接下来的项目开发中不断提醒自己去使用它们，毕竟，兼得更简洁的语法以及更安全的逻辑，有谁会拒绝呢？

在下一节，我们会用很长的篇幅来聊聊 TypeScript 中的装饰器，从演进到了解、从原理到熟悉，最后来写一个你自己的依赖注入容器，让这些高大上的概念彻底为你所用。

## 扩展阅读

### 演进中的 TC39 提案

除了我们上面讲到的可选链、空值合并，以及大家都至少听说过的装饰器以外，还有许多演进中的 TC39 提案，我们可以简单归类为语法糖、新的内置方法、新的 API等。在了解完本篇的核心内容以后，我们不妨来瞅几个有意思的提案，看看未来的 JavaScript 可能会是什么样的？

> 以下介绍的提案状态均以本文写作时（2022-06-29，最近一次 TC39 会议为 2022 年 6 月召开）为准。另外，如果你想了解更多提案，可以阅读我此前的文章：[聊一聊进行中的TC39提案（stage1/2/3）](https://juejin.cn/post/6974330720994983950)。

#### Record 和 Tuple：内置的不可变数据类型（Stage 2）

Record 与 Tuple 为 JavaScript 中引入了两个新的**原始**数据类型，分别对应到对象与数组（差异仅仅是声明时多了个 `#`）：

```javascript
// Record
const proposal = #{
  id: 1234,
  title: "Record & Tuple proposal",
  contents: `...`,
  keywords: #["ecma", "tc39", "proposal", "record", "tuple"],
};


// Tuple
const measures = #[42, 12, 67, "measure error: foo happened"];
```

注意，它们是原始类型，也就是说是按值比较而非对象那样按引用地址比较的。即 `#[1,2,3] === #[1,2,3]`，`#{ foo: "bar" } === #{ foo: "bar" }` 都是成立的。

这一提案自从在 2020 年 7 月会议上进入到 Stage 2 后，在后续直到最近的会议中，都一直没有取得进一步进展。原因之一即是这是两个全新的数据类型，它们的实现成本对于浏览器引擎产商来说是较高的。

#### 面向表达式的 Do Expression 与 Throw Expression（Stage 1）

在 TC39 中，有相当一部分提案实际上有着函数式编程的理念背景，很难说这对 JavaScript 开发者来说是否是刚需，但它们确实能带给你另一种截然不同的编程范式。

这一提案的理念背景是函数式编程中的面向表达式（Expression-Oriented）语法，它长这个样子：

```javascript
// do expression
let x = do {
  let tmp = f();
  tmp * tmp + 1
};

let y = do {
  if (foo()) { f() }
  else if (bar()) { g() }
  else { h() }
};

// async do expression
async do {
  await readFile('in.txt');
  let query = await ask('???');
  // etc
}


// throw expression
function getEncoder(encoding) {
  const encoder = encoding === "utf8" ? new UTF8Encoder() 
                : encoding === "utf16le" ? new UTF16Encoder(false) 
                : encoding === "utf16be" ? new UTF16Encoder(true) 
                : throw new Error("Unsupported encoding");
}
```

很明显，这种语法能够帮助我们更好地组织代码与逻辑块的结构。但由于其毕竟带来了新的编程理念与语法，目前提案进度感人（其异步版本 async do expression 甚至还没有开始推进）。

#### 响应式编程与Observable（Stage 1）

如果你了解过 RxJs，那么肯定马上就 get 到了这个提案想要干啥。[proposal-observable](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fproposal-observable) 这一提案尝试引入原生的 Observable 支持，你可以简单理解为这是用于处理较复杂异步场景的神器。但是，如果不是工作中确实需要处理复杂的异步场景，我个人并不推荐去深入学习 Observable 与 RxJs 相关的概念，简单了解即可。原因则是如果你没有实战场景，那么基本上对于 RxJs 的海量 API 只能抓瞎，或者学完之后很快就忘干净了（就像我一样）。

回到这个提案，它引入了部分 RxJs 中的核心概念，除 Observable 外还有 Observer、Subscriber 以及部分 Operators（目前只有 of、from 等基础的操作符）。

```typescript
function listen(element, eventName) {
    return new Observable(observer => {
        let handler = event => observer.next(event);
        element.addEventListener(eventName, handler, true);
        return () => {
            element.removeEventListener(eventName, handler, true);
        };
    });
}
```

#### 函数式理念的进一步发展

如果你对面向表达式的语法感到兴趣，那么我想下面这几个函数式操作符相关的提案也会引起你的关注。如果你想详细了解它们的使用与差异，可以阅读笔者此前的文章：[你应该了解的 ECMAScript 函数操作符相关提案的最新进展](https://link.juejin.cn/?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FFQiHCs0o8dJF3PSIJVwcXQ)。

首先是 [Pipeline Operator, proposal-pipeline-operator](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fproposal-pipeline-operator)，它引入了 `|>` 语法来实现数据流编程的范式，如以下的 JavaScript 代码：

```javascript
function one () { return 1; }
function double (x) { return x * 2; }

let _;
_ = one();
_ = double(_);
_ = Promise.resolve().then(() =>
  console.log(_));
```

使用 Pipeline Operator ，我们能将以上代码改写为这样：

```javascript
let _;
_ = one()
  |> double(%)
  |> Promise.resolve().then(() =>
    console.log(%));
```

其中，`%` 表示上一个操作单元返回的值。

类似于 Pipeline Operator，[Function Pipe/Flow, proposal-function-pipe-flow](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fjs-choi%2Fproposal-function-pipe-flow) 提案引入了两个 Function 对象上的系列方法：`pipe`/`pipeAsync` 与 `flow`/`flowAsync`。

其中，`Function.pipe` 接受一个输入值与一系列的一元函数，并从第一个一元函数开始，将上一次的调用结果传给下一个一元函数作为参数。`Function.pipe` 会在原地执行这些一元函数：

```javascript
const { pipe } = Function;

pipe(5, f0, f1, f2); // 等同于 f2(f1(f0(5)))

pipe(5); // 等同于 5
```

另一个系列 `Function.flow`，它接受一系列函数并组合成一个新的高阶函数，同时仍然保持传入的调用顺序。`Function.flow` 并不会立即执行这些一元函数，而是返回一个新的函数（类似于 `Lodash.flow`）。

对于首个函数，它可以是任意元函数（有任意个参数），而对于余下的函数都必须是一元函数。

```javascript
const { flow } = Function;

const f = flow(f0, f1, f2);
// 等同于 f = (...args) => f2(f1(f0(...args)))
f(5, 7); 

const g = flow(g0);
// 等同于 g = (...args) => g0(...args)
g(5, 7);
```

而 pipeAsync、flowAsync 则分别是它们的异步版本，即应用对象变成了异步函数，这里不再赘述。

这两个提案都代表了数据流编程的理念，**数据流编程（Dataflow Programming）** 将程序拆分为数个独立的操作单元，而数据在操作单元间以有向图的形式流转，程序设计关注的重点在于动态的数据。想象流水线上的玩具，经过一个个工人手中后，一个木头架子依次被装上了四肢、脑袋、眼睛、开关...，这其实就是数据流在一个个独立单元之间的流动。而在数据流编程中，实际上我们关注的也是如何建立这个数据流转关系，包括需要存在的程序单元（函数）与程序执行的先后次序等。

### TC39 中的类型提案

在 2022 年 3 月会议中，由 TypeScript 团队推进的 [Type Annotations](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fproposal-type-annotations) 也成功进入到 Stage1，这一提案的目的是引入和 TypeScript 中一样，会在编译时被擦除的类型标注，其语法也和 TypeScript 基本一致：

```typescript
import type { Foo } from "foo";
import type * as Bar from "bar";

let x: string;
x = "hello";
x = 100;

function equals(x: number, y?: number): boolean {
    return x === y;
}

interface Person {
    name: string;
    age: number;
}

export type CoolBool = boolean;
```

这一提案其实也支持了泛型，但就目前来看，泛型还是过于激进了，可能会在后续拆分成独立的提案进行独立地迭代。另外，此提案目前不包括涉及到运行时代码（枚举，namespace 等）的功能，因为它真的就**只是想引入编译时擦除类型**。

我个人对于这一提案其实是持支持态度的，因为 TypeScript 其实就包含类型和新的 ECMAScript 语法两个部分，对应到编译时就是类型擦除和语法降级（类似 Babel）。随着浏览器等运行时对 ECMAScript 语法的支持越来越好，语法降级功能不再是刚需，那就只剩下类型擦除了。如果这一提案能够持续推进，成为语法降级的一部分，甚至运行时也直接原生支持此语法，那我觉得简直不要太美丽。当然，类型语法肯定是可选的，所以我们还是随时可以回到无拘无束的 JavaScript。