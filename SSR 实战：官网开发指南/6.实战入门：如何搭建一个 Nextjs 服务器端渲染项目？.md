> 仓库：https://github.com/czm1290433700/nextjs-demo

之前的几节课，我们学习了 SSR 的原理并且从零实现了服务器端渲染同构和注水等过程，相信大家对 SSR 的原理已经有了较为深刻的理解。从这节课开始，我们将开始新的学习，通过实战来讲解一个基本的官网是怎么实现的，同样仓库也贴在每一章节的开头处，大家可以 clone 下来学习理解。

实战篇我们将使用 Nextjs 来进行开发，nextjs 是业内相对成熟的 SSR 服务器端渲染框架，有完善的数据同步能力，除服务器端外，还提供了静态渲染和较多开箱即用的优化能力，对减少项目的开发成本和大家的学习理解成本都有不小的优势。

在项目开发中，规范的 lint、 IDE提示及调试能力一直是影响开发者开发项目效率和质量的关键因素。针对服务器端渲染，因为涉及客户端和 Api 层这几点就显得更为重要，规范的 lint、 IDE 提示可以帮助我们更有效地开发和规避问题，至于调试能力，因为服务器端的存在，我们不能像客户端渲染一样，直接在浏览器中断点调试，也需要增加额外的配置来支持。

那么针对Nextjs服务器端渲染，我们应该如何搭建呢？

之前在《架构实现（一）：代码 lint & 项目构建》这节，我们已经有介绍项目中 lint 和构建的方式，因为这次不再是个原理的 demo，将包含样式、Api 层和框架，整体配置会有相关差异，所以会在上次的基础补充额外的内容。大体方向上，我们将从项目初始化，代码lint & commit lint，模块化代码提示和服务器端调试能力四个方向上来展开探讨。

# 项目初始化

首先我们先对 nextjs 的项目进行初始化，nextjs 提供了脚手架来帮助我们初始化项目，我们可以执行下面的命令来初始化项目：

```
npx create-next-app@latest --typescript
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ca229b1cd2e482db50c3ad2b1f17607~tplv-k3u1fbpfcp-watermark.image?)

其中 next-env.d.ts 是 nextjs 的类型文件，可以保证 ts 选择 nextjs 相关的类型，通常我们不需要对它进行修改，可以在提交后加到 .gitignore 中。next.config.js 是 nextjs 的构建配置，底层也是基于 Webpack 去打包的，我们可以在默认的配置上加上下面的配置来提供别名的能力。

```
// next.config.js
const path = require("path");

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    return config;
  },
};
```

tsconfig.json 中我们也需要加一下对应的别名解析识别（baseurl , paths）。

```
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["./*"]
    },
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

到这里项目其实就已经初步初始化完成了，我们执行`npm run dev`打开http://localhost:3000就可以看到一个 nextjs 的默认服务器端渲染页面，大家可以按照前几节课介绍的打开 network 看一下服务器端的请求是不是包含了相关的 dom 了 。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cc8088b00424160b872b9eceadc02c9~tplv-k3u1fbpfcp-watermark.image?)

# 代码 Lint & commit lint

nextjs 已经内置了开箱的 eslint 能力，我们不需要自己进行相关的配置，可以执行下面的脚本来自动生成对应的 lint，可以覆盖大部分场景。

```
npm run lint
```

commitlint 的部分我们可以参照《架构实现（一）：代码 lint & 项目构建》中 commitlint 的配置，不过需要把对应钩子下 lint 的脚本改成对应的 nextjs lint。

```
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx commitlint --edit $1 
npm run lint
```

# 模块化代码提示

我们写页面肯定会涉及样式，所以样式的配置也是很重要的。这里推荐使用 sass 等超类来替代 css，相比 css， sass 等超类提供了变量定义和函数的能力，可以避免一些重复的 css 代码，使得样式的可维护性和复用性更高。sass 有支持两种语法， sass 和 scss，作为 css 超集，scss 有更平滑的学习成本，对于初学者更为友好，所以后续的学习会以 scss 来书写样式。

Nextjs 已经提供了对 css 和 sass 的支持，所以我们不需要配置相关 webpack loader，只需要安装一下 sass 的依赖即可。

```
npm install sass --save-dev
```

通常针对一个大型项目，我们定义多级嵌套的组件来提高页面的复用性，组件之间的样式命名是很容易重复的，所以针对非组件库的业务代码，我们通常会使用 css 模块化来进行相关的样式定义。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e18a241c9044e768b378b0645529a52~tplv-k3u1fbpfcp-watermark.image?)

