> 前段时间业余时间一直赖在医院了，所以断更了一段时间，真的非常不好意思。

Node.js 出来之后，除了现在的大前端工具链之外，还有一个举足轻重的能力，就是可以让大家可以用它来写 HTTP 服务端。社区上层出不穷的框架，Express、Koa、Egg.js、Midway.js 等等，基本上都是围绕 HTTP 服务端做的。偶尔出一些 RPC 能力的插件，也都不是其主要路线——主要除了 HTTP 之外，RPC 的协议不尽相同，不同公司也不一样，很难做统一。所以在社区来说，HTTP 基本上是唯一的解了，而且直面用户侧来说，HTTP 也都是浏览器唯一认的协议。

**HTTP（不同版本）**

**常用的** **RPC**

HTTP/1.0

JSON-RPC

HTTP/1.1

gRPC

HTTP/2.0

Apache Thrift

HTTP/3.0

Dubbo

其实上面这张表格有一个不易被察觉的“误区”。实际上这两列并不能并列——HTTP 与 RPC 之间的关系与对比是相对复杂的，因为它们是不同层级和类别的概念。HTTP 是一个比较低级的协议，它处理的是如何在互联网上发送和接收数据包；而 RPC 则处理的是更高层次的抽象，即如何调用远程函数或方法，传递参数和获取结果。而 RPC 也有可能是基于 HTTP 进行传输的，比如 JSON-RPC，就是定义数据都以 JSON 格式传输，但是底下的协议可以是用 HTTP 或 HTTPS 进行的，也可以是其它一些网络传输协议。

本章说的是 Node.js 中的 HTTP 服务端相关内容，就不赘述 RPC 了。

经典八股题
-----

**我们先来一道最经典的面试题：当在浏览器中输入网址敲下回车后，到底会发生什么？**

这其实是一道烂俗得不能再烂俗的八股题了，它其实并没有标准答案，而是针对不同岗位的同学会有不同的侧重。比如面向前端同学，它可能更想听到的是偏浏览器侧的一些行为、优化，比如浏览器侧缓存、JavaScript 时序、渲染等等的内容，而对于网络请求侧，稍微模糊一点带过也问题不大；而面向后端同学，通常更想听到的答案是前面一系列流程，然后到服务端后，几次握手，如何负载均衡，如何分布式等等等等。

我也不回答这个八股，反正也没标准答案。我就挑跟本小册相关的一些重点讲。首先浏览器发起 DNS 查询，这个会用到各种缓存，比如浏览器缓存、操作系统缓存、路由器缓存等等，然后才会有对 ISP 或者自定义 DNS 服务器发起 DNS 查询——这个操作其实我们之前讲的 DNS 那章中，Node.js 发起网络请求也会有类似的操作，只是没那么多弯弯道道缓存罢了——总归用域名（主机名）访问某个地址之前，肯定会有一道 DNS 查询。有相关侧重的题目就可以着重讲讲这一道浏览器侧的行为，没有特别侧重的，随便糊弄两句就够了。

当浏览器获取到服务器的 IP 地址后，它会使用 TCP 与服务器建立一个连接，然后通过该连接发送 HTTP 请求（Request）。

> 注意这里的 TCP，就是我们上一章 `net` 中讲到的。所以 HTTP 模块是继承自 `net` 相关模块继续写的。

建立 TCP 的过程中，就是老生常谈的“三次握手”了，这不是本章的重点，大家尚不了解的，可自行网上搜索学习。一旦 TCP 连接建立，浏览器就会通过这个连接发送一个 HTTP 请求。一个 HTTP 的请求是按某种格式约定好的“字符串数据”。这么说是为了让大家好理解，并不是传输的真的是“字符串”。不过在早期的 HTTP 还真的只能传 ASCII 字符。

服务端（比如 Nginx、Node.js 或是更长的负载均衡链路）接收到这些数据之后，会进行服务端的逻辑计算和处理，最终返回一个 HTTP 响应（Response）数据，这个数据也是按某种格式约定好的“字符串数据”，浏览器会根据其来渲染结果。

接下去如果不是 keep-alive 头，那就“四次挥手”断开连接了。“四次挥手”也不是本章重点，大家可自行了解。

如果是 HTTPS，那么在上述过程之前还有一个 TLS 握手过程，用于在浏览器和服务器之间建立一个加密的连接。这涉及到证书验证、密钥交换等的加密算法。

那么问题来了，所谓的“字符串数据”究竟长什么样呢？一个“请求”的数据分为三部分：

