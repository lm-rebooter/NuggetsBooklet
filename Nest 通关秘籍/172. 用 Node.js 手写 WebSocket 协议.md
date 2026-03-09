实时的双向数据通信，我们一般会用 WebSocket 来做。

HTTP 的协议格式我们很清楚，就是 header、body 这些。

那 WebSocket 的协议格式是什么样的呢？

这节我们就用 Node 来实现下 WebSocket 协议的解析。

WebSocket 严格来说和 HTTP 没什么关系，是另外一种协议格式。但是需要一次从 HTTP 到 WebSocket 的切换过程。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66a631eacea541b8a21077f3a70a7d30~tplv-k3u1fbpfcp-watermark.image?)

切换过程详细来说是这样的：

请求的时候带上这几个 header：

```
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: Ia3dQjfWrAug/6qm7mTZOg==
```

前两个很容易理解，就是升级到 websocket 协议的意思。

第三个 header 是保证安全用的一个 key。

服务端返回这样的 header：

```
HTTP/1.1 101 Switching Protocols
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Accept: JkE58n3uIigYDMvC+KsBbGZsp1A=
```
和请求 header 类似，Sec-WebSocket-Accept 是对请求带过来的 Sec-WebSocket-Key 处理之后的结果。

加入这个 header 的校验是为了确定对方一定是有 WebSocket 能力的，不然万一建立了连接对方却一直没消息，那不就白等了么。

那 Sec-WebSocket-Key 经过什么处理能得到 Sec-WebSocket-Accept 呢？

我用 node 实现了一下，是这样的：

```javascript
const crypto = require('crypto');

function hashKey(key) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
  return sha1.digest('base64');
}
```

也就是用客户端传过来的 key，加上一个固定的字符串，经过 sha1 加密之后，转成 base64 的结果。

这个字符串 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 是固定的，不信你搜搜看：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae1d0158cd7846baa748766f500df6ac~tplv-k3u1fbpfcp-watermark.image?)

随便找个有 websocket 的网站，比如知乎就有：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/216b4bd530414a98be20d24b48004e9c~tplv-k3u1fbpfcp-watermark.image?)

过滤出 ws 类型的请求，看看这几个 header，是不是就是前面说的那些。

这个 Sec-WebSocket-Key 是 wk60yiym2FEwCAMVZE3FgQ==

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59c04c72059d4065af018e6fa569db42~tplv-k3u1fbpfcp-watermark.image?)

而响应的 Sec-WebSocket-Accept 是 XRfPnS+8xl11QWZherej/dkHPHM=

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/def6d4065c6a43fa9324a066df751c29~tplv-k3u1fbpfcp-watermark.image?)

我们算算看：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f23d5f2866e4050bc868b8fd7f48fb0~tplv-k3u1fbpfcp-watermark.image?)

是不是一毛一样！

这就是 websocket 升级协议时候的 Sec-WebSocket-Key 对应的 Sec-WebSocket-Accept 的计算过程。 

这一步之后就换到 websocket 的协议了，那是一个全新的协议：

勾选 message 这一栏可以看到传输的消息，可以是文本、可以是二进制：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/619acacb8a394458a7d75fc7385891e8~tplv-k3u1fbpfcp-watermark.image?)

全新的协议？那具体是什么样的协议呢？

这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f72a5f75c1964af38036e2afef51a35c~tplv-k3u1fbpfcp-watermark.image?)

大家习惯的 http 协议是 key:value 的 header 带个 body 的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5062b7f961ab42ed9f3766ad4a8b6a3a~tplv-k3u1fbpfcp-watermark.image?)

它是文本协议，每个 header 都是容易理解的字符。

这样好懂是好懂，但是传输占的空间太大了。

而 websocket 是二进制协议，一个字节可以用来存储很多信息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/671ce2ce334b4d68b4fdd781e132de37~tplv-k3u1fbpfcp-watermark.image?)

比如协议的第一个字节，就存储了 FIN（结束标志）、opcode（内容类型是 binary 还是 text） 等信息。

第二个字节存储了 mask（是否有加密），payload（数据长度）。

仅仅两个字节，存储了多少信息呀！

这就是二进制协议比文本协议好的地方。

我们看到的 weboscket 的 message 的收发，其实底层都是拼成这样的格式。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b136cc1654b42b4a9c1481666c01303~tplv-k3u1fbpfcp-watermark.image?)

