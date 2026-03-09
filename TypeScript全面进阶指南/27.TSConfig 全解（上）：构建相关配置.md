在前面的内容中，我们已经学习了 TypeScript 在工程中的许多实践，包括类型声明、TypeScript 与 React、ESLint 的结合使用以及装饰器等。这些实践更像是上层建筑，默认是在一个已经基本配置完环境的 TypeScript 项目中进行的。这一节，我们深入下层基础，来了解 TypeScript 工程中最基础的一部分：TSConfig 配置。

为什么选择现在才讲配置呢？因为在前面的工程实践中，我们并不需要自己去修改 TSConfig，脚手架已经帮我们处理好了。有了实践经验，再来讲解讲解这些配置效果会更好。

为了避免罗列配置这种填鸭式教学，我将 TSConfig 分为三个大类：**构建相关**、**类型检查相关**以及**工程相关**。这其实也对应着我们的开发流程：使用工程能力进行项目开发，检查源码是否符合配置约束，然后才是输出产物。每一个大类又可以划分为几个小类，比如构建相关又可以分为**构建源码相关**与**构建产物相关**等等，我们会按照这些分类的方式进行聚合地讲解。

最后，正如我对这本小册的定位也包括工具书一样，当你在实际项目开发遗忘了某一项具体配置的作用，或者发现某一配置表现不符合预期，都可以回到这里来寻找答案。

这一节我们主要介绍构建相关的配置。

## 构建相关

### 构建源码相关

#### 特殊语法相关

##### experimentalDecorators 与 emitDecoratorMetadata

这两个选项都和装饰器有关，其中 experimentalDecorators 选项用于启用装饰器的 `@` 语法，而 emitDecoratorMetadata 配置则影响装饰器实际运行时的元数据相关逻辑，我们在装饰器一节中已经了解了此选项对实际编译代码的作用：

```javascript
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

__decorate([
    Prop(),
    __metadata("design:type", String) // 来自于 emitDecoratorMetadata 配置，其它 __metadata 方法同
], Foo.prototype, "prop", void 0);

__decorate([
    Method(),
    __param(0, Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Foo.prototype, "handler", null);

Foo = __decorate([
    Cls(),
    __param(0, Param()),
    __metadata("design:paramtypes", [String])
], Foo);
```

##### jsx、jsxFactory、jsxFragmentFactory 与 jsxImportSource

这部分配置主要涉及 jsx(tsx) 相关的语法特性。其中，jsx 配置将直接影响 JSX 组件的构建表现，常见的主要有 `react` （将 JSX 组件转换为对 `React.createElement` 调用，生成 `.js` 文件）、`preserve`（原样保留 JSX 组件，生成 `.jsx` 文件，你可以接着让其他的编译器进行处理）、`react-native` （类似于 preserve，但会生成 `.js` 文件）。

如果你希望使用特殊的 jsx 转换，也可以将其配置为 `react-jsx` / `react-jsxdev`，这样 JSX 组件会被转换为对 `__jsx` 方法的调用与生成 `.js` 文件，此方法来自于 `react/jsx-runtime`。

```jsx
// react
import React from 'react';
export const helloWorld = () => React.createElement("h1", null, "Hello world");

// preserve / react-native
import React from 'react';
export const helloWorld = () => <h1>Hello world</h1>;

// react-jsx
import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
export const helloWorld = () => _jsx("h1", { children: "Hello world" });
 
// react-jsxdev
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
const _jsxFileName = "/home/runner/work/TypeScript-Website/TypeScript-Website/index.tsx";
import React from 'react';
export const helloWorld = () => _jsxDEV("h1", { children: "Hello world" }, void 0, false, { fileName: _jsxFileName, lineNumber: 9, columnNumber: 32 }, this);
```

除了 jsx 以外，其它 jsx 相关配置使用较少，我们简单了解即可。

- jsxFactory，影响负责最终处理转换完毕 JSX 组件的方法，默认即为 `React.createElement`。如果你想使用 `preact.h` 作为处理方法，可以将其配置为 `h`。

