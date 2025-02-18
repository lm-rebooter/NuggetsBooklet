现在我们的日志都是直接打印在 console 的，这样开发时没问题，但是线上有时候我们要去查日志，这时候在 console 打印的日志就不是很方便。

所以我们要把日志保存在文件里，或者通过 http 发送到专门的日志服务器。

而 winston 等日志框架就是做这个的。

nest 集成 winston 直接用 [nest-winston](https://www.npmjs.com/package/nest-winston) 这个包，没必要自己写。

在 backend 项目里安装下依赖：

```
npm install --save nest-winston winston
```

然后在 AppModule 引入下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0327052062f145bf8130ddb7948e9b9e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1456&h=1476&s=314227&e=png&b=1f1f1f)

```javascript
WinstonModule.forRootAsync({
  useFactory: () => ({
    level: 'debug',
    transports: [
      new winston.transports.File({
        filename: `${process.cwd()}/log`,
      }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
    ],
  })
}),
```
我们指定日志输出级别是 debug，输出到的 transport 包括 console 和 file。

然后把 winston 的 logger 设置为 Nest 的默认 Logger：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c809803b16143cf8b66274316195e0d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1502&h=1588&s=394996&e=png&b=1f1f1f)

```javascript
app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
```

跑下试试：

```
npm run start:dev
```
可以看到，除了 console 之外， log 文件中也输出了一份：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f328d76fa414d9b9cb0ec743628afa3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2920&h=1822&s=1191563&e=png&b=1a1a1a)、

两个 transport 都生效了。

页面刷新下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da01aa842bd24fb9b964ae0924d577bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2960&h=1308&s=154581&e=gif&f=11&b=fdfdfd)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3fa3004bf4449fdbe93b9dc82236126~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2986&h=1836&s=950110&e=png&b=1a1a1a)

你会发现 typeorm 的日志并没有输出到文件。

这是因为 TypeORM 有自己的 Logger。

它当然也是可以自定义的。

我们在 src 下新建一个 CustomTypeOrmLogger.ts 文件：

```javascript
import { WinstonLogger } from 'nest-winston';
import { Logger, QueryRunner } from 'typeorm';

export class CustomTypeOrmLogger implements Logger {

    constructor(private winstonLogger: WinstonLogger) {

    }

    log(level: 'log' | 'info' | 'warn', message: any) {
        this.winstonLogger.log(message);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.winstonLogger.log({
            sql: query,
            parameters
        });
    }

    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.winstonLogger.error({
            sql: query,
            parameters
        });
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.winstonLogger.log({
            sql: query,
            parameters,
            time
        });
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        this.winstonLogger.log(message);
    }

    logMigration(message: string, queryRunner?: QueryRunner) {
        this.winstonLogger.log(message);
    }

}
```
就是实现 typeorm 的 Logger 接口，实现各种方法就好了。

具体的实现也比较简单，就是通过构造器传入 WinstonLogger，然后分别调用 log、error 等方法打印下日志。

然后我们在 TypeOrmModule 用一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbb312ba456c480ebbaa686f1edc6368~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1926&h=1640&s=431170&e=png&b=1f1f1f)

试下效果：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2212b64daaf49a9b09efd73e3e4f03b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2628&h=1756&s=1011190&e=png&b=1b1b1b)

现在 console 和 file 里就有 typeorm 的日志了。

现在的日志都是保存在单个文件里，不断追加内容，这样文件会越来越大，不好维护。

我们改下 transport，换成按照日期来分割日志那种。

安装用到的包：

```
npm install --save winston-daily-rotate-file
```
用一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f6288774f514697a6cd6af13fe317b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1264&h=1312&s=276804&e=png&b=1f1f1f)

```javascript
new winston.transports.DailyRotateFile({
  level: 'debug',
  dirname: 'daily-log',
  filename: 'log-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '10k'
}),
```
指定目录为 daily-log，然后指定文件名的格式和日期格式，文件最大的大小为 10k。

试试看：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/911ce21ea859459c80e3535c9bad8e68~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2932&h=1816&s=1175400&e=png&b=1c1c1c)

多刷新几次页面：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5664e386f20b4795aed056aa528563d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2436&h=1820&s=730143&e=png&b=1c1c1c)


