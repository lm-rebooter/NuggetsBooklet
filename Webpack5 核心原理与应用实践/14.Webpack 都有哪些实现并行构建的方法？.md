受限于 Node.js 的单线程架构，原生 Webpack 对所有资源文件做的所有解析、转译、合并操作本质上都是在同一个线程内串行执行，CPU 利用率极低，因此，理所当然地，社区出现了一些以多进程方式运行 Webpack，或 Webpack 构建过程某部分工作的方案\(从而提升单位时间利用率\)，例如：

+ [HappyPack](https://github.com/amireh/happypack)：多进程方式运行资源加载\(Loader\)逻辑；
+ [Thread-loader](https://webpack.js.org/loaders/thread-loader/)：Webpack 官方出品，同样以多进程方式运行资源加载逻辑；
+ [Parallel-Webpack](https://www.npmjs.com/package/parallel-webpack)：多进程方式运行多个 Webpack 构建实例；
+ [TerserWebpackPlugin](https://www.npmjs.com/package/terser-webpack-plugin#terseroptions)：支持多进程方式执行代码压缩、uglify 功能。

这些方案的核心设计都很类似：针对某种计算任务创建子进程，之后将运行所需参数通过 IPC 传递到子进程并启动计算操作，计算完毕后子进程再将结果通过 IPC 传递回主进程，寄宿在主进程的组件实例，再将结果提交给 Webpack。

## 使用 HappyPack

[HappyPack](https://github.com/amireh/happypack) 能够将耗时的**文件加载**（Loader）操作拆散到多个子进程中并发执行，子进程执行完毕后再将结果合并回传到 Webpack 进程，从而提升构建性能。不过，HappyPack 的用法稍微有点难以理解，需要同时：

- 使用 `happypack/loader` 代替原本的 Loader 序列；
- 使用 `HappyPack` 插件注入代理执行 Loader 序列的逻辑。

基本用法：

1. 安装依赖：

```Bash
yarn add -D happypack
```

2. 将原有 `loader` 配置替换为 `happypack/loader`，如：

```JavaScript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "happypack/loader",
        // 原始配置如：
        // use: [
        //  {
        //      loader: 'babel-loader',
        //      options: {
        //          presets: ['@babel/preset-env']
        //      }
        //  },
        //  'eslint-loader'
        // ]
      },
    ],
  },
};
```

3. 创建 `happypack` 插件实例，并将原有 loader 配置迁移到插件中，完整配置：

```JavaScript
const HappyPack = require("happypack");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "happypack/loader",
        // 原始配置如：
        // use: [
        //  {
        //      loader: 'babel-loader',
        //      options: {
        //          presets: ['@babel/preset-env']
        //      }
        //  },
        //  'eslint-loader'
        // ]
      },
    ],
  },
  plugins: [
    new HappyPack({
      // 将原本定义在 `module.rules.use` 中的 Loader 配置迁移到 HappyPack 实例中
      loaders: [
        {
          loader: "babel-loader",
          option: {
            presets: ["@babel/preset-env"],
          },
        },
        "eslint-loader",
      ],
    }),
  ],
};
```

配置完毕后，再次启动 `npx webpack` 命令，即可使用 HappyPack 的多进程能力提升构建性能。以 Three.js 为例，该项目包含 362 份 JS 文件，合计约 3w 行代码：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03944215b70543889f573db3c1d0fb33~tplv-k3u1fbpfcp-watermark.image?)

开启 HappyPack 前，构建耗时大约为 11000ms 到 18000ms 之间，开启后耗时降低到 5800ms 到 8000ms 之间，提升约47\%。

  

上述示例仅演示了使用 HappyPack 加载单一资源类型的场景，实践中我们还可以创建多个 HappyPack 插件实例，来加载多种资源类型 —— 只需要用 `id` 参数做好 Loader 与 Plugin 实例的关联即可，例如：

```JavaScript
const HappyPack = require('happypack');

module.exports = {
  // ...
  module: {
    rules: [{
        test: /\.js?$/,
        // 使用 `id` 参数标识该 Loader 对应的 HappyPack 插件示例
        use: 'happypack/loader?id=js'
      },
      {
        test: /\.less$/,
        use: 'happypack/loader?id=styles'
      },
    ]
  },
  plugins: [
    new HappyPack({
      // 注意这里要明确提供 id 属性
      id: 'js',
      loaders: ['babel-loader', 'eslint-loader']
    }),
    new HappyPack({
      id: 'styles',
      loaders: ['style-loader', 'css-loader', 'less-loader']
    })
  ]
};
```

这里的重点是：

- `js`、`less` 资源都使用 `happypack/loader` 作为唯一加载器，并分别赋予 `id = 'js' | 'styles'` 参数；
- 创建了两个 `HappyPack` 插件实例并分别配置 `id` 属性，以及用于处理 js 与 css 的 `loaders` 数组；
- 启动后，`happypack/loader` 与 `HappyPack` 插件实例将通过 `id` 值产生关联，以此实现对不同资源执行不同 Loader 序列。


上面这种多实例模式虽然能应对多种类型资源的加载需求，但默认情况下，HappyPack 插件实例 **自行管理** 自身所消费的进程，需要导致频繁创建、销毁进程实例 —— 这是非常昂贵的操作，反而会带来新的性能损耗。

为此，HappyPack 提供了一套简单易用的共享进程池接口，只需要创建 `HappyPack.ThreadPool` 对象，并通过 `size` 参数限定进程总量，之后将该例配置到各个 HappyPack 插件的 `threadPool` 属性上即可，例如：

```JavaScript
const os = require('os')
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({
  // 设置进程池大小
  size: os.cpus().length - 1
});

module.exports = {
  // ...
  plugins: [
    new HappyPack({
      id: 'js',
      // 设置共享进程池
      threadPool: happyThreadPool,
      loaders: ['babel-loader', 'eslint-loader']
    }),
    new HappyPack({
      id: 'styles',
      threadPool: happyThreadPool,
      loaders: ['style-loader', 'css-loader', 'less-loader']
    })
  ]
};
```

使用 `HappyPack.ThreadPool` 接口后，HappyPack 会预先创建好一组工作进程，所有插件实例的资源转译任务会通过内置的 `HappyThread` 对象转发到空闲进程做处理，避免频繁创建、销毁进程。

  

最后，我们再来看看 HappyPack 的执行流程：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b8c529796f1480f8454cc3ac5f6b2a9~tplv-k3u1fbpfcp-watermark.image?)


核心步骤：

+ `happlypack/loader` 接受到转译请求后，从 Webpack 配置中读取出相应 HappyPack 插件实例；
+ 调用插件实例的 `compile` 方法，创建 `HappyThread` 实例（或从 `HappyThreadPool` 取出空闲实例）；
+ `HappyThread` 内部调用 `child_process.fork` 创建子进程，并执行`HappyWorkerChannel` 文件；
+ `HappyWorkerChannel` 创建 `HappyWorker` ，开始执行 Loader 转译逻辑；

中间流程辗转了几层，最终由 `HappyWorker` 类重新实现了一套与 Webpack Loader 相似的转译逻辑，代码复杂度较高，大家稍作了解即可。

HappyPack 虽然确实能有效提升 Webpack 的打包构建速度，但它有一些明显的缺点：

+ 作者已经明确表示不会继续维护，扩展性与稳定性缺乏保障，随着 Webpack 本身的发展迭代，可以预见总有一天 HappyPack 无法完全兼容 Webpack；
+ HappyPack 底层以自己的方式重新实现了加载器逻辑，源码与使用方法都不如 Thread-loader 清爽简单，而且会导致一些意想不到的兼容性问题，如 `awesome-typescript-loader`；
+ HappyPack 主要作用于文件加载阶段，并不会影响后续的产物生成、合并、优化等功能，性能收益有限。

## 使用 Thread-loader

[Thread-loader](https://webpack.js.org/loaders/thread-loader/) 与 HappyPack 功能类似，都是以多进程方式加载文件的 Webpack 组件，两者主要区别：

1.  Thread-loader 由 Webpack 官方提供，目前还处于持续迭代维护状态，理论上更可靠；
2.  Thread-loader 只提供了一个 Loader 组件，用法简单很多；
3.  HappyPack 启动后会创建一套 Mock 上下文环境 —— 包含 `emitFile` 等接口，并传递给 Loader，因此对大多数 Loader 来说，运行在 HappyPack 与运行在 Webpack 原生环境相比没有太大差异；但 Thread-loader 并不具备这一特性，所以要求 Loader 内不能调用特定上下文接口，兼容性较差。

说一千道一万，先来看看基本用法：

 1. 安装依赖：

```Bash
yarn add -D thread-loader
```

 2. 将 Thread-loader 放在 `use` 数组首位，确保最先运行，如：

```JavaScript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["thread-loader", "babel-loader", "eslint-loader"],
      },
    ],
  },
};
```

启动后，Thread-loader 会在加载文件时创建新的进程，在子进程中使用 `loader-runner` 库运行 `thread-loader` 之后的 Loader 组件，执行完毕后再将结果回传到 Webpack 主进程，从而实现性能更佳的文件加载转译效果。

以 Three.js 为例，使用 Thread-loader 前，构建耗时大约为 11000ms 到 18000ms 之间，开启后耗时降低到 8000ms 左右，提升约37\%。

此外，Thread-loader 还提供了一系列用于控制并发逻辑的配置项，包括：

+ `workers`：子进程总数，默认值为 `require('os').cpus() - 1`；
+ `workerParallelJobs`：单个进程中并发执行的任务数；
+ `poolTimeout`：子进程如果一直保持空闲状态，超过这个时间后会被关闭；
+ `poolRespawn`：是否允许在子进程关闭后重新创建新的子进程，一般设置为 `false` 即可；
+ `workerNodeArgs`：用于设置启动子进程时，额外附加的参数。

使用方法跟其它 Loader 一样，都是通过 `use.options` 属性传递，如：

```JavaScript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: 2,
              workerParallelJobs: 50,
              // ...
            },
          },
          "babel-loader",
          "eslint-loader",
        ],
      },
    ],
  },
};
```

  

不过，Thread-loader 也同样面临着频繁的子进程创建、销毁所带来的性能问题，为此，Thread-loader 提供了 `warmup` 接口用于前置创建若干工作子进程，降低构建时延，用法：

```JavaScript
const threadLoader = require("thread-loader");

threadLoader.warmup(
  {
    // 可传入上述 thread-loader 参数
    workers: 2,
    workerParallelJobs: 50,
  },
  [
    // 子进程中需要预加载的 node 模块
    "babel-loader",
    "babel-preset-es2015",
    "sass-loader",
  ]
);
```

执行效果与 `HappyPack.ThreadPool` 相似，此处不再赘述。

与 HappyPack 相比，Thread-loader 有两个突出的优点，一是产自 Webpack 官方团队，后续有长期维护计划，稳定性有保障；二是用法更简单。但它不可避免的也存在一些问题：

- 在 Thread-loader 中运行的 Loader 不能调用 `emitAsset` 等接口，这会导致 `style-loader` 这一类加载器无法正常工作，解决方案是将这类组件放置在 `thread-loader` 之前，如 `['style-loader', 'thread-loader', 'css-loader']`；
- Loader 中不能获取 `compilation`、`compiler` 等实例对象，也无法获取 Webpack 配置。

这会导致一些 Loader 无法与 Thread-loader 共同使用，大家需要仔细加以甄别、测试。

## 使用 Parallel-Webpack

Thread-loader、HappyPack 这类组件所提供的并行能力都仅作用于文件加载过程，对后续 AST 解析、依赖收集、打包、优化代码等过程均没有影响，理论收益还是比较有限的。对此，社区还提供了另一种并行度更高，以多个独立进程运行 Webpack 实例的方案 —— [Parallel-Webpack](https://github.com/trivago/parallel-webpack)，基本用法：

 1. 安装依赖：

```Bash
yarn add -D parallel-webpack
```

 2. 在 `webpack.config.js` 配置文件中导出多个 Webpack 配置对象，如：

```JavaScript
module.exports = [{
    entry: 'pageA.js',
    output: {
        path: './dist',
        filename: 'pageA.js'
    }
}, {
    entry: 'pageB.js',
    output: {
        path: './dist',
        filename: 'pageB.js'
    }
}];
```

3.  执行 `npx parallel-webpack` 命令。

Parallel-Webpack 会为配置文件中导出的每个 Webpack 配置对象启动一个独立的构建进程，从而实现并行编译的效果。底层原理很简单，基本上就是在 Webpack 上套了个壳：

+ 根据传入的配置项数量，调用 `worker-farm` 创建复数个工作进程；
+ 工作进程内调用 Webpack 执行构建；
+ 工作进程执行完毕后，调用 `node-ipc` 向主进程发送结束信号。

这种方式在需要同时执行多份配置的编译时特别有效，但若配置文件本身只是导出了单个配置对象则意义不大。

为了更好地支持多种配置的编译，Parallel-Webpack 还提供了 `createVariants` 函数，用于根据给定变量组合，生成多份 Webpack 配置对象，如：

```JavaScript
const createVariants = require('parallel-webpack').createVariants
const webpack = require('webpack')

const baseOptions = {
  entry: './index.js'
}

// 配置变量组合
// 属性名为 webpack 配置属性；属性值为可选的变量
// 下述变量组合将最终产生 2*2*4 = 16 种形态的配置对象
const variants = {
  minified: [true, false],
  debug: [true, false],
  target: ['commonjs2', 'var', 'umd', 'amd']
}

function createConfig (options) {
  const plugins = [
    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(JSON.parse(options.debug))
    })
  ]
  return {
    output: {
      path: './dist/',
      filename: 'MyLib.' +
                options.target +
                (options.minified ? '.min' : '') +
                (options.debug ? '.debug' : '') +
                '.js'
    },
    plugins: plugins
  }
}

module.exports = createVariants(baseOptions, variants, createConfig)
```

上述示例使用 `createVariants` 函数，根据 `variants` 变量搭配出 16 种不同的 `minified`、`debug`、`target` 组合，最终生成如下产物：

```bash
[WEBPACK] Building 16 targets in parallel
[WEBPACK] Started building MyLib.umd.js
[WEBPACK] Started building MyLib.umd.min.js
[WEBPACK] Started building MyLib.umd.debug.js
[WEBPACK] Started building MyLib.umd.min.debug.js

[WEBPACK] Started building MyLib.amd.js
[WEBPACK] Started building MyLib.amd.min.js
[WEBPACK] Started building MyLib.amd.debug.js
[WEBPACK] Started building MyLib.amd.min.debug.js

[WEBPACK] Started building MyLib.commonjs2.js
[WEBPACK] Started building MyLib.commonjs2.min.js
[WEBPACK] Started building MyLib.commonjs2.debug.js
[WEBPACK] Started building MyLib.commonjs2.min.debug.js

[WEBPACK] Started building MyLib.var.js
[WEBPACK] Started building MyLib.var.min.js
[WEBPACK] Started building MyLib.var.debug.js
[WEBPACK] Started building MyLib.var.min.debug.js
```

  

虽然，parallel-webpack 相对于 Thread-loader、HappyPack 有更高的并行度，但进程实例之间并没有做任何形式的通讯，这可能导致相同的工作在不同进程 —— 或者说不同 CPU 核上被重复执行。

例如需要对同一份代码同时打包出压缩和非压缩版本时，在 parallel-webpack 方案下，前置的资源加载、依赖解析、AST 分析等操作会被重复执行，仅仅最终阶段生成代码时有所差异。

这种技术实现，对单 entry 的项目没有任何收益，只会徒增进程创建成本；但特别适合 MPA 等多 entry 场景，或者需要同时编译出 esm、umd、amd 等多种产物形态的类库场景。


## 并行压缩

Webpack4 默认使用 [Uglify-js](https://www.npmjs.com/package/uglifyjs-webpack-plugin) 实现代码压缩，Webpack5 之后则升级为 [Terser](https://webpack.js.org/plugins/terser-webpack-plugin/) —— 一种[性能](https://blog.logrocket.com/terser-vs-uglify-vs-babel-minify-comparing-javascript-minifiers/)与兼容性更好的 JavaScript 代码压缩混淆工具，两种组件都原生实现了多进程并行压缩能力。

以 Terser 为例，TerserWebpackPlugin 插件默认已开启并行压缩，开发者也可以通过 `parallel` 参数（默认值为 `require('os').cpus() - 1`）设置具体的并发进程数量，如：

```JavaScript
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: 2 // number | boolean
        })],
    },
};
```

上述配置即可设定最大并行进程数为 2。此外，Webpack4 所使用的 `uglifyjs-webpack-plugin` 也提供了类似的功能，用法与 Terser 相同，此处不再赘述。

## 总结

受限于 JavaScript 的单线程架构，Webpack 构建时并不能充分使用现代计算机的多核 CPU 能力，为此社区提供了若干基于多进程实现的并行构建组件，包括文中介绍的 HappyPack、Thread-loader、Parallel-Webpack、Terser。

+ 对于 Webpack4 之前的项目，可以使用 HappyPack 实现并行文件加载；
+ Webpack4 之后则建议使用 Thread-loader；
+ 多实例并行构建场景建议使用 Parallel-Webpack 实现并行；
+ 生产环境下还可配合 `terser-webpack-plugin` 的并行压缩功能，提升整体效率。

理论上，并行确实能够提升系统运行效率，但 Node 单线程架构下，所谓的并行计算都只能依托与派生子进程执行，而创建进程这个动作本身就有不小的消耗 —— 大约 600ms，对于小型项目，构建成本可能可能很低，引入多进程技术反而导致整体成本增加，因此建议大家按实际需求斟酌使用上述多进程方案。

## 思考题

有没有可能使用 Node [Worker](https://nodejs.org/api/worker_threads.html) 实现多线程形式的 Webpack 并行构建？社区是否已经有相关组件？与多进程相比，可能存在怎么样的优缺点？