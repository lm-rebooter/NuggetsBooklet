## 前言
上一小节我们介绍完了关于模版是如何编译成 `AST` 的结构的，接下来进入模版编译的第二步 `transform`，`transform` 的目标是为了生成 `JavaScript AST`。因为渲染函数是一堆 `js` 代码构成的，编译器最终产物就是渲染函数，所以理想中的 `AST` 应该是用来描述渲染函数的 `JS` 代码。

那么接下来，我们一起看看 `transfrom` 转换的实现细节吧！

## Transform

```js
function baseCompile(template, options) {
  const isModuleMode = options.mode === 'module'
  // 用来标记代码生成模式
  const prefixIdentifiers =
    !__BROWSER__ && (options.prefixIdentifiers === true || isModuleMode)
  // 获取节点和指令转换的方法
  const [nodeTransforms, directiveTransforms] = getBaseTransformPreset()
  // AST 转换成 Javascript AST
  transform(
    ast,
    extend({}, options, {
      prefixIdentifiers,
      nodeTransforms: [
        ...nodeTransforms,
        ...(options.nodeTransforms || [])
      ],
      directiveTransforms: extend(
        {},
        directiveTransforms,
        options.directiveTransforms || {}
      )
    })
  )
}
```
其中第一个参数 `prefixIdentifiers` 是用于标记前缀代码生成模式的。举个例子，以下代码：

```html
<div>
  {{msg}}
</div>
```
在 `module` 模式下，生成的渲染函数是一个通过 `with(_ctx) { ... }` 包裹后的，大致为：
```js
return function render(_ctx) {
  with (_ctx) {
    const { toDisplayString, openBlock, createElementBlock } = Vue
    return (openBlock(), createElementBlock("div", null, toDisplayString(msg), 1 /* TEXT */))
  }
}
```
而在 `function` 模式下，生成的渲染函数中的动态内容，则会被转成 `_ctx.msg` 的模式：
```js
import { toDisplayString, openBlock, createElementBlock } from "vue"
export function render(_ctx) {
  return (openBlock(), createElementBlock("div", null, toDisplayString(ctx.msg), 1 /* TEXT */))
}
```
而参数 `nodeTransforms` 和 `directiveTransforms` 对象则是由 `getBaseTransformPreset` 生成的一系列预设函数：

```js
function getBaseTransformPreset(prefixIdentifiers) {
  return [
    [
      transformOnce,
      transformIf,
      transformFor,
      transformExpression,
      transformSlotOutlet,
      transformElement,
      trackSlotScopes,
      transformText
    ],
    {
      on: transformOn,
      bind: transformBind,
      model: transformModel
    }
  ]
}
```
`nodeTransforms` 涵盖了特殊节点的转换函数，比如文本节点、`v-if` 节点等等， `directiveTransforms` 则包含了一些指令的转换函数。

这些转换函数的细节，不是这里的核心，我们将在下文进行几个重点函数的介绍，其余的有兴趣的小伙伴可以自行翻阅 `vue3` 源码查看实现的细节。接下来我们将核心介绍 `transform` 函数的实现：

```js
export function transform(root, options) {
  // 生成 transform 上下文
  const context = createTransformContext(root, options)
  // 遍历处理 ast 节点
  traverseNode(root, context)
  // 静态提升
  if (options.hoistStatic) {
    hoistStatic(root, context)
  }
  // 创建根代码生成节点
  if (!options.ssr) {
    createRootCodegen(root, context)
  }
  // 最终确定元信息
  root.helpers = [...context.helpers.keys()]
  root.components = [...context.components]
  root.directives = [...context.directives]
  root.imports = context.imports
  root.hoists = context.hoists
  root.temps = context.temps
  root.cached = context.cached
}
```
## 1. 生成 transform 上下文
在正式开始 `transform` 前，需要创建生成一个 `transformContext`，即 `transform` 上下文。

