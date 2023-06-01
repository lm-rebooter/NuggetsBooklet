缓存是一种应用非常广泛性能优化技术，在计算机领域几乎无处不在，例如：操作系统层面 CPU 高速缓存、磁盘缓存，网路世界中的 DNS 缓存、HTTP 缓存，以及业务应用中的数据库缓存、分布式缓存等等。

那自然而然的，我们也可以在 Webpack 使用各式各样的缓存技术，通过牺牲空间来提升构建过程的时间效率，在这篇文章中，我将从 Webpack5 的 **持久化缓存** 开始介绍用法、性能收益、基本原理；之后再过渡到 Webpack4 中如何借助第三方组件\(Loader、Plugin\)实现持久化缓存。

## Webpack5 中的持久化缓存

[持久化缓存](https://webpack.js.org/configuration/cache/#cache) 算得上是 Webpack 5 最令人振奋的特性之一，它能够将首次构建的过程与结果数据持久化保存到本地文件系统，在下次执行构建时跳过解析、链接、编译等一系列非常消耗性能的操作，直接复用上次的 Module/ModuleGraph/Chunk 对象数据，迅速构建出最终产物。

持久化缓存的性能提升效果非常出众！以 Three.js 为例，该项目包含 362 份 JS 文件，合计约 3w 行代码，算得上中大型项目：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e1cc62bb30441eb8c50865f66b45f29~tplv-k3u1fbpfcp-watermark.image?)


配置 `babel-loader`、`eslint-loader` 后，在我机器上测试，未使用 `cache` 特性时构建耗时大约在 11000ms 到 18000ms 之间；启动 `cache` 功能后，第二次构建耗时降低到 500ms 到 800ms 之间，两者相差接近 **50** 倍！

而这接近 50 倍的性能提升，仅仅需要在 Webpack5 中设置 `cache.type = 'filesystem'` 即可开启：

```js
module.exports = {
    //...
    cache: {
        type: 'filesystem'
    },
    //...
};
```

执行效果：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dc585911d5d41bcbf70eee0faccb3be~tplv-k3u1fbpfcp-watermark.image?)

此外，`cache` 还提供了若干用于配置缓存效果、缓存周期的配置项，包括：

- `cache.type`：缓存类型，支持 `'memory' | 'filesystem'`，需要设置为 `filesystem` 才能开启持久缓存；
- `cache.cacheDirectory`：缓存文件路径，默认为 `node_modules/.cache/webpack` ；
- `cache.buildDependencies`：额外的依赖文件，当这些文件内容发生变化时，缓存会完全失效而执行完整的编译构建，通常可设置为各种配置文件，如：

```JavaScript
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [
        path.join(__dirname, 'webpack.dll_config.js'),
        path.join(__dirname, '.babelrc')
      ],
    },
  },
};
```

- `cache.managedPaths`：受控目录，Webpack 构建时会跳过新旧代码哈希值与时间戳的对比，直接使用缓存副本，默认值为 `['./node_modules']`；
- `cache.profile`：是否输出缓存处理过程的详细日志，默认为 `false`；
- `cache.maxAge`：缓存失效时间，默认值为 `5184000000` 。

使用时通常关注上述配置项即可，其它如 `idleTimeout`、`idleTimeoutAfterLargeChanges` 等项均与 Webpack 内部实现算法有关，与缓存效果关系不大，此处不展开介绍。

## 缓存原理

那么，为什么开启持久化缓存之后，构建性能会有如此巨大的提升呢？

一言蔽之，Webpack5 会将首次构建出的 Module、Chunk、ModuleGraph 等对象序列化后保存到硬盘中，后面再运行的时候，就可以跳过许多耗时的编译动作，直接复用缓存数据。

回过头来看看 Webpack 的构建过程，大致上可划分为三个阶段。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58feafdeed084eefa40f12f98b627262~tplv-k3u1fbpfcp-watermark.image?)

