我们已经知道，Node.js 运行时环境是**单线程非阻塞**的，与多线程相比，单线程模型能够免系统分配多线程以及线程间通信时的开销，可以更高效的利用 CPU，降低内存的耗用。但是单线程也有缺点，比如无法充分利用现在绝大多数电脑支持的多核 CPU，以及一旦出现错误就会导致服务崩溃。

因此，Node.js 也提供了 Cluster（集群）内置模块，以 Cluster 模块来管理多个进程（注意，是**多进程**不是多线程），可以弥补对多线程模型的缺失，避免单线程的缺点。

Cluster 模块对 HTTP 服务非常有用，因为多进程模型可以提高服务器处理请求的吞吐率，而且一个进程挂了，不会导致整个服务崩溃，也相当于提升了服务的稳定性。

Cluster 的多进程模型，使用主进程来管理子进程，并将请求分配到子进程中，每个子进程的请求处理逻辑并没有太大的改变，所以我们可以在之前已经实现的 HTTP 服务器模型上添加 Cluster，而几乎不用修改之前已经实现的拦截切面和各个逻辑模块。

这一节课，我们就来学习如何使用 Cluster 模块，实现多进程的 HTTP 服务器。

## 多进程 HTTP 服务

首先，我们在 server.js 模块中引入 Cluster 模块：

```js
const http = require('http');
const cluster = require('cluster');
const cpuNums = require('os').cpus().length; // 获得CPU的内核数
const Interceptor = require('./interceptor.js');

module.exports = class {
  constructor({instances = 1, enableCluster = true} = {}) {
    this.instances = instances || cpuNums; // 指定启动几个进程，默认启动和cpu的内核数一样多的进程
    this.enableCluster = enableCluster; // 是否启动多进程服务
    const interceptor = new Interceptor();

    this.server = http.createServer(async (req, res) => {
      await interceptor.run({req, res});
      if(!res.writableFinished) {
        let body = res.body || '200 OK';
        if(body.pipe) {
          body.pipe(res);
        } else {
          if(typeof body !== 'string' && res.getHeader('Content-Type') === 'application/json') {
            body = JSON.stringify(body);
          }
          res.end(body);
        }
      }
    });

    this.server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });

    this.interceptor = interceptor;
  }

  listen(opts, cb = () => {}) {
    if(typeof opts === 'number') opts = {port: opts};
    opts.host = opts.host || '0.0.0.0';
    const instances = this.instances;

    if(this.enableCluster && cluster.isMaster) { // 如果是主进程，创建instance个子进程
      for(let i = 0; i < instances; i++) {
        cluster.fork(); // 创建子进程
      }

      // 主进程监听exit事件，如果发现有某个子进程停止了，那么重新创建一个子进程
      cluster.on('exit', (worker, code, signal) => {
        console.log('worker %d died (%s). restarting...',
          worker.process.pid, signal || code);
        cluster.fork();
      });
    } else { // 如果当前进程是子进程
      this.worker = cluster.worker;
      console.log(`Starting up http-server
      http://${opts.host}:${opts.port}`);
      this.server.listen(opts, () => cb(this.server));
    }
  }

  use(aspect) {
    return this.interceptor.use(aspect);
  }
};
```

如上面代码所示，将之前的 server.js 模块改造成支持多进程模式，实际的改动并不大。在构造器函数中，我们只是定义了一些与多进程相关的设置：`this.instance`指定开启几个进程，默认为 CPU 内核数；`this.enableCluster`表示是否开启多进程模式，默认为多进程模式。

主要的变化是在 listen 函数中，我们依靠`cluster.isMaster`来判断当前进程是主进程还是子进程。在 Cluster 多进程模型中，有一个主进程被称为 Master，其他若干个子进程被称为 Worker。Cluster 通过 Master 管理 Worker。所以，这里我们可以通过`cluster.isMaster`判断进程是否为主进程。

如果当前进程是主进程，就由这个主进程创建`instance`个子进程。`cluster.fork()`方法表示创建一个子进程，每次调用 fork 方法，Node.js 运行时就会启动一个新的进程。同时，主进程还监听`exit`事件，如果发现某个子进程停止了，就新建一个子进程，不需要停止服务器。

如果当前进程是子进程，那么我们执行`this.server.listen`方法让子进程监听 HTTP 请求。注意，这里的每个子进程监听请求的端口是相同的。由于 Cluster 做了处理，监听是由主进程进行，再由主进程将 HTTP 请求分发给每个子进程，所以子进程尽管监听端口相同，也并不会造成端口冲突。同时，在每个子进程中，我们将 Worker 对象（子进程对象）添加到 server 实例上。这样一来，在每个子进程中通过 app.workder 就会得到当前进程对象，这可以用在多个子进程需要同步消息的时候。

修改了`server.js`之后，我们写一段简单的服务器代码（index.js），看看多进程服务器是如何工作的。代码如下：

```js
const Server = require('./lib/server');
const Router = require('./lib/middleware/router');