```
export function createTransformContext(root, TransformOptions) {
  const context = {
    // 选项配置
    hoistStatic,
    cacheHandlers,
    nodeTransforms,
    directiveTransforms,
    transformHoist,
    // ...
    // 状态数据
    root,
    helpers: new Map(),
    components: new Set(),
    directives: new Set(),
    hoists: [],
    // ....
    // 一些函数
    helper(name) {},
    removeHelper(name) {},
    helperString(name) {},
    replaceNode(node) {},
    removeNode(node) {},
    onNodeRemoved: () => {},
    addIdentifiers(exp) {},
    removeIdentifiers(exp) {},
    hoist(exp) {},
    cache(exp, isVNode = false) {}
  }

  return context
}
```
可以看到这个上下文对象 `context` 内主要包含三部分：`tansform` 过程中的一些配置属性，一些状态数据，以及在 `transform` 过程中可能会调用的一些辅助函数。

## 2. 遍历AST节点

```js
export function traverseNode(node, context) {
  context.currentNode = node
  // 节点转换函数
  const { nodeTransforms } = context
  const exitFns = []
  for (let i = 0; i < nodeTransforms.length; i++) {
    // 执行节点转换函数，返回得到一个退出函数
    const onExit = nodeTransforms[i](node, context)
    // 收集所有退出函数
    if (onExit) {
      if (isArray(onExit)) {
        exitFns.push(...onExit)
      } else {
        exitFns.push(onExit)
      }
    }
    if (!context.currentNode) {
      // 节点被移除
      return
    } else {
      node = context.currentNode
    }
  }

  switch (node.type) {
    case NodeTypes.COMMENT:
      if (!context.ssr) {
        // context 中 helpers 添加 CREATE_COMMENT 辅助函数
        context.helper(CREATE_COMMENT)
      }
      break
    case NodeTypes.INTERPOLATION:
      // context 中 helpers 添加 TO_DISPLAY_STRING 辅助函数
      if (!context.ssr) {
        context.helper(TO_DISPLAY_STRING)
      }
      break
    case NodeTypes.IF:
      // 递归遍历每个分支节点
      for (let i = 0; i < node.branches.length; i++) {
        traverseNode(node.branches[i], context)
      }
      break
    case NodeTypes.IF_BRANCH:
    case NodeTypes.FOR:
    case NodeTypes.ELEMENT:
    case NodeTypes.ROOT:
      // 遍历子节点
      traverseChildren(node, context)
      break
  }
  
  context.currentNode = node
  // 执行上面收集到的所有退出函数
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}
```

`traverseNode` 递归的遍历 `ast` 中的每个节点，然后执行一些转换函数 `nodeTransforms`，这些转换函数就是我们上面介绍的通过 `getBaseTransformPreset` 生成的对象，值得注意的是：`nodeTransforms` 返回的是一个数组，说明这些转换函数是有序的，顺序代表着优先级关系，比如对于`if`的处理优先级就比 `for` 要高，因为如果条件不满足很可能有大部分内容都没必要进行转换。

另外，如果转换函数执行完成后，有返回退出函数 `onExit` 的话，那么会被统一存贮到 `exitFns` 当中，在所有字节点处理完成统一执行调用。

### transformElement

根据上文我们知道了对节点进行处理，就是通过一系列函数对节点的的各个部分的内容分别进行处理。鉴于这些函数很多内容也很庞杂，我们拿其中一个函数`transformElement`进行分析，理解对**AST**的转化过程：

```js
export const transformElement = (node, context) => {
  // 这里就是返回了一个退出函数
  return function postTransformElement() {
    // ...
    node.codegenNode = createVNodeCall(
      context,
      vnodeTag,
      vnodeProps,
      vnodeChildren,
      vnodePatchFlag,
      vnodeDynamicProps,
      vnodeDirectives,
      !!shouldUseBlock,
      false /* disableTracking */,
      isComponent,
      node.loc
    )
  }
}
```
可以看到，`transformElement` 的核心目的就是通过调用`createVNodeCall`函数获取 `VNodeCall` 对象，并赋值给 `node.codegenNode`。

到这里，我们就大致明白了，我们前面一直提到需要把 `AST` 转成 `JavaScript AST`，实际上就是给 `AST` 的`codegenNode` 属性赋值。接下来，我们接着看 `createVNodeCall` 函数的实现：

