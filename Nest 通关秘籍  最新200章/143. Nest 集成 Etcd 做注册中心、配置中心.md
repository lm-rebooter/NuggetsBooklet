我们学了 etcd 来做配置中心和注册中心，它比较简单，就是 key 的 put、get、del、watch 这些。

虽然简单，它却是微服务体系必不可少的组件：
 
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6322f6ce49c4a678f7119cff32ef5d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1166&h=696&s=248707&e=png&b=fffeff)

服务注册、发现、配置集中管理，都是用它来做。

那 Nest 里怎么集成它呢？

其实和 Redis 差不多。

集成 Redis 的时候我们就是写了一个 provider 创建连接，然后注入到 service 里调用它的方法。

还可以像 TypeOrmModule、JwtModule 等这些，封装一个动态模块：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e9c2c3d18de473b9760326a22e4d877~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=836&h=768&s=140728&e=png&b=1f1f1f)

下面我们就来写一下：

```
nest new nest-etcd
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/277c8bd4717443fbbfb62a81c40c927c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=868&h=694&s=152075&e=png&b=010101)

进入项目，把服务跑起来：

```
npm run start:dev
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e994ec48ccf54b52bb25aa9bc4c931df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1602&h=388&s=119095&e=png&b=181818)

浏览器访问下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68f1c3bd5cb94ce283f8353f51919e9a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=622&h=222&s=17274&e=png&b=ffffff)

nest 服务跑起来了。

按照上节的步骤把 etcd 服务跑起来：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c208ffbf2ca14a4fbab8344e4cd95830~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2050&h=1216&s=386967&e=png&b=ffffff)

然后我们加一个 etcd 的 provider：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee264b363caf4bdcb8f107cee23e2f2b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=950&h=944&s=138700&e=png&b=1f1f1f)

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Etcd3 } from 'etcd3';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'ETCD_CLIENT',
      useFactory() {
        const client = new Etcd3({
            hosts: 'http://localhost:2379',
            auth: {
                username: 'root',
                password: 'guang'
            }
        });
        return client;
      }
    }
  ],
})
export class AppModule {}

```
在 AppController 里注入下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89499d3806904d369d4a246ce0814f10~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1116&h=1088&s=196153&e=png&b=1f1f1f)

```javascript
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Etcd3 } from 'etcd3';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Inject('ETCD_CLIENT')
  private etcdClient: Etcd3;

  @Get('put')
  async put(@Query('value') value: string) {
    await this.etcdClient.put('aaa').value(value);
    return 'done';
  }

  @Get('get')
  async get() {
    return await this.etcdClient.get('aaa').string();
  }

  @Get('del')
  async del() {
    await this.etcdClient.delete().key('aaa');
    return 'done';
  }
}
```

测试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc5558c78a87488f902c87b0b4f83d88~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=754&h=190&s=19755&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cb5a2d707634d208ff32e490b9e4ee1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=688&h=190&s=17445&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3ab42f19a2a4a5a86d5ae5b54b1e984~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=630&h=180&s=16336&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5139f23a6bd9481eafd8ae3d96055805~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=614&h=174&s=15476&e=png&b=ffffff)

这样 etcd 就集成好了，很简单。

然后我们封装一个动态模块。

创建一个 module 和 service：

```
nest g module etcd
nest g service etcd
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2ce66ee48f84718b213e59ce3241b16~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=310&s=74417&e=png&b=191919)

在 EtcdModule 添加 etcd 的 provider：

```javascript
import { Module } from '@nestjs/common';
import { EtcdService } from './etcd.service';
import { Etcd3 } from 'etcd3';

@Module({
  providers: [
    EtcdService,
    {
      provide: 'ETCD_CLIENT',
      useFactory() {
        const client = new Etcd3({
            hosts: 'http://localhost:2379',
            auth: {
                username: 'root',
                password: 'guang'
            }
        });
        return client;
      }
    }
  ],
  exports: [
    EtcdService
  ]
})
export class EtcdModule {}
```
然后在 EtcdService 添加一些方法：

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { Etcd3 } from 'etcd3';

@Injectable()
export class EtcdService {

    @Inject('ETCD_CLIENT')
    private client: Etcd3;

    // 保存配置
    async saveConfig(key, value) {
        await this.client.put(key).value(value);
    }

    // 读取配置
    async getConfig(key) {
        return await this.client.get(key).string();
    }

    // 删除配置
    async deleteConfig(key) {
        await this.client.delete().key(key);
    }
   
    // 服务注册
    async registerService(serviceName, instanceId, metadata) {
        const key = `/services/${serviceName}/${instanceId}`;
        const lease = this.client.lease(10);
        await lease.put(key).value(JSON.stringify(metadata));
        lease.on('lost', async () => {
            console.log('租约过期，重新注册...');
            await this.registerService(serviceName, instanceId, metadata);
        });
    }

    // 服务发现
    async discoverService(serviceName) {
        const instances = await this.client.getAll().prefix(`/services/${serviceName}`).strings();
        return Object.entries(instances).map(([key, value]) => JSON.parse(value));
    }

    // 监听服务变更
    async watchService(serviceName, callback) {
        const watcher = await this.client.watch().prefix(`/services/${serviceName}`).create();
        watcher.on('put', async event => {
            console.log('新的服务节点添加:', event.key.toString());
            callback(await this.discoverService(serviceName));
        }).on('delete', async event => {
            console.log('服务节点删除:', event.key.toString());
            callback(await this.discoverService(serviceName));
        });
    }

}
```
配置的管理、服务注册、服务发现、服务变更的监听，这些我们都写过一遍，就不细讲了。

然后再创建个模块，引入它试一下：
```
nest g resource aaa
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/775e971d6759492a984504d3a97a52c5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=794&h=410&s=100568&e=png&b=191919)

