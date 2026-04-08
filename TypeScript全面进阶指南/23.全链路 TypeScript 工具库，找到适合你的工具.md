在前面两节，我们了解了 TypeScript 在 React 与 ESLint 中的集成，而在实际项目开发时，我们还会接触许多与 TypeScript 相关的工具。如果按照作用场景来进行划分，这些工具大致可以划分为开发、校验、构建、类型四类。在这一节我们将介绍一批 TypeScript 工具库，讲解它们的基本使用，你可以在这里查找是否有符合你需求的工具。

本节的定位类似于 GitHub 上的 awesome-xxx 系列，我们更多是在简单介绍工具的作用与使用场景，不会有深入的讲解与分析。同时，本节的内容会持续更新，如果你还使用过其他好用的工具库，欢迎在评论区留言，我会随着更新不断收录更多的工具库。

## 开发阶段

这一部分的工具主要在项目开发阶段使用。

### 项目开发

- [ts-node](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FTypeStrong%2Fts-node) 与 [ts-node-dev](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fwclr%2Fts-node-dev)：我们在环境搭建一节中已经介绍过，用于直接执行 .ts 文件。其中 ts-node-dev 基于 ts-node 和 node-dev（类似于 nodemon）封装，能够实现监听文件改动并重新执行文件的能力。

- [tsc-watch](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fgilamran%2Ftsc-watch)：它类似于 ts-node-dev，主要功能也是监听文件变化然后重新执行，但 tsc-watch 的编译过程更明显，也需要自己执行编译后的文件。你也可以通过 onSuccess 与 onFailure 参数，来在编译过程成功与失效时执行不同的逻辑。

  ```bash
  ## 启动 tsc --watch，然后在成功时执行编译产物
  tsc-watch --onSuccess "node ./dist/server.js"
  
  ## 在失败时执行
  tsc-watch --onFailure "echo 'Beep! Compilation Failed'"
  ```

- [esno](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fesbuild-kit%2Fesno)，antfu 的作品。核心能力同样是执行 .ts 文件，但底层是 ESBuild 而非 tsc，因此速度上会明显更快。

- [typed-install](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Ftyped-install)，我们知道有些 npm 包的类型定义是单独的 `@types/` 包，但我们并没办法分辨一个包需不需要额外的类型定义，有时安装了才发现没有还要再安装一次类型也挺烦躁的。typed-install 的功能就是在安装包时自动去判断这个包是否有额外的类型定义包，并为你自动地进行安装。其实我也写过一个类似的：[install-with-typing](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Finstall-with-typing)。

- [suppress-ts-error](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fkawamataryo%2Fsuppress-ts-errors)，自动为项目中所有的类型报错添加 `@ts-expect-error` 或 `@ts-ignore` 注释，重构项目时很有帮助。

- [ts-error-translator](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmattpocock%2Fts-error-translator)，将 TS 报错翻译成更接地气的版本，并且会根据代码所在的上下文来详细说明报错原因，目前只有英文版本，中文版本感觉遥遥无期，因为 TS 的报错实在太多了……

  ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a32aab7b4974a2e90f4110aab24dbc0~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

### 代码生成

- [typescript-json-schema](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FYousefED%2Ftypescript-json-schema)，从 TypeScript 代码生成 JSON Schema，如以下代码：

  ```typescript
  export interface Shape {
      /**
       * The size of the shape.
       *
       * @minimum 0
       * @TJS-type integer
       */
      size: number;
  }
  ```

  会生成以下的 JSON Schema：

  ```json
  {
    "$ref": "#/definitions/Shape",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "definitions": {
      "Shape": {
        "properties": {
          "size": {
            "description": "The size of the shape.",
            "minimum": 0,
            "type": "integer"
          }
        },
        "type": "object"
      }
    }
  }
  ```

- [json-schema-to-typescript](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbcherny%2Fjson-schema-to-typescript)，和上面那位反过来，从 JSON Schema 生成 TypeScript 代码：

  ```json
  {
    "title": "Example Schema",
    "type": "object",
    "properties": {
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      },
      "age": {
        "description": "Age in years",
        "type": "integer",
        "minimum": 0
      },
      "hairColor": {
        "enum": ["black", "brown", "blue"],
        "type": "string"
      }
    },
    "additionalProperties": false,
    "required": ["firstName", "lastName"]
  }
  ```

  ```typescript
  export interface ExampleSchema {
    firstName: string;
    lastName: string;
    /**
     * Age in years
     */
    age?: number;
    hairColor?: "black" | "brown" | "blue";
  }
  ```

需要注意的是，JSON Schema 并不是我们常见到的。描述实际值的 JSON，它更像是 TS 类型那样的**结构定义**，存在着值类型、可选值、访问性等相关信息的描述，如 required、type、description 等字段，因此才能够它才能够与 TypeScript 之间进行转换。

## 类型相关

以下工具库主要针对类型，包括提供通用工具类型与对工具类型进行测试。

- [type-fest](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsindresorhus%2Ftype-fest)，不用多介绍了，目前 star 最多下载量最高的工具类型库，Sindre Sorhus 的作品，同时也是个人认为最接地气的一个工具类型库。
- [utility-types](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fpiotrwitek%2Futility-types)，包含的类型较少，但这个库是我类型编程的启蒙课，我们此前对 FunctionKeys、RequiredKeys 等工具类型的实现就来自于这个库。
- [ts-essentials](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fts-essentials)
- [type-zoo](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fpelotom%2Ftype-zoo)
- [ts-toolbelt](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmillsp%2Fts-toolbelt)，目前包含工具类型数量最多的一位，基本上能满足你的所有需要。
- [tsd](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Ftsd)，用于进行类型层面的单元测试，即验证工具类型计算结果是否是符合预期的类型，也是 Sindre Sorhus 的作品，同时 type-fest 中工具类型的单元测试就是基于它。
- [conditional-type-checks](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fdsherret%2Fconditional-type-checks)，类似于 tsd，也是用于对类型进行单元测试。

