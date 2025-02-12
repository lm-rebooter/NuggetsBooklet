在 Node.js 出现之前，最常见的 JavaScript 运行时环境是浏览器，也叫做 JavaScript 的宿主环境。浏览器为 JavaScript 提供了 DOM API，能够让 JavaScript 操作浏览器环境（JS 环境）。

2009 年初 Node.js 出现了，它是由 Ryan Dahl 基于 Chrome V8 引擎开发的 JavaScript **运行时环境**，所以 Node.js 也是 JavaScript  的一种宿主环境。而它的底层就是我们所熟悉的 Chrome 浏览器的 JavaScript 引擎，因此本质上和在 Chrome 浏览器中运行的 JavaScript 并没有什么区别。

但是，**Node.js 的运行环境和浏览器的运行环境还是不一样的**。

![](https://p.ssl.qhimg.com/t01072a67f1315ec168.jpg)
_Node.js、V8与Chrome浏览器的关系_

因为 Node.js 不是浏览器，所以它**不具有浏览器提供的 DOM API**，比如 Window 对象、Location 对象、Document 对象、HTMLElement 对象、Cookie 对象等等。但是，Node.js 提供了自己特有的 API，比如全局的 global 对象，也提供了当前进程信息的 Process 对象，操作文件的 fs 模块，以及创建 Web 服务的 http 模块等等。这些 API 能够让我们使用 JavaScript 操作计算机，所以我们可以用 Node.js 平台开发 web 服务器。

也有一些对象是 Node.js 和浏览器共有的，如 JavaScript 引擎的内置对象，它们由 V8 引擎提供。常见的还有：
- 基本的常量 undefined、null、NaN、Infinity；
- 内置对象 Boolean、Number、String、Object、Symbol、Function、Array、Regexp、Set、Map、Promise、Proxy；
- 全局函数 eval、encodeURIComponent、decodeURIComponent等等。

此外，还有一些方法不属于引擎内置 API，但是两者都能实现，比如 setTimeout、setInterval 方法，Console 对象等等。

## Node.js 的基本架构

![](https://p.ssl.qhimg.com/t01bdaf1234dcdbef5c.jpg)
_图片来源：[medium.com](https://medium.com/@chathuranga94/nodejs-architecture-concurrency-model-f71da5f53d1d)_

上图是 Node.js 的基本架构，我们可以看到，Node.js 是运行在操作系统之上的，它底层由 V8 JavaScript 引擎，以及一些 C/C++ 写的库构成，包括 libUV 库、c-ares、llhttp/http-parser、open-ssl、zlib 等等。

其中，libUV 负责处理事件循环，c-ares、llhttp/http-parser、open-ssl、zlib 等库提供 DNS 解析、HTTP 协议、HTTPS 和文件压缩等功能。

在这些模块的上一层是中间层，中间层包括`Node.js Bindings`、`Node.js Standard Library`以及`C/C++ AddOns`。`Node.js Bindings`层的作用是将底层那些用 C/C++ 写的库接口暴露给 JS 环境，而`Node.js Standard Library`是 Node.js 本身的核心模块。至于`C/C++ AddOns`，它可以让用户自己的 C/C++ 模块通过桥接的方式提供给`Node.js`。

中间层之上就是 Node.js 的 API 层了，我们使用 Node.js 开发应用，主要是使用 Node.js 的 API 层，所以 Node.js 的应用最终就运行在 Node.js 的 API 层之上。

## Node.js 可以做什么？

Node.js 是运行在操作系统中的 JavaScript 运行时环境，提供了一系列操作系统的 API，通过它们我们可以执行操作系统指令、读写文件、建立网络连接、调用操作系统中的其他服务等等。

Node.js 内置的模块比较丰富，常用的主要是以下几个。

- File System 模块：这是操作系统的目录和文件的模块，提供文件和目录的读、写、创建、删除、权限设置等等。
- Net 模块：提供网络套接字 socket，用来创建 TCP 连接，TCP 连接可以用来访问后台数据库和其他持久化服务。
- HTTP 模块：提供创建 HTTP 连接的能力，可以用来创建 Web 服务，也是 Node.js 在前端最常用的核心模块。
- URL 模块：用来处理客户端请求的 URL 信息的辅助模块，可以解析 URL 字符串。
- Path 模块：用来处理文件路径信息的辅助模块，可以解析文件路径的字符串。
- Process 模块：用来获取进程信息。
- Buffer 模块：用来处理二进制数据。
- Console 模块：控制台模块，同浏览器的Console模块，用来输出信息到控制台。
- Crypto 加密解密模块：用来处理需要用户授权的服务。
- Events 模块：用来监听和派发用户事件。

以上这些模块在后续课程中我们都会用到，这里咱们有个大概印象就行了。除此之外，Node.js 还有其他的模块，有兴趣的同学可以访问[Node.js官方文档](https://nodejs.org/dist/latest-v6.x/docs/api/http.html)查看这些模块的介绍。

除了上述核心模块外，Node.js 的社区生态也非常活跃，有大量的第三方模块可以使用，它们都可以用 NPM 包管理工具来安装，我们也会在后面的课程介绍一些。

话不多说，现在我们一起安装 Node.js 到我们的系统中，然后写一个小例子来体验一下 Node.js 的使用吧!

## 安装 Node.js

我们可以在 Node.js 官网 [https://nodejs.org](https://nodejs.org) 上下载适合我们操作系统的 Node.js。不论是 MacOS、Linux 系统还是 X86 或 64 位 windows 系统，都有对应的版本可以安装。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3b9879db87845c59370b3734b6dcf13~tplv-k3u1fbpfcp-watermark.image?)

这里有两个可以选择的版本，一个是 LTS 版本，叫做 Long Term Support 版，也就是官方推荐的比较成熟稳定的版本，目前是 16.16.0。另一个是 Current 版本，也就是当前发布的最新版，没有那么成熟，但是包含最多的新特性。

一般来说，如果要开发一个在线 Web 应用，为了稳定性通常**优先选择 LTS 版本**，我们的课程就选择这个版本。下载对应版本后，解压安装即可。安装完成后，打开命令行终端，执行命令 `node -v`，可以查看当前安装的 Node.js 的版本号。

```bash
$ node -v
v16.16.0
```

接下来，我们可以在命令行终端的任意目录下，创建我们 js 文件。我们先来尝试创建一个文件`ziyue.js`。编辑这个文件的内容如下：

```js
const template = (text) => `
                 __._                                   
                / ___)_                                 
               (_/Y ===\\                            __ 
               |||.==. =).                            | 
               |((| o |p|      |  ${text}
            _./| \\(  /=\\ )     |__                    
          /  |@\\ ||||||||.                             
         /    \\@\\ ||||||||\\                          
        /   \\  \\@\\ ||||||//\\                        
       (     Y  \\@\\|||| // _\\                        
       |    -\\   \\@\\ \\\\//    \\                    
       |     -\\__.-./ //\\.---.^__                        
       | \\    /  |@|__/\\_|@|  |  |                         
       \\__\\      |@||| |||@|     |                    
       <@@@|     |@||| |||@|    /                       
      / ---|     /@||| |||@|   /                                 
     |    /|    /@/ || |||@|  /|                        
     |   //|   /@/  ||_|||@| / |                        
     |  // \\ ||@|   /|=|||@| | |                       
     \\ //   \\||@|  / |/|||@| \\ |                     
     |//     ||@| /  ,/|||@|   |                        
     //      ||@|/  /|/||/@/   |                        
    //|   ,  ||//  /\\|/\\/@/  / /                      
   //\\   /   \\|/  /H\\|/H\\/  /_/                     
  // |\\_/     |__/|H\\|/H|\\_/                         
 |/  |\\        /  |H===H| |                            
     ||\\      /|  |H|||H| |                            
     ||______/ |  |H|||H| |                             
      \\_/ _/  _/  |L|||J| \\_                          
      _/  ___/   ___\\__/___ '-._                       
     /__________/===\\__/===\\---'                      
                                                        
`;

const argv = process.argv;
console.log(template(argv[2] || '有朋自远方来，不亦乐乎！'));
```

然后我们在控制台上，进入这个项目目录，运行 node 命令：

```bash
node ziyue.js
```

然后，我们就可以看到控制台上的输出内容了。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff3f026cebf8494780cc9ef421c041ee~tplv-k3u1fbpfcp-watermark.image?)

接下来，我们看一下上面这段代码做了什么。这个代码和浏览器的 JS 没有什么区别，我们定义了一个输出模板字符串的函数`template`，它接受一个`text`参数，然后用它解析模板字符串，最终通过`console.log`得到输出结果。

注意，我们的 console.log 中给 text 一个默认值，但是实际上还有一个`process.argv[2]`的变量，这个是做什么用的呢？

实际上，process.argv 可以获得命令行调用的信息，以空格分隔。所以，按照我们执行`node ziyue.js`的命令，这时候`process.argv`的值是数组`['node', 'ziyue.js']`，所以`process.argv[2]`的值是 undefined，结果就输出了默认值。

现在我们换一种方式调用：

```bash
node ziyue.js 三人行必有我师焉
```

得到如下输出。

![](https://p5.ssl.qhimg.com/t01b91ef85b28178989.jpg)

## 总结

Node.js 不是一种新语言而是一个平台，为 JavaScript 提供了浏览器之外的运行时环境。它提供了丰富的内置模块，包括 File System 模块、Net 模块、HTTP 模块、URL 模块、Process 模块等等。这些模块能够让 JavaScript 操作我们的计算机，建立 Web 服务器。

那这一节课，我们安装了 Node.js 并浅浅体验了它的基本用法，在后续的课程中，我们将深入了解 Node.js 的更多使用场景和使用方法。

需要注意的是，除了一部分 API 不同以外，Node.js 和浏览器有一个比较大的差别，那就是 Node.js 默认是模块化的。下一节课，我们就将介绍 Node.js 非常重要的模块管理机制，并学习如何加载和调用模块。
