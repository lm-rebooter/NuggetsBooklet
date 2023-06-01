在上一篇文章《[Dependency Graph：如何管理模块间依赖？](https://juejin.cn/book/7115598540721618944/section/7119035705153552419)》中，我们已经详细讲解了「构建」阶段如何从 Entry 开始逐步递归读入、解析模块内容，并最终构建出模块依赖关系图 —— ModuleGraph 对象。本文我们继续往下，讲解在接下来的「封装」阶段，如何根据 ModuleGraph 内容组织 Chunk，并进一步构建出 ChunkGroup、ChunkGraph 依赖关系对象的主流程。

主流程之外，我们还会详细讲解几个比较模糊的概念：

- Chunk、ChunkGroup、ChunGraph 对象分别是什么？互相之间存在怎样的交互关系？
- Webpack 默认分包规则，以及规则中存在的问题。

## ChunkGraph 构建过程

在 《[Init、Make、Seal：真正读懂 Webpack 核心流程](https://juejin.cn/book/7115598540721618944/section/7119035873802813475)》中，我们已经介绍了 Webpack 底层构建逻辑大体上可以划分为：「**初始化、构建、封装**」三个阶段：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d54599450fe94d0a988ec70214e4ead8~tplv-k3u1fbpfcp-watermark.image?)

其中，「**构建**」阶段负责分析模块间的依赖关系，建立起模块之间的 [依赖关系图](https://webpack.js.org/concepts/dependency-graph/#root)（ModuleGraph）；紧接着，在「**封装**」阶段根据依赖关系图，将模块分开封装进若干 Chunk 对象中，并将 Chunk 之间的父子依赖关系梳理成 ChunkGraph 与若干 ChunkGroup 对象。

「封装」阶段最重要的目标就是根据「构建」阶段收集到的 ModuleGraph 关系图构建 ChunkGraph 关系图，这个过程的逻辑比较复杂：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92e472f300934c009836445743dd6996~tplv-k3u1fbpfcp-watermark.image?)

我们简单分析一下这里面几个重要步骤的实现逻辑。

**第一步非常关键：** 调用 `seal()` 函数后，遍历 `entry` 配置，为每个入口创建一个空的 `Chunk` 与 [EntryPoint](https://github1s.com/webpack/webpack/blob/HEAD/lib/Entrypoint.js) 对象（一种特殊的 `ChunkGroup`），并初步设置好基本的 `ChunkGraph` 结构关系，为下一步骤做好准备，关键代码：

```js
class Compilation {
  seal(callback) {
    // ...
    const chunkGraphInit = new Map();
    // 遍历入口模块列表
    for (const [name, { dependencies, includeDependencies, options }] of this
      .entries) {
      // 为每一个 entry 创建对应的 Chunk 对象
      const chunk = this.addChunk(name);
      // 为每一个 entry 创建对应的 ChunkGroup 对象
      const entrypoint = new Entrypoint(options);
      // 关联 Chunk 与 ChunkGroup
      connectChunkGroupAndChunk(entrypoint, chunk);

      // 遍历 entry Dependency 列表
      for (const dep of [...this.globalEntry.dependencies, ...dependencies]) {
        // 为每一个 EntryPoint 关联入口依赖对象，以便下一步从入口依赖开始遍历其它模块
        entrypoint.addOrigin(null, { name }, /** @type {any} */ (dep).request);

        const module = this.moduleGraph.getModule(dep);
        if (module) {
          // 在 ChunkGraph 中记录入口模块与 Chunk 关系
          chunkGraph.connectChunkAndEntryModule(chunk, module, entrypoint);
          // ...
        }
      }
    }
    // 调用 buildChunkGraph 方法，开始构建 ChunkGraph
    buildChunkGraph(this, chunkGraphInit);
    // 触发各种优化钩子
    // ...
  }
}
```

执行完成后，形成如下数据结构：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39e2b041b1994fa2b9c4cb92046f1b90~tplv-k3u1fbpfcp-watermark.image?)

其次，若此时配置了 `entry.runtime`，Webpack 还会在这个阶段为运行时代码 [创建](https://github1s.com/webpack/webpack/blob/HEAD/lib/Compilation.js#L2933-L2934) 相应的 Chunk 并直接 [分配](https://github1s.com/webpack/webpack/blob/HEAD/lib/Compilation.js#L2937-L2938) 给 `entry` 对应的 `ChunkGroup`对象。一切准备就绪后调用 [buildChunkGraph](https://github1s.com/webpack/webpack/blob/HEAD/lib/buildChunkGraph.js#L1347-L1348) 函数，进入下一步骤。

**第二步：** 在 `buildChunkGraph` 函数内 [调用](https://github1s.com/webpack/webpack/blob/HEAD/lib/buildChunkGraph.js#L1367-L1368) `visitModules` 函数，遍历 ModuleGraph，将所有 Module 按照依赖关系分配给不同 `Chunk` 对象；这个过程中若遇到 [异步模块](https://webpack.js.org/blog/2020-10-10-webpack-5-release/#async-modules)，则为该模块 [创建](https://github1s.com/webpack/webpack/blob/HEAD/lib/buildChunkGraph.js#L740-L742)新的 `ChunkGroup` 与 `Chunk` 对象，最终形成如下数据结构：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f065f4c71784477abff7b113eb6dd2bf~tplv-k3u1fbpfcp-watermark.image?)

**第三步：** 在 `buildChunkGraph` 函数中[调用](https://github1s.com/webpack/webpack/blob/HEAD/lib/buildChunkGraph.js#L1381-L1382) `connectChunkGroups` 方法，建立 `ChunkGroup` 之间、`Chunk` 之间的依赖关系，生成完整的 `ChunkGraph` 对象，最终形成如下数据结构：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd08a1a0b94b4f2d804399c77e916862~tplv-k3u1fbpfcp-watermark.image?)

**第四步：** 在 `buildChunkGraph` 函数中[调用](https://github1s.com/webpack/webpack/blob/HEAD/lib/buildChunkGraph.js#L1397-L1398) `cleanupUnconnectedGroups` 方法，清理无效 `ChunkGroup`，主要起到性能优化作用。

自上而下经过这四个步骤后，`ModuleGraph` 中存储的模块将根据模块本身的性质，被分配到 Entry、Async、Runtime 三种不同的 Chunk 对象，并将 Chunk 之间的依赖关系存储到 ChunkGraph 与 ChunkGroup 集合中，后续可在这些对象基础上继续修改分包策略（例如 `SplitChunksPlugin`），通过重新组织、分配 Module 与 Chunk 对象的归属实现分包优化。

## Chunk vs ChunkGroup vs ChunkGraph

上述构建过程涉及 Chunk、ChunkGroup、ChunkGraph 三种关键对象，我们先总结它们的概念与作用，加深理解：

- `Chunk`：Module 用于读入模块内容，记录模块间依赖等；而 Chunk 则根据模块依赖关系合并多个 Module，输出成资产文件（合并、输出产物的逻辑，我们放到下一章讲解）：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bac3fb532bc406fb16331555c309f9b~tplv-k3u1fbpfcp-watermark.image?)

- `ChunkGroup`：一个 `ChunkGroup` 内包含一个或多个 `Chunk` 对象；`ChunkGroup` 与 `ChunkGroup` 之间形成父子依赖关系：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/219d44ad9b4e4d2e9847761f83774d89~tplv-k3u1fbpfcp-watermark.image?)

- `ChunkGraph`：最后，Webpack 会将 Chunk 之间、ChunkGroup 之间的依赖关系存储到 `compilation.chunkGraph` 对象中，形成如下类型关系：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/424fe595633d41649a616f2f5076adb4~tplv-k3u1fbpfcp-watermark.image?)

## 默认分包规则

综合上述 `ChunkGraph` 构建流程最终会将 Module 组织成三种不同类型的 Chunk：

- Entry Chunk：同一个 `entry` 下触达到的模块组织成一个 Chunk；
- Async Chunk：异步模块单独组织为一个 Chunk；
- Runtime Chunk：`entry.runtime` 不为空时，会将运行时模块单独组织成一个 Chunk。

这是 Webpack 内置的，在不使用 `splitChunks` 或其它插件的情况下，模块输入映射到输出的默认规则，是 Webpack 底层关键原理之一，因此有必要展开介绍每一种 Chunk 的具体规则。

> **Entry Chunk:**

先从 Entry Chunk 开始，Webpack 首先会为每一个 `entry` 创建 `Chunk` 对象，例如对于如下配置：

```js
module.exports = {
  entry: {
    main: "./src/main",
    home: "./src/home",
  }
};
```

遍历 `entry` 对象属性并创建出 `chunk[main]` 、`chunk[home]` 两个对象，此时两个 Chunk 分别包含 `main` 、`home` 模块：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a40257760914ba08783bf2d6a3c1bef~tplv-k3u1fbpfcp-watermark.image?)

初始化完毕后，Webpack 会根据 `ModuleGraph` 的依赖关系数据，将 `entry` 下所触及的所有 Module 塞入 Chunk （发生在 [visitModules](https://github1s.com/webpack/webpack/blob/HEAD/lib/buildChunkGraph.js#L187-L188) 方法），比如对于如下文件依赖：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d7fbfc917b1416cb1ee86216c3131a0~tplv-k3u1fbpfcp-watermark.image?)


`main.js` 以同步方式直接或间接引用了 a/b/c/d 四个文件，Webpack 会首先为 `main.js` 模块创建 Chunk 与 EntryPoint 对象，之后将 a/b/c/d 模块逐步添加到 `chunk[main]` 中，最终形成：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83a4ebfe25b940d5adfb9d04a7507646~tplv-k3u1fbpfcp-watermark.image?)

> **Async Chunk:**

其次，Webpack 会将每一个异步导入语句（`import(xxx)` 及 `require.ensure`）处理为一个单独的 Chunk 对象，并将其子模块都加入这个 Chunk 中 —— 我们称之为 Async Chunk。例如对于下面的例子：

```js
// index.js
import './sync-a.js'
import './sync-b.js'

import('./async-a.js')

// async-a.js
import './sync-c.js'
```

在入口模块 `index.js` 中，以同步方式引入 sync-a、sync-b；以异步方式引入 async-a 模块；同时，在 async-a 中以同步方式引入 `sync-c` 模块，形成如下模块依赖关系图：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/716dba615b424147ad4076ce0a735eb5~tplv-k3u1fbpfcp-watermark.image?)

此时，Webpack 会为入口 `index.js`、异步模块 `async-a.js` 分别创建分包，形成如下 Chunk 结构：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/892f542a06ae4d31a18130e93b07648a~tplv-k3u1fbpfcp-watermark.image?)

