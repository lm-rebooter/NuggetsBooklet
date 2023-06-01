上一节我们讲到了 babel 是一个转译器，那么什么是转译器呢，转译器的编译流程是什么？

## 编译器和转译器

编译的定义就是从一种编程语言转成另一种编程语言。主要指的是高级语言到低级语言。

> 高级语言：有很多用于描述逻辑的语言特性，比如分支、循环、函数、面向对象等，接近人的思维，可以让开发者快速的通过它来表达各种逻辑。比如 c++、javascript。

> 低级语言：与硬件和执行细节有关，会操作寄存器、内存，具体做内存与寄存器之间的复制，需要开发者理解熟悉计算机的工作原理，熟悉具体的执行细节。比如汇编语言、机器语言。

一般编译器 Compiler 是指高级语言到低级语言的转换工具。而从高级语言到高级语言的转换工具，被叫做转换编译器，简称转译器 (Transpiler)。

babel 就是一个 Javascript Transpiler。

## babel 的编译流程

babel 是 source to source 的转换，整体编译流程分为三步：

- parse：通过 parser 把源码转成抽象语法树（AST）
- transform：遍历 AST，调用各种 transform 插件对 AST 进行增删改
- generate：把转换后的 AST 打印成目标代码，并生成 sourcemap

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee9eaa1f265c4c49ad156f2c691748d9~tplv-k3u1fbpfcp-watermark.image)

### 为什么会分为这三步

为什么 babel 的编译流程会分 parse、transform、generate 这 3 步呢？

源码是一串按照语法格式来组织的字符串，人能够认识，但是计算机并不认识，想让计算机认识就要转成一种数据结构，通过不同的对象来保存不同的数据，并且按照依赖关系组织起来，这种数据结构就是抽象语法树（abstract syntax tree）。

之所以叫“抽象”语法树是因为数据结构中省略掉了一些无具体意义的分隔符比如 `;`  `{` `}` 等。

有了 AST，计算机就能理解源码字符串的意思，而理解是能够转换的前提，所以编译的第一步需要把源码 parse 成 AST。

转成 AST 之后就可以通过修改 AST 的方式来修改代码，这一步会遍历 AST 并进行各种增删改，这一步也是 babel 最核心的部分。

经过转换以后的 AST 就是符合要求的代码，就可以再转回字符串，转回字符串的过程中把之前删掉的一些分隔符再加回来。

简单总结一下就是：**为了让计算机理解代码需要先对源码字符串进行 parse，生成 AST，把对代码的修改转为对 AST 的增删改，转换完 AST 之后再打印成目标代码字符串。**

### 这三步都做了什么？

知道了为什么 babel 要分为这样的 3 步，那这 3 步具体都做了什么呢？

#### parse

parse 阶段的目的是把源码字符串转换成机器能够理解的 AST，这个过程分为词法分析、语法分析。

比如 ```let name = 'guang';``` 这样一段源码，我们要先把它分成一个个不能细分的单词（token），也就是 `let`, `name`, `=`, `'guang'`，这个过程是词法分析，按照单词的构成规则来拆分字符串成单词。

之后要把 token 进行递归的组装，生成 AST，这个过程是语法分析，按照不同的语法结构，来把一组单词组合成对象，比如声明语句、赋值表达式等都有对应的 AST 节点。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03bdbe8096944a0fa09c86ac2ff09e56~tplv-k3u1fbpfcp-watermark.image)

#### transform

transform 阶段是对 parse 生成的 AST 的处理，会进行 AST 的遍历，遍历的过程中处理到不同的 AST 节点会调用注册的相应的 visitor 函数，visitor 函数里可以对 AST 节点进行增删改，返回新的 AST（可以指定是否继续遍历新生成的 AST）。这样遍历完一遍 AST 之后就完成了对代码的修改。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/494b0bc006f64c71a92947f560e97e8c~tplv-k3u1fbpfcp-watermark.image)

#### generate

generate 阶段会把 AST 打印成目标代码字符串，并且会生成 sourcemap。不同的 AST 对应的不同结构的字符串。比如 `IfStatement` 就可以打印成  `if(test) {}` 格式的代码。这样从 AST 根节点进行递归的字符串拼接，就可以生成目标代码的字符串。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84530b477a7540ee87e5bb12e9375569~tplv-k3u1fbpfcp-watermark.image)

sourcemap 记录了源码到目标代码的转换关系，通过它我们可以找到目标代码中每一个节点对应的源码位置，用于调试的时候把编译后的代码映射回源码，或者线上报错的时候把报错位置映射到源码。

## 总结

我们了解了编译和转译的区别，明确了 babel 是一个 js transpiler。然后学习了 babel 编译流程的三个步骤 parse、transform、generate，为什么会有这三步，每一步都干了什么（ parse 生成 ast，transform 对 ast 进行转换，generate 打印 ast 成目标代码并生成 sourcemap）。

这一节对整体流程有了一个认识，这是后续深入学习 babel 的基础，后面会分别学习每一个步骤。