1.  **请求行**，内含：
    
    *   **方法：** HTTP 请求的方法，如 `GET`、`POST`、 `PUT`、`DELETE` 等；
        
    *   **URI** **绝对路径：** 请求的资源的路径，例如 `/index.html`；
        
    *   **协议版本：** HTTP 使用的版本，例如 `HTTP/1.1`。   
        
        如：
        
            GET /index.html HTTP/1.1
            
        
2.  **请求头：** 包含了一系列描述请求或客户端本身信息的键值对，一行一对。每个头部都是一个键值对，键和值之间用冒号 `:` 分隔，如：
    
          Host: www.example.com
          User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36
          Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
          Accept-Language: en-US,en;q=0.5
          Connection: keep-alive
          ```
        
        
    
3.  **请求体：** 包含了需要发送给服务器的数据。不是所有的 HTTP 请求都有请求体，例如，常见的 `GET` 请求就不包含。但是，如 `POST` 和 `PUT` 这类需要上传数据的请求通常会包含请求体。如下方就是一个 JSON 格式的请求体：
    
          {
            "username": "john",
            "password": "123456"
          }
          ```
        
        
    

> 理论上请求体可以是任意内容，比如有一些基于 HTTP 的 RPC 协议中，请求体就会是序列化之后的参数二进制数据。但在浏览器和服务端中会有一些“约定俗成”的“君子协议”。例如，如果请求头中的 `Content-Type` 值为 `application/json`，就相当于告诉服务端，我的请求体是 JSON 格式的；又比如通常我们通过 `<form>` 表单提交的 POST 数据，浏览器通常会将 `Content-Type` 设置为 `application/x-www-form-urlencoded`，请求体则是以类似 Query String 的方式出现。

值得注意的是，在请求头和请求体之间，会有一个空行分割。也就是说，如果服务端接收到来自客户端的 HTTP 请求后，需要逐字节解析内容。第一行是请求体，方法、URI、版本号以空格分割；第二行往后是请求头，以 `:` 分割；若遇到两个换行符 `\n`，则认为后续的就是请求体了。

HTTP 的历史与版本
-----------

### HTTP/0.9

HTTP/0.9 是 HTTP 协议的最早版本，可以认为是该协议的“原始”形态。它诞生于 1991 年，由 Tim Berners-Lee 在欧洲核子研究组织（CERN）创造。这也是 World Wide Web 项目的开始。

当初的目的是提供一个简单的协议来允许文档之间进行超链接，所以 HTTP/0.9 的设计极为简化。它只支持 GET 请求，只能返回纯文本 HTML，没有 HTTP 头，也没有状态码。

第一个 Web 服务器是由 Tim Berners-Lee 在 NeXT 计算机上运行的，用于托管关于 World Wide Web 项目的信息。那时，许多人第一次通过浏览器访问该服务器，使用的就是 HTTP/0.9 协议。

### HTTP/1.0

随着 Web 的迅速增长和应用的增加，HTTP/0.9 的限制变得越来越明显，因此需要一个更加灵活和强大的协议版本。这就导致了 HTTP/1.0 的诞生。HTTP/1.0 在 1996 年作为 [RFC 1945](https://datatracker.ietf.org/doc/html/rfc1945 "https://datatracker.ietf.org/doc/html/rfc1945") 正式发布。

相对于前一版本，HTTP/1.0 带来了一系列的改进。首先，除了原来的 `GET` 方法，它引入了新的方法，如 `POST` 和 `HEAD`。其次，HTTP/1.0 引入了请求和响应头部，这允许客户端和服务器传递更多的信息。例如，客户端可以通过 `User-Agent` 头告诉服务器它使用的浏览器类型，而服务器可以通过 `Content-Type` 头告诉客户端响应的内容类型。此外，HTTP/1.0 还定义了一系列的状态代码，用于表示请求的结果，如 `200` 表示请求成功，`404` 表示请求的资源未找到。此版本也开始支持多种内容类型，如文本、图像、视频等。在连接管理方面，尽管 HTTP/1.0 默认使用短连接（即每次请求后断开连接），但它引入了一个可选的 `Keep-Alive` 头部，用于维持连接，这个就是我们先前说的，如果不维持连接，响应结束后就会“四次挥手”断开。

### HTTP/1.1

HTTP/1.0 也存在一些问题和局限性。一个明显的问题是效率。尽管存在 `Keep-Alive` 头，但大多数 HTTP/1.0 请求仍然使用单次连接，导致每次请求都需要建立新的 TCP 连接，这在高延迟网络中会引入明显的开销。另一个问题是无状态性。HTTP/1.0 本身是无状态的，这意味着每次请求都是独立的，服务器不能记住前一个请求的信息。

所以在 1997 年，HTTP/1.1 来了，解决了 HTTP/1.0 中的许多问题。是目前 Web 最主流的协议版本。

其中最显著的变化是持久连接的默认启用。在 HTTP/1.0 中，每次请求后连接都会被关闭，而在 HTTP/1.1 中，多个 HTTP 请求和响应可以在同一个 TCP 连接上连续发送。这大大减少了由于频繁建立和关闭连接而产生的开销，使得网络通信更加高效。

当然，上面这个只是“RFC 定义”，是让实现者（HTTP 客户端，比如浏览器）去遵守的——浏览器会在这一趴进行链接复用。但是如果客户端不遵守，你也不能拿它怎么样，最多骂一句“你不符合标准”。这里希望大家能明白“标准”与“现实”。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80ac9ac8ccb04c86967cd8ddb442dfaf~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=690&h=690&s=161612&e=png&b=fefefe)

