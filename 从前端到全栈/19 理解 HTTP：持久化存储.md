在上一节课里，我们通过 Mock 数据模拟了 Web 应用的数据源，实现了一个简单的数据查询功能。在一般的 Web 应用服务端，数据通常存储在关系数据库、分布式 K/V 存储或者分布式文件系统等**持久化存储服务**中，Web 服务端通过 TCP 或者其他协议与这些存储服务通讯、存储或读取数据。

![](https://p2.ssl.qhimg.com/t0133d10def576cfad7.png)

所以这节课，我们就来看一下如何实现数据的持久化存储。

## SQLite 数据库

简单的 Web 应用通常选择关系数据库作为持久存储，关系数据库的选择需根据应用特点和规模而定。社区中有非常多优秀的开源库，大名鼎鼎的 MySQL 你一定听说过。MySQL 功能强大，既能够单机部署，又能分布式部署。不过 MySQL 安装、部署和使用相对比较复杂，而我们是想写一个简单的例子，不需要分布式存储，所以选择一个比 MySQL 更加轻量级的关系数据库 —— SQLite。

> SQLite 是一款轻型的关系数据库，它的设计目标是嵌入式的，而且很多嵌入式产品中已经使用了它，它占用资源非常的低，在嵌入式设备中可能只需要几百 K 的内存。它能够支持 Windows/Linux/Unix 等主流的操作系统，同时能够跟很多程序语言相结合，比如 Tcl、C#、PHP、Java 等，还有 ODBC 接口。比起 MySQL、PostgreSQL 这两款著名数据库管理系统，SQLite 的处理速度更快，而且同样受 Node.js 支持。

SQLite 数据库是基于文件的，不需要在系统中安装 server 服务，只需要安装一个图形界面的客户端管理工具，方便我们初始化数据库和创建数据表。Windows 和 Mac 系统下都有不错的管理工具，比如`sqlpro studio`、`sqliteexpert`等等，你可以根据需要安装。

## 设计 Todolist 数据表

接下来我们将用 Node.js 作为服务端实现一个简单的 Todolist 应用。它的前端界面我已经写好了，如下所示：

![](https://p2.ssl.qhimg.com/t01bfa80e4d0694ea90.jpg)

我们设计一个`todo`表来存储 Todolist 的数据，这个表结构很简单，只有3个字段：id、text 和 state。其中 id 是自动产生的，text 字段表示任务描述，state 字段表示任务的状态（已完成或未完成）。

![](https://p3.ssl.qhimg.com/t018ec7501be3876578.jpg)

然后，我们在的 HTTP 服务器的项目中安转 SQLite 模块：

```bash
npm i sqlite3 sqlite --save
```

Node.js 中安装 SQLite 需要安装两个模块：SQLite3 和 SQLite。sqlite3 是支持 SQLite 的标准Node.js模块，而 SQLite 模块是在这个基础上将 SQLite3 模块的异步 API 封装成 Promise 规范，易于使用。

## 实现服务端主体逻辑

接下来，我们将服务器端的主体逻辑添加一下。这个应用比较简单，主要由几个拦截切面构成。

```js
const path = require('path');
const sqlite3 = require('sqlite3');
const {open} = require('sqlite');
const {Server, Router} = require('./lib/interceptor'); // 这里我们将server 和 router都规划到interceptor包中

const dbFile = path.resolve(__dirname, '../database/todolist.db'); // todolist.db是sqlite数据库文件
let db = null;

const app = new Server(); // 创建HTTP服务器
const router = new Router(); // 创建路由中间件

app.use(async ({req}, next) => {
  console.log(`${req.method} ${req.url}`); // eslint-disable-line no-console
  await next();
});

app.use(async (ctx, next) => {
  if(!db) { // 如果数据库连接未创建，就创建一个
    db = await open({
      filename: dbFile,
      driver: sqlite3.cached.Database,
    });
  }
  ctx.database = db; // 将db挂在ctx上下文对象的database属性上

  await next();
});

/*
如果请求的路径是/list，则从todo表中获取所有任务数据
*/
app.use(router.get('/list', async ({database, route, res}, next) => {
  res.setHeader('Content-Type', 'application/json');
  const {getList} = require('./model/todolist');
  const result = await getList(database); // 获取任务数据
  res.body = {data: result};
  await next();
}));

/*
如果路径不是/list, 则返回'<h1>Not Found</h1>'文本
*/
app.use(router.all('.*', async ({params, req, res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Not Found</h1>';
  res.statusCode = 404;
  await next();
}));

app.listen({
  port: 9090,
  host: '0.0.0.0',
});
```

这个 web 服务中，我们一共创建了 4 个拦截切面：
1. 第一个切面是打印每次请求的日志；
2. 第二个切面是创建 SQLite 数据库连接，每次请求都通过这个切面获得数据库实例；
3. 第三个切面是处理`/list`请求，返回任务数据；
4. 第四个切面是其他路径请求返回 404。

大部分拦截切面的逻辑我们已经比较熟悉了，这里主要讲一个新的拦截切面：

```js
app.use(async (ctx, next) => {
  if(!db) {
    db = await open({
      filename: dbFile,
      driver: sqlite3.cached.Database,
    });
  }
  ctx.database = db;

  await next();
});
```

上面的 open 方法创建 SQLite 数据库连接，成功后返回数据库实例对象。然后，我们将这个数据库实例缓存起来，即保存在 db 变量。这样，除了第一次请求，后续的请求都不需要再创建数据库连接。最后，我们将数据库实例保存到 ctx 对象的 database 属性里，以方便后续的切面使用该实例操作数据库。比如：

```js
const {getList} = require('./model/todolist');
const result = await getList(database); // 获取
```

getList 方法是 todolist model 的一个方法，旨在从 todo 表中获取所有的任务数据：

```js
// model/todolist.js
async function getList(database) {
  const result = await database.all('SELECT * FROM todo');
  return result;
}

module.exports = {
  getList,
};
```

这个模块非常简单，`database.all`方法可以执行 SQL 语句，并以列表形式返回查询结果。所以我们在主体路由切面中直接引入这个模块，获取我们想要的查询结果，并返回：

```js
app.use(router.get('/list', async ({database, route, res}, next) => {
  res.setHeader('Content-Type', 'application/json');
  const {getList} = require('./model/todolist');
  const result = await getList(database);
  res.body = {data: result};
  await next();
}));
```

这样我们就实现了一个查询 SQLite 数据库 todo 表的服务，它返回的 JSON 结果如下：

![](https://p0.ssl.qhimg.com/t011392a3856d8088a1.jpg)

因为现在数据表中没有数据，所以返回的是空数组。

## 从页面提交数据到服务器

接下来，我们需要实现一个数据提交的功能，让用户通过页面提交任务数据到服务器，再写入数据库。

[第 13 节](https://juejin.cn/editor/book/7133100888566005763/section/7133185465691144196)我们说 HTTP 请求的动作分为 GET、HEAD、OPTIONS、POST、PUT、PATCH、DELETE。其中，只有 GET 和 HEAD 不从body 传数据，其它都通过 body 传递。

还记得我们前面介绍的解析参数的 param.js 拦截切面吗？我们只实现了解析 URL 上的 GET 请求的参数。接下来，我们就一起完善它，添加对 POST 请求的数据的解析。

POST 请求与 GET 请求不同，有多种数据提交方式，由 request 的 Content-Type 字段决定。其中常用的有`application/x-www-form-urlencoded`、`application/json`、`multipart/form-data`等。

`application/x-www-form-urlencoded`是最常见的数据提交方式，在这种方式下，POST 的 body 中的数据格式和 GET 的 URL 参数的格式一样，都是经过 URLEncode 的`key1=value1&key2=value2&...` 的形式。所以，解析这种方式提交的数据，我们可以和解析 GET 里的参数一样，具体操作如下：

```
POST http://www.example.com HTTP/1.1
Content-Type: application/x-www-form-urlencoded;charset=utf-8

title=test&sub%5B%5D=1&sub%5B%5D=2&sub%5B%5D=3
```

需要注意的是，如果是`applicaiton/json`格式，body 中的数据是字符串化的 JSON 数据，我们直接通过 JSON.parse 解析即可。

```
POST http://www.example.com HTTP/1.1 
Content-Type: application/json;charset=utf-8

{"title":"test","sub":[1,2,3]}
```

`multipart/form-data`格式则稍稍复杂，这种格式是用来发送多种格式的数据的，比如文件上传或者发送二进制数据等，`multipart/form-data`会在请求的 body 中生成分隔符，用来分隔不同的字段，所以用这种格式提交的数据内容大致如下：

```
POST http://www.example.com HTTP/1.1
Content-Type:multipart/form-data; boundary=----WebKitFormBoundaryrGKCBY7qhFd3TrwA

------WebKitFormBoundaryrGKCBY7qhFd3TrwA
Content-Disposition: form-data; name="text"

title
------WebKitFormBoundaryrGKCBY7qhFd3TrwA
Content-Disposition: form-data; name="file"; filename="chrome.png"
Content-Type: image/png

PNG ... content of chrome.png ...
------WebKitFormBoundaryrGKCBY7qhFd3TrwA--
```

这种情况下，我们需要先分隔 SQLite 数据再解析，处理起来稍微麻烦一些。

以上三种数据格式是浏览器推荐的规范。但其实，**body 里传什么格式都行，HTTP 并没有规定 body 里的数据一定要按照规范，只要我们的服务器能对应解析就可以**。当然，根据规范来传递数据能让我们的应用更加通用。

## 修改 param.js

现在，我们来修改一下上一节课的 param 拦截切面，让它支持解析第一种和第二种形式的POST数据，至于第三种形式的 POST 数据的解析，可以使用一些第三方模块，这里先不做详细介绍了，如果你有兴趣可以在 npm 上找找相应的模块来学习。

在 param.js 中，我们添加对 POST 数据的解析：

```js
const url = require('url');
const querystring = require('querystring');

module.exports = async function (ctx, next) {
  const {req} = ctx;
  // 解析query数据
  const {query} = url.parse(`http://${req.headers.host}${req.url}`);
  ctx.params = querystring.parse(query);
  // 解析POST
  if(req.method === 'POST') {
    const headers = req.headers;

    // 读取POST的body数据
    const body = await new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk.toString(); // convert Buffer to string
      });
      req.on('end', () => {
        resolve(data);
      });
    });
    ctx.params = ctx.params || {};
    if(headers['content-type'] === 'application/x-www-form-urlencoded') {
      Object.assign(ctx.params, querystring.parse(body));
    } else if(headers['content-type'] === 'application/json') {
      Object.assign(ctx.params, JSON.parse(body));
    }
  }
  await next();
};
```

如上代码所示，读取 POST 请求的 BODY 是一个异步的过程：监听 req 对象的 data 和 end 事件，当 data 事件触发表示数据块被接收，end 事件触发表示数据接收完毕。然后，我们判断请求头的 Content-Type 字段，如果是`application/x-www-form-urlencoded`，那么用 querystring 模块来解析，如果是`application/json`，那么直接 JSON.parse 即可。最终我们将解析的数据信息写入到 ctx.params 对象中，这样其他的拦截切面就可以使用它了。

接下来我们在 server 中添加相应的拦截切面：

```js
const param = require('./aspect/param');
app.use(param);

