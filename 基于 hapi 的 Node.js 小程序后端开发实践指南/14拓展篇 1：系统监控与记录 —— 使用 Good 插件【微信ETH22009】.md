# 拓展篇 1：系统监控与记录 —— 使用 Good 插件

与任何服务器软件一样，日志记录非常重要，hapi 提供的用于检索和打印日志的内置方法非常少，要获得功能更丰富的日志记录体验，我们可以使用 Good 插件，这一节给大家介绍 Good 插件的使用和扩展。

Good 是一个 hapi 插件，用于监视和报告来自主机的各种 hapi 服务器事件以及 ops 信息。它侦听 hapi 服务器实例发出的事件，并将标准化事件推送到流集合中。

Good 插件目前有这四个扩展功能： good-squeeze、good-console、good-file、good-http。

## 使用 Good 和它的扩展

安装相关的依赖:

```bash
$ npm i good@7
$ npm i good-squeeze@5
$ npm i good-console@7 
$ npm i good-file@6 
$ npm i good-http@6
```

### good-squeeze

good-squeeze 是一个小转换流的集合。它提供了两个类，Squeeze 和 SafeJson, Squeeze 流基于良好的事件选项来过滤事件。SafeJson 流用于把对象转成 JSON 字符串，并且可以防止对象中循环引用引起的错误。

它是后文提到的日志小组件的基件模块。

### good-console

good-console 能够将服务 good 服务事件转化为格式化字符串的转换流插件，最终通过 stdout 在控制台打印输出。

> GoodConsole([config])

good-console 本身提供 3 个参数来简单配置控制台的打印信息：

- **format**：使用 MomentJS 格式化时间， 默认值 `YYMMDD/HHmmss.SSS`。

- **utc**：boolean 输出时间是否为布尔值， 默认值 `true`。

- **color**：boolean 是否彩色输出，默认值 `true`。


一般使用方式：

```js
const Hapi = require('hapi');
const server = new Hapi.Server();
server.register({
  plugin: require('good'),
  {
    ops: {
      interval: 1000
    },
    reporters: {
      typeConsole: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*' }]
        },
        {
          module: 'good-console'
        },
        'stdout'
      ]
    }
  }
});

```

控制台输出：

```bash
"ops" - 160318/013330.957, [ops] memory: 29Mb, uptime (seconds): 6, load: [1.650390625,1.6162109375,1.65234375]
"error" - 160318/013330.957, [error,event.tags] message: Just a simple error, stack: event.error.stack
"request" - 160318/013330.957, [request,event.tags] data: you made a request
"log" - 160318/013330.957, [log,event.tags] data: you made a default
"response" - 160318/013330.957, [response, event.tags] http://localhost:61253: post /data {"name":"adam"} 200 (150ms)
```

### good-file

基于 good-console 的控制台输出日志，当遇到控制台断开或是重启的时候，历史日志将无法找回，此时，在本地生成一份写文件的日志记录，会更好地便于日后的追溯。good-file 插件很好地解决了这样的需求痛点。

> GoodFile (path, options)

- **path**：必填项，用来定义日志的写入目录。
- **options**：选填项，文件流的选项。 默认值为` { encoding: 'utf8', flags: 'a', mode: 0o666 }`。

```js
const Hapi = require('hapi');
const server = new Hapi.Server();
server.register({
  plugin: require('good'),
  {
    ops: {
      interval: 1000
    },
    reporters: {
      typeFile: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ ops: '*' }]
        },
        {
          module: 'good-squeeze',
          name: 'SafeJson'
        },
        {
          module: 'good-file',
          args: ['logs/awesome_log']
        }
      ]
    }
  }
});
```

日志文件写入内容：

```json
{"event":"ops","timestamp":1533196128529,"host":"localhost","pid":4811,"os":{"load":[1.1796875,1.31396484375,1.4248046875],"mem":{"total":17179869184,"free":245399552},"uptime":6955},"proc":{"uptime":46.294,"mem":{"rss":67424256,"heapTotal":39247872,"heapUsed":33415360,"external":459322},"delay":0.13622099999338388},"load":{"requests":{"3000":{"total":0,"disconnects":0,"statusCodes":{}}},"concurrents":{"3000":0},"responseTimes":{"3000":{"avg":null,"max":0}},"sockets":{"http":{"total":0},"https":{"total":0}}}}
{"event":"ops","timestamp":1533196143532,"host":"localhost","pid":4811,"os":{"load":[1.07177734375,1.2822265625,1.4111328125],"mem":{"total":17179869184,"free":272433152},"uptime":6970},"proc":{"uptime":61.298,"mem":{"rss":67440640,"heapTotal":39247872,"heapUsed":33433192,"external":459322},"delay":0.18492200039327145},"load":{"requests":{"3000":{"total":0,"disconnects":0,"statusCodes":{}}},"concurrents":{"3000":0},"responseTimes":{"3000":{"avg":null,"max":0}},"sockets":{"http":{"total":0},"https":{"total":0}}}}
{"event":"ops","timestamp":1533196158532,"host":"localhost","pid":4811,"os":{"load":[1.123046875,1.2841796875,1.40966796875],"mem":{"total":17179869184,"free":275496960},"uptime":6985},"proc":{"uptime":76.298,"mem":{"rss":67461120,"heapTotal":39247872,"heapUsed":33451336,"external":459322},"delay":0.09521899931132793},"load":{"requests":{"3000":{"total":0,"disconnects":0,"statusCodes":{}}},"concurrents":{"3000":0},"responseTimes":{"3000":{"avg":null,"max":0}},"sockets":{"http":{"total":0},"https":{"total":0}}}}
```