只是浏览器帮我们解析了这种格式的协议数据。

这就是 weboscket 的全部流程了。

其实还是挺清晰的，一个切换协议的过程，然后是二进制的 weboscket 协议的收发。

那我们就用 Node.js 自己实现一个 websocket 服务器吧！

新建个项目：

```
mkdir my-websocket

cd my-websocket

npm init -y
```

在 src/ws.js 定义个 MyWebSocket 的 class：

```javascript
const { EventEmitter } = require('events');
const http = require('http');

class MyWebsocket extends EventEmitter {
  constructor(options) {
    super(options);

    const server = http.createServer();
    server.listen(options.port || 8080);

    server.on('upgrade', (req, socket) => {
      
    });
  }
}
```
继承 EventEmitter 是为了可以用 emit 发送一些事件，外界可以通过 on 监听这个事件来处理。

我们在构造函数里创建了一个 http 服务，当 ungrade 事件发生，也就是收到了 Connection: upgrade 的 header 的时候，返回切换协议的 header。

返回的 header 前面已经见过了，就是要对 sec-websocket-key 做下处理。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf421f86affa47a6832bff77dbc3bbb7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1174&h=1116&s=184085&e=png&b=1f1f1f)

```javascript
server.on('upgrade', (req, socket) => {
  this.socket = socket;
  socket.setKeepAlive(true);

  const resHeaders = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    'Sec-WebSocket-Accept: ' + hashKey(req.headers['sec-websocket-key']),
    '',
    ''
  ].join('\r\n');
  socket.write(resHeaders);

  socket.on('data', (data) => {
    console.log(data)
  });
  socket.on('close', (error) => {
      this.emit('close');
  });
});
```
我们拿到 socket，返回上面的 header，其中 key 做的处理就是前面聊过的算法：

```javascript
function hashKey(key) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
  return sha1.digest('base64');
}
```

就这么简单，就已经完成协议切换了。

不信我们试试看。

新建 src/index.js，引入我们实现的 ws 服务器，跑起来：

```javascript
const MyWebSocket = require('./ws');
const ws = new MyWebSocket({ port: 8080 });

ws.on('data', (data) => {
  console.log('receive data:' + data);
});

ws.on('close', (code, reason) => {
  console.log('close:', code, reason);
});
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c35e2304a71b479aba9852ba955eedd0~tplv-k3u1fbpfcp-watermark.image?)

然后新建这样一个 index.html：

```html
<!DOCTYPE HTML>
<html>
<body>
    <script>
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = function () {
            ws.send("发送数据");
            setTimeout(() => {
                ws.send("发送数据2");
            }, 3000)
        };

        ws.onmessage = function (evt) {
            console.log(evt)
        };

        ws.onclose = function () {
        };
    </script>
</body>

