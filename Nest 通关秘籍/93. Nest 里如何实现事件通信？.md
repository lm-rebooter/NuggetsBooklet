后端应用中会有很多业务模块，这些业务模块之间会有互相调用的关系。

但是把一个业务模块作为依赖注入的别的业务模块也不大好。

比如下单送优惠券的活动，订单模块在订单完成后调用优惠券模块下发优惠券。

这种如果直接把优惠券模块注入到订单模块里就不大好，因为是两个独立的业务模块。

有没有别的通信方式呢？

有，比如通过 event emitter 通信。

我们试一下：

```
nest new event-emitter-test
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/327c737cf5284482ad74abd9c988ed0e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=954&h=698&s=161489&e=png&b=010101)

安装用到的包：

```
npm i --save @nestjs/event-emitter
```
在 AppModule 引入下 EventEmitterModule：

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

然后创建两个 module：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f42eed297e3448cb9514d0d59baa274d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=780&h=298&s=75317&e=png&b=191919)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/967b36c24c8141fb8af361eb50feb0ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=772&h=306&s=74252&e=png&b=191919)

把服务跑起来：

```
npm run start:dev
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/519eed6dab934d4abaad97e44219b88e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1638&h=654&s=364853&e=png&b=181818)

访问下 aaa 和 bbb 的接口：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/946c6e7a3d0d46b6aeb667fbddaa4346~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=748&h=222&s=23147&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78553f423f904cff88030a3c072b5517~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=848&h=276&s=25167&e=png&b=ffffff)

没啥问题。

然后我们想在 aaa 模块的查询触发的时候，调用 bbb 模块记录一条日志呢？

这时候就可以用 Event Emitter 来做。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efb13c737f78487ca131426bd74aebc8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=828&s=168979&e=png&b=1f1f1f)

```javascript
@Inject(EventEmitter2)
private eventEmitter: EventEmitter2;

findAll() {
    this.eventEmitter.emit('aaa.find',{
      data: 'xxxx'
    })
    return `This action returns all aaa`;
}
```
在 AaaService 里注入 EventEmitter2，然后调用它的 emit 方法发送一个事件。

然后在 BbbService 里监听下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd79955ec0674a4a922f9b38ac9530a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=938&h=726&s=151929&e=png&b=202020)

```javascript
@OnEvent('aaa.find')
handleAaaFind(data) {
    console.log('aaa find 调用', data)
    this.create(new CreateBbbDto());
}
```
试一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9d5219675ec4ad593e1e645b6adfc42~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=798&h=238&s=23703&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99dfdaba77024ecfa3f8b3fb8cac8c00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=822&h=1088&s=293056&e=png&b=1a1a1a)

可以看到 AaaService 的 findAll 调用的时候，自动触发了 BbbService 里的方法调用。

是不是很方便？

如果你没感觉出来，那想一下不通过事件怎么做呢？

是不是需要在 BbbModule 里把 BbbService 放到 exports 里声明，然后在 AaaModule 里引入之后 BbbModule 之后，注入它的 BbbService 来用呢？

或者通过全局模块，把 BbbModule 通过 @Global 声明为全局模块，然后在 AaaService 里注入 BbbService 来调用呢？

不管哪种都很麻烦。

而通过事件的方式就简单太多了。

此外，EventEmitterModule 还支持一些配置：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/faace15ae4414193967ad2a4698f5fc9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=558&h=328&s=34971&e=png&b=1f1f1f)

wildcard 是允许通配符 *。

delimiter 是 namespace 和事件名的分隔符。

配置之后就可以这样用了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/071ea45608614d3f946fa5e9e4b85d13~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=672&h=768&s=99877&e=png&b=1f1f1f)

```javascript
findAll() {
    this.eventEmitter.emit('aaa.find',{
      data: 'xxxx'
    })

    this.eventEmitter.emit('aaa.find2',{
      data: 'xxxx2'
    })
    return `This action returns all aaa`;
}
```