- jsxFragmentFactory，类似 jsxFactory，只不过它影响的是 Fragment 组件（`<></>`）的提供方。jsxFactory 与 jsxFragmentFactory 均是 TS 4.1 版本以前用于实现自定义 JSX 转换的配置项，举例来说，当设置了 `"jsx": "react"`，此时将 jsxFragmentFactory 设置为 `Fragment` ，同时将 jsxFactory 设置为 `h`：

  ```jsx
  import { h, Fragment } from "preact";
  const HelloWorld = () => (
    <>
      <div>Hello</div>
    </>
  );
  
  // 转换为以下代码
  const preact_1 = require("preact");
  const HelloWorld = () => ((0, preact_1.h)(preact_1.Fragment, null,
      (0, preact_1.h)("div", null, "Hello")));
  ```

  为了简化自定义 JSX 转换的配置，4.1 版本以后 TS 支持使用 jsxImportSource 属性快速地调整。

- jsxImportSource，当你的 jsx 设置为 `react-jsx` / `react-jsxdev` 时，指定你的 `jsx-runtime` / `jsx-dev-runtime` 从何处导入。如设置为 `preact` 时，会从 `preact/jsx-runtime` 导入 `_jsx` 函数，用于进行 JSX 组件的转换。类似的，在另一个类 React 框架 Solid 中，也将此配置修改为了自己的实现： `"jsxImportSource": "solid-js"`。

这也是 React 17 中的变化之一，在 17 版本前后的构建后代码如下：

```js
// v17 前
import React from 'react';

function App() {
  return React.createElement('h1', null, 'Hello world');
}

// v17 后
import {jsx as _jsx} from 'react/jsx-runtime';

function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```

这也是在 17 版本以后，不需要再确保代码中导入了 React 就能使用 JSX 的原因。

##### target 与 lib、noLib

target 配置决定了你的构建代码使用的语法，常用值包括 es5、es6、es2018、es2021、esnext（基于目前的 TypeScript 版本所支持的最新版本） 等等。某些来自于更高版本 ECMAScript 的语法，会在编译到更低版本时进行语法的降级，常见的如异步函数、箭头函数、bigint 数据类型等。