## good-http

除此之外，在实际应用场景中，我们会遇到一些高危异常的错误情况，这类日志我们更希望能在错误发生的第一时间，就通过自动报警的方式，来通知开发人员及时介入响应。这里可以使用 good-http 插件，它可以构造一个 post 的请求接口，将定义的重要日志信息以 JSON 的数据结构方式，推送到目标端点。

> GoodHttp (endpoint, config)

- **endpoint**：日志发送的目标地址

- **config**：Object 类型的配置项目

  - threshold：一次事件的发送的事件持有量，默认值为 20
  
  - errorThreshold：日志传输失败的连续重试次数，默认为 0。传输失败的日志，会以 Failed 的 event 包含在下一次的错误传输里
  
  - wreck：用于配置 HTTP 推送的额外接口参数数据，默认值为空。推送内容的 content-type 为 application/json，推送超时时间 60 秒
  

```js
const Hapi = require('hapi');
const server = new Hapi.Server();
server.register({
  plugin: require('good'),
  {
    ops: {
      interval: 1000
    },
    reporters: {
      typeHttp: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ error: '*' }]
        },
        {
          module: 'good-http',
          args: ['http://target.log:3000', {
              wreck: {
                headers: { 'x-api-key': 12345 }
              }
          }]
        }
      ]
    }
  }
});
```

最终数据日志将以如下的方式作为传输：

```json
{
  "host":"servername.home",
  "schema":"good-http",
  "timeStamp":1412710565121,
  "events":[
      {
        "event":"request",
        "timestamp":1413464014739,
        ...
      },
      {
        "event":"request",
        "timestamp":1414221317758,
        ...
      },
  ]
}
```

### 组合使用日志插件

上文中分别介绍了三种不同功效的日志组件，在实际项目使用中，可以进行组合性配置，在 reporters 字段中使用不同的 key 来区分即可。例如：

```js

reporters: {
  typeConsole: [
    // good-console 的一系列配置
  ],
  typeFile: [
    // good-file 的一系列配置
  ],
  typeHttpA: [
    // good-http 针对 A 平台的一系列配置
  ],
  typeHttpB: [
    // good-http 针对 B 平台的一系列配置
  ],
}

```

> hapi good 日志接口可参考 [good API](https://github.com/hapijs/good/blob/master/API.md)。

## 使用 good-http 结合 Sentry 自动收集错误日志

### Sentry 简介
Sentry 中文翻译过来是哨兵的意思，从字面中可以知道 「站岗、放哨、巡逻、稽查的士兵」，不错，Sentry 是程序的「哨兵」 。它可以监控我们在生产环境中项目的运行状态，一旦某段代码运行报错，或者异常，会第一时间把报错的 路由，异常文件，请求方式 等一些非常详细的信息以消息或者邮件给我们，让我们第一时间知道：程序出错了，然后我们可以从 Sentry 给我们的详细的错误信息中瞬间找到我们需要处理的代码，并及时修正。

### Sentry 服务搭建流程

利用 hapi 的 API 服务能力再搭建一个简易的内网 API 服务，该服务使用 Sentry 的 raven 插件进行错误日志的收集与汇报，日志的信息源来自应用服务的 good-http 插件。

1. 申请 Sentry 的 API key。

2. 配置 Sentry 的错误收集与报告插件 raven。

```bash
$ npm i raven
```

```js
var Raven = require('raven');
Raven.config('https://your-sentry-api-key@sentry.io/182062').install();
```

3. 提供错误日志接收服务。

```js
{
  method: 'POST',
  path: '/reportErrorLog',
  handler: async (request, reply) => {   
    //直接将请求参数上报到 Sentry 
    Raven.captureException(request.payload)                         
    reply()
  },
  config: {
    tags: ['api', 'report'],
    auth: false,
  }
}
```

4. 配置应用服务中 good-http 的错误日志推送到上述含有 Sentry raven 的 API 微服务。

```js
server.register({
  plugin: require('good'),
  {
    ops: {
      interval: 1000
    },
    reporters: {
      typeHttp: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ error: '*' }]
        },
        {
          module: 'good-http',
          args: ['http://your-sentry-server/reportErrorLog', {}]
        }
      ]
    }
  }
});
```

## 小结

关键词：日志系统，Good, Sentry

本小节，我们围绕系统日志的话题，一起学习了 hapi-good 的三种日志记录方式。不同的日志形式都有其不同使用场景下存在的价值。而 good-http 与 Sentry 的高效融合，更是一种非常愉悦的系统化集成体验。

**本小节参考代码汇总**

hapi good 日志接口： [good API](https://github.com/hapijs/good/blob/master/API.md)
