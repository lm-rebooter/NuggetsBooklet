# console篇 - console中骚操作

## 前言
我最开始接触前端的时候，学会用的就是 `console.log` ，甚至现在，大部分情况也还在用它调试，但是，在不同的场景下，除了 `log` ，其实有更好的选择。

## 1. `console.assert` 

在 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/console/assert)  中是这样定义的

```javascript
console.assert(assertion, obj1 [, obj2, ..., objN]);
console.assert(assertion, msg [, subst1, ..., substN]); // c-like message formatting
```

> 当我们传入的第一个参数为 **假** 时，`console.assert` 打印跟在这个参数后面的值。

这个方法适用于什么情况呢？举个栗子：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/167893640b5cdd71~tplv-t2oaga2asx-image.image)

通过它，你可以摆脱令人讨厌的 `if` 表达式，还可以获得堆栈信息。

> 请注意，**如果你使用的 `NodeJS` 版本 `≤ 10.0` ， `console.assert`  可能会中断后面代码的执行**，但是在 `.10` 的版本中被修复了(当然，在浏览器中不存在这个问题)

## 2. 增强 `log` 的阅读体验

有时即使你 `console.log` 一个简单的变量，你可能会忘记（或混淆）哪一个是那个。那当你有不同的变量需要打印的时候，阅读起来会更费劲。


假如有这么一堆你想要输出但看起来并不易读的数据
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/22/16874442f819a4bf~tplv-t2oaga2asx-image.image)


> **“哪一个值对应哪一个变量来着？”**

为了让它变得更加易读，你可以打印一个对象 - 只需将所有 `console.log` 的参数包装在大括号中。感谢 `ECMAScript 2015 ` 中引入了 `enhanced object literal(增强对象文字面量)` ，所以加上 `{}` 已经是你需要做的全部事情了：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/22/1687447f46cb18a2~tplv-t2oaga2asx-image.image)


## 3.`console.table`

`console.table` 这个小技巧在开发者中可能并没有多少人知道: 如果有一个 **数组** (或者是 **类数组** 的对象，或者就是一个 **对象** )需要打印，你可以使用 `console.table` 方法将它以一个漂亮的表格的形式打印出来。它不仅会根据数组中包含的对象的所有属性，去计算出表中的列名，而且这些列都是可以 **缩放** 甚至 **还可以排序!!!**

如果你觉得展示的列太多了，使用第二个参数，传入你想要展示的列的名字:

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/167893640e9ba1d3~tplv-t2oaga2asx-image.image)

> 对于后台而言，只有 `node` 版本大于 `10` 以上， `console.table` 才能起作用


## 4. table 和 `{}` 的配合

我们刚刚看到了 `console.table` 这个技巧，也了解了在他上面的 `{}` ，那么我们为什么不将他们结合起来打造一个终极 `log` 呢？

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/22/1687448b6fdfc5bc~tplv-t2oaga2asx-image.image)

## 5. `console.dir`

有时候你想要打印一个 `DOM` 节点。 `console.log` 会将这个交互式的元素渲染成像是从 `Elements` 中剪切出来的一样。如果说你想要查看 **这个节点所关联到的真实的js对象** 呢？并且想要查看他的 **属性** 等等？

在那样的情况下，就可以使用`console.dir`:

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/1678936410bb79fa~tplv-t2oaga2asx-image.image)

## 6. 给 `logs` 加上时间戳

我们总是需要打印各式各样的信息，之前我们讨论了如何让输出的信息更加直观，但是如果我们需要打印相关的时间信息呢？这就用到了计时的相关操作。

如果你想要给你的应用中发生的事件加上一个确切的时间记录，开启 *timestamps* 。你可以在设置(在调试工具中的 `⋮` 下拉中找到它，或者按下 `F1` )中来开启或者使用 [Commands Menu](https://medium.com/@tomsu/devtools-tips-day-6-thecommand-menu-449eb3966d9#7404)：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/13/167a467d9f9ff467~tplv-t2oaga2asx-image.image)

## 7.监测执行时间

与其在所有事上展示一个时间戳，或许你对脚本中的特殊的节点之间执行的时间跨度更加感兴趣，对于这样的情况，我们可以采用一对有效的 `console` 方法

- `console.time()` — 开启一个计时器
- `console.timeEnd()` — 结束计时并且将结果在 `console` 中打印出来

如果你想一次记录多件事，可以往这些函数中传入不同的标签值。(例如: `console.time('loading')` ， `console.timeEnd('loading')` )

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/13/167a484d3824545d~tplv-t2oaga2asx-image.image)

## 8. 给你的 `console.log` 加上 `CSS` 样式

如果你给打印文本加上 `%c` 那么 `console.log` 的第二个参数就变成了`CSS` 规则！这个特性可以让你的日志脱颖而出(例如 [Facebook](https://www.facebook.com/) 在你打开 `console` 的时候所做的一样)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/21/1686f25a9c7ad9d8~tplv-t2oaga2asx-image.image)

## 9. 让 `console.log` 基于调用堆栈自动缩进

配合 `Error` 对象的 `stack` 属性，让你的 `log` 可以根据堆栈的调用自动缩进：

```javascript
function log(message) {
      console.log(
        // 这句话是重点当我们 new 出来的 Error 对象时，会匹配它的stack 信息中的换行符，换行符出现的次数也等同于它在堆栈调用时的深度。
        ' '.repeat(new Error().stack.match(/\n/g).length - 2) + message
      );
    }

    function foo() {
      log('foo');
      return bar() + bar();
    }

    function bar() {
      log('bar');
      return baz() + baz();
    }

    function baz() {
      log('baz');
      return 17;
    }

    foo();
```
运行结果如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/14/1684b5b03d4ebb82~tplv-t2oaga2asx-image.image)

## 10. 直接在回调中使用 `console.log`

是不是经常有这样的情况，就是我确定要将什么传递给回调函数。在这种情况下，我会在里面添加一个 `console.log` 来检查。

有两种方式来实现：

- 在回调方法的内部使用 `console.log` 
- **直接使用 `consolelog` 来作为回调方法**。

我推荐使用第二种，因为这不仅减少了输入，还可能在回调中接收多个参数。(这在第一个解决方案中是没有的)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/22/168744938b968240~tplv-t2oaga2asx-image.image)

## 11. 使用实时表达式

在本文形成的不久前，`DevTools` 在 `Console` 面板中引入了一个非常漂亮的附加功能，这是一个名为 `Live expression` 的工具

只需按下 "眼睛" 符号，你就可以在那里定义任何 `JavaScript` 表达式。 它会不断更新，所以表达的结果将永远，存在 :-)

同时支持定义好几个：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/29/167f82b33009449f~tplv-t2oaga2asx-image.image)
