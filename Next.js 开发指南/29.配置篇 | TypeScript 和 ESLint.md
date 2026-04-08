## 前言

使用 `create-next-app`创建项目的时候，Next.js 会提示是否使用 TypeScript 和 ESLint，本篇会详细介绍 TypeScript 和 ESLint 的配置内容，帮助大家了解默认设置中支持的功能和逻辑。

## TypeScript

Next.js 内置了对 TypeScript 的支持，会自动安装所需依赖以及进行合适的配置。

### 1. 新项目

当你运行 `create-next-app` 创建项目的时候，就会让你选择是否使用 TypeScript，默认是 `Yes`：

```bash
npx create-next-app@latest
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/338e1a0cbeae4e6dbed45b8aabcab1db~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2048\&h=400\&s=1160077\&e=png\&b=090f16)

### 2. 现有项目

将文件重命名为 `.ts`或者 `.tsx`，然后运行 `next dev`和 `next build`，Next.js 会自动安装所需依赖，以及添加一个包含推荐配置项的 `tsconfig.json`文件。

如果你已经有了一个 `jsconfig.json` 文件，那就需要你手动拷贝 `jsconfig.json`中的内容（比如 `paths`）到 `tsconfig.json`中，然后删除掉之前的 `jsconfig.json`文件。

### 3. TypeScript 插件

Next.js 包含了一个自定义的 TypeScript 插件和类型检查器。VScode 和其他代码编辑器可以用其实现高级类型检查和自动补写功能。

在 VSCode 中开启：

1.  打开命令面板（`Ctrl/⌘` + `Shift` + `P`）
2.  搜索 `TypeScript: Select TypeScript Version`
3.  选择“`Use Workspace Versiion`”

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f51c0de853c0406c888bbe530ab425c1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=637\&s=265220\&e=png\&b=212329)

现在，当你编辑文件的时候，自定义 TypeScript 插件就会启用。当运行 `next build`的时候，会执行自定义类型检查器。

插件功能介绍：

1.  当使用了无效的路由段配置会出现警告：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92a7d286aa984ea48754705c1772f15f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2204\&h=426\&s=137977\&e=png\&b=1f1f1f)

2.  显示上下文文档：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23bbc37a4282495b9ca8ea4802de1632~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2192\&h=592\&s=197306\&e=png\&b=252526)

3.  显示可用选项：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/778168b2f93e4ce99b86d1dae56f389c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1826\&h=394\&s=99703\&e=png\&b=202020)

4.  确保 `use client`被正确使用：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ac2531413a04757bf683c1655adc604~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1534\&h=554\&s=107023\&e=png\&b=1f1f1f)

5.  确保客户端 hooks（如 useState）只在客户端组件中使用：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45148815980341b38c6b766c60388871~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1256\&h=410\&s=88021\&e=png\&b=202020)

### 4. 最低 TypeScript 版本要求

Next.js 推荐最少要 v4.5.2 版本以获取如导入名称的 type 修饰符（type Modifiers on Import Names）等功能：

```typescript
// 可以直接导入类型
import { someFunc, type BaseType } from "./some-module.js";

export class Thing implements BaseType {
  someMethod() {
    someFunc();
  }
}
```

### 5. 静态写入链接

Next.js 可以静态写入链接，防止使用 `next/link` 时出现拼写或者其他错误，从而保证页面导航地址的正确性。

要使用此功能，需要在项目使用 TypeScript 的前提下，在 `next.config.js` 中使用 `experimental.typedRoutes`选项开启：

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
}
 
module.exports = nextConfig
```

Next.js 将会在 `.next/types` 中生成一个包含所有路由信息的链接定义，从而让 TypeScript 据此来进行链接提示。

目前，支持任何字符串文字，包括动态路由。对于非文字字符，目前则需要手工使用 `as Route`标示 `href` :

```javascript
import type { Route } from 'next';
import Link from 'next/link'
 
// 如果 href 是有效路由，则不会出现 TypeScript 错误
<Link href="/about" />
<Link href="/blog/nextjs" />
<Link href={`/blog/${slug}`} />
<Link href={('/blog' + slug) as Route} />
 
// 如果 href 不是有效路由，则会出现 TypeScript 错误，这里出现了拼写错误
<Link href="/aboot" />
```

如果要在一个使用 `next/link` 包装的自定义组件中接收 `href` 属性，使用泛型：

