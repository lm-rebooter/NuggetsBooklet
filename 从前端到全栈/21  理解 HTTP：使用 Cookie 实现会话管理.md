上一节课中，我们了解了 Cookie 的基本工作原理，即通过在 Cookie 中设置唯一 ID 就能够让服务器识别用户的身份。给不同的用户赋予不同的 ID 之后，我们的服务器就可以根据 Cookie 识别某个请求属于哪个用户了。

正因为具有这种特性，服务器才能够使用 Cookie 来记录状态。具体的做法是像上一节最后的例子那样，随机生成一个唯一 ID，将它作为 Cookie 发送给客户端（浏览器），然后把这个 ID，以及和这个 Cookie 相关的信息存储在持久化服务里。当用户下一次访问网站的时候，服务器就能根据客户端发送来的 Cookie 查询持久化服务，找到和这个用户相关的信息进行响应的业务处理。这个过程是一种规范的机制，在服务器端有一个专门的名字叫做 **Session**，中文是会话。

Session 机制对于复杂的互联网应用十分重要。试想一下，假设我们开发了一个电商网站，某个用户登录了我们的网站开始购物。那在他登录网站的时候，我们要用 Session 记录下他的登录状态和用户信息，这些信息在他后续挑选商品，添加购物车，发起购物请求，支付商品等一系列操作中都会被使用。如果没有 Session 机制，那为了识别这些操作都是同一个人进行的，我们就不得不在每个 HTTP 请求中始终带着他的登录状态和个人信息，这会造成不必要的复杂度和带宽浪费，也会降低安全性（敏感信息传输越多，安全性越差）。

那么 Session 究竟要如何创建呢？

## 实现 Session 机制

通常情况下，Session 的创建是发生在用户首次登录或者 Session 过期后，服务器再次要求用户登录的时候。所以，在创建 Session 之前，我们要先实现用户的登录功能。我们以 Todolist 项目为例，为它添加一个用户登录功能，让它能够支持多用户使用。

### 实现用户登录

我们先在 SQLite 中创建一个 user 表，它有三个字段：`id`、`name` 和 `password`。简单起见，我们不实现用户注册功能，预先在表里输入一个用户信息。

