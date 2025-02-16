上节我们梳理了 React 渲染流程，这节来具体实现下。

首先先完成从 JSX 到 React Element 的转换：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f95ad42f43846cbbd8e01da0987b76c~tplv-k3u1fbpfcp-watermark.image?)

从 JSX 到 render function 这步是 babel 或者 tsc 帮我们做的。

新建个项目：

```
mkdir mini-react
cd mini-react
npm init -y
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49bfabaa05a646c7982c14c301fcb6f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=850&h=678&s=84892&e=png&b=000000)

安装 typescript：

```
npm install --save-dev typescript
```

创建 tsconfig.json 配置文件：

```
npx tsc --init
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdfafd1e98304b5f8a500e9ab6d201c1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=708&h=370&s=43175&e=png&b=181818)

改一下生成的 tsconfig.json

```json
{
  "compilerOptions": {
    "outDir": "dist",
    "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "jsx": "react",                                /* Specify what JSX code is generated. */
    "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
    "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    "strict": true,                                      /* Enable all strict type-checking options. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}
```

添加 src/index.jsx

```javascript
const content = <div>
    <Guang>guang</Guang>
    <a href="xxx">link</a>
</div>
```
执行编译：

```
npx tsc
```

可以看到，生成的代码是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ab9dd0663054c8cb4f7f26b5a8aef31~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1482&h=780&s=122706&e=png&b=1c1c1c)

React.createElement 第一个参数是类型，第二个参数是 props，第三个参数是 children。

具体的 render function 的名字也可以指定：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88f4545decd941a88e6885ae12dc97bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=840&h=764&s=90253&e=png&b=202020)

再次执行编译，生成的就是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c09d1fd09bfa490db4be8023cdf213a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=248&s=54263&e=png&b=1f1f1f)

这就是从 jsx 到 render function 这一步，由 babel、tsc 等编译器来做：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/486556f03b3d4fb9ba8966a1bd1f55b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1082&h=298&s=80318&e=png&b=fefefe)

我们只要实现这些 render function，然后返回对应的 React Element 即可。

创建 src/mini-react.js

```javascript
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                const isTextNode = typeof child === "string" || typeof child === "number";
                return isTextNode ? createTextNode(child) : child;
            }),
        },
    };
}

function createTextNode(nodeValue) {
    return {
        type: "TEXT_ELEMENT",
        props: {
        nodeValue,
            children: []
        },
    };
}

const MiniReact = {
    createElement
};

window.MiniReact = MiniReact;
```

MiniReact.createElement 就是我们实现的 render function。

为什么文本节点要单独处理呢？

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eaa17d2d5207448aaf1b0119c0c457d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1006&h=218&s=52473&e=png&b=1f1f1f)

因为 div 的话，它的 type 是 div，可以有 props 和 children。

而文本节点是没有 type、children、props 的。

我们需要给它加个固定的 type TEXT_ELEMENT，并且设置 nodeValue 的 props。

这样结构统一，方便后面处理。

改下 index.jsx

```javascript
const content = <div>
    <a href="xxx">link</a>
</div>

console.log(JSON.stringify(content, null, 2));
```

编译一下：

```
npx tsc -w
```
在 dist 下生成了目标代码：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41f42b03844748a6a8f875dd852463cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1838&h=902&s=216630&e=png&b=1e1e1e)
加一个 index.html 引入下 dist 的代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
    <script src="./dist/mini-react.js"></script>
    <script src="./dist/index.js"></script>
</body>
</html>
```
然后跑个静态服务：

```
npx http-server .
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb72721f4e3e4e43beec8e6777349956~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=738&h=600&s=93866&e=png&b=181818)

浏览器访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e03c9168e124141b7bc8c9275afb4c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1712&h=1436&s=141775&e=png&b=ffffff)

这个就是 React Element 的树，也就是我们常说的 vdom。

接下来要把它转成 fiber 结构。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87a5006344964b639654a87a37c999d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=692&s=217286&e=png&b=fefefe)

这个过程叫做 reconcile。

它并不是一次性完成的，而是通过调度器调度，根据时间分片放到多个任务里完成，这里我们用 requestIdleCallback 来调度。

```javascript
let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null

function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
    }
    nextUnitOfWork = wipRoot
}

function workLoop(deadline) {
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {

    if (fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.return
    }
}
```
我们用 reqeustIdleCallback 来代替 React 的时间分片，把 React Element 树转 fiber 的 reconcile 过程放到不同的任务里跑。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a3d85633a28455da775592bcda5e8ce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=898&h=662&s=93435&e=png&b=1f1f1f)