```js
function createVNodeCall(context, tag, props, children, patchFlag, dynamicProps, directives, isBlock = false, disableTracking = false, loc = locStub) {
  if (context) {
    if (isBlock) {
      context.helper(OPEN_BLOCK)
      context.helper(getVNodeBlockHelper(context.inSSR, isComponent))
    } else {
      context.helper(getVNodeHelper(context.inSSR, isComponent))
    }
    if (directives) {
      context.helper(WITH_DIRECTIVES)
    }
  }

  return {
    type: NodeTypes.VNODE_CALL,
    tag,
    props,
    children,
    patchFlag,
    dynamicProps,
    directives,
    isBlock,
    disableTracking,
    loc
  }
}
```
该函数也非常容易理解，本质就是为了返回一个 `VNodeCall` 对象，该对象是用来描述 `js` 代码的。

这里的函数 `context.helper` 是会把一些 `Symbol` 对象添加到 `context.helpers Set` 的数据结构当中，在接下来的代码生成阶段，会判断当前 `JS AST` 中是否存在 `helpers` 内容，如果存在，则会根据 `helpers` 中标记的 `Symbol` 对象，来生成辅助函数。

接下来看一下之前的这样一个 `demo`

```html
<template>
  <!-- 这是一段注释 -->
  <p>{{ msg }}</p>
</template>
```

经过遍历`AST`节点 `traverseNode` 函数调用之后之后的结果大致如下：

```json
{
  "type": 0,
  "children": [
    {
      "type": 1,
      "ns": 0,
      "tag": "p",
      "tagType": 0,
      "props": [],
      "isSelfClosing": false,
      "children": [],
      "loc": {},
      "codegenNode": {
        "type": 13,
        "tag": "\"p\"",
        "children": {
          "type": 5,
          "content": {
            "type": 4,
            "isStatic": false,
            "constType": 0,
            "content": "msg",
            "loc": {
              "start": {},
              "end": {},
              "source": "msg"
            }
          },
          "loc": {
            "start": {},
            "end": {},
            "source": "{{ msg }}"
          }
        },
        "patchFlag": "1 /* TEXT */",
        "isBlock": false,
        "disableTracking": false,
        "isComponent": false,
        "loc": {
          "start": {},
          "end": {},
          "source": "<p>{{ msg }}</p>"
        }
      }
    }
  ],
  "helpers": [],
  "components": [],
  "directives": [],
  "hoists": [],
  "imports": [],
  "cached": 0,
  "temps": 0,
  "loc": {
    "start": {},
    "end": {},
    "source": "\n  <p>{{ msg }}</p>\n"
  }
}
```
可以看到，相比原节点，转换后的节点无论是在语义化还是在信息上，都更加丰富，我们可以依据它在代码生成阶段生成所需的代码。

## 3. 静态提升
经过上一步的遍历 `AST` 节点后，我们接着来看一下静态提升做了哪些工作。

```js
export function hoistStatic(root, context) {
  walk(
    root,
    context,
    // 根节点是不可提升的
    isSingleElementRoot(root, root.children[0])
  )
}
```

`hoistStatic` 核心调用的就是 `walk` 函数：

