上一节课，我们介绍了用 net 模块实现 TCP 服务。用 TCP 服务来处理 HTTP 请求需要使用字符串模板，组织 HTTP 请求和响应的报文，这是一个比较麻烦的过程。幸好，Node.js 提供了更简单的方式：直接使用 http 模块。

## 用 http 模块创建 HTTP 服务

接下来，我们用 http 模块创建一个和上一节课一样的 HTTP 服务。当我们请求的 pathname 为`/`的时候，返回 200 状态和`<h1>Hello World</h1>`，请求其他 URL 的时候返回 404 状态和`<h1>Not Found</h1>`。

我们新建一个模块`http-simple.js`代码如下：

```js
// http-simple.js

const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const {pathname} = url.parse(`http://${req.headers.host}${req.url}`);
  if(pathname === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello world</h1>');
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>Not Found</h1>');
  }
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(8080, () => {
  console.log('opened server on', server.address());
});
```

相比使用 TCP 服务来处理 HTTP 请求，使用 http 服务处理 HTTP 请求更加简单，因为我们不需要手动解析 HTTP 请求的报文，以及用字符串模板组织 HTTP 响应报文。

`http.createServer`创建一个 HTTP 服务，它的回调有两个参数：req 表示 HTTP 请求对象，res 表示 HTTP 响应对象。我们可以从 req 对象中获取请求相关的信息，比如 req.headers 中是 HTTP 请求头（Request Headers）的内容，req.url 是当前请求的 URL 路径，我们通过`req.headers.host`获取请求的服务器名，然后将它和`req.url`拼接起来，再用 url 模块解析，然后从中获取`pathname`，拿到我们要的请求路径，判断它是否是`/`，根据情况返回 200 或 404。

在返回 HTTP 响应内容时，我们不再需要自己拼接模板字符串和计算`Content-length`。http 模块会自动完成这个工作并将`Content-length`写入响应头。我们还可以直接用`res.writeHead`来写入其他 HTTP 响应头，用`res.end`来写入 HTTP 的 Body 部分。

当`res.end`被执行时，HTTP 请求的响应就会被发回给浏览器。

## HTTP 内容协商

你可能觉得奇怪，为什么 HTTP 协议要分为 Header 和 Body，实际上 HTTP 请求的这种设计提供了一种**内容协商机制**。内容协商是 HTTP 协议的基本原则，服务器根据不同的请求头，对指向同一 URL 的请求提供不同格式的响应内容。

我们看一个例子，假设我们访问`http://localhost:8080/account.html`，服务器返回的信息如下：

```
账号: zhangsan
昵称: 张三
注册时间: 2020年3月1日
```

服务器可以根据不同的请求方式，返回不同的格式的数据内容。如果我们是用浏览器直接访问，那么返回 HTML 格式：

```html
<ul>
  <li><span>账号：</span><span>zhangsan</span></li>
  <li><span>昵称：</span><span>张三</span></li>
  <li><span>注册时间：</span><span>2020年3月1日</span></li>
</ul>
```

如果我们用支持 JSON 格式的程序或设备访问，那么返回如下 JSON 格式：

```json
{
  "ID": "zhangshan",
  "Name": "张三",
  "RegisterDate": "2020年3月1日"
}
```

像这样的场景，一般在智能物联网 IoT 的应用场景中比较常见，一些智能设备的管理端没有浏览器，不支持 HTML 展现，需要用 JSON 格式的数据。

这种情况，我们可以在服务器根据 HTTP 请求头做出处理。标准的方式是判断 HTTP 请求头的 Accept 字段（Accept 字段是浏览器发送请求时，自动生成的字段）。

修改我们的代码：

