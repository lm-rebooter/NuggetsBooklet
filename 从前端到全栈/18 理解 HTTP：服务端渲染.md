上一节课里，我们实现了一个简单的动态 HTTP 服务，它采用拦截器模式。接下来几节课，我们将逐步实现动态 HTTP 服务器的其他功能，让它成为能够真正处理业务逻辑的 HTTP 服务器。通常情况下，HTTP 服务器处理业务逻辑的标准流程如下：

![](https://p2.ssl.qhimg.com/t01ddd7e5a440f0cb25.png)

URL 路由我们已经学完了，所以这一节课我们将实现请求参数的解析、HTTP 模板文件的加载和解析。

操作数据这一步将在下一节课说明，但是为了让例子能够运行，在这里我们会使用 JSON 文件来模拟（mock）数据。

## 解析 GET 请求数据

我们知道，URL 带有 query 部分，而这部分内容通常是由客户端发送给服务器的参数，尤其是 GET 请求。不过这些参数是以 queryString 的方式发送的，我们在服务端使用的时候，需要先将它进行解析。

与 GET 请求相比，POST 请求更加复杂，支持各种方式传递数据。我们常用的格式包括`application/x-www-form-urlencoded`、`multipart/form-data`、`application/json`等。

我们可以写一个拦截切面，专门用来解析 HTTP 请求中的数据，包括 URL 参数和 POST 请求数据。我们首先来解析请求的 URL 参数，这个比较简单。

```js
// aspect/param.js
const url = require('url');
const querystring = require('querystring');

module.exports = async function (ctx, next) {
  const {req} = ctx;
  const {query} = url.parse(`http://${req.headers.host}${req.url}`);
  ctx.params = querystring.parse(query);
  await next();
};
```

上面的代码是一个简单的拦截切面，使用内置模块 querystring 解析 URL 参数。querystring 可以将类似于`key1=value1&key2=value2&key3=value3`的 query 字符串解析成如下对象：

```js
{
  key1: 'value1',
  key2: 'value2',
  key3: 'value3',
}
```

这样我们就实现了对 URL 参数的解析。而 POST 请求的数据解析比 GET 请求要复杂一些，不同的格式解析的方式不一样，那这里我们先忽略对它们的解析，因为暂时还用不到，等到下一节课再对这个拦截切面添加 POST 请求的数据解析。

## 准备 Mock 数据

我们先来准备 Mock 数据。实际上 Mock 数据是现在 Web 开发时前端开发经常使用到的方法，因为大部分 Web App 的开发都是前后端分离的，也就是由前端工程师负责开发产品前端部分，后端工程师负责开发产品的后端部分，双方将各自的基础模块开发完成后再进行联调集成。

那这里就有一个问题，有可能前端工程师开发的功能需要后端数据，但是后端工程师还没有将接口开发好。这个时候，前端工程师就很有必要用虚拟的数据进行开发，这种方式就是 Mock 数据。

不过，对于纯前端来说，Mock 数据的方式通常以 JSON 对象的形式直接在浏览器端生成。而全栈工程师则可以直接在服务端 Mock 数据，这样数据直接可以封装成 HTTP 接口给前端调用，这种方式更灵活，而且更接近于联调的真实环境。

假设我们要做一个新冠病毒疫情数据查询的应用，准备了一份疫情的真实数据，我在这个[GitHub 仓库](https://github.com/maxMaxineChen/COVID-19-worldwide-json-data-script)中下载一份数据，这份数据包括了从 2020 年 1 月 22 日到 2020 年 4 月 15 日各国的疫情数据。

我们将这份文件保存在项目的 mock/data.json 文件中，然后将数据读取出来增加一个模块 mock，这里面实现我们读取数据的业务逻辑。假设我们的需求是：根据日期获取按照确诊人数排序的国家数据，那么 mock 模块的具体代码如下：

```js
// module/mock.js
const fs = require('fs');
const path = require('path');

let dataCache = null;

