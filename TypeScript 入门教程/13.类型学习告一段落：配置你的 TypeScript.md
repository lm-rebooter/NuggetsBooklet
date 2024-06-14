到目前为止，我们已经使用了数十节内容来学习 TypeScript 的类型能力。而就像我们在教程最开始说过的那样，TypeScript 可以简单理解为类型能力+编译能力，现在类型能力在你面前已经不再是陌生的概念了，那么编译能力呢？

说到编译，你可能第一时间会想到 Babel 或者 Webpack。如果你曾经自己尝试配置过 Webpack ，那么要迈过的第一道槛，一定是从它浩如烟海的配置项中找到你需要的那个配置，以及在文档里查到这个配置可能的取值，这些取值每个的作用分别是什么，是否要和其它配置组合使用，是否会影响其它配置的表现...。而所有能够提供编译能力的工具都是类似，它们必然需要一定数量的配置才能满足使用者面临的各个场景，那么 TypeScript 呢？

虽然严格来说，TypeScript 提供的编译能力和 Webpack 并不是一个维度的，它只能进行语法降级和类型定义的生成，而不能实现代码压缩，代码分割， Tree Shaking（移除未使用到的代码）以及 Plugin 体系等。但即便如此，TypeScript 也提供了相当数量的配置项。而在这一节，我们就会来学习 TypeScript 中使用相对高频的一系列配置项。

按照这些配置的能力来划分，可以分为产物控制、输入与输出控制、类型声明、代码检查几大类，你并不需要每次创建新项目都把它们配置一遍，按照自己的实际需求进行微调即可。

首先是产物控制部分，这也是通常配置最频繁的部分，主要是 target 与 module 这两个配置项，它们分别控制产物语法的 ES 版本以及使用的模块（CommonJs / ES Module），我们来看看同一段代码在这两个配置组合下会被编译成什么样子，以此来更直观地了解它们的作用：

```typescript
const arr = [1, 2, 3];

for (let i of arr) {
  console.log(i);
}

const obj = {
  a: 1,
  b: 2,
  c: 3
};

for (let key in obj) {
  console.log(key);
}
```

这段代码在 target ES6 和 target ES5 下的编译产物如下：

```typescript
// ES6
"use strict";
const arr = [1, 2, 3];
for (let i of arr) {
    console.log(i);
}
const obj = {
    a: 1,
    b: 2,
    c: 3
};
for (let key in obj) {
    console.log(key);
}

// ES5
"use strict";
var arr = [1, 2, 3];
for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
    var i = arr_1[_i];
    console.log(i);
}
var obj = {
    a: 1,
    b: 2,
    c: 3
};
for (var key in obj) {
    console.log(key);
}
```

需要注意的是，如果我们的 target 指定了一个版本，比如 es5，但你又希望使用 es6 中才有的 Promise 语法，此时就需要在 lib 配置项中新增 'es2015.promise'，来告诉 TypeScript 你的目标环境中需要启用这个能力，否则就会得到一个错误：

```typescript
const handler = async () => {};
```

> *异步函数或方法必须返回 “Promise”。请确保具有对 “Promise” 的声明或在 “--lib” 选项中包含了 “ES2015”。ts(2697)*

配置方式如下：

```json
{
  "compilerOptions": {
    "lib": ["ES2015"],
    "target": "ES5"
  }
}
```

除了 target 以外，module 配置项也会造成编译产物的差异：

```typescript
export const foo = "foo";

export function bar() {
  console.log("bar");
}

// module 配置为 CommonJs
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bar = exports.foo = void 0;
exports.foo = "foo";
function bar() {
    console.log("bar");
}
exports.bar = bar;


// module 配置为 ESNext
export const foo = "foo";

export function bar() {
  console.log("bar");
}
```

