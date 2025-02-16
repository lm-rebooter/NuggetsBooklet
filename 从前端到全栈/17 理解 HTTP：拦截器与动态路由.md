前面几节课，我们借助 http、url、path、fs、zlib 等内置模块，以及 mime 第三方模块，以非常简单的代码实现了处理静态资源的 HTTP 服务的大致功能。这一节课，我们将实现更加复杂的动态部分。

在开始学习之前，我们首先要弄清楚什么是静态 HTTP 服务和动态 HTTP 服务。

**静态 HTTP 服务**是指不需要任何业务逻辑处理的，直接返回与请求 URL 对应的文件（这里的文件包括了图片、音频、视频、html 文件等等）。而**动态 HTTP 服务**是指需要根据不同的请求信息（如路径、query 等），将请求分配给不同的模块进行相应的业务逻辑处理，然后将结果返回给客户端。

静态服务的处理逻辑简单，全部功能加起来也就五六十行代码，所以我们没有必要使用任何特别的设计和封装。相比静态服务，动态 HTTP 服务要复杂得多，因为它需要对请求信息进行解析，分配相应的模块并处理数据，所以有必要进行架构设计。

目前比较流行的 Node.js HTTP 服务框架的架构采用了拦截器模式，这种模式将 HTTP 请求响应的过程分为若干切面，每个切面上进行一项或若干项关联的操作。比如说，我们可以通过不同的拦截切面处理用户信息验证、会话（session）验证、表单数据验证、query 解析，或者业务逻辑处理等等。这种架构设计让切面与切面之间彼此独立，有其可取之处。

接下来，我们就使用这种拦截器模式来设计我们的动态 HTTP 服务器。在这个过程中，大家可以体会这种模式的优点。

## 设计一个拦截器

拦截器是由很多个拦截切面构成。所谓拦截切面实际上是一个函数，它的函数签名如下：

```js
async (ctx, next) => {
  do sth...
}
```

它有两个参数。第一个参数是一个上下文，这个上下文在多个拦截切面中是共享的。第二个参数是一个 next 函数，调用它会进入下一个拦截切面。


接下来，我们实现一个拦截器模块（interceptor.js）：

```js
class Interceptor {
  constructor() {
    this.aspects = []; // 用于存储拦截切面
  }

  use(/* async */ functor) { // 注册拦截切面
    this.aspects.push(functor);
    return this;
  }

  async run(context) { // 执行注册的拦截切面
    const aspects = this.aspects;

    // 将注册的拦截切面包装成一个洋葱模型
    const proc = aspects.reduceRight(function (a, b) { // eslint-disable-line
      return async () => {
        await b(context, a);
      };
    }, () => Promise.resolve());

    try {
      await proc(); //从外到里执行这个洋葱模型
    } catch (ex) {
      console.error(ex.message);
    }

    return context;
  }
}

module.exports = Interceptor;
```


这段代码只有二三十行，却运用了函数式编程的思想实现了能够注册多个拦截切面函数，并将这些拦截切面包装成一个异步的洋葱模型的拦截器框架。

其中，`use`方法将拦截切面存入 aspects 数组。`run`方法通过数组的 reduceRight 方法迭代 aspects 数组，将所有注册的拦截切面拼接成异步调用嵌套的洋葱模式并执行它。此时你可能会对这段代码感到困惑，没有关系，我们通过一个简单的例子来理解这个框架是如何拼接和执行所有拦截切面的。


```js
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const inter = new Interceptor();

const task = function(id) {
  return async (ctx, next) => {
    console.log(`task ${id} begin`);
    ctx.count++;
    await wait(1000);
    console.log(`count: ${ctx.count}`);
    await next();
    console.log(`task ${id} end`);
  };
}

// 将多个任务以拦截切面的方式注册到拦截器中
inter.use(task(0));
inter.use(task(1));
inter.use(task(2));
inter.use(task(3));
inter.use(task(4));

// 从外到里依次执行拦截切面
inter.run({count: 0});
```

首先，我们给拦截器注册了 5 个拦截切面，分别是 task0 到 task4 。当我们调用 run 方法时，这 5 个拦截切面被拼接为如下形式，即 `proc`：