app.use(router.post('/add', async ({database, params, res}, next) => {
  // ...保存todolist数据
}));
```

如上代码所示，如果请求的路径是`/add`，则将用户提交的数据保存到数据库的 todo 表中。

## 提交的数据

修改`model/todolist.js`模块，添加插入数据的 API：

```js
async function getList(database) {
  const result = await database.all('SELECT * FROM todo');
  return result;
}

async function addTask(database, {text, state}) {
  try {
    const data = await database.run('INSERT INTO todo(text,state) VALUES (?, ?)', text, state);
    return {err: '', data};
  } catch (ex) {
    return {err: ex.message};
  }
}

module.exports = {
  getList,
  addTask,
};
```

我们增加一个 addTask 方法，将 text、state 信息插入到 todo 表中，这样我们在 server 中 POST 路由的拦截切面的完整代码如下：

```js
app.use(router.post('/add', async ({database, params, res}, next) => {
  res.setHeader('Content-Type', 'application/json');
  const {addTask} = require('./model/todolist');
  const result = await addTask(database, params);
  res.body = result;
  await next();
}));
```

到此，我们完成了获取任务列表和添加任务数据的服务。为了课程的完整性，我们来看看客户端（浏览器）是如何和我们的 HTTP 服务器进行交互的。

## 与前端集成

因为 Todolist 应用比较简单，所以我们直接采用客户端渲染，将这个页面命名为 index.html，并保存在项目的静态目录 www 下。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Todo List</title>
  <link rel="stylesheet" href="static/css/style.css">
</head>
<body>
  <header>
    <input type="text" placeholder="输入一项任务..." id="itemText">
    <button id="addItem">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve">
        <g>
          <path fill="#25b99a" d="M16,8c0,0.5-0.5,1-1,1H9v6c0,0.5-0.5,1-1,1s-1-0.5-1-1V9H1C0.5,9,0,8.5,0,8s0.5-1,1-1h6V1c0-0.5,0.5-1,1-1s1,0.5,1,1v6h6C15.5,7,16,7.5,16,8z"></path>
        </g>
      </svg>
		</button>
  </header>
  <ul class="todolist"></ul>
  <script src="static/js/app.js"></script>
</body>
</html>
```