类似的，在 Babel 中也有 targets 的概念。但这里的 targets 通常指的是预期运行的浏览器，如 chrome 89，然后基于 browserlist 获取浏览器信息，基于 [caniuse](https://link.juejin.cn/?target=https%3A%2F%2Fcaniuse.com%2F) 或者 compat-table 获取各个浏览器版本支持的特性，最后再进行语法的降级。

如果没有特殊需要，推荐将 target 设置为 `"es2018"`，一个对常用语法支持较为全面的版本。

更改 target 配置也会同时影响你的 lib 配置默认值，而它决定了你是否能使用某些来自于更新版本的 ECMAScript 语法，以 replaceAll 为例，如果你直接在项目中使用：

```typescript
'linbudu'.replaceAll('d', 'dd');
```

此时，如果你的 lib 配置中不包含 `"es2021"` 或者 `"es2021.String"`，上面的代码就会给出一个错误提示：***属性“replaceAll”在类型“"linbudu"”上不存在。是否需要更改目标库? 请尝试将 “lib” 编译器选项更改为“es2021”或更高版本***。

正如我们在类型声明一节中了解的，TypeScript 会自动加载内置的 `lib.d.ts` 等声明文件，而加载哪些文件则和 lib 配置有关。当我们配置了 `"es2021"` 或者 `"es2021.String"`，replaceAll 方法对应的声明文件 `lib.es2021.string.d.ts` 就会被加载，然后我们的 String 类型上才有了 lib 方法。

除了高版本语法以外，lib 其实也和你的实际运行环境有关。比如，当你的代码仅在 Node 环境下运行时，你的 lib 中不应当包含 `"DOM"` 这个值。对应的，代码中无法使用 window 、document 等全局变量。

而 target 对 lib 的影响在于，当你的 target 为更高的版本时，它会自动地将这个版本新语法对应的 lib 声明加载进来，以上面的代码为例， target 为 `"es2021"` 时，你不需要添加 `"es2021"` 到 lib 中也能使用 ECMAScript2021 的新方法 replaceAll。这是因为既然你的编译产物都到这个版本了，那你当然可以直接使用这个方法啦。

如果你希望使用自己提供的 lib 声明定义，可以启用 noLib 配置，这样 TypeScript 将不会去加载内置的类型定义，但你需要为所有内置对象提供类型定义（String，Function，Object 等）才能进行编译。如果你的运行环境中存在大量的定制方法，甚至对原本的内置方法做了覆盖，就可以使用此配置来加载自己的类型声明。

最后，target 与 lib 配置会随着 TS 的版本更新而新增可用的值，如在 4.6 版本新增了 `es2022`这一选项，支持了 `Array.at()`、`Error Cause` 等新的语言特性。

### 构建解析相关

这部分配置主要控制源码解析，包括从何处开始收集要构建的文件，如何解析别名路径等等。

#### files、include 与 exclude

这三个选项决定了将被包括到本次编译的代码文件。使用 files 我们可以描述本次包含的所有文件，但不能使用 `src` 或者 `src/*` 这种方式，每个值都需要是完整的文件路径，适合在小型项目时使用：

```json
{
  "compilerOptions": {},
  "files": [
    "src/index.ts",
    "src/handler.ts"
  ]
}
```

如果你的文件数量较多，或者分散在各个文件夹，此时可以使用 include 和 exclude 进行配置，在这里可以传入文件夹或者 `src/*` 这样的 glob pattern，也可以传入完整的文件路径。

include 配置方式参考：

```json
{
  "include": ["src/**/*", "generated/*.ts", "internal/*"]
}
```

其中，`src/**/*` 表示匹配 src下所有的合法文件，而无视目录层级。而 `internal/*` 则只会匹配 internal 下的文件，不会匹配 `internal/utils/` 下的文件。这里的合法文件指的是，在不包括文件扩展名（`*.ts`）的情况下只会匹配 `.ts` / `.tsx` / `.d.ts` / `.js` / `.jsx` 文件（js 和 jsx 文件需要启用 allowJs 配置时才会被包括）。

由于我们会在 include 中大量使用 glob pattern 来一次性匹配许多文件，如果存在某些非预期的文件也符合这一匹配模式，比如 `src/handler.test.ts` `src/file-excluded/` 这样，此时专门为需要匹配的文件书写精确的匹配模式就太麻烦了。因此，我们可以使用 exclude 配置，来从被 include 匹配到的文件中再移除一部分，如：

```json
{
  "include": ["src/**/*", "generated/*.ts", "internal/*"],
  "exclude": ["src/file-excluded", "/**/*.test.ts", "/**/*.e2e.ts"]
}
```

需要注意的是，**exclude 只能剔除已经被 include 包含的文件**。

#### baseUrl

这一配置可以定义文件进行解析的根目录，它通常会是一个相对路径，然后配合 tsconfig.json 所在的路径来确定根目录的位置。

```text
project
├── out.ts
├── src
├──── core.ts
└── tsconfig.json
```

在这个结构下，如果配置为 `"baseUrl": "./"`，根目录就会被确定为 project。

你也可以通过这一配置，在导入语句中使用相对 baseUrl 的解析路径。如在上面根目录已经确定为 project，在 `out.ts` 中，你就可以直接使用基于根目录的绝对路径导入文件：

```typescript
import "src/core"; // TS 会自动解析到对应的文件，即 "./src/core.ts"
```

#### rootDir

rootDir 配置决定了项目文件的根目录，默认情况下它是项目内**包括**的所有 .ts 文件的最长公共路径，这里有几处需要注意：

- **包括**指的是 include 或 files 中包括的 `.ts` 文件，这些文件一般来说不会和 tsconfig.json 位于同一目录层级；
- 不包括 `.d.ts` 文件，因为声明文件可能会和 tsconfig.json 位于同一层级。

最长公共路径又是什么？简单地说，它就是某一个**包含了所有被包括的 `.ts` 文件的文件夹**，TypeScript 会找到这么一个文件夹，默认将其作为 rootDir。

```text
PROJECT
├── src
│   ├── index.ts
│   ├── app.ts
│   ├── utils
│   │   ├── helpers.ts
├── declare.d.ts
├── tsconfig.json
```

在这个例子中，rootDir 会被推断为 src。

```text
PROJECT
├── env
│   ├── env.dev.ts
│   ├── env.prod.ts
├── app
│   ├── index.ts
├── declare.d.ts
├── tsconfig.json
```

在这个例子中，rootDir 会被推断为 `.`，即 `tsconfig.json` 所在的目录。

构建产物的目录结构会受到这一配置的影响，假设 outDir 被配置为 `dist`，在上面的第一种情况下，最终的产物会被全部放置在 dist 目录下，保持它们在 `src`（也就是 rootDir） 内的目录结构：

```text
PROJECT
├── dist
│   ├── index.js
│   ├── index.d.ts
│   ├── app.js
│   ├── app.d.ts
│   ├── utils
│   │   ├── helpers.js
│   │   ├── helpers.d.ts
```

如果你将 rootDir 更改为推导得到的 rootDir 的父级目录，比如在这里把它更改到了项目根目录 `.`。此时 `src` 会被视为 rootDir 的一部分，因此最终构建目录结构中会多出 `src` 这一级：

```text
PROJECT
├── dist
├── ├──src
│      ├── index.js
│      ├── index.d.ts
│      ├── app.js
│      ├── app.d.ts
│      ├── utils
│      │   ├── helpers.js
│      │   ├── helpers.d.ts
```

需要注意的是，如果你显式指定 rootDir ，需要确保其包含了所有 **“被包括”** 的文件，因为 TypeScript 需要确保这所有的文件都被生成在 outDir 内。

```text
PROJECT
├── src
│   ├── index.ts
│   ├── app.ts
│   ├── utils
│   │   ├── helpers.ts
├── env.ts
├── tsconfig.json
```

在这个例子中，如果你指定 rootDir 为 `src` ，会导致 `env.ts` 被生成到 `<project>/env.js` 而非 `<project>/dist/env.js` 。

#### rootDirs

rootDirs 就是复数版本的 rootDir，它接收一组值，并且会将这些值均视为平级的根目录：

```json
{
  "compilerOptions": {
    "rootDirs": ["src/zh", "src/en", "src/jp"]
  }
}
PROJECT
├── src
│   ├── zh
│   │   ├── locale.ts
│   ├── en
│   │   ├── locale.ts
│   ├── jp
│   │   ├── locale.ts
│   ├── index.ts
├── tsconfig.json
```

使用 rootDirs，TypeScript 还是会隐式地推导 rootDir，此时它的值为 rootDirs 中所有文件夹最近的公共父文件夹，在这里即是 `src`。你肯定会想，那 rootDirs 还有什么用？实际上它主要用于实现**多个虚拟目录的合并解析**。还是以上面的例子为例，假设我们的目录结构是现在这样的：

```text
PROJECT
├── src
│   ├── locales
│   │   ├── zh.locale.ts
│   │   ├── en.locale.ts
│   │   ├── jp.locale.ts
│   ├── index.ts
│── generated
│   ├── messages
│   │   ├── main.mapper.ts
│   │   ├── info.mapper.ts
├── tsconfig.json
```

在这个目录结构中，`locales` 下存放我们定义的每个语言的对应翻译，`generated/messages` 则是通过扫描项目获得所有需要进行代码替换位置后生成的映射关系，我们在 `.locale.ts` 文件中会导入其中的 mapper 文件来生成对应的导出。

虽然现在 locale 文件和 mapper 文件被定义在不同的目录下，但在构建产物中它们实际上是位于同一层级的：

```text
│── dist
│   ├── zh.locale.js
│   ├── en.locale.js
│   ├── jp.locale.js
│   ├── main.mapper.js
│   ├── info.mapper.js
```

这也就意味着，我们应当是在 locale 文件中直接通过 `./main.mapper` 的路径来引用 mapper 文件的，而不是 `../../generated/messages/main.mapper.ts` 这样。

此时，我们就可以利用 rootDirs 配置来让 TS 将这两个相隔甚远的文件夹视为处于同一目录下：

```json
{
  "compilerOptions": {
    "rootDirs": ["src/locales", "generated/messages"]
  }
}
```

这一配置并不会影响实际的产物生成，它只会告诉 TS 将这两个模块视为同一层级下（类型定义层面）。

#### types 与 typeRoots

默认情况下，TypeScript 会加载 `node_modules/@types/` 下的所有声明文件，包括嵌套的 `../../node_modules/@types` 路径，这么做可以让你更方便地使用第三方库的类型。但如果你希望只加载实际使用的类型定义包，就可以通过 types 配置：

```json
{
  "compilerOptions": {
    "types": ["node", "jest", "react"]
  }
}
```

在这种情况下，只有 `@types/node`、`@types/jest` 以及 `@types/react` 会被加载。

即使其他 `@types/` 包没有被包含，它们也仍然能拥有完整的类型，但其中的全局声明（如 `process`，`expect`，`describe` 等全局变量）将不会被包含，同时也无法再享受到基于类型的提示。

如果你甚至希望改变加载 `@types/` 下文件的行为，可以使用 typeRoots 选项，其默认为 `@types`，即指定 `node_modules/@types` 下的所有文件（仍然包括嵌套的）。

```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./node_modules/@team-types", "./typings"],
    "types": ["react"],
    "skipLibCheck": true
  }
}
```

以上配置会尝试加载 `node_modules/@types/react` 以及 `./node_modules/@team-types/react` 、`./typings/react` 中的声明文件，注意我们需要使用**相对于 baseUrl 的相对路径**。

加载多个声明文件可能会导致内部的声明冲突，所以你可能会需要 skipLibCheck 配置来禁用掉对加载的类型声明的检查。

#### moduleResolution

这一配置指定了模块的解析策略，可以配置为 node 或者 classic ，其中 node 为默认值，而 classic 主要作向后兼容用，基本不推荐使用。

首先来看 node 解析模式，从名字也能看出来它其实就是与 node 一致的解析模式。假设我们有个 `src/index.js`，其中存在基于相对路径 `const foo = require("./foo")` 的导入，则会依次按照以下顺序解析：

- `/<root>/<project>/src/foo.js` 文件是否存在？

- ```
  /<root>/<project>/src/foo
  ```

   

  是否是一个文件夹？

  - 此文件夹内部是否包含 `package.json`，且其中使用 `main` 属性描述了这个文件夹的入口文件？
  - 假设 `main` 指向 `dist/index.js`，那这里会尝试寻找 `/<root>/<project>/src/foo/dist/index.js` 文件
  - 否则的话，说明这个文件不是一个模块或者没有定义模块入口，我们走默认的 `/foo/index.js` 。

而对于绝对路径，即 `const foo = require("foo")`，其只会在 `node_modules` 中寻找，从 `/<root>/<project>/src/node_modules` 开始，到 `/<root>/<project>/node_modules` ，再逐级向上直到根目录。

TypeScript 在这基础上增加了对 `.ts` `.tsx` 和 `.d.ts` （优先级按照这一顺序）扩展名的文件解析，以及对 `package.json` 中 `types` 字段的加载。

而对于 classic 模式，其解析逻辑可能不太符合直觉，其相对路径导入与绝对路径导入均不会解析 `node_modules` 中的文件。对于相对路径导入 `import foo from "./foo"`，它只会尝试 `/<root>/<project>/src/foo.ts` 和 `/<root>/<project>/src/foo.d.ts`。

而对于绝对路径导入 `import foo from "foo"`，它会按照以下顺序来解析：

- `/<root>/<project>/src/foo.ts(.d.ts)`
- `/<root>/<project>/foo.ts(.d.ts)`
- `/<root>/foo.ts(.d.ts)`
- `/foo.ts(.d.ts)`

绝大部分情况下你不会需要 classic 作为配置值，这里仅做了解即可。

#### moduleSuffixes

此配置在 4.7 版本被引入，类似于 moduleResolution ，它同样影响对模块的解析策略，但仅影响模块的后缀名部分。如以下配置：

```json
{
    "compilerOptions": {
        "moduleSuffixes": [".ios", ".native", ""]
    }
}
```

此配置在解析文件时，会首先尝试查找 `foo.ios.ts`，然后是 `foo.native.ts`，最后才是 `foo.ts`（注意，需要最后的空字符串`""`配置）。很明显，这一配置主要是为了 React Native 配置中的多平台构建配置。但你可以用它在 Angular 项目中，确保所有文件都使用了一个额外的后缀名，如 `user.service.ts`、`user.module.ts` 等。

#### noResolve

默认情况下， TypeScript 会将你代码中导入的文件也解析为程序的一部分，包括 import 导入和三斜线指令的导入，你可以通过禁用这一配置来阻止这个解析过程。

需要注意的是，虽然导入过程被禁用了，但你仍然需要确保导入的模块是一个合法的模块。

```typescript
// 开启此配置后，这个指令指向的声明文件将不会被加载！
/// <reference path="./other.d.ts" />
```

#### paths

paths 类似于 Webpack 中的 alias，允许你通过 `@/utils` 或类似的方式来简化导入路径，它的配置方式是这样的：

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/utils/*": ["src/utils/*", "src/other/utils/*"]
    }
  }
}
```

需要注意的是，paths 的解析是基于 baseUrl 作为相对路径的，因此需要确保指定了 baseUrl 。在填写别名路径时，我们可以传入一个数组，TypeScript 会依次解析这些路径，直到找到一个确实存在的路径。

#### resolveJsonModule

启用了这一配置后，你就可以直接导入 Json 文件，并对导入内容获得完整的基于实际 Json 内容的类型推导。

```json
{
    "repo": "TypeScript",
    "dry": false,
    "debug": false
}
import settings from "./settings.json";
 
settings.debug === true;
// 对应的类型报错
settings.dry === 2;
```

### 构建产物相关

#### 构建输出相关

##### outDir 与 outFile

这两个选项决定了构建产物的输出文件。其中 outDir 配置的值将包括所有的构建产物，通常情况下会按照原本的目录结构存放：

```bash
src
├── core
├──── handler.ts
└── index.ts
dist
├── core
├──── handler.js
├──── handler.d.ts
├── index.js
├── index.d.ts
src
├── core
├──── handler.ts
└── index.ts
```

而 outFile 类似于 Rollup 或 ESBuild 中的 bundle 选项，它会将所有的产物（其中非模块的文件）打包为单个文件，但仅能在 module 选项为 None / System / AMD 时使用。

##### preserveConstEnums

在字面量类型与枚举一节中了解过，常量枚举会在编译时被抹除，对其成员的引用会直接使用原本的值来替换。这一配置项可以改变此行为，让常量枚举也像普通枚举那样被编译为一个运行时存在的对象。

##### noEmit 与 noEmitOnError

这两个选项主要控制最终是否将构建产物实际写入文件系统中，其中 noEmit 开启时将不会写入，但仍然会执行构建过程，因此也就包括了类型检查、语法检查与实际构建过程。而 noEmitOnError 则仅会在构建过程中有错误产生才会阻止写入。

一个常见的实践是，使用 ESBuild / SWC 等工具进行实际构建，使用 `tsc --noEmit` 进行类型检查过程。

##### module

这一配置控制最终 JavaScript 产物使用的模块标准，常见的包括 CommonJs、ES6、ESNext 以及 NodeNext 等（实际的值也可以是全小写的形式）。另外也支持 AMD、UMD、System 等模块标准。

TypeScript 会随着版本更新新增可用的 module 选项，如在 4.5 版本新增了 `es2022` 配置，支持了 Top-Level Await 语法。在 4.7 版本还新增了 `node16` 和 `nodenext` 两个 module 配置，使用这两个配置意味着你构建的 npm 包或者代码仅在 node 环境下运行，因此 TypeScript 会对应地启用对 Node ESM 的支持。

##### importHelpers 与 noEmitHelpers

由于 TypeScript 在编译时除了抹除类型，还需要基于 target 进行语法降级，这一功能往往需要一些辅助函数，将新语法转换为旧语法的实现， 如 async 函数。

在同样能实现语法降级的 Babel 中，这一功能是通过 core-js （原`@babel/polyfill`） 实现的。在 TypeScript 中这些辅助函数被统一封装在了 [tslib](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Ftslib) 中，通过启用 importHelpers 配置，这些辅助函数就将从 tslib 中导出而不是在源码中定义，能够有效地帮助减少构建产物体系。

举例来说，ES 6 中引入的 rest 操作符，在降低情况下会编译为这样的产物：

```js
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
var __read = (this && this.__read) || function (o, n) {
   // ...
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    // ...
};
export function fn(arr) {
    var arr2 = __spreadArray([1], __read(arr), false);
}
```

在启用 importHelpers 后，辅助函数 `__read` 和 `__spreadArray` 都将从 tslib 中导出：

```js
import { __read, __spreadArray } from "tslib";
export function fn(arr) {
    var arr2 = __spreadArray([1], __read(arr), false);
}
```

如果你希望使用自己的实现，而非完全从 tslib 中导出，就可以使用 noEmitHelpers 配置，在开启时源码中仍然会使用这些辅助函数，不会存在从 tslib 中导入的过程。因此，此时需要你在全局命名空间下来提供同名的实现。

##### downlevelIteration

ES6 新增了 `for...of` 循环，它可以用于循环遍历所有部署了 `[Symbol.iterator]` 接口的数据结构，如数组、Set、Map，甚至还包括字符串。

在默认情况下，如果 target 为 ES5 或更低，`for...of` 循环会被降级为普通的基于索引的 for 循环：

```js
// 源代码
const str = "Hello!";
for (const s of str) {
  console.log(s);
}

// 降级
"use strict";
var str = "Hello!";
for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
    var s = str_1[_i];
    console.log(s);
}
```

然而在某些情况下，降级到普通的 for 循环可能造成运行结果不一致，比如一个 emoji 字符在 `for...of` 循环中只会被遍历一次，而其实际 length 为 2，因此在 for 循环中会被拆开来分别遍历 2 次。

这种情况下我们的预期应当是仍然保留为 `for...of` 循环，此时就可以启用 downlevelIteration 配置，同时在运行环境中确保 `[Symbol.iterator]` 接口的存在（如通过 polyfill），这样就可以保留 `for...of` 循环的实现。

需要注意的是，启用这一配置只是意味着 TS 会在构建产物中引入辅助函数，判断在 `[Symbol.iterator]` 接口存在时保留 `for...of` 循环，否则降级为普通的基于索引的 for 循环，因此你仍然需要自己引入 polyfill。

##### importsNotUsedAsValues 与 preserveValueImports

默认情况下，TypeScript 就在编译时去抹除仅类型导入（import type），但如果你希望保留这些类型导入语句，可以通过更改 importsNotUsedAsValues 配置的值来改变其行为。默认情况下，此配置的值为 remove，即对仅类型导入进行抹除。你也可以将其更改为 preserve，这样所有的导入语句都会被导入（但是类型变量仍然会被抹除）。或者是 error，在这种情况下首先所有导入语句仍然会被保留，但会在值导入仅被用于类型时产生一个错误。

举例来说，以下代码中的仅类型导入会在 preserve 或 error 时保留：

```typescript
// foo.ts
export type FooType = any;

init();

// index.ts
import type { FooType } from "./foo";
import {} from "./foo";
```

这样 foo 文件中的 `init()`也就是副作用，仍然能够得到执行。

类似的，还有一个控制导入语句构建产物的配置，preserveValueImports。它主要针对的是值导入（即非类型导入或混合导入），这是因为在某些时候我们的值导入可能是通过一些奇怪的方式使用的：

```js
import { Animal } from "./animal";

eval("console.log(new Animal().isDangerous())");
```

preserveValueImports 配置会将所有的值导入都保留下来，

如果你使用 Babel 等无法处理类型的编译器来构建 TS 代码（即启用了 isolatedModules 配置），由于它们并不知道这里到底是值导入还是类型导入，所以此时你必须将类型导入显式标记出来：

```typescript
import { Animal, type AnimalKind } from "./animal;

// 或使用两条导入
import { Animal } from "./animal;
import type { AnimalKind } from "./animal;
```

当你同时启用了 `isolatedModules` 与 `preserveValueImports` 配置时，编辑器会严格约束你必须这么做。

#### 声明文件相关

##### declaration、declarationDir

这两个选项主要控制声明文件的输出，其中 declaration 接受一个布尔值，即是否产生声明文件。而 declarationDir 控制写入声明文件的路径，默认情况下声明文件会和构建代码文件在一个位置，比如 `src/index.ts` 会构建出 `dist/index.js` 与 `dist/index.d.ts`，但使用 declarationDir 你可以将这些类型声明文件输出到一个独立的文件夹下，如 `dist/types/index.d.ts` `dist/types/utils.d.ts` 这样。

##### declarationMap

declarationMap 选项会为声明文件也生成 source map，这样你就可以从 `.d.ts` 直接映射回原本的 `.ts` 文件了。

在使用第三方库时，如果你点击一个来自第三方库的变量，会发现跳转的是其声明文件。如果这些库提供了 declarationMap 与原本的 .ts 文件，那就可以直接跳转到变量对应的原始 ts 文件。当然一般发布 npm 包时并不会携带这些文件，但在 Monorepo 等场景下却有着奇效。

##### emitDeclarationOnly

此配置会让最终构建结果只包含构建出的声明文件（`.d.ts`），而不会包含 `.js` 文件。类似于 noEmit 选项，你可以使用其他构建器比如 swc 来构建代码文件，而只使用 tsc 来生成类型文件。

#### Source Map 相关

以下配置均和 Source Map 有关，我们就放在一起介绍了。

- sourceMap 与 inlineSourceMap 有些类似于 Webpack 中的 devtool 配置，控制是生成 `.map.js` 这样独立的 source map 文件，还是直接将其附加在生成的 `.js` 文件中。这两个选项当然是互斥的。
- inlineSources 这一选项类似于 source map，只不过它是映射到原本的 .ts 文件，也就是你可以从压缩过的代码直接定位到原本的 .ts 文件。
- sourceRoot 与 mapRoot，这两个选项通常供 debugger 消费，分别用于定义我们的源文件与 source map 文件的根目录。

### 构建产物代码格式化配置

以下选项主要控制产物代码中的代码格式化，或者说代码风格相关，我们就放在一起介绍了。

- newLine，指定文件的结尾使用 CRLF 还是 LF 换行风格。其中 CRLF 其实就是 Carriage Return Line Feed ，是 Windows（DOS）系统下的换行符（相当于 `\r\n`），而 LF 则是 Line Feed，为 Unix 下的换行符（相当于 `\n`）。

- removeComments，移除所有 TS 文件的注释，默认启用。

- stripInternal 这一选项会阻止为被标记为 internal 的代码语句生成对应的类型，即被 JSDoc 标记为 `@internal`。推荐的做法是为仅在内部使用而没有导出的变量或方法进行标记，来减少生成代码的体积。

  ```typescript
    /**
     * @internal
     */
    const SECRET_KEY = "LINBUDU";
  ```

  以上这段代码不会生成对应的类型声明。

## 总结与预告

这一节我们介绍了构建相关的配置，其中主要的概念包括如何配置你的输入与输出，以及如何启用特殊的语法等。这些配置通常通常不会频繁发生变化（除了 lib 可能会需要动态调整），而是在有特殊的需要时再对应地进行配置。

在下一节，我们会介绍检查相关与工程相关的配置项，其中检查部分包括了类型检查、逻辑检查等，而工程配置则包括了一系列兼容性与工程能力的配置。