![](https://p3.ssl.qhimg.com/t01a85e3832de6ed6bb.jpg)

这个用户名叫 junyux，密码是 123456。

顺便说一下，一般我们不在数据库中存储明文密码，而是存储加密过的字符串，这样可以避免用户密码泄露。在 Node.js 中，我们可以使用内置模块 crypto 将用户的密码变成加密的字符串。

像这样：

```js
const salt = 'xypte';
const password = crypto.createHash('sha256').update(`${salt}123456`, 'utf8').digest().toString('hex'); // e50fa2354f33c71825411052935bd8409d91ef4f31b5ea468644baa3a2ee31c5
```

这里的 salt 是一个随机字符串，这么做可以避免密码碰撞攻击，增加安全性。比如用户的密码是 123456，但是数据库中保存的是字符串`xypte123456`经过`sha256`加密后的结果。

然后，我们实现一个 user 的 model：

```js
// model/user.js
const crypto = require('crypto');

async function login(database, {name, passwd}) {
  const userInfo = await database.get('SELECT * FROM user WHERE name = ?', name);
  const salt = 'xypte';
  const hash = crypto.createHash('sha256').update(`${salt}${passwd}`, 'utf8').digest().toString('hex'); // 将用户输入的密码用同样的方式加密
  if(userInfo && hash === userInfo.password) {
    // TODO: 创建Session
    return {id: userInfo.id, name: userInfo.name};
  }
  return null;
}

module.exports = {
  login,
};
```

如上面代码所示，在这个 model 中，我们从 user 表中读取用户信息，然后将 passwd 经过加密后与数据库表保存的字符串进行比对。如果相同，说明密码是正确的，那么返回用户信息（ID 和用户名）。如果字符串不相同（表示密码错误）或者  userInfo 表里没有查出记录（表示用户不存在），那么返回 null。

注意这里的 TODO 部分，用户登录后，服务器需要保存这次用户登录的 Session，这样用户下一次访问网站的时候就不需要再次登录了。

### 创建 Session

接下来我们要实现 Session 创建的功能，将登录的状态保存下来。这样用户访问`/list`的时候，可以根据用户信息查询对应的任务，访问`/add`和`/update`的时候也可以根据用户信息来进行对应的操作。

我们在 SQLite 中创建一个 Session 表，用来存放 Session 信息：

![](https://p5.ssl.qhimg.com/t01753420d4a7116e2c.jpg)

Session 表有六个字段：

- ID 是数据表自动生成的编号；
- key 是对应 Cookie 的属性值，也就是服务器随机生成的唯一 ID；
- name 是要记录的 Session 的名字（比如：userInfo)；
- value 是以 JSON 格式存放的值；
- created 是 Session 的创建时间；
- expires 是 Session 的过期时间。

然后添加一个 Session 的model，用来新增和获得用户的 Session：

```js
// model/session.js
const sessionKey = 'interceptor_js';

// 根据Cookie中的ID获取用户的Session
async function getSession(database, ctx, name) {
  const key = ctx.cookies[sessionKey];
  if(key) {
    const now = Date.now();
    const session = await database.get('SELECT * FROM session WHERE key = ? and name = ? and expires > ?',
      key, name, now);
    if(session) {
      return JSON.parse(session.value);
    }
  }
  return null;
}

// 创建新的Session
async function setSession(database, ctx, name, data) {
  try {
    const key = ctx.cookies[sessionKey];
    if(key) {
      let result = await database.get('SELECT id FROM session WHERE key = ? AND name = ?', key, name);
      if(!result) {
        // 如果result不存在，那么插入这个session
        result = await database.run(`INSERT INTO session(key, name, value, created, expires)
          VALUES (?, ?, ?, ?, ?)`,
        key,
        name,
        JSON.stringify(data),
        Date.now(),
        Date.now() + 7 * 86400 * 1000);
      } else {
        // 否则更新这个session
        result = await database.run('UPDATE session SET value = ?, created = ?, expires = ? WHERE key = ? AND name = ?',
          JSON.stringify(data),
          Date.now(),
          Date.now() + 7 * 86400 * 1000,
          key,
          name);
      }
      return {err: '', result};
    }
    throw new Error('invalid cookie');
  } catch (ex) {
    return {err: ex.message};
  }
}

module.exports = {
  getSession,
  setSession,
};
```

如上代码所示，函数 `setSession` 用于向 Session 表中插入或更新一条会话记录。这条记录中的 key 就是用户 Cookie 中的唯一 ID。在方法`getSession`中，我们通过 key 获得这个用户的 Session 记录，如果存在这条记录，就返回 Session 的 value（即 userInfo)，否则返回 null。然后，我们在用户 model 的登录方法中加入创建 Session 的功能：

```js
// model/user.js
const crypto = require('crypto');

const {setSession} = require('./session');

const sessionName = 'userInfo';

async function login(database, ctx, {name, passwd}) {
  const userInfo = await database.get('SELECT * FROM user WHERE name = ?', name);
  const salt = 'xypte';
  const hash = crypto.createHash('sha256').update(`${salt}${passwd}`, 'utf8').digest().toString('hex');
  if(userInfo && hash === userInfo.password) {
    const data = {id: userInfo.id, name: userInfo.name};
    setSession(database, ctx, sessionName, data); // 创建session
    return data;
  }
  return null;
}

module.exports = {
  login,
};
```

现在，我们需要实现一个用户登录的拦截切面，以响应用户的登录请求：

