# 19 原理篇：实现简易 TypeScript 类型检查
不自己实现 ts 类型检查，怎么能叫“通关”呢？

这一节我们基于 babel 来实现类型检查，也就是 Checker 的功能。 当然，只是简易版本，帮助大家理清类型检查的实现原理。

这节是从 [babel 插件小册](https://juejin.cn/book/6946117847848321055 "https://juejin.cn/book/6946117847848321055")拿过来的，因为这本不是讲 babel 插件的，所以大家不用看细节，理清下思路就行。

代码在 [github](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FQuarkGluonPlasma%2Fbabel-plugin-exercize "https://github.com/QuarkGluonPlasma/babel-plugin-exercize")，可以下下来跑一下类型检查部分。

## 如何检查类型
我们知道，babel 能够解析 typescript 语法，那么能不能基于 babel 实现类型检查呢？

我们经常用 tsc 来做类型检查，有没有想过，类型检查具体做了什么？

源码是字符串，是没法直接处理的，我们会先把代码 parse 成 AST，这是计算机能理解的格式。之后的**类型检查就是对 AST 结构的检查**。

比如一个变量声明为了 number，那么给它赋值的是一个 string 就是有类型错误。

再复杂一点，如果类型有泛型，也就是有类型参数，那么需要传入具体的参数来确定类型，确定了类型之后再去和实际的 AST 对比。

typescript 还支持高级类型，也就是类型可以做各种运算，这种就需要传入类型参数求出具体的类型再去和 AST 对比。

我们来写代码实现一下：

## 代码实现
### 实现简单类型的类型检查
#### 赋值语句的类型检查
比如这样一段代码，声明的值是一个 string，但是赋值为了 number，明显是有类型错误的，我们怎么检查出它的错误的。

```Plain Text
let name: string;

name = 111;

```
首先我们使用 babel 把这段代码 parse 成 AST：

```Plain Text
const  parser = require('@babel/parser');

const sourceCode = `
    let name: string;

    name = 111;
`;

const ast = parser.parse(sourceCode, {
    plugins: ['typescript']
});

```
使用 babel parser 来 parse，启用 typescript 语法插件。

可以使用 [astexplerer.net](https://link.juejin.cn/?target=https%3A%2F%2Fastexplorer.net%2F%23%2Fgist%2Ffbe3aa6468083e790076830c48a4725c%2F9573eca6e0bc15dfdaf341eda5a2afc2906875e6 "https://astexplorer.net/#/gist/fbe3aa6468083e790076830c48a4725c/9573eca6e0bc15dfdaf341eda5a2afc2906875e6") 来查看它的 AST：

![image](images/mKSIxTj6adc_98rt_gh5JuRQX0nC3rq1_Ng_6lsn2oo.webp)

##### 实现类型检查
我们需要检查的是这个赋值语句 AssignmentExpression，左右两边的类型是否匹配。

右边是一个数字字面量 NumericLiteral，很容易拿到类型，而左边则是一个引用，要从作用域中拿到它声明的类型，之后才能做类型对比。

babel 提供了 scope 的 api 可以用于查找作用域中的类型声明（binding），并且还可以通过 path.getTypeAnnotation 获得声明时的类型。

```Plain Text
 AssignmentExpression(path, state) {
    const leftBinding = path.scope.getBinding(path.get('left'));
    const leftType = leftBinding.path.get('id').getTypeAnnotation();// 左边的值声明的类型
}

```
这个返回的类型是 TSTypeAnnotation 的一个对象，我们需要做下处理，转为类型字符串，也就是 string、number 这种。

![image](images/qjNG-DUyF5m-vmlTW4Y3RY-v0wVnD9R6KwNJFQoIbUs.webp)

封装一个方法，传入类型对象，返回 number、string 等类型字符串

```Plain Text
function resolveType(targetType) {
    const tsTypeAnnotationMap = {
        'TSStringKeyword': 'string'
    }
    switch (targetType.type) {
        case 'TSTypeAnnotation':
            return tsTypeAnnotationMap[targetType.typeAnnotation.type];
        case 'NumberTypeAnnotation': 
            return 'number';
    }
}

```
这样我们拿到了左右两边的类型，接下来就简单了，对比下就知道了类型是否匹配：

```Plain Text
AssignmentExpression(path, state) {
    const rightType = resolveType(path.get('right').getTypeAnnotation());
    const leftBinding = path.scope.getBinding(path.get('left'));
    const leftType = resolveType(leftBinding.path.get('id').getTypeAnnotation());
    if (leftType !== rightType ) {
        // error: 类型不匹配
    }
}

```
##### 错误打印优化
报错信息怎么打印呢？可以使用 @babel/code-frame，它支持打印某一片段的高亮代码。

```Plain Text
path.get('right').buildCodeFrameError(`${rightType} can not assign to ${leftType}`, Error)

```
效果如下：

![image](images/PLoTfwV-XTp9mOcV-mAOyoX6uC97pCR_3Q_IJK3NzEE.webp)

这个错误堆栈也太丑了，我们把它去掉，设置 Error.stackTraceLimit 为 0 就行了

```Plain Text
Error.stackTraceLimit = 0;
path.get('right').buildCodeFrameError(`${rightType} can not assign to ${leftType}`, Error));

```
但是这里改了之后还要改回来，也就是:

```Plain Text
const tmp = Error.stackTraceLimit;
Error.stackTraceLimit = 0;
console.log(path.get('right').buildCodeFrameError(`${rightType} can not assign to ${leftType}`, Error));
Error.stackTraceLimit = tmp;

```
再来跑一下：

![image](images/_BumVZ582uxXRZtEWiOuUQKTQ6ycJSgteWb-o842J6E.webp)

好看多了！

##### 错误收集
还有一个问题，现在是遇到类型错误就报错，但我们希望是在遇到类型错误时收集起来，最后统一报错。

怎么实现呢？错误放在哪？

babel 插件中可以拿到 file 对象，有 set 和 get 方法用来存取一些全局的信息。可以在插件调用前后，也就是 pre 和 post 阶段拿到 file 对象。

所以我们可以这样做：

```Plain Text
pre(file) {
    file.set('errors', []);
},
visitor: {
    AssignmentExpression(path, state) {
        const errors = state.file.get('errors');

        const rightType = resolveType(path.get('right').getTypeAnnotation());
        const leftBinding = path.scope.getBinding(path.get('left'));
        const leftType = resolveType(leftBinding.path.get('id').getTypeAnnotation());
        if (leftType !== rightType ) {
            const tmp = Error.stackTraceLimit;
            Error.stackTraceLimit = 0;
            errors.push(path.get('right').buildCodeFrameError(`${rightType} can not assign to ${leftType}`, Error));
            Error.stackTraceLimit = tmp;
        } 
    }
},
post(file) {
    console.log(file.get('errors'));
}

```
这样就可以做到过程中收集错误，最后统一打印：

![image](images/t4G1IytRV8KYj51Nlk1YDVcdqGrpA-_TaEP4M53oSoY.webp)

这样，我们就实现了简单的赋值语句的类型检查！

#### 函数调用的类型检查
赋值语句的检查比较简单，我们来进阶一下，实现函数调用参数的类型检查

```Plain Text
function add(a: number, b: number): number{
    return a + b;
}
add(1, '2');

```
这里我们要检查的就是函数调用语句 CallExpression 的参数和它声明的是否一致。

![image](images/3nwk89bgwhv5j3C8jzIGlDhVGxJFp1zCLJ8sTmgvlpc.webp)

CallExpression 有 callee 和 arguments 两部分，我们需要根据 callee 从作用域中查找函数声明，然后再把 arguments 的类型和函数声明语句的 params 的类型进行逐一对比，这样就实现了函数调用参数的类型检查。

```Plain Text
pre(file) {
    file.set('errors', []);
},
visitor: {
    CallExpression(path, state) {
        const errors = state.file.get('errors');
        // 调用参数的类型
        const argumentsTypes = path.get('arguments').map(item => {
            return resolveType(item.getTypeAnnotation());
        });
        const calleeName = path.get('callee').toString();
        // 根据 callee 查找函数声明
        const functionDeclarePath = path.scope.getBinding(calleeName).path;
        // 拿到声明时参数的类型
        const declareParamsTypes = functionDeclarePath.get('params').map(item => {
            return resolveType(item.getTypeAnnotation());
        })

        argumentsTypes.forEach((item, index) => {
            if (item !== declareParamsTypes[index]) {
                // 类型不一致，报错
            }
        });
    }
},
post(file) {
    console.log(file.get('errors'));
}

```
运行一下，效果如下：

![image](images/UOlTQNjTHGhYtI687LxNB7-L9pXzaJKOiMvEAC8ZCNs.webp)

我们实现了函数调用参数的类型检查！实际上思路还是挺清晰的，检查别的 AST 也是类似的思路。

### 实现带泛型的类型检查
泛型是什么，其实就是类型参数，使得类型可以根据传入的参数动态确定，类型定义更加灵活。

比如这样一段代码：

```Plain Text
function add<T>(a: T, b: T) {
    return a + b;
}
add<number>(1, '2');

```
怎么做类型检查呢？

这还是函数调用语句的类型检查，我们上面实现过了，区别不过是多了个参数，那么我们取出类型参数来传过去就行了。

```Plain Text
CallExpression(path, state) {
    // 先拿到类型参数的值，也就是真实类型
    const realTypes = path.node.typeParameters.params.map(item => {
        return resolveType(item);
    });
    //实参的类型
    const argumentsTypes = path.get('arguments').map(item => {
        return resolveType(item.getTypeAnnotation());
    });
    const calleeName = path.get('callee').toString();
    // 根据函数名查找函数声明
    const functionDeclarePath = path.scope.getBinding(calleeName).path;
    const realTypeMap = {};

  // 把类型参数的值赋值给函数声明语句的泛型参数
   functionDeclarePath.node.typeParameters.params.map((item, index) => {
        realTypeMap[item.name] = realTypes[index];
    });
    const declareParamsTypes = functionDeclarePath.get('params').map(item => {
        return resolveType(item.getTypeAnnotation(), realTypeMap);
    })
    // 做类型检查的时候取具体的类型来对比
    argumentsTypes.forEach((item, index) => { 
        if (item !== declareParamsTypes[index]) {
            // 报错，类型不一致
        }
    });
}

```
多了一步确定泛型参数的具体类型的过程。

执行看下效果：

![image](images/NIGflYPxPfeCGXksrmPI9wXQurMQ-eK2-m9mS9AKmPE.webp)

我们成功支持了带泛型的函数调用语句的类型检查！

### 实现带高级类型的函数调用语句的类型检查
typescript 支持高级类型，也就是支持对类型参数做各种运算然后返回最终类型

```Plain Text
type Res<Param> = Param extends 1 ? number : string;
function add<T>(a: T, b: T) {
    return a + b;
}
add<Res<1>>(1, '2');

```
比如这段代码中，Res 就是一个高级类型，对传入的类型参数 Param 进行处理之后返回新类型。

这个函数调用语句的类型检查，比泛型参数传具体的类型又复杂了一些，需要先求出具体的类型，然后再传入参数，之后再去对比参数的类型。

那么这个 Res 的高级类型怎么求值呢？

我们来看一下这个 Res 类型的 AST：

![image](images/1A4dcsf65A4DqREoW-STiouorHYwUYdYMn8aOFsHSqM.webp)

它有类型参数部分（typeParameters），和具体的类型计算逻辑部分（typeAnnotation），右边的 `Param extends 1 ? number : string;` 是一个 condition 语句，有 Params 和 1 分别对应 checkType、extendsType，number 和 string 则分别对应 trueType、falseType。

我们只需要对传入的 Param 判断下是否是 1，就可以求出具体的类型是 trueType 还是 falseType。

具体类型传参的逻辑和上面一样，就不赘述了，我们看一下根据类型参数求值的逻辑：

```Plain Text
function typeEval(node, params) {
    let checkType;
    // 如果参数是泛型，则从传入的参数取值
    if(node.checkType.type === 'TSTypeReference') {
        checkType = params[node.checkType.typeName.name];
    } else {// 否则直接取字面量参数
        checkType = resolveType(node.checkType); 
    }
    const extendsType = resolveType(node.extendsType);
    if (checkType === extendsType || checkType instanceof extendsType) { // 如果 extends 逻辑成立
        return resolveType(node.trueType);
    } else {
        return resolveType(node.falseType);
    }
}

```
这样，我们就可以求出这个 Res 的高级类型当传入 Params 为 1 时求出的最终类型。

有了最终类型之后，就和直接传入具体类型的函数调用的类型检查一样了。（上面我们实现过）

执行一下，效果如下：

![image](images/w42pr_r0tcmiCFZ9bvoyAl4s1sljl5sUtOUHEEHVjZc.webp)

完整代码如下（有些长，可以先跳过往后看）：

```Plain Text
const { declare } = require('@babel/helper-plugin-utils');

// 解析高级类型的值，传入泛型参数的值
function typeEval(node, params) {
    let checkType;
    if(node.checkType.type === 'TSTypeReference') {
        checkType = params[node.checkType.typeName.name];
    } else {
        checkType = resolveType(node.checkType);
    }
    const extendsType = resolveType(node.extendsType);
    // 如果 condition 表达式 的 check 部分为 true，则返回 trueType，否则返回 falseType
    if (checkType === extendsType || checkType instanceof extendsType) {
        return resolveType(node.trueType);
    } else {
        return resolveType(node.falseType);
    }
}

function resolveType(targetType, referenceTypesMap = {}, scope) {
    const tsTypeAnnotationMap = {
        TSStringKeyword: 'string',
        TSNumberKeyword: 'number'
    }
    switch (targetType.type) {
        case 'TSTypeAnnotation':
            if (targetType.typeAnnotation.type === 'TSTypeReference') {
                return referenceTypesMap[targetType.typeAnnotation.typeName.name]
            }
            return tsTypeAnnotationMap[targetType.typeAnnotation.type];
        case 'NumberTypeAnnotation': 
            return 'number';
        case 'StringTypeAnnotation':
            return 'string';
        case 'TSNumberKeyword':
            return 'number';
        case 'TSTypeReference':
            const typeAlias = scope.getData(targetType.typeName.name);
            const paramTypes = targetType.typeParameters.params.map(item => {
                return resolveType(item);
            });
            const params = typeAlias.paramNames.reduce((obj, name, index) => {
                obj[name] = paramTypes[index]; 
                return obj;
            },{});
            return typeEval(typeAlias.body, params);
        case 'TSLiteralType':
            return targetType.literal.value;
    }
}

function noStackTraceWrapper(cb) {
    const tmp = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    cb && cb(Error);
    Error.stackTraceLimit = tmp;
}

const noFuncAssignLint = declare((api, options, dirname) => {
    api.assertVersion(7);

    return {
        pre(file) {
            file.set('errors', []);
        },
        visitor: {
            TSTypeAliasDeclaration(path) {
                path.scope.setData(path.get('id').toString(), {
                    paramNames: path.node.typeParameters.params.map(item => {
                        return item.name;
                    }),
                    body: path.getTypeAnnotation()
                });
                path.scope.setData(path.get('params'))
            },
            CallExpression(path, state) {
                const errors = state.file.get('errors');
                // 泛型参数
                const realTypes = path.node.typeParameters.params.map(item => {
                    return resolveType(item, {}, path.scope);
                });
                // 实参类型
                const argumentsTypes = path.get('arguments').map(item => {
                    return resolveType(item.getTypeAnnotation());
                });
                const calleeName = path.get('callee').toString();
                // 根据函数名查找到函数声明
                const functionDeclarePath = path.scope.getBinding(calleeName).path;
                const realTypeMap = {};
                functionDeclarePath.node.typeParameters.params.map((item, index) => {
                    realTypeMap[item.name] = realTypes[index];
                });
                // 把泛型参数传递给具体的泛型
                const declareParamsTypes = functionDeclarePath.get('params').map(item => {
                    return resolveType(item.getTypeAnnotation(), realTypeMap);
                })

                // 声明类型和具体的类型的对比（类型检查）
                argumentsTypes.forEach((item, index) => {
                    if (item !== declareParamsTypes[index]) {
                        noStackTraceWrapper(Error => {
                            errors.push(path.get('arguments.' + index ).buildCodeFrameError(`${item} can not assign to ${declareParamsTypes[index]}`,Error));
                        });
                    }
                });
            }
        },
        post(file) {
            console.log(file.get('errors'));
        }
    }
});

module.exports = noFuncAssignLint;


```
就这样，我们实现了 typescript 高级类型！

## 总结
类型代表了变量的内容和能对它进行的操作，静态类型让检查可以在编译期间做，随着前端项目越来越重，越来越需要 typescript 这类静态类型语言。

类型检查就是做 AST 的对比，判断声明的和实际的是否一致：

* 简单类型就直接对比，相当于 if else
* 带泛型的要先把类型参数传递过去才能确定类型，之后对比，相当于函数调用包裹 if else
* 带高级类型的泛型的类型检查，多了一个对类型求值的过程，相当于多级函数调用之后再判断 if else

实现一个完整的 typescript type cheker 还是很复杂的，不然 typescript checker 部分的代码也不至于好几万行了。但是思路其实没有那么难，按照我们文中的思路来，是可以实现一个完整的 type checker 的。

这一节主要是用到了 path.getTypeAnnotation 的 api 来获取声明的类型，然后进行 AST 的检查，希望能够帮助你理解 type checker 的实现原理。

（当然，文中只是实现了独立的一个个类型的检查，tsc 会递归地做多个文件的全文的类型检查，但是具体的每一部分都是类似的思路。）

（代码在[这里](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FQuarkGluonPlasma%2Fbabel-plugin-exercize "https://github.com/QuarkGluonPlasma/babel-plugin-exercize")，建议 git clone 下来通过 node 跑一下）