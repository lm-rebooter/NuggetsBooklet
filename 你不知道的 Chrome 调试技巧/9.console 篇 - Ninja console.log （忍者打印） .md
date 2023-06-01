# console篇 - Ninja console.log （忍者打印） 

有时你设置的断点是不是被执行了太多次？假设有一个包含 `200` 个元素的循环，但是你只对第 `110`  次循环的结果感兴趣，又或者你只对一些满足某些条件的结果感兴趣，怎么办呢？这就是我们要说的条件断点：

## 1. `Conditional breakpoints` 条件断点

这样的情况下，你可以设置一个条件断点：

- 右击行号，选择 `Add conditional breakpoint...(添加条件断点)`
- 或者右击一个已经设置的断点并且选择 `Edit breakpoint(编辑断点)`

- 然后输入一个执行结果为 `true` 或者 `false` 的表达式（它的值其实不需要完全为 `true` 或者 `false` 尽管那个弹出框的描述是这样说的）。

在这个表达式中你可以使用任何这段代码可以获取到的值（当前行的作用域）。

如果条件成立，这个断点就会暂停代码的执行：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/17/167b94b8f36112b7~tplv-t2oaga2asx-image.image)

## 2. The ninja（忍者） `console.log`

得益于条件断点， `console.log` 也有了新玩法：

- 每一个条件都必须经过判断 - 当应用执行到这一行的时候进行判断
- 并且如果条件返回的是 `falsy` 的值(这里的 `falsy`并非是笔误，`falsy` 指的是被判定为 `false` 的值，例如 `undefined` )，它并不会暂停..

与其在你的源码的不同地方去添加 `console.log` / `console.table` / `console.time` 等等，不如你直接使用条件判断来将它们“连接”到 `Source` 面板中。
这样的话，它们会一直执行，并且当你不再需要它们的时候，在 `Breakpoints section` 会清晰的列出它们。点两下鼠标你就可以把所有的都移除，就像一堆忍者一样突然消失！

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/17/167b955a1f0311fc~tplv-t2oaga2asx-image.image)


> 这个技术在调试生产环境的问题时同样很有用，因为你通过这样的方式轻松将 `console logs` 插入到 `source` 里。