```js
function walk(node, context, doNotHoistNode = false) {
  const { children } = node
  // 记录那些被静态提升的节点数量
  let hoistedCount = 0

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    // 普通元素节点可以被提升
    if (
      child.type === NodeTypes.ELEMENT &&
      child.tagType === ElementTypes.ELEMENT
    ) {
      // 根据 doNotHoistNode 判断是否可以提升
      // 设置 constantType 的值
      const constantType = doNotHoistNode
        ? ConstantTypes.NOT_CONSTANT
        : getConstantType(child, context)
      // constantType = CAN_SKIP_PATCH || CAN_HOIST || CAN_STRINGIFY
      if (constantType > ConstantTypes.NOT_CONSTANT) {
        // constantType = CAN_HOIST || CAN_STRINGIFY
        if (constantType >= ConstantTypes.CAN_HOIST) {
          // 可提升状态中，codegenNode = PatchFlags.HOISTED
          child.codegenNode.patchFlag =
            PatchFlags.HOISTED + (__DEV__ ? ` /* HOISTED */` : ``)
  
          // 提升节点，将节点存储到 转换上下文context 的 hoist 数组中
          child.codegenNode = context.hoist(child.codegenNode!)
          // 提升节点数量自增 1
          hoistedCount++
          continue
        }
      } else {
        // 动态子节点可能存在一些静态可提升的属性
        const codegenNode = child.codegenNode!
        if (codegenNode.type === NodeTypes.VNODE_CALL) {
          // 判断 props 是否可提升
          const flag = getPatchFlag(codegenNode)
          if (
            (!flag ||
              flag === PatchFlags.NEED_PATCH ||
              flag === PatchFlags.TEXT) &&
            getGeneratedPropsConstantType(child, context) >=
              ConstantTypes.CAN_HOIST
          ) {
            // 提升 props
            const props = getNodeProps(child)
            if (props) {
              codegenNode.props = context.hoist(props)
            }
          }
          // 将节点的动态 props 添加到转换上下文对象中
          if (codegenNode.dynamicProps) {
            codegenNode.dynamicProps = context.hoist(codegenNode.dynamicProps)
          }
        }
      }
    }

    if (child.type === NodeTypes.ELEMENT) {
      // 组件是 slot 的情况
      const isComponent = child.tagType === ElementTypes.COMPONENT
      if (isComponent) {
        context.scopes.vSlot++
      }
      // 如果节点类型是组件，则进行递归判断操作
      walk(child, context)
      if (isComponent) {
        context.scopes.vSlot--
      }
    } else if (child.type === NodeTypes.FOR) {
      // 再循环节点中，只有一个子节点的情况下，不需要提升
      walk(child, context, child.children.length === 1)
    } else if (child.type === NodeTypes.IF) {
      for (let i = 0; i < child.branches.length; i++) {
        // 在 v-if 这样的条件节点上，如果也只有一个分支逻辑的情况
        walk(
          child.branches[i],
          context,
          child.branches[i].children.length === 1
        )
      }
    }
  }
  // 预字符串化
  if (hoistedCount && context.transformHoist) {
    context.transformHoist(children, context, node)
  }
  // ...
}
```

该函数看起来比较复杂，其实就是通过 `walk` 这个递归函数，不断的判断节点是否符合可以静态提升的条件：只有普通的元素节点是可以提升的。

如果满足条件，则会给节点的 `codegenNode` 属性中的 `patchFlag` 的值设置成 `PatchFlags.HOISTED`。

接着执行转换器上下文中的 `context.hoist` 方法：
```js
function hoist(exp) {
  // 存储到 hoists 数组中
  context.hoists.push(exp);
  const identifier = createSimpleExpression(`_hoisted_${context.hoists.length}`, false, exp.loc, true)
  identifier.hoisted = exp
  return identifier
}
```
该函数的作用就是将这个可以被提升的节点存储到转换上下文 `context` 的 `hoist` 数组中。这个数据就是用来存储那些可被提升节点的列表。

接下来，我们再来说一下，为什么要做静态提升呢？ 如下模板所示：

```html
<div>
  <p>text</p>
</div>
```

在没有被提升的情况下其渲染函数相当于：

```js
import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _createElementVNode("p", null, "text")
  ]))
}
```

很明显，`p` 标签是静态的，它不会改变。但是如上渲染函数的问题也很明显，如果组件内存在动态的内容，当渲染函数重新执行时，即使 `p` 标签是静态的，那么它对应的 `VNode` 也会重新创建。

**所谓的 “静态提升”，就是将一些静态的节点或属性提升到渲染函数之外**。如下面的代码所示：

```js
import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = /*#__PURE__*/_createElementVNode("p", null, "text", -1 /* HOISTED */)
const _hoisted_2 = [
  _hoisted_1
]

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, _hoisted_2))
}
```

这就实现了减少 `VNode` 创建的性能消耗。

而这里的静态提升步骤生成的 `hoists`，会在 `codegenNode` 会在生成代码阶段帮助我们生成静态提升的相关代码。

### 预字符串化

注意到在 `walk` 函数结束时，进行了静态提升节点的 `预字符串化`。什么是预字符串化呢？一起来看个示例：