模块化会在编译的时候将样式的类名加上对应唯一的哈希值来进行区分，从而解决样式类名重复的问题，nextjs 已经内置了这部分能力，我们只需要将类名定义为`[name].module.(css|scss)`即可，不过模块化的样式调用不能直接用字符串，需要用引用的方式，比如下面的例子：

```
import { FC } from 'react';
import styles from "./index.module.scss";

interface IProps {}

export const Demo: FC<IProps> = ({}) => {
  return (
    <div className={styles.demo}>
      <h1 className={styles.title}>demo</h1>
    </div>
  )
}
```

不过 nextjs 并没有支持对模块化代码的识别，我们在页面中执行输入`styles.`并不会有相关的代码提示，这其实是很不方便的，因为我们并不能记住所有的类名，可以自己加上相关的配置。

要实现这个能力，我们需要用到 typescript-plugin-css-modules，这个依赖可以给 IDE 提供模块化相关的类型，配合 typescript 使用就能实现 css 的类型提示，我们首先安装一下依赖。

```
npm install typescript-plugin-css-modules --save-dev
```

然后我们需要在 tsconfig.json 中加上对应的组件（plugins），使得 ts-server 解析的过程中，可以进行样式的识别。

```
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [{ "name": "typescript-plugin-css-modules" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

然后我们打开 vscode 的 setting.json 文件，可以通过`  ctrl + shift + p `（mac 的同学 ctrl 换成 cmd）打开。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf56dece79924d9f823fd9f07252758e~tplv-k3u1fbpfcp-watermark.image?)

加上下面的配置，typescript.tsserver.pluginPaths 是为了引入 ts-server 需要用中间件组件，而 typescript.tsdk 和 typescript.enablePromptUseWorkspaceTsdk 是为了指出 ts 的位置，保证工作空间可以正常使用 ts 的相关 sdk 能力。

```
{
     // ...前面的保持原状就可以
    "typescript.tsserver.pluginPaths": ["typescript-plugin-css-modules"],
    "typescript.tsdk": "node_modules/typescript/lib",
    "typescript.enablePromptUseWorkspaceTsdk": true
}
```

完成后我们 reload window 即可，同样可以通过上面的快捷键打开。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8220372d92f54bfcbb4bbdea17d7c49b~tplv-k3u1fbpfcp-watermark.image?)

然后我们可以拿脚手架生成的代码试验一下，把 home 的模块化引用换成 scss，然后去掉一个类名，重新按`.`, 可以看到已经可以了：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffa5f48f72d74857b2772c0a7c8a43e0~tplv-k3u1fbpfcp-watermark.image?)

# 服务器端调试能力

在之前的架构实现篇，我们有学习服务器端渲染一个静态页面的过程，请求会在服务器端执行，并且将数据注入到页面中，意味着这部分逻辑并不在客户端执行，所以在服务器端执行的时候，我们是不能直接用 Chrome的 network 来调试的，那上面只能调试直接在客户端执行的脚本。

nextjs 也有内置相关的调试能力来帮助我们进行调试，我们只需要为 dev 命令加一个`--inspect`的node option 就行，我们首先来安装 cross-env 的依赖来支持跨平台的环境变量添加：

```
npm install cross-env --save-dev
```

然后在 package.json 中，我们加一条 debugger 的命令：

```
// package.json
{
   // ...
  "scripts": {
    "dev": "next dev",
    "debugger": "cross-env NODE_OPTIONS='--inspect' next dev",
  }
}
```

执行它并重新打开 http://localhost:3000，我们可以看到一个绿色的 nodejs 的小图标，点开会打开一个新的 network，这个就是服务器端 server 的 network，服务器端执行的相关代码断点可以在上面进行调试。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e007401b0074813b8cba05166f94776~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2d1e3003215478c8a09f241c746f806~tplv-k3u1fbpfcp-watermark.image?)

我们在 home 处加一个 debugger 试验一下，已经可以进行调试了。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b485982a5bb643d4a44fe2cc14abcebc~tplv-k3u1fbpfcp-watermark.image?)
# 小结

这一节，我们学习了怎么搭建一个 Nextjs 服务器端渲染项目，并支持了相关的 lint，模块化提示及 nodejs 调试能力。现在项目已经具备了基本的项目开发能力，从下一节开始，我们将继续结合相关的 case 进行实战页面的开发，学习怎么在 Nextjs 项目中实现完整的页面链路？
