上一章中我们自己基于 `net` 模块写了个玩具的 `http` 服务端。回过头来，我们要看看 Node.js 中的 `http` 服务端模块是怎么写的了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f96d2721d9ac4162a38fb1bdba8635b2~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=600&h=556&s=127393&e=png&b=fefdfd)

有关 HTTP 服务端的模块，是在 [lib/\_http\_server.js](https://github.com/nodejs/node/blob/v18.17.1/lib/_http_server.js "https://github.com/nodejs/node/blob/v18.17.1/lib/_http_server.js") 路径中，就是导出的这个 [Server 类](https://github.com/nodejs/node/blob/v18.17.1/lib/_http_server.js#L1176 "https://github.com/nodejs/node/blob/v18.17.1/lib/_http_server.js#L1176")。

在讲 HTTP 的 `Server` 之前，我们先把其依赖的一些内容给讲了。

前置内容
----

### `FreeList`——简易的对象池

它的代码非常简单，就三十行。

    'use strict';
    
    class FreeList {
      constructor(name, max, ctor) {
        this.name = name;
        // 用于构造对象的函数
        this.ctor = ctor;
        this.max = max;
        this.list = [];
      }
    
      alloc() {
        // 如果池子里尚有对象
        return this.list.length > 0 ?
          // 从池子中取出第一个对象
          this.list.pop() :
          // 否则，通过 `this.ctor()` 函数重新生成一个对象
          Reflect.apply(this.ctor, this, arguments);
      }
    
      free(obj) {
        // 如果池子没满
        if (this.list.length < this.max) {
          // 将对象放回池子中
          this.list.push(obj);
          return true;
        }
        
        // 否则不做回收，等待后续被 GC
        return false;
      }
    }
    
    module.exports = FreeList;
    

这段代码定义了一个名为 `FreeList` 的类，设计用于为常用的对象提供一个轻量级的对象池。这种设计模式可以提高性能，特别是在需要频繁创建和销毁对象的情况下。

在没有“对象池”的情况下，你去饭店吃饭可能是这样的：

步骤

厨师做好饭了

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4c8a3a2d4b44b27bfb9d8cd8ea9df72~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=300&h=260&s=528660&e=gif&f=23&b=f7f2f0)

需要一个碗，开始转转转（`new Bowl()`）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcc9cc7c5415486ca00c1f6c68c77526~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=560&h=314&s=292842&e=gif&f=6&b=8c6746)

把菜盛到碗里（`bowl.init()`）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/333bfc42ca1046d3805e61a2186b9e46~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=286&h=343&s=1744897&e=gif&f=39&b=afc1d0)

吃完菜（`eat(bowl)`）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/300a37ad282a4576a2d3872022f46d94~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=440&h=224&s=140111&e=gif&f=3&b=e1976c)

把碗打碎，打回原形（GC）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae783c3cbd734faa8e1877b9525149b9~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=342&h=243&s=2033765&e=gif&f=60&b=190c15)

可以看到，在没有对象池的情况下，吃个饭需要不断地做碗、摔碗、做碗、摔碗……

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b5119842d9546ec9dc4f9917f477d89~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=560&h=314&s=292842&e=gif&f=6&b=8c6746)![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23504ff93cb1431892171bc8bc19788c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=342&h=243&s=2033765&e=gif&f=60&b=190c15)

如果有了对象池，那么这个环节就不一样了：

步骤

厨师做好饭了

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b339359bf61414ea3ff3d34ab183315~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=300&h=260&s=528660&e=gif&f=23&b=f7f2f0)

需要一个碗，从碗柜里拿一个（`bowlList.pop()`），碗柜里没了才重新做一个

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ead2edb111be4a18ad37d065d3cf8af0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=238&h=238&s=697929&e=gif&f=20&b=708182)

把菜盛到碗里（`bowl.init()`）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fee6cff059084fe281943a72fb6b1c1b~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=286&h=343&s=1744897&e=gif&f=39&b=afc1d0)

吃完菜（`eat(bowl)`）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/890ab7045c9c4d89b91c7750675759a0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=440&h=224&s=140111&e=gif&f=3&b=e1976c)

把碗放回碗柜（`bowlList.push(bowl)`），碗柜满了才砸碗

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d80a2a7fe03547a8ba4fad2e06dafa05~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=420&h=449&s=808835&e=gif&f=11&b=e5e2e7)

