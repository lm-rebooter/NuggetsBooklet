当代码运行报错时，我们会打印错误，错误中有堆栈信息，可以定位到对应的代码位置。但有的时候我们希望能够更直接准确的打印报错位置的代码。比如这样：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d3c6b350af041d680b429a5f0cc55f2~tplv-k3u1fbpfcp-watermark.image)

这种错误信息是不是感觉很常见？

这叫做 code frame。

这个可以使用 @babel/code-frames 来打印：

```javascript
const { codeFrameColumns } = require('@babel/code-frame');

const res = codeFrameColumns(code, {
  start: { line: 2, column: 1 },
  end: { line: 3, column: 5 },
}, {
  highlightCode: true,
  message: '这里出错了'
});

console.log(res);
```

当然，也可以直接使用 path.buildCodeFrameError(path, options) 来创建这种错误信息。

注意，这里的代码高亮是在控制台实现的，不能用网页里的那种库。


那么它是怎么做到的打印出上面的 code frame 的代码格式的呢？

这节我们就来探究下原理。

核心就是这三个问题：

- 如何打印出标记相应位置代码的 code frame（就是上图的打印格式）
- 如何实现语法高亮
- 如何在控制台打印颜色

## 如何打印 code frame

我们先不管高亮，实现这样的格式的打印：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8ac279789904a669148430c7089f184~tplv-k3u1fbpfcp-watermark.image)

其实就是一个拼接字符串的过程，下面是拼接字符串的细节（了解即可）：

传入了源代码、标记开始和结束的行列号，那么我们就能够计算出显示标记（marker `“>”`）的行是哪些，以及这些行的哪些列，然后依次对每一行代码做处理，如果本行没有标记则保持原样，如果本行有标记的话，那么就在开始打印一个 marker `“>”`，并且在下面打印一行 marker `"^"`，最后一个标记行还要打印错误信息。

我们来看一下 @babel/code-frame 的实现：

首先，分割字符串成每一行的数组，然后根据传入的位置计算出 marker（>） 所在的位置。

比如图中第二行的第 1 到 12 列，第三行的 0 到 5 列。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dda49d8bf08549458b2266a912b37042~tplv-k3u1fbpfcp-watermark.image)

然后对每一行做处理，如果本行有标记，则拼成 marker + gutter（行号） + 代码的格式，下面再打印一行 marker，最后的 marker 行打印 message。没有标记不处理。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc7dcce653e5479382e6f697008c96aa~tplv-k3u1fbpfcp-watermark.image)

这样最终拼出的就是这样的 code frame：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8ac279789904a669148430c7089f184~tplv-k3u1fbpfcp-watermark.image)

我们实现了 code frame 的拼接，暂时忽略了高亮，那么怎么做语法高亮呢？

## 如何实现语法高亮

实现语法高亮，词法分析就足够了，babel 也是这么做的，@babel/highlight 包里面完成了高亮代码的逻辑。

先看效果：

```
const a = 1;
const b = 2;
console.log(a + b);
```
上面的源码被分成了 token 数组：
```javascript
[
  [ 'whitespace', '\n' ], [ 'keyword', 'const' ],
  [ 'whitespace', ' ' ],  [ 'name', 'a' ],
  [ 'whitespace', ' ' ],  [ 'punctuator', '=' ],
  [ 'whitespace', ' ' ],  [ 'number', '1' ],
  [ 'punctuator', ';' ],  [ 'whitespace', '\n' ],
  [ 'keyword', 'const' ], [ 'whitespace', ' ' ],
  [ 'name', 'b' ],        [ 'whitespace', ' ' ],
  [ 'punctuator', '=' ],  [ 'whitespace', ' ' ],
  [ 'number', '2' ],      [ 'punctuator', ';' ],
  [ 'whitespace', '\n' ], [ 'name', 'console' ],
  [ 'punctuator', '.' ],  [ 'name', 'log' ],
  [ 'bracket', '(' ],     [ 'name', 'a' ],
  [ 'whitespace', ' ' ],  [ 'punctuator', '+' ],
  [ 'whitespace', ' ' ],  [ 'name', 'b' ],
  [ 'bracket', ')' ],     [ 'punctuator', ';' ],
  [ 'whitespace', '\n' ]
]
```
token 怎么分的呢？ 

一般来说词法分析就是有限状态自动机（DFA），但是这里实现比较简单，是通过正则匹配的：

js-tokens 这个包暴露出来一个正则，一个函数，正则是用来识别 token 的，其中有很多个分组，而函数里面是对不同的分组下标返回了不同的类型，这样就能完成 token 的识别和分类。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/807b2110f764402fae59a952053acb26~tplv-k3u1fbpfcp-watermark.image)

在 @babel/highlight 包里基于这个正则来匹配 token：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d30814b33d804996836b3eece6a67154~tplv-k3u1fbpfcp-watermark.image)

有了分类之后，不同 token 显示不同颜色，建立个 map 就行了。

@babel/highlight 里的实现：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d6accf8c55c426dbf8b7d44df45f1e2~tplv-k3u1fbpfcp-watermark.image)

我们知道了怎么做语法高亮，使用 chalk 的 api 就可以打印颜色，那控制台打印颜色的原理是什么呢？

## 如何在控制台打印颜色

控制台打印的是 [ASCII 码](https://tool.oschina.net/commons?type=4)，并不是所有的编码都对应可见字符，ASCII 码有一部分字符是对应控制字符的，比如 27 是 ESC，就是我们键盘上的 ESC 键，是 escape 的缩写，按下它可以完成一些控制功能，这里我们可以通过打印 ESC 的 ASCII 码来进入控制打印颜色的状态。

格式是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e7d7a92f6c0459f83bcb9a9ce779a81~tplv-k3u1fbpfcp-watermark.image)

打印一个 `ESC` 的 ASCII 码，之后是 `[` 代表开始，`m` 代表结束，中间是用 `;` 分隔的 n 个控制字符，可以控制很多样式，比如前景色、背景色、加粗、下划线等等。

ESC 的 ASCII 码是 27，有好几种写法：一种是字符表示的 `\e` ，一种是 16 进制的 `\0x1b`（27 对应的 16进制），一种是 8 进制的 `\033`，这三种都表示 ESC。

我们来试验一下： 1 表示加粗、36 表示前景色为青色、4 表示下划线，下面三种写法等价：

```shell
\e[36;1;4m
\033[36;1;4m
\0x1b[36;1;4m
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eca9c62870414489890c9570b889636b~tplv-k3u1fbpfcp-watermark.image)
都打印了正确的样式！

当然，加了样式还要去掉，可以加一个 `\e[0m` 就可以了（`\033[0m`,`\0x1b[0m` 等价）。

chalk（nodejs 的在终端打印颜色的库）的不同方法就是封装了这些 ASCII 码的颜色控制字符。

上面每行代码被高亮过以后的代码是：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d91383b4f5854e178c16be243a09a851~tplv-k3u1fbpfcp-watermark.image)

这样也就实现了不同颜色的打印。

## 总结

至此，我们能实现开头的效果了：支持 code frame 的打印，支持语法高亮，能够打印颜色

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d3c6b350af041d680b429a5f0cc55f2~tplv-k3u1fbpfcp-watermark.image)

这节我们探究了这种效果的实现原理，先是 code frame 的字符串是怎么拼接的，然后每一行的代码是怎么做高亮的，之后是高亮具体是怎么打印颜色的。

@babel/code-frame 包是 babel 用来打印错误信息的，别的工具（比如 eslint、tsc）也会打印 code frame 的格式，原理一样。

后面的错误打印我们都会用 code frame 的方式。