![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1738eebc818a4fefbb8ae6da326ad803~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=934&h=646&s=72906&e=gif&f=18&b=fafafa)

可以看到，产生了几个文件，每个都是 10k 左右。

当然，最重要的是它会自动按照日期分割。

我们改下本地时间：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ad5b5426a924140a681d7e7c37c8b04~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1152&h=842&s=179376&e=png&b=d8d8d7)

然后刷新页面，可以看到，日志被记录在了新的文件里：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e0b93e6f95847d485bb652ed068e58e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2364&h=1766&s=509646&e=png&b=1c1c1c)

也就是说，日志会按照日期为维度来分割，并且超过了一定 maxSize 也会分割。

这样，我们查日志的时候就可以找到当天的日期，在日志文件里搜索了。

把 winston 的配置也抽到 .env 里：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e684de22c0e431b99abfb52f77de4a0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1088&h=780&s=150798&e=png&b=1f1f1f)

```javascript
winston_log_level=debug
winston_log_dirname=daily-log
winston_log_filename=log-%DATE%.log
winston_log_date_pattern=YYYY-MM-DD
winston_log_max_size=1M
```
然后在 WinstonModule 里读取：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bb8da0c5c6a40ea9a2e1447ac84cc42~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1414&h=1208&s=289611&e=png&b=1f1f1f)

```javascript
WinstonModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    level: 'debug',
    transports: [
      new winston.transports.DailyRotateFile({
          level: configService.get('winston_log_level'),
          dirname: configService.get('winston_log_dirname'),
          filename: configService.get('winston_log_filename'),
          datePattern: configService.get('winston_log_date_pattern'),
          maxSize: configService.get('winston_log_max_size')
      }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike(),
        ),
      }),
    ],
  }),
  inject: [ConfigService]
}),
```
跑下试试：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25ed8c902d2c4ef2b71f2dfcfd8d6768~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2840&h=1780&s=929093&e=png&b=1c1c1c)

没啥问题。

这样，我们的 winston 就集成成功了。

此外，如果你有单独的日志服务，那就更方便了，不需要去服务器查日志文件，可以通过日志服务来查。

假设我们有了这样的日志服务，那可以加一个 Http 的 transport 来上传日志。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/394661fccbf74edabe594090753d4cc5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1328&h=1300&s=308857&e=png&b=1f1f1f)

```javascript
new winston.transports.Http({
  host: 'localhost',
  port: 3002,
  path: '/log'
})
```
创建个 nest 项目作为日志服务来接收下：

```
nest new log-server
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3746653cc8a4eb5b7b2e698569b2cc5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=902&h=574&s=349154&e=png&b=fefdfd)

改下端口：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0a6a33f5bde4ab78d085a14a15d086c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=428&s=88168&e=png&b=1f1f1f)

加个 /log 的路由：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c018a87f547b4182b7445212f674b7b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1244&h=812&s=150085&e=png&b=1f1f1f)

把服务跑起来：

```
npm run start:dev
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a37f6b90d58540b397a1dd0206fa49e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1848&h=468&s=160367&e=png&b=181818)

页面上触发下查询：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d9cb2e734d84a13af12cf31a25fb1c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2786&h=1338&s=360409&e=gif&f=17&b=fdfdfd)

可以看到所有的日志都接收到了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abc096995d6244e697dd039dcf879fc8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2512&h=1588&s=6856326&e=gif&f=25&b=181818)

同时在 console、file、日志服务三个地方保存了日志，这就是 winston 的魅力。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d7da906a3464437bed6e8cf6cde7727~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2888&h=1798&s=1040269&e=png&b=1b1b1b)

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/meeting_room_booking_system_backend)

## 总结

这节我们集成了日志框架 winston。

没接入 winston 之前，我们都是在 console 打印日志，如果出了问题想查日志很不方便。

接入 winston 之后，日志会在 console 打印，还会保存到日志文件中，按照日期分割，另外还会发送到日志服务来保存。

现在想查日志可以通过日志服务，也可以在查找日期对应的日志文件里搜索。

我们用了 nest-winston 这个包，在 AppModule 引入了 WinstonModoule 之后，在 main.ts 里把它设置为 nest 的 logger。

此外，我们需要自定义 TypeOrm 的 logger，使用 winston logger 来实现它的方法。

这样，日志查询就方便多了。
