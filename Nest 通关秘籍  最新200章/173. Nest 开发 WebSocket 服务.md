我们最常用的网络协议是 HTTP，它是一问一答的模式，客户端发送请求，服务端返回响应。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6da9b16984df497f885b585c1a0ae229~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=682&s=56511&e=png&b=ffffff)

有时候也会用 Server Sent Event，它是基于 HTTP 的，客户端发送请求，服务端返回 text/event-stream 类型的响应，可以多次返回数据。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d99ee4d7ad0471db06cb16280001d77~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1294&h=832&e=png&b=ffffff)


但是 HTTP 不能服务端向客户端推送数据，SSE 适合一次请求之后服务端多次推送数据的场景。

类似聊天室这种，需要实时的双向通信的场景，还是得用 WebSocket。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d77dfe73e74d4fac89f8747266c01cd1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1260&h=810&e=png&b=ffffff)

在 Nest 里实现 WebSocket 的服务还是很简单的。

我们创建个项目：

```
nest new nest-websocket
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72fad8b1901b45c5bb0b76b2dac096eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=954&h=698&s=164649&e=png&b=010101)

进入项目，安装用到的包：

```
npm i --save @nestjs/websockets @nestjs/platform-socket.io
```
然后创建个 websocket 模块：

```
nest g resource aaa
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/935142a52e374c62859b0127dc3c8b37~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=958&h=426&s=107584&e=png&b=191919)

生成的代码很容易看懂：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee0f45755ff4410998795c9f1da2d632~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1170&h=1130&s=280664&e=png&b=1f1f1f)

@WebSocketGateWay 声明这是一个处理 weboscket 的类。

默认的端口和 http 服务 app.listen 的那个端口一样。

然后 @SubscribeMessage 是指定处理的消息。

通过 @MessageBody 取出传过来的消息内容。

分别声明了 find、create、update、remove 这些 CRUD 的消息类型。

具体的实现在 AaaService 里：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74be7181e8674a7a9003afdd10100178~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=1008&s=182754&e=png&b=1f1f1f)

然后我们加一下客户端代码，跑起来试试。

添加 pages/index.html

```html
<html>
  <head>
    <script src="https://cdn.socket.io/4.3.2/socket.io.min.js" integrity="sha384-KAZ4DtjNhLChOB/hxXuKqhMLYvx3b5MlT55xPEiNmREKRzeEm+RVPlTnAn0ajQNs" crossorigin="anonymous"></script>
    <script>
      const socket = io('http://localhost:3000');
      socket.on('connect', function() {
        console.log('Connected');

        socket.emit('findAllAaa', response =>
          console.log('findAllAaa', response),
        );

        socket.emit('findOneAaa', 1, response =>
          console.log('findOneAaa', response),
        );

        socket.emit('createAaa', {name: 'guang'},response =>
          console.log('createAaa', response),
        );

        socket.emit('updateAaa',{id: 2, name: 'dong'},response =>
          console.log('updateAaa', response),
        );

        socket.emit('removeAaa', 2,response =>
          console.log('removeAaa', response),
        );
      });
      socket.on('disconnect', function() {
        console.log('Disconnected');
      });
    </script>
  </head>

  <body></body>
</html>
```

这段代码也比较容易看懂，就是用 socket.io 来连接 ws 服务端。

connect 之后，分别发送 find、remove、update 等消息。

然后在 main.ts 里支持下这个 pages 静态目录的访问：

```javascript
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('pages');
  await app.listen(3000);
}
bootstrap();
```

把服务跑起来：

