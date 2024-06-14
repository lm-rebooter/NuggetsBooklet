Node 里怎么打印日志呢？

有同学说，不也是用 console.log 么。

不，服务端打印日志一般不会用 console.log。

因为 console.log 打印完就没了，而服务端的日志经常要用来排查问题，需要搜索、分析日志内容，所以需要写入文件或者数据库里。

而且打印的日志需要分级别，比如有的是错误的日志，有的只是普通日志，需要能够过滤不同级别的日志。

此外，打印的日志需要带上时间戳，所在的代码位置等信息。

这些都是 console.log 没有的功能。

所以我们一般都会用专门的日志框架来做，比如 winston。

它是 Node 最流行的日志框架，[npm 官网](https://www.npmjs.com/package/winston)上可以看到每周千万级的下载量：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a0d65f5b90548bfaa4c5ac12a888697~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=556&h=604&s=47935&e=png&b=fefefe)

那 winston 都有什么功能？怎么用呢？

我们试试看：

```
mkdir winston-test
cd winston-test
npm init -y
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/642f73bedb39404aaebab2522cd2f7fe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=812&h=686&s=127944&e=png&b=000000)

先创建个项目。

安装 winston：

```
npm install --save winston
```
然后写下 index.js

```javascript
import winston from 'winston';

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
            dirname: 'log', filename: 'test.log' 
        }),
    ]
});

logger.info('光光光光光光光光光');
logger.error('东东东东东东东东');
logger.debug(66666666);
```
用 createLogger 创建了 logger 实例，指定 level、format、tranports。

level：打印的日志级别

format：日志格式

transports：日志的传输方式

我们指定了 Console 和 File 两种传输方式。

在 package.json 里指定 type 为 module，也就是所有代码都是 es module 的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e342e670838498b8f1b1a42dc913bed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=530&h=402&s=55987&e=png&b=202020)

这样代码里就可以直接用 import、export 这些语法了。

用 node 跑一下：

```
node index.js
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ea61bd0d0cf45e6b0f31ade40551308~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1210&h=564&s=88217&e=png&b=1b1b1b)

可以看到控制台和文件里都有了打印的日志。

再跑一遍：

```
node index.js
```
会在后面追加：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/527f2f4f626948e6bc30fb40e6ae038c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=908&h=338&s=56832&e=png&b=1d1d1d)

那么问题来了，如果所有日志都写在一个文件里，那这个文件最终会不会特别大？

不用担心，winston 支持按照大小自动分割文件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4f8daa3082c4ff3a323e2a9c60ecef1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=642&s=119756&e=png&b=1f1f1f)

我们指定 maxsize 为 1024 字节，也就是 1kb。

然后再跑几次：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b0e054204ef45438c81d714c76c0515~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1132&h=1148&s=223224&e=png&b=1a1a1a)

大概跑了 10 次左右，出现了第二个文件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3d388d3363547be863123c531bdba92~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=910&h=332&s=59599&e=png&b=1e1e1e)

而这时第一个日志文件刚好是 1kb：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ec72c1f41154446827eaa063bd5435e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=926&h=596&s=67453&e=png&b=fefefe)

这就是根据大小自动分割日志文件的功能。

有同学说，一般日志都是按照日期自动分割的，比如 2023-10-28 的日志文件，2023-10-29 的日志文件，这样之后也好管理。

这个支持么？

当然支持，但是要换别的 Transport 了。