</html>
```
用浏览器的 WebSocket api 建立连接，发送消息。

起个静态服务:
```
npx http-server . 
```

然后浏览器访问这个 html：

这时打开 devtools 你就会发现协议切换成功了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c4a9f221d6641e89449111a4657e6cd~tplv-k3u1fbpfcp-watermark.image?)

这 3 个 header 还有 101 状态码都是我们返回的。

message 里也可以看到发送的消息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/058fd50aafec4eb18f9d0ada62efc07d~tplv-k3u1fbpfcp-watermark.image?)

再去服务端看看，也收到了这个消息：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9d356cfd40341a1a59fc7119b0ea509~tplv-k3u1fbpfcp-watermark.image?)

只不过是 Buffer 的，也就是二进制的。

接下来只要按照协议格式解析这个 Buffer，并且生成响应格式的协议数据 Buffer 返回就可以收发 websocket 数据了。

这一部分还是比较麻烦的，我们一点点来看。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fb528c7bc8a41cda747ebe9de2d66f9~tplv-k3u1fbpfcp-watermark.image?)

我们需要第一个字节的后四位，也就是 opcode。

这样写：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34e4c466a7e14b8c8d57ed744f672d0d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=696&h=134&s=29918&e=png&b=202020)

```javascript
const byte1 = bufferData.readUInt8(0);
let opcode = byte1 & 0x0f; 
```
读取 8 位无符号整数的内容，也就是一个字节的内容。参数是偏移的字节，这里是 0。

通过位运算取出后四位，这就是 opcode 了。

然后再处理第二个字节：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/229e839639814184ab2d4d928f8bdd6b~tplv-k3u1fbpfcp-watermark.image?)

第一位是 mask 标志位，后 7 位是 payload 长度。

可以这样取：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/197fb1f48fd84da3b984666c8280d092~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=870&h=444&s=83058&e=png&b=1f1f1f)

```javascript
const byte2 = bufferData.readUInt8(1);
const str2 = byte2.toString(2);
const MASK = str2[0];
let payloadLength = parseInt(str2.substring(1), 2);
```

还是用 buffer.readUInt8 读取一个字节的内容。

先转成二进制字符串，这时第一位就是 mask，然后再截取后 7 位的子串，parseInt 成数字，这就是 payload 长度了。

这样前两个字节的协议内容就解析完了。

有同学可能问了，后面咋还有俩 payload 长度呢？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f06445633ac34228810660211b20e417~tplv-k3u1fbpfcp-watermark.image?)

这是因为数据不一定有多长，可能需要 16 位存长度，可能需要 32 位。

于是 websocket 协议就规定了如果那个 7 位的内容不超过 125，那它就是 payload 长度。

如果 7 位的内容是 126，那就不用它了，用后面的 16 位的内容作为 payload 长度。

如果 7 位的内容是 127，也不用它了，用后面那个 64 位的内容作为 payload 长度。

其实还是容易理解的，就是 3 个 if else。

用代码写出来就是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f795a70851b141e3a790f95fb610c92d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=844&h=682&s=133340&e=png&b=1f1f1f)

```javascript
let payloadLength = parseInt(str2.substring(1), 2);

let curByteIndex = 2;

if (payloadLength === 126) {
  payloadLength = bufferData.readUInt16BE(2);
  curByteIndex += 2;
} else if (payloadLength === 127) {
  payloadLength = bufferData.readBigUInt64BE(2);
  curByteIndex += 8;
}
```
这里的 curByteIndex 是存储当前处理到第几个字节的。

如果是 126，那就从第 3 个字节开始，读取 2 个字节也就是 16 位的长度，用 buffer.readUInt16BE 方法。

如果是 127，那就从第 3 个字节开始，读取 8 个字节也就是 64 位的长度，用 buffer.readBigUInt64BE 方法。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3826c3ca5a54ed7877bbbf35d572d79~tplv-k3u1fbpfcp-watermark.image?)

这样就拿到了 payload 的长度，然后再用这个长度去截取内容就好了。

但在读取数据之前，还有个 mask 要处理，这个是用来给内容解密的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27395e22f9a64d4e84c1df5831c29af7~tplv-k3u1fbpfcp-watermark.image?)

读 4 个字节，就是 mask key。

再后面的就可以根据 payload 长度读出来。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7658325b7184ca29052ab1683c31b37~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1274&h=1002&s=211039&e=png&b=1f1f1f)
```javascript
let realData = null;

