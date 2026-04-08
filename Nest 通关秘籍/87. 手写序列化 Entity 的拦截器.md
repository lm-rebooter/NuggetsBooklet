上节我们学了用 class-transformer +  ClassSerializerInterceptor 来序列化 entity 对象，可以替代 vo。

这节我们自己来实现一下 ClassSerializerInterceptor，深入理解它的实现原理。

```
nest new serializer-interceptor-test
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39e6f51c2e4a49a190687b362dad3bbe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1042&h=700&s=172067&e=png&b=010101)

生成一个 user 的 CRUD 模块：

```
nest g resource user --no-spec
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42e59b3383b94f83ad1e3c6dc93df1a0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=790&h=352&s=44190&e=webp&b=191919)

在 entity 里加一些内容：

```javascript
export class User {
    id: number;

    username: string;

    password: string;

    email: string;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
```

改下 UserService：

```javascript
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const database = [
  new User({ id: 1, username: 'xxx', password: 'xxx', email: 'xxx@xx.com'}),
  new User({ id: 2, username: 'yyy', password: 'yyy', email: 'yyy@yy.com'})
];
let id = 0;

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);

    user.id = id++;

    database.push(user);

    return user;
  }

  findAll() {
    return database;
  }

  findOne(id: number) {
    return database.filter(item =>  item.id === id).at(0);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
```
内置两条数据，这样就不用每次调用接口创建了。

然后安装 class-transformer 包：

```
npm install --save class-transformer
```
在 entity 上加一下 class-transformer 的装饰器：

```javascript
import { Exclude, Expose, Transform } from "class-transformer";

export class User {
    id: number;

    username: string;

    @Exclude()
    password: string;

    @Expose()
    get xxx(): string {
        return `${this.username} ${this.email}`;
    }

    @Transform(({value}) => '邮箱是：' + value)
    email: string;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
```

然后我们自己来实现 ClassSerializerInterceptor，还有一个自定义装饰器 SerializeOptions：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/956baf8a69794f3da2d5fca9c29e8690~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880&h=564&s=147255&e=png&b=1f1f1f)

先来写这个自定义装饰器，它比较简单：
```
nest g decorator serialize-options --flat
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f36b85d40cdb40d1b3e0120d89447f5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=794&h=82&s=22319&e=png&b=191919)

```javascript
import { SetMetadata } from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';

export const CLASS_SERIALIZER_OPTIONS = 'class_serializer:options';

export const SerializeOptions = (options: ClassTransformOptions) =>
    SetMetadata(CLASS_SERIALIZER_OPTIONS, options);
```
它做的事情就是往 class 或者 method 上加一个 metadata。

然后 interceptor 取出这个 metadata 的 options 给 class-transfromer 用。

所以这个 options 的类型就是 ClassTransformOptions。

是不是第一次见这样设置参数？

确实挺巧妙的。

然后来写 interceptor：

```
nest g interceptor class-serializer --flat --no-spec
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc2730355c7941f8a4e5d2ec57db04cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=882&h=124&s=29430&e=png&b=191919)

```javascript
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassTransformOptions } from 'class-transformer';
import { Observable } from 'rxjs';
import { CLASS_SERIALIZER_OPTIONS } from './serialize-options.decorator';

@Injectable()
export class ClassSerializerInterceptor implements NestInterceptor {

  @Inject(Reflector) 
  protected readonly reflector: Reflector;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextOptions = this.getContextOptions(context);

    return next.handle();
  }

  protected getContextOptions(
    context: ExecutionContext,
  ): ClassTransformOptions | undefined {
    return this.reflector.getAllAndOverride(CLASS_SERIALIZER_OPTIONS, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
```
注入 Reflector 包，用它的 getAllAndOverride 方法拿到 class 或者 handler 上的 metadata。

打印下看看。

我们把它加到 handler 上：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/207b3a403b68479182de119ef0a33a05~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1262&h=658&s=146839&e=png&b=1f1f1f)