在 [winston 文档](https://github.com/winstonjs/winston/blob/HEAD/docs/transports.md#winston-core)里可以看到有很多 Transport：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea5db55345e24f0bb77ddc3c37d37ba3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=864&h=1016&s=106987&e=png&b=ffffff)

Console、File、Http、Stream 这几个 Transport 是内置的。

下面还有很多社区的 Transport，比如 MongoDB 的 Transport，很明显就是把日志写入 mongodb 的。

这里的 DailyRotateFile 就是按照日期滚动存储到日志文件的 Transport。

我们试试看：

```
npm install --save winston-daily-rotate-file
```
安装这个 Transport。

然后改下代码：

```javascript
import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
            level: 'info',
            dirname: 'log2',
            filename: 'test-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH-mm',
            maxSize: '1k'
        })
    ]
});

logger.info('光光光光光光光光光');
logger.error('东东东东东东东东');
logger.debug(66666666);
```

这里使用了 DailyRotateFile 的 transport，然后指定了文件名和日期格式。

指定文件名里的日志格式包含分钟，所以不同的分钟打印的日志会写入不同文件里：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33f0cb082f31458e988525910787d0fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=322&s=62610&e=png&b=1e1e1e)

这就达到了滚动日志的效果。

再来试试 http 的 transport：

先创建个 nest 服务：

```
nest new winston-log-server
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d82b3a3bc694cdebed44d65a4a6dcdd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=942&h=674&s=284602&e=png&b=010101)

添加一个路由：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9627e64fdb34e36a2bc0ae411bbb06b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=814&h=666&s=117492&e=png&b=1f1f1f)
```javascript
@Post('log')
log(@Body() body) {
    console.log(body);
}
```
把它跑起来：

```
npm run start:dev
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a877b312c1e84825b8ab687f52a80866~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1228&h=366&s=122431&e=png&b=181818)

然后改下 index.js

```javascript
import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.Http({
            host: 'localhost',
            port: '3000',
            path: '/log'
        })
    ]
});

logger.info('光光光光光光光光光');
logger.error('东东东东东东东东');
logger.debug(66666666);
```
使用 http 的 transport 来传输日志。

跑一下：
```
node ./index.js
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e78108e221b74dcf81e7551f990e49b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=542&h=164&s=23391&e=png&b=191919)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b39035003c343b7a6d31e89a3a6576c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=830&h=512&s=111820&e=png&b=181818)

nest 服务收到了传过来的日志。

基本上，内置的和社区的 transport 就足够用了，不管是想把日志发送到别的服务，还是把日志存到数据库等，都可以用不同 Transport 实现。

这些 transport 可以用 add、remove 方法来动态增删：

```javascript
import winston from 'winston';

const console = new winston.transports.Console();
const file = new winston.transports.File({ filename: 'test.log' });

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple()
});

logger.clear();
logger.add(console);
logger.remove(console);
logger.add(file);

logger.info('光光光光光光光光光');
logger.error('东东东东东东东东');
logger.debug(66666666);
```
比如我先 clear，然后动态添加又删除了 console，然后又添加了一个 file 的 transport。

效果就是只有一个 file 的 transport：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e4a9ad955fb498182bda9231b0dd581~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1082&h=684&s=92309&e=png&b=1c1c1c)

再就是日志级别，winston 有 6 种级别的日志：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5577d07cbe21459f9b4fffcba5443e7b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=472&h=486&s=30770&e=png&b=f7f7f7)

从上往下，重要程度依次降低。

比如当你指定 level 是 info 时，那 info、warn、error 的日志会输出，而 http、debug 这些不会。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65d7eba57be74bb4a295117aa74a0b89~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=826&h=608&s=91608&e=png&b=1d1d1d)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38f5993e89a44ae08d6d38512d7a62f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=858&h=702&s=105645&e=png&b=1d1d1d)

日志级别的功能虽然简单，但却是很实用的功能。

日志可以通过 format 指定格式：

simple：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8399f03b559e4d35ab022d17bec48d48~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=786&h=744&s=114721&e=png&b=1d1d1d)

json：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1a86f51a19b4aedb73ca853a4d49b7d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=794&h=718&s=120569&e=png&b=1d1d1d)

prettyPrint（比 json 的格式多了一些空格）：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eff507e4696e453eaa6f10d272bf2bc4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=896&h=792&s=131623&e=png&b=1d1d1d)

用 combine 组合 timestamp 和 json：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9740fb3f13414789884fb2d615676d25~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1296&h=742&s=149315&e=png&b=1d1d1d)

或者再组合个 label：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f453f0e45de044509a7de965edefdd15~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1488&h=626&s=142403&e=png&b=1d1d1d)

加上个标签，再搜索相关日志就方便多了。

彩色：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61e3762babce4aa681dc2d132b825ee5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=834&h=698&s=113226&e=png&b=1d1d1d)

通过这些，就可以指定各种日志格式。

但现在有个问题，如果我不同的 transport 要指定不同的格式呢？

可以这样：

```javascript
import winston from 'winston';