接着是输入控制，TypeScript 怎么知道哪些代码是需要进行处理的？输出的文件放到哪里？这就是我们主要的关注点了，在 TypeScript 中，我们首先使用 include 和 exclude 这两个配置项来确定要包括哪些代码文件，再通过 outDir 选项配置你要存放输出文件的文件夹，比如你可以这么配置：

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "outDir": "dist",
    "strict": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "src/generated",
    "**/*.spec.ts"
  ]
}
```

首先通过 include ，我们指定了要包括 src 目录下所有的文件，再通过 exclude 选项，剔除掉已经被 include 进去的文件，包括 `src/generated` 文件夹，以及所有 `.spec.ts` 后缀的测试用例文件。然后在完成编译后，你就可以在 dist 目录下找到编译产物了。

上面说到在使用高于当前 target 时的语法，需要在 lib 中显式添加这部分语法的类型声明，那么如果使用了来自外部 npm 包的类型声明呢？在类型声明一节中我们已经学到，TypeScript 会加载所有 node_modules 中 所有 @types 文件夹下的声明文件，假设我们的项目中被三方依赖安装了大量的 @types 文件，导致类型加载缓慢或者冲突，此时就可以使用 types 配置项来显式指定你需要加载的类型定义：

```json
{
  "compilerOptions": {
    "types": ["node", "jest", "react"],
  }
}
```

以上配置会加载 `@types/node`，`@types/jest`，`@types/react` 这几个类型定义包。

类型相关的配置项也是一个重要的组成部分，这里我们只挑几个使用频率最高的。首先是 declaration ，它的作用就一个——控制是否生成 .d.ts 文件，如果禁用的话你的编译产物将只包含 JS 文件，与之相对的是 emitDeclarationOnly，如果启用，则只会生成 .d.ts 文件，而不会生成 JS 文件，如果你两个都不想要呢？——请使用 noEmit ！启用后将不会输出 JS 文件与声明文件，但类型检查能力还是能保留的。

你可能会想，这些配置有啥用？如果你的项目只使用 TS，那可能确实作用寥寥。但很多时候，为了追求编译时的性能优化，我们可能会将 tsc 和其它编译工具组合在一起。比如，使用 Webpack 进行语法降级，只是使用 TS 来生成类型声明文件（此时就可以启用 emitDeclarationOnly），或进行类型检查（此时启用 noEmit）等等。

最后是检查相关的配置，即你看到的 no-XXX 格式的规则，我们简要介绍下其中主要的部分：

-   noImplicitAny，当 TypeScript 无法推断出你这个变量或者参数到底是什么类型时，它只能默默给一个 any 类型。如果你的项目维护地还比较认真，可以启用这个配置，来检查看看代码里有没有什么地方是遗漏了类型标注的。
-   noUnusedLocals 与 noUnusedParameters，类似于 ESLint 中的 `no-unused-var`，它会检查你的代码中是否有声明了但没有被使用的变量/函数。是否开启同样取决于你对项目质量的要求，毕竟正常情况下项目中其实不应该出现定义了但没有消费的变量，这可能就意味着哪里的逻辑出错了。
-   noImplicitReturns，启用这个配置项会要求你的函数中所有分支代码块都必须有显示的 return 语句，我们知道 JavaScript 中不写 return （即这里的 Implicit Returns）和只写一个简单的 return 的效果是完全一致的，但从类型层面来说却不一致，它标志着你到底是没有返回值还是返回了一个 undefined 类型的值。因此，启用这个配置项可以让你确保函数中所有的分支都有一个有效的 return 语句，在那些分支层层嵌套的情况下尤其好用。

  


在这一节中，我们学习了 TypeScript 配置中产物控制、输入与输出控制、类型声明、代码检查这几个部分里最常用的几条配置，回想我们在第一节说到的，TypeScript 是如何一步步从一门编程语言成长为一个构建工具的，是否感到再次加深了印象？毕竟有了这样全能的 TypeScript ，意味着我们可以稍稍放下 Babel 与 ESLint ——学一样工具等于学三样工具+一门编程语言岂不美哉？