BbbService 里可以用 aaa.* 通配符匹配：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c41b777e9a4c499286c784f438cd97f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=746&h=560&s=123828&e=png&b=1f1f1f)

测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f7bcec802874e568839310b2b64da4a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=712&h=218&s=22733&e=png&b=ffffff)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f9b8da3d6744c4c919a17069124fee1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=678&h=470&s=114493&e=png&b=191919)

event emitter 用起来很简单，但却很有用，比直接引入模块注入依赖的方式方便太多了。

我们来做个具体案例，用户注册成功之后，通知模块里发送欢迎邮件：

```
nest g resource user --no-spec
nest g resource notification --no-spec
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/600ff7e571214ec1b1e3b073c43f1b7c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=770&h=296&s=73799&e=png&b=191919)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ac1846d1627468d9b7943455baa06e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=972&h=296&s=83395&e=png&b=191919)

```
nest g module email
nest g service email --no-spec
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c50955f211e42a39a22f4299c04bb7d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=710&h=210&s=53119&e=png&b=191919)

创建 user 用户模块、notification 通知模块，email 邮件模块。

先来写下邮件模块：

安装 nodemailer 包：

```
npm install --save nodemailer
```
写下 EmailService：

```javascript
import { Injectable } from '@nestjs/common';
import { createTransport, Transporter} from 'nodemailer';

@Injectable()
export class EmailService {

    transporter: Transporter
    
    constructor() {
      this.transporter = createTransport({
          host: "smtp.qq.com",
          port: 587,
          secure: false,
          auth: {
              user: "你的用户名",
              pass: "你的授权码"
          },
      });
    }

    async sendMail({ to, subject, html }) {
      await this.transporter.sendMail({
        from: {
          name: '系统邮件',
          address: "你的邮箱地址"
        },
        to,
        subject,
        html
      });
    }

}
```
如何获取授权码看 [node 发邮件](https://juejin.cn/book/7226988578700525605/section/7247327089496424505)那节。

然后把 EmailModule 声明为全局模块：

```javascript
import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}

```

这样 NotificationService 里就可以直接注入 EmailService 了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7677723e30848838a34f7dae8ad2e2a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=862&s=184919&e=png&b=1f1f1f)

```javascript
@Inject(EmailService)
private emailService: EmailService

@OnEvent("user.register")
async hanldeUserRegister(data) {
    console.log('user.register');

    await this.emailService.sendMail({
      to: data.email,
      subject: '欢迎' + data.username,
      html: '欢迎新人'
    })
}
```

然后在 CreateUserDto 添加两个属性：

```javascript
export class CreateUserDto {
    username: string;
    email: string;
}
```
在 create 的时候调用下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2037448ce8614f1189f099e97dc5fe60~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=912&h=786&s=156904&e=png&b=1f1f1f)

```javascript
@Inject(EventEmitter2)
private eventEmitter: EventEmitter2;

create(createUserDto: CreateUserDto) {
    this.eventEmitter.emit('user.register', {
      username: createUserDto.username,
      email: createUserDto.email
    })

    return 'This action adds a new user';
}
```
在 postman 里调用下 create 接口：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08b0d7a936e84b31946897ecaf11b9a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=778&h=594&s=65248&e=png&b=fbfbfb)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a86fc83bc284137a72e7233cf58935a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=792&h=478&s=148792&e=png&b=191919)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca091039e2744b6bb57b21d203338f40~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=506&h=252&s=28589&e=png&b=f5f5f5)

通知成功了！

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/event-emitter-test)。
## 总结

多个业务模块之间可能会有互相调用的关系，但是也不方便直接注入别的业务模块的 Service 进来。

这种就可以通过 EventEmitter 来实现。

在一个 service 里 emit 事件和 data，另一个 service 里 @OnEvent 监听这个事件就可以了。

用起来很简单，但比起注入别的模块的 service 方便太多了。
