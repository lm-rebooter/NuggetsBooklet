Webpack 之所以能够应对 Web 场景下极度复杂、多样的构建需求，关键就在于其健壮、扩展性极强的插件架构，而插件架构的精髓又在于其灵活多变的 Hook 体系，可以说，只有真正掌握 Hook 底层设计与实现逻辑，深入理解不同 Hook 的运行特性与用法，才能灵活处理各种问题，更快更好地编写出 Webpack 插件。

本文将聚焦在 Webpack Hook 底层的 Tapable 框架，详细枚举了 Tapable 提供的钩子及各类型钩子的特点、运行逻辑、实现原理，并进一步讨论 Tapable 框架在 Webpack 的作用，进而揭示 Webpack 插件架构的核心逻辑。阅读本文，你将：

- 深入了解 Hook 类型，以及不同类型的特点、运行特性；
- 理解如何识别 Webpack 特定钩子类型，正确调用处理。

## Tapable 全解析

网上不少资料将 Webpack 的插件架构归类为“事件/订阅”模式，我认为这种归纳有失偏颇。订阅模式是一种松耦合架构，发布器只是在特定时机发布事件消息，订阅者并不或者很少与事件直接发生交互，举例来说，我们平常在使用 HTML 事件的时候很多时候只是在这个时机触发业务逻辑，很少调用上下文操作。