![](https://p5.ssl.qhimg.com/t01a3d5a2fc20b65cda.jpg)

然后，执行这个异步洋葱模型，它的输出结果如下：

```
"task 0 begin"
"count: 1"
"task 1 begin"
"count: 2"
"task 2 begin"
"count: 3"
"task 3 begin"
"count: 4"
"task 4 begin"
"count: 5"
"task 4 end"
"task 3 end"
"task 2 end"
"task 1 end"
"task 0 end"
```

可以看到，这是一个层层深入的异步嵌套调用模型，但写法上却是同步的写法。拦截器通过 use 方法将不同业务逻辑的拦截切面串联起来，然后通过 run 方法依次执行。当然，我们还可以使用`try...catch`，使得其中一个拦截切面执行失败，就阻止后续拦截切面继续运行：

```js
const task = function(id) {
  return async (ctx, next) => {
    try {
      console.log(`task ${id} begin`);
      ctx.count++;
      await wait(1000);
      console.log(`count: ${ctx.count}`);
      await next();
      console.log(`task ${id} end`);
    } catch(ex) {
      throw new Error(ex);
    }
  };
}
```

现在，我们可以用拦截器来改进一下 HTTP 服务器了：

```js
const http = require('http');
const Interceptor = require('./interceptor.js');

module.exports = class {
  constructor() {
    const interceptor = new Interceptor();

    this.server = http.createServer(async (req, res) => {
      await interceptor.run({req, res}); // 执行注册的拦截函数
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
    console.log(`Starting up http-server
    http://${opts.host}:${opts.port}`);
    this.server.listen(opts, () => cb(this.server));
  }

  use(aspect) { // 向http服务器添加不同功能的拦截切面
    return this.interceptor.use(aspect);
  }
};
```

如上代码所示，我们在 HTTP 服务的构造函数中初始化拦截器，并开放`use`接口，允许用户将不同功能的拦截函数添加到服务器中，比如用户信息验证、表单数据验证、业务逻辑处理等等。当服务器接收到请求数据，就会根据上下文`{req, res}`依次执行拦截器中的每个拦截函数。

现在，我们启动这个服务：

```js
const Server = require('./lib/server');

const app = new Server();

app.listen({
  port: 9090,
  host: '0.0.0.0',
});

// 未添加任何拦截函数
```

现在访问`http://localhost:9090`，浏览器返回的内容是文本`200 OK`，这是因为我们现在还没有添加拦截器。

然后，我们增加一个拦截器：

```js
const Server = require('./lib/server');

const app = new Server();

// 添加拦截切面
app.use(async ({res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Hello world</h1>';
  await next();
});

app.listen({
  port: 9090,
  host: '0.0.0.0',
});
```

如上代码所示，我们向服务器添加了一个非常简单的拦截切面 —— 返回“hello world”HTML 文本。这时再启动服务器，我们就能在浏览器上看到“hello world”的网页了。

当然，上面的例子并不能体现拦截器的好处。但在实际业务处理中，拦截器确是非常有用的。比如，我们有一个业务需求：授权的用户提交申请表单，可以查看数据。这时，我们可以将这个业务需求切分为 3 个切面：用户信息验证、表单信息验证、查询业务数据并返回。如果用户信息验证的切面不能通过，那么后面 2 个切面就不会执行。一个项目中，用户信息验证可能在很多业务逻辑中都用到，那么**这个拦截切面还可以被共用，避免了代码的冗余**。所以拦截器的好处至少有两个：**控制业务流程和复用功能模块**。

当然，我们也可以创建一个用户信息验证的拦截切面，比如：

```js
app.use(async ({res}, next) => {
  // 验证用户信息，成功继续执行
  await next();

  // 如果失败，暂停剩下的拦截切面的执行
});
```

## 路由

到目前为止，我们的 HTTP 服务器，无论用户访问任何 path，它都只能分配到 createServer 的回调模块中。如果我们需要根据用户访问的不同 URL 路径，将请求分配给不同的模块，那么我们就需要实现路由功能。

什么是路由？这里的路由和网络物理层的路由不是一个概念。我们知道 URL 是由几个部分组成： 

```
protocol: // hostname:port / pathname ? query # hash
```

所以我们的路由模块需要实现的功能就是 —— 解析 URL 中的 pathname，根据不同的路径将请求分配给相应的模块去处理。

### 实现路由

我们先来看看路由的实现思路。

一个简单的路由是一个类，它的方法能够返回不同的拦截切面，这样的类叫做 HTTP 服务**中间件（Middleware）**。具体实现代码如下：