```javascript
import type { Route } from 'next'
import Link from 'next/link'
 
function Card<T extends string>({ href }: { href: Route<T> | URL }) {
  return (
    <Link href={href}>
      <div>My Card</div>
    </Link>
  )
}
```

### 6. next.config.js 中的类型检查

`next.config.js` 必须是一个 JavaScript 文件，它不会被 TypeScript 或者 Babel 解析，但你可以使用 JSDoc 添加一些类型检查，举个例子：

```javascript
// @ts-check
 
/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  /* config options here */
}
 
module.exports = nextConfig
```

### 7. 忽略 TypeScript 错误

当出现 TypeScript 错误的时候，使用 `next build` 构建生产版本会失败。但如果你希望即使有错误，也要构建出生产代码，那你可以禁用内置的类型检查。打开 `next.config.js`启用 `typescript.ignoreBuildErrors` 选项：

```javascript
// next.config.js
module.exports = {
  typescript: {
    // !! WARN !!
    // 其实是很危险的操作
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
```

## ESLint

### 1. ESLint 配置选项

Next.js 提供了开箱即用的 ESLint 功能（如果你创建项目的时候选择了 ESLint），查看 `package.json`会看到：

```json
// package.json
{
  "scripts": {
    "lint": "next lint"
  }
}
```

然后运行 `npm run lint` 或者`yarn lint`:

```shell
yarn lint
```

如果应用中并没有 ESLint 相关的配置，则会引导你安装和配置：

```shell
? How would you like to configure ESLint?

❯ Strict (recommended)
Base
Cancel
```

这个时候你会看到三个选项：

1.  **Strict**

这是首次设置 ESLint 的推荐配置。包括 Next.js 基础 ESLint 配置以及更严格的核心 Web 指标规则集。查看 `.eslintrc.json`文件：

```json
// .eslintrc.json
{
  "extends": "next/core-web-vitals"
}
```

2.  **Base**

只包括 Next.js 基础 ESLint 配置，查看 `.eslintrc.json`文件：

```json
// .eslintrc.json
{
  "extends": "next"
}
```

这个时候你可能困惑 `Strict` 模式下不是包含了基础 ESLint 配置吗？为什么 `Strict` 下的 `extends` 没有 `"next"`呢？这是因为 `"next/core-web-vitals"` 的规则拓展了 `"next"`，也就是说包含了 `"next"` ，所以无须再次 extends 了。

3.  **Cancel**

不包括任何 ESLint 配置。当你需要自定义 ESLint 配置的时候，选择此项。

如果选择了前两个配置项的任何一个，Next.js 都会自动安装 `eslint` 和 `eslint-config-next` 作为应用的依赖项，以及在项目的根目录创建一个包含你选择的配置的 `.eslintrc.json` 文件。

现在你就可以运行 `next lint`捕获错误。一般 ESLint 设置完成后，它会在每次 `next build` 的时候自动运行。如果有错误会导致构建失败，警告则不会。

### 2. ESLint 配置

默认配置 `eslint-config-next`包含以下插件：

