上一节课，我们实现了一个简单的 Todolist 应用，保存数据到数据库，以及加载数据到前端展示。这实际上已经是一个完整的 Web 开发过程了。不过，复杂的 Web 应用不仅包括读取和写入数据，还可能包含一些权限操作。比如，如果我们想要给这个 Todolist 添加权限，根据不同的用户来操作不同的数据，这就需要一些跟**状态**有关的操作了。

**但是 HTTP 协议本身是无状态的。** 这个**无状**态该怎么理解呢？对于一个 HTTP 请求来说，服务器一般不知道，也不关心这个请求是谁发起的，它只会根据用户的请求参数返回对应的内容，并且在响应内容发送完成后，服务器不会记录任何信息。

无状态的设计让 HTTP 协议保持简洁，不需要前置信息，可以快速应答，天然适合分布式部署。但是随着 Web2.0 的发展，越来越多的应用场景需要记录状态。典型的就是网购场景，它包括用户挑选商品、加入购物车、提交订单、支付、确认收货等各个环节，分为若干个 HTTP 请求，如果不记录状态，就意味着在任何一个步骤，用户的个人信息以及之前步骤进行操作的所有信息都必须被重新发送，权限校验也必须重新进行，这大大增加了网络和服务器的负担。

为了避免这个问题，我们需要**在无状态的 HTTP 协议之上建立一套状态保存的机制**。好在，浏览器与服务器之间有成熟的机制可以实现状态的记录和保存。这一节课，我们就来看下具体该怎么做。

## 浏览器的 Cookie 与 HTTP 协议

为了解决状态保存的问题，浏览器提供了一套 Cookie 机制。这个机制的流程是：
1. 在服务器响应浏览器的请求时可以设置一个`Set-Cookie`响应头，其中的内容是发送给浏览器的 Cookie；
2. 浏览器会先保存 Cookie；
3. 下一次发起请求时，浏览器会带上保存的Cookie，这样服务器就知道这个请求是谁发来的了。

我们以一个非常简单的拦截切面为例，这个拦截切面只是通过设置`Set-Cookie`响应头给浏览器设置一个 Cookie 属性。

```js
app.use(router.get('/', async ({route, res}, next) => {
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  res.setHeader('Set-Cookie', 'mycookie=foobar');
  res.body = '<h1>你好!</h1>';
  await next();
}));
```


当我们的浏览器访问了`http://localhost:9090/`后，服务器就已经在浏览器中写入了一个 Cookie，我们打开 Chrome 的开发者工具，可以看到这个 Cookie：