并且 `chunk[index]` 与 `chunk[async-a]` 之间形成了单向依赖关系，Webpack 会将这种依赖关系保存在 `ChunkGroup._parents` 、`ChunkGroup._children` 属性中。

> **Runtime Chunk:**

最后，除了 `entry`、异步模块外，Webpack5 还支持将 Runtime 代码单独抽取为 Chunk。这里说的 Runtime 代码是指一些为了确保打包产物能正常运行，而由 Webpack 注入的一系列基础框架代码，举个例子，常见的 Webpack 打包产物结构如：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de9a9cbc02a9452baa1feddcd7c5ef71~tplv-k3u1fbpfcp-watermark.image?)

上图红框圈出来的一大段代码就是 Webpack 动态生成的运行时代码，编译时，Webpack 会根据业务代码，决定输出哪些支撑特性的运行时代码（基于 `Dependency` 子类），例如：

- 需要 `__webpack_require__.f`、`__webpack_require__.r` 等功能实现最起码的模块化支持；
- 如果用到动态加载特性，则需要写入 `__webpack_require__.e` 函数；
- 如果用到 Module Federation 特性，则需要写入 `__webpack_require__.o` 函数；
- 等等。

虽然每段运行时代码可能都很小，但随着特性的增加，最终结果会越来越大，特别对于多 entry 应用，在每个入口都重复打包一份相似的运行时显得有点浪费，为此 Webpack5 提供了 `entry.runtime` 配置项用于声明如何打包运行时代码。用法上只需在 `entry` 项中增加字符串形式的 `runtime` 值，例如：

