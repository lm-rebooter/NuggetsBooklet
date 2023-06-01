path 记录了遍历路径，并且还实现了一系列增删改的 api，会在遍历 ast 的时候传递给 visitor 的回调函数。

这节我们来实现下 path。

## 思路分析


path 是节点之间的关联，每一个 path 记录了当前节点和父节点，并且 path 和 path 之间也有关联。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5883d27d78054a72a9c650023b2ba481~tplv-k3u1fbpfcp-watermark.image)

通过 path 我们可以找到父节点、父节点的父节点，一直到根节点。

path 的实现就是在 traverse 的时候创建一个对象来保存当前节点和父节点，并且能够拿到节点也就能对节点进行操作，可以基于节点来提供一系列增删改的 api。

## 代码实现

首先我们创建一个 path 的类，记录当前节点 node，父节点 parent 以及父节点的 path。

```javascript
class NodePath {
    constructor(node, parent, parentPath) {
        this.node = node;
        this.parent = parent;
        this.parentPath = parentPath;
    }
}
```

然后在遍历的时候创建 path 对象，传入 visitor。

```javascript
function traverse(node, visitors, parent, parentPath) {
    const defination = astDefinationsMap.get(node.type);

    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
        visitorFuncs = {
            enter: visitorFuncs
        }
    }
    const path = new NodePath(node, parent, parentPath);

    visitorFuncs.enter && visitorFuncs.enter(path);

    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach(childNode => {
                    traverse(childNode, visitors, node, path);// 改动
                })
            } else {
                traverse(prop, visitors, node, path);// 改动
            }
        })
    }
    visitorFuncs.exit && visitorFuncs.exit(path);
}
```
之后 visitor 里面就可以拿到 path 了。

比如我们可以在 visotor 里从当前节点一直查找到根节点：

```javascript
traverse(ast, {
    Identifier: {
        exit(path) {
            path.node.name = 'b';
            let curPath = path;
            while (curPath) {
                console.log(curPath.node.type);
                curPath = curPath.parentPath;
            }
        }
    }
});
```

接下来是实现 api，path 的 api 就是对 AST 的增删改，我们实现下 replaceWith、remove、findParent、find、traverse、skip 这些 api。

### 实现 path api

replaceWith 就是在父节点替换当前节点为另一个节点。但是我们现在并不知道当前节点在父节点的什么属性上，所以在遍历的时候要记录属性名的信息。

这里要记录两个属性 key 和 listkey，比如如果属性是数组的话就要记录 key 是啥属性、listkey 是啥下标。

比如 params 下的 Identifier 节点，key 是 params，listkey 是 1、2、3。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a51e3f91e370478db2e70b335734a2d7~tplv-k3u1fbpfcp-watermark.image?)

如果不是数组的话，listkey 为空。

在讲 path 的那一节，我们讲过 key 和 listkey，很多同学都不明白为什么要记录这个，现在就知道了，是为了实现对 AST 增删改的 api 用的。

我们对 traverse 的实现做下改动，传入 key 和数组下标（有改动标识的那两行）：

```javascript
module.exports = function traverse(node, visitors, parent, parentPath, key, listKey) {

    const defination = visitorKeys.get(node.type);
    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
        visitorFuncs = {
            enter: visitorFuncs
        }
    }
    const path = new NodePath(node, parent, parentPath, key, listKey);
    visitorFuncs.enter && visitorFuncs.enter(path);

    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach((childNode, index) => {
                    traverse(childNode, visitors, node, path, key, index);// 改动
                })
            } else {
                traverse(prop, visitors, node, path, key);// 改动
            }
        })
    }
    visitorFuncs.exit && visitorFuncs.exit(path);
}

```

path 也要做相应的改动，加上 key 和 listkey：

```javascript
class NodePath {
    constructor(node, parent, parentPath, key, listKey) {
        this.node = node;
        this.parent = parent;
        this.parentPath = parentPath;
        this.key = key;
        this.listKey = listKey;
    }
}
```
然后基于 key 和 listkey 实现 replaceWith 的 api：

#### path.replaceWith

replaceWith 是替换节点，如果是数组的话，就替换 key 属性的 listkey 个元素的节点，用数组的 splice 方法。