用 nextUnitOfWork 指向下一个要处理的 fiber 节点。

每次跑的时候判断下 timeRemaing 是否接近 0，是的话就中断循环，等下次 requestIdleCallback 的回调再继续处理 nextUnitOfWork 指向的 fiber 节点。

这里的 deadline.timeRemaing 是 requestIdleCallback 提供的，详细了解可以看下 [MDN 的文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Background_Tasks_API#%E7%A4%BA%E4%BE%8B)。

render 方法里设置初始 nextUnitOfWork。

这里有两个 root，一个是当前正在处理的 fiber 链表的根 wipRoot，一个是之前的历史 fiber 链表的根 currentRoot。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dce452b134742239587cd03d72c93d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=680&h=588&s=66384&e=png&b=1f1f1f)

为什么有两个 root 呢？

因为初始渲染会生成一个 fiber 链表，然后后面 setState 更新会再生成一个新的 fiber 链表，两个 fiber 链表要做一些对比里决定对 dom 节点的增删改，所以都要保存。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbc13410c2c94e26828bdb05d9f0cea9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1880&h=664&s=120302&e=png&b=ffffff)

而 performUnitOfWork 处理每个 fiber 节点之后，会按照 child、sibling、return 的顺序返回下一个要处理的 fiber 节点：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81356ad309834a31b72f2ec71f40e9a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=638&h=524&s=57085&e=png&b=1f1f1f)

就是通过这种顺序来把 fiber 树变为链表的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98ff118b03b14d5f9e56e1dcbeff674d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=640&h=462&s=192599&e=png&b=fcfafa)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5332b73820446e082956a8b1696880e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1668&h=358&s=55910&e=png&b=ffffff)

处理每个 fiber 节点的时候，要根据类型做不同的处理：

```javascript
function performUnitOfWork(fiber) {
    const isFunctionComponent = fiber.type instanceof Function
    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }
    if (fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}

let wipFiber = null
let stateHookIndex = null

function updateFunctionComponent(fiber) {
  wipFiber = fiber
  stateHookIndex = 0
  wipFiber.stateHooks = []
  wipFiber.effectHooks = []

  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }
    reconcileChildren(fiber, fiber.props.children)
}

```
判断下是函数组件（FunctionComponent），还是原生标签（HostComponent），分别做处理。

函数组件就是传入 props 调用它，并且函数组件的返回值就是要继续 reconcile 的节点。

这里用 wipFiber 指向当前处理的 fiber（之前的 nextUnitOfWork 是指向下一个要处理的 fiber 节点）

然后用一个 stateHooks 数组来存储 useState 的 hook 的值，用 effectHooks 数组存储 useEffect 的 hook 的值。

对于原生标签（HostComponent），就是创建它对应的 dom 节点。

具体创建 dom 的过程如下：

```javascript
function createDom(fiber) {
    const dom =
      fiber.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type)
  
    updateDom(dom, {}, fiber.props)
  
    return dom
}

const isEvent = key => key.startsWith("on")
const isProperty = key => key !== "children" && !isEvent(key)
const isNew = (prev, next) => key => prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)

function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key => !(key in nextProps) || isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}
```
首先，根据是文本节点还是元素节点用 document.createElement 或 document.createTextNode 来创建。

然后更新 props。

首先删除旧的事件监听器，旧的属性，然后添加新的属性、新的事件监听器。

这样函数组件和原生标签的 reconcile 就处理完了。

继续处理它们的子节点：

```javascript
function reconcileChildren(wipFiber, elements) {
    let index = 0
    let oldFiber = wipFiber.alternate?.child
    let prevSibling = null

    while ( index < elements.length || oldFiber != null) {
        const element = elements[index]
        let newFiber = null

        const sameType = element?.type == oldFiber?.type

        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                return: wipFiber,
                alternate: oldFiber,
                effectTag: "UPDATE",
            }
        }
        if (element && !sameType) {
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                return: wipFiber,
                alternate: null,
                effectTag: "PLACEMENT",
            }
        }
        if (oldFiber && !sameType) {
            oldFiber.effectTag = "DELETION"
            deletions.push(oldFiber)
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling
        }

        if (index === 0) {
            wipFiber.child = newFiber
        } else if (element) {
            prevSibling.sibling = newFiber
        }

        prevSibling = newFiber
        index++
    }
}
```
当时 wipRoot 我们就制定了 alternate，也就是之前的 fiber 树，这样当 reconcile 创建新的 fiber 树的时候，就可以和之前的做 diff，判断是新增、修改、删除，打上对应的标记。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7553ed2ef3e14354ad479f296d584e24~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=600&h=380&s=42800&e=png&b=1f1f1f)

