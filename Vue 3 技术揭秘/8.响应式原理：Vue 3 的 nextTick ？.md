## 前言

通过前面的几个章节的学习，我们大致了解了对于 `Vue 3` 中的响应式原理：我们通过对 `state` 数据的响应式拦截，当触发 `proxy setter` 的时候，执行对应状态的 `effect` 函数。接下来看一个经典的例子：

```html
<template>
  <div>{{number}}</div>
  <button @click="handleClick">click</button>
</template>
<script>
import { ref } from 'vue';
export default {
  setup() {
    const number = ref(0)
    function handleClick() {
      for (let i = 0; i < 1000; i++) {
        number.value ++;
      }
    }
    return {
      number,
      handleClick
    }
  }
}
</script>
```
当我们按下 `click` 按钮的时候，`number` 会被循环增加 `1000` 次。那么 `Vue` 的视图会在点击按钮的时候，从 `1 -> 1000` 刷新 `1000` 次吗？这一小节，我们将一起探探究竟。

## queueJob

我们小册[第四节](https://juejin.cn/book/7146465352120008743/section/7146510212571070471)介绍关于“组件更新策略”的时候，提到了 `setupRenderEffect` 函数：

```js
const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
  function componentUpdateFn() {
    if (!instance.isMounted) {
      // 初始化组件
    }
    else {
      // 更新组件
    }
  }
  // 创建响应式的副作用渲染函数
  instance.update = effect(componentUpdateFn, prodEffectOptions)
}
```

当时这里为了方便介绍组件的更新策略，我们简写了 `instance.update` 的函数创建过程，现在我们来详细看一下 `instance.update` 这个函数的创建：

```js
const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
  function componentUpdateFn() {
    // ...
  }
  // 创建响应式的副作用渲染函数
  const effect = (instance.effect = new ReactiveEffect(
    componentUpdateFn,
    () => queueJob(update),
    instance.scope
  ))
  
  // 生成 instance.update 函数
  const update = (instance.update = () => effect.run())
  update.id = instance.uid
  
  // 组件允许递归更新
  toggleRecurse(instance, true)

  // 执行更新
  update()
}
```

可以看到在创建 `effect` 副作用函数的时候，会给 `ReactiveEffect` 传入一个 `scheduler` 调度函数，这样生成的 `effect` 中就包含了 `scheduler` 属性。同时为组件实例生成了一个 `update` 属性，该属性的值就是执行 `effect.run` 的函数，另外需要注意的一点是 `update` 中包含了一个 `id` 信息，该值是一个初始值为 `0` 的自增数字，下文我们再详细介绍其作用。

当我们触发 `proxy setter` 的时候，触发执行了 `triggerEffect` 函数，这次，我们补全 `triggerEffect` 函数的实现：

```js
function triggerEffect(effect, debuggerEventExtraInfo) {
  if (effect !== activeEffect || effect.allowRecurse) {
    // effect 上存在 scheduler
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}
```
可以看到，如果 `effect` 上有 `scheduler` 属性时，执行的是 `effect.scheduler` 函数，否则执行 `effect.run` 进行视图更新。而这里显然我们需要先执行调度函数 `scheduler`。通过上面的信息，我们也清楚地知道 `scheduler` 函数的本质就是执行了 `queueJob(update)` 函数，一起来看一下 `queueJob` 的实现：
```js
export function queueJob(job) {
  // 去重判断
  if (
    !queue.length ||
    !queue.includes(
      job,
      isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
    )
  ) {
    // 添加到队列尾部
    if (job.id == null) {
      queue.push(job)
    } else {
      // 按照 job id 自增的顺序添加
      queue.splice(findInsertionIndex(job.id), 0, job)
    }
    queueFlush()
  }
}
```
`queueJob` 就是维护了一个 `queue` 队列，目的是向 `queue` 队列中添加 `job` 对象，这里的 `job` 就是我们前面的 `update` 对象。

这里有几点需要说明一下。

第一个是该函数会有一个 `isFlushing && job.allowRecurse` 判断，这个作用是啥呢？简单点说就是当队列正处于更新状态中（`isFlushing = true`） 且允许递归调用（ `job.allowRecurse = true`）时，将搜索起始位置加一，无法搜索到自身，也就是允许递归调用了。什么情况下会出现递归调用？

```html
<!-- 父组件 -->
<template>
  <div>{{msg}}</div>
  <Child />
</template>
<script>
import { ref, provide } from 'vue';
import Child from './components/Child.vue';
export default {
  setup() {
    const msg = ref("initial");
    provide("CONTEXT", { msg });
    return {
      msg
    };
  },
  components: {
    Child
  }
}
</script>

<!-- 子组件 Child -->
<template>
  <div>child</div>
</template>
<script>
import { inject } from 'vue';
export default {
  setup() {
    const ctx = inject("CONTEXT");
    ctx.msg.value = "updated";
  }
}
</script>
```
对于这种情况，首先是父组件进入 `job` 然后渲染父组件，接着进入子组件渲染，但是子组件内部修改了父组件的状态 `msg`。此时父组件需要支持递归渲染，也就是递归更新。

> 注意，这里的更新已经不属于单选数据流了，**如果过多地打破单向数据流，会导致多次递归执行更新，可能会导致性能下降。**


第二个是，`queueJob` 函数向 `queue` 队列中添加的 `job` 是按照 `id` 排序的，`id` 小的 `Job` 先被推入 `queue` 中执行，这保证了，**父组件永远比子组件先更新**（因为先创建父组件，再创建子组件，子组件可能依赖父组件的数据）。

再回到函数的本身来说，当我们执行 `for` 循环 `1000` 次 `setter` 的时候，因为在第一步进行了去重判断，所以 `update` 函数只会被添加一次到 `queue` 中。**这里的 `update` 函数就是组件的渲染函数**。所以无论这里执行多少次循环，渲染更新函数只会被执行一次。

## queueFlush
上面说到了无论循环多少次 `setter`，这里相同 `id` 的 `update` 只会被添加一次到 `queue` 中。

细心的小伙伴可能会有这样的疑问：**那么为什么视图不是从 `0 -> 1` 而是直接从 `0 -> 1000` 了呢？**

要回答上面的问题，就得了解一下 `queue` 的执行更新相关的内容了，也就是 `queueJob` 的最后一步 `queueFlush`：

```js
function queueFlush() {
  // 是否正处于刷新状态
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}
```
可以看到这里，`vue 3` 完全抛弃了除了 `promise` 之外的异步方案，不再支持`vue 2` 的 `Promise > MutationObserver > setImmediate > setTimeout` 其他三种异步操作了。

所以这里，`vue 3` 直接通过 `promise` 创建了一个微任务 `flushJobs` 进行异步调度更新，只要在浏览器当前 `tick` 内的所有更新任务都会被推入 `queue` 中，然后在下一个 `tick` 中统一执行更新。

```js
function flushJobs(seen) {
  // 是否正在等待执行
  isFlushPending = false
  // 正在执行
  isFlushing = true

  // 在更新前，重新排序好更新队列 queue 的顺序
  // 这确保了:
  // 1. 组件都是从父组件向子组件进行更新的。（因为父组件都在子组件之前创建的
  // 所以子组件的渲染的 effect 的优先级比较低）
  // 2. 如果父组件在更新前卸载了组件，这次更新将会被跳过。
  queue.sort(comparator)
  
  try {
    // 遍历主任务队列，批量执行更新任务
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex]
      if (job && job.active !== false) {
        callWithErrorHandling(job, null, ErrorCodes.SCHEDULER)
      }
    }
  } finally {
    // 队列任务执行完，重置队列索引
    flushIndex = 0
    // 清空队列
    queue.length = 0
    // 执行后置队列任务
    flushPostFlushCbs(seen)
    // 重置队列执行状态
    isFlushing = false
    // 重置当前微任务为 Null
    currentFlushPromise = null
    // 如果主任务队列、后置任务队列还有没被清空，就继续递归执行
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen)
    }
  }
}
```
在详细介绍 `flushJobs` 之前，我想先简单介绍一下 `Vue` 的更新任务执行机制中的一个重要概念：**更新时机。** `Vue` 整个更新过程分成了三个部分：

1. 更新前，称之为 `pre` 阶段；
2. 更新中，也就是 `flushing` 中，执行 `update` 更新；
3. 更新后，称之为 `flushPost` 阶段。

### 更新前

什么是 `pre` 阶段呢？拿组件更新举例，就是在 `Vue` 组件更新**之前**被调用执行的阶段。默认情况下，`Vue` 的 `watch` 和 `watchEffect` 函数中的 `callback` 函数都是在这个阶段被执行的，我们简单看一下 `watch` 中的源码实现：

```js
function watch(surce, cb, {immediate, deep, flush, onTrack, onTrigger} = {}) {
  // ...
  if (flush === 'sync') {
    scheduler = job
  } else if (flush === 'post') {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense)
  } else {
    // 默认会给 job 打上 pre 的标记
    job.pre = true
    if (instance) job.id = instance.uid
    scheduler = () => queueJob(job)
  }
}
```
可以看到 `watch` 的 `job` 会被默认打上 `pre` 的标签。而带 `pre` 标签的 `job` 则会在渲染前被执行：

```js
const updateComponent = () => {
  // ... 省略 n 行代码
  updateComponentPreRender(instance, n2, optimized)
}

function updateComponentPreRender() {
  // ... 省略 n 行代码
  flushPreFlushCbs()
}

export function flushPreFlushCbs(seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i]
    if (cb && cb.pre) {
      queue.splice(i, 1)
      i--
      cb()
    }
  }
}
```

可以看到，在执行 `updateComponent` 更新组件之前，会调用 `flushPreFlushCbs` 函数，执行所有带上 `pre` 标签的 `job`。

### 更新中
更新中的过程就是 `flushJobs` 函数体前面的部分，首先会通过一个 `comparator` 函数对 `queue` 队列进行排序，这里排序的目的主要是保证父组件优先于子组件执行，另外在执行后续循环执行 `job` 任务的时候，通过判断 `job.active !== false` 来剔除被 `unmount` 卸载的组件，卸载的组件会有 `active = false` 的标记。

最后即通过 `callWithErrorHandling` 函数执行 `queue` 队列中的每一个 `job`:

```
export function callWithErrorHandling(fn, instance, type, args) {
  let res
  try {
    res = args ? fn(...args) : fn()
  } catch (err) {
    handleError(err, instance, type)
  }
  return res
}
```

### 更新后
当页面更新后，需要执行的一些回调函数都存储在 `pendingPostFlushCbs` 中，通过 `flushPostFlushCbs` 函数来进行回调执行：

```js
export function flushPostFlushCbs(seen) {
  // 存在 job 才执行
  if (pendingPostFlushCbs.length) {
    // 去重
    const deduped = [...new Set(pendingPostFlushCbs)]
    pendingPostFlushCbs.length = 0
    
    // #1947 already has active queue, nested flushPostFlushCbs call
    // 已经存在activePostFlushCbs，嵌套flushPostFlushCbs调用，直接return
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped)
      return
    }
    
    activePostFlushCbs = deduped

    // 按job.id升序
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b))
    
    // 循环执行job
    for (
      postFlushIndex = 0;
      postFlushIndex < activePostFlushCbs.length;
      postFlushIndex++
    ) {
      activePostFlushCbs[postFlushIndex]()
    }
    activePostFlushCbs = null
    postFlushIndex = 0
  }
}
```
一些需要渲染完成后再执行的钩子函数都会在这个阶段执行，比如 `mounted hook` 等等。

## 总结

通过上面的一些介绍，我们可以了解到本小节开头的示例中，`number` 的更新函数只会被同步地添加一次到更新队列 `queue` 中，但更新是异步的，会在 `nextTick` 也就是 `Promise.then` 的微任务中执行 `update`，所以更新会直接从 `0 -> 1000`。

另外，需要注意的是一个组件内的相同 `update` 只会有一个被推入 `queue` 中。比如下面的例子：

```html
<template>
  <div>{{number}}</div>
  <div>{{msg}}</div>
  <button @click="handleClick">click</button>
</template>
<script>
import { ref } from 'vue'
export default {
  setup() {
    const number = ref(0)
    const msg = ref('init')
    function handleClick() {
      for (let i = 0; i < 1000; i++) {
        number.value ++;
      }
      msg.value = 'hello world'
    }
    return {
      number,
      msg,
      handleClick
    }
  }
}
</script>
```

当点击按钮时，因为 `update` 内部执行的是当前组件的同一个 `componentUpdateFn` 函数，状态 `msg` 和 `number` 的 `update` 的 `id` 是一致的，所以 `queue` 中，只有一个 `update` 函数，只会进行一次统一的更新。