function loadData() {
  if(!dataCache) {
    const file = path.resolve(__dirname, '../../mock/data.json');
    const data = JSON.parse(fs.readFileSync(file, {encoding: 'utf-8'}));
    const reports = data.dailyReports; // 数组格式的数据
    dataCache = {};
    // 把数组数据转换成以日期为key的JSON格式并缓存起来
    reports.forEach((report) => {
      dataCache[report.updatedDate] = report;
    });
  }
  return dataCache;
}

function getCoronavirusKeyIndex() {
  return Object.keys(loadData());
}

function getCoronavirusByDate(date) {
  const dailyData = loadData()[date] || {};
  if(dailyData.countries) {
    // 按照各国确诊人数排序
    dailyData.countries.sort((a, b) => {
      return b.confirmed - a.confirmed;
    });
  }
  return dailyData;
}

module.exports = {
  getCoronavirusByDate,
  getCoronavirusKeyIndex,
};
```

如上面代码所示，我们的 mock 模块提供两个接口：
- getCoronavirusKeyIndex，获取所有有疫情记录的日期；
- getCoronavirusByDate，获取当前日期对应的疫情数据。

读取数据的函数是 loadData，它比较简单，用之前我们已经熟悉的 fs.readFileSync 读取文件即可。注意文件格式中，dailyReports 是个数组，不方便数据的查询，所以我们将它改成以 date 为 key 的 JSON 数据，并将它缓存在一个变量里，这样再查询就不用去读取文件了。

接下来，我们就可以配置路由来访问 mock 模块的数据接口了。

### 配置路由

配置路由还是使用上一节课实现的路由中间件：

```js
app.use(({req}, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(param);

app.use(router.get('/coronavirus/index', async ({route, res}, next) => {
  const {getCoronavirusKeyIndex} = require('./lib/module/mock');
  const index = getCoronavirusKeyIndex();
  res.setHeader('Content-Type', 'application/json');
  res.body = {data: index};
  await next();
}));

app.use(router.get('/coronavirus/:date', async ({route, res}, next) => {
  const {getCoronavirusByDate} = require('./lib/module/mock');
  const data = getCoronavirusByDate(route.date);
  res.setHeader('Content-Type', 'application/json');
  res.body = {data};
  await next();
}));

app.use(router.all('.*', async ({params, req, res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Not Found</h1>';
  res.statusCode = 404;
  await next();
}));
```

如上面代码所示，这里我们一共配置了 5 个拦截切面。
1. 第一个拦截切面是提供 log，这样我们在服务器的控制台上就能知道用户访问了哪个 URL。

2. 第二个拦截切面是前面实现的解析 GET 参数的拦截切面，每一个请求都会经过这个切面以获得 URL 中的 query 对象，不过这里我们暂时没有用到它。

3. 接着是两个路由`/coronavirus/index`和`/coronavirus/:date`，对应获取有疫情记录的日期和某个日期各国疫情数据这两个 API。最后是默认的路由，返回 404。

那么现在启动这个 HTTP 服务器，访问`http://localhost:9090/coronavirus/index`可以获得日期的 JSON 数据：

![](https://p5.ssl.qhimg.com/t011805c10db6dc1eb5.jpg)

访问`http://localhost:9090/coronavirus/2020-01-22`可以获得 2020 年 1 月 22 日当天的疫情 JSON 数据：

![](https://p5.ssl.qhimg.com/t010ba4e6fb84b5a268.jpg)

上面说的都是将 JSON 数据直接返回给客户端（这里是浏览器），再由客户端（浏览器）通过 JavaScript 将这些数据渲染成网页，这种渲染方式称为**客户端渲染**。此外还有一种方式，我们可以将数据在服务端直接渲染成 HTML 页面，再将它返回给客户端展示。这种在服务端直接渲染 HTML 页面的方式叫做**服务端渲染**。

## 服务端渲染

服务端渲染是指 HTTP 服务器直接根据用户的请求，获取数据，生成完整的 HTML 页面返回给客户端（浏览器）展现。相对地，HTTP 服务器根据用户请求返回对应的 JSON 数据，在 HTML 页面中通过 JavaScript 来生成最终用户看到的页面，叫做客户端渲染。比如，现在非常流行的 Vue 框架就是客户端渲染的一个应用。

实际上，在早期的 Web 1.0 时代，绝大部分 Web 应用都是使用服务端渲染的。那时候浏览器和 JavaScript 的能力有限，开发者除了在服务器生成好页面给客户端之外，几乎没什么其他选择。但是到了 Web 2.0 时代，Web 应用变得复杂，相比于服务端渲染要发送完整页面，客户端渲染每次只需要请求页面上需要更新的数据，网络传输数据量小，**能够显著减轻服务器压力**。而且客户端渲染**真正实现了前后端职责分离**，后端只需关注数据，逻辑由前端的 JS 去完成，这种开发模式更加灵活，效率也更高。因此，客户端渲染渐渐成为了主流。

但是，随着 Web 技术的发展，Web 应用越来越复杂，在某些特定的情况下，采用服务端渲染要比客户端渲染有优势，所以服务端渲染又逐渐回归人们的视野，成为了特定场景下的一种选择。

**那什么情况下使用服务端渲染更好呢？**

服务端渲染直接生成好 HTML，不需要在客户端执行 JS，这样浏览器渲染速度快，能够充分利用缓存策略。而且服务端直接生成 HTML 内容，对搜索引擎蜘蛛（搜索引擎机器人）更友好，利于 SEO。因此，如果对网页渲染速度非常敏感的应用通常会在首屏（即用户浏览器可以看到的第一屏内容）使用服务端渲染，而如果是一些特定的需要依赖良好的 SEO 的场景也会选择使用服务端渲染，至于另外一些简单的应用，不需要复杂的 JS 实现交互逻辑，采用服务端渲染也更简单，效率也更高。

总的来说，如果应用**对网页渲染速度敏感**，或是**依赖 SEO**，或是**比较简单**，就更适合使用服务端渲染。

服务端渲染通常将数据和 HTML 模板结合（比如早期的 asp、jsp、php），解析成 HTML 内容返回给客户端，而 HTML 模板解析 HTML 内容，通常由模板引擎来完成。Node.js 中有许多功能强大的模板引擎，我们可以选择其中一种模板引擎来使用。

### Handlebar 模板引擎

这里我们选择一种流行的模板引擎——[Handlebars](https://github.com/handlebars-lang/handlebars.js)，讲讲它的使用。首先是安装：

```bash
npm install handlebars --save
```

然后，我们准备日期目录的模板文件（coronavirus_index.html）：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>疫情目录</title>
</head>
<body>
  <ul>
    {{#each data ~}}
      <li><a href="./{{this}}">{{this}}</a></li>
    {{~/each}}
  </ul>
</body>
</html>
```

`{{#each}}`是 handlebars 的循环指令，data 是传给 handlebars 模板的数据，在`/coronavirus/index`中，我们传的数据是一个数组。我们修改对应的拦截切面：

```js
app.use(router.get('/coronavirus/index', async ({route, res}, next) => {
  const {getCoronavirusKeyIndex} = require('./lib/module/mock');
  const index = getCoronavirusKeyIndex();
  const handlebars = require('handlebars');

  // 获取模板文件
  const tpl = fs.readFileSync('./view/coronavirus_index.html', {encoding: 'utf-8'});

  // 编译模板
  const template = handlebars.compile(tpl);

  // 将数据和模板结合
  const result = template({data: index});
  res.setHeader('Content-Type', 'text/html');
  res.body = result;
  await next();
}));
```

这段代码表示当我们访问路径名为'/coronavirus/index'的时候，执行服务端渲染的拦截切面。这个切面实现了将数据（index）与我们自定义的模板文件相结合，生成 HTML 格式的数据，并返回给浏览器的功能。

其中`handlebars.compile(tpl)`这个方法根据模板语法编译模板文件，编译后返回一个函数（template）。然后通过调用这个函数`template({data: index})`，将模板里的变量用我们的给定的数据替换。

最终渲染出来的页面内容是一个日期的列表，点击链接进入相应的疫情数据页面。

![](https://p2.ssl.qhimg.com/t01a1377d7ef0483d69.jpg)

同样，我们可以准备疫情数据页面的模板文件（coronavirus_date.html）：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>疫情数据</title>
  <style>
    td:not(:first-child) {
      text-align: right;
    }
    td:nth-child(3) {
      color: red;
    }
    td:nth-child(4) {
      color: green;
    }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr><th>国家</th><th>确诊</th><th>死亡</th><th>治愈</th></tr>
    </thead>
    <tbody>
    {{#each data.countries ~}}
      <tr><td>{{country}}</td><td>{{confirmed}}</td><td>{{recovered}}</td><td>{{deaths}}</td></tr>
    {{~/each}}
    </tbody>
  </table>
</body>
</html>
```

然后修改对应的拦截切面：

```js
app.use(router.get('/coronavirus/:date', async ({params, route, res}, next) => {
  const {getCoronavirusByDate} = require('./lib/module/mock');
  const data = getCoronavirusByDate(route.date);

  const handlebars = require('handlebars');
  const tpl = fs.readFileSync('./view/coronavirus_date.html', {encoding: 'utf-8'});

  const template = handlebars.compile(tpl);
  const result = template({data});

  res.setHeader('Content-Type', 'text/html');
  res.body = result;

  await next();
}));
```

这样我们就直接用服务端渲染生成了疫情数据的 HTML 表格，这是最终访问的输出结果：

![](https://p4.ssl.qhimg.com/t01faea89382fc7af10.jpg)

这样我们就实现了简单的服务端渲染。

注意，我们实际上没有使用到前面实现的解析 query 参数的拦截切面。这是因为我们采用了路由参数 date，路由参数和 query 参数的作用差不多。当然不是所有的参数都适合使用路由，有的参数使用 query 还是更合适一些。比如，如果我们要对表格数据实现分页的话，把分页也放在路由里面会让 URL 路径变长，而且不那么美观，这时候用 query 参数会更合适。后续我们会有实际的项目既使用路由参数又使用 query 参数，到时候可以再深入体会它们的不同。

在这里，我们也增加一个简单的 query 参数 type，当 type=json 的时候，我们仍然让页面返回 JSON 数据，这样便于我们开发调试。要实现这个，我们只要再简单修改一下拦截切面即可：

```js
app.use(router.get('/coronavirus/:date', async ({params, route, res}, next) => {
  const {getCoronavirusByDate} = require('./lib/module/mock');
  const data = getCoronavirusByDate(route.date);

  if(params.type === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.body = {data};
  } else {
    const handlebars = require('handlebars');
    const tpl = fs.readFileSync('./view/coronavirus_date.html', {encoding: 'utf-8'});

    const template = handlebars.compile(tpl);
    const result = template({data});

    res.setHeader('Content-Type', 'text/html');
    res.body = result;
  }
  await next();
}));
```

## 总结

通常情况下，动态 HTTP 服务器的完整功能包括了 URL 路由、参数解析、业务数据处理，以及将处理好的数据返回给客户端。返回给客户端的方式通常有两种方式：第一种是返回业务数据，通常是 json 格式；第二种是直接返回 HTML 网页。

第一种方式中，HTTP 服务器根据用户请求返回对应的 JSON 数据，在 HTML 页面中通过 JavaScript 来生成最终用户看到的页面，叫做客户端渲染。

第二种方式中，HTTP 服务器根据用户请求，将对应的业务数据和 HTML 模板相结合，将完整的 HTML 页面返回给客户端（浏览器）直接展现，这种方式称为服务器端渲染。

这两种渲染方式各有利弊。客户端渲染能够降低服务器的压力，并且可以真正做到前后端职责分离，后端只需关注数据，逻辑由前端的 JS 去完成，这种开发模式更加灵活，效率更高。而服务端渲染较之客户端渲染虽然增加了服务器的压力，但是这种方式加快了客户端的渲染速度，能够充分利用缓存策略，并且还有利于 SEO。所以服务端渲染，一般使用在首屏加载或者需要依赖良好 SEO 的场景。所以如何选择需要根据你自身的项目决定。

最后，这一节课中提到的 Handlebars 是一个非常强大的模板引擎，我们的例子只是简单地介绍了它的使用，关于它的更多内容，你可以通过[Handlebars 官网](https://handlebarsjs.com/)详细了解。这个模板引擎，我们在后续的项目实战中还会继续使用。