引入 EtcdModule：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8427b98b647944fc8bfb3d2523bcc460~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=850&h=548&s=100368&e=png&b=1f1f1f)

然后在 AaaController 注入 EtcdService，添加两个 handler：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8acb83c8db4a41d3bb41f96cd389dfe9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1046&h=798&s=177018&e=png&b=1f1f1f)

```javascript
@Inject(EtcdService)
private etcdService: EtcdService;

@Get('save')
async saveConfig(@Query('value') value: string) {
    await this.etcdService.saveConfig('aaa', value);
    return 'done';
}

@Get('get')
async getConfig() {
    return await this.etcdService.getConfig('aaa');
}
```
测试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58f96e3d52ef45d686a88801d6da1350~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=848&h=202&s=20615&e=png&b=ffffff)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c323f4e4fdc4457901a7b3220f1f632~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=670&h=184&s=16756&e=png&b=ffffff)

没啥问题。

不过现在 EtcdModule 是普通的模块，我们改成动态模块：

```javascript
import { DynamicModule, Module, ModuleMetadata, Type } from '@nestjs/common';
import { EtcdService } from './etcd.service';
import { Etcd3, IOptions } from 'etcd3';

export const ETCD_CLIENT_TOKEN = 'ETCD_CLIENT';

export const ETCD_CLIENT_OPTIONS_TOKEN = 'ETCD_CLIENT_OPTIONS';

@Module({})
export class EtcdModule {

  static forRoot(options?: IOptions): DynamicModule {
    return {
      module: EtcdModule,
      providers: [
        EtcdService,
        {
          provide: ETCD_CLIENT_TOKEN,
          useFactory(options: IOptions) {
            const client = new Etcd3(options);
            return client;
          },
          inject: [ETCD_CLIENT_OPTIONS_TOKEN]
        },
        {
          provide: ETCD_CLIENT_OPTIONS_TOKEN,
          useValue: options
        }
      ],
      exports: [
        EtcdService
      ]
    };
  }
}
```
把 EtcdModule 改成动态模块的方式，加一个 forRoot 方法。

把传入的 options 作为一个 provider，然后再创建 etcd client 作为一个 provider。

然后 AaaModule 引入 EtcdModule 的方式也改下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dcdbf96285245e28eb0459535d97690~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=904&h=766&s=131351&e=png&b=1f1f1f)

用起来是一样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4590b470565548ae94ce34172aaf6278~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=706&h=192&s=16946&e=png&b=ffffff)

但是现在 etcd 的参数是动态传入的了，这就是动态模块的好处。

当然，一般动态模块都有 forRootAsync，我们也加一下：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a58a209fac1c4f4fab7c61c59995c41c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1210&h=638&s=126562&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1052f7899939435f86ba3733263b3663~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1308&h=1128&s=169282&e=png&b=1f1f1f)

```javascript
export interface EtcdModuleAsyncOptions  {
  useFactory?: (...args: any[]) => Promise<IOptions> | IOptions;
  inject?: any[];
}
```
```javascript
static forRootAsync(options: EtcdModuleAsyncOptions): DynamicModule {
    return {
      module: EtcdModule,
      providers: [
        EtcdService,
        {
          provide: ETCD_CLIENT_TOKEN,
          useFactory(options: IOptions) {
            const client = new Etcd3(options);
            return client;
          },
          inject: [ETCD_CLIENT_OPTIONS_TOKEN]
        },
        {
          provide: ETCD_CLIENT_OPTIONS_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject || []
        }
      ],
      exports: [
        EtcdService
      ]
    };
}
```
和 forRoot 的区别就是现在的 options 的 provider 是通过 useFactory 的方式创建的，之前是直接传入。

现在就可以这样传入 options 了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58eade20a864400bac7b82086e8e173f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=1052&s=148689&e=png&b=1f1f1f)

```javascript
EtcdModule.forRootAsync({
  async useFactory() {
      await 111;
      return {
          hosts: 'http://localhost:2379',
          auth: {
              username: 'root',
              password: 'guang'
          }
      }
  }
})
```

我们安装下 config 的包

```
npm install @nestjs/config
```
在 AppModule 引入 ConfigModule：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8686012ed5b482ab0d821d8f2a8fc18~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=802&h=682&s=127643&e=png&b=1f1f1f)

```javascript
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: 'src/.env'
})
```
添加对应的 src/.env

```env
etcd_hosts=http://localhost:2379
etcd_auth_username=root
etcd_auth_password=guang
```
然后在引入 EtcdModule 的时候，从 ConfigService 拿配置：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9f9496d8f4a4de99d1c7c775f1fa77b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1220&h=790&s=141984&e=png&b=1f1f1f)

```javascript
EtcdModule.forRootAsync({
  async useFactory(configService: ConfigService) {
      await 111;
      return {
          hosts: configService.get('etcd_hosts'),
          auth: {
              username: configService.get('etcd_auth_username'),
              password: configService.get('etcd_auth_password')
          }
      }
  },
  inject: [ConfigService]
})
```
测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d740ced107e4353a7b310828cbde6c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=636&h=216&s=17078&e=png&b=ffffff)

功能正常。

这样，EtcdModule.forRootAsync 就成功实现了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/nest-etcd)。
## 总结

这节我们做了 Nest 和 etcd 的集成。

或者加一个 provider 创建连接，然后直接注入 etcdClient 来 put、get、del、watch。

或者再做一步，封装一个动态模块来用，用的时候再传入连接配置 

和集成 Redis 的时候差不多。

注册中心和配置中心是微服务体系必不可少的组件，后面会大量用到。