首先，拿到 alternate 的 child，依次取 sibling，逐一和新的 fiber 节点对比。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/050491e04c9d422ea370a382dee14eaf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=934&h=1102&s=147454&e=png&b=1f1f1f)

然后根据对比结果来创建新的 fiber 节点，也是先 child 后 sibling 的方式：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82e090ba2eff4c77979e34b201dfa851~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1016&h=1144&s=152117&e=png&b=1f1f1f)

这样遍历之前的 fiber 链表和生成新的 fiber 链表的原因，看图很容易搞懂：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ca1fea415194681a6a8e2a76715720c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=998&h=730&s=385287&e=png&b=fbf9f9)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a522e55cf96149f5b791f16af53316d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1460&h=348&s=48511&e=png&b=ffffff)

然后 diff 两个 fiber 链表，就是判断节点 type 是不是一样。

如果一样，就是修改，不一样，那就是删除或者新增，搭上对应的标记：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e491a6dc8ce4ec386c59e8b5aebac1d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1062&h=944&s=134192&e=png&b=1f1f1f)

fiber 节点的 type、props 就是类型和参数。

dom 是对应的 dom 节点，

alternate 是对应的旧的 fiber 节点。

effectTag 是增删改的标记。

这里的 delections 数组，也就是要删除的节点，在 render 的时候初始化：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c502e1241be547bc9bbfbd60d648da61~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=626&h=658&s=69021&e=png&b=1f1f1f)

```javascript
let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null
let deletions = null

function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
    }
    
    deletions = []

    nextUnitOfWork = wipRoot
}
```
这样，从 wipRoot 开始，逐渐 reconcile 构建新的 fiber 节点，根据 FunctionComponent 还是原生标签（HostComponent）来分别执行函数和创建 dom，并且还对新旧的 fiber 节点做了 diff，搭上增删改标记。

reconcile 结束，新的 fiber 链表就创建好了。

其中，函数组件可能会调用 useState 或者 useEffect 的 api，我们也要实现一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d1d4fef4b43466386fcf60b28cb6ae1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1104&h=784&s=113903&e=png&b=1f1f1f)

首先，useState 的 state 和 useEffect 的 effect 存在哪里呢？

肯定是在 fiber 上。

比如用两个数组 stateHooks 和 effectHooks 分别来存储：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3139c166e69d4dabbbca882c6358b809~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=634&s=78517&e=png&b=ffffff)

先实现 useState：

```javascript
function useState(initialState) {
    const currentFiber = wipFiber;

    const oldHook = wipFiber.alternate?.stateHooks[stateHookIndex];

    const stateHook = {
      state: oldHook ? oldHook.state : initialState,
      queue: oldHook ? oldHook.queue : [],
    };

    stateHook.queue.forEach((action) => {
      stateHook.state = action(stateHook.state);
    });

    stateHook.queue = [];

    stateHookIndex++;
    wipFiber.stateHooks.push(stateHook);

    function setState(action) {
      const isFunction = typeof action === "function";

      stateHook.queue.push(isFunction ? action : () => action);

      wipRoot = {
        ...currentFiber,
        alternate: currentFiber,
      };
      nextUnitOfWork = wipRoot;
    }

    return [stateHook.state, setState];
}
```
我们在 fiber 节点上用 stateHooks 数组来存储 state，还有多次调用 setState 的回调函数。

比如这样：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45476733e1c048799a899c3a7bbb50cb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=534&h=202&s=26883&e=png&b=202020)

那 state 就是 0，然后 queue 里存了三个修改 state 的函数。

每次调用 useState 时会在 stateHooks 添加一个元素来保存 state：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88fc3bb179454d7b9979cb1914d5f5e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=690&s=112428&e=png&b=1f1f1f)

state 的初始值是前面一次渲染的 state 值，也就是取 alternate 的同一位置的 state：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0d7849b6b7e4736884fead00f31ebd1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050&h=668&s=112312&e=png&b=1f1f1f)

这样对初始 state 执行多个 action（也就是 setState） 之后，就拿到了最终的 state 值。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a485bf53823042bfabedd56e27419cc1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1022&h=670&s=112237&e=png&b=1f1f1f)

修改完 state 之后清空 queue。

比如这里初始 state 是 0，调用三次 action 之后，state 变为 3：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/657fd00dc90741d08fbb6e44806604c3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=530&h=184&s=26923&e=png&b=1f1f1f)