```js
module.exports = {
  entry: {
    index: { import: "./src/index", runtime: "solid-runtime" },
  }
};
```

在 `compilation.seal` 函数中，Webpack 首先为 `entry` 创建 `EntryPoint`，之后判断 `entry` 配置中是否带有 `runtime` 属性，有则创建以 `runtime` 值为名的 Chunk，因此，上例配置将生成两个 Chunk：`chunk[index.js]` 、`chunk[solid-runtime]`，并据此最终产出两个文件：

- 入口 index 对应的 `index.js` 文件；
- 运行时配置对应的 `solid-runtime.js` 文件。

在多 `entry` 场景中，只要为每个 `entry` 都设定相同的 `runtime` 值，Webpack 运行时代码就会合并写入到同一个 Runtime Chunk 中，最终达成产物性能优化效果。例如对于如下配置：

```js
module.exports = {
  entry: {
    index: { import: "./src/index", runtime: "solid-runtime" },
    home: { import: "./src/home", runtime: "solid-runtime" },
  }
};
```

入口 `index`、`home` 共享相同的 `runtime` 值，最终生成三个 Chunk，分别为：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcbe4fdd5f2d41d0af0b7fcf990a9bb7~tplv-k3u1fbpfcp-watermark.image?)

此时入口 `chunk[index]`、`chunk[home]` 与运行时 `chunk[solid-runtime]` 也会形成父子依赖关系。