if (MASK) {
  const maskKey = bufferData.slice(curByteIndex, curByteIndex + 4);  
  curByteIndex += 4;
  const payloadData = bufferData.slice(curByteIndex, curByteIndex + payloadLength);
  realData = handleMask(maskKey, payloadData);
} else {
  realData = bufferData.slice(curByteIndex, curByteIndex + payloadLength);;
}
```
然后用 mask key 来解密数据。

这个算法也是固定的，用每个字节的 mask key 和数据的每一位做按位异或就好了：

```javascript
function handleMask(maskBytes, data) {
  const payload = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) {
    payload[i] = maskBytes[i % 4] ^ data[i];
  }
  return payload;
}
```
这样，我们就拿到了最终的数据！

但是传给处理程序之前，还要根据类型来处理下，因为内容分几种类型，也就是 opcode 有几种值：

```javascript
const OPCODES = {
  CONTINUE: 0,
  TEXT: 1, // 文本
  BINARY: 2, // 二进制
  CLOSE: 8,
  PING: 9,
  PONG: 10,
};
```

我们只处理文本和二进制就好了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/771a6c91a0ca4c06b538affb5fd2a4cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=942&h=964&s=127832&e=png&b=1f1f1f)

```javascript
handleRealData(opcode, realDataBuffer) {
    switch (opcode) {
      case OPCODES.TEXT:
        this.emit('data', realDataBuffer.toString('utf8'));
        break;
      case OPCODES.BINARY:
        this.emit('data', realDataBuffer);
        break;
      default:
        this.emit('close');
        break;
    }
}
```
文本就转成 utf-8 的字符串，二进制数据就直接用 buffer 的数据。

这样，处理程序里就能拿到解析后的数据。

我们来试一下：

之前我们已经能拿到 weboscket 协议内容的 buffer 了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/986ae0fe1860438089a8c4077b11086c~tplv-k3u1fbpfcp-watermark.image?)

而现在我们能正确解析出其中的数据：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b8c4d7d06e548e19f2a270c0911ae6e~tplv-k3u1fbpfcp-watermark.image?)

至此，我们 websocket 协议的解析成功了！

这样的协议格式的数据叫做 frame，也就是帧：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c0858debd3d456f9280491f8bd0183b~tplv-k3u1fbpfcp-watermark.image?)

解析可以了，接下来我们再实现数据的发送。

发送也是构造一样的 frame 格式。

定义这样一个 send 方法：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a52f2e34f444b3f8be01a90fb04146e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050&h=900&s=175121&e=png&b=1f1f1f)
```javascript
send(data) {
    let opcode;
    let buffer;
    if (Buffer.isBuffer(data)) {
      opcode = OPCODES.BINARY;
      buffer = data;
    } else if (typeof data === 'string') {
      opcode = OPCODES.TEXT;
      buffer = Buffer.from(data, 'utf8');
    } else {
      console.error('暂不支持发送的数据类型')
    }
    this.doSend(opcode, buffer);
}

doSend(opcode, bufferDatafer) {
   this.socket.write(encodeMessage(opcode, bufferDatafer));
}
```

根据发送的是文本还是二进制数据来对内容作处理。

然后构造 websocket 的 frame：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8204b6730fea4c80afd363dd0b31fc45~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1142&h=994&s=177010&e=png&b=1f1f1f)
```javascript
function encodeMessage(opcode, payload) {
  //payload.length < 126
  let bufferData = Buffer.alloc(payload.length + 2 + 0);;
  
  let byte1 = parseInt('10000000', 2) | opcode; // 设置 FIN 为 1
  let byte2 = payload.length;

  bufferData.writeUInt8(byte1, 0);
  bufferData.writeUInt8(byte2, 1);

  payload.copy(bufferData, 2);
  
  return bufferData;
}
```
我们只处理数据长度小于 125 的情况。

第一个字节是 opcode，我们把第一位置 1 ，通过按位或的方式。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/321a0f569d23446c858afad9347232df~tplv-k3u1fbpfcp-watermark.image?)

服务端给客户端回消息不需要 mask，所以第二个字节就是 payload 长度。

分别把这前两个字节的数据写到 buffer 里，指定不同的 offset：

```javascript
bufferData.writeUInt8(byte1, 0);
bufferData.writeUInt8(byte2, 1);
```
之后把 payload 数据放在后面：

```javascript
 payload.copy(bufferData, 2);
```
这样一个 websocket 的 frame 就构造完了。

我们试一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0803bb0e24034191973a497395c1ff56~tplv-k3u1fbpfcp-watermark.image?)

收到客户端消息后，每两秒回一个消息。


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cac293a1bb7f47cca0fe4743dbcc9160~tplv-k3u1fbpfcp-watermark.image?)

收发消息都成功了！

就这样，我们自己实现了一个 websocket 服务器，实现了 websocket 协议的解析和生成！

完整代码如下：

MyWebSocket:

```javascript
//ws.js
const { EventEmitter } = require('events');
const http = require('http');
const crypto = require('crypto');

function hashKey(key) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
  return sha1.digest('base64');
}

function handleMask(maskBytes, data) {
  const payload = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) {
    payload[i] = maskBytes[i % 4] ^ data[i];
  }
  return payload;
}

const OPCODES = {
  CONTINUE: 0,
  TEXT: 1,
  BINARY: 2,
  CLOSE: 8,
  PING: 9,
  PONG: 10,
};

function encodeMessage(opcode, payload) {
  //payload.length < 126
  let bufferData = Buffer.alloc(payload.length + 2 + 0);;
  
  let byte1 = parseInt('10000000', 2) | opcode; // 设置 FIN 为 1
  let byte2 = payload.length;

  bufferData.writeUInt8(byte1, 0);
  bufferData.writeUInt8(byte2, 1);

  payload.copy(bufferData, 2);
  
  return bufferData;
}

