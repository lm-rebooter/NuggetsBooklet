如果你的网站要支持多种语言访问，那就要做国际化。

也就是中文用户访问返回中文界面，英文用户访问返回英文界面。

如果你在外企，那可能经常要做这些，比如我在韩企的时候，要支持韩文、英文，在日企的时候，要支持日文、英文。

不只是前端要做国际化，后端也要做，不然英文用户用着英文的界面登录的时候，突然返回一个“用户不存在”的错误，是不是一脸懵逼？

今天我们就来学一下 Nest 如何实现国际化。

Nest 里做国际化用 [nestjs-i18n](https://www.npmjs.com/package/nestjs-i18n) 这个包：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9faf1d3a9f774c5880e13a926b01583e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2448&h=1110&s=277787&e=png&b=ffffff)

我们来试一下：

```
nest new i18n-test
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd6d1eff0419492ab013d0b9fab27082~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=912&h=584&s=350868&e=png&b=fefefe)

安装 nestjs-i18n：

```
npm install --save nestjs-i18n
```

在 AppModule 引入 I18nModule：

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(["lang", "l"]),
      ]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
默认语言是 en，然后资源包在 i18n 目录下。

resolver 也就是从哪里读取当前语言信息，这里是从 query 中读取，比如 ?lang=en、?l=zh

我们添加一下资源包：

i18n/en/test.json
```json
{
    "hello": "Hello World"
}
```

i18n/zh/test.json

```json
{
    "hello": "你好世界"
}
```

这里的国际化资源包要在 nest-cli.json 里配置下自动复制：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e64dcfd66198407db8bdf1e2c7c3d2d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=512&s=73876&e=png&b=1f1f1f)

```json
"assets": [
  { "include": "i18n/**/*", "watchAssets": true }
]
```

然后改下 AppService：

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService {

  @Inject()
  i18n: I18nService;

  getHello(): string {
    return this.i18n.t('test.hello', { lang: I18nContext.current().lang })
  }
}
```
注入 I18nService，从资源包中取 test.hello 的值，也就是对应 test.json 里的 hello 的值，用当前的语言。

把服务跑起来：

```
npm run start:dev
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74a20169c1f34a7284d510e93a2ecf58~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1604&h=394&s=142757&e=png&b=181818)

浏览器访问下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df0739f9673e4e6d8c378b808acb5204~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=666&h=232&s=19328&e=png&b=ffffff)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4dda52d62f24b07b08046c039055993~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=672&h=234&s=20889&e=png&b=ffffff)

可以看到，文案根据语言环境做了国际化。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d0081d2a6f54b8f958d7033df709b06~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1834&h=1014&s=228999&e=png&b=1f1f1f)

还有其他 resolver，比如根据自定义 header、cookie、accepet-language 的 header 等。

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(["lang", "l"]),
        new HeaderResolver(["x-custom-lang"]),
        new CookieResolver(['lang']),
        AcceptLanguageResolver,
      ]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
我们试一下 cookie：

在 postman 里访问，添加一个 cookie：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d783876fb2e54190b628b0f53336d37d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1694&h=920&s=102721&e=png&b=fefefe)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66391fbf262d4e2fb125000d3037ab4a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1772&h=1464&s=103106&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d3073ca52394728b2f36a24b4970577~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1656&h=876&s=85534&e=png&b=f9f9f9)

再访问就变成了中文的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61dc3d86dd2743c58014cc4d82a52602~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1042&h=654&s=68114&e=png&b=fdfdfd)

有的同学可能问了，现在是用 I18nService 做的翻译，那不在 IoC 容器里的类，怎么翻译呢？

比如 dto：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/595877fedcf24d8a82748092cf7a565b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=1114&s=159542&e=png&b=1f1f1f)

它并不在 IoC 容器里，没法注入 I18nService，怎么翻译这些文案呢？

这时候可以用专门的 Pipe。

我们加一个模块：

```
nest g resource user
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57914fe2f4554ba4958f9865de31406c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=466&s=122685&e=png&b=181818)

安装 dto 验证用的包：

```
npm install --save class-validator class-transformer
```

改一下 CreateUserDto：

```javascript
import { IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({
        message: "用户名不能为空"
    })
    username: string;
    
    @IsNotEmpty({
        message: '密码不能为空'
    })
    @MinLength(6, {
        message: '密码不能少于 6 位'
    })
    password: string;
                    
}
```

校验 body 的错误需要全局启用 ValidationPipe：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73643f732d294c1d98add9d41cbae9bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=960&h=498&s=101599&e=png&b=1f1f1f)

