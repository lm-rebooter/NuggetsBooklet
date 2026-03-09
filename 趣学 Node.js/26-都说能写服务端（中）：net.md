要能写服务端，还有一个必不可少的能力就是网络通信的能力。Node.js 自然也提供了相关的能力——`net` 模块。遇事不决看文档，关于 `net` 模块，Node.js 文档是这么说的：

> The `node:net` module provides an asynchronous network API for creating stream-based TCP or [IPC](https://nodejs.org/dist/latest-v18.x/docs/api/net.html#ipc-support "https://nodejs.org/dist/latest-v18.x/docs/api/net.html#ipc-support") servers ([net.createServer()](https://nodejs.org/dist/latest-v18.x/docs/api/net.html#netcreateserveroptions-connectionlistener "https://nodejs.org/dist/latest-v18.x/docs/api/net.html#netcreateserveroptions-connectionlistener")) and clients ([net.createConnection()](https://nodejs.org/dist/latest-v18.x/docs/api/net.html#netcreateconnection "https://nodejs.org/dist/latest-v18.x/docs/api/net.html#netcreateconnection")).

简而言之，就是流式 TCP、IPC 的服务端和客户端相关的异步 API 合集。

TCP 与 IPC
---------

### TCP

TCP（Transmission Control Protocol）全称是“传输控制协议”，是一种确保数据准确无误地从一个地方传输到另一个地方的协议，也是互联网上最常用的一种协议。你可以将其视为一种互联网通信规则的集合，它确保了我们的电脑、智能手机和其他设备之间的信息传输顺畅和准确。

想象一下，你正在打电话给朋友。你希望你的每一句话都能完整准确地传达给你的朋友，而不会丢失任何单词，不论你是在安静的房间还是嘈杂的街道上。TCP 在网络世界中就是这样的角色。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65c3d127e1e84158872629bd881d4410~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=240&h=240&s=34890&e=png&b=fcfcfc)

当你从一台电脑向另一台电脑发送信息时，TCP 会确保信息被分割为小块，然后安全地通过互联网传输。每个小块信息都有标签，所以它们可以在到达目的地后重新组装成完整的信息。而且，如果有任何信息块在传输过程中丢失，TCP 还会要求重新发送。于是你可以将它想象成一种快递员的工作流程。

想象一下，你想要寄一堆书给你的朋友，但是书太重了，你无法一次性把它们装进一个箱子寄出去。因此，你决定把书分成几个包裹，每个都有自己的地址标签和顺序号码。这就像 TCP 把数据分成不同的包（称为数据包）。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c54d19f95f4446e58fde8e40c06b5cf0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=194&h=259&s=30871&e=png&b=fdfdfd)

快递员则负责确保所有的包裹都准确无误地到达你朋友的地址。如果有包裹在路上丢失，快递员会重新寄送丢失的包裹。如果包裹到达的顺序乱了，你的朋友可以根据包裹上的顺序号码重新排列它们。这就像 TCP 确保数据的准确性和顺序性。

TCP 的封包和解包操作是在传输层进行的。在编程界面，大多数情况下，开发者不需要直接处理 TCP 的封包和解包。这是由操作系统中的 TCP/IP 协议栈处理的。然而，开发者需要关心的是如何使用 TCP 来实现可靠的、面向连接的数据传输。他们需要创建和管理 TCP 连接，以及正确处理 TCP 的错误。

Node.js 中的 `net` 自然也不需要关心到那么底层，只需要创建、管理连接，发送、接收数据，以及处理错误就好了。

#### TCP 与 Socket 的关系

在计算机网络的语境中，TCP 是一种网络协议，定义了数据如何在网络中被打包、发送、接收和解包，以确保数据可靠地从一个地方传输到另一个地方。这是一种可靠的、面向连接的协议。

而 Socket 是网络编程中的一个抽象概念，可以看作是应用程序和网络协议（如 TCP）之间的接口。它提供了一个编程接口，让应用程序能够使用网络协议进行数据的发送和接收。通过 Socket，应用程序可以创建网络连接，发送和接收数据。

在使用 TCP 协议进行网络编程时，你会创建一个 Socket，这个 Socket 相当于是 TCP 连接的一个端点。在建立连接后，你可以使用这个 Socket 发送数据（这些数据会被 TCP 协议打包成数据段），或者接收数据（这些数据是 TCP 协议从接收到的数据段中解包出来的）。这就是 TCP 和 Socket 之间的关系。

