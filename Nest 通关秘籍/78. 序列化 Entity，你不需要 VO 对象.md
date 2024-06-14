后端系统常见的对象有三种：

Entity：数据实体，和数据库表对应。

DTO： Data Transfer Object，用于封装请求参数。

VO：Value Object，用于封装返回的响应数据。

三者的关系如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd019321aad2433db52a5a5fe537e457~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1626&h=396&s=15066&e=webp&b=fefcfc)

但文档中并没有提到 VO 对象，这是为什么呢？

因为有替代方案。

我们来看一下：

```
nest new vo-test
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19fd570e6f5d40e69b1b2678e49f3823~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=792&h=698&s=65154&e=webp&b=020202)

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

Partial 是把 User 的属性变为可选：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/724b739e321e4f1caff4f4c8fc05465b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=550&h=326&s=17204&e=webp&b=212121)

可以传入部分属性，然后 Object.assign 赋值到 this。

然后 CreateUserDto 里包含这些属性：

```javascript
export class CreateUserDto {
    username: string;

    password: string;

    email: string;
}
```

实现下 UserService 的 create 和 find 的逻辑：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f10bb959b5b410b9556a155bc7352d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=962&s=50112&e=webp&b=1f1f1f)

这里我们直接用数组模拟 database 来保存数据。

```javascript
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const database = [];
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

把服务跑起来：

```
npm run start:dev
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75ff7aa1bb31434c9b69a2528cb9c9be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1562&h=538&s=106074&e=webp&b=191818)

创建两个 user：

![i](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28283119692c4058873b507b4537fe3f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=630&h=802&s=24440&e=webp&b=fcfcfc)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d226a510cf22413a826a31154641367e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=712&h=794&s=24340&e=webp&b=fcfcfc)

查一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57056ac036364f1ab3bd45cd804145bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=626&h=884&s=25160&e=webp&b=fcfcfc)

可以看到，user 的 password 也被返回了。

而这个应该过滤掉。

一般这种情况，我们都会封装个 vo。

创建 vo/user.vo.ts：

```javascript
export class UserVo {
    id: number;

    username: string;

    email: string;

    constructor(partial: Partial<UserVo>) {
        Object.assign(this, partial);
    }
}
```

然后把数据封装成 vo 返回：

```javascript
findAll() {
    return database.map(item => {
      return new UserVo({
        id: item.id,
        username: item.username,
        email: item.email
      });
    });
}

findOne(id: number) {
    return database.filter(item =>  item.id === id).map(item => {
      return new UserVo({
        id: item.id,
        username: item.username,
        email: item.email
      });
    }).at(0);
}
```

试一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe8e8514d4a643d3a38bc7b5853472e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=678&h=834&s=22600&e=webp&b=fcfcfc)

可以看到，这样就没有 password 了。

但你会发现 UserVo 和 User entity 很类似：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c80fab812a1b4aa98b7f9dc2c9820fa6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=756&h=446&s=18992&e=webp&b=202020)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83cd026b3d3243419952d4b63f89c488~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=720&h=500&s=18576&e=webp&b=1f1f1f)

对于 dto 我们可以通过 PartialType、PickType、OmitType、IntersectionType 来组合已有 dto，避免重复。

那 vo 是不是也可以呢？

是的，nest 里可以直接复用 entity 作为 vo。

这里要用到 class-transformer 这个包：

```
npm install --save class-transformer
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f219f7d5e7da427187b9df7f3e29213a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=838&h=646&s=27818&e=webp&b=1f1f1f)

然后在 UserController 的查询方法上加上 ClassSerializerInterceptor 就好了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29cd3977616046a1a498b7f82eb5a4fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=906&h=698&s=42714&e=webp&b=1f1f1f)

代码恢复原样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7334aaa4bcfb49ab9c39744debb2f4a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1018&h=406&s=20614&e=webp&b=1f1f1f)

现在返回的数据就没有 password 字段了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3e65d1324504071b1a115dcd4a5e86a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=660&h=838&s=22328&e=webp&b=fcfcfc)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63a58ef2ea2e42c6ade9f0410f216fd1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=806&h=628&s=19222&e=webp&b=fbfbfb)

class-transformer 这个包我们用过，是用于根据 class 创建对应的对象的。

当时是 ValidationPipe 里用它来创建 dto class 对应的对象。

这里也是用它来创建 entity class 对应的对象。

简单看下 ClassSerializerInterceptor 的源码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f22a8ba17451430888d5fd89b0c25b5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1142&h=1140&s=73802&e=webp&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adfd7b28145a46ed806e0834f4bc3b93~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=614&s=139600&e=png&b=1f1f1f)

它是通过 map 对响应做转换，在 serialize 方法拿到响应的对象，如果是数组就拿到每个元素。