在此版本中，HTTP 还增加了如 `OPTIONS`、`PUT`、`DELETE` 和 `TRACE` 等新的方法，赋予了 HTTP 更多的功能。同时，缓存控制也得到了增强，新引入的头如 `ETag` 和 `Cache-Control` 使得缓存管理变得更为精确。

考虑到虚拟主机的应用，HTTP/1.1 强制要求所有的请求都必须包含 `Host` 头部。因为一个 IP 地址现在可以对应多个域名，通过 `Host` 头部，服务器可以知道客户端请求的确切域名，从而提供相应的内容。如果你在浏览器中访问 [juejin.cn](http://juejin.cn "http://juejin.cn") ，实际上是访问 DNS 查出来的 [juejin.cn](https://juejin.cn/ "https://juejin.cn/") 对应的 IP，并发送 HTTP 请求，且设置请求头的 `Host` 为 `juejin.cn`，以此来让服务端知道自己访问的是什么域名。

尽管 HTTP/1.1 带来了许多优势，但随着网络技术的发展，人们逐渐意识到它在性能和并行处理方面存在的局限性。这些问题在后来的 HTTP/2 和 HTTP/3 版本中得到了进一步的解决。

### HTTP/2 与 HTTP/3

HTTP/2 的设计基于 Google 的 SPDY 协议，主要是为了解决 HTTP/1.1 在性能上的局限性。其核心优势在于实现了多路复用，允许在一个单一的 TCP 连接中**并行发送**多个请求和响应（HTTP/1.1 中的 keep-alive 是串行复用）。这大大降低了因为多次建立连接所带来的开销和延迟，使得连接可以被充分利用。HTTP/2 使用二进制格式（HTTP/1.1 是人肉可读的文本格式），这使得协议的解析和实现更加高效。

HTTP/3 是基于一个全新的、名为 QUIC 的传输协议，这个协议是基于 UDP 构建的。最显著的好处是，HTTP/3 通过采用 QUIC，继承了其在并行传输、低延迟连接建立以及在不稳定网络环境中的高性能特点。QUIC 默认采用了 TLS 1.3 加密，为用户提供了强化的安全性。

本章中，我们主要介绍 HTTP/1.1 相关内容，这里就不赘述了。大家若对 HTTP/2、HTTP/3 感兴趣，可自行上网搜索学习相关内容。

Node.js 中的 HTTP 服务端
-------------------

我对密码学不熟，HTTPS 的内容就不讲了。这里我们专注讲 HTTP。在 Node.js 写一个 HTTP 服务特别简单：

    const http = require('http');
    
    const server = http.createServer((req, resp) => {
      resp.writeHead(200, { 'Content-Type': 'application/json' });
      resp.end(JSON.stringify({
        data: 'Hello World!',
      }));
    });
    
    server.listen(8000); 
    

先用 `http.createServer()` 来创建一个 HTTP 服务端，回调函数会在接收到一个 HTTP 请求时被触发。`req` 是接收到的请求，`resp` 是将要操作的响应。

这个例子中，先往响应中写响应行和响应头。其中响应行的状态码为 `200`，响应头就一个 `Content-Type`。然后再往响应中写入响应体，是一段 JSON 字符串：`{"data":"Hello World!"}`。

有了“HTTP 服务端”实例后，将它监听至 `8000` 端口，以接受请求。

### HTTP 服务端实例

`http.createServer()` 里面就是返回一个 `new Server()`。这个 `Server` 就是 HTTP 的服务端类了。我们看看 [`Server` 怎么写的](https://github.com/nodejs/node/blob/v18.17.1/lib/_http_server.js#L506 "https://github.com/nodejs/node/blob/v18.17.1/lib/_http_server.js#L506")：

    function Server(options, requestListener) {
      ...
      net.Server.call(this, { ... });
      ...
    }
    
    ObjectSetPrototypeOf(Server.prototype, net.Server.prototype);
    ObjectSetPrototypeOf(Server, net.Server);
    
    ...
    

活生生把 `Server` 继承自 `net.Server`。为什么？因为 `net.Server` 是指 TCP 服务端呀，而 HTTP/1.1 来说，就是基于 TCP 的。

### 接受流量

我们先来看看，在 `net` 的 `Server` 中，用户侧是如何监听端口，以及处理来的数据的。这是一个最简单的 Echo Server 例子。

    const net = require('net');
    

然后创建一个服务端对象。

    const server = net.createServer(socket => {
      console.log('客户端已连接');
    

在这个回调函数中，就表示有客户端与之建立了连接。接下去就监听客户端的 `data` 事件，以接受从客户端传过来的数据。

      socket.on('data', data => {
        console.log(`收到数据：${data}`);
    

既然是 Echo Server，我们把传过来的数据原封不动地传回给客户端。

        socket.write(data);
      });
    

然后监听客户端断开事件。

      socket.on('end', () => {
        console.log('客户端已断开连接');
      });
    

错误事件。

      socket.on('error', (error) => {
        console.error(`发生错误: ${error}`);
      });
    });
    

最后，得到的这个 `server` 对象监听一个端口就可以了。

    server.listen(8080, () => {
      console.log('服务器启动在 8080 端口');
    });
    

启动这个程序后，我们就可以尝试使用 `nc` 或者 `telnet` 去连接上去看看了。

> 关于 `nc` 或者 `telnet` 程序，大家可自行网上搜索。

#### 自己写一个服务端

既然知道了 HTTP 协议和简单原理，我们可以自己动手基于 `net` 模块打造一个 HTTP 服务端了。首先我们知道，当客户端建连后，会给我们发送 HTTP 请求，其请求格式在前面提过了。所以我们需要改造的就是 `socket` 的 `data` 事件。为了写着简单，我们不走效率的状态机，也不考虑各种边界条件，仅给大家作示范。

首先还是 `net.createServer()`。

    const server = net.createServer(socket => {
      console.log('客户端已连接');
    

当浏览器过来建立连接时，我们为这个连接准备一些变量，后面会用到。

      let lines = [];
      let received = '';
      let method;
      let url;
      let version;
      let headers = {};
    

为了方便处理，我们把传输时开发者侧的编码改为 `utf8`，这样数据就能直接当字符串处理了（实际上线上得按二进制来，毕竟请求体响应体还是会有二进制内容的）。

      socket.setEncoding('utf8');
    

下一步，监听从 `socket` 过来的数据。

      socket.on('data', data => {
    

由于 HTTP 的数据是流式传播的，所以数据不一定是一次性传输完毕，所以我们每次收到一坨数据的时候，先跟 `received` 进行拼接，然后按 `\r\n`（HTTP 协议中的行分隔符是 CRLF）进行分割。由于最后一段数据不一定有 `\r\n`，所以我们先留着最后一段继续放在 `receiced` 中跟后续数据进行拼接，前面分割好的数据扔进 `lines` 数组中。

        const splited = received.split('\r\n');
        lines.push(...splited.slice(0, -1));
        received = splited.slice(-1)[0];
    

如此一来，`lines` 中会逐步推入每一行数据。刚开始传输的时候，我们的 `method` 肯定是空的，因为这些数据是在请求的第一行请求行中得到。所以我们判断一下如果 `lines` 中有数据了，且 `method` 还为赋值，则把第一行进行拆解，赋值给 `method`、`url` 和 `version`。这里为了简化逻辑，我们只接受 `GET` 的 `HTTP/1.1` 的请求。毕竟如果需要接受 `POST` 等请求，我们还需要解析 `Content-Length` 来获取请求体的长度，然后再按请求体长度去获取后面的请求体数据，作为教程来说有些许麻烦和浪费篇幅。

        if (!method && lines.length) {
          ([ method, url, version ] = lines[0].split(' '));
          if (method !== 'GET') {
            socket.write('HTTP/1.1 405 Method Not Allowed\r\n\r\n', () => {
              socket.end();
            });
            return;
          }
    
          if (!url.startsWith('/')) {
            socket.write('HTTP/1.1 400 Bad Request\r\n\r\n', () => {
              socket.end();
            });
            return;
          }
    
          if (version !== 'HTTP/1.1') {
            socket.write('HTTP/1.1 400 Bad Request\r\n\r\n', () => {
              socket.end();
            });
            return;
          }
        }
    

上面的代码中，我们做了判断，如果请求不是 `GET`，则往客户端写回请求：

    HTTP/1.1 405 Method Not Allowed
    

注意后面有两个空行。第一个空行表示响应体结束，后面是响应头；第二个空行则表示响应头结束，后面是响应体。在这个例子中，我们没有响应头，所以连着来两个空行。没有响应体，所以第二个空行后面没有任何数据。

> HTTP/1.1 的响应与请求类似，都分为三个部分。只不过响应的第一行是响应行，并非请求行。响应行格式为 HTTP 版本号、HTTP 状态码以及 HTTP 状态码所对应的语义。

最后，如果分割数据并且写回 `received` 的数据是个空字符串，就说明这是由一个空行所切割出来的结果。连着两个空行就代表着请求头结束了。由于我们的例子中不可能存在请求体，所以当请求头结束后我们可以开始处理这个 HTTP 请求了。

        if (received === '') {
    

从 `lines` 第二行开始，就都是我们的请求头。每一行我们都用 `:` 切割一下，得到请求头的键值对，加入 `headers` 中。

          for (let i = 1; i < lines.length; i++) {
            const [ key, value ] = lines[i].split(': ');
            headers[key] = value;
          }
    

然后根据这些数据构造出我们所需要返回给用户的 JSON 字符串。

          const body = JSON.stringify({ method, headers, url });
    

构造出我们的响应数据。

          const output = [
            'HTTP/1.1 200 OK',
            'Content-Type: application/json',
            `Content-Length: ${Buffer.byteLength(body)}`,
            '',
            body,
          ].join('\r\n');
    

最后，我们把这个数据写回给客户端，浏览器就可以收到我们的 JSON 输出了。

          socket.write(output);
    

最后的最后，还记得我们说的 HTTP/1.1 默认是 Keep-Alive 的吗？比如我们现在用 Chrome 来做请求，连接是会被复用的。一个请求结束后，Chrome 并不会断开这个连接，而是下次有相同 IP 端口的请求时，继续往这个连接写入请求、得到请求。

所以，当我们写完数据给客户端后，需要清空状态，以新的状态迎接下一个请求。

          lines = [];
          received = '';
          headers = {};
          method = '';
    

然后还是一些扫尾处理和监听。

      socket.on('end', () => {
        console.log('客户端已断开连接');
      });
      socket.on('error', (error) => {
        console.error(`发生错误: ${error}`);
      });
    });
    
    server.listen(8080, () => {
      console.log('服务器启动在8080端口');
    });
    

当你在本地跑起上面这段代码后，用浏览器访问 [http://127.0.0.1:8080](http://127.0.0.1:8080 "http://127.0.0.1:8080") ，你就能看到这样的输出了：

    {
      "method": "GET",
      "headers": {
        "Host": "127.0.0.1:8080",
        "Connection": "keep-alive",
        "Cache-Control": "max-age=0",
        "sec-ch-ua": ""Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": ""macOS"",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        "Sec-Fetch-Dest": "document",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,sv;q=0.6,zh-TW;q=0.5"
      },
      "url": "/"
    }
    

可以看到，我们的确是 `GET` 请求。而 `Host` 头则是浏览器自行加上去的我们请求的域名，由于我们直接使用 IP 进行访问，所以 `Host` 是 `127.0.0.1:8080`。接下去这些头也都是 Chrome 自行加上去的，我们原封不动输了出来。最后，`url` 是 `/`，即根路径。我们可以尝试访问别的路径试试看，如 [http://127.0.0.1:8080/index.html](http://127.0.0.1:8080/index.html "http://127.0.0.1:8080/index.html") ，这回我们看到的 `url` 就变成了 `/index.html`。

这就是一个基于 `net` 的简单的 HTTP 服务端实现了。

小结
--

本章通过一个经典八股题，为大家引出了 HTTP 相关的内容。为大家介绍了 HTTP 的历史，以及不同的版本。并着重介绍了 HTTP/1.1 的请求格式和原理。在 Node.js 中，`http` 模块的服务端是基于 `net` 模块的 `Server` 实现的。在讲具体实现之前，我们自己用 `net` 模块实现了一个最简单版本的 HTTP 服务端，以此来让大家更有体感。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f66874620c74b40bf33055cb3ee59bc~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=658&h=370&s=54311&e=png&b=faf8f8)