### IPC

IPC（Inter-Process Communication）全称是“进程间通信”，你可以将它想象成公司同个工区内的不同部门之间的通信方式。

假设工区中包含不同部门的员工，每个部门都有特定的任务。但他们的工作又不是孤立的，需要彼此合作才能完成一些大型项目。比如产品经理提需求，研发人员怼回去，最后怼不过还是要开发。这就是进程间的通信。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/807bdca82a52468282afbd5cc51054ab~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=250&h=250&s=31559&e=png&b=fdfdfd)

这些部门间通信可以通过电子邮件、电话会议、即时消息等方式进行，甚至是人肉沟通，就像电脑中的不同进程使用文件、信号、消息队列、管道等方式进行 IPC。

IPC 可以通过许多不同的技术实现，每种技术都有其自己的优点和缺点，适用于不同的场景。以下是一些常见的 IPC 实现方式：

1.  **管道（** **Pipe** **）：** 管道是最古早的 IPC 形式之一，主要用于父子进程之间的通信。数据流动是单向的，从一个进程的输出到另一个进程的输入；
    
2.  **命名管道（Named** **pipe** **）：** 也被称为 FIFOs，它是管道的一个变种，可以在不相关的进程之间使用；
    
3.  **信号（Signal）：** 信号是一种在 Unix 和类 Unix 系统（如 Linux）中用于通知进程某事件已经发生的机制；
    
4.  **消息队列** **（** **Message Queue** **）：** 消息队列允许进程以消息的形式发送数据。每条消息都有一个类型，接收进程可以根据类型接收消息；
    
5.  **共享内存（Shared Memory）：** 共享内存允许多个进程访问同一块内存区域。它是一种非常快的 IPC 方法，但需要在进程之间同步访问；
    
6.  **套接字（Sockets）：** 套接字可以在同一台机器的进程之间，或者在不同机器的进程之间进行通信。它是一种非常通用的 IPC 形式，支持 TCP、UDP 等多种协议；
    
7.  **信号量（Semaphore）：** 信号量主要用于控制对共享资源的访问，保证进程之间的同步；
    
8.  **文件（File）：**（没想到吧）虽然文件系统通常不被认为是 IPC 机制，但文件确实可以用于进程间通信，尤其是持久化数据时。
    

### `net` 与 TCP 和 IPC 的关系

`net` 的底层用的就是 Socket 去创建 TCP 的客户端与服务端。而 `net` 同时也支持 Unix Domain Socket，所以它是通过 Unix Domain Socket 来支持 IPC 的。在 Windows 下，则是用命名管道来支持 IPC 的。

UNIX Domain Socket（UDS）是一种在同一台机器上的进程之间进行通信的机制。其使用文件系统中的路径名作为标识，因此只能在同一台机器上的进程之间进行通信，不能用于跨机器的通信。

UDS 文件并不是一个常规意义上的文件，你不能像对待普通文件那样读写它。它更像是一个通信端点的标识符，可以被用来创建和接收连接。这同样体现了 Linux 的“万物皆文件”的设计哲学。

`net` 模块
--------

Node.js 的 `net` 模块主要实现了 TCP 和 UNIX Domain Socket 的客户端和服务端。其底层使用了 libuv 的相关能力：