然后 setState 就是在 action 数组里添加新的 action，并且让 nextUnitOfWork 指向新的 wipRoot，从而开始新的一轮渲染：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4475bce5697040d48ba34d1a96184ff7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=898&h=418&s=62621&e=png&b=1f1f1f)

然后是 useEffect：

```javascript
function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
    cleanup: undefined,
  };
  wipFiber.effectHooks.push(effectHook);
}
```
它就是在 fiber.effectHooks 上添加一个元素。

这样，等 reconcile 结束，fiber 链表就构建好了，在 fiber 上打上了增删改的标记，并且也保存了要执行的 effect。

接下来只要遍历这个构建好的 fiber 链表，执行增删改和 effect 函数就好了。

这个阶段是 commit。

前面讲过，requestIdleCallback 在不断进行，每次处理一部分 fiber 的 reconcile。

我们只要在 reconcile 结束，也就是没有 nextUnitOfWork 的时候执行 commit 就行了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2f93a4f8d024b74bb7968cb63b74feb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=804&h=636&s=91058&e=png&b=1f1f1f)

```javascript
if (!nextUnitOfWork && wipRoot) {
    commitRoot()
}
```
在 commitRoot 里，我们先把需要删除的节点都删掉，然后遍历 fiber 链表，处理其它节点：

```javascript
function commitRoot() {
    deletions.forEach(commitWork)
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
    deletions = []
}
```
这里要把当前 wipRoot 设置为 currentRoot，然后把它置空，这就代表这次 reconcile 结束了。

处理完之后还要把 deletions 数组里保存的要删除的节点置空，这时候已经删除了。

```javascript
function commitWork(fiber) {
    if (!fiber) {
        return
    }


    commitWork(fiber.child)
    commitWork(fiber.sibling)
}
```

commitWork 按照 child、sibling 的顺序来递归遍历 fiber 链表。

```javascript
function commitWork(fiber) {
    if (!fiber) {
        return
    }

    let domParentFiber = fiber.return
    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.return
    }
    const domParent = domParentFiber.dom

    if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
        domParent.appendChild(fiber.dom)
    } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
        updateDom(fiber.dom, fiber.alternate.props, fiber.props)
    } else if (fiber.effectTag === "DELETION") {
        commitDeletion(fiber, domParent)
    }

    commitWork(fiber.child)
    commitWork(fiber.sibling)
}
```
首先，不断向上找，找到可以挂载的 dom 节点。

然后按照增增删改的 effectTag 来分别做处理。

```javascript
function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
        domParent.removeChild(fiber.dom)
    } else {
        commitDeletion(fiber.child, domParent)
    }
}
```
删除的时候，如果当前 fiber 节点没有对应的 dom，就不断 child 向下找。

这样遍历完一遍之后，dom 的增删改就完成了。

此外，我们还需要处理 effect。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7edbdc4ae4e4713bfdf46ae6addf6dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=550&h=266&s=40987&e=png&b=202020)

它同样要遍历 fiber 链表：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/694bd9d6f9484cc6bf9eeffc13723f52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=546&h=378&s=40421&e=png&b=1f1f1f)

先遍历一遍执行所有的 cleanup 函数，然后再次遍历执行 effect 函数。

```javascript
function commitEffectHooks() {
    function runCleanup(fiber){
        if (!fiber) return;

        fiber.alternate?.effectHooks?.forEach((hook, index)=>{
            const deps = fiber.effectHooks[index].deps;

            if (!hook.deps || !isDepsEqual(hook.deps, deps)) {
                hook.cleanup?.();
            }
        })

        runCleanup(fiber.child);
        runCleanup(fiber.sibling);
    }

    function run(fiber) {
        if (!fiber) return;
  
        fiber.effectHooks?.forEach((newHook, index) => {
            if(!fiber.alternate) {
                hook.cleanup = hook.callback();
                return;
            }

            if(!newHook.deps) {
                hook.cleanup = hook.callback();
            }

            if (newHook.deps.length > 0) {
                const oldHook = fiber.alternate?.effectHooks[index];

                if(!isDepsEqual(oldHook.deps, newHook.deps)) {
                    newHook.cleanup = newHook.callback()
                }
            }
        });

        run(fiber.child);
        run(fiber.sibling);
    }
  
    runCleanup(wipRoot);
    run(wipRoot);
}

function isDepsEqual(deps, newDeps) {
    if(deps.length !== newDeps.length) {
        return false;
    }

    for(let i = 0; i < deps.length; i++) {
        if(deps[i] !== newDeps[i]) {
            return false;
        }
    }
    return true;
}

```
这里遍历 fiber 链表也是递归处理每个节点，每个节点递归处理 child、sibling。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbfb1f353bd64176a7b0918f6dc73357~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=614&h=726&s=75147&e=png&b=1f1f1f)