可以看到，原来的不断做碗、砸碗、做碗、砸碗变成了取碗、放碗、取碗、放碗——大大节省了时间。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a45960eb0de4d47b3c52fb0e9901cff~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=238&h=238&s=697929&e=gif&f=20&b=708182)![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f50186b5b7424717a92c735278a87066~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=420&h=449&s=808835&e=gif&f=11&b=e5e2e7)

当然，取碗后或者放碗前，需不需要洗碗，这个就自己决定啦。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/275d61f63e0d432b824a13032db726df~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=300&h=270&s=91736&e=gif&f=3&b=5276a0)

通过 `FreeList` 类，我们可以为特定的对象创建对象池，从而提高性能和资源利用率。

### `HTTPParser`——HTTP 协议格式解析类

在上一章的玩具中，我们的 HTTP 请求解析非常简单，逐行分，然后再通过空格分。非常不严谨——但有用。

Node.js 中的 HTTPParser 是基于 [llhttp](https://github.com/nodejs/llhttp/tree/main "https://github.com/nodejs/llhttp/tree/main") 实现的。llhttp 脱胎于 [http-parser](https://github.com/nodejs/http-parser "https://github.com/nodejs/http-parser")，http-parser 是 Node.js 最开始的用于解析 HTTP 协议数据用的库，也是专为 Node.js 写的。后来由于 http-parser 难以维护，就新搞了个可维护的 llhttp，并且性能有很大的提升。

http-parser 是直接由 C 语言写的。而 llhttp 则是 TypeScript 为源码，以 TypeScript 源码去生成 C 语言的 llhttp 源码——毕竟 TypeScript 作为更高级的语言，比 C 语言更易维护。

llhttp 脱胎于 http-parser，所以它跟 http-parser 一样，最终也是一个状态机。还记得我们在第十九章 `URL` 里面提到的吗？`URL` 也是基于状态机搞的。TypeScript 写用于生成 C 语言的源码，而 C 源码其实可读性比 http-parser 还低，说它便于维护是它的 TypeScript 生成源码非常好维护。既然原理差不多，这里就不讲 [llhttp 的源码](https://github.com/nodejs/node/blob/main/deps/llhttp/src/llhttp.c "https://github.com/nodejs/node/blob/main/deps/llhttp/src/llhttp.c")了，毕竟可读性很差，稍微提一下 http-parser 源码吧。

Http-parser 实际上就是一个状态机，比如收到一串数据后，最开始的状态是：请求或响应的开始（`s_start_req_or_res`）。

    switch (CURRENT_STATE()) { // 当前状态
      ...
      
      case s_start_req_or_res:
      {
        if (ch == CR || ch == LF)
          break;
        parser->flags = 0;
        parser->uses_transfer_encoding = 0;
        parser->content_length = ULLONG_MAX;
    
        if (ch == 'H') {
          UPDATE_STATE(s_res_or_resp_H);
    
          CALLBACK_NOTIFY(message_begin);
        } else {
          parser->type = HTTP_REQUEST;
          UPDATE_STATE(s_start_req);
          REEXECUTE();
        }
    
        break;
      }
      ...
    

我们回忆一下请求行：

    GET /index.html HTTP/1.1
    

还有响应行：

    HTTP/1.1 405 Method Not Allowed
    

按规范，响应行的第一个字符恒为 `H`，而请求行则是不同的 HTTP 方法，所以有多种可能性。在上面的状态机中，如果是请求或响应的开始，则判断当前字符是否为 `H`：

*   若是，则将状态机的状态变更为请求或响应，且第一个字符为 `H`（`s_res_or_resp_H`）——因为 `HEAD` 请求的第一个字符也是 `H`；
    
*   若不是，则将状态机的状态变更为请求行的开始（`s_start_req`），且从第一个字符重新开始执行整个状态机（`REEXECUTE()`）。
    

这就是第一个状态的转变。接下去就是 `s_res_or_resp_H` 状态：

      case s_res_or_resp_H:
        if (ch == 'T') {
          parser->type = HTTP_RESPONSE;
          UPDATE_STATE(s_res_HT);
        } else {
          if (UNLIKELY(ch != 'E')) {
            SET_ERRNO(HPE_INVALID_CONSTANT);
            goto error;
          }
    
          parser->type = HTTP_REQUEST;
          parser->method = HTTP_HEAD;
          parser->index = 2;
          UPDATE_STATE(s_req_method);
        }
        break;
    

也很简单，如果第一个是 `H`，那么后面有两种可能：

1.  `T`：说明后面可能是 `HTTP`，那么它有可能是个响应行；
    
2.  `E`：说明后面可能是 `HEAD`，那么它有可能是个请求行。
    

其它所有情况都是非法情况。所以上面这段代码就很好解释了，如果字符是 `T`，那么将状态变更为响应行，将此次解析的类型变为“响应（`HTTP_RESPONSE`）”，且前两个字符为 `HT`（`s_req_HT`）；在剩下的情况中，如果字符不是 `E`（`UNLIKELY(ch != 'E')`），那么将状态机置为错误（`SET_ERRNO(HPE_INVALID_CONSTANT)`），并进入错误逻辑（`goto error`）；若是 `E`，那么将此次解析的类型变为“请求（`HTTP_REQUEST`）”，且请求方法为 `HTTP_HEAD`，将状态变更为请求方法（`s_req_method`）。

如果是之前讲的 `s_start_req` 状态，就得回到最开始第一个字符重新来一遍：

      case s_start_req:
      {
        if (ch == CR || ch == LF)
          break;
        parser->flags = 0;
        parser->uses_transfer_encoding = 0;
        parser->content_length = ULLONG_MAX;
    
        if (UNLIKELY(!IS_ALPHA(ch))) {
          SET_ERRNO(HPE_INVALID_METHOD);
          goto error;
        }
    
        parser->method = (enum http_method) 0;
        parser->index = 1;
        switch (ch) {
          case 'A': parser->method = HTTP_ACL; break;
          case 'B': parser->method = HTTP_BIND; break;
          case 'C': parser->method = HTTP_CONNECT; /* or COPY, CHECKOUT */ break;
          case 'D': parser->method = HTTP_DELETE; break;
          case 'G': parser->method = HTTP_GET; break;
          case 'H': parser->method = HTTP_HEAD; break;
          case 'L': parser->method = HTTP_LOCK; /* or LINK */ break;
          case 'M': parser->method = HTTP_MKCOL; /* or MOVE, MKACTIVITY, MERGE, M-SEARCH, MKCALENDAR */ break;
          case 'N': parser->method = HTTP_NOTIFY; break;
          case 'O': parser->method = HTTP_OPTIONS; break;
          case 'P': parser->method = HTTP_POST;
            /* or PROPFIND|PROPPATCH|PUT|PATCH|PURGE */
            break;
          case 'R': parser->method = HTTP_REPORT; /* or REBIND */ break;
          case 'S': parser->method = HTTP_SUBSCRIBE; /* or SEARCH, SOURCE */ break;
          case 'T': parser->method = HTTP_TRACE; break;
          case 'U': parser->method = HTTP_UNLOCK; /* or UNSUBSCRIBE, UNBIND, UNLINK */ break;
          default:
            SET_ERRNO(HPE_INVALID_METHOD);
            goto error;
        }
        UPDATE_STATE(s_req_method);
    
        CALLBACK_NOTIFY(message_begin);
    
        break;
      }
    

这个很简单，就是枚举所有可能的 HTTP 方法的开始值。其中 `HEAD` 是直接在 `s_res_or_resp_H` 里被更新了，所以理论上这个 `case` 中的 `'H'` 是不会经由最开始转过来的。不过这个 http-parser 会在任意位置和任意状态会被调用，所以还是可能经由其它路径过来的。这里面包含了不同的 HTTP 方法。

**HTTP/1.0**

**HTTP/1.1**

**WebDAV 相关**

**Simple Service Discovery Protocol/1.0**

**无** **RFC**

`GET`、`HEAD`、`POST`

`CONNECT`、`DELETE`、`OPTIONS`、`PUT`、`TRACE`、`PATCH`（后加的）、`LINK`（后加的）、`UNLINK`（后加的）

`ACL`、`BASELINE-CONTROL`、`BIND`、`CHECKIN`、`CHECKOUT`、`COPY`、`LABEL`、`LOCK`、`MERGE`、`MKACTIVITY`、`MKCALENDAR`、`MKCOL`、`MKWORKSPACE`、`MOVE`、`PROPFIND`、`PROPPATCH`、`REBIND`、`REPORT`、`SEARCH`、`UNBIND`、`UNCHECKOUT`、`UNLOCK`、`UNSUBSCRIBE`、`UPDATE`、`VERSION-CONTROL`

`M-SEARCH`、`NOTIFY`

`PURGE` 、`SOURCE`（Icecast Protocol）

遇到对应的开头字母，就设置成为对应的 HTTP 方法，然后进入 `s_req_method` 状态进行合法性校验。`s_req_method` 就是去校验后面几个字符是否与设置好的 HTTP 方法的预期相符，具体就不赘述了。再接下去就是会碰到空格进入 URL 解析阶段（`s_req_spaces_before_url`），然后持续推进到后续阶段。

http-parser 的状态机就是以上述的方式进行轮转的。只讲最开始的几个状态有助于大家想象整个状态机的全貌——总之就是逐字扫描并记录和判断。

llhttp 原理类似，也是逐字扫描记录判断的状态机。只不过它的代码是通过更容易维护和理解的 TypeScript 生成的 C 代码，开发者只需要专注可读性高的 TypeScript 上的逻辑即可，它生成的 C 语言代码可读性很低。

HTTP 的 `Server`
---------------

上一章中我们提到了，这个 `Server` 就是继承自 `net.Server`。它构造函数里面是这么写的：

    function Server(options, requestListener) {
      ...
    
      net.Server.call(
        this,
        { allowHalfOpen: true, noDelay: options.noDelay,
          keepAlive: options.keepAlive,
          keepAliveInitialDelay: options.keepAliveInitialDelay,
          highWaterMark: options.highWaterMark });
    
      if (requestListener) {
        this.on('request', requestListener);
      }
    
      ...
    
      this.on('connection', connectionListener);
    
      ...
    }
    

这是古早的原型链继承的写法，`net.Server.call(...)` 相当于 `super()`。在调用父类构造函数后，紧接着把 `request` 的事件监听函数加上，同时也把 `connection` 的事件监听加上。

在我们上一章中，我们自己的玩具 HTTP 服务端中，就是通过 `net.createServer()` 来创建服务端，并在其中传入 `connection` 事件的回调函数。而 Node.js 的 `http` 模块中，它就是构造好父类的内容后，直接监听事先写好的 `connection` 事件监听函数 [connectionListener](https://github.com/nodejs/node/blob/v18.17.1/lib/_http_server.js#L617C1-L621C2 "https://github.com/nodejs/node/blob/v18.17.1/lib/_http_server.js#L617C1-L621C2")：

    function connectionListener(socket) {
      defaultTriggerAsyncIdScope(
        getOrSetAsyncId(socket), connectionListenerInternal, this, socket,
      );
    }
    

这里面涉及到异步追踪的一些逻辑，`defaultTriggerAsyncIdScope()` 不用管，直接看 `connectionListenerInternal()` 就好了，这个是真实的监听函数，Node.js 会往它里面传 `this`（也就是当前 `server` 对象），以及 `socket` 对象。

在我们上一章的玩具中，这个监听函数里面做的事情是，监听从 `socket` 过来的 `data` 事件，并在接收完数据后开始解析、处理数据，最终把需要返还给客户端的内容拼装成 HTTP 响应格式，最终写回给客户端。Node.js 的 HTTP 模块逻辑类似，主要也是监听 `data` 事件进行解析，但是还多了各种其它的监听，比如 `close`、`end`、`error`、`drain` 等，这些都是为了健壮性、边界等方面的考虑。

首先，将 `server` 对象与当前 `socket` 绑起来，这样能把两者关系给对上。

    function connectionListenerInternal(server, socket) {
      socket.server = server;
    

然后做一些超时相关的逻辑，不用太关心，也不展开讲。

      if (server.timeout && typeof socket.setTimeout === 'function')
        socket.setTimeout(server.timeout);
      socket.on('timeout', socketOnTimeout);
    

接下去为当前 `socket` 对象分配一个 HTTP 格式的解析器。

      const parser = parsers.alloc();
      const lenient = server.insecureHTTPParser === undefined ?
        isLenient() : server.insecureHTTPParser;
    

这个 `parsers` 就是前文中提到的 `FreeList` 实例，它池子中存的是由 Node.js 将前文中的 HTTPParser（llhttp）封装起来的对象，用于解析 HTTP 协议的数据（无论是请求还是响应）。——这个就是我们在 `FreeList` 中提到的“拿碗阶段”。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16528938317f459dbbe55ea51e4bf090~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=238&h=238&s=697929&e=gif&f=20&b=708182)

后面的 `lenient` 表示此次解析 HTTP 协议数据是宽松还是严谨，这个在 HTTP 服务[初始化的时候](https://nodejs.org/dist/latest-v18.x/docs/api/http.html#httpcreateserveroptions-requestlistener "https://nodejs.org/dist/latest-v18.x/docs/api/http.html#httpcreateserveroptions-requestlistener")通过 `insecureHTTPParser` 参数决定，若未指定，则以启动 Node.js 时候的 `--insecure-http-parser` 为准（`isLenient()` 中做的就是这个判断）。

由于我们拿来的碗有可能是之前用剩下塞回去的，里面还有食物残留，所以拿到碗之后需要洗一遍，重置内部所有状态。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d3e3beed7504619b06aa3e82108c2a5~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=300&h=270&s=91736&e=gif&f=3&b=5276a0)

      parser.initialize(
        HTTPParser.REQUEST,
        new HTTPServerAsyncResource('HTTPINCOMINGMESSAGE', socket),
        server.maxHeaderSize || 0,
        lenient ? kLenientAll : kLenientNone,
        server[kConnections],
      );
      parser.socket = socket;
      socket.parser = parser;
    

将其初始化成“请求”类型，然后将用于异步上下文追踪的 `HTTPServerAsyncResource` 也传进去，然后就是其它一些初始化参数了。最后，把 `socket` 与 `parser` 相互绑定关联。这样，后续 `socket` 收到什么内容，就直接流式传给 `parser` 持续解析即可。

之后是一些不重要的状态、变量声明。

      const state = {
        onData: null,
        onEnd: null,
        onClose: null,
        onDrain: null,
        outgoing: [],
        incoming: [],
        // `outgoingData` is an approximate amount of bytes queued through all
        // inactive responses. If more data than the high watermark is queued - we
        // need to pause TCP socket/HTTP parser, and wait until the data will be
        // sent to the client.
        outgoingData: 0,
        requestsCount: 0,
        keepAliveTimeoutSet: false,
      };
      state.onData = socketOnData.bind(undefined,
                                       server, socket, parser, state);
      state.onEnd = socketOnEnd.bind(undefined,
                                     server, socket, parser, state);
      state.onClose = socketOnClose.bind(undefined,
                                         socket, state);
      state.onDrain = socketOnDrain.bind(undefined,
                                         socket, state);
    

然后绑定 `socket` 的各事件。

      socket.on('data', state.onData);
      socket.on('error', socketOnError);
      socket.on('end', state.onEnd);
      socket.on('close', state.onClose);
      socket.on('drain', state.onDrain);
      parser.onIncoming = parserOnIncoming.bind(undefined,
                                                server, socket, state);
    

篇幅原因，再之后的代码我们就不讲了。这里最重要的就是 `socket` 的 `data` 事件——它接受到参数的事件。这个事件主要做的事情就是把数据传给 `parser` 进行解析，获得 HTTP 请求的信息。

下面这个就是绑在事件上的回调函数。

    function socketOnData(server, socket, parser, state, d) {
      assert(!socket._paused);
      debug('SERVER socketOnData %d', d.length);
    
      const ret = parser.execute(d);
      onParserExecuteCommon(server, socket, parser, state, ret, d);
    }
    

前面 4 个参数都是事先 `bind` 好的，最后的 `d` 就是此次接收到的数据。其实做法很简单，执行 `parser` 的 `execute()` 方法，进行进一步解析（也就是执行前文中讲到的状态机）。因为 HTTP 是流式传输的，所以可能这个数据不完整，那么状态机解析到最后一个字符时，会将当前的解析状态存在 `parser` 中，等待后续有数据进入，就可以从当前状态开始继续解析了。

一旦 HTTP 请求行和请求头被完整解析，就会触发 `parser.onIncoming`，也就是我们绑定的 `parserOnIncoming()` 函数。这个函数中会把解析完毕的 `req` 对象传入，该对象就是我们开发者侧使用 HTTP 服务端时回调函数中的那个 `req` 对象。

    function parserOnIncoming(server, socket, state, req, keepAlive) {
      ...
      const res = new server[kServerResponse](req,
                                              {
                                                highWaterMark: socket.writableHighWaterMark,
                                                rejectNonStandardBodyWrites: server.rejectNonStandardBodyWrites,
                                              });
      ...
    

这个函数绑定的 `server` 就是我们所实例化的 HTTP 服务端对象，它有个私有变量是用于 HTTP 服务端的 [ServerResponse](https://nodejs.org/dist/latest-v18.x/docs/api/http.html#class-httpserverresponse "https://nodejs.org/dist/latest-v18.x/docs/api/http.html#class-httpserverresponse") 类。此处我们用这个类来实例化我们的 `res` 变量，这个变量就是后续我们开发者侧使用 HTTP 服务端时回调函数中的那个 `res` 对象了。

`req` 和 `res` 都有了，在设置了一堆其它信息后，Node.js 中就会触发 `request` 事件。

      ...
      if (!handled) {
        server.emit('request', req, res);
      }
    
      return 0;
    }
    

在我们前文中提到的 `Server` 构造函数中，我们是监听了这个 `request` 事件的，用的就是我们外部传进来的回调函数。但此时后续还有可能会有数据进来，毕竟触发 `request` 事件只是在请求行和请求头解析完之后，后面还有请求体要持续流进来。

所以这个流程框架其实很简单：

![29流程图1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bb246bd310242d3a172a62de73ec57c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=366&h=376&s=22007&e=png&b=fbfbfb)

而在 `parser.execute()` 中直到 `request` 事件前的流程大体如下：

![29流程图2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e607261f06a74b488f3b0331a3d285d7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=696&h=1130&s=83080&e=png&b=fdfdfd)

这其实跟我们上一章的简易玩具异曲同工。都是解析完来的 HTTP 请求信息，然后把信息格式化成 JavaScript 中的对象，交给回调函数处理，最终可以让用户写回数据给浏览器。

写 HTTP 响应的操作是在 `ServerResponse` 类中实现的，也就是我们回调函数中的 `res` 对象。通常我们可以调用 `setHeader()`、`writeHeader()`、`write()` 以及 `end()` 这些来做一些操作。

`setHeader()` 就是往 `ServerResponse` 对象中存储好响应头的键值对；而 `writeHead()` 则是连同响应状态码、事先存储好的响应头以及新传进来的响应头键值对一起写入——遵从上一章中我们提到的“响应行”、“响应头”的格式。

`write()` 则是写入响应体，也就是 body。若在写入 `write()` 之前，尚未写入过响应行、响应头，也就是尚未调用过 `writeHeader()`，Node.js 在 `write()` 中会先主动调用一下进行写入——毕竟在 HTTP 格式中，响应行和响应头都是在响应体之前的。

`end()` 好理解，除了写入数据之外，还要标记结束。所以 `write()` 可以多次调用，产生流式效果，而 `end()` 只能调用一次——调用了，此次响应就结束了。写入的最终也是通过此次建连的客户端 `socket` 来进行的：

    conn = this.socket;
    ...
    conn.write(data, encoding, callback);
    

至此，HTTP 服务端的接受 HTTP 请求、写入 HTTP 响应的逻辑框架就已经讲完了。与上一章的玩具比起来还是多了挺多内容的，但是本质上原理差不多。

HTTPS 服务端很多逻辑也跟 HTTP 是复用的，只不过中间多了 TLS 相关内容。我对密码学不熟悉，这里就不展开讲了。

HTTP 服务端小结
----------

本章通过深入剖析 Node.js 中的 HTTP 服务端模块，不仅解开了其背后运行的机制，而且展示了与简单玩具版 HTTP 服务端的异同。在这一过程中，我们探讨了几个核心点：

*   **对象池（FreeList）：** 通过 FreeList 类的实现，我们见识到了如何通过对象池机制优化性能，避免了频繁地创建和销毁对象。
*   **HTTP 协议解析（HTTPParser）：** Node.js 采用了基于状态机的方式进行 HTTP 协议的解析，这样不仅提高了解析的效率，还能适应流式传输的需求。
*   **Server 类与事件监听：** 我们探究了 Node.js HTTP 服务端的 Server 类，发现它继承自 `net.Server`，并且是通过事件驱动的方式进行请求和响应的处理。
*   **请求与响应对象：** 揭示了如何从底层 socket 数据生成更高层次的请求和响应对象（`req` 和 `res`），这两个对象是我们在开发者侧最常与之交互的。
*   **响应写入：** 详细介绍了如何通过 `ServerResponse` 类及其方法（例如 `setHeader()`, `write()`, `end()` 等）来构造和发送 HTTP 响应。
*   **HTTPS 与** **TLS** **：** 虽然本章没有深入到 HTTPS 和 TLS，但指出这部分逻辑与 HTTP 服务端大致相似，主要区别在于加密处理。

通过以上各点的详细解读，我们不仅理解了 Node.js HTTP 服务端的内部逻辑，还为日后可能的性能优化和扩展打下了坚实的基础。与上一章的玩具服务端相比，Node.js 的 HTTP 模块虽然更为复杂，但其核心逻辑和基础原理大体相同，只是增加了更多的健壮性和灵活性。

总之，这一章不仅提升了我们对 HTTP 和 Node.js 的理解，也展示了如何从源码角度看待一个成熟的库或框架。希望大家能从中受益。