```js
// http-consult.js 

const responseData = {
  ID: 'zhangsan',
  Name: '张三',
  RegisterDate: '2020年3月1日',
};

function toHTML(data) {
  return `
    <ul>
      <li><span>账号：</span><span>${data.ID}</span></li>
      <li><span>昵称：</span><span>${data.Name}</span></li>
      <li><span>注册时间：</span><span>${data.RegisterDate}</span></li>
    </ul>
  `;
}

const server = http.createServer((req, res) => {
  const {pathname} = url.parse(`http://${req.headers.host}${req.url}`);
  if(pathname === '/') {
    const accept = req.headers.accept; // 获取Accept信息
    if(accept.indexOf('application/json') >= 0) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(responseData));
    } else {
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(toHTML(responseData));
    }
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>Not Found</h1>');
  }
});
```

如上面代码所示，我们通过`req.headers.accept`读取请求头`accept`字段的信息，如果这个信息中包含有`application/json`，表示发起这个请求的客户端支持 JSON 格式的内容，服务器就返回 JSON 格式的结果，否则返回 HTML 的结果。

这样一来，我们如果用浏览器直接访问`localhost:8080`，得到的就是 HTML 的结果：

![](https://p3.ssl.qhimg.com/t01f8c963940670fd07.jpg)

这是因为浏览器默认发送的 HTTP 请求中，accept 字段的值是`text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`，不包括`appliaction/json`。

我们要发送`application/json`请求头给服务器，可以通过 curl 命令或者其他工具，这里推荐一个比较好用的工具 PostMan。

你可以在 [PostMan 官网](https://www.postman.com/)下载安装它。

通过 PostMan 发送请求，设置 accept 请求头为`application/json`，得到的结果如下：

![](https://p3.ssl.qhimg.com/t01a9e75f394d5727c2.jpg)

对于 HTTP 协议来说，内容协商是一个比较广泛的概念，并不仅仅指根据  Accept 属性值返回对应的内容，还可以根据 HTTP 动作（Verb）实现内容协商。

比如，我们修改上面的代码，除了 Accept 请求头之外，如果请求的动作为 POST，也返回 JSON 内容：

```js
const server = http.createServer((req, res) => {
  const {pathname} = url.parse(`http://${req.headers.host}${req.url}`);
  if(pathname === '/') {
    const accept = req.headers.accept;
    if(req.method === 'POST' || accept.indexOf('application/json') >= 0) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(responseData));
    } else {
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(toHTML(responseData));
    }
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>Not Found</h1>');
  }
});
```

`req.method`可以获取请求的动作信息，如果是 POST 请求，`req.method`的值是`POST`。修改了代码之后，如果请求是 POST，那么不管 Accept 值是不是`application/json`，都返回 JSON 格式。

![](https://p2.ssl.qhimg.com/t01dce399213673d320.jpg)

## HTTP 请求的动作和状态码

上面的例子，我们实现了一个简单的内容协商 HTTP 服务。在这里，我们顺便介绍一下 HTTP 协议的动作和状态码。

你应该知道，HTTP 请求分为 GET、POST 请求。实际上，根据标准的 HTTP/1.1 协议，HTTP 请求的动作分为`GET、HEAD、OPTIONS、POST、PUT、PATCH、DELETE`。

- GET 表示从服务器获取 URL 指定的资源。
- HEAD 表示只获取该 URL 指定资源的 HTTP 响应头部分（忽略 Body）。
- OPTIONS 是一个特殊的请求，用来预检服务器是否支持某个请求动作。比如客户端可以先发起一个请求询问服务器是否支持 PUT 请求。若支持，则发起后续的 PUT 请求。
- POST 表示将数据资源从客户端提交给服务器。
- PUT 表示更新服务器上某个已有资源。
- PATCH 也表示更新服务器上某个已有资源，但以增量更新的方式，客户端只传输修改部分。
- DELETE 表示从服务器上删除某个资源。

GET、HEAD、POST 请求是 HTTP/1.0 就支持的请求动作，OPTIONS、PUT、PATCH、DELETE 是 HTTP/1.1 增加的请求动作。

按照规范，GET、HEAD 和 OPTIONS 请求是不会改变 HTTP 服务器上的数据的，因此是安全（Safe）的。

按照规范，除了 POST、PATCH 之外，其他的请求以同样的方式调用一次和多次，对系统产生的副作用是相同的，因此是幂等的。

按照规范，POST 方法调用多次，可能会创建多次数据，所以是非幂等，PATCH 方法可能会增量添加多次数据内容，因此也是非幂等的。

按照规范，GET、OPTIONS 请求允许被缓存，其他请求不允许被缓存。关于缓存，在后续的课程中会有详细描述。

![](https://p.ssl.qhimg.com/t01bfdb8e222f2d831a.png)

HTTP 的状态码表示 HTTP 请求的结果，它是一个三位数字，首位可能是 1、2、3、4、5。
- 首位是 1 表示中间状态，按照规范 POST 请求会先提交HEAD信息，如果服务器返回 100，才将数据信息提交。

- 首位是 2 表示请求结束，最常用的就是 200，表示正常返回。

- 首位是 3 表示被请求的资源被重定向，最常用的是 301、302、304。301 表示资源已经被永久移动到新的位置，302 表示资源被暂时移动到新的位置，304 表示资源被缓存，这是浏览器的缓存策略，在后续的课程中会有详细描述。

- 首位是 4 表示请求错误，最常用的是 400、403、404。400 是服务器无法理解和处理该请求；403 表示服务器理解请求，但客户端不具有获取该请求的权限，因此服务器拒绝响应；404 表示请求的资源不存在。

- 首位是 5 表示服务器自身存在问题，导致不能响应请求，常见的有 500、502、504。一般 500 表示服务器当前状态异常；502 表示作为网关的服务器无法从上游获取到有效数据（在后续课程中我们会解释这种状况）；504 表示请求的数据超时。

我们需要明白的是，上述这些动作、状态码以及内容协商，都是 HTTP 规范的一部分，并不是强制的。也就是说，虽然 HTTP 协议规定了 GET 请求不能向服务器提交数据，服务器不应该在处理 GET 请求时将数据写入文件或数据库，但是如果我们一定要这么做，并没有任何强的约束阻止我们这么做。很多早期的不规范的 Web 服务器确实也可以通过 GET 请求的 URL 来提交一些数据。

同样，虽然规定了错误应当返回 4 开头的状态码，但是也有很多 Web 应用将错误用 200 返回，然后在返回的内容中提供错误信息。内容协商也不完全通过对应的 HEADER，比如可以通过 URL 中的 Query 或者其他的信息（比如 URL 的 Path 的一部分）。

上述这些方式是不规范的实现，但并不是错误，在很多 HTTP 服务器上是存在这样的情况的。不过，既然有 HTTP 规范，那么我们在实现 HTTP 服务的时候还是尽量遵循规范，因为**遵循了这些约定和规范，可以让我们的系统有更好的适应性，而且这些规范原则本身对我们的系统和代码的可维护性也有帮助**。

## 总结

http 模块比 net 模块用起来更简单，不需要自己解析 HTTP 请求的内容，或者自己拼接响应的内容，直接使用回调函数中的 req、res 对象来处理请求或响应即可。

内容协商是 HTTP 协议的基本原则，我们可以根据内容协商机制针对不同终端的请求提供不同的响应内容。

最后我们了解了 HTTP 请求的动作和状态码。

在下一节课，我们将扩展这个简单的 HTTP 服务，用它实现一个静态文件服务器。