```
<template>
  <p></p>
  ... 共 20+ 节点
  <p></p>
</template>
```
对于这样有大量静态提升的模版场景，如果不考虑 `预字符串化` 那么生成的渲染函数将会包含大量的 `createElementVNode` 函数：假设如上模板中有大量连续的静态的 `p` 标签，此时渲染函数生成的结果如下：

```
const _hoisted_1 = /*#__PURE__*/_createElementVNode("p", null, null, -1 /* HOISTED */)
// ...
const _hoisted_20 = /*#__PURE__*/_createElementVNode("p", null, null, -1 /* HOISTED */)
const _hoisted_21 = [
  _hoisted_1,
  // ...
  _hoisted_20,
]

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, _hoisted_21))
}
```
`createElementVNode` 大量连续性创建 `vnode` 也是挺影响性能的，所以可以通过 `预字符串化` 来一次性创建这些静态节点，采用 `与字符串化` 后，生成的渲染函数如下：

```js
const _hoisted_1 = /*#__PURE__*/_createStaticVNode("<p></p>...<p></p>", 20)
const _hoisted_21 = [
  _hoisted_1
]

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, _hoisted_21))
}
```
这样一方面降低了 `createElementVNode` 连续创建带来的性能损耗，也降侧面减少了代码体积。关于 **预字符串化** 实现的细节函数 `transformHoist` 有兴趣的小伙伴可以再去深入了解。

## 4. 创建根代码生成节点
介绍完了静态提升后，我们还剩最后一个 `createRootCodegen` 创建根代码生成节点，接下来一起看一下 `createRootCodegen` 函数的实现：

```js
function createRootCodegen(root, context) {
  const { helper } = context
  const { children } = root
  if (children.length === 1) {
    const child = children[0]
    // 如果子节点是单个元素节点，则将其转换成一个 block
    if (isSingleElementRoot(root, child) && child.codegenNode) {
      const codegenNode = child.codegenNode
      if (codegenNode.type === NodeTypes.VNODE_CALL) {
        makeBlock(codegenNode, context)
      }
      root.codegenNode = codegenNode
    } else {
      root.codegenNode = child
    }
  } else if (children.length > 1) {
    // 如果子节点是多个节点，则返回一个 fragement 的代码生成节点
    let patchFlag = PatchFlags.STABLE_FRAGMENT
    let patchFlagText = PatchFlagNames[PatchFlags.STABLE_FRAGMENT]
    
    root.codegenNode = createVNodeCall(
      context,
      helper(FRAGMENT),
      undefined,
      root.children,
      patchFlag + (__DEV__ ? ` /* ${patchFlagText} */` : ``),
      undefined,
      undefined,
      true,
      undefined,
      false /* isComponent */
    )
  } else {
    // no children = noop. codegen will return null.
  }
}
```
我们知道，`Vue3` 中是可以在 `template` 中写多个字节点的：

```html
<template>
  <p>1</p>
  <p>2</p>
</template>
```

`createRootCodegen`，核心就是创建根节点的 `codegenNode` 对象。所以当有多个子节点时，也就是 `children.length > 1` 时，调用 `createVNodeCall` 来创建一个新的 `fragement` 根节点 `codegenNode`。

否则，就代表着只有一个根节点，直接让根节点的 `codegenNode` 等于第一个子节点的根节点的`codegenNode`即可。

`createRootCodegen` 完成之后，接着把 `transform` 上下文在转换 `AST` 节点过程中创建的一些变量赋值给 `root` 节点对应的属性，这样方便在后续代码生成的过程中访问到这些变量。

```js
root.helpers = [...context.helpers.keys()]
root.components = [...context.components]
root.directives = [...context.directives]
root.imports = context.imports
root.hoists = context.hoists
root.temps = context.temps
root.cached = context.cached
```

## 总结
这里我们介绍了关于 `transform` 相关的知识，再来回顾一下，`transform` 节点的核心功能就是语法分析阶段，把 `AST` 节点做进一层转换，构造出语义化更强，信息更加丰富的 `codegenCode`。便于在下一小节 `generate` 中使用。
  

  