const logger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({ 
            dirname: 'log3',
            filename: 'test.log',
            format: winston.format.json()
        }),
    ]
});

logger.info('光光光光光光光光光');
logger.error('东东东东东东东东');
logger.debug(66666666);
```

每个 transport 单独指定 format 就好了。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ba9e0e9c4ac47a5a1563c3bc2e6dce1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=514&h=160&s=22739&e=png&b=181818)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50cea20a3307415c8ba1369094ead62b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=210&s=50227&e=png&b=1e1e1e)

那如果我有的日志只想 console，而有的日志希望写入文件，而且配置都不同呢？

我们可以创建多个 logger 实例，每个 logger 实例有不同的 format、transport、level 等配置：

```javascript
import winston from 'winston';

winston.loggers.add('console', {
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

winston.loggers.add('file', {
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            dirname: 'log4',
            filename: 'test.log',
            format: winston.format.json()
        })
    ]
});


const logger1 = winston.loggers.get('console');

logger1.info('aaaaa');
logger1.error('bbbbb');

const logger2 = winston.loggers.get('file');

logger2.info('xxxx');
logger2.info('yyyy');
```
我们创建了 2 个 logger 实例，其中一个只写入 console，另一个只写入 file，并且 format 都不同。

然后分别用不同的 logger 来打印日志。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee8252d81b5b4d6fbacdaa32eded9861~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=386&h=148&s=18845&e=png&b=181818)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb3fa4aba52e4e54bb7059e8317c89cb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1228&h=214&s=45557&e=png&b=1f1f1f)

这样，项目中有不同的日志需求的时候，就可以创建多个 logger 实例。

此外，winston 还支持指定如何处理未捕获的错误的日志：

```javascript
import winston from 'winston';

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: 'error.log'
        })
    ]
});

throw new Error('xxx');

logger.info('光光光光光光光光光');
logger.error('东东东东东东东东');
logger.debug(66666666);
```
跑一下，可以看到错误日志被输出到了 error.log

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05be437a9ab24732a2c04d0b57e8bd5d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1224&h=246&s=52553&e=png&b=1f1f1f)

除了 error 外，Promise 的未捕获异常也可以指定如何处理日志：

```javascript
import winston from 'winston';

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: 'rejection.log'
        })
    ]
});

(async function(){
    throw Error('yyy');
})();

logger.info('光光光光光光光光光');
logger.error('东东东东东东东东');
logger.debug(66666666);
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50ec5aff43824a1ba3df19fefa42aca6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1238&h=268&s=66666&e=png&b=1f1f1f)

这些就是 winston 的主要功能了。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/winston-test)。

## 总结

Node 服务端我们不会用 console.log 打印日志，而是会用日志框架，比如 winston。

winston 支持 tranport 配置，可以把日志传输到 console、file、通过 http 发送到别的服务，写入 mongodb 数据库等。

社区有很多 transport 可用，我们尝试了滚动日志的 transport，可以根据日期来自动分割日志文件。

winston 还支持 level 配置，可以根据级别来过滤日志。

而且还支持 format 的设置，比如 json、simple、label、timstamp 等，一般我们输出到文件里的都是 json 格式，并且给他加上时间戳和 label，这样方便之后分析。

每个 transport 都可以单独指定 format，而且还可以创建多个 logger，每个 logger 用不同的配置。

此外，winston 还支持指定未捕获的 error 的日志怎么处理。

总之，相比直接 console.log，用 winston 这样的灵活强大的日志框架可太香了。