然后，我们在服务器中添加静态加载文件的切面，让任意的 URL 请求返回相应的静态页面（这个例子中是 index.html 页面）。

```js
app.use(router.get('.*', async ({req, res}, next) => {
  let filePath = path.resolve(__dirname, path.join('../www', url.fileURLToPath(`file:///${req.url}`)));

  if(fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if(stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if(fs.existsSync(filePath)) {
      const {ext} = path.parse(filePath);
      const stats = fs.statSync(filePath);
      const timeStamp = req.headers['if-modified-since'];
      res.statusCode = 200;
      if(timeStamp && Number(timeStamp) === stats.mtimeMs) {
        res.statusCode = 304;
      }
      const mimeType = mime.getType(ext);
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'max-age=86400');
      res.setHeader('Last-Modified', stats.mtimeMs);
      const acceptEncoding = req.headers['accept-encoding'];
      const compress = acceptEncoding && /^(text|application)\//.test(mimeType);
      let compressionEncoding;
      if(compress) {
        acceptEncoding.split(/\s*,\s*/).some((encoding) => {
          if(encoding === 'gzip') {
            res.setHeader('Content-Encoding', 'gzip');
            compressionEncoding = encoding;
            return true;
          }
          if(encoding === 'deflate') {
            res.setHeader('Content-Encoding', 'deflate');
            compressionEncoding = encoding;
            return true;
          }
          if(encoding === 'br') {
            res.setHeader('Content-Encoding', 'br');
            compressionEncoding = encoding;
            return true;
          }
          return false;
        });
      }
      if(res.statusCode === 200) {
        const fileStream = fs.createReadStream(filePath);
        if(compress && compressionEncoding) {
          let comp;
          if(compressionEncoding === 'gzip') {
            comp = zlib.createGzip();
          } else if(compressionEncoding === 'deflate') {
            comp = zlib.createDeflate();
          } else {
            comp = zlib.createBrotliCompress();
          }
          res.body = fileStream.pipe(comp);
        } else {
          res.body = fileStream;
        }
      }
    }
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.body = '<h1>Not Found</h1>';
    res.statusCode = 404;
  }

  await next();
}));
```

当浏览器加载 index.html 页面后，会自动运行 app.js 中的 loadItem 方法，从服务器端获取任务列表，它的实现如下：

```js
async function loadItems(list) {
  const {data} = await (await fetch('/list')).json();
  data.forEach(({state, text}) => addItem(list, text, states[state]));
}
```

如上代码所示，我们通过浏览器的 fetch 方法请求`GET /list`，以获取 todo 表的数据，并通过 addItem 方法将数据渲染到页面上。

```js
function addItem(id, list, text, state = 'todo') {
  const removeSVG = `... 省略svg数据 ...`;
  const completeSVG = ` ... 省略svg数据 ...`;

  const item = document.createElement('li');
  item.className = state;
  item.innerHTML = `${text}<button class="remove">${removeSVG}</button><button class="complete">${completeSVG}</button>`;
  list.insertBefore(item, list.children[0]);

  item.dataset.id = id;

  const completeBtn = item.querySelector('button.complete');

  completeBtn.addEventListener('click', () => {
    const id = item.dataset.id;
    if(item.className === 'todo') {
      updateItem(id, 1);
      completeItem(item);
    } else {
      updateItem(id, 0);
      uncompleteItem(item);
    }
  });

  const removeBtn = item.querySelector('button.remove');

  removeBtn.addEventListener('click', () => {
    updateItem(id, 2);
    removeItem(item);
  });

  return item;
}
```

同样的，当我们点击按钮添加任务时，浏览器通过`POST /add`请求将添加的数据保存到数据库中：

```js
async function saveItem(text) {
  const result = await (await fetch('/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `text=${text}&state=0`,
  })).json();

  return result;
}