*   [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)
*   [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
*   [eslint-plugin-next](https://www.npmjs.com/package/@next/eslint-plugin-next)

初次接触 ESLint 的同学可能对 ESLint 的 `config` 和 `plugin` 概念有些困惑。我们简单讲一下区别。

现在假设你是 Next.js 的开发者，为了让用户更好的使用 Next.js，需要根据 Next.js 的用法自定义一些 ESLint 规则，就比如我们在讲 `<Script>` 组件的时候讲到内联脚本：

```javascript
<Script id="show-banner">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>
```

Next.js 要求必须为内联脚本分配一个 id，以保证 Next.js 追踪和优化脚本。如果用户没有传入 id，就可以使用 ESLint 提示一个错误。为了实现这个自定义规则，我们就需要编写一个插件，名为 `eslint-plugin-next`，其中 `eslint-plugin-`这个前缀是 ESLint 要求的。它的代码结构类似于：

```javascript
module.exports = {
  rules: {
    'inline-script-id': require('./rules/inline-script-id'),
    // ... 其他规则
  }
}
```

开发了一堆规则还不够，正如打游戏的时候，游戏难度有简单、适中、困难、地狱，规则集合也是一样，我们也可以用这些规则建立多个分类，比如推荐、严格、宽松等，这个也可以写在插件代码中，代码结构类似于：

```javascript
module.exports = {
  rules: {
    'inline-script-id': require('./rules/inline-script-id'),
    // ... 其他规则
  },
  configs: {
    recommended: {
      plugins: ['next'],
      rules: {
        // warnings
        'next/inline-script-id': 'warn',
        // errors
        'next/other-rule': 'error',
      },
    },
    strict: {
      plugins: ['next'],
      rules: {
        'next/inline-script-id': 'error',
        'next/other-rule': 'error',
      },
    },
  },
}
```

在这个示例中，我们为我们的 `eslint-plugin-next`插件定义了两套配置，一套名为 `recommended`，一套名为 `strict`。其中 `plugins: ['next']` 表示加载名为 `eslint-plugin-next`的插件（ESLint 会自动补全名字），其实就是自己，然后 `rules`设定使用哪些规则和规则的提示，比如同样是 `inline-script-id` 这条规则，在 `recommended` 中，我们设定为 `warn`，但是在 `strict` 中，既然是严格，我们就设定为 `error`。

有了这个插件还不够，Next.js 是基于 React 的，关于 React 的用法，也有一些 ESLint 规则，React 的开发者对应开发了 eslint-plugin-react 插件。这个插件虽然不错，但是个别规则我不想用，又该怎么办呢？为了帮助开发者提供一个更加“成品”的配置项，你可以定义一个 `eslint-config-next`配置，其中 `eslint-config-`这个前缀是 ESLint 要求的。它的代码结构类似于：

```javascript
module.exports = {
  extends: [
    'plugin:next/recommended',
  ],
  plugins: ['react'],
  rules: {
    'react/no-unknown-property': 'warn',
    'react/jsx-no-target-blank': 'off'
  }
}
```

在这个例子中，我们使用 extends 表示使用已有的配置，`'plugin:next/recommended'`表示的就是 `eslint-plugin-next`插件中的 recommended 配置。plugins 表示加载的插件，但是这只是加载，具体使用哪些规则，你还需要写 rules 自定义。

这个成品的配置，我们可以在 `.eslintrc.json`中，使用 extends 语法直接继承：

```javascript
{
  "extends": "next"
}
```

因为所有的配置包都是以 `eslint-config-`开头，所以不需要写成 `"extends": "eslint-config-next"`，ESLint 会自动补全。

简而言之，就如它们的名字一样，`plugin` 侧重于规则的编写，`config` 侧重于规则的配置。`plugin` 使用 `plugins: [xxx]`的形式加载，但还需要编写 `rules` 才能使用。`config` 可以使用 `extends`语法直接继承，无须再额外编写。`extends` 语法也可以继承 `plugin` 中编写的配置，语法为 `extends: ['plugin:xxxx/xxx']`这种形式。

### 3. ESLint 插件

Next.js 提供了一个 ESLint 插件 [eslint-plugin-next](https://www.npmjs.com/package/@next/eslint-plugin-next)，已经绑定在基本配置（eslint-config-next）中，完整的 21 条规则可以查看 <https://nextjs.org/docs/app/building-your-application/configuring/eslint#eslint-plugin>

### 4. 自定义应用目录

如果你正在使用 `eslint-plugin-next`，但是没有在根目录里安装 Next.js（比如 monorepo 项目），你可以使用 `.eslintrc` 的 `settings` 属性告诉 `eslint-plugin-next` 哪里找到你的 Next.js 应用：

```json
// .eslintrc.json
{
  "extends": "next",
  "settings": {
    "next": {
      "rootDir": "packages/my-app/"
    }
  }
}
```

`rootDir` 可以是一个路径（相对地址或者绝对地址），也可以使用通配符，比如 `packages/*/`，也可以是一个包含路径或使用通配符的地址的数组。

### 5. 自定义检查目录和文件

默认情况下，Next.js 会为 `pages/`、`app/`、`components/`、`lib/`和 `src/` 目录下的所有文件运行 ESLint。不过你可以使用`next.config.js` 的 `eslint.dirs` 选项指定检查的目录：

```javascript
// next.config.js
module.exports = {
  eslint: {
    dirs: ['pages', 'utils'], 
  },
}
```

同样，你可以使用 `next lint` 的 `--dir` 和 `--file` 指定检查的目录和文件：

```bash
next lint --dir pages --dir utils --file bar.js
```

### 6. 缓存

为了提高性能，Next.js 默认会缓存 ESLint 处理信息，存在`.next/cache`或者构建目录下 。如果需要禁用缓存，使用 `next lint` 的 `--no-cache`：

```bash
next lint --no-cache
```

### 7. 禁用规则

如果你希望修改或者禁用插件（`react`、`react-hooks`、`next`）中的规则，你可以直接在 `.eslintrc` 中使用 `rules` 属性更改它们：

```json
// .eslintrc.json
{
  "extends": "next",
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
```

### 8. core-web-vitals

前面讲到，首次运行 `next lint`并选择 `Strict` 选项，会开启使用 `next/core-web-vitals`规则集：

```json
{
  "extends": "next/core-web-vitals"
}
```

通过[查看源码](https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/src/index.ts)，可以得知目前 `core-web-vitals` 配置相比于默认配置会更加严格：

```javascript
module.exports = {
  rules: {
    // ...
  },
  configs: {
    recommended: {
      plugins: ['@next/next'],
      rules: {
        // warnings
        '@next/next/no-html-link-for-pages': 'warn',
        '@next/next/no-sync-scripts': 'warn',
         //...
      },
    },
    'core-web-vitals': {
      plugins: ['@next/next'],
      extends: ['plugin:@next/next/recommended'],
      rules: {
        '@next/next/no-html-link-for-pages': 'error',
        '@next/next/no-sync-scripts': 'error',
      },
    },
  },
}
```

其实目前也就将 2 条规则设定的更严格了一些，一条是 `no-html-link-for-pages`，也就是不要用 `<a>` 标签，而是用 Link 组件替代：

```javascript
function Home() {
  return (
    <div>
      <a href="/about">About Us</a>
    </div>
  )
}
```

你应该改为使用：

```javascript
import Link from 'next/link'
 
function Home() {
  return (
    <div>
      <Link href="/about">About Us</Link>
    </div>
  )
}
 
export default Home
```

另外一条是 `no-sync-scripts`，不要用同步脚本，也就推荐使用 Script 组件或者为 script 添加 defer 或者 async 属性：

使用 Script 组件：

```javascript
import Script from 'next/script'
 
function Home() {
  return (
    <div class="container">
      <Script src="https://third-party-script.js"></Script>
      <div>Home Page</div>
    </div>
  )
}
 
export default Home
```

添加 async 或 defer 属性：

```javascript
<script src="https://third-party-script.js" async />
<script src="https://third-party-script.js" defer />
```

### 9. 搭配其他工具

#### 9.1. prettier

ESLint 也包含代码格式化规则，可能会跟已经存在的 Prettier 配置冲突。我们推荐使用 `eslint-config-prettier` 让 ESLint 和 Prettier 能够协同工作。

首先安装依赖：

```bash
npm install --save-dev eslint-config-prettier
 
yarn add --dev eslint-config-prettier
 
pnpm add --save-dev eslint-config-prettier
 
bun add --dev eslint-config-prettier
```

然后添加 `prettier`到 `.eslintrc.json`中：

```json
// .eslintrc.json
{
  "extends": ["next", "prettier"]
}
```

#### 9.2. lint-staged

开发的时候，你肯定不希望修改了一个文件后，又所有文件都执行一次 ESLint 检查，那你就可以使用 lint-staged，它会在暂存的 git 文件上（git add 的那些文件）执行 ESLint 检查。

为了搭配使用 lint-staged，你需要将以下内容添加到根目录的 `.lintstagedrc.js` 文件：

```javascript
// .lintstagedrc.js
const path = require('path')
 
const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`
 
module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
```

### 10. 迁移现有配置

如果你已经有了单独的 ESLint 配置，并且想要保持原有的配置，那你可以基于目前的配置，直接从 Next.js ESLint 插件（eslint-plugin-next）中拓展规则：

```javascript
module.exports = {
  extends: [
    //...
    'plugin:@next/next/recommended',
  ],
}
```

或者是引入 `eslint-config-next`，不过确保它在其他配置项后，举个例子：

```json
// .eslintrc.json
{
  "extends": ["eslint:recommended", "next"]
}
```

## 参考链接

1.  [Configuring: TypeScript | Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
2.  [Configuring: ESLint | Next.js](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