## 分包规则的问题

默认分包规则最大的问题是无法解决模块重复，如果多个 Chunk 同时包含同一个 Module，那么这个 Module 会被不受限制地重复打包进这些 Chunk。比如假设我们有两个入口 main/index 同时依赖了同一个模块：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b483355b9b3e4acfb022a2e3aa54d226~tplv-k3u1fbpfcp-watermark.image?)

默认情况下，Webpack 不会对此做额外处理，只是单纯地将 c 模块同时打包进 main/index 两个 Chunk，最终形成：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/452ebaf82f7c4df88ae7b5334ff17cba~tplv-k3u1fbpfcp-watermark.image?)

可以看到 `chunk` 间互相孤立，模块 c 被重复打包，对最终产物可能造成不必要的性能损耗！

为了解决这个问题，Webpack 3 引入 `CommonChunkPlugin` 插件试图将 entry 之间的公共依赖提取成单独的 `chunk`，但 `CommonChunkPlugin` 本质上还是基于 Chunk 之间简单的父子关系链实现的，很难推断出提取出的第三个包应该作为 `entry` 的父 `chunk` 还是子 `chunk`，`CommonChunkPlugin` 统一处理为父 `chunk`，某些情况下反而对性能造成了不小的负面影响。

为此，在 Webpack4 之后才专门引入了更复杂的数据结构 —— `ChunkGroup` 专门实现关系链管理，配合 `SplitChunksPlugin` 能够更高效、智能地实现**启发式分包。**

## 总结

综上，「构建」阶段负责根据模块的引用关系构建 ModuleGraph；「封装」阶段则负责根据 ModuleGraph 构建一系列 Chunk 对象，并将 Chunk 之间的依赖关系（异步引用、Runtime）组织为 ChunkGraph —— Chunk 依赖关系图对象。与 ModuleGraph 类似，ChunkGraph 结构的引入也能解耦 Chunk 之间依赖关系的管理逻辑，整体架构逻辑更合理更容易扩展。

不过，虽然看着很复杂，但「封装」阶段最重要的目标还是在于：确定有多少个 Chunk，以及每一个 Chunk 中包含哪些 Module —— 这些才是真正影响最终打包结果的关键因素。

针对这一点，我们需要理解 Webpack5 内置的三种分包规则：Entry Chunk、Async Chunk 与 Runtime Chunk，这些是最最原始的分包逻辑，其它插件（例如 [splitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/)）都是在此基础，借助 `buildChunkGraph` 后触发的各种钩子进一步拆分、合并、优化 Chunk 结构，实现扩展分包效果。

## 思考题

`Chunk` 一定会且只会生产出一个产物文件吗？为什么？`mini-css-extract-plugin`、`file-loader` 这一类能写出额外文件的组件，底层是怎么实现的？