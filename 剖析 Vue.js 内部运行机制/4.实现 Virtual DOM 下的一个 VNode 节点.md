

## 什么是VNode

我们知道，render function 会被转化成 VNode 节点。Virtual DOM 其实就是一棵以 JavaScript 对象（VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。最终可以通过一系列操作使这棵树映射到真实环境上。由于 Virtual DOM 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等。

## 实现一个VNode

VNode 归根结底就是一个 JavaScript 对象，只要这个类的一些属性可以正确直观地描述清楚当前节点的信息即可。我们来实现一个简单的 `VNode` 类，加入一些基本属性，为了便于理解，我们先不考虑复杂的情况。

```javascript
class VNode {
    constructor (tag, data, children, text, elm) {
        /*当前节点的标签名*/
        this.tag = tag;
        /*当前节点的一些数据信息，比如props、attrs等数据*/
        this.data = data;
        /*当前节点的子节点，是一个数组*/
        this.children = children;
        /*当前节点的文本*/
        this.text = text;
        /*当前虚拟节点对应的真实dom节点*/
        this.elm = elm;
    }
}
```

比如我目前有这么一个 Vue 组件。

```html
<template>
  <span class="demo" v-show="isShow">
    This is a span.
  </span>
</template>
```

用 JavaScript 代码形式就是这样的。

```javascript
function render () {
    return new VNode(
        'span',
        {
            /* 指令集合数组 */
            directives: [
                {
                    /* v-show指令 */
                    rawName: 'v-show',
                    expression: 'isShow',
                    name: 'show',
                    value: true
                }
            ],
            /* 静态class */
            staticClass: 'demo'
        },
        [ new VNode(undefined, undefined, undefined, 'This is a span.') ]
    );
}
```

看看转换成 VNode 以后的情况。

```javascript
{
    tag: 'span',
    data: {
        /* 指令集合数组 */
        directives: [
            {
                /* v-show指令 */
                rawName: 'v-show',
                expression: 'isShow',
                name: 'show',
                value: true
            }
        ],
        /* 静态class */
        staticClass: 'demo'
    },
    text: undefined,
    children: [
        /* 子节点是一个文本VNode节点 */
        {
            tag: undefined,
            data: undefined,
            text: 'This is a span.',
            children: undefined
        }
    ]
}
```

然后我们可以将 VNode 进一步封装一下，可以实现一些产生常用 VNode 的方法。

* 创建一个空节点

```javascript
function createEmptyVNode () {
    const node = new VNode();
    node.text = '';
    return node;
}
```

* 创建一个文本节点

```javascript
function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val));
}
```

* 克隆一个 VNode 节点

```javascript
function cloneVNode (node) {
    const cloneVnode = new VNode(
        node.tag,
        node.data,
        node.children,
        node.text,
        node.elm
    );
    return cloneVnode;
}
```

总的来说，VNode 就是一个 JavaScript 对象，用 JavaScript 对象的属性来描述当前节点的一些状态，用 VNode 节点的形式来模拟一棵 Virtual DOM 树。

注：本节代码参考[《实现 Virtual DOM 下的一个 VNode 节点》](https://github.com/answershuto/VueDemo/blob/master/%E3%80%8A%E5%AE%9E%E7%8E%B0%20Virtual%20DOM%20%E4%B8%8B%E7%9A%84%E4%B8%80%E4%B8%AA%20VNode%20%E8%8A%82%E7%82%B9%E3%80%8B.js)。