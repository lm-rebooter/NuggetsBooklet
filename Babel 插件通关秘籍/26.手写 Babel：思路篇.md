学到这里，我们对 babel 插件的写法和 babel 内置的 preset 的实现都有了比较多的了解，但是对 babel 本身的实现可能还不是特别清晰。所以，我们通过写一个简单的 babel 来深入探索下 babel 的实现原理。

希望完成这个案例之后，能够帮你真正掌握 babel。

## 整体思路

### babel 的编译流程

我们知道，babel 的主要编译流程是 parse、transform、generate。 

- parse 是把源码转成 AST
- transform 是对 AST 做增删改
- generate 是打印 AST 成目标代码并生成 sourcemap

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63717d7589cf415680373ede5f4f7089~tplv-k3u1fbpfcp-watermark.image)

babel 7 把这些功能的实现放到了不同的包里面：

- `@babel/parser` 解析源码成 AST，对应 parse 阶段
- `@babel/traverse` 遍历 AST 并调用 visitor 函数，对应 transform 阶段
- `@babel/generate` 打印 AST，生成目标代码和 sorucemap，对应 generate 阶段

其中，遍历过程中需要创建 AST，会用到：

- `@babel/types` 创建、判断 AST
- `@babel/template`  根据模块批量创建 AST

上面是每一个阶段的功能， babel 整体功能的入口是在：

- `@babel/core` 解析配置、应用 plugin、preset，整体整体编译流程

插件和插件之间有一些公共函数，这些都是在：

- `@babel/helpers` 用于转换 es next 代码需要的通过模板创建的 AST，比如 _typeof、_defineProperties 等
- `@babel/helper-xxx` 其他的插件之间共享的用于操作 AST 的公共函数

当然，除了编译期转换的时候会有公共函数以外，运行时也有，这部分是放在：

- `@babel/runtime` 主要是包含 corejs、helpers、regenerator 这 3 部分：
    - helper： helper 函数的运行时版本（不是通过 AST 注入了，而是运行时引入代码）
    - corejs： es next 的 api 的实现，corejs 2 只支持静态方法，corejs 3 还支持实例方法
    - regenerator：async await 的实现，由 facebook 维护
    
（babel 做语法转换是自己实现的 helper，但是做 polyfill 都不是自己实现的，而是借助了第三方的 [corejs](https://github.com/zloirock/core-js)、[regenerator](https://github.com/facebook/regenerator)）

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ff74bb107644c88a5c5632b120ea4e6~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a577d66ca0c4d4ea7651538c4bca949~tplv-k3u1fbpfcp-watermark.image?)

- `@babel/cli` babel 的命令行工具，支持通过 glob 字符串来编译多个文件

### 我们要实现哪些包

上面介绍的是 babel 完成功能所内置的一些包，我们如果要写一个简易的 babel，也得实现这些包，但可以做一些简化。

- `parser 包`是肯定要实现的，babel parser 是基于 acorn fork 的，我们也基于 acorn，做一点扩展。完成从源码到 AST 的转换。
- `traverse 包`是对 AST 的遍历，需要知道不同类型的 AST 都遍历哪些 key，这些是在 @babel/types 包里面定义的，我们也用类似的实现方式，并且会调用对应的 visitor，实现 path 和 path.scope 的一些 api 然后传入。
- `generate 包`是打印 AST 成目标代码，生成 sourcemap。打印这部分每个 AST 类型都要写一个对应的函数来处理，生成 sourcemap 使用 source-map 这个包，关联 parse 时记录的 loc 和打印时计算的位置来生成每一个 mapping。
- `types 包`用于创建 AST，会维护创建和判断各种 AST 的 api，并且提供每种 AST 需要遍历的属性是哪些，用于 traverse 的过程
- `template 包`是批量创建 AST 的，这里我们实现一个简单的版本，传入字符串，parse 成 AST 返回。
- `core 包`是整体流程的串联，支持 plugins 和 presets，调用插件，合并成最终的 visitors，然后再 traverse。
- `helper 包`我们也会实现一个，因为支持了 plugin，那么中有一些公共的函数可以复用
- `runtime 包`我们也提供一下，不过只加入一些用于做语法转换的辅助函数就好了
- `cli 包` 实现一个命令行工具，来调用 core 包的功能

这是我们大概会做的事情，把这些都实现一遍就算一个比较完整的 babel 了。实现的过程中更能加深我们对 babel、对转译器的认识，不只是掌握 babel 本身。

## 总结

这一节讲了下整体的思路，后面章节会一步步实现，希望能够帮助大家深入 babel 的本质。