const app = new Server({instances: 0}); 

const router = new Router();

app.use(async (ctx, next) => {
  console.log(`visit ${ctx.req.url} through worker: ${app.worker.process.pid}`);
  await next();
});

app.use(router.all('.*', async ({req, res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Hello world</h1>';
  await next();
}));

app.listen({
  port: 9090,
  host: '0.0.0.0',
});
```

虽然我们把 server.js 模式改为了 Cluster 模式，但它们的使用方式几乎没有什么差别，依然是通过`const app = new Server({instances: 0});`创建一个基于 CPU 内核数的多进程服务。

![](https://p3.ssl.qhimg.com/t01bb2c64a488abfed8.jpg)

因为我的电脑是 8 核的 CPU，所以 server 一共启动了 8 个子进程（也就是 8 份 index.js 进程）。如图所示：

![](https://p3.ssl.qhimg.com/t017f9c70268d9f5a26.jpg)

然后，我们开启两个浏览器窗口分别访问`localhost:9090/abc`。这里我们可以看到，Cluster 将请求分配到了不同的进程去处理。

![](https://p3.ssl.qhimg.com/t01b9e30a2be757cf7e.jpg)

现在，我们的多进程服务器就搭建好了，接下来再看看进程之间是如何同步数据的。

## 进程间的数据同步

**和线程不同，进程是彼此独立的，它们之间并不能通过共享同样的内存而共享数据。**

不过，我们一般也不需要直接共享内存数据，所以大多数情况下这个多线程模型已经足够我们使用了。但如果我们需要在各个进程之间共享一些信息，比如再进行一些特殊的初始化操作时，我们可能不想或者不方便放到主进程执行，而是通过某个子进程执行，再通知其他进程。在这种特殊的情况下，我们就需要一种机制将消息从一个进程通知给其他进程。下面，我们就来看看进程间是如何通信的。

首先，我们在 index.js 中添加一个统计 HTTP 请求次数的拦截切面。

```js
// 统计访问次数
app.use(async (ctx, next) => {
  process.send('count');
  await next();
});
```

Node.js 提供的`process.send`方法允许我们在进程间传递消息，比如`worker.on('message', callback)`可以让子进程监听接收到的消息。这样，我们就可以在主进程中监听子进程发送的消息。

接着，我们修改 server.js，让主进程能够监听到这个事件，并派发给其它子进程。

```js
  listen(opts, cb = () => {}) {
    ...

    if(this.enableCluster && cluster.isMaster) {
      
      ...

      let count = 0;
      Object.entries(cluster.workers).forEach(([id, worker]) => {
        worker.on('message', (msg) => {
          if(msg === 'count') {
            count++;
            console.log('visit count %d', count);
          }
        });
      });
    } 

    ...
  }
```

如上代码所示，在主进程中我们通过遍历 cluster.workers，可以访问各个子进程对象（Worker)，然后我们为每个子进程添加 on message 事件监听器。这样一来，每个子进程就能通过主进程监听来自`process.send`方法的消息了。下图直观地展示了进程间信息的传递过程：

![](https://p4.ssl.qhimg.com/t018db6bd1bccfbd3df.jpg)


但是，这种实现方式也有局限性。当接收的消息不同时，我们需要修改所有 server模块，无法通用。所以最好的办法是让主进程（Master）将消息广播给所有的 Worker 进程，再让 Worker 进程自己去处理。

```js
  listen(opts, cb = () => {}) {

    ...

    function broadcast(message) { // eslint-disable-line no-inner-declarations
      Object.entries(cluster.workers).forEach(([id, worker]) => {
        worker.send(message);
      });
    }

    // 广播消息
    Object.keys(cluster.workers).forEach(([id, worker]) => {
      workder.on('message', broadcast);
    });

    ...
  }
```

如上代码所示，当主进程接收到消息后，将消息通过 broadcast 方法广播给其它子进程，broadcast 方法通过`worker.send`方法将消息送到自己的进程中去处理。

然后，在 index.js 中，我们添加一个`process.on('message')`的监听器，监听来自`work.send`发来的消息。

```js
const app = new Server({instances: 0, mode: 'development'});

...

let count = 0;
process.on('message', (msg) => { // 处理由worker.send发来的消息
  if (msg === 'count') { // 如果是count事件，则将count加一
    console.log('visit count: %d', ++count);
  }
});

...
```

这样，我们就不需要为每一个事件修改 server.js 模块，只需要在每个子进程的 index.js 模块中为不同的事件进行相应的处理。

## 实时热更新服务器

使用多进程模型还有一个额外的好处。我们之前实现的 HTTP 服务器其实有一个问题，那就是如果我们修改了服务端的 JS 代码，需要重启 HTTP 服务，否则不能立即更新。但现在我们有了多进程模型，可以在主进程中监听 JS 文件变化，如果 JS 文件发生改变，我们可以结束之前的子进程，重新创建新的子进程，这样就可以在开发模式下热更新服务器了。

我们再修改一下 server.js 模块，添加一个 mode 参数，默认为 production（生产模式），如果设置为 development（开发模式），那么我们强制设置 instances 为 1，表示只启动一个 Worker 进程（也就是一个子进程），且 enableCluster 设置 true。然后，在listen方法里，我们通过`fs.watch`方法监听文件内容的变化，如果文件被修改，那么我们通过`worker.kill`方法将子进程杀死，然后通过`cluster.fork`重新创建一个新的子进程，因为子进程会重新加载模块，也就会加载修改过的 js 文件，这样就实现了简单的代码热更新。改造后，完整的 server.js 代码如下：

```js
const http = require('http');
const cluster = require('cluster');
const cpuNums = require('os').cpus().length;
const Interceptor = require('./interceptor.js');

module.exports = class {
  constructor({instances = 1, enableCluster = true, mode = 'production'} = {}) {
    if(mode === 'development') {
      instances = 1; // 在开发模式下，为了提高开发速度，只启动一个worker进程
      enableCluster = true;
    }
    this.mode = mode; // production / development
    
    ...

  }

  listen(opts, cb = () => {}) {
    if(typeof opts === 'number') opts = {port: opts};
    opts.host = opts.host || '0.0.0.0';
    const instances = this.instances;
    if(this.enableCluster && cluster.isMaster) {
      for(let i = 0; i < instances; i++) {
        cluster.fork();
      }

      function broadcast(message) { // eslint-disable-line no-inner-declarations
        Object.entries(cluster.workers).forEach(([id, worker]) => {
          worker.send(message);
        });
      }

      // 广播消息
      Object.keys(cluster.workers).forEach((id) => {
        cluster.workers[id].on('message', broadcast);
      });

      /* 如果是开发模式，监听js文件是否修改：
      如果文件有变化，则杀死所有子进程（即worker进程），并重新启动一个新的子进程。*/
      if(this.mode === 'development') { 
        require('fs').watch('.', {recursive: true}, (eventType) => { // 监听js文件是否更新
          if(eventType === 'change') { // 如果
            Object.entries(cluster.workers).forEach(([id, worker]) => {
              console.log('kill workder %d', id);
              worker.kill();
            });
            cluster.fork();
          }
        });
      } else { // 如果在production模式下，则不能热更新：
        cluster.on('exit', (worker, code, signal) => {
          console.log('worker %d died (%s). restarting...',
            worker.process.pid, signal || code);
          cluster.fork();
        });
      }
    } else {
      this.worker = cluster.worker;
      console.log(`Starting up http-server
      http://${opts.host}:${opts.port}`);
      this.server.listen(opts, () => cb(this.server));
    }
  }

  use(aspect) {
    return this.interceptor.use(aspect);
  }
};
```

## 小结

Node.js 的内置模块 Cluster 可以让我们实现多进程的 HTTP 服务器。我们可以指定或者根据服务器 CPU 的内核数，通过`cluster.fork`方法创建多个 HTTP 服务子进程。同时，通过`cluster.on('exit')`监听是否有子进程退出，如果发现有某个子进程退出，就重新创建一个新的子进程。

由于进程之间并不能通过共享同样的内存而共享数据，因此多进程之间的通信需要通过`process.send`方法来完成。当一个子进程向主进程发送消息后，主进程会将这个消息转发给其它的子进程，这样就能达到多进程间数据同步了。

总的来说，多进程有三个优点：一是能够充分利用计算机的多核 CPU 来处理用户的请求，提高服务器的响应速度；二是如果其中某个子进程挂了，服务器可以通过主进程重新启动一个子进程，增加了系统的稳定性；三是我们可以利用第二个优点在开发过程中实现文件的热更新，提高开发的效率。