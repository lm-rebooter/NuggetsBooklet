作为前端工程师，少不了要和 Web 打交道。通常情况下，前端工程师主要负责“端”的部分，也就是浏览器这一头的功能实现，后端工程师负责另一头，也就是服务器上的逻辑实现。

当我们打开一个网页的时候，浏览器会向服务器发送 HTTP 请求，服务器根据请求的内容处理数据，将正确的数据返回。可以说，HTTP 协议将浏览器与服务器连接在了一起。

**因为 Web 开发中的许多问题既与客户端有关也与服务端有关，所以前端工程师很有必要了解 HTTP 协议**。比如要优化性能，加快页面的打开速度，就需要理解 TCP 协议和 HTTP 协议，理解连接是如何建立的，数据是如何传输的。

而全栈工程师的工作范围则更广，既要实现客户端的逻辑，也要处理服务器端的逻辑，那么理解HTTP协议，了解服务器就更是非常有必要。

所以在接下来的课程中，我们就由浅入深地来了解用 Node.js 进行服务端编程的方法。首先，我们从最基础的网络协议开始。

## 网络 OSI 模型与网络协议

我们知道，标准的开放式互联网模型（Open System Interconnection Model）是七层结构，从下到上分别是**物理层、数据链路层、网络层、传输层、会话层、表示层和应用层**。而万维网（World Wide Web）模型把物理层和数据链路层合并为物理层，把会话层、表示层和应用层合并为应用层，所以是四层结构。

