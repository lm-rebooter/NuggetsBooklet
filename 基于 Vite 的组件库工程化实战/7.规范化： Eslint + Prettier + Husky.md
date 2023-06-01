为了项目能够长期健康的发展。代码的规范性建设非常重要。只有纪律严明的队伍才能不断打胜仗。

**规范制定容易，执行的难度很大。** 比如你规定大街上抽烟罚款 200 元。但是让警察去执法难度就很大。代码规范也会遇到同样的问题，代码检查任务繁琐又缺乏技术含量，应该没有人愿意干这个苦差事，一般都是交个程序完成，这样才能成功地推行下去。

这节课我们就来学习用工具实现组件库的规范化。

项目规范可以分为：

-   编码规范；
-   项目结构规范；
-   文件命名规范；
-   git commit 版本规范；
-   工作流 workflow规范。

本节只考虑前四部分。关于工作流部分，涉及到社区和团队合作方面，我们会另外开辟一节讲解。

本章代码分支： https://github.com/smarty-team/smarty-admin/tree/chapter07

## 用户故事(UserStory)

引入项目规范，配置自动化检查工具，避免代码架构退化。

## 任务分解(Task)

-   编码与项目结构规范；
-   Eslint 代码检查工具；
-   Prettier 代码格式化工具；
-   Git commit 提交检查脚本；
-   Husky + git hook 提交前校验。

## 任务实现

### 编码规范