在 transformToPlain 方法里，调用 classToPlain 创建对象。

它会先拿到响应对象的 class、然后根据 class 上的装饰器来创建新的对象。

当然，装饰器不只有 @Exclude，还有几个有用的：

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

@Expose 是添加一个导出的字段，这个字段是只读的。

@Transform 是对返回的字段值做一些转换。

测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad475a19f11446c2ac51099d13341538~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=694&h=760&s=24124&e=webp&b=fcfcfc)

可以看到，返回的数据多了 xxx 字段，email 字段也做了修改：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/507886adacc5487ba057b3608575a763~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=764&h=886&s=29500&e=webp&b=fcfcfc)

这样基于 entity 直接创建 vo 确实方便多了。

此外，你可以可以通过 @SerializeOptions 装饰器加一些序列化参数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39a63ab89e6d43be8a9f4b63b79dc29b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=786&h=462&s=28704&e=webp&b=1f1f1f)

strategy 默认值是 exposeAll，全部导出，除了有 @Exclude 装饰器的。

设置为 excludeAl 就是全部排除，除了有 @Expose 装饰器的。

当然，你可以 ClassSerializerInterceptor 和 SerializeOptions 加到 class 上：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ffd5daa800f4aafb4057adf7a3f6395~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=798&h=710&s=20312&e=webp&b=fcfcfc)

这样，controller 所有的接口返回的对象都会做处理：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/731eba777fc346d1a15d9155bc3ece46~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=688&h=678&s=21768&e=webp&b=fbfbfb)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f466d3dd59254b1fbc5c89a162d0a701~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=740&h=682&s=19764&e=webp&b=fcfcfc)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/043d798ccdca42ccb4eef9fe149bdd42~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=670&h=620&s=16000&e=webp&b=fbfbfb)

swagger 那节当返回对象的时候，我们都是创建了个 vo 的类，在 vo class 上加上 swagger 的装饰器：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fd51d80deee40df9167688f5565d5ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=812&h=820&s=40860&e=webp&b=202020)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f0894f39cea4b2ba5c1855beb5726d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=810&h=422&s=25486&e=webp&b=202020)

其实没必要，完全可以直接用 entity。

安装 swagger 的包：

```
npm install --save @nestjs/swagger
```

然后在 main.ts 添加 swagger 的入口代码：

```javascript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Test example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('test')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();
```

现在 @apiResponse 里就可以直接指定 User 的 entity 了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6b8c51901bc480cb552318d27dae5a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=832&h=928&s=52744&e=webp&b=202020)

```javascript
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, SerializeOptions, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('user')
@SerializeOptions({
  // strategy: 'excludeAll'
})
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({summary:'findAll'})
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ok',
    type: User
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
```

在 User 里加一下 swagger 的装饰器：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0df788a9c8e47538c5960bbaa7e086e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=948&h=890&s=43764&e=webp&b=1f1f1f)

```javascript
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";

export class User {
    @ApiProperty()
    id: number;

    @ApiProperty()
    username: string;

    @ApiHideProperty()
    @Exclude()
    password: string;

    @ApiProperty()
    @Expose()
    get xxx(): string {
        return `${this.username} ${this.email}`;
    }

    @ApiProperty()
    @Transform(({value}) => '邮箱是：' + value)
    email: string;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
```

注意，这里要用 @ApiHideProperty 把 password 字段隐藏掉。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84f030080d644548a4174b32f4ccc623~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1246&h=1166&s=32708&e=webp&b=eff5fa)

可以看到，现在的 swagger 文档是对的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d51865fe90248a0ac40b6663251f867~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1174&h=1156&s=30900&e=webp&b=eff5fa)

而且我们没有用 vo 对象。

这也是为什么 Nest 文档里没有提到 vo，因为完全可以用 entity 来替代。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/vo-test)

## 总结

后端系统中常见 entity、vo、dto 三种对象，vo 是用来封装返回的响应数据的。

但是 Nest 文档里并没有提到 vo 对象，因为完全可以用 entity 来代替。

entity 里加上 @Exclude 可以排除某些字段、@Expose 可以增加一些派生字段、@Transform 可以对已有字段的序列化结果做修改。

然后在 cotnroller 上加上 ClassSerializerInterceptor 的 interceptor，还可以用 @SerializeOptions 来添加 options。

它的底层是基于 class-transfomer 包来实现的，拿到响应对象，plainToClass 拿到 class，然后根据 class 的装饰器再 classToPlain 创建序列化的对象。

swagger 的 @ApiResponse 也完全可以用 entity 来代替 vo，在想排除的字段加一下 @ApiHideProperty 就好了。

Nest 文档里并没有提到 vo 对象，因为完全没有必要，可以直接用序列化的 entity。