不是数组的话，那就直接替换改 key 属性对应的节点。
```javascript
replaceWith(node) {
    if (this.listKey != undefined) {
        this.parent[this.key].splice(this.listKey, 1, node);
    } else {
        this.parent[this.key] = node
    }
}
```
#### path.remove

同理，remove 也是一样的思路：
```javascript
remove () {
    if (this.listKey != undefined) {
        this.parent[this.key].splice(this.listKey, 1);
    } else {
        this.parent[this.key] = null;
    }
}
```

#### path.find、path.findParent

find 和 findParent 是顺着 path 链向上查找 AST，并且把节点传入回调函数，如果找到了就返回节点的 path。区别是 find 包含当前节点，findParent 不包含。

```javascript
findParent(callback) {
    let curPath = this.parentPath;
    while (curPath && !callback(curPath)) {
        curPath = curPath.parentPath; 
    }
    return curPath;
}
find(callback) {
    let curPath = this;
    while (curPath && !callback(curPath)) {
        curPath = curPath.parentPath; 
    }
    return curPath;
}
```

#### path.traverse

traverse 的 api 是基于上面实现的 traverse，但是有一点不同，path.traverse 不需要再遍历当前节点，直接遍历子节点即可。

```javascript
traverse(visitors) {
    const traverse = require('../index');
    const defination = types.visitorKeys.get(this.node.type);

    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = this.node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach((childNode, index) => {
                    traverse(childNode, visitors, this.node, this);
                })
            } else {
                traverse(prop, visitors, this.node, this);
            }
        })
    }
}
```

#### path.skip

skip 的实现可以给节点加个标记，遍历的过程中如果发现了这个标记就跳过子节点遍历。

```javascript
skip() {
    this.node.__shouldSkip = true;
}
```
```javascript
module.exports = function traverse(node, visitors, parent, parentPath, key, listKey) {

    const defination = visitorKeys.get(node.type);
    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
        visitorFuncs = {
            enter: visitorFuncs
        }
    }
    const path = new NodePath(node, parent, parentPath, key, listKey);
    visitorFuncs.enter && visitorFuncs.enter(path);

    if(node.__shouldSkip) {
        delete node.__shouldSkip;
        return;
    }

    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach((childNode, index) => {
                    traverse(childNode, visitors, node, path, key, index);
                })
            } else {
                traverse(prop, visitors, node, path, key);
            }
        })
    }
    visitorFuncs.exit && visitorFuncs.exit(path);
}
```
#### path.toString

toString 是把当前节点打印成目标代码，会调用 generator，generator 的实现在后面的章节会讲。

```javascript
toString() {
    return generate(this.node).code;
}
```

#### path.isXxx

我们记录了不同 ast 怎么遍历，那么也可以基于这些数据实现各种判断 AST 类型的 api：

```javascript
const validations = {};

for (let name of astDefinationsMap.keys()) {
    validations['is' + name] = function (node) {
        return node.type === name;
    }
}
```

这些会抽离到 types 包里面，然后在 path 中做相应的封装，通过 bind 给方法添加一个参数。

```javascript
const types = require('../../types');

class NodePath {
    constructor(node, parent, parentPath, key, listKey) {
        this.node = node;
        this.parent = parent;
        this.parentPath = parentPath;
        this.key = key;
        this.listKey = listKey;

        Object.keys(types).forEach(key => {
            if (key.startsWith('is')) {
                this[key] = types[key].bind(this, node);
            }
        })
    }
}
```

实现了这些 API 之后我们就可以在 visitor 里使用 path 的 api 来操作 ast 了。

```javascript
traverse(ast, {
    Identifier(path) {
        if(path.findParent(p => p.isCallExpression())) {
            path.replaceWith({ type: 'Identifier', name: 'bbbbbbb' });
        }
    }
})
```

## 总结

path 的 api 就是对 AST 进行增删改，我们记录了 node（当前节点）、parent（父节点）、parentPath（父 path） 等信息，还会记录 key（父节点属性） 和 listkey（节点在数组中的下标）。基于这些就可以实现 replaceWith、remove、find、findParent、skip 等 api。

（代码在[这里](https://github.com/QuarkGluonPlasma/babel-plugin-exercize)，建议 git clone 下来通过 node 跑一下）