```javascript
app.useGlobalPipes(new ValidationPipe());
```
访问下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc4d50c68b0e4299b40dffabbef88178~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974&h=894&s=108943&e=png&b=fdfdfd)

如果是英文网站，需要返回英文的错误信息，但是 dto 不在 IoC 容器里，不能注入 I18nService，怎么办呢？

这时候可以用 nestjs-i18n 提供的 I18nValidationPipe 来替换 ValidationPipe。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afb0c3172f064f90803816c664066a9f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1334&h=640&s=136970&e=png&b=1f1f1f)

```javascript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new I18nValidationPipe());

  app.useGlobalFilters(new I18nValidationExceptionFilter({
    detailedErrors: false
  }));

  await app.listen(3000);
}
bootstrap();
```
然后把 message 改为资源的 key：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9902db4009a74318a82353ae07209fc2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=646&s=103255&e=png&b=1f1f1f)

访问下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e11cf0e3dbc642ac805386963b737ee4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=890&s=104185&e=png&b=fdfdfd)

可以看到，key 被替换成了具体的文案。

把 cookie 里的 lang 改为 en：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2df78660c8a45d5b9c20b9713ae741a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1632&h=962&s=86864&e=png&b=f9f9f9)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5a87d5189204fd78b954f92f08afc81~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1336&h=888&s=119979&e=png&b=fefefe)

文案也换成了英文。

那接下来我们只要添加对应的资源包就可以了。

添加 i18n/zh/validate.json

```json
{
    "usernameNotEmpty": "用户名不能为空",
    "passwordNotEmpty": "密码不能为空",
    "passwordNotLessThan6": "密码不能少于 6 位"
}
```
i18n/en/validate.json
```json
{
    "usernameNotEmpty": "The username cannot be empty",
    "passwordNotEmpty": "Password cannot be empty",
    "passwordNotLessThan6": "The password cannot be less than 6 characters"
}
```
然后改下 dto 里的 message，换成资源的 key：

```javascript
import { IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({
        message: "validate.usernameNotEmpty"
    })
    username: string;
    
    @IsNotEmpty({
        message: 'validate.passwordNotEmpty'
    })
    @MinLength(6, {
        message: 'validate.passwordNotLessThan6'
    })
    password: string;                    
}
```

再次访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32c7a1eb880249ddbc853b1bf2089f45~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1180&h=916&s=129635&e=png&b=fefefe)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76345cc215b34ea8a7665f5f89c138be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1632&h=962&s=86864&e=png&b=f9f9f9)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6c7049f525c4b24b4f5e3a93f2b6cd9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=840&h=892&s=102889&e=png&b=fdfdfd)

中文环境返回中文文案、英文环境返回英文文案，这样就实现了国际化。

那如果这个密码位数不一定是 6 位呢？

文案里可以填占位符：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9348b4b337514c8b831b5f23fd5fdf3e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=916&h=274&s=52508&e=png&b=202020)

然后用的时候传入参数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d48b5db4e9ca4628930b4105580800a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1230&h=750&s=141877&e=png&b=1f1f1f)

```javascript
@MinLength(6, {
    message: i18nValidationMessage("validate.passwordNotLessThan6", {
        num: 88
    })
})
```
试一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e4b0f2ea4694f8da9c7dfc82cae1f6c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974&h=928&s=110196&e=png&b=fdfdfd)

I18nService 的 api 同样支持这个：

加一下占位符：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd70859382a24e1e94aea05153727063~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=622&h=208&s=23116&e=png&b=1f1f1f)

然后用的时候传入 args：

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService {

  @Inject()
  i18n: I18nService;

  getHello(): string {
    return this.i18n.t('test.hello', {
      lang: I18nContext.current().lang,
      args: {
        name: 'guang'
      }
    })
  }
}
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecb83c9a4c1544bba6bff65953f9d578~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=576&s=58124&e=png&b=fdfdfd)

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/i18n-test)

## 总结

当你的应用需要支持多种语言环境的用户访问时，就要做国际化。

前端要做界面的国际化，后端也同样要做返回的信息的国际化。

nest 里我们用 nestjs-i18n 这个包，在 AppModule 里引入 I18nModule，指定资源包的路径，resolver（取 lang 配置的方式）。

然后就可以注入 I18nSerive，用它的 t 方法来取资源包中的文案了。

dto 的国际化需要全局启用 I18nValidationPipe 和 I18nValidationExceptionFilter，然后把 message 换成资源包的 key 就好了。

文案支持占位符，可以在资源包里写 {xxx} 然后用的时候传入 xxx 的值。

如果你做一个面向多种语言用户的网站，那么国际化功能是必不可少的。
