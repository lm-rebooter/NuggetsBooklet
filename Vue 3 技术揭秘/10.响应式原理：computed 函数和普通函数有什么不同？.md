## 前言
计算属性接受一个 `getter` 函数，返回一个只读的响应式 [ref](https://cn.vuejs.org/api/reactivity-core.html#ref) 对象。该 `ref` 通过 `.value` 暴露 `getter` 函数的返回值。

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // 错误
```

它也可以接受一个带有 `get` 和 `set` 函数的对象来创建一个可写的 ref 对象。

```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```

接下来看看源码里是如何实现 `computed` 的 `API`。

## 构造 setter 和 getter

```js
function computed(getterOrOptions, debugOptions, isSSR = false) {
  let getter
  let setter
  // 判断第一个参数是不是一个函数
  const onlyGetter = isFunction(getterOrOptions)
  
  // 构造 setter 和 getter 函数
  if (onlyGetter) {
    getter = getterOrOptions
    // 如果第一个参数是一个函数，那么就是只读的
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  // 构造 ref 响应式对象
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR)
  // 返回响应式 ref
  return cRef
}
```
可以看到，这段 `computed` 函数体最初就是需要格式化传入的参数，根据第一个参数入参的类型来构造统一的 `setter` 和 `getter` 函数，并传入 `ComputedRefImpl` 类中，进行实例化 `ref` 响应式对象。

接下来一起看看 `ComputedRefImpl` 是如何构造 `cRef` 响应式对象的。

## 构造 cRef 响应式对象

```js
class ComputedRefImpl {
  public dep = undefined

  private _value
  public readonly effect
  //表示 ref 类型
  public readonly __v_isRef = true
  //是否只读
  public readonly [ReactiveFlags.IS_READONLY] = false
  //用于控制是否进行值更新(代表是否脏值)
  public _dirty = true
  // 缓存
  public _cacheable

  constructor(
    getter,
    _setter,
    isReadonly,
    isSSR
  ) {
    // 把 getter 作为响应式依赖函数 fn 参数
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        // 触发更新
        triggerRefValue(this)
      }
    })
    // 标记 effect 的 computed 属性
    this.effect.computed = this
    this.effect.active = this._cacheable = !isSSR
    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value() {
    const self = toRaw(this)
    // 依赖收集
    trackRefValue(self)
    // 脏值则进行更新
    if (self._dirty || !self._cacheable) {
      self._dirty = false
      // 更新值
      self._value = self.effect.run()!
    }
    return self._value
  }
  // 执行 setter
  set value(newValue) {
    this._setter(newValue)
  }
}
```
简单看一下该类的实现：在构造函数的时候，创建了一个副作用对象 `effect`。并为 `effect` 额外定义了一个 `computed` 属性执行当前响应式对象 `cRef`。

另外，定义了一个 `get` 方法，当我们通过 `ref.value` 取值的时候可以进行依赖收集，将定义的 `effect` 收集起来。

其次，定义了一个 `set` 方法，该方法就是执行传入进来的 `setter` 函数。

最后，熟悉 `Vue` 的开发者都知道 `computed` 的特性就在于能够缓存计算的值（提升性能），只有当 `computed` 的依赖发生变化时才会重新计算，否则读取 `computed` 的值则一直是之前的值。在源码这里，实现上述功能相关的变量分别是 `_dirty` 和 `_cacheable` 这 2 个，用来控制缓存的实现。

有了上面的介绍，我们来看一个具体的例子，看看 `computed` 是如何执行的：

```html
<template> 
  <div> 
    {{ plusOne }} 
  </div> 
  <button @click="plus">plus</button> 
</template> 
<script> 
  import { ref, computed } from 'vue' 
  export default { 
    setup() { 
      const num = ref(0) 
      const plusOne = computed(() => { 
        return num.value + 1 
      }) 

      function plus() { 
        num.value++ 
      } 
      return { 
        plusOne, 
        plus 
      } 
    } 
  } 
</script>
```
**Step 1**：`setup` 函数体内，`computed` 函数执行，初始的过程中，生成了一个 `computed effect`。

**Step 2**：初始化渲染的时候，`render` 函数访问了 `plusOne.value`，触发了收集，此时收集的副作用为 `render effect`，因为是首次访问，所以此时的 `self._dirty = true` 执行 `effect.run()` 也就是执行了 `getter` 函数，得到 `_value = 1`。

**Step 3**：`getter` 函数体内访问了 `num.value` 触发了对 `num` 的依赖收集，此时收集到的依赖为 `computed effect`。

**Step 4**：点击按钮，此时 `num = 1` 触发了 `computed effect` 的 `schduler` 调度，因为 `_dirty = false`，所以触发了 `triggerRefValue` 的执行，同时，设置 `_dirty = true`。

**Step 5**：`triggerRefValue` 执行过程中，会执行 `computed effect.run()` 触发 `getter` 函数的执行。因为此时的 `_dirty = true`，所以 `get value` 会重新计算 `_value` 的值为 `plusOne.value = 2`。 

**Step 6**：`plusOne.value` 值变化后，触发了 `render effect.run` 重新渲染。

可以看到 `computed` 函数通过 `_dirty` 把 `computed` 的缓存特性表现得淋漓尽致，只有当 `_dirty = true` 的时候，才会进行重新计算求值，而 `_dirty = true` 只有在首次取值或者取值内部依赖发生变化时才会执行。

## 计算属性的执行顺序
这里，我们介绍完了 `computed` 的核心流程，但是细心的同学可能发现，这里我们还漏了一个小的知识点没有介绍，就是在类 `ComputedRefImpl` 的构造函数中，执行了这样一行代码：
```js
this.effect.computed = this
```
那么这行代码的作用是什么呢？在说这个作用之前，我们先来看一个 `demo`:

```js
const { ref, effect, computed } = Vue

const n = ref(0)
const plusOne = computed(() => n.value + 1)
effect(() => {
  n.value
  console.log(plusOne.value)
})
n.value++
```
小伙伴们可以猜测一下上述代码的打印结果。

可能有些小伙伴猜测应该是：
```
1
1
2
```
首先是 `effect` 函数先执行，触发 `n` 的依赖收集，然后访问了 `plusOne.value`，再收集 `computed effect`。然后执行 `n.value++` 按照顺序触发 `effect` 执行，所以理论上先触发 `effect` 函数内部的回调，再去执行 `computed` 的重新求值。所以输出是上述结果。

但事实确实：

```
1
2
2
```
这就是因为上面那一行代码的作用。`effect.computed` 的标记保障了 `computed effect` 会优先于其他普通副作用函数先执行，关于具体的实现，可以看一下 `triggerEffects` 函数体内对 `computed` 的特殊处理：

```js
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray(dep) ? dep : [...dep]
  // 确保执行完所有的 computed
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect, debuggerEventExtraInfo)
    }
  }
  // 再执行其他的副作用函数
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect, debuggerEventExtraInfo)
    }
  }
}
```

## 总结
总而言之，计算属性可以**从状态数据中计算出新数据**，`computed` 和 `methods` 的最大差异是它具备缓存性，如果依赖项不变时不会重新计算，而是直接返回缓存的值。

搞懂了本小节关于 `computed` 函数的介绍后，相信你已经知道计算属性相对于普通函数的不同之处的原理，在以后的开发中，可以更合理地使用计算属性！