*   TCP：[uv\_tcp\_t](https://docs.libuv.org/en/v1.x/tcp.html "https://docs.libuv.org/en/v1.x/tcp.html") 相关 API；
*   UNIX Domain Socket：[uv\_pipe\_t](https://docs.libuv.org/en/v1.x/pipe.html "https://docs.libuv.org/en/v1.x/pipe.html") 相关 API。

`uv_tcp_t` 和 `uv_pipe_t` 都是 `uv_stream_t` 的“子类”（这只是概念、语义上的子类，并不是实现上的子类，毕竟 C 语言没有类的概念）。前者负责处理 TCP 的信息，后者负责处理 UNIX Domain Socket 信息。而 `uv_stream_t` 的子类则都可以用同一批函数进行操作，其中包括读、写等。

在 Node.js 中，有两个类：`TCPWrap` 和 `PipeWrap`，分别是对 `uv_tcp_t` 和 `uv_pipe_t` 的高级封装。这两个类中都有实现的函数有：

*   `.bind()`
*   `.listen()`
*   `.connect()`
*   `.open()`

### 客户端 `Socket`

我们以 `net.connect()` 举例，它的原理是构造一个 `Socket` 对象，并调用它的 `.connect()` 函数，最后返回这个 `Socket` 对象。

    function connect(...args) {
      // 合法化 `...args` 参数，并拿到 `options`
      const normalized = normalizeArgs(args);
      const options = normalized[0];
    
      // 构造 `Socket` 对象
      const socket = new Socket(options);
    
      ...
    
      // 调用 `socket.connect()`，该函数返回 `socket` 本身
      return socket.connect(normalized);
    }
    

决定这个 `socket` 对应的究竟是 `TCPWrap` 还是 `PipeWrap` 的逻辑就在 `socket.connect()` 中。

    Socket.prototype.connect = function(...args) {
      // 拿到 `options`，不用细究
      let normalized;
      if (ArrayIsArray(args[0]) && args[0][normalizedArgsSymbol]) {
        normalized = args[0];
      } else {
        normalized = normalizeArgs(args);
      }
      const options = normalized[0];
      
      ...
    
      // 如果 `options` 中有 `path` 则认为是 `pipe`
      const { path } = options;
      const pipe = !!path;
    
      // 若之前没有构造过 `_handle`，则在此构造
      if (!this._handle) {
        this._handle = pipe ?
          new Pipe(PipeConstants.SOCKET) :
          new TCP(TCPConstants.SOCKET);
        initSocketHandle(this);
      }
      
      ...
      
      // 如果是 `pipe`，则调用 `internalConnect()`，否则调用后者
      if (pipe) {
        internalConnect(this, path);
      } else {
        lookupAndConnect(this, options);
      }
      
      return this;
    }
    

这段 JavaScript 代码中，`Pipe` 就是 C++ 侧的 `PipeWrap`，`TCP` 就是 C++ 侧的 `TCPWrap`。

所以在 `net` 的 `Socket` 对象中，实际上核心能力是通过 `_handle` 字段提供的，而该字段根据连接时传进来的是文件路径（UNIX Domain Socket）还是其它诸如地址、端口这类信息，来决定其底层是 `PipeWrap` 还是 `TCPWrap`。该俩 Wrapper 在一定程度上是拥有相同的接口的，就是为了方便 `Socket` 的各种方法使用。

在上面代码的最后，如果是 `pipe` 即 UNIX Domain Socket，则走 `internalConnect()`，在该函数内部会调用 `this._handle.connect()` 进行连接；而如果不是，则走 `lookupAndConnect()`。顾名思义，先通过 DNS 查找出 IP 地址，再进行连接，实际上内部逻辑就是这样的，找到 IP 地址后，再调用 `internalConnect()` 进行连接。

我们把目光放回到[第 25 章](https://juejin.cn/book/7196627546253819916/section/7197302540655362081 "https://juejin.cn/book/7196627546253819916/section/7197302540655362081")，有这么一段话：

> 在 Node.js 中，很多网络请求相关的 API 内部就是通过 `dns.lookup()` 来将主机名转换成 IP 后再请求出去。

这段话指的就是这个 `lookupAndConnect()` 了。里面的逻辑大致如下：

![27 流程图 1.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdb1ce87848843439f97cac5faaffb36~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1578&h=1340&s=229033&e=png&b=ffffff)

你看起来传给 `net.connect()` 是个域名，实际上里面已经过了一道 `dns` 了。而在 `internalConnect()` 中，实际上也是一些分叉逻辑进行适配。

![27 流程图 2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/330e88f9dc0c4d2196b933b3b0d960f1~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1568&h=1328&s=213478&e=png&b=fefefe)

### 服务端 `Server`

其实服务端 `Server` 类里面实现的大概分支也与客户端差不多。也是若是个文件路径，则使用 `PipeWrap`，否则使用 `TCPWrap` 作为 `_handler`。并在 `listen` 的时候通过 `_handler.bind()` 和 `_handler.listen()`（这两个方法在前面列过，是 `PipeWrap` 和 `TCPWrap` 都有的方法）进行监听。

> 在网络编程中，`bind` 和 `listen` 都是创建服务端的重要步骤，而且都是 POSIX 中 Socket 下的能力。
> 
> *   **`bind`：** 将服务端的 Socket 与一个特定的 IP 地址及端口号进行关联。例如我们想要在 `192.168.2.233` 的 `2333` 端口进行监听，就需要将这个 IP 地址和端口号绑定到对应的 Socket 上。之后只有发送至这个 IP 的端口和网络请求才会被其接受（发送给 `127.0.0.1` 的 `2333` 则不行）。
> *   **`listen`：** 一旦 Socket 被绑定到一个 IP 地址和端口号上，服务端需要监听这个套接字以接受客户端过来的连接请求。`listen` 函数会将 Socket 转换为被动模式，使其可接受来自客户端的请求。
> 
> UNIX Domain Socket 与 TCP 类似。`bind` 绑定的是 Socket 与文件路径，若已有其它文件或者 Socket 使用了该路径则会绑定失败；`listen` 同样是将 Socket 转换为被动模式，开始监听。
> 
> 所以在 TCP 和 UDS 编程中，通常步骤都是先创建一个 Socket，然后通过 `bind` 绑定 IP 端口或者文件路径，最后通过 `listen` 进行监听。

在 Node.js 的 `net` 中，我们只需要对创建出来的 `Server` 对象进行 `listen` 就行了，对 `TCPWrap` 和 `PipeWrap` 的 `bind()` 与 `listen()` 操作已经在 Node.js 的 JavaScript 一次性都做掉了。在 `Server` 的 `listen()` 函数中，如果是主进程，则会开始真正的监听。这个时候有两个比较重要的步骤：

1.  通过 `createServerHandle()` 为 `Server` 对象创建 `_handle` 字段；
    
2.  调用 `_handle.listen()` 进行监听。
    

而 `createServerHandle()` 里面的逻辑就是根据参数决定创建 `TCPWrap` 或者 `PipeWrap`，并对相应 IP 端口或者路径进行 `bind()` 操作。

![27 流程图 3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5b6a45470eb4f20a2b08dc5d1d316c5~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1428&h=1408&s=278502&e=png&b=fefefe)

其中在构造出 `Pipe` 或者 `TCP` 后，无论是 IPv4 还是 UNIX Domain Socket，都只要调用 `handle.bind()` 即可。所以在这段逻辑中只需要判断是否是 IPv6 就可以了。

我们回到前面一段话：**如果是主进程，则会开始真正的监听。** 注意这里有一个“如果是主进程”。这是一个 Node.js 面试中经常会被问到的问题：Node.js 在 Cluster 模式下，监听端口是怎么监听的？

那么上面加粗的那段话，就是对于这个问题回答的第一句话。如果是主进程，则开始真正的监听，而逻辑就是上面那张流程图中画的一样，构造出对应的 `handle` 对象，并对其进行 `bind()` 且 `listen()`。如果是非 Cluster 模式，只有一个进程，走的也是这个逻辑。

    if (cluster.isPrimary || exclusive) {
      // 走上面流程图中的逻辑
      return;
    }
    

> 这里的 `exclusive` 是 `listen()` 中 `options` 参数中的一个字段，用于让子进程进行强制的真实监听。更多信息可以参考 [Node.js 的官方文档](https://nodejs.org/dist/latest-v18.x/docs/api/net.html#serverlistenoptions-callback "https://nodejs.org/dist/latest-v18.x/docs/api/net.html#serverlistenoptions-callback")。

而在子进程且非强制真实监听的时候，走的是另一种模式：与主进程有一条 IPC 通道，且主进程监听来信息的时候，通过该通道发送给子进程，造成子进程以为是从远端发过来信息的假象。实际上是由主进程做了一层代理。

而这里的 IPC 通道，实际上也是一个 `Socket` 对象，`handler` 也是一个 `PipeWrap`。只不过它不再是一个 UNIX Domain Socket，而是纯的父子进程之间的通信了——通过一个预设的 `fd`。

这里面的逻辑错综复杂，弯弯绕绕，抽象层次多，涉及面广。篇幅所限，具体代码就不解析了，大家有兴趣可以自己尝试阅读源码。

本章小结
----

本章为大家补习了 TCP 与 IPC 的基础知识，以及与 Socket 的关系。并为大家盘了 Node.js 中 `net` 模块的一些基本原理。其底层用的是 libuv 的相关 API，再到底层，就都是些 POSIX 相关的接口了。大家有兴趣可以阅读一些 POSIX 网络编程的资料，会更有理解度一些。