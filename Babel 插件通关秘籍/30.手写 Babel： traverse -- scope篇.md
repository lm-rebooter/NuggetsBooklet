path.scope 中记录着作用域相关的数据，通过 scope 可以拿到整条作用域链，包括声明的变量和对该声明的引用。

这节我们实现下 scope。

## 思路分析

前面我们实现了 traverse 和 path，能够遍历 AST 和对 AST 增删改了，而 scope 和 path 一样也是遍历过程中记录的信息。

能生成 scope 的 AST 叫做 block，比如 FunctionDeclaration 就是 block，因为它会生成一个新的 scope。

我们把这类节点记录下来，遍历的时候遇到 block 节点会生成新的 scope，否则拿之前的 scope。

scope 中记录着 bindings，也就是声明，每个声明会记录在哪里声明的，被哪里引用的。

遇到 block 节点，创建 scope 的时候，要遍历作用域中的所有声明（VariableDeclaraion、FunctionDeclaration），记录该 binding 到 scope 中。

记录完 bindings 之后还要再遍历一次记录引用这些 binding 的 reference。

基于这种思路我们就能实现 scope 的功能。

## 代码实现

首先，创建 Binding 类和 Scope 类：
```javascript
class Binding {
    constructor(id, path, scope, kind) {
        this.id = id;
        this.path = path;
        this.referenced = false;
        this.referencePaths = [];
    }
}
```
```javascript
class Scope {
    constructor(parentScope, path) {
        this.parent = parentScope;
        this.bindings = {};
        this.path = path;
    }

    registerBinding(id, path) {
        this.bindings[id] = new Binding(id, path);
    }

    getOwnBinding(id) {
        return this.bindings[id];
    }

    getBinding(id) {
        let res = this.getOwnBinding(id);
        if (res === undefined && this.parent) {
            res = this.parent.getOwnBinding(id);
        }
        return res;
    }

    hasBinding(id) {
        return !!this.getBinding(id);
    }
}
```

bindings 是记录作用域中的每一个声明，同时我们还可以实现 添加声明 registerBinding、查找声明 getBinding、getOwnBinding、hasBidning 的方法。

getOwnBing 是只从当前 scope 查找，而 getBinding 则是顺着作用域链向上查找。

之后我们在 path 里面定义一个  scope 的 get 的方法，当需要用到 scope 的时候才会创建，因为 scope 创建之后还要遍历查找 bindings，是比较耗时的，实现 get 可以做到用到的时候才创建。

```javascript
get scope() {
    if (this.__scope) {
        return this.__scope;
    }
    const isBlock = this.isBlock();
    const parentScope = this.parentPath && this.parentPath.scope;
    return this.__scope = isBlock ? new Scope(parentScope, this) : parentScope;
}
```
这里的 isBlock 方法的实现就是从我们记录的数据中查找该节点是否是 block，也就是是否是函数声明这种能生成作用域的节点。

```javascript
isBlock() {
    return types.visitorKeys.get(this.node.type).isBlock;
}
```

我们在记录节点的遍历的属性的时候，也记录了该节点是否是 block：
```javascript
astDefinationsMap.set('Program', {
    visitor: ['body'],
    isBlock: true
});
astDefinationsMap.set('FunctionDeclaration', {
    visitor: ['id', 'params', 'body'],
    isBlock: true
});
```

这样，当遍历到 block 节点的时候，就会创建 Scope 对象，然后和当前 Scope 关联起来，形成作用域链。

scope 创建完成之后我们要扫描作用域中所有的声明，记录到 scope。这里要注意的是，因为遇到函数作用域要跳过遍历，因为它有自己独立的作用域。

```javascript
path.traverse({
    VariableDeclarator: (childPath) => {
        this.registerBinding(childPath.node.id.name, childPath);
    },
    FunctionDeclaration: (childPath) => {
        childPath.skip();
        this.registerBinding(childPath.node.id.name, childPath);
    }
});
```
记录完 binding 之后，再扫描所有引用该 binding 的地方，也就是扫描所有的 identifier。

这里要排除声明语句里面的 identifier，那个是定义变量不是引用变量。

```javascript
path.traverse({
    Identifier: childPath =>  {
        if (!childPath.findParent(p => p.isVariableDeclarator() || p.isFunctionDeclaration())) {
            const id = childPath.node.name;
            const binding = this.getBinding(id);
            if (binding) {
                binding.referenced = true;
                binding.referencePaths.push(childPath);
            }
        }
    }
});
```

这样，我们就实现了作用域链 path.scope，可以在 visitor 中分析作用域了。

比如删除掉未被引用的变量：

```javascript
traverse(ast, {
    Program(path) {
        Object.entries(path.scope.bindings).forEach(([id, binding]) => {
            if (!binding.referenced) {
                binding.path.remove();
            }
        });
    },
    FunctionDeclaration(path) {
        Object.entries(path.scope.bindings).forEach(([id, binding]) => {
            if (!binding.referenced) {
                binding.path.remove();
            }
        });
    }
});
```
## 总结

scope 是作用域相关的信息，记录着每一个声明（binding）和对该声明的引用（reference）。

只有 block 节点需要生成 scope，所以我们会记录什么节点是 block 节点，遇到 block 节点会生成 scope，否则拿之前的。

因为 scope 会遍历 AST 来注册 binding，还是比较耗时的。我们在 path 中定义了 scope 的 get 方法，用到的时候才会创建 scope。

创建 scope 时会扫描作用域中的函数声明、变量声明，记录到 bindings 中，并且提供了 getBinding、getOwnBinding、hasBinding、registerBinding 等方法。

之后再次扫描作用域，找到所有引用这些 binding 的 identifier，记录到 reference 中。

之后我们就可以在 visitor 中分析 scope 来实现类似死代码删除等功能了。

（代码在[这里](https://github.com/QuarkGluonPlasma/babel-plugin-exercize)，建议 git clone 下来通过 node 跑一下）