![](https://p2.ssl.qhimg.com/t018cbe0bfeb4252f70.jpg)

同时我们可以在这里看到，Cookie 除了名字（Name）和值（Value）之外，还有其他的属性，包括 Domain、Path、Expires/Max-Age、Size、HttpOnly、Secure、SameSite 以及 Priority 等属性，这些属性也是有用的，它们中的一部分可以通过服务器设置，后面我们会详细讲。

现在，我们设置了一个名为 mycookie，值为 foobar 的 Cookie 到浏览器，那么浏览器每次访问我们的服务器都会带上这个 Cookie。你可能想问，这么做有什么用呢？

我们在服务端读取请求头中的 Cookie 字段，就可以获取相应的 Cookie 信息，不过 Cookie 字段是一串文本，包含了所有的 Cookie，每一对 Cookie 是`key=value`的格式，Cookie 与 Cookie 之间以分号隔开。

我们可以添加一个新的拦截切面来解析 Cookie，代码如下：

```js
// aspect/cookie.js
module.exports = async function (ctx, next) {
  const {req} = ctx;
  const cookieStr = decodeURIComponent(req.headers.cookie);
  const cookies = cookieStr.split(/\s*;\s*/);
  ctx.cookies = {};
  cookies.forEach((cookie) => {
    const [key, value] = cookie.split('=');
    ctx.cookies[key] = value;
  });
  await next();
};
```

有了这个拦截器，我们就可以通过`ctx.cookies[key]`来访问对应的`cookie`了。好，我们现在可以知道用户是否是初次访问我们，接着就可以根据 Cookie 的情况来选择返回不同的内容了。比如：

```js
const cookie = require('cookie');
app.use(cookie);

app.use(router.get('/', async ({cookies, route, res}, next) => {
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  res.setHeader('Set-Cookie', 'mycookie=foobar');
  const mycookie = cookies.mycookie;
  if(mycookie) {
    res.body = '<h1>欢迎回来</h1>';
  } else {
    res.body = '<h1>你好，新用户</h1>';
  }
  await next();
}));
```

我们现在给 Cookie 设置的名字和值都是固定的，这就有个问题，用户的 Cookie 字段都一样了，我们拿不到具体的用户信息。因此，我们需要给不同的用户设置不同的 Cookie，最简单的办法是生成一个唯一 ID。我们修改一下路由拦截切面的代码：

```js
const cookie = require('cookie');
app.use(cookie);

const users = {};

app.use(router.get('/', async ({cookies, route, res}, next) => {
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  const id = cookies.interceptor_js;
  if(id) {
    users[id] = users[id] || 1;
    users[id]++;
    res.body = `<h1>你好，欢迎第${users[id]}次访问本站</h1>`;
  } else {
    res.setHeader('Set-Cookie', `interceptor_js=${Math.random().toString(36).slice(2)}`);
    users[id] = 1;
    res.body = '<h1>你好，新用户</h1>';
  }
  await next();
}));
```

如上面代码所示，我们在用户访问 URL 的时候判断`cookies.interceptor_js`是否存在：如果不存在，就生成一个随机的 ID 设置到`Set-Cookie`响应头中，并记录用户的访问次数为 1；如果存在，将用户访问次数加一，并将用户访问的次数返回给客户端。通过生成 ID、记录 Cookie 的方式，我们就能够标记用户，服务器也就能够知道访问来自于哪个用户了。

不过，当我们将浏览器完全关闭，再重新打开访问网页后，网页就又会显示为“你好，新用户”了。这是因为，我们设置的 Cookie 没有带上有效期，所以默认的有效期是 Session 期，即浏览器会话期间。有效期 Session 意味着当浏览器进程在操作系统结束之后，Cookie 就会失效。

如果我们要让 Cookie 在关闭浏览器后也不失效，可以给 Cookie 带上有效期：


```js
...省略

app.use(router.get('/', async ({cookies, route, res}, next) => {
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  let id = cookies.interceptor_js;
  if(id) {
    users[id] = users[id] || 1;
    users[id]++;
    res.body = `<h1>你好，欢迎第${users[id]}次访问本站</h1>`;
  } else {
    id = Math.random().toString(36).slice(2);
    users[id] = 1;
    res.body = '<h1>你好，新用户</h1>';
  }
  res.setHeader('Set-Cookie', `interceptor_js=${id}; Max-Age=86400`);
  await next();
}));
```

如上面代码所示，我们在`Set-Cookie`的时候，在 key=value 后面添加了一条规则 —— `Max-Age=86400`，表示这个 Cookie 的有效期为一天（86400秒）。那么浏览器是如何判断 cookie 是否过期的呢？浏览器从服务器收到响应后，会将响应头里的 Cookie 保存起来，并将属性 expires/Max-Age 的值设置为当前接收的时间 + Max-Age。

每次浏览器向服务器发送请求的时候，会自动判断这个 Cookie 是否超过了 expires 的时间：如果超时了，则请求中就不带有 Cookie 字段；如果没有超时，则将这个 Cookie 带上。

在这个例子里，由于每次请求时，服务器都会返回一个新的 Max-Age 等于一天的 Cookie，所以只要你每天都访问这个网页，这个 Cookie 就不失效。如果你隔 24 小时再访问这个网页，那这个 Cookie 也就超时失效了。


除了 Max-Age 外，Cookie 还可以设置其他的规则，包括 Path、HttpOnly、Domain、Secure 和 SameSite。接下来，我们就分别看一下。

### Path

Path 规则指定一个 URL 路径，这个路径必须出现在请求 URL 路径中才有效。也就是说，假如我们的请求 URL 的路径是：`/foo/bar`，那么：

```js
res.setHeader('Set-Cookie', `interceptor_js=${id}; Path=/`);
res.setHeader('Set-Cookie', `interceptor_js=${id}; Path=/foo`);
res.setHeader('Set-Cookie', `interceptor_js=${id}; Path=/bar`);
```

以上这三种写法都是有效的，浏览器都会设置 Cookie。但如果我们如下设置就是非法的。

```js
res.setHeader('Set-Cookie', `interceptor_js=${id}; Path=/abc`);
```

这是因为`/abc`不在当前请求路径内，浏览器会忽略这个响应头，并不会设置 Cookie。默认不设置 Path 的话，浏览器会认为 Path 是`/`。

浏览器在请求的时候，只有 URL 路径包含 Path 路径时才会发送 Cookie。也就是说，如果 Path 设置为`/foo`，当请求的 URL 是`/foo`、`/foo/bar`、`/foo/bar/abc`时，都会发送 Cookie，而当请求的 URL 是`/`、`/foobar`、`/bar/foo`、`/foo/abc`时，则不会发送 Cookie。

### HttpOnly

如果 HttpOnly 规则被设定的话，那在页面上，JavaScript 无法通过 document.cookie 获取到该 Cookie，这增加了应用的安全性。

### Domain

默认情况下，Cookie 的 Domain 是当前 URL 的 hostname。也就是说，假如网站的域名是`study.junyux.com`，那么只有在`study.junyux.com`的域名下才能访问到 Cookie，在其他域名或者`study.junyux.com`的子域名都无法访问 Cookie。但是，如果我们设置了 Domain，那么 Cookie 在设置的 Domain 和它的子域名下都有效。比如我们如下设置，那这个域名在`junyux.com`、`www.junyux.com`、`study.junyux.com`下都有效。

```js
res.setHeader('Set-Cookie', `interceptor_js=${id}; Domain=junyux.com`);
```

需要注意的是，在`Set-Cookie`的时候，Domain 的值是当前域名和它的上级域名才有效，否则浏览器会忽略该响应头，不会设置 Cookie。也就是说，假设当前的域名是`study.junyux.com`，那么以下设置是有效的：

```js
res.setHeader('Set-Cookie', `interceptor_js=${id}; Domain=study.junyux.com`);
res.setHeader('Set-Cookie', `interceptor_js=${id}; Domain=junyux.com`);
```

而以下设置是无效的：

```js
res.setHeader('Set-Cookie', `interceptor_js=${id}; Domain=dev.study.junyux.com`);
res.setHeader('Set-Cookie', `interceptor_js=${id}; Domain=test.junyux.com`);
```

### Secure

Secure 规则只有在服务器使用 SSL 和 HTTPS 协议时才可以设置，如果设置了这个规则，这个 Cookie 就只有在使用 HTTPS/SSL 时才会被发送到服务器。

### SameSite 

SameSite 规则用来限制第三方 Cookie。如果服务器的响应头中带有 SameSite 设置的 Cookie，那每当浏览器请求这个 URL 的时候，会根据 SameSite 的值决定是否返回 Cookie 给服务器。它有三个值，分别是`Strict`、`Lax`和`None`。那么，这三个值是如何影响浏览器的呢？

Strict 表示严格，这个设置完全禁止了第三方网站向我们的服务器发送我们网站的 Cookie。这个设置虽然完全制止了跨站攻击（CSRF）的攻击，但是也带来了非常不好的用户体验。比如，一个合法的第三方网站包含有君喻连接，（假设君喻网站的 Cookie 带有`SameSite=strict`的设置），那么用户从第三方网页点击跳转就不会带上君喻的 Cookie，跳转过去后总是显示未登录状态，需要用户重新登录。

Lax 比 Strict 的规则宽松一点，它只允许第三方网站通过 GET 请求跳转到我们的服务器，并带上我们网站的 Cookie。

None 就表示没有限制。在老版本的浏览器中，如果不设置 Cookie 的 SameSite 规则，则默认的 SameSite 规则是`None`，但是 Chrome 浏览器升级了安全策略，现在如果不设置 SameSite 规则，默认的值为`Lax`。

假设我们在第三方网站跨域提交一个表单，发送 POST 请求给我们的服务器，那么浏览器发送给我们服务器的 Cookie 信息中只包括 SameSite 规则为 None 的 Cookie。如果发送的是 GET 请求，或者通过跳转链接访问我们的服务器，那么发送的 Cookie 信息则包括 SameSite 规则为 None 以及为 Lax 的 Cookie。

更严格的规则有助于防止跨站攻击（CSRF），因为用户如果伪装成合法的网站向我们发送数据，域名存在跨域，只要我们 Cookie 的 SameSite 规则设置成`Strict`，就可以通过是否带有 Cookie 来判断用户是否是从安全合法的 URL 访问我们的服务器了。

以上是 Cookie 设置的规则，它们可以组合使用，每个规则以分号分隔。比如说，下面的规则设置了一个 Cookie，它的域名是`junyux.com`，路径是`/`，有效时间是一天，不允许 JS 访问，不允许跨站发送：

```js
res.setHeader('Set-Cookie', `interceptor_js=${id}; Domain=junyux.com; Path=/ ; Max-Age=86400; HttpOnly; SameSite=Strict`);
```

## 总结

Cookie 是用来保存访问网页的用户状态，可以通过 HTTP 响应头的`Set-Cookie`字段来设置。Cookie 的规则包括以下几个方面：

- Max-Age：表示 Cookie 有效时长；

- Path：表示 Cookie 只在指定的 URL 请求中有效；

- Domain：表示 Cookie 在设置的 Domain 和它的子域名下都有效；

- Secure：表示 Cookie 只有使用 HTTPS/SSL 请求时有效；

- SameSite：可以用来限制第三方发来的 Cookie。

以上说的“有效”是指，保存在浏览器端的 Cookie 有效时，浏览器才会在请求服务器时，将这个 Cookie 发送给服务器。

Cookie 在 Web 应用中使用相当广泛，并不仅用来简单记录用户访问网站的次数，很多时候它被用来定位用户和收集用户行为信息。比如淘宝或京东推荐商品的原理就是根据 Cookie 定位用户，然后根据用户访问过的商品来进行相关推荐的。另外，Cookie 还是实现服务器端会话（Session）的重要手段。在下一节课，我们将介绍如何使用 Cookie 来实现服务器的 Session。