class MyWebsocket extends EventEmitter {
  constructor(options) {
    super(options);

    const server = http.createServer();
    server.listen(options.port || 8080);

    server.on('upgrade', (req, socket) => {
      this.socket = socket;
      socket.setKeepAlive(true);

      const resHeaders = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        'Sec-WebSocket-Accept: ' + hashKey(req.headers['sec-websocket-key']),
        '',
        ''
      ].join('\r\n');
      socket.write(resHeaders);

      socket.on('data', (data) => {
        this.processData(data);
        // console.log(data);
      });
      socket.on('close', (error) => {
          this.emit('close');
      });
    });
  }

  handleRealData(opcode, realDataBuffer) {
    switch (opcode) {
      case OPCODES.TEXT:
        this.emit('data', realDataBuffer.toString('utf8'));
        break;
      case OPCODES.BINARY:
        this.emit('data', realDataBuffer);
        break;
      default:
        this.emit('close');
        break;
    }
  }

  processData(bufferData) {
    const byte1 = bufferData.readUInt8(0);
    let opcode = byte1 & 0x0f; 
    
    const byte2 = bufferData.readUInt8(1);
    const str2 = byte2.toString(2);
    const MASK = str2[0];

    let curByteIndex = 2;
    
    let payloadLength = parseInt(str2.substring(1), 2);
    if (payloadLength === 126) {
      payloadLength = bufferData.readUInt16BE(2);
      curByteIndex += 2;
    } else if (payloadLength === 127) {
      payloadLength = bufferData.readBigUInt64BE(2);
      curByteIndex += 8;
    }

    let realData = null;
    
    if (MASK) {
      const maskKey = bufferData.slice(curByteIndex, curByteIndex + 4);  
      curByteIndex += 4;
      const payloadData = bufferData.slice(curByteIndex, curByteIndex + payloadLength);
      realData = handleMask(maskKey, payloadData);
    } 
    
    this.handleRealData(opcode, realData);
  }

  send(data) {
    let opcode;
    let buffer;
    if (Buffer.isBuffer(data)) {
      opcode = OPCODES.BINARY;
      buffer = data;
    } else if (typeof data === 'string') {
      opcode = OPCODES.TEXT;
      buffer = Buffer.from(data, 'utf8');
    } else {
      console.error('暂不支持发送的数据类型')
    }
    this.doSend(opcode, buffer);
  }

  doSend(opcode, bufferDatafer) {
    this.socket.write(encodeMessage(opcode, bufferDatafer));
  }
}

module.exports = MyWebsocket;
```
Index：

```
const MyWebSocket = require('./ws');
const ws = new MyWebSocket({ port: 8080 });

ws.on('data', (data) => {
  console.log('receive data:' + data);
  setInterval(() => {
    ws.send(data + ' ' + Date.now());
  }, 2000)
});

ws.on('close', (code, reason) => {
  console.log('close:', code, reason);
});
```
html:
```html
<!DOCTYPE HTML>
<html>
<body>
    <script>
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = function () {
            ws.send("发送数据");
            setTimeout(() => {
                ws.send("发送数据2");
            }, 3000)
        };

        ws.onmessage = function (evt) {
            console.log(evt)
        };

        ws.onclose = function () {
        };
    </script>
</body>

</html>
```
案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/my-websocket)。
## 总结

实时性较高的需求，我们会用 websocket 实现，比如即时通讯、游戏等场景。

websocket 和 http 没什么关系，但从 http 到 websocket 需要一次切换的过程。

这个切换过程除了要带 upgrade 的 header 外，还要带 sec-websocket-key，服务端根据这个 key 算出结果，通过 sec-websocket-accept 返回。响应是 101 Switching Protocols 的状态码。

这个计算过程比较固定，就是 key + 固定的字符串 通过 sha1 加密后再 base64 的结果。

加这个机制是为了确保对方一定是 websocket 服务器，而不是随意返回了个 101 状态码。

之后就是 websocket 协议了，这是个二进制协议，我们根据格式完成了 websocket 帧的解析和生成。

这样就是一个完整的 websocket 协议的实现了。

我们自己手写了一个 websocket 服务，有没有感觉对 websocket 的理解更深了呢？
