关于 ESLint 是什么，我想应该没有过多介绍的必要，即使你没有主动了解过它，也一定被动接触过。它带给你的印象并不一定很好，有可能是满屏的红色波浪线，也可能是成千上万条的报错输出。但你可能也很享受经过 ESLint 检查与格式化后工工整整的代码，那简直叫一个赏心悦目。

对于 ESLint ，我认为它就是现代前端工程必备的一样工具，无论是简单的寥寥几行配置，还是精心挑选了最适合自己或者团队风格的规则集，它都是不可缺少的一环。ESLint 的作用其实可以划分为两个部分：**风格统一**与**代码优化**。

风格统一不必多说，单双引号、缩进、逗号等编码风格的统一十分有必要，看到一会单引号一会双引号的代码，很难不怀疑作者的代码水平。而代码优化则就是一个比较宽泛的概念了，它可以指**让你的代码更简洁**，比如不允许未使用的变量，也可以指**让你的代码更严谨**，比如不允许未声明的全局变量。很多人可能存在一个误区，即认为 ESLint 只会要求减少代码，但实际上在很多场景，尤其是在 TypeScript 场景下，很多时候 ESLint 反而会要求你写**更多的代码**，如要求你为函数的返回值显式声明类型等等。

实际上，这也是 Lint 工具的核心功能，我们后面会介绍的 Prettier 也是（但 Prettier 只关心风格统一部分），我们希望通过一种**自动化的、存在确定规范**的方式，来提升项目中的代码质量。接下来，我们会了解如何配置 ESLint，如何进一步提升工程的约束能力，以及 TypeScript ESLint 下的规则集介绍。

> 本节代码见：[ESLint Ruleset](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Flinbudu599%2FTypeScript-Tiny-Book%2Fblob%2Fmain%2Fpackages%2F19-eslint-config-ts-ruleset%2Findex.js)

## 基本的 ESLint 配置

最简单的方式就是通过 ESLint 自带的初始化功能，然后回答一系列问题即可。