加一个调试配置：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44397a6f5cc3493fabd6fa0d0ed341cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=522&h=416&s=45113&e=png&b=191919)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee9ef6d1e4c74a49a72a0dc31a73dfe3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1364&h=850&s=136490&e=png&b=1d1d1d)

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "debug nest",
            "runtimeExecutable": "npm",
            "args": [
                "run",
                "start:dev",
            ],
            "skipFiles": [
                "<node_internals>/**"
            ],
            "console": "integratedTerminal",
        }
    ]
}
```
打个断点，然后点击调试启动：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45921cf452b044b48da8575766cbd036~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1462&h=772&s=205956&e=png&b=1d1d1d)

现在是 undefined：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1300bbf55c324889b79f51373da9f90d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1550&h=722&s=244117&e=png&b=1d1d1d)

加一下 @SerializeOptions 装饰器，用我们刚才写的那个。然后点击 restart：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfcd6f3abd294f52a001b4b3ac6831a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1078&h=512&s=113464&e=png&b=1f1f1f)

这时候就拿到 options 了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88d729ddd5f94c07ad35281dff88da9e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1582&h=632&s=228149&e=png&b=1e1e1e)

然后我们继续写：

```javascript
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, StreamableFile } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassTransformOptions } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { CLASS_SERIALIZER_OPTIONS } from './serialize-options.decorator';
import * as classTransformer from 'class-transformer';

function isObject(value) {
  return value !== null && typeof value === 'object'
}

@Injectable()
export class ClassSerializerInterceptor implements NestInterceptor {

  @Inject(Reflector) 
  protected readonly reflector: Reflector;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextOptions = this.getContextOptions(context);

    return next
      .handle()
      .pipe(
        map((res) =>
          this.serialize(res, contextOptions),
        ),
      );
  }

  serialize(
    response: Record<string, any> | Array<Record<string, any>>,
    options: ClassTransformOptions
  ){

    if (!isObject (response) || response instanceof StreamableFile) {
      return response;
    }

    return Array.isArray(response)
      ? response.map(item => this.transformToNewPlain(item, options))
      : this.transformToNewPlain(response, options);
  }

  transformToNewPlain(
    palin: any,
    options: ClassTransformOptions,
  ) {
    if (!palin) {
      return palin;
    }

    return classTransformer.instanceToPlain(palin, options);
  }


  protected getContextOptions(
    context: ExecutionContext,
  ): ClassTransformOptions | undefined {
    return this.reflector.getAllAndOverride(CLASS_SERIALIZER_OPTIONS, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}

```

在 interceptor 里用 map operator 对返回的数据做修改。

在 serialize 方法里根据响应是数组还是对象分别做处理，调用 transformToNewPlain 做转换。

这里排除了 response 不是对象的情况和返回的是文件流的情况：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5fa2e02d9c84ec8b6fca845794c78ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1252&h=982&s=217106&e=png&b=1f1f1f)

transformToNewPlain 就是用 class-transformer 包的 instanceToPlain 根据对象的 class 上的装饰器来创建新对象：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ae99c9043874e8da8b4ce3d86c9a4de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1004&h=392&s=58207&e=png&b=1f1f1f)

有同学说不是 classToPlain 么？

那个 api 过时了，用 instanceToPlain 代替。

打个断点测试下：

最开始的响应数据是 user 对象：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/656ac75777b242d4b6bef4dd30bdac1b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1534&h=744&s=183652&e=png&b=212121)

转换完之后就是新的对象了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99e6ea4a61254a75b873a68d8bce25ef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1310&h=1032&s=216608&e=png&b=1d1d1d)


![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3028d46d8104f00b5313714d43482b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=750&h=890&s=85370&e=png&b=fdfdfd)

这样我们就实现了 ClassSerializerInterceptor 拦截器的功能。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/serializer-interceptor-test)
## 总结

上节学了用 entity 结合 class-transfomer 的装饰器和 ClassSerializerInterceptor 拦截器实现复用 entity 做 vo 的功能。

这节我们自己实现了下。

首先是 @SerializeOptions 装饰器，它就是在 class 或者 handler 上加一个 metadata，存放 class-transformer 的 options。

在 ClassSerializerInterceptor 里用 reflector 把它取出来。

然后拦截响应，用 map oprator对响应做变换，调用 classTransformer 包的 instanceToPlain 方法进行转换。

自己实现一遍之后，对它的理解就更深了。
