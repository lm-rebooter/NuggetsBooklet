traverse 是遍历 AST，并且遍历的过程中支持 visitor 的调用，在 visitor 里实现对 AST 的增删改。

我们这一节的目的是实现这样的 api：

```javascript
traverse(ast, {
    Identifier(node) {
        node.name = 'b';
    }
});
```

path 放到下一节实现。

## 思路分析

AST 的遍历就是树的遍历，树的遍历就深度优先、广度优先两种方式，而这里明显是深度优先遍历。

深度优先遍历要递归的遍历节点的子节点，那么我们怎么知道对象的属性是可以遍历的子节点呢？

可以维护一份数据来保存不同 AST 的什么属性是可以遍历的，然后在遍历不同节点的时候从中查找应该继续遍历什么属性。这样就实现了深度优先遍历。

在遍历的过程中可以根据类型调用不同的 visitor，然后传入当前节点。

## 代码实现

首先，我们维护这样一份数据：不同的 AST 有哪些可以遍历的属性。

比如 Program 要遍历 body 属性，VariableDeclarator 要遍历 id、init 属性等：

```javascript
const astDefinationsMap = new Map();

astDefinationsMap.set('Program', {
    visitor: ['body']
});
astDefinationsMap.set('VariableDeclaration', {
    visitor: ['declarations']
});
astDefinationsMap.set('VariableDeclarator', {
    visitor: ['id', 'init']
});
astDefinationsMap.set('Identifier', {});
astDefinationsMap.set('NumericLiteral', {});
astDefinationsMap.set('FunctionDeclaration', {
    visitor: ['id', 'params', 'body']
});
astDefinationsMap.set('BlockStatement', {
    visitor: ['body']
});
astDefinationsMap.set('ReturnStatement', {
    visitor: ['argument']
});
astDefinationsMap.set('BinaryExpression', {
    visitor: ['left', 'right']
});
astDefinationsMap.set('ExpressionStatement', {
    visitor: ['expression']
});
astDefinationsMap.set('CallExpression', {
    visitor: ['callee', 'arguments']
});
```

然后实现递归的遍历，遍历到不同节点时，取出不同节点要遍历的属性，然后递归遍历。如果是数组的话，每个元素都是这样处理：

```javascript
function traverse(node, visitors) {
    const defination = astDefinationsMap.get(node.type);
    
    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach(childNode => {
                    traverse(childNode, visitors);
                })
            } else {
                traverse(prop, visitors);
            }
        })
    }
}
```

实现了遍历，当然还要在遍历时支持不同节点的 visitor 回调函数：

visitor 支持 enter 和 exit 阶段，也就是进入节点调用 enter 回调函数，之后遍历子节点，之后再调用 exit 回调函数。

那么分别在遍历前后调用就可以，默认如果没有指定哪个阶段就在 enter 阶段调用。

```javascript
function traverse(node, visitors) {
    const defination = astDefinationsMap.get(node.type);

    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
        visitorFuncs = {
            enter: visitorFuncs
        }
    }

    visitorFuncs.enter && visitorFuncs.enter(node);

    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach(childNode => {
                    traverse(childNode, visitors);
                })
            } else {
                traverse(prop, visitors);
            }
        })
    }
    visitorFuncs.exit && visitorFuncs.exit(node);
}
```

这样，我们就实现了 AST 的遍历和 enter、exit 阶段的 visitor 调用。

**为什么要分 enter 和 exit 两个阶段呢？**

因为 enter 阶段在遍历子节点之前，那么修改之后就可以立刻遍历子节点，而 exit 是在遍历结束之后了，所以不会继续遍历子节点。如果 enter 阶段修改了 AST 但是不想遍历新生成的子节点，可以用 path.skip 跳过遍历。

可以这样来遍历和修改 AST：

```javascript
traverse(ast, {
    Identifier(node) {
        node.name = 'b';
    }
});
```

## 总结

traverse 就是 AST 的遍历，而树的遍历就深度优先和广度优先两种，这里是深度优先，我们维护了一份什么 AST 遍历什么属性的数据，然后遍历的时候就可以知道如何遍历每一个节点。

遍历的时候调用 visitor 的回调函数，分为 enter 和 exit 阶段来调用，默认是 enter 阶段。

（代码在[这里](https://github.com/QuarkGluonPlasma/babel-plugin-exercize)，建议 git clone 下来通过 node 跑一下）