-   JS代码规范
    -   [airbnb-中文版](https://link.juejin.cn/?target=https://github.com/lin-123/javascript)
    -   [standard (24.5k star) 中文版](https://link.juejin.cn/?target=https://github.com/standard/standard/blob/master/docs/README-zhcn.md)
    -   [百度前端编码规范 3.9k](https://link.juejin.cn/?target=https://github.com/ecomfe/spec)
    
-   CSS代码规范

    -   [styleguide 2.3k](https://link.juejin.cn/?target=https://github.com/fex-team/styleguide/blob/master/css.md)
    -   [spec 3.9k](https://link.juejin.cn/?target=https://github.com/ecomfe/spec/blob/master/css-style-guide.md)

对于编码规范，通常会依赖 eslint 这种代码检查工具。 eslint 提供了 airbnb 、google、eslint默认三种编码规范。其实无论选择哪一种规则都可以很好地保证代码的可读性。所以大家使用 eslint 默认规则就好。

另外还有目录规范和文件命名规范也一并罗列出来。

### 目录规范

```
.
├── config               # 配置文件
├── coverage            # 覆盖率报告
├── demo                # 代码范例
├── docs                # 文档
├── node_modules  
├── scripts              # 脚本 发布、提交信息检查
├── src                  # 组件代码
└── types                # TS类型定义
```

### 文件命名规范

以一个组件为例，代码规则如下：

```
├── src                 # 组件代码
    └── button       # 组件包名
         ├── index.ts   # 组件入口
         ├── Button.tsx  # 组件代码  
         └── __tests__   # 测试用例
                  └── Button.spec.ts   
```

-   包名：小写 + 中划线；
-   统一入口文件： index.ts；
-   组件代码： 大驼峰；
-   测试用例代码 ： 测试对象名+ .spec.ts。

### Eslint + Prettier 代码检查工具

通常代码的检查工作交给 eslint 和 prettier 共同完成。其中 eslint 主要是完成对于代码语法的检查工作，比如：是否有声明但是没有使用的变量。而 prettier 主要专注于代码格式的调整功能。prettier 通常会以eslint 插件的形式使用，一般无需直接运行。

另外 eslint 在环境下还需要配置专门针对 Vue 框架的 eslint-plugin-vue 插件。

```
pnpm i eslint -D
# ESLint 专门解析 TypeScript 的解析器
pnpm i @typescript-eslint/parser -D
# 内置各种解析 TypeScript rules 插件
pnpm i @typescript-eslint/eslint-plugin -D

pnpm i eslint-formatter-pretty -D
pnpm i eslint-plugin-json -D
pnpm i eslint-plugin-prettier -D
pnpm i eslint-plugin-vue -D
pnpm i @vue/eslint-config-prettier -D
pnpm i babel-eslint -D
pnpm i prettier -D
```

> .eslintrc.cjs

```
module.exports =   {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true
  },
  globals: {
    ga: true,
    chrome: true,
    __DEV__: true
  },
  // 解析 .vue 文件
  parser: 'vue-eslint-parser', 
  extends: [
    'plugin:json/recommended',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/prettier'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser' // 解析 .ts 文件
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': 'error'
  }
}
```

> .eslintignore

```
*.sh
node_modules
lib
coverage
*.md
*.scss
*.woff
*.ttf
src/index.ts
dist
```

> package.json

```
{
  "scripts": {
    "lint": "eslint --fix --ext .ts,.vue src",
    "format": "prettier --write \"src/**/*.ts\" \"src/**/*.vue\"",
  },
}
```

执行 pnpm lint 进行代码校验。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e50975de4e9421b8fc6966847d1a162~tplv-k3u1fbpfcp-zoom-1.image)

果然首次运行的时候还是发现一些语法问题。稍微调整一下就可以通过了。

### Husky + git hooks 自动化提交验证

为了确保只有合格的代码才能够提交到仓库。 需要配置自动化脚本，确保代码在提交前通过了代码验证工具的检验。

实际上 git 本身就设计了生命周期钩子来完成这个任务。但是设置过程比较复杂。所以通常情况下会使用 husky 来简化配置。

```
pnpm i husky -D
```

在 `package.json` 加上下面的代码。

添加 husky 脚本：

```
npm set-script prepare "husky install"
```


首先配置一个钩子，在 commit 提交前，必须执行 lint 代码校验。

添加生命周期钩子：

```
npx husky add .husky/pre-commit "pnpm lint"
```

修改 hooks 程序。

.husky/pre-commit

```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm run lint
```

配置完成后，commit 一次代码测试一下是否有效。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1457c52cc1524e1c95a3b7bb7c733926~tplv-k3u1fbpfcp-zoom-1.image)

接着还需要配置在 push 之前通过单元测试的钩子。方法类似。

添加生命周期钩子：

```
npx husky add .husky/pre-push "pnpm test:run"
```

由于 vitest 默认是以伺服模式运行，所以需要写一个专门的脚本让测试运行在伺服模式下
packages.json
```json
  "scripts": {
    "test:run": "vitest run",
  },
```


修改hooks程序。
.husky/pre-push

```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm run test:run
```

### Git commit 提交规范

提交规范主要是为了让开发者提交完整的更新信息。方便查阅。大家可以围观一下 Vue 的 Github。拥有清晰 commit 信息非常有助于查阅代码。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b954cf904e74329a0325d2541d2bd6d~tplv-k3u1fbpfcp-zoom-1.image)

目前最为流行的提交信息规范来自于 Angular 团队。

规范中，主要就是要求提交内容要进行分类并填写内容，更为严格的规定是要求标注开发模块。

-   type：commit 的类型；
-   feat：新功能、新特性；
-   fix: 修改 bug；
-   perf：更改代码，以提高性能；
-   refactor：代码重构（重构，在不影响代码内部行为、功能下的代码修改）；
-   docs：文档修改；
-   style：代码格式修改, 注意不是 css 修改（例如分号修改）；
-   test：测试用例新增、修改；
-   build：影响项目构建或依赖项修改；
-   revert：恢复上一次提交；
-   ci：持续集成相关文件修改；
-   chore：其他修改（不在上述类型中的修改）；
-   release：发布新版本；
-   workflow：工作流相关文件修改。

示例：

```
# 示例1
fix(global):修复checkbox不能复选的问题
# 示例2 下面圆括号里的 common 为通用管理的名称
fix(common): 修复字体过小的BUG，将通用管理下所有页面的默认字体大小修改为 14px
# 示例3
fix: value.length -> values.length
```

下面配置一个工具用于在提交时自动检查 commit 信息是否符合要求。

安装工具验证脚本 commitlint，并且配置一个 commitlint 内容插件来确定一种 msg 风格。

```
# 安装commitlint
pnpm i -d @commitlint/config-conventional@"17.0.2" @commitlint/cli@"17.0.2"

# Configure commitlint to use conventional config
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

将 commitlint 脚本添加到 githooks 中， 让每次提交前都验证信息是否正常。

```
npx husky add .husky/commit-msg ""
```

.husky/commit-msg

```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

配置完成后，你可以测试一下。

当你提交代码没有按照规范填写 commit message 时，就会出现报错并且阻止你提交代码。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34ddb5de19ee43898220b1fbe9eccba8~tplv-k3u1fbpfcp-zoom-1.image)

本章代码分支： https://github.com/smarty-team/smarty-admin/tree/chapter07

## 复盘

这节课是给组件库确定开发规范并且添加规范化检查工具。

代码规范大体可以分为目录规范、编码规范、提交规范。更重要的内容是介绍如何使用相应的工具来检查代码规范，保证项目的健康性。大体归纳如下：

-   编码规范： ESLint （语法） + Prettier（格式）+ Husky (提交时自动检查)；
-   提交 Message ： commitlint(提交信息样式检查) + Husky (提交时自动检查)。

ESLint 是通过对 AST 语法树的分析完成的检查，具有很好的扩展性，可以扩展很多功能，比如 vue2 与vue3 语法的不兼容性也可以通过相应的插件进行检测。甚至 Prettier 也是作为 ESLint 的插件执行的。假设在实际开发中有自定义规则，也推荐使用编写ESLint插件的形式完成。

代码规范的作用是为了提高代码的可读性，毕竟代码是人与机器的沟通媒介，机器可以不厌其烦的工作，而人类精力和记忆力都有限，需要更优秀的结构和形式来提高阅读效率。基于人类的有限的精力，代码规范化这个东西如果全部让人类手工完成并不合理，不合理就很难被推行下去，不过聪明的人类可以想到使用规范化工具，让机器来解决这个问题。

对于具体规范化规则的制定，我提倡一定要考虑到实现成本和收益。比如某个规则特别的复杂，但是对可读性没有明显的提高，而且不能使用现成的工具来实现，那这样的规则实际上不应该提倡。

最后留一些思考题帮助大家复习，也欢迎大家在评论区讨论。

-   Eslint 与 Prettier 的功能和区别 ？
-   Git commit Message 的规范是什么 ？
-   如何设置 githooks ？

下节课，我们将完成软件包的封装，下节课见。