```js
app.use(async ({cookies, res}, next) => {
  let id = cookies.interceptor_js;
  if(!id) {
    id = Math.random().toString(36).slice(2);
  }
  res.setHeader('Set-Cookie', `interceptor_js=${id}; Path=/; Max-Age=${7 * 86400}`); // 设置cookie的有效时长一周
  await next();
});

...省略其它切面

app.use(router.post('/login', async (ctx, next) => {
  const {database, params, res} = ctx;
  res.setHeader('Content-Type', 'application/json');
  const {login} = require('./model/user');
  const result = await login(database, ctx, params);
  res.body = result || {err: 'invalid user'};
  await next();
}));
```

上面的代码有两个切面，第一个切面表示每次用户请求服务器，服务器都为该用户更新他的 Cookie。第二个切面表示用户可以通过路径`/login`向我们的服务器发送 POST 请求登录。如果登录成功，服务器返回用户的信息。如果登录失败，则返回`{err: 'invalid user'}`。

⚠️注意，更新 Cookie 的切面必须放在所有切面的前面，无论用户是否进行登录操作，服务器都会为该用户更新他的 Cookie。我们启动服务器，用 postman 试一下这个接口：

![](https://p0.ssl.qhimg.com/t018c2ad4eb41f8187e.jpg)


这样我们就实现了将用户信息保存到 Session，以及从 Session 中读取用户信息的功能。

现在，我们打开事先实现好的登录页面（具体的页面代码可以查看[TODO: 仓库连接]）：

![](https://p0.ssl.qhimg.com/t01edede0193a1fdae1.jpg)

当我们点击登录后，服务器会将这个请求转发到如下拦截切面中处理：如果用户登录失败，返回 302 跳转并回到登录页面；如果登录成功，则进入 index.html 页面：

```js
app.use(router.post('/login', async (ctx, next) => {
  const {database, params, res} = ctx;
  const {login} = require('./model/user');
  const result = await login(database, ctx, params);
  res.statusCode = 302;
  if(!result) { // 登录失败，跳转到login继续登录
    res.setHeader('Location', '/login.html');
  } else {
    res.setHeader('Location', '/'); // 成功，跳转到 index
  }
  await next();
}));
```

上面的代码中，我们使用 HTTP 状态码 302，它表示临时跳转，设置 Location 为跳转目的地，那么浏览器就会执行跳转了。到此，Session 的实现就完成了。下面，我们来看看会话机制是如何被使用的。

## 使用 Session 机制

当我们进入 index.html（即浏览器打开 index.html 页面后），浏览器会立即执行页面上的 JavaScript 函数 —— loadItems:

```js
async function loadItems(list) {
  const {err, data} = await (await fetch('/list')).json();
  if(err) {
    window.location.replace('/login.html');
  } else {
    data.forEach(({id, state, text}) => addItem(id, list, text, states[state]));
  }
}
```

在这段 JS 脚本中，`await fetch('/list')`会向我们的服务器发起获取用户任务列表的请求。如果成功，则更新 UI，将数据填充到 Todolist 中；如果失败，则返回登录页面。

我们来看看响应路径名为 `/list` 的拦截切面都做了什么工作：

```js
async function checkLogin(ctx) {
  const {getSession} = require('./model/session');
  const userInfo = await getSession(ctx.database, ctx, 'userInfo');
  ctx.userInfo = userInfo;
  return ctx.userInfo;
}

app.use(router.get('/list', async (ctx, next) => {
  const {database, res} = ctx;
  const userInfo = await checkLogin(ctx); // 如果session存在并有效，则返回用户信息对象
  res.setHeader('Content-Type', 'application/json');
  if(userInfo) {
    const {getList} = require('./model/todolist');
    const result = await getList(database, userInfo);
    res.body = {data: result};
  } else {
    res.body = {err: 'not login'};
  }
  await next();
}));
```

首先，处理`/list`的拦截切面会先去检查用户的 Session 是否有效（即 checkLogin 函数）。getSession 方法根据浏览器返回来的 Cookie，从 Session 表中查询用户的 Session，如果用户的 Session 存在并有效，则返回用户的信息对象，否则返回`null`。

然后，根据 checkLogin 方法返回的结果，进行下一步的处理：
- 如果 checkLogin 方法返回的是一个用户信息对象，说明该用户的 Session 还是有效的，那么服务器就会根据用户信息，获得和这个用户相关的任务列表，并返回给客户端；

- 如果返回 null，表示这个用户的 Session 不存在或已经过期，那么服务器返回错误对象，将用户导向登录页面。

当然，这里我们需要给 Todo 表添加用户 ID 字段：

![](https://p3.ssl.qhimg.com/t01fbd2df3964a6f8a3.jpg)

这样，服务器才能根据用户 ID 来获得和该用户相关的任务数据：

```js
async function getList(database, userInfo) {
  const result = await database.all(`SELECT * FROM todo WHERE state <> 2 and userid = ${userInfo.id} ORDER BY state DESC`);
  return result;
}
```

然后修改对应的拦截切面：

```js
async function checkLogin(ctx) {
  const {getSession} = require('./model/session');
  const userInfo = await getSession(ctx.database, ctx, 'userInfo');
  ctx.userInfo = userInfo;
  return ctx.userInfo;
}

app.use(router.get('/list', async (ctx, next) => {
  const {database, res} = ctx;
  const userInfo = await checkLogin(ctx);
  res.setHeader('Content-Type', 'application/json');
  if(userInfo) {
    const {getList} = require('./model/todolist');
    const result = await getList(database, userInfo);
    res.body = {data: result};
  } else {
    res.body = {err: 'not login'};
  }
  await next();
}));

app.use(router.post('/add', async (ctx, next) => {
  const {database, params, res} = ctx;
  const userInfo = await checkLogin(ctx);
  res.setHeader('Content-Type', 'application/json');
  if(userInfo) {
    const {addTask} = require('./model/todolist');
    const result = await addTask(database, userInfo, params);
    res.body = result;
    await next();
  } else {
    res.body = {err: 'not login'};
  }
  await next();
}));
```

最后，我们改一下前端的JS代码：

```js
async function loadItems(list) {
  const {err, data} = await (await fetch('/list')).json();
  if(err) {
    window.location.replace('/login.html');
  } else {
    data.forEach(({id, state, text}) => addItem(id, list, text, states[state]));
  }
}
```

这样，如果访问的时候没有登录，就会自动跳转到`/login.html`进行登录了。最终完整的应用的操作流程如下：

![](https://p3.ssl.qhimg.com/t01fab3087a1ae27cd0.gif)

## 总结

一些初学者很可能认为 Session 和 Cookie 类似，也是浏览器的一个对象。但其实，**Session 只是一个建立在 Cookie 特性上的机制，并不是浏览器的对象**。

创建 Session 一般发生在用户首次登录或者 Session 过期，或者用户需要再次登录时。创建 Session 的流程一般为：

1. 用户在客户端提交包含个人信息（如用户名）以及密码的表单；
2. 服务器获取客户端发来的 Cookie，如果没有，则创建一个新 Cookie；
3. 利用用户的信息和 Cookie，向 Session 表新增或更新用户的 Session；
4. Session 创建成功，返回用户信息对象。

有了 Session 后，服务器就能跟踪用户在网站上的各种操作和请求了。当用户请求的资源需要验证用户信息的时候，服务器就根据客户端发来的 Cookie，从 Session 表中查询用户信息，确认用户身份，成功则返回该请求的响应，失败则将用户导向登录页面。

至此，我们的第一个动态 Web 应用 Todolist 的主体功能就完成了。我们的 HTTP 服务器很好地支持了整个应用的逻辑实现。当然，它还有可以改进的地方。下一节课，我们将对服务器进行最后的优化，一起期待吧！