而 Webpack 的插件体系是一种基于 [Tapable](https://github.com/webpack/tapable) 实现的强耦合架构，它在特定时机触发钩子时会附带上足够的上下文信息，插件定义的钩子回调中，能也只能与这些上下文背后的数据结构、接口交互产生 side effect，进而影响到编译状态和后续流程。

[Tapable](https://github.com/webpack/tapable) 是 Webpack 插件架构的核心支架，但它的代码量其实很少，本质上就是围绕着 `订阅/发布` 模式叠加各种特化逻辑，适配 Webpack 体系下复杂的事件源-处理器之间交互需求，比如：

- 有些场景需要支持将前一个处理器的结果传入下一个回调处理器；
- 有些场景需要支持异步并行调用这些回调处理器。

先简单看看 Tapable 的用法：

```js
const { SyncHook } = require("tapable");

// 1. 创建钩子实例
const sleep = new SyncHook();

// 2. 调用订阅接口注册回调
sleep.tap("test", () => {
  console.log("callback A");
});

// 3. 调用发布接口触发回调
sleep.call();

// 运行结果：
// callback A
```

使用 Tapable 时通常需要经历三个步骤：

- 创建钩子实例，如上例第 4 行；
- 调用订阅接口注册回调，包括：`tap`、`tapAsync`、`tapPromise`，如上例第 7 行；
- 调用发布接口触发回调，包括：`call`、`callAsync`、`promise`，如上例第 12 行。

Webpack 内部的钩子大体上都遵循上面三个步骤，只是在某些钩子中还可以使用异步风格的 `tapAsync/callAsync`、promise 风格 `tapPromise/promise`，具体使用哪一类函数与钩子类型有关。

## Hook 类型汇总

Tabable 提供如下类型的钩子：

<table data-ace-table-col-widths="231;180;526;" class="ace-table author-6857319138482798593"><colgroup><col width="231"><col width="180"><col width="526"></colgroup><tbody><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1bcem81hueopshd3562hebk3nc1agp71txc14cq5p9uz8ppmklmekzrbekueyfiukp18">名称</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1bcem81hueopshd3562hebk3nc1agp71txc1qhtovo04njlapok94mopi4cu4ro6e645">简介</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1bcem81hueopshd3562hebk3nc1agp71txc10bo0cuj91aj9hq75tp6ll4c9ot1vmegq">统计</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1w572whktjb8jifh8qjw4gg0scglciladxc14cq5p9uz8ppmklmekzrbekueyfiukp18"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">SyncHook</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1w572whktjb8jifh8qjw4gg0scglciladxc1qhtovo04njlapok94mopi4cu4ro6e645">同步钩子</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1w572whktjb8jifh8qjw4gg0scglciladxc10bo0cuj91aj9hq75tp6ll4c9ot1vmegq">Webpack 共出现 71 次，如 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">Compiler.hooks.compilation</code></div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1fqo2khidh6lefyohph22htdcsc8fku8vxc14cq5p9uz8ppmklmekzrbekueyfiukp18"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">SyncBailHook</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1fqo2khidh6lefyohph22htdcsc8fku8vxc1qhtovo04njlapok94mopi4cu4ro6e645">同步熔断钩子</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1fqo2khidh6lefyohph22htdcsc8fku8vxc10bo0cuj91aj9hq75tp6ll4c9ot1vmegq">Webpack 共出现 66 次，如 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">Compiler.hooks.shouldEmit</code></div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr17yaadu4b084z2jlfo2aas7298khe2m71xc14cq5p9uz8ppmklmekzrbekueyfiukp18"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">SyncWaterfallHook</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr17yaadu4b084z2jlfo2aas7298khe2m71xc1qhtovo04njlapok94mopi4cu4ro6e645">同步瀑布流钩子</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr17yaadu4b084z2jlfo2aas7298khe2m71xc10bo0cuj91aj9hq75tp6ll4c9ot1vmegq">Webpack 共出现 37 次，如 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">Compilation.hooks.assetPath</code></div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1alqztjrgvrhaw70j93bkdgf8bkw3kgnkxc14cq5p9uz8ppmklmekzrbekueyfiukp18"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">SyncLoopHook</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1alqztjrgvrhaw70j93bkdgf8bkw3kgnkxc1qhtovo04njlapok94mopi4cu4ro6e645">同步循环钩子</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1alqztjrgvrhaw70j93bkdgf8bkw3kgnkxc10bo0cuj91aj9hq75tp6ll4c9ot1vmegq">Webpack 中未使用</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1qqdbchebq1sc4vv0kqlbeanv2nd8nwqqxc14cq5p9uz8ppmklmekzrbekueyfiukp18"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">AsyncParallelHook</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1qqdbchebq1sc4vv0kqlbeanv2nd8nwqqxc1qhtovo04njlapok94mopi4cu4ro6e645">异步并行钩子</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1qqdbchebq1sc4vv0kqlbeanv2nd8nwqqxc10bo0cuj91aj9hq75tp6ll4c9ot1vmegq">Webpack 仅出现 1 次：<code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">Compiler.hooks.make</code></div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr19uuej2bj88tdaejgm0u0f4du7ufpdji2xc14cq5p9uz8ppmklmekzrbekueyfiukp18"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">AsyncParallelBailHook</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr19uuej2bj88tdaejgm0u0f4du7ufpdji2xc1qhtovo04njlapok94mopi4cu4ro6e645">异步并行熔断钩子</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr19uuej2bj88tdaejgm0u0f4du7ufpdji2xc10bo0cuj91aj9hq75tp6ll4c9ot1vmegq">Webpack 中未使用</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1q50uu3lru8bn8gl1hny6tcmbfe5zjc1qxc14cq5p9uz8ppmklmekzrbekueyfiukp18"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">AsyncSeriesHook</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1q50uu3lru8bn8gl1hny6tcmbfe5zjc1qxc1qhtovo04njlapok94mopi4cu4ro6e645">异步串行钩子</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1q50uu3lru8bn8gl1hny6tcmbfe5zjc1qxc10bo0cuj91aj9hq75tp6ll4c9ot1vmegq">Webpack 共出现 16 次，如 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">Compiler.hooks.done</code></div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1294lhk7hulw9oo9uot4pywnyzo5aici7xc14cq5p9uz8ppmklmekzrbekueyfiukp18"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">AsyncSeriesBailHook</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1294lhk7hulw9oo9uot4pywnyzo5aici7xc1qhtovo04njlapok94mopi4cu4ro6e645">异步串行熔断钩子</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1294lhk7hulw9oo9uot4pywnyzo5aici7xc10bo0cuj91aj9hq75tp6ll4c9ot1vmegq">Webpack 中未使用</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1ksaliremb7gg7jvwt9lt543d3t2vis6ixc14cq5p9uz8ppmklmekzrbekueyfiukp18"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">AsyncSeriesLoopHook</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1ksaliremb7gg7jvwt9lt543d3t2vis6ixc1qhtovo04njlapok94mopi4cu4ro6e645">异步串行循环钩子</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1ksaliremb7gg7jvwt9lt543d3t2vis6ixc10bo0cuj91aj9hq75tp6ll4c9ot1vmegq">Webpack 中未使用</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1lalt6m4dmi308e6kwv044oewcp8njeh7xc14cq5p9uz8ppmklmekzrbekueyfiukp18"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">AsyncSeriesWaterfallHook</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1lalt6m4dmi308e6kwv044oewcp8njeh7xc1qhtovo04njlapok94mopi4cu4ro6e645">异步串行瀑布流钩子</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1lalt6m4dmi308e6kwv044oewcp8njeh7xc10bo0cuj91aj9hq75tp6ll4c9ot1vmegq">Webpack 共出现 5 次，如 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">NormalModuleFactory.hooks.beforeResolve</code></div></td></tr></tbody></table>

类型虽多，但整体遵循两种分类规则：

- 按回调逻辑，分为：
  - 基本类型，名称不带 `Waterfall/Bail/Loop` 关键字：与通常 `订阅/回调` 模式相似，按钩子注册顺序，逐次调用回调；
  - `waterfall` 类型：前一个回调的返回值会被带入下一个回调；
  - `bail` 类型：逐次调用回调，若有任何一个回调返回非 `undefined` 值，则终止后续调用；
  - `loop` 类型：逐次、循环调用，直到所有回调函数都返回 `undefined` 。
- 按执行回调的并行方式，分为：
  - `sync` ：同步执行，启动后会按次序逐个执行回调，支持 `call/tap` 调用语句；
  - `async` ：异步执行，支持传入 callback 或 promise 风格的异步回调函数，支持 `callAsync/tapAsync` 、`promise/tapPromise` 两种调用语句。

所有钩子都可以按名称套进这两条规则里面，对插件开发者来说不同类型的钩子会直接影响到回调函数的写法，以及插件与其他插件的互通关系，但是有一些基本能力、概念是通用的：`tap/call`、`intercept`、`context`、动态编译等。

接下来展开详细介绍每种钩子的特点与执行逻辑。

## `SyncHook` 钩子

`SyncHook` 算的上是简单的钩子了，触发后会按照注册的顺序逐个调用回调，且不关心这些回调的返回值，底层逻辑大致如下述代码：

```js
function syncCall() {
  const callbacks = [fn1, fn2, fn3];
  for (let i = 0; i < callbacks.length; i++) {
    const cb = callbacks[i];
    cb();
  }
}
```

举个例子：

```js
const { SyncHook } = require("tapable");

class Somebody {
  constructor() {
    this.hooks = {
      sleep: new SyncHook(),
    };
  }
  sleep() {
    //   触发回调
    this.hooks.sleep.call();
  }
}

const person = new Somebody();

// 注册回调
person.hooks.sleep.tap("test", () => {
  console.log("callback A");
});
person.hooks.sleep.tap("test", () => {
  console.log("callback B");
});
person.hooks.sleep.tap("test", () => {
  console.log("callback C");
});

person.sleep();
// 输出结果：
// callback A
// callback B
// callback C
```

示例中，`Somebody` 初始化时声明了一个 `sleep` 钩子，并在后续调用 `sleep.tap` 函数连续注册三次回调，在调用 `person.sleep()` 语句触发 `sleep.call` 之后，tapable 会按照注册的先后按序执行三个回调。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b92ebab230e746caaa7a0ae4b90ae581~tplv-k3u1fbpfcp-watermark.image?)

上述示例中，触发回调时用到了钩子的 `call` 函数，我们也可以选择异步风格的 `callAsync` ，选用 `call` 或 `callAsync` 并不会影响回调的执行逻辑：按注册顺序依次执行 + 忽略回调执行结果，两者唯一的区别是 `callAsync` 需要传入 `callback` 函数，用于处理回调队列可能抛出的异常：

```js
// call 风格
try {
  this.hooks.sleep.call();
} catch (e) {
    // 错误处理逻辑
}
// callAsync 风格
this.hooks.sleep.callAsync((err) => {
  if (err) {
    // 错误处理逻辑
  }
});
```

由于调用方式不会 Hook 本身的规则，所以对使用者来说，无需关心底层到底用的是 `call` 还是 `callAsync`，上面的例子只需要做简单的修改就可以适配 `callAsync` 场景：

```js
const { SyncHook } = require("tapable");

class Somebody {
  constructor() {
    this.hooks = {
      sleep: new SyncHook(),
    };
  }
  sleep() {
    //   触发回调
    this.hooks.sleep.callAsync((err) => {
      if (err) {
        console.log(`interrupt with "${err.message}"`);
      }
    });
  }
}

const person = new Somebody();

// 注册回调
person.hooks.sleep.tap("test", (cb) => {
  console.log("callback A");
  throw new Error("我就是要报错");
});
// 第一个回调出错后，后续回调不会执行
person.hooks.sleep.tap("test", () => {
  console.log("callback B");
});

person.sleep();

// 输出结果：
// callback A
// interrupt with "我就是要报错"
```

## `SyncBailHook` 钩子

`bail` 单词有熔断的意思，而 `bail` 类型钩子的特点是在回调队列中，若任一回调返回了非 `undefined` 的值，则中断后续处理，直接返回该值，用一段伪代码来表示：

```js
function bailCall() {
  const callbacks = [fn1, fn2, fn3];
  for (let i in callbacks) {
    const cb = callbacks[i];
    const result = cb(lastResult);
    // 如果有任意一个回调返回结果，则停止调用剩下的回调
    if (result !== undefined) {
      // 熔断
      return result;
    }
  }
  return undefined;
}
```

`SyncBailHook` 的调用顺序与规则都跟 `SyncHook` 相似，主要区别一是 `SyncBailHook` 增加了熔断逻辑，例如：

```js
const { SyncBailHook } = require("tapable");

class Somebody {
  constructor() {
    this.hooks = {
      sleep: new SyncBailHook(),
    };
  }
  sleep() {
    return this.hooks.sleep.call();
  }
}

const person = new Somebody();

// 注册回调
person.hooks.sleep.tap("test", () => {
  console.log("callback A");
  // 熔断点
  // 返回非 undefined 的任意值都会中断回调队列
  return '返回值：tecvan'
});
person.hooks.sleep.tap("test", () => {
  console.log("callback B");
});

console.log(person.sleep());

// 运行结果：
// callback A
// 返回值：tecvan
```

其次，相比于 `SyncHook` ，`SyncBailHook` 运行结束后，会将熔断值返回给call函数，例如上例第20行， `callback A` 返回的 `返回值：tecvan` 会成为 `this.hooks.sleep.call` 的调用结果。

> 在 Webpack 中被如何使用

`SyncBailHook` 通常用在发布者需要关心订阅回调运行结果的场景， Webpack 内部有接近 100 个地方用到这种钩子，举个例子： `compiler.hooks.shouldEmit`，对应的 call 语句：

```js
class Compiler {
  run(callback) {
    //   ...

    const onCompiled = (err, compilation) => {
      if (this.hooks.shouldEmit.call(compilation) === false) {
        // ...
      }
    };
  }
}
```

此处 Webpack 会根据 `shouldEmit` 钩子的运行结果确定是否执行后续的操作，其它场景也有相似逻辑，如：

- `NormalModuleFactory.hooks.createModule` ：预期返回新建的 Module 对象；
- `Compilation.hooks.needAdditionalSeal` ：预期返回 bool 值，判定是否进入 `unseal` 状态；
- `Compilation.hooks.optimizeModules` ：预期返回 bool 值，用于判定是否继续执行优化操作。

## `SyncWaterfallHook` 钩子

`waterfall` 钩子的执行逻辑跟 lodash 的 `flow` 函数有点像，大致上就是将前一个函数的返回值作为参数传入下一个函数，逻辑如下：

```js
function waterfallCall(arg) {
  const callbacks = [fn1, fn2, fn3];
  let lastResult = arg;
  for (let i in callbacks) {
    const cb = callbacks[i];
    // 上次执行结果作为参数传入下一个函数
    lastResult = cb(lastResult);
  }
  return lastResult;
}
```

理解上述逻辑后，`SyncWaterfallHook` 的特点也就很明确了：

1.  上一个函数的结果会被带入下一个函数；
2.  最后一个回调的结果会作为 `call` 调用的结果返回。

例如：

```js
const { SyncWaterfallHook } = require("tapable");

class Somebody {
  constructor() {
    this.hooks = {
      sleep: new SyncWaterfallHook(["msg"]),
    };
  }
  sleep() {
    return this.hooks.sleep.call("hello");
  }
}

const person = new Somebody();

// 注册回调
person.hooks.sleep.tap("test", (arg) => {
  console.log(`call 调用传入： ${arg}`);
  return "tecvan";
});

person.hooks.sleep.tap("test", (arg) => {
  console.log(`A 回调返回： ${arg}`);
  return "world";
});

console.log("最终结果：" + person.sleep());
// 运行结果：
// call 调用传入： hello
// A 回调返回： tecvan
// 最终结果：world
```

示例中，`sleep` 钩子为 `SyncWaterfallHook` 类型，之后注册了两个回调，从处理结果可以看到，第一个回调收到的 `arg = hello` ，即第10行 call 调用时传入的参数；第二个回调收到的是第一个回调返回的结果 `tecvan`；之后 `call` 调用返回的是第二个回调的结果 `world` 。

使用时，`SyncWaterfallHook` 钩子有一些注意事项：

- 初始化时必须提供参数，例如上例 `new SyncWaterfallHook(["msg"])` 构造函数中，必须传入参数 `["msg"]` ，用于动态编译 `call` 的参数依赖，后面我们会讲到 **动态编译** 的细节；
- 发布调用 `call` 时，需要传入初始参数。

> 在 Webpack 中被如何使用

`SyncWaterfallHook` 在 Webpack 中总共出现了 50+次，其中比较有代表性的例子是 `NormalModuleFactory.hooks.factory` ，在 Webpack 内部实现中，会在这个钩子内根据资源类型 `resolve` 出对应的 `module` 对象：

```js
class NormalModuleFactory {
  constructor() {
    this.hooks = {
      factory: new SyncWaterfallHook(["filename", "data"]),
    };

    this.hooks.factory.tap("NormalModuleFactory", () => (result, callback) => {
      let resolver = this.hooks.resolver.call(null);

      if (!resolver) return callback();

      resolver(result, (err, data) => {
        if (err) return callback(err);

        // direct module
        if (typeof data.source === "function") return callback(null, data);

        // ...
      });
    });
  }

  create(data, callback) {
    //   ...
    const factory = this.hooks.factory.call(null);
    // ...
  }
}
```

大致上就是在创建模块，通过 `factory` 钩子将 `module` 的创建过程外包出去，在钩子回调队列中依据 `waterfall` 的特性逐步推断出最终的 `module` 对象。

## `SyncLoopHook` 钩子

`loop` 型钩子的特点是循环执行，直到所有回调都返回 `undefined` ，不过这里循环的维度是单个回调函数，例如有回调队列 `[fn1, fn2, fn3]` ，`loop` 钩子先执行 `fn1` ，如果此时 `fn1` 返回了非 `undefined` 值，则继续执行 `fn1` 直到返回 `undefined` 后，才向前推进执行 `fn2` 。伪代码：

```js
function loopCall() {
  const callbacks = [fn1, fn2, fn3];
  for (let i in callbacks) {
    const cb = callbacks[i];
    // 重复执行
    while (cb() !== undefined) {}
  }
}
```

由于 `loop` 钩子循环执行的特性，使用时务必十分注意，避免陷入死循环。示例：

```js
const { SyncLoopHook } = require("tapable");

class Somebody {
  constructor() {
    this.hooks = {
      sleep: new SyncLoopHook(),
    };
  }
  sleep() {
    return this.hooks.sleep.call();
  }
}

const person = new Somebody();
let times = 0;

// 注册回调
person.hooks.sleep.tap("test", (arg) => {
  ++times;
  console.log(`第 ${times} 次执行回调A`);
  if (times < 4) {
    return times;
  }
});

person.hooks.sleep.tap("test", (arg) => {
  console.log(`执行回调B`);
});

person.sleep();
// 运行结果
// 第 1 次执行回调A
// 第 2 次执行回调A
// 第 3 次执行回调A
// 第 4 次执行回调A
// 执行回调B
```

可以看到示例中一直在执行回调 A，直到满足判定条件 `times >= 4` ，A 返回 `undefined` 后，才开始执行回调B。

虽然 Tapable 提供了 `SyncLoopHook` 钩子，但 Webpack 源码中并没有使用到，所以大家理解用法就行，不用深究。

## `AsyncSeriesHook` 钩子

前面这些以 `Sync` 开头的都是同步风格的钩子，执行逻辑相对简单，但不支持异步回调，所以 Tapable 还提供了一系列 `Async` 开头的异步钩子，支持在回调函数中执行异步操作，执行逻辑比较复杂。

例如 `AsyncSeriesHook`，它有这样一些特点：

- 支持异步回调，可以在回调函数中写 `callback` 或 `promise` 风格的异步操作；
- 回调队列依次执行，前一个执行结束后，才会开始执行下一个；
- 与 `SyncHook` 一样，不关心回调的执行结果。

用一段伪代码来表示：

```js
function asyncSeriesCall(callback) {
  const callbacks = [fn1, fn2, fn3];
  //   执行回调 1
  fn1((err1) => {
    if (err1) {
      callback(err1);
    } else {
      //   执行回调 2
      fn2((err2) => {
        if (err2) {
          callback(err2);
        } else {
          //   执行回调 3
          fn3((err3) => {
            if (err3) {
              callback(err2);
            }
          });
        }
      });
    }
  });
}
```

先来看一个 `callback` 风格的示例：

```js
const { AsyncSeriesHook } = require("tapable");

const hook = new AsyncSeriesHook();

// 注册回调
hook.tapAsync("test", (cb) => {
  console.log("callback A");
  setTimeout(() => {
    console.log("callback A 异步操作结束");
    // 回调结束时，调用 cb 通知 tapable 当前回调已结束
    cb();
  }, 100);
});

hook.tapAsync("test", () => {
  console.log("callback B");
});

hook.callAsync();
// 运行结果：
// callback A
// callback A 异步操作结束
// callback B
```

从代码输出结果可以看出，A 回调内部的 `setTimeout` 执行完毕调用 `cb` 函数，`tapable` 才认为当前回调执行完毕，开始执行 B 回调。

除了 `callback` 风格外，也可以使用 promise 风格调用 `tap/call` 函数，改造上例：

```js
const { AsyncSeriesHook } = require("tapable");

const hook = new AsyncSeriesHook();

// 注册回调
hook.tapPromise("test", () => {
  console.log("callback A");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("callback A 异步操作结束");
      resolve();
    }, 100);
  });
});

hook.tapPromise("test", () => {
  console.log("callback B");
  return Promise.resolve();
});

hook.promise();
// 运行结果：
// callback A
// callback A 异步操作结束
// callback B
```

有三个改动点：

- 将 `tapAsync` 更改为 `tapPromise`；
- Tap 回调需要返回 promise 对象，如上例第 8 行；
- `callAsync` 调用更改为 `promise`。

> 在 Webpack 中被如何使用

`AsyncSeriesHook` 钩子在 Webpack 中总共出现了 30+ 次，相对来说都是一些比较容易理解的时机，比如在构建完毕后触发 `compiler.hooks.done` 钩子，用于通知单次构建已经结束：

```js
class Compiler {
  run(callback) {
    if (err) return finalCallback(err);

    this.emitAssets(compilation, (err) => {
      if (err) return finalCallback(err);

      if (compilation.hooks.needAdditionalPass.call()) {
        // ...
        this.hooks.done.callAsync(stats, (err) => {
          if (err) return finalCallback(err);

          this.hooks.additionalPass.callAsync((err) => {
            if (err) return finalCallback(err);
            this.compile(onCompiled);
          });
        });
        return;
      }

      this.emitRecords((err) => {
        if (err) return finalCallback(err);

        // ...
        this.hooks.done.callAsync(stats, (err) => {
          if (err) return finalCallback(err);
          return finalCallback(null, stats);
        });
      });
    });
  }
}
```

## `AsyncParallelHook` 钩子

与 `AsyncSeriesHook` 类似，`AsyncParallelHook` 也支持异步风格的回调，不过 `AsyncParallelHook` 是以并行方式，同时执行回调队列里面的所有回调，逻辑上近似于：

```js
function asyncParallelCall(callback) {
  const callbacks = [fn1, fn2];
  // 内部维护了一个计数器
  var _counter = 2;

  var _done = function() {
    _callback();
  };
  if (_counter <= 0) return;
  // 按序执行回调
  var _fn0 = callbacks[0];
  _fn0(function(_err0) {
    if (_err0) {
      if (_counter > 0) {
        // 出错时，忽略后续回调，直接退出
        _callback(_err0);
        _counter = 0;
      }
    } else {
      if (--_counter === 0) _done();
    }
  });
  if (_counter <= 0) return;
  // 不需要等待前面回调结束，直接开始执行下一个回调
  var _fn1 = callbacks[1];
  _fn1(function(_err1) {
    if (_err1) {
      if (_counter > 0) {
        _callback(_err1);
        _counter = 0;
      }
    } else {
      if (--_counter === 0) _done();
    }
  });
}
```

`AsyncParallelHook` 钩子的特点：

- 支持异步风格；
- 并行执行回调队列，不需要做任何等待；
- 与 `SyncHook` 一样，不关心回调的执行结果。

## 实践应用

综上，Tapable 合计提供了 10 种钩子，支持同步、异步、熔断、循环、waterfall 等功能特性，以此支撑起 Webpack 复杂的构建需求。虽然多数情况下我们不需要手动调用 Tapable，但编写插件时可以借助这些知识，识别 Hook 类型与执行特性后，正确地调用，正确地实现交互。

例如：对于 [compiler.hooks.done](https://webpack.js.org/api/compiler-hooks/#done) 钩子，官网介绍：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a27c1a2560c4926aa76f9a8adefa035~tplv-k3u1fbpfcp-watermark.image?)


这是一个 `AsyncSeriesHook` 钩子，意味着：

- 支持异步语法，我们可以用 `tap/tapAsync/tapPromise` 方式注册回调；
- Webpack 会按照注册顺序串行执行回调；
- Webpack 不关心回调的返回值，但可以通过 `callback` 函数传递 Error 信息。

又或者，对于 [compilation.hooks.optimizeChunkModules](https://webpack.js.org/api/compilation-hooks/#optimizemodules) 钩子，官网介绍：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba180e097d804216800ec285758b9a44~tplv-k3u1fbpfcp-watermark.image?)

这是一个 `SyncBailHook` 钩子，因此：

- 不支持异步语法，我们只能用 `tap` 注册回调；
- 若任意回调有返回值，则中断 Hook 流程，后面回调不再执行，所以使用时需要谨慎。

其它 Hook 也能用类似方法，参照分析出钩子的应用技巧。

> 提示：Webpack 官方文档并没有覆盖介绍所有钩子，必要时建议读者直接翻阅 Webpack 源码，分析钩子类型。

## Hook 动态编译

至此，Webpack 中用到的 Hook 子类都已介绍完毕，不同 Hook 适用于不同场景，解决不同问题，而它们底层都基于 Tapable 的“动态编译”实现，可以说，理解了动态编译，也就掌握了 Tapable 的核心实现逻辑。

动态编译是一个非常大胆的设计，不同 Hook 所谓的同步、异步、bail、waterfall、loop 等回调规则都是 Tapable 根据 Hook 类型、参数、回调队列等参数，调用 `new Function` 语句动态拼装出一段控制执行流程的 JavaScript 代码实现控制的。例如：

```js
const { SyncHook } = require("tapable");

const sleep = new SyncHook();

sleep.tap("test", () => {
  console.log("callback A");
});
sleep.call();
```

调用 `sleep.call` 时，Tapable 内部处理流程大致为：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1353e6ffa8794086b3dadb91a1de8b04~tplv-k3u1fbpfcp-watermark.image?)

编译过程主要涉及三个实体：

- `tapable/lib/SyncHook.js` ：定义 `SyncHook` 的入口文件；
- `tapable/lib/Hook.js` ：`SyncHook` 只是一个代理接口，内部实际上调用了 `Hook` 类，由 `Hook` 负责实现钩子的逻辑（其它钩子也是一样的套路）；
- `tapable/lib/HookCodeFactory.js` ：动态编译出 `call`、`callAsync`、`promise` 函数内容的工厂类，注意，其他钩子也都会用到 `HookCodeFactory` 工厂函数。

`SyncHook` （其他钩子类似\)）调用 `call` 后，`Hook` 基类收集上下文信息并调用 `createCall` 及子类传入的 `compiler` 函数；`compiler` 调用 `HookCodeFactory` 进而使用 `new Function` 方法动态拼接出回调执行函数。上面例子对应的生成函数：

```js
(function anonymous(
) {
"use strict";
var _context;
var _x = this._x;
var _fn0 = _x[0];
_fn0();

})
```

那么问题来了，通过 `new Function`、`eval` 等方式实现的动态编译，存在诸如性能、安全性等方面的问题，所以社区很少见到类似的设计，真的有必要用这种方式实现 Hook 吗？

这放在 `SyncHook` 这种简单场景确实大可不必，但若是更复杂的 Hook，如 `AsyncSeriesWaterfallHook`：

```js
const { AsyncSeriesWaterfallHook } = require("tapable");

const sleep = new AsyncSeriesWaterfallHook(["name"]);

sleep.tapAsync("test1", (name, cb) => {
  console.log(`执行 A 回调： 参数 name=${name}`);
  setTimeout(() => {
    cb(undefined, "tecvan2");
  }, 100);
});

sleep.tapAsync("test", (name, cb) => {
  console.log(`执行 B 回调： 参数 name=${name}`);
  setTimeout(() => {
    cb(undefined, "tecvan3");
  }, 100);
});

sleep.tapAsync("test", (name, cb) => {
  console.log(`执行 C 回调： 参数 name=${name}`);
  setTimeout(() => {
    cb(undefined, "tecvan4");
  }, 100);
});

sleep.callAsync("tecvan", (err, name) => {
  console.log(`回调结束， name=${name}`);
});

// 运行结果：
// 执行 A 回调： 参数 name=tecvan
// 执行 B 回调： 参数 name=tecvan2
// 执行 C 回调： 参数 name=tecvan3
// 回调结束， name=tecvan4
```

`AsyncSeriesWaterfallHook` 的特点是异步 + 串行 + 前一个回调的返回值会传入下一个回调，对应生成函数：

```js
(function anonymous(name, _callback) {
  "use strict";
  var _context;
  var _x = this._x;
  function _next1() {
    var _fn2 = _x[2];
    _fn2(name, function(_err2, _result2) {
      if (_err2) {
        _callback(_err2);
      } else {
        if (_result2 !== undefined) {
          name = _result2;
        }
        _callback(null, name);
      }
    });
  }
  function _next0() {
    var _fn1 = _x[1];
    _fn1(name, function(_err1, _result1) {
      if (_err1) {
        _callback(_err1);
      } else {
        if (_result1 !== undefined) {
          name = _result1;
        }
        _next1();
      }
    });
  }
  var _fn0 = _x[0];
  _fn0(name, function(_err0, _result0) {
    if (_err0) {
      _callback(_err0);
    } else {
      if (_result0 !== undefined) {
        name = _result0;
      }
      _next0();
    }
  });
});
```

核心逻辑：

- 生成函数将回调队列各个项封装为 `_next0/_next1` 函数，这些 `next` 函数内在逻辑高度相似；
- 按回调定义的顺序，逐次执行，上一个回调结束后，才调用下一个回调，例如生成代码中的第39行、27行。

相比于用递归、循环之类的手段实现 `AsyncSeriesWaterfallHook`，这段动态生成的函数逻辑确实会更清晰，更容易理解，这种场景下用动态编译，确实是一个不错的选择。

Tapable 提供的大多数特性都是基于 `Hook + HookCodeFactory` 实现的，如果大家对此有兴趣，可以在 [tapable/lib/Hook.js](https://github1s.com/webpack/tapable/blob/master/lib/Hook.js#L12) 的 `CALL_DELEGATE/CALL_ASYNC_DELEGATE/PROMISE_DELEGATE` 几个函数打断点：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b5b6274428f46649a9fd71ffa3d7834~tplv-k3u1fbpfcp-watermark.image?)

之后，使用 [ndb](https://github.com/GoogleChromeLabs/ndb) 命令断点调试，查看动态编译出的代码：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/472e9bca1ddf442a9d44970ae700f59c~tplv-k3u1fbpfcp-watermark.image?)

## 高级特性：Intercept

除了通常的 `tap/call` 之外，tapable 还提供了简易的中间件机制 —— `intercept` 接口，例如

```js
const sleep = new SyncHook();

sleep.intercept({
  name: "test",
  context: true,
  call() {
    console.log("before call");
  },
  loop(){
    console.log("before loop");
  },
  tap() {
    console.log("before each callback");
  },
  register() {
    console.log("every time call tap");
  },
});
```

`intercept` 支持注册如下类型的中间件：

<table data-ace-table-col-widths="100;286;491;" class="ace-table author-6857319138482798593"><colgroup><col width="100"><col width="286"><col width="491"></colgroup><tbody><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr164cg6rvtu80r9q99ksthu6me5wn1teozxc1ky297uuvvq8ngej65km1c7l8tnsnjwhk"></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr164cg6rvtu80r9q99ksthu6me5wn1teozxc1z6s95brk9fgpv28lg0omkuuw9l32fr3q">签名</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr164cg6rvtu80r9q99ksthu6me5wn1teozxc16h5t5jijbgu438q5pcluwj3l9v3wv5y7">解释</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1ozy0qlb1wel71mc9lz61rhi0uhg6gg4pxc1ky297uuvvq8ngej65km1c7l8tnsnjwhk"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">call</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1ozy0qlb1wel71mc9lz61rhi0uhg6gg4pxc1z6s95brk9fgpv28lg0omkuuw9l32fr3q"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">(...args) =&gt; void</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1ozy0qlb1wel71mc9lz61rhi0uhg6gg4pxc16h5t5jijbgu438q5pcluwj3l9v3wv5y7">调用 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">call/callAsync/promise</code> 时触发</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr14h2c1lmv77dt7uhy287nuqps2oa47wv9xc1ky297uuvvq8ngej65km1c7l8tnsnjwhk"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">tap</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr14h2c1lmv77dt7uhy287nuqps2oa47wv9xc1z6s95brk9fgpv28lg0omkuuw9l32fr3q"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">(tap: Tap) =&gt; void</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr14h2c1lmv77dt7uhy287nuqps2oa47wv9xc16h5t5jijbgu438q5pcluwj3l9v3wv5y7">调用 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">call</code> 类函数后，每次调用回调之前触发</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1f8t26s9oywoqpj72p19r10y9lcdyeddqxc1ky297uuvvq8ngej65km1c7l8tnsnjwhk"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">loop</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1f8t26s9oywoqpj72p19r10y9lcdyeddqxc1z6s95brk9fgpv28lg0omkuuw9l32fr3q"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">(...args) =&gt; void</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1f8t26s9oywoqpj72p19r10y9lcdyeddqxc16h5t5jijbgu438q5pcluwj3l9v3wv5y7">仅 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">loop</code> 型的钩子有效，在循环开始之前触发</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1eeopciskpuzdyad2o7bgsod218rmmn6ixc1ky297uuvvq8ngej65km1c7l8tnsnjwhk"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">register</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1eeopciskpuzdyad2o7bgsod218rmmn6ixc1z6s95brk9fgpv28lg0omkuuw9l32fr3q"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">(tap: Tap) =&gt; Tap | undefined</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1eeopciskpuzdyad2o7bgsod218rmmn6ixc16h5t5jijbgu438q5pcluwj3l9v3wv5y7">调用 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">tap/tapAsync/tapPromise</code> 时触发</div></td></tr></tbody></table>

其中 `register` 在每次调用 `tap` 时被调用；其他三种中间件的触发时机大致如下：

```js
  var _context;
  const callbacks = [fn1, fn2];
  var _interceptors = this.interceptors;
  // 调用 call 函数，立即触发
  _interceptors.forEach((intercept) => intercept.call(_context));
  var _loop;
  var cursor = 0;
  do {
    _loop = false;
    // 每次循环开始时触发 `loop`
    _interceptors.forEach((intercept) => intercept.loop(_context));
    // 触发 `tap`
    var _fn0 = callbacks[0];
    _interceptors.forEach((intercept) => intercept.tap(_context, _fn0));
    var _result0 = _fn0();
    if (_result0 !== undefined) {
      _loop = true;
    } else {
      var _fn1 = callbacks[1];
      // 再次触发 `tap`
      _interceptors.forEach((intercept) => intercept.tap(_context, _fn1));
      var _result1 = _fn1();
      if (_result1 !== undefined) {
        _loop = true;
      }
    }
  } while (_loop);
```

`intercept` 特性在 Webpack 内主要被用作进度提示，如 `Webpack/lib/ProgressPlugin.js` 插件中，分别对 `compiler.hooks.emit` 、`compiler.hooks.afterEmit` 钩子应用了记录进度的中间件函数。其他类型的插件应用较少。

## 高级特性：HookMap

Tapable 还有一个值得注意的特性 —— `HookMap`，它提供了一种集合操作能力，能够降低创建与使用的复杂度，用法比较简单：

```js
const { SyncHook, HookMap } = require("tapable");

const sleep = new HookMap(() => new SyncHook());

// 通过 for 函数过滤集合中的特定钩子
sleep.for("statement").tap("test", () => {
  console.log("callback for statement");
});

// 触发 statement 类型的钩子
sleep.get("statement").call();
```

`HookMap` 能够用于实现的动态获取钩子功能，例如在 Webpack 的 `lib/parser.js` 文件中，`parser` 文件主要完成将资源内容解析为 AST 集合，之后遍历 AST 并以 `HookMap` 方式对外通知遍历到的内容。

例如，遇到表达式的时候触发 `Parser.hooks.expression` 钩子，问题是 AST 结构和内容都很复杂，如果所有情景都以独立的钩子实现，那代码量会急剧膨胀。这种场景就很适合用 `HookMap` 解决，以 `expression` 为例：

```js
class Parser {
  constructor() {
    this.hooks = {
      // 定义钩子
      // 这里用到 HookMap ，所以不需要提前遍历枚举所有 expression 场景
      expression: new HookMap(() => new SyncBailHook(["expression"])),
    };
  }

  //   不同场景下触发钩子
  walkMemberExpression(expression) {
    const exprName = this.getNameForExpression(expression);
    if (exprName && exprName.free) {
      // 触发特定类型的钩子
      const expressionHook = this.hooks.expression.get(exprName.name);
      if (expressionHook !== undefined) {
        const result = expressionHook.call(expression);
        if (result === true) return;
      }
    }
    // ...
  }

  walkThisExpression(expression) {
    const expressionHook = this.hooks.expression.get("this");
    if (expressionHook !== undefined) {
      expressionHook.call(expression);
    }
  }
}
```

上例代码第 15、25 行都通过 `this.hooks.expression.get(xxx)` 语句动态获取对应钩子实例，之后再调用 `call` 触发。HookMap 的消费逻辑与普通 Hook 类似，只需要增加 `for` 函数过滤出你实际监听的 Hook 实例即可，如：

```js
// 钩子消费逻辑
// 选取 CommonJsStuffPlugin 仅起示例作用
class CommonJsStuffPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      "CommonJsStuffPlugin",
      (compilation, { normalModuleFactory }) => {
        const handler = (parser, parserOptions) => {
          // 通过 for 精确消费钩子
          parser.hooks.expression
            .for("require.main.require")
            .tap(
              "CommonJsStuffPlugin",
              ParserHelpers.expressionIsUnsupported(
                parser,
                "require.main.require is not supported by Webpack."
              )
            );
          parser.hooks.expression
            .for("module.parent.require")
            .tap(
              "CommonJsStuffPlugin",
              ParserHelpers.expressionIsUnsupported(
                parser,
                "module.parent.require is not supported by Webpack."
              )
            );
          parser.hooks.expression
            .for("require.main")
            .tap(
              "CommonJsStuffPlugin",
              ParserHelpers.toConstantDependencyWithWebpackRequire(
                parser,
                "__Webpack_require__.c[__Webpack_require__.s]"
              )
            );
          // ...
        };
      }
    );
  }
}
```

借助这种能力我们就不需要为每一种情况都单独创建 Hook，只需要在使用时动态创建、获取对应实例即可，能有效降低开发与维护成本。

## 总结

为了应对构建场景下各种复杂需求，Webpack 内部使用了多种类型的 Hook，分别用于实现同步、异步、熔断、串行、并行的流程逻辑，开发插件时需要注意识别 Hook 类型，据此做出正确的调用与交互逻辑。

## 思考题

为什么 Webpack 内部需要这些不同类型的流程逻辑？比如，为什么需要 `SyncBailHook` 这种具有熔断特性的钩子？适用于怎么样的场景？在我们日常业务开发中，能否复用这一类流程控制能力？