```
npm run start:dev
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e54288524c5c458e8f1623883f190333~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1776&h=554&s=243746&e=png&b=181818)

浏览器访问下 http://localhost:3000

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1888dd8944bd4cd08a59579a9320e825~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=978&h=972&s=97892&e=png&b=fefefe)

可以看到，CRUD 方法都有了正确的响应。

在 Nest 里写 WebSocket 服务就这么简单。

那如果响应接受和返回消息不想用同样的名字呢？

这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a362ed2d7e74839a5f384da5de5a078~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=912&h=610&s=127164&e=png&b=202020)

分别指定 event 和 data。

这时候原来的代码就收不到 findAll 返回的消息了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66f6642d80544f7e8d4e93cfe4a5787c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=986&h=956&s=90176&e=png&b=fefefe)

因为返回的消息是 guang，可以加一下这个事件的监听：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/296d293e676742c987b55aa8057d1905~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=806&h=482&s=97323&e=png&b=1f1f1f)

```javascript
socket.on('guang', function(data) {
    console.log('guang', data);
});
```
这样就收到消息了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46ac2ba29cbb43f0a221e5bd705bf35d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=966&h=962&s=95949&e=png&b=fefefe)

那如果我不是马上发送消息，而是过几秒再发呢？

这就要返回 rxjs 的 Observer 了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1468d5c160148178c339270825e02e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1120&h=810&s=160555&e=png&b=1f1f1f)

```javascript
@SubscribeMessage('findAllAaa')
findAll() {
    return new Observable((observer) => {
      observer.next({ event: 'guang', data: { msg: 'aaa'} });

      setTimeout(() => {
        observer.next({ event: 'guang', data: { msg: 'bbb'} });
      }, 2000);

      setTimeout(() => {
        observer.next({ event: 'guang', data: { msg: 'ccc'} });
      }, 5000);
    });
}
```

测试下：

可以看到，2s、5s 的时候，收到了服务端传过来的消息。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e6bb22a986b4fb39c2def618eff5561~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=922&h=672&s=65781&e=gif&f=27&b=fefefe)

有这些就足够用了，websocket 是用来双向实时通信的。

当然，如果你想用具体平台的 api，也可以注入实例。

安装 socket.io（Nest 默认使用 socket.io 包实现 WebSocket 功能）
```
npm install socket.io
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cf4aba85c7045d78df8519a16986f39~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1198&h=856&s=207195&e=png&b=1f1f1f)

```javascript
@SubscribeMessage('findOneAaa')
findOne(@MessageBody() id: number, @ConnectedSocket() server: Server) {

    server.emit('guang', 666);
    return this.aaaService.findOne(id);
}
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/593aa19c68f244019cab9c2455f0c933~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=816&h=762&s=58989&e=png&b=ffffff)

这样也可以，但是和具体的平台耦合了，不建议这样写。

除了 @ConnectedSocket 装饰器注入实例，也可以用 @WebSocketServer 注入实例：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1d9098eaae24585b6c7701ad6a1453e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=996&h=734&s=187879&e=png&b=1f1f1f)

```javascript
@WebSocketServer()
server: Server;

@SubscribeMessage('createAaa')
create(@MessageBody() createAaaDto: CreateAaaDto) {
    this.server.emit('guang', 777);
    return this.aaaService.create(createAaaDto);
}
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/417aaf0a8e7e44fc9ef65e903f8d15a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=780&h=850&s=68755&e=png&b=fefefe)

同样，也是不建议用的。

此外，服务端也有 connected、disconnected 等生命周期函数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/831abbd32acd42c890ec043663ee9385~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1390&h=446&s=92366&e=png&b=1f1f1f)
```javascript
@WebSocketGateway()
export class AaaGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  handleDisconnect(client: Server) {
  }

  handleConnection(client: Server, ...args: any[]) {
  }
    
  afterInit(server: Server) {
  }
}
```
分别实现 OnGatewayInit、OnGatewayConnection、OnGatewayDisconnect 接口。

在生命周期函数里可以拿到实例对象。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/nest-websocket)。

## 总结

这节我们学习了 Nest 实现 WebSocket 服务。

需要用到 @nestjs/websockets 和 @nestjs/platform-socket.io 包。

涉及到这些装饰器：

- @WebSocketGateWay：声明这是一个处理 weboscket 的类。

- @SubscribeMessage：声明处理的消息。

- @MessageBody：取出传过来的消息内容。

- @WebSocketServer：取出 Socket 实例对象

- @ConnectedSocket：取出 Socket 实例对象注入方法

客户端也是使用 socket.io 来连接。

如果想异步返回消息，就通过 rxjs 的 Observer 来异步多次返回。

整体来说，Nest 里用 WebSocket 来做实时通信还是比较简单的。