const addItemBtn = document.getElementById('addItem');

addItemBtn.addEventListener('click', async () => {
  const text = inputText.value;
  if(text) {
    const result = await saveItem(text);
    if(!result.err) {
      addItem(result.data.lastID, list, text);
      inputText.value = '';
      inputText.focus();
    } else {
      throw new Error(result.err);
    }
  }
});
```

这里我们使用 fetch 方法请求服务端`/add`接口，method 是 POST，Content-Type 是`application/x-www-form-urlencoded`，然后我们将 text 和 state 传给服务器。

上面的代码演示了浏览器和服务器之间的交互。当然这个交互除了 list 和 add 之外还两个功能，一个是删除任务，一个是将任务变更为已完成状态，或者从已完成恢复为未完成，它们实际上都属于变更数据状态的操作，只需要一个 update 接口就可以。你可以在我们的[GitHub仓库](https://github.com/akira-cn/todolist)中查看项目的完整代码。

## 总结

这节课我们介绍了如何在服务端实现持久化存储。我们采用了一个轻量级的数据库 SQLite，使用 SQLite3 和 SQLite 模块来操作数据库，同时添加了查询 todo 数据列表和添加 todo 项的 API，并将它们写入到具体的拦截切面中，这样就可以实现对应的服务端功能了。

此外，我们还学习了如何解析 POST 数据的内容，根据 POST 数据不同的类型，使用不同的方式进行解析。

完成了操作数据库，我们就实现了 HTTP 动态服务器最基本的功能，现在我们可以通过 Web 来增、删、改、查数据了。不过 Web 应用除了处理数据，还有其他一些细节需要考虑，比如用户的登录和权限、应用的操作状态等等，这些需要通过状态和会话管理来实现，这是我们下节课要讲的。

最后再多说一点，不知道你是否注意到了我们的代码组织形式。一般来说，实现一个服务器接口是在服务器端做 2 件事情：

1. 在 model 模块中添加一个方法操作数据库；
2. 在 server 中添加一个拦截切面，提供一个 URL 给前端调用。

在前端也做 2 件事情：

1. 用 fetch 方法调用对应的 URL 发送请求；
2. 根据请求返回的结果更新UI界面。

服务端的两件事情，分别属于两个不同的层次，一个是模型（model）层，一个是逻辑（logical）层，如果我们把逻辑层再细分，考虑服务端渲染又可以分为视图（view）层和控制（controller）层，这样我们的服务器就开始有了 MVC 模式的雏形。MVC 是服务器常用的设计模式，后面我们会详细介绍它，一起期待下吧！