当没有传入 deps 数组，或者 deps 数组和上次不一致时，就执行 cleanup 函数。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fd2e7fe39c247d3a83d90e049ad7653~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=902&h=500&s=80515&e=png&b=1f1f1f)

比如这样：
```javascript
useEffect(() => {
    const timer = setTimeout(() => {
    
    }, 1000);
    return () => clearTimeout(timer);
})
```
当没有传入 deps 或者 deps 数组变化的时候，会执行上次的 clearTimeout。

之后才会重新执行 effect：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba683dfd7bb947d98b81aee94a0b4043~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=866&s=138514&e=png&b=1f1f1f)

当没有 alternate 的时候，就是首次渲染，直接执行所有的 effect。

否则，如果没传入 deps 或者 deps 数组变化的时候再执行 effect 函数：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8eb1d25c778a4d3c87d4573a4f6c0907~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=994&h=912&s=128180&e=png&b=1f1f1f)

这样，commit 阶段，我们遍历 fiber 链表做的 dom 的增删改，执行了 effect 函数。

至此，react 的渲染流程的两大阶段 render 和 commit 就完成了。

导出 render、useState、useEffect 的 api：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b27d0c9fa3d407b8757c8432d3f0845~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=374&h=242&s=21762&e=png&b=202020)

然后外面包一层函数，避免污染全局变量：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/302686b9306b4bdf82ed9f54254faa37~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=718&h=532&s=58030&e=png&b=1f1f1f)

我们整体测试下：

改下 index.jsx

```javascript
const { render, useState, useEffect } = window.MiniReact;

function App() {
  const [count,setCount] = useState(0)
 
  function handleClick(){
    setCount((count)=> count + 1)
  }

  return <div>
    <p>{count}</p>
    <button onClick={handleClick}>加一</button>
  </div>;
}

render(<App/>, document.getElementById('root'));
```
测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be0fcf0b58704e4793b6f60594ab02ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=842&h=556&s=54243&e=gif&f=27&b=fefefe)

没啥问题。

再测试下 useEffect：

```javascript
const { render, useState, useEffect } = window.MiniReact;

function App() {
  const [count,setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
        setCount((count)=> count + 1)
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return <div>
    <p>{count}</p>
  </div>;
}

render(<App/>, document.getElementById('root'));
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf1eaf434f07480e9e8f7d0b2c64aa03~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=842&h=556&s=30230&e=gif&f=37&b=fefefe)

也没啥问题。

然后我们抽离一个组件，传入初始值和定时器的时间间隔：

```javascript
const { render, useState, useEffect } = window.MiniReact;

function Counter(props) {
  const {
    initialNum,
    interval
  } = props;

  const [count, setCount] = useState(initialNum)

  useEffect(() => {
    const timer = setInterval(() => {
        setCount((count)=> count + 1)
    }, interval);
    return () => clearTimeout(timer);
  }, []);

  return <div>
    <p>{count}</p>
  </div>;
}

function App() {
  return <Counter interval={1000} initialNum={10}></Counter>
}

render(<App/>, document.getElementById('root'));
```
Counter 组件有 interval 和 initialNum 两个参数。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbf5f2972f994218874cde1dcd6b4cd9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1082&h=818&s=29853&e=gif&f=26&b=fefefe)

也没问题。

这样，我们的 mini react 就完成了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/mini-react)。

## 总结

我们 React 的渲染流程来实现了下 mini react。

JSX 转 render function 这步是 babel 或 tsc 等编译器做的。

我们实现 React.createElement 函数，那执行后返回的就是 React Element 树，也就是 vdom。

通过 requestIdleCallback 在空闲时执行 React Element 转 fiber 的 reconcile 流程。

按照函数组件 FunctionComponent 或者原生标签 HostComponent 分别执行函数或者创建 dom。

reconcile 到子节点的时候要和 alternate 对比，判断是新增、修改还是删除，打上标记。

这个过程中如果调用了 useState 或者 useEffect 会在对应 fiber 节点的 hooks 数组上添加一些元素。

之后进入 commit 阶段，从根节点开始遍历 fiber 链表，根据标记来执行 dom 的增删改，以及执行 effect 函数。

然后 useState 的 setState 会设置新的 nextUnitOfWork，从而触发新的一轮渲染流程。

这样，和 React 的真实渲染流程类似的 mini react 就完成了。