```js
// Router类

const url = require('url');
const path = require('path');

/*
@rule：路径规则
@pathname：路径名
*/
function check(rule, pathname) {
  /* 
  解析规则，比如：/test/:course/:lecture
  paraMatched = ['/test/:course/:lecture', ':course', ':lecture']
  */
  const paraMatched = rule.match(/:[^/]+/g);
  const ruleExp = new RegExp(`^${rule.replace(/:[^/]+/g, '([^/]+)')}$`);

  /*
  解析真正的路径，比如：/test/123/abc
  ruleMatched = ['/test/123/abs', '123', 'abs']
  */
  const ruleMatched = pathname.match(ruleExp);

  /*
  将规则和路径拼接为对象：
  ret = {course: 123, lecture: abc}
  */
  if(ruleMatched) {
    const ret = {};
    if(paraMatched) {
      for(let i = 0; i < paraMatched.length; i++) {
        ret[paraMatched[i].slice(1)] = ruleMatched[i + 1];
      }
    }
    return ret;
  }
  return null;
}

/*
@method: GET/POST/PUT/DELETE
@rule: 路径规则，比如：test/:course/:lecture
@aspect: 拦截函数
*/
function route(method, rule, aspect) {
  return async (ctx, next) => {
    const req = ctx.req;
    if(!ctx.url) ctx.url = url.parse(`http://${req.headers.host}${req.url}`);
    const checked = check(rule, ctx.url.pathname); // 根据路径规则解析路径
    if(!ctx.route && (method === '*' || req.method === method)
      && !!checked) {
      ctx.route = checked;
      await aspect(ctx, next);
    } else { // 如果路径与路由规则不匹配，则跳过当前拦截切面，执行下一个拦截切面
      await next();
    }
  };
}

class Router {
  constructor(base = '') {
    this.baseURL = base;
  }

  get(rule, aspect) {
    return route('GET', path.join(this.baseURL, rule), aspect);
  }

  post(rule, aspect) {
    return route('POST', path.join(this.baseURL, rule), aspect);
  }

  put(rule, aspect) {
    return route('PUT', path.join(this.baseURL, rule), aspect);
  }

  delete(rule, aspect) {
    return route('DELETE', path.join(this.baseURL, rule), aspect);
  }

  all(rule, aspect) {
    return route('*', path.join(this.baseURL, rule), aspect);
  }
}

module.exports = Router;
```

这里的 route 函数是一个高阶函数，它返回的函数作为拦截切面被添加到 server 的拦截器中。check 函数利用正则表达式检查真正的路径和路由规则是否匹配，如果命中规则，就返回解析后的规则对象，并将它写入到 ctx.route 属性中去，然后 route 函数调用真正的切面（即：aspect 函数）执行内容。如果没有命中，则跳过这个拦截切面，执行下一个拦截切面。

下面，我们将路由中间件应用到我们的 HTTP 服务中：

```js
const router = new Router();

app.use(router.all('/test/:course/:lecture', async ({route, res}, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.body = route;
  await next();
}));
```

这里我们设置了一个路由规则：`/test/:course/:lecture`。如果我们访问的路径和这条路由规则匹配，则执行这条规则里的拦截函数。

比如，我们访问的路径是`http://localhost:9090/test/123/abc`，它刚好与路由规则匹配，所以`ctx.route`得到的是`{course: "123", lecture: "abc"}`。这个请求的效果如下图所示：

![](https://p3.ssl.qhimg.com/t01f93c7634d8fb3e46.jpg)

然后我们还可以再添加一个默认的路由：

```js
app.use(router.all('.*', async ({req, res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Hello world</h1>';
  await next();
}));
```

这条规则表示让未匹配到的 URL 走这个默认的路由，打印出`<h1>Hello world</h1>`。完整的服务器代码如下：

```js
const Server = require('./lib/server');
const Router = require('./lib/middleware/router');

const app = new Server();
const router = new Router();

app.listen({
  port: 9090,
  host: '0.0.0.0',
});

app.use(router.all('/test/:course/:lecture', async ({route, res}, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.body = route;
  await next();
}));

app.use(router.all('.*', async ({req, res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Hello world</h1>';
  await next();
}));
```

### 总结

因为动态 HTTP 服务器需要根据不同的请求信息（比如：路径、query 等）将请求分配给不同的处理模块，所以我们需要对它进行架构设计。在动态服务器架构设计中，最基础的就是**拦截器模块和路由模块**。

拦截器可以注册多个拦截切面，各切面通过 next 方法联系，运行时依次异步执行每个拦截切面。使用拦截器的优点在于，它可以将一个业务流程按照功能分为若干切面，当其中一个切面执行失败时，它能够阻止后面的切面继续执行，起到了流程控制的作用。同时，每个功能切面还能被其他业务需求共享，降低了项目代码的冗余度。

路由的目的是将不同的 HTTP 请求根据不同的 URL 路径分配给不同的业务处理模块。路由模块是一个中间件，可以自定义路由规则。我们的例子中，HTTP 服务会根据 URL 的 pathname 匹配路由规则，执行命中规则中的拦截切面函数。