![](https://p.ssl.qhimg.com/t01e5f575e21a82f87d.webp)

在我们编写 Web 应用时，通常很少和物理层打交道，基本上是和网络层、传输层和应用层打交道。网络层主要是 IP 协议，也就是 IP 地址的解析；传输层主要是 TCP 协议；应用层主要是 HTTP 协议。

HTTP 协议是基于传输层 TCP 协议建立在 TCP 协议之上的文本协议，因此 TCP 服务可以处理 HTTP 请求和响应。

这一节课，我们来看一下如何用 Node.js 创建底层 TCP 服务并处理 HTTP 请求。

## 用 TCP 服务处理 HTTP 请求

Node.js 的内置模块 net 模块，可以方便地创建 TCP 服务，监听端口，接受远程客户端的连接。

我们先来创建一个简单的 TCP 服务 —— `tcp-server.js`模块：

```js
// tcp-server.js

const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(`DATA:\n\n${data}`);
  });

  socket.on('close', () => {
    console.log('connection closed, goodbye!\n\n\n');
  });
}).on('error', (err) => {
  // handle errors here
  throw err;
});

server.listen({
  host: '0.0.0.0',
  port: 8080,
}, () => {
  console.log('opened server on', server.address());
});
```

`net.createServer`表示创建并返回一个 server 对象，它的参数是一个回调函数，这个回调函数会在连接建立的时候被调用。

`net.createServer`创建的 server 对象需要调用 listen 方法才能够与客户端建立连接。listen 方法的第一个参数是一个配置项，host表示校验服务器名或 IP 地址。

如果设置为`0.0.0.0`，则表示不校验名称及 IP 地址。也就是说只要能访问到运行`tcp-server.js`的这台服务器，不管是通过哪个 IP 地址或者服务器名访问的，都允许建立连接。`port`表示要连接的端口号。

我们在项目目录下运行这个模块：

```bash
$ node tcp-server.js
```

如果看到控制台打印以下信息，表示服务启动成功。

```bash
opened server on { address: '0.0.0.0', family: 'IPv4', port: 8080 }
```

此时脚本没有结束，而是保持在监听来自 8080 端口的 TCP 请求状态，所以控制台没有返回。

## 用浏览器连接 TCP 服务

现在，我们让 TCP 服务器和客户端建立连接，最简单的方法是通过浏览器访问：

```
http://localhost:8080
```

浏览器建立的是应用层协议 HTTP 连接，而它是基于传输层的 TCP 协议，所以 HTTP 是建立在 TCP 协议之上的，底层仍然是 TCP 协议，那么**我们的 TCP 服务器就可以和浏览器建立连接**。

我们在浏览器输入网址后，网页请求一直保持在加载状态，而运行 Server 的命令行终端里可以看到一些输出信息：

```bash
DATA:

GET / HTTP/1.1
Host: localhost:8080
Connection: keep-alive
Upgrade-Insecure-Requests: 1
...
（这里是两行空行）

```

这些信息就是浏览器通过 HTTP 请求向我们的服务器发送的数据，它们是通过 createServer 的回调函数返回的网络连接套接字 socket 对象的 data 事件获取：

```js
  socket.on('data', (data) => {
    console.log(`DATA:\n\n${data}`);
  });
```

我们看到，浏览器给 TCP 服务器发送的数据是一段文本内容。它的第一行是：`GET / HTTP/1.1`，表示浏览器向服务器发起了 HTTP GET 请求，HTTP的版本是 1.1，请求的路径是`/`。

从第二行开始是键/值的形式，表示 HTTP 的请求头。浏览器会发送给服务器许多的请求头。最后是两个空行。第一个空行是 HTTP 请求头（HTTP Header）和 HTTP 内容（HTTP Body）的分隔；第二个空行是因为浏览器发送的是`GET`请求，HTTP 协议规定`GET`请求的 HTTP Body 为空时，它就是一个空行。

由于我们的服务器没有返回给浏览器任何内容，因此浏览器一直处于等待响应状态，表现为网页一直在加载中的状态。这时候，如果我们关闭网页，在 Server 的命令行终端上会看到输出内容为：

```bash
connection closed, goodbye!



```

这是因为我们关闭网页，连接终止，socket对象的`close`事件被触发，执行了以下代码：

```js
  socket.on('close', () => {
    console.log('connection closed, goodbye!\n\n\n');
  });
```

## 给浏览器返回 HTTP 内容

要让浏览器结束等待，我们可以给它返回内容。内容的返回是通过调用 socket.write 方法来实现。

我们修改一下代码：

```js
const net = require('net');

function responseData(str) {
  return `HTTP/1.1 200 OK
Connection: keep-alive
Date: ${new Date()}
Content-Length: ${str.length}
Content-Type: text/html

${str}`;
}

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    if(/^GET \/ HTTP/.test(data)) {
      socket.write(responseData('<h1>Hello world</h1>'));
    }
    console.log(`DATA:\n\n${data}`);
  });

  socket.on('close', () => {
    console.log('connection closed, goodbye!\n\n\n');
  });
}).on('error', (err) => {
  // handle errors here
  throw err;
});

server.listen({
  host: '0.0.0.0',
  port: 8080,
}, () => {
  console.log('opened server on', server.address());
});
```

在上面的代码中，我们判断如果请求的数据以`GET / HTTP`开头，就返回给请求的客户端（即浏览器）一段文本。这段文本通过模板字符串定义在`responseData`函数里，形式如下：

```
HTTP/1.1 200 OK
Connection: keep-alive
Date: ${new Date()}
Content-Length: ${str.length}
Content-Type: text/html

${str}
```

上面的模版字符串定义了 HTTP 响应报文的基础格式。

第一行`HTTP/1.1 200 OK`表示这是一个 HTTP 协议的返回内容，版本是1.1，200 是状态码表示请求成功完成，OK 是状态码对应的描述符。

第二行开始一直到空行前面，和请求的报文一样是键/值形式的字符串，表示 HTTP 响应头。HTTP 协议规定：HTTP 响应头要带上`Content-Type`和`Content-Length`。其中，`Content-Type`指定了响应的类型。这里设置为`text/html`，告诉浏览器这个返回内容是一段 HTML，要去解析其中的 HTML 标签。`Content-Length`指定了响应内容中`HTTP Body`的字符数。浏览器读到`Content-Length`指定的字符数后，就会认为响应的内容已经传输完成。

除了这两个HTTP响应头字段之外，我们还发送了另外两个响应头字段，一个`Connection`字段，内容是`keep-alive`，告诉浏览器可以不断开 TCP 连接，直到网页关闭。这是 HTTP/1.1 中支持的机制，在同一个会话期间能够复用 TCP 连接，以免每次请求的时候都要创建一个新的 TCP 连接，那样会比较耗性能。

另外，我们发送了一个`Date`字段，用来存放服务器响应请求的日期时间。这个可以提供给页面，方便页面获取服务器时间，对于一些时间依赖的应用（比如秒杀购物）比较有用。

响应头之后是一个空行，这个也是`HTTP Header`和`HTTP Body`的分隔，然后是实际的响应内容。在这个例子中，我们发送的是一段 HTML 片段，内容是`<h1>Hello World</h1>`。

这样，浏览器中显示出来的结果就是正常`<H1>`标题的 Hello World 内容。

![](https://p1.ssl.qhimg.com/t01aef51f54582b545e.jpg)

服务器可以给浏览器返回不同的响应内容和状态码，浏览器会根据响应内容、状态码执行不同的动作。比如我们再修改一下代码：

```js
function responseData(str, status = 200, desc = 'OK') {
  return `HTTP/1.1 ${status} ${desc}
Connection: keep-alive
Date: ${new Date()}
Content-Length: ${str.length}
Content-Type: text/html

${str}`;
}

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const matched = data.toString('utf-8').match(/^GET ([/\w]+) HTTP/);
    if(matched) {
      const path = matched[1];
      if(path === '/') { //如果路径是'/'，返回hello world、状态是200
        socket.write(responseData('<h1>Hello world</h1>'));
      } else { // 否则返回404状态
        socket.write(responseData('<h1>Not Found</h1>', 404, 'NOT FOUND'));
      }
    }
    console.log(`DATA:\n\n${data}`);
  });

  socket.on('close', () => {
    console.log('connection closed, goodbye!\n\n\n');
  });
}).on('error', (err) => {
  // handle errors here
  throw err;
});
```

我们修改了上面代码的 responseData 函数，让它能够支持传入 status 状态码和 desc 状态描述。然后我们判断浏览器请求的 URL 地址，如果路径是`/`，则返回 200，否则返回 404。

![](https://p3.ssl.qhimg.com/t01f2dbbeb493efb2ca.jpg)

所以如果我们请求一个非`/`的地址，比如`/abc`，那么浏览器就会返回 404。

### 总结


这一节课，我们使用 net 模块的 createServer 实现了一个 TCP 服务器，并使用这个服务器来处理简单的 HTTP 请求。通过这个过程，我们了解了 HTTP 协议的基本结构。HTTP 协议是建立在 TCP 协议之上的应用层协议，它的请求、响应格式分别如下：

请求格式：

```
动作 路径 HTTP/1.1
Key1: Value1
Key2: Value2
...

Body
```

这里的动作可以是 GET、POST、PUT、DELETE 和 OPTION，我们在后续课程中会继续介绍。

Body 可以为空，比如在 GET 请求时，规定的 Body 就是为空。

响应格式：

```
HTTP/1.1 状态码 状态描述
Key1: Value1
Key2: Value2
...

Body
```

这里的状态码可以是 1xx、2xx、3xx、4xx、5xx，分别表示不同的状态，在后续课程中会继续介绍。

浏览器通过 HTTP 请求头与服务器进行内容协商，根据响应头执行对应的动作，将响应内容（HTTP Body）渲染出来。

我们直接使用 TCP 协议建立连接虽然可以实现 HTTP 协议通讯，但是我们需要自己去解析 HTTP 请求内容，并按照 HTTP 协议的规范组织响应内容。这显然很麻烦。

幸运的是，Node.js 提供了更加简单的创建 HTTP 服务的模块 —— http 模块。在下一节课里，我们就来讨论如何用 http 模块实现基础的 HTTP 服务。