```bash
npx eslint --init
npm init @eslint/config
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35a35cdc4e764431aa795f61c8a8d8e9~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

如果你选择了使用 TypeScript，它会自动为你安装 `@typescript-eslint/` 一系列工具。比如上面我们最终安装了这些依赖：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/383031f761d94c568f24921e5b138809~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

对于已有 ESLint 配置的项目，如果要配置 TypeScript ESLint 其实也很简单，安装以下依赖：

```bash
npm i @typescript-eslint/eslint-plugin @typescript-eslint/parser --save-dev
yarn add @typescript-eslint/eslint-plugin @typescript-eslint/parser --save-dev
pnpm i @typescript-eslint/eslint-plugin @typescript-eslint/parser --save-dev
```

然后更改你的 ESLint 配置：

```typescript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    // ...其他已有的配置
    'plugin:@typescript-eslint/recommended',
  ],
};
```

由于部分 TS ESLint 的规则和 ESLint 中基础的规则有冲突，我们需要修改配置文件的规则，最终的基本示例如下：

```js
module.exports = {
  root: true,
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    quotes: 'off',
    '@typescript-eslint/quotes': ['error', 'single'],
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

> Indent 这条规则有一个需要注意的地方，其配置项还可以是 `'tab'` `'space'` 等，如果你把上面的 2 改成 `'tab'`，大概率项目中会出现巨量报错，如 *Expected indentation of 1 tab but found 2 spaces*。这是因为 Tab 和 Space 并不是等价的，也和你的编辑器配置有关。而我们这里的 2 ，其具体意义为 2 spaces。

完成配置后，我们需要确定接受 ESLint 检查的项目文件，我个人的习惯是只让 ESLint 检查核心代码文件，包括 js/jsx，ts/tsx 文件。因此我们需要忽略掉部分文件，创建 `.eslintignore` 文件：

```ini
*.json
*.html
*rc.js
*.svg
*.css
```

在 package.json 中的 scripts 中添加以下命令：

```json
{
  "scripts": {
    "eslint": "eslint src/** --ext .js, .jsx, .ts, .tsx --cache",
    "eslint:fix": "npm run eslint -- --fix"
  },
}
```

`npm run eslint` 即是仅检查，而 `eslint:fix` 则是检查同时尽可能修复错误。这样我们就完成了基础的 TypeScript ESLint 配置。但在实际项目中，光靠 ESLint 可没法确保代码质量。

## 配置 Prettier 与 Git Hooks

通常在实际项目开发时，我们并不会仅仅使用 ESLint，还有一系列辅助的工具。比如我们可以同时使用 Prettier 与 ESLint，以及使用 Git Hooks 与 Lint Staged 确保项目代码在提交前被格式化过。这一部分我们就来介绍在 ESLint 基础上再添加 Prettier 与 Git Hooks。

首先是 Prettier，它同样是代码格式化工具，但和 ESLint 并不完全等价。除 JS/TS 代码文件以外，Prettier 也支持 CSS、Less 这样的样式文件，DSL 声明如 HTML、GraphQL 等等。我个人的习惯是将除核心代码文件以外的部分，如 JSON、HTML、MarkDown 等全交给 Prettier 进行格式化。

对于 JS/TS 文件，Prettier 与 ESLint 的核心差异在于它并不包括 `no-xxx`（不允许某些语法），`prefer-xxx`（对于多种功能一致的语法，推荐使用其中某一种）这些**涉及具体代码逻辑**的规则，而是专注于 indent、quote、comma（逗号）、printWidth（每行允许的字符串长度） 等规则。

首先安装 Prettier，如果你想要让 Prettier 也参与格式化代码文件，还需要安装 eslint-config-prettier ，这一配置包禁用了部分 ESLint 中会与 Prettier 产生冲突的规则。

```bash
npm install prettier eslint-config-prettier --save-dev
yarn add prettier eslint-config-prettier --save-dev
pnpm install prettier eslint-config-prettier --save-dev
```

创建 Prettier 配置文件 .prettierrc.js，我们选择一小部分常用的：

```js
module.exports = {
  // 单行最多 80 字符
  printWidth: 80,
  // 一个 Tab 缩进 2 个空格
  tabWidth: 2,
  // 每一行结尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 在对象属性中，仅在必要时才使用引号，如 "prop-foo"
  quoteProps: "as-needed",
  // 在 jsx 中使用双引号
  jsxSingleQuote: false,
  // 使用 es5 风格的尾缀逗号，即数组和对象的最后一项成员后也需要逗号
  trailingComma: "es5",
  // 大括号内首尾需要空格
  bracketSpacing: true,
  // HTML 标签（以及 JSX，Vue 模板等）的反尖括号 > 需要换行
  bracketSameLine: false,
  // 箭头函数仅有一个参数时也需要括号，如 (arg) => {}
  // 使用 crlf 作为换行符
  endOfLine: "crlf",
};
```

关于更多配置，参见 [Prettier 配置](https://link.juejin.cn/?target=https%3A%2F%2Fprettier.io%2Fdocs%2Fen%2Foptions.html)。

同时为了避免和 ESLint 冲突，我们还需要通过 `eslint-config-prettier` 禁用掉部分 ESLint 规则，修改 ESLint 配置：

```js
module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // 新增这一行
  ],
};
```

创建忽略文件 .prettierignore：

```init
build
dist
out
# 如果你不希望 prettier 检查代码文件的话
# *.ts
# *.tsx
# *.jsx
# *.js
```

同时更新 NPM Scripts：

```json
{
  "scripts": {
    "eslint": "eslint src/** --no-error-on-unmatched-pattern --ext .js, .jsx, .ts, .tsx --cache",
    "eslint:fix": "npm run eslint -- --fix",
    "prettier": "prettier --check .",
    "prettier:fix": "prettier --write .",
    "lint": "npm run eslint && npm run prettier",
    "lint:fix": "npm run eslint:fix && npm run prettier:fix"
  },
}
```

类似的，`npm run prettier` 是仅检查，而 `prettier:fix` 才是进入修改。同时我们还增加了 `lint` 和 `lint:fix` 来一次性执行两个工具。

即使配置了 ESLint 和 Prettier，还是可能出现每个人提交代码都不一样的情况。这是因为这些 scripts 需要手动执行，非常容易忘记或者绕过去。而如果我们能让所有开发同学每次提交代码时都自动执行一次格式化，就能确保所有人成功提交上去的代码风格一致。

要实现这一能力，我们需要 Git Hooks 与 Lint Staged。

首先是 Git Hooks，它和 React Hooks 可不一样，它更贴近生命周期的概念，即在某一个操作前后执行的额外逻辑。如我们要实现在 commit 前格式化，就可以使用 `pre-commit` 这个钩子，如果钩子执行失败，就不会真地执行 commit 。常用的 Git Hooks 还有 `commit-msg`（可以用于检查 commit 信息是否规范，如需要符合 `feat(core): enhancement` 这种格式）、`pre-push`以及在服务端 Git 仓库执行的 `pre-receive`、`update`、 `post-receive` 等。

直接写 Git Hooks 不太优雅，我们可以通过 [Husky](https://link.juejin.cn/?target=https%3A%2F%2Ftypicode.github.io%2Fhusky%2F) 来实现相对简便的配置。关于各种初始化方式，你可以阅读文档了解更多，我们这里只介绍自动安装的方式：

```bash
npx husky-init && npm install       # npm
npx husky-init && yarn              # Yarn 1
yarn dlx husky-init --yarn2 && yarn # Yarn 2+
pnpm dlx husky-init && pnpm install # pnpm
```

这样做只是安装了 Huksy 以及配置了相关环境，我们实际上还没有添加 Git Hooks。Huksy 也提供了快速创建的方式，我们直接把后面要执行的命令先添加进来：

```bash
npx husky add .husky/pre-commit './node_modules/.bin/lint-staged'
```

现在你应该拥有了一个 .huksy 文件夹，以及内部的 pre-commit 文件：

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

./node_modules/.bin/lint-staged
```

可以看到，我们实际上要执行的就是 lint-staged 这个命令，而 Lint Staged 的作用即是**找出你添加到暂存区（git add）的文件，然后执行对应的 lint**，接着我们来学习如何将它添加到项目里。

首先还是安装：

```bash
npm install --save-dev lint-staged
yarn add --save-dev lint-staged
pnpm install --save-dev lint-staged
```

然后在 package.json 中新增这段配置：

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --cache --fix",
      "prettier --write --list-different"
    ],
    "*.{json,md,html,css,scss,sass,less,styl}": [
      "prettier --write --list-different"
    ]
  },
}
```

这段配置的大意是，对于暂存区的核心代码文件，先使用 ESLint 格式化，再使用 Prettier 格式化，而对于其他文件，统一使用 Prettier 进行格式化。现在你可以试着提交一次了：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c44b7cd1263402884dbd71148f8b93e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

加上 Prettier、Git Hooks 与 Lint Staged 后，我们的项目约束才能说基本搞定了。虽然 Git Hooks 也可以通过 `git commit -m 'xx' --no-verify` 这种方式绕过去，但至少现在我们有办法让大家提交的代码都一致了，不用再被格式化导致的冲突折磨了。但我们并不应该满足于知道如何配置，也需要理解这些配置的原理，以及内部都包含了什么。比如，Husky 是如何简化 Git Hooks 配置的？Lint Staged 是如何工作的？

在接下来，我们会介绍一批 TypeScript 下的 ESLint 规则，了解它们的作用，以及我们为什么需要这些规则。

## TypeScript 下的 ESLint 规则集推荐

在前面我们只是介绍了如何配置 ESLint 相关的工程，还没有具体介绍 TypeScript 下应使用哪些 ESLint 规则。为了帮助你更好地挑选适用于自己需要的规则，接下来我们会来介绍一批推荐使用的 TypeScript ESLint 规则，包括其意图（如何约束代码）与配置等。我也简单对这些规则做了分类：基础版与进阶版，基础版为约束程度较低的规则，而进阶版则较为严格。

如果你想直接使用现成的配置，我也将下面介绍的规则发布到了 npm，首先安装配置集：

```typescript
npm i eslint-config-ts-ruleset --save--dev
yarn add eslint-config-ts-ruleset --save--dev
pnpm i eslint-config-ts-ruleset --save--dev
```

然后在 ESLint 配置中启用：

```javascript
module.exports = {
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    // 基础规则
    'ts-ruleset',
    // 严格规则
    'ts-ruleset/strict',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
```

TypeScript ESLint 规则主要由四个部分组成：

- 仅在 ESLint 约束基础上支持了 TypeScript 语法解析，如缩进 indent、单双引号 quote、逗号 comma 等，这些规则我们不会做额外介绍，因为已经被包含在 `'plugin:@typescript-eslint/recommended'` 中
- 对语法的统一约束，比如类型断言有 as 和尖括号两种，可以通过规则来约束只能使用一种断言语法。以及对于某些对实际逻辑无影响，可加可不加的语法约束，如 for 循环和 `for...of` 的比较 。
- 对类型标注的约束，如禁止某些类型被用于进行标注，以及在函数返回值处要求你显式标注类型等
- 对能力的约束，如对于仅类型导入、类型声明的约束，以及非空断言、常量断言等功能的使用

基础部分的规则多是简单的语法检查和类型检查，因此我们就不做讲解。接下来我们会来了解的是严格规则组内的规则，我们进一步将其划分为**一般严格**与**较为严格**。

### 一般严格组

#### 语法统一约束

##### array-type

TypeScript 中同时支持使用 `Array<T>` 与 `T[]` 两种方式声明数组类型，此规则约束项目中对这两种数组类型声明的使用，包括仅使用 `Array<T>` 或 `T[]` 其中一种，或者对于原始类型与类型别名使用 `T[]`，对于联合类型、对象类型、函数类型等使用 `Array<T>`。

这是为什么呢？对于这种效果完全一致仅仅在使用上有差异的语法，我们需要的只是确定一个规范，然后在所有地方使用这一规范。实际上，这一类规则（还有后面的类型断言语法）就类似于单引号 / 双引号，加不加分号这种基础规则，如果你不能接受上一行代码单引号这一行代码双引号，那么也没理由能接受这里一个 `Array<number>` 那里一个 `number[]`。

##### await-thenable

只允许对异步函数、Promise、PromiseLike 使用 await 调用（也就是实现了 Thenable 接口，存在 then 方法的对象），可以避免无意义的 await 调用，同时还能帮助你发现某个异步函数忘记加 async 了。

##### consistent-type-assertions

TypeScript 支持通过 `as` 与 `<>` 两种不同的语法进行类型断言，如：

```typescript
const foo = {} as Foo;
const foo = <Foo>{};

const foo = <const>[1, 2]; // 常量断言
const foo = [1, 2, 3] as const;
```

这一规则约束使用统一的类型断言语法，我一般在 Tsx 中使用 `as` ，在其他时候尽可能的使用 `<>`，原因则是 `<>` 更加简洁。

类似于 array-type，这条规则也是主要做语法统一，但需要注意的是在 Tsx 项目中使用 `<>` 断言会导致报错，因为此时无法像泛型那样通过 `<T extends Foo>` 来显式告知编译器这里是泛型语法而非一个 JSX 组件。

##### consistent-type-definitions

TypeScript 支持通过 type 与 interface 声明对象类型，此规则可将其收束到统一的声明方式，即仅使用其中的一种。先说我是怎么做的，在绝大部分场景下，使用 interface 来声明对象类型，type 应当用于声明联合类型、函数类型、工具类型等，如：

```typescript
interface IFoo {}

type Partial<T> = {
    [P in keyof T]?: T[P];
};

type LiteralBool = "true" | "false";
```

原因主要有这么几点。

- 配合 naming-convention 规则（检查接口是否按照规范命名），我们要求接口的名称需要以大写字母 `I` 开头，我们能够在看见 `IFoo` 时立刻知道它是一个 接口，看见 `Bar` 时立刻知道它是一个类型别名。额外配置如下：

  ```js
  {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": false
        }
      }
    ]
  }
  ```

- 接口在类型编程中的作用非常局限，仅支持 extends、泛型等简单的能力，它也只应当被用于定义确定的结构体。而类型别名能够使用除 extends 以外所有的类型编程语法。同时，“类型别名”的含义也意味着，我们实际上是使用它来**归类类型**（联合类型）、**抽象类型**（函数类型、类类型）以及**封装工具类型**。

##### prefer-for-of

在你使用 for 循环遍历数组时，如果索引仅仅用来访问数组成员，则应该替换为 `for...of`：

```typescript
// ×
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// √
for (const x of arr) {
  console.log(x);
}
```

如果不是为了兼容性考虑，在仅访问索引的情况下，我们的确没有必要使用 for 循环，而应当使用语法更加简单的 `for...of`。

##### prefer-nullish-coalescing 与 prefer-optional-chain

使用 `??` 而不是 `||`，使用 `a?.b` 而不是 `a && a.b`。这是因为，逻辑或 `||` 会将 0 与 `""` 视为 false 而导致错误地应用默认值，而 `??` 则只会在 null 和 undefined 时使用默认值。可选链 `?.` 相比于逻辑与 `&&` ，则能够带来更简洁的语法（尤其是在属性访问嵌套多层时，如 `res?.data?.status`），以及与 `??` 更好的协作：`const foo = a?.b?.c?.d ?? 'default';`。

在 TypeScript 与 ECMAScript 纠葛一节中，我们还会详细介绍可选链与空值合并这两个语法。

##### consistent-type-imports

约束使用 `import type {}` 进行类型的导入，如：

```typescript
// √
import type { CompilerOptions } from 'typescript';

// x
import { CompilerOptions } from 'typescript';
```

就像我们在类型声明那一节所了解的，`import type` 能够帮助你更好地组织你的项目头部的导入结构。值导入与类型导入在 TypeScript 中使用不同的空间来存放，因此无须担心循环依赖（所以你可以**父组件导入子组件，子组件导入定义在父组件中的类型**这样）。

类似的，我们也可以通过 `consistent-type-exports` 规则，来约束只能使用 `export type` 导出类型：

```typescript
type Foo = string;

export type { Foo };
```

一个简单的、良好组织了导入语句的示例：

```typescript
import { useEffect } from 'react';

import { Button, Dialog } from 'ui';
import { ChildComp } from './child';

import { store } from '@/store'
import { useCookie } from '@/hooks/useCookie';
import { SOME_CONSTANTS } from '@/utils/constants';

import type { Foo } from '@/typings/foo';
import type { Shared } from '@/typings/shared';

import styles from './index.module.scss';
```

##### non-nullable-type-assertion-style

此规则要求在类型断言仅起到去空值作用，如将 `string | undefined` 类型断言为 `string`时，将其替换为非空断言 `!`

```typescript
const foo:string | undefined = "foo";

// √
foo!;
// x
foo as string;
```

非空断言的目的就是提供快速去除类型中 null、undefined 值的类型断言能力，这一规则的本质是检查**经过断言后的类型子集是否仅剔除了空值部分**。因此，无需担心对于多种有实际意义的类型分支的联合类型误判。

##### promise-function-async

返回 Promise 的函数必须被标记为 async。当你的函数显式返回了一个 Promise，就说明它应当是一个异步过程，就应当被标记为 async。

##### prefer-literal-enum-member

对于枚举成员值，只允许使用普通字符串、数字、null、正则，而不允许变量复制、模板字符串等需要计算的操作。虽然 TypeScript 是允许使用各种合法表达式作为枚举成员的，但由于枚举的编译结果拥有自己的作用域，因此可能导致错误的赋值，如：

```typescript
const imOutside = 2;
const b = 2;
enum Foo {
  outer = imOutside,
  a = 1,
  b = a,
  c = b,
}
```

这里 `c == Foo.b == Foo.c == 1`，还是 `c == b == 2` ? 观察下编译结果：

```typescript
"use strict";
const imOutside = 2;
const b = 2;
var Foo;
(function (Foo) {
    Foo[Foo["outer"] = imOutside] = "outer";
    Foo[Foo["a"] = 1] = "a";
    Foo[Foo["b"] = 1] = "b";
    Foo[Foo["c"] = 1] = "c";
})(Foo || (Foo = {}));
```

编译结果也说明了，枚举对象内部也是有作用域的，优先级当然比外部作用域同名变量更高。

##### prefer-as-const

对于常量断言，使用 as const 而不是 `<const>`，这一点类似于上面约束类型断言语法的 consistent-type-assertions 规则。

#### 类型约束

##### no-unnecessary-type-arguments

不允许与默认值一致的泛型参数，如：

```typescript
function foo<T = number>() {}
foo<number>();
```

与默认值一致的泛型参数是没有意义的，因为我们直接把鼠标悬浮上去就能看到实际应用的泛型类型。

#### 能力约束

##### ban-ts-comment

禁止 `@ts-` 指令的使用，或者允许其在提供了说明的情况下被使用，如：

```text
// @ts-expect-error 这里的类型太复杂，日后补上
// @ts-nocheck 未完成迁移的文件
```

此规则推荐与 `prefer-ts-expect-error` 一同搭配使用，让你的项目里不再出现 ts-ignore 指令。而如果说乱写 any 叫 AnyScript，那么乱写 `@ts-ignore` 就可以叫 IgnoreScript 了。

##### prefer-ts-expect-error

使用 `@ts-expect-error` 而不是 `@ts-ignore`。

在类型声明与类型指令一节我们已经了解到， `@ts-ignore` 与 `@ts-expect-error` 二者的区别主要在于，前者是 ignore，直接放弃了下一行的类型检查而无论下一行是否真的有错误，而后者则是期望下一行确实存在一个错误，并且会在实际不存在错误时反而抛出一个错误。

这一类干涉代码检查指令的使用本就应该慎之又慎，在任何情况下都不应该被作为逃生舱门（因为它真的比 any 还好用）。如果你一定要用，也要确保用得恰当。

##### no-extra-non-null-assertion

不允许额外的重复非空断言：

```typescript
// x
function foo(bar: number | undefined) {
  const bar: number = bar!!!;
}
```

额外的非空断言是无意义的，只要一次非空断言就能移除掉 null 与 undefined 类型了。

##### no-non-null-asserted-nullish-coalescing

不允许非空断言与空值合并同时使用，如 `bar! ?? tmp`。

非空断言可以用于移除掉一个类型中的 null 与 undefined，而空值合并则在左侧值为 null 或 undefined 时应用一个默认值，这么结合使用将非常有害，你的同事看到它会陷入思考：**bar 到底会不会有空值的时候**？

##### no-non-null-asserted-optional-chain

不允许非空断言与可选链同时使用，如 `foo?.bar!`。和上一条规则类似，属于非常有害的结合使用方式。同时这也意味着，你对 `!` `??` `?.` 的理解存在着不当之处。

##### no-unnecessary-type-assertion

不允许与实际值一致的类型断言，如：`const foo = 'foo' as string`。类似于不允许默认值一致的泛型，这条规则的目的也是减少不必要的类型代码。

##### no-unnecessary-type-constraint

不允许与默认约束一致的泛型约束，如：`interface FooAny<T extends any> {}`。仍然是出于简化代码的考虑，在 TS 3.9 版本以后，对于未指定的泛型约束，默认使用 `unknown` ，在这之前则是 `any`，这也就意味着没必要再多写 `extends unknown` 了。

### 较为严格组

#### 语法统一约束

##### method-signature-style

方法签名的声明方式有 method 与 property 两种，区别如下：

```typescript
// method
interface T1 {
  func(arg: string): number;
}

// property
interface T2 {
  func: (arg: string) => number;
}
```

此规则将声明方式进行约束，推荐使用第二种的 property 方式。

其实这一规则的核心原因，我们在协变与逆变一节已经了解过了。首先，method 方式类似于在 Class 中定义方法，而 property 则是就像定义普通的接口属性，只不过它的值是函数类型。推荐使用 property 的最重要原因是，通过使用 属性 + 函数值 的方式定义，作为值的函数的类型能享受到更严格的类型校验（ `strictFunctionTypes`），此配置会使用逆变（*contravariance*）而非协变（*covariance*）的方式进行函数参数的检查。

#### 类型约束

##### ban-types

禁止部分值被作为类型标注，此规则能够对每一种被禁用的类型提供特定的说明来在触发此规则报错时给到良好的提示。

这条规则常见的场景是禁用 `{}`、`Function`、`object` 这些类型。

- 使用 `{}` 会让你寸步难行：`类型 {} 上不存在属性 'foo'`，所以用了 `{}` 你大概率在下面还需要类型断言回去或者变 any。同时别忘了 `{}` 作为万物起源的特性。
- `object` 的使用在大部分情况下都是错误的，别忘了它实际上表示所有非原始类型的类型。对于未知的对象类型，应使用 `Record<string, unknown>` 或者 `Record<string, any>`。
- 对于函数类型，应使用入参、返回值被标注出来的具体类型：`type SomeFunc = (arg1: string) => void` ，或在入参与返回值类型未知的场景下使用 `type SomeFunc = (...args: any[]) => any`。

##### no-empty-interface

不允许定义空的接口，可配置为允许单继承下的空接口：

```typescript
// x
interface Foo {}

// √
interface Foo extends Bar {}
```

没有父类型的空接口实际上就等于 `{}`，虽然无法不确定你使用它是为了什么，但它显然是不对的。而单继承的空接口场景则更常见，比如可以先确定下继承关系，再在后续添加成员。

##### no-explicit-any

不允许显式的 any 类型。

此前我们已经了解过 any 类型的弊端，甚至 TypeScript 专门引入了 unknown 类型来尝试堵上一些口子。然而即使这样，很多场景下考虑到成本，我们还是会使用 any 。因此实际上这条规则只被设置为 warn 等级，真的做到一个 any 不用，或是全部替换成 unknown + 类型断言，都是成本极高的，需要团队所有人都有着严格的代码质量意识。如果你真的想这么做，我推荐配合 tsconfig 的 `--noImplicitAny` 来检查隐式 any ，来尽可能抹除代码中 的 any。

##### no-inferrable-types

不允许不必要的类型标注，但可配置为允许类的属性成员、函数的属性成员进行额外标注。

```typescript
const foo: string = "linbudu";

class Foo {
	prop1: string = "linbudu";
}

function foo(a: number = 5, b: boolean = true) {
  // ...
}
```

对于普通变量来说，与实际赋值一致的类型标注确实是没有意义的，TypeScript 的控制流分析能很好地进行类型自动推导。而对于函数参数与类属性，允许其进行类型标注则主要是为了确保一致性，即函数的所有参数（包括重载的各个声明）、类的所有属性都有类型标注，而不是仅为不存在初始值的参数/属性进行标注。

##### explicit-module-boundary-types

函数与类方法的返回值需要被显式指定，而不是依赖类型推导，如：

```typescript
const foo = (): Foo => {}
```

通过显式指定返回值类型，我们可以直观区分函数的功能，如是否携带副作用，以及是否有返回值等，同时显式指定的函数返回值类型也能在一定程度上提升 TypeScript Compiler 性能。

在这一点上可能会有比较大的分歧，认为它成本太高。而我认为首先 TypeScript 强大的类型推导能力是能够直接为你推导出最终返回值类型的，你完全可以直接复制上去。其次，显式标注返回值类型也能够通过上下文类型的能力（即实际 return 的值类型和你自己标注的返回值类型是否一致），帮助你确保最终返回的类型一定是你预期的那个类型。

#### 能力约束

##### no-unnecessary-boolean-literal-compare

不允许对布尔类型变量的 === 比较，如：

```typescript
declare const someCondition: boolean;
if (someCondition === true) {
}
```

首先，记住我们是在写 TypeScript，所以不要想着你的变量值还有可能是 null，所以需要这样判断，如果真的发生了，那么说明你的 TS 类型标注并不准确——这条规则是通过变量类型来进行判断的。虽然此规则的配置项允许 `boolean | null` 这样的值与 true / false 进行比较，但还是让你的类型更精确一些更好。

##### no-throw-literal

不允许直接 throw 一个字符串如：`throw 'err'`，只能抛出 Error 或基于 Error 派生类的实例，如：`throw new Error('Oops!')`。

抛出的 Error 实例能够自动的收集调用栈信息，同时借助 **[proposal-error-cause](https://link.juejin.cn/?target=http%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fgithub.com%2Ftc39%2Fproposal-error-cause)** 提案，还能够跨越调用栈来附加错误原因传递上下文信息。

##### switch-exhaustiveness-check

switch 的判定变量为联合类型时，其每一个类型分支都需要被处理。如：

```typescript
type PossibleTypes = 'linbudu' | 'qiongxin' | 'developer';

let value: PossibleTypes;
let result = 0;

switch (value) {
  case 'linbudu': {
    result = 1;
    break;
  }
  case 'qiongxin': {
    result = 2;
    break;
  }
  case 'developer': {
    result = 3;
    break;
  }
}
```

联合类型变量中每一条类型分支可能都需要特殊的处理逻辑，此规则可以避免你新增了一个类型分支却没有为它分配对应的处理逻辑。

在内置类型一节，我们还了解了通过 TypeScript 中的 never 类型来实现编译时的检验：

```typescript
const strOrNumOrBool: string | number | boolean = false;

if (typeof strOrNumOrBool === "string") {
  console.log("str!");
} else if (typeof strOrNumOrBool === "number") {
  console.log("num!");
} else if (typeof strOrNumOrBool === "boolean") {
  console.log("bool!");
} else {
  const _exhaustiveCheck: never = strOrNumOrBool;
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`);
}
```

##### restrict-template-expressions

模板字符串中的计算表达式其返回值必须是字符串，此规则可以被配置为允许数字、布尔值、可能为 null 的值以及正则表达式，或者你也可以允许任意的值，但这样这条规则就形同虚设了。

在模板表达式中，非字符串与数字以外的值很容易带来潜在的问题，如：

```typescript
const arr = [1, 2, 3];
const obj = { name: 'linbudu' };

// 'arr: 1,2,3'
const str1 = `arr: ${arr}`;
// 'obj: [object Object]'
const str2 = `obj: ${obj}`;
```

无论哪种情况都不会是你想看到的。推荐在规则配置中仅开启 `allowNumber` 来允许数字，而禁止掉其他的类型，你需要确保在把其他类型变量填入模板插槽中时，进行一次具有实际逻辑的转化。

##### prefer-reduce-type-parameter

我们在泛型一节中曾经介绍过数组 reduce 方法的各种重载，比如下面这种：

```typescript
const arr: number[] = [1, 2, 3];

// 报错：不能将 number 类型的值赋值给 never 类型
const result = arr.reduce((prev, curr, idx, arr) => {
  return [...prev, curr]
}, []);
```

虽然我们知道 result 最终的结果会仍然是 `number[]` 类型，但这里仍然会有类型报错，原因就在于这里 reduce 通过 `[]` 进行类型推导，得到了一个 `never[]` 类型，要解决也很简单，只要给 reduce 显式传入泛型参数即可：

```typescript
const result = arr.reduce<number[]>((prev, curr, idx, arr) => {
  return [...prev, curr]
}, []);
```

这一规则就是为了确保在所有情况下你都显式为 reduce 调用传入了泛型，这样一来你就能自己确定它最终的返回值类型，而不是依赖类型推导了。

##### triple-slash-reference

这一规则的目的在于禁止你使用三斜线指令，而是使用 import 来进行类型的导入。正如我们上一节所了解的那样：

```typescript
// × 不推荐使用
/// <reference types="vite/client" />

// √ 使用 import type 来声明对这个声明文件的依赖
import type * as ViteClientEnv from 'vite/client';
```

## 总结与预告

在这一节，我们学习了 TypeScript 下的 ESLint 配置，以及为了实现更好约束引入的 Prettier 与 Git Hooks。实际上，它们就是你开始提升自己代码质量的第一步，也是团队协作开发下的基础要求之一。除了如何配置，我们还了解了一批推荐使用的 TypeScript ESLint 规则，明白了它们的功能与意义。

在下一节，我们会在工程实践的道路上更进一步，了解一批基本涵盖了整个 TypeScript 项目开发周期的工具库，说不定就有你刚好在找的那个。