- 初始化，主要是根据配置信息设置内置的各类插件。
- Make - 构建阶段，从 `entry` 模块开始，执行：
  - 读入文件内容；
  - 调用 Loader 转译文件内容；
  - 调用 [acorn](https://www.npmjs.com/package/acorn) 生成 AST 结构；
  - 分析 AST，确定模块依赖列表；
  - 遍历模块依赖列表，对每一个依赖模块重新执行上述流程，直到生成完整的模块依赖图 —— ModuleGraph 对象。
- Seal - 生成阶段，过程：
  - 遍历模块依赖图，对每一个模块执行：
    - 代码转译，如 `import` 转换为 `require` 调用；
    - 分析运行时依赖。
  - 合并模块代码与运行时代码，生成 chunk；
  - 执行产物优化操作，如 Tree-shaking；
  - 将最终结果写出到产物文件。

过程中存在许多 CPU 密集型操作，例如调用 Loader 链加载文件时，遇到 babel-loader、eslint-loader、ts-loader 等工具时可能需要重复生成 AST；分析模块依赖时则需要遍历 AST，执行大量运算；Seal 阶段也同样存在大量 AST 遍历，以及代码转换、优化操作，等等。假设业务项目中有 1000 个文件，则每次执行 `npx webpack` 命令时，都需要从 0 开始执行 1000 次构建、生成逻辑。

而 Webpack5 的持久化缓存功能则将构建结果保存到文件系统中，在下次编译时对比每一个文件的内容哈希或时间戳，未发生变化的文件跳过编译操作，直接使用缓存副本，减少重复计算；发生变更的模块则重新执行编译流程。缓存执行时机如下图：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc6ac3a471664560b3db676e73cb0c62~tplv-k3u1fbpfcp-watermark.image?)

如图，Webpack 在首次构建完毕后将 Module、Chunk、ModuleGraph 三类对象的状态序列化并记录到缓存文件中；在下次构建开始时，尝试读入并恢复这些对象的状态，从而跳过执行 Loader 链、解析 AST、解析依赖等耗时操作，提升编译性能。

## Webpack4：使用 `cache-loader`

Webpack5 的持久化缓存用法简单，效果出众，但可惜在 Webpack4 及之前版本原生还没有相关实现，只能借助一些第三方组件实现类似效果，包括：

- 使用 `[cache-loader](https://www.npmjs.com/package/cache-loader)`；
- 使用 `[hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)`；
- 使用 Loader（如 `babel-loader`、`eslint-loader`\)）自带的缓存能力。

先从 `cache-loader` 说起，`cache-loader` 能够将 Loader 处理结果保存到硬盘，下次运行时若文件内容没有发生变化则直接返回缓存结果，用法：

1. 安装依赖：

```Bash
yarn add -D cache
```

2. 修改配置，注意必须将 `cache-loader` 放在 `loader` 数组首位，例如：

```JavaScript
module.exports = {
    // ...
    module: {
        rules: [{
            test: /\.js$/,
            use: ['cache-loader', 'babel-loader', 'eslint-loader']
        }]
    },
    // ...
};
```

`cache-loader` 只缓存了 Loader 执行结果，缓存范围与精度不如 Webpack5 内置的缓存功能，所以性能效果相对较低，以 ThreeJS 为例，`production` 模式下构建耗时从 10602ms 降低到 1540ms；`development` 模式从 11130ms 降低到 4247ms，多次测试性能提升稳定在 60\% \~ 80\% 之间。虽然比不上 Webpack5 的持久化缓存，但在 Webpack4 中不失为一种简单而有效的性能优化手段。

此外，`cache-loader` 还提供了一系列控制缓存逻辑的配置属性，特别是 `read/write` 可以用于改变缓存数据的持久化逻辑，借助这两个属性我们甚至能够实现多台机器间的缓存共享：

```JavaScript
const redis = require("redis");
const client = redis.createClient();

// 读数据
async function read(key, callback) {
  // ...
  const result = await client.get(key);
  const data = JSON.parse(result);
  callback(null, data);
}

// 写数据
async function write(key, data, callback) {
  // ...
  await client.set(key, JSON.stringify(data));
  callback();
}

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "cache-loader",
            // 传入 read、write 函数
            options: { read, write },
          },
          "babel-loader",
        ],
      },
    ],
  },
};
```

借助这种能力，我们可以打通本地与线上 CI/CD 环境，实现开发与生产环境构建的构建性能优化。

  

## Webpack4：使用 `hard-source-webpack-plugin`

[hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin) 也是一种实现缓存功能的第三方组件，与 `cache-loader` 不同的是，它并不仅仅缓存了 Loader 运行结果，还保存了 Webpack 构建过程中许多中间数据，包括：模块、模块关系、模块 Resolve 结果、Chunks、Assets 等，效果几乎与 Webpack5 自带的 Cache 对齐。用法：

1. 安装依赖：

```Bash
yarn add -D hard-source-webpack-plugin
```

2. 添加配置：

```JavaScript
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    new HardSourceWebpackPlugin(),
  ],
};
```

首次运行时，`hard-source-webpack-plugin` 会在缓存文件夹 `node_module/.cache` 写入一系列日志文件：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44c94fac904645f19fe1d342ff58ec03~tplv-k3u1fbpfcp-watermark.image?)

下次运行时，`hard-source-webpack-plugin` 插件会复用缓存中记录的数据，跳过一系列构建步骤，从而提升构建性能。

`hard-source-webpack-plugin` 插件的底层逻辑与 Webpack5 的持久化缓存很相似，但优化效果稍微差一些，以 ThreeJS 为例，`production` 模式下构建耗时从 10602ms 降低到 1740ms；`development` 模式构建从 11130ms 降低到 3280ms，多次测试性能提升稳定在 62\% \~ 88\% 之间。


## 使用组件自带的缓存功能

除了上面介绍的持久化缓存、`cache-loader`、`hard-source-webpack-plugin` 方案外，我们还可以使用 Webpack 组件自带的缓存能力提升特定领域的编译性能，这一类组件有：

+ [babel-loader](https://www.npmjs.com/package/babel-loader)；
+ [eslint-loader](https://www.npmjs.com/package/eslint-loader)：旧版本 ESLint Webpack 组件，官方推荐使用 [eslint-webpack-plugin](https://www.npmjs.com/package/eslint-webpack-plugin) 代替；
+ [eslint-webpack-plugin](https://www.npmjs.com/package/eslint-webpack-plugin)；
+ [stylelint-webpack-plugin](https://www.npmjs.com/package/stylelint-webpack-plugin)。

例如使用 `babel-loader` 时，只需设置 `cacheDirectory = true` 即可开启缓存功能，例如：

```JavaScript
module.exports = {
    // ...
    module: {
        rules: [{
            test: /\.m?js$/,
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
            },
        }]
    },
    // ...
};
```


以 Three.js 为例，开启缓存后生产环境构建耗时从 3500ms 降低到 1600ms；开发环境构建从 6400ms 降低到 4500ms，性能提升约 30\% \~ 50\% 。

默认情况下，缓存内容会被保存到 `node_modules/.cache/babel-loader` 目录，你也可以通过 `cacheDirectory = 'dir'` 属性设置缓存路径。


此外，ESLint 与 Stylelint 这一类耗时较长的 Lint 工具也贴心地提供了相应的缓存能力，只需设置 `cache = true` 即可开启，如：

```JavaScript
// webpack.config.js
module.exports = {
  plugins: [
    new ESLintPlugin({ cache: true }),
    new StylelintPlugin({ files: '**/*.css', cache: true }),
  ],
};
```

依然以 Three.js 为例，开启 ESLint 缓存后生产环境构建耗时从 6400ms 降低到 1400ms；开发环境构建从 7000ms 降低到 2100ms，性能提升达到 70\% \~ 80\%。

  

## 总结

Webpack5 持久化缓存用法简单，且优化效果非常出色，确实是一个特别让人振奋的新功能，甚至特定情况下能够让构建性能达到 Unbundle 方案的量级，妥妥的 Webpack 性能优化利器！

而在 Webpack4 中，我们还可以借助下述组件实现缓存优化：

+ `cache-loader`：针对 Loader 运行结果的通用缓存方案；
+ `hard-source-webpack-plugin`：针对 Webpack 全生命周期的通用缓存方案；
+ `babel-loader`：针对 Babel 工具的专用缓存能力；
+ `eslint-loader`/`eslint-webpack-plugin`：针对 ESLint 的专用缓存方案；
+ `stylelint-webpack-plugin`：针对 StyleLint 的专用缓存方案。

这些方案各有特色，但都无可置疑地能有效提升编译性能，建议你在尝试做性能优化时优先选用。

  

## 思考题

除“缓存”外，计算机领域中还有哪些常见、可被复用的性能优化方案？与缓存相比，它们都有怎么样的特色，优缺点？