## 校验阶段

以下这些工具通常用于在项目逻辑中进行具有实际逻辑的校验（而不同于 tsd 仅在类型层面）。

### 逻辑校验

- [zod](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fcolinhacks%2Fzod)，核心优势在于与 TypeScript 的集成，如能从 Schema 中直接提取出类型：

  ```typescript
  import { z } from "zod";
  
  const User = z.object({
    username: z.string(),
  });
  
  User.parse({ username: "Ludwig" });
  
  // extract the inferred type
  type User = z.infer<typeof User>;
  // { username: string }
  ```

  我个人比较看好的一个库，在 tRPC、Blitz 等前后端一体交互的框架中能同时提供类型保障和 Schema 校验，同时和 Prisma 这一类库也有着很好地集成。最重要的是社区生态非常丰富，有许多自动生成的工具（[json-to-zod](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Frsinohara%2Fjson-to-zod)、[zod-nest-dto](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fkbkk%2Fabitia%2Ftree%2Fmaster%2Fpackages%2Fzod-dto) 等）。

- [class-validator](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftypestack%2Fclass-validator)，TypeStack 的作品，基于装饰器来进行校验，我们会在后面的装饰器一节了解如何基于装饰器进行校验。

```typescript
export class Post {
  @Length(10, 20)
  title: string;

  @Contains('hello')
  text: string;

  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @IsEmail()
  email: string;
}

let post = new Post();
post.title = 'Hello'; // 错误
post.text = 'this is a great post about hell world'; // 错误
post.rating = 11; // 错误
post.email = 'google.com'; // 错误

validate(post).then(errors => {
  // 查看是否返回了错误
  if (errors.length > 0) {
    console.log('校验失败，错误信息: ', errors);
  } else {
    console.log('校验通过！');
  }
});
```

- [superstruct](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fianstormtaylor%2Fsuperstruct)，功能与使用方式类似于 zod，更老牌一些。

- [ow](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsindresorhus%2Fow)，用于函数参数的校验，我通常在 CLI 工具里大量使用。

  ```typescript
  import ow from 'ow';
  
  const unicorn = input => {
  	ow(input, ow.string.minLength(5));
  
  	// …
  };
  
  unicorn(3);
  //=> ArgumentError: Expected `input` to be of type `string` but received type `number`
  
  unicorn('yo');
  //=> ArgumentError: Expected string `input` to have a minimum length of `5`, got `yo`
  ```

- [runtypes](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fpelotom%2Fruntypes)，类似于 Zod，也是运行时的类型与 Schema 校验。

### 类型覆盖检查

- [typescript-coverage-report](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Falexcanessa%2Ftypescript-coverage-report)，检查你的项目中类型的覆盖率，如果你希望项目的代码质量更高，可以使用这个工具来检查类型的覆盖程度，从我个人使用经验来看，大概 95% 左右就是一个比较平衡的程度了。类似于 Lint 工具，如果使用这一工具来约束项目代码质量，也可以放在 pre-commit 中进行。
- [type-coverage](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fplantain-00%2Ftype-coverage)，前者的底层依赖，可以用来定制更复杂的场景。

## 构建阶段

以下工具主要在构建阶段起作用。

- [ESBuild](https://link.juejin.cn/?target=https%3A%2F%2Fesbuild.github.io%2F)，应该无需过多介绍。需要注意的是 ESBuild 和 TypeScript Compiler 还是存在一些构建层面的差异，比如 ESBuild 无法编译装饰器（但可以使用插件，对含有装饰器的文件回退到 tsc 编译）。
- [swc](https://link.juejin.cn/?target=https%3A%2F%2Fswc.rs%2F)，也无需过多介绍。SWC 的目的是替代 Babel，因此它是可以直接支持装饰器等特性的。
- [fork-ts-checker-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Ffork-ts-checker-webpack-plugin)，Webpack 插件，使用额外的子进程来进行 TypeScript 的类型检查（需要禁用掉 ts-loader 自带的类型检查）。
- [esbuild-loader](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fprivatenumber%2Fesbuild-loader)，基于 ESBuild 的 Webpack Loader，放在这里是因为它基本可以完全替代 ts-loader 来编译 ts 文件。
- [rollup-plugin-dts](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Frollup-plugin-dts)，能够将你项目内定义与编译生成的类型声明文件重新进行打包。
- [Parcel](https://link.juejin.cn/?target=https%3A%2F%2Fparceljs.org%2F)，一个 Bundler，与 Webpack、Rollup 的核心差异是零配置，不需要任何 loader 或者 plugin 配置就能对常见基本所有的样式方案、语言方案、框架方案进行打包。我在之前搭过一个基于 Parcel 的项目起手式：[Parcel-Tsx-Template](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FLinbuduLab%2FParcel-Tsx-Template)，可以来感受一下**零配置**是什么体验。

## 总结与预告

这一节我们汇总了各个场景下的 TypeScript 工具库，就像开头所说，本节的内容会持续更新，如果你还使用过其它让你赞不绝口的工具库，欢迎在评论区或答疑群提交给我。

下一节，我们会来了解一个对你来说可能熟悉又陌生的名词：ECMAScript，包括它到底代表了什么，和 TypeScript 的关系如何，TypeScript 中的 ECMAScript 语法如何使用，以及未来的 ECMAScript 怎么样。