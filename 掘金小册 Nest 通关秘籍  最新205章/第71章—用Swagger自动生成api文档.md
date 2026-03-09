### 本资源由 itjc8.com 收集整理
﻿后端开发完接口后，需要给前端一份接口文档，描述有哪些接口，是 GET 还是 POST，有哪些参数，响应是什么。

但是写完代码后再去单独写一份这样的文档还是很麻烦的，并且改动接口之后也要同步去修改接口文档。

能不能自动生成 API 接口文档呢？

是可以的，就是这节要讲的 swagger。

我们新建个项目：

    nest new swagger-test -p npm

安装 swagger 的包：

```
npm install --save @nestjs/swagger
```

然后在 main.ts 添加这样一段代码：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-1.png)

```javascript
const config = new DocumentBuilder()
    .setTitle('Test example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('test')
    .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('doc', app, document);
```
通过 DocumentBuilder 创建 config。

然后用 SwaggerModule.createDocument 根据 config 创建文档。

之后用 SwaggerModule.setup 指定在哪个路径可以访问文档。

跑起来试试：

```
npm run start:dev
```
访问 http://localhost:3000/doc 就可以看到 swagger 的 api 文档了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-2.png)

和 DocumentBuilder 填的配置的对应关系如下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-3.png)

现在只有一个接口，调用会返回 hello world：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-4.png)

点击 try it out，再点击 execute，就可以看到返回的响应体和 header：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-5.png)

我们在 AppController 加几个接口试试：

```javascript
@Get('aaa')
aaa(@Query('a1') a1, @Query('a2') a2) {
    console.log(a1, a2);
    return 'aaa success';
}

@Get('bbb/:id')
bbb(@Param('id') id) {
    console.log(id);
    return 'bbb success';
}

@Post('ccc')
ccc(@Body('ccc') ccc) {
    console.log(ccc);
    return 'ccc success';
}
```

加了一个有 query 参数、一个有 param 参数、一个有 body 参数的接口。

刷新下可以看到，这几个接口都列出来了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-6.png)

但是都没有 param 的描述和 response 的描述：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-7.png)

这时就需要我们手动标注了：

```javascript
@ApiOperation({ summary: '测试 aaa',description: 'aaa 描述' })
@ApiResponse({
    status: HttpStatus.OK,
    description: 'aaa 成功',
    type: String
})
@Get('aaa')
aaa(@Query('a1') a1, @Query('a2') a2) {
    console.log(a1, a2);
    return 'aaa success';
}
```
给 aaa 接口添加 @ApiOperation 和 @ApiResponse 的装饰器。

这俩分别是指定这个接口的描述，接口的响应的。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-8.png)

再加上 @ApiQuery 来添加 query 参数的说明：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-9.png)

```javascript
@ApiQuery({
    name: 'a1',
    type: String,
    description: 'a1 param',
    required: false,
    example: '1111',
})
@ApiQuery({
    name: 'a2',
    type: Number,
    description: 'a2 param',
    required: true,
    example: 2222,
})  
```
刷新下，可以看到 swagger 文档里出现了这两个参数的说明：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-10.png)

点击 try it out 和 execute，就可以看到发送了请求并返回了响应：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-11.png)

这样，一个接口就描述完了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-12.png)

通过 @ApiOperation 描述接口的信息，@ApiResponse 描述返回值信息，@ApiQuery 描述 query 参数信息。

就能生成对应的 swagger 文档：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-13.png)

我们接着来生成 bbb 接口的 swagger 文档：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-14.png)

这里用到的是 @ApiParam 而不是 @ApiQuery，其余部分一样：
```javascript
@ApiOperation({ summary: '测试 bbb',description: 'bbb 描述' })
@ApiResponse({
    status: HttpStatus.OK,
    description: 'bbb 成功',
    type: String
})
@ApiParam({
    name: 'id',
    description: 'ID',
    required: true,
    example: 222,
})
```
刷新可以看到 bbb 接口的文档：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-15.png)

那如果 id 不合法的时候，我返回了一个 401 的响应呢？

那就再加一个 @ApiResponse

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-16.png)

```javascript
@ApiOperation({ summary: '测试 bbb',description: 'bbb 描述' })
@ApiResponse({
    status: HttpStatus.OK,
    description: 'bbb 成功',
    type: String
})
@ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'id 不合法'
})
@ApiParam({
    name: 'id',
    description: 'ID',
    required: true,
    example: 222,
})
@Get('bbb/:id')
bbb(@Param('id') id: number) {
    console.log(id);
    if(id !== 111) {
      throw new UnauthorizedException();
    }
    return 'bbb success';
}
```
刷新下，可以看到 swagger 文档标识出了这两种响应：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-17.png)

然后再来写 ccc 接口的文档：

ccc 接收的是请求体的参数，我们创建个 CccDto。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-18.png)

```javascript
export class CccDto {
    aaa: string;
    bbb: number;
    ccc: Array<string>;
}
```
接收参数通过 dto 来接收，而返回值放在 vo 里：

```javascript
@Post('ccc')
ccc(@Body('ccc') ccc: CccDto) {
    console.log(ccc);
    return {
      aaa: 111,
      bbb: 222
    };
}
```
创建个 vo 的 class：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-19.png)
```javascript
export class CccVo {
    aaa: number;
    bbb: number;
}
```
返回值就可以改成这样了：

```javascript
@Post('ccc')
ccc(@Body('ccc') ccc: CccDto) {
    console.log(ccc);

    const vo = new CccVo();
    vo.aaa = 111;
    vo.bbb = 222;
    return vo;
}
```

这里的 dto、vo 随便搜一下就能查到解释：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-20.png)

在 Nest 里要能清楚的区分 dto、vo、entity 的区别：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-21.png)

dto 是 data transfer object，用于参数的接收。

vo 是 view object，用于返回给视图的数据的封装。

而 entity 是和数据库表对应的实体类。

然后我们继续来写 ccc 接口的 swagger 文档。

很容易想到，body 的描述是通过 @ApiBody 的装饰器：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-22.png)
```javascript
@ApiOperation({summary:'测试 ccc'})
@ApiResponse({
    status: HttpStatus.OK,
    description: 'ccc 成功',
    type: CccVo
})
@ApiBody({
    type: CccDto
})
@Post('ccc')
ccc(@Body('ccc') ccc: CccDto) {
    console.log(ccc);

    const vo = new CccVo();
    vo.aaa = 111;
    vo.bbb = 222;
    return vo;
}
```

刷新页面，你会看到除了接口外，还生成了俩 schema。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-23.png)

也就是说对象的响应会对应 swagger 的 schema。

只不过现在 CccDto、CccVo 的 schema 没有内容，这是因为我们还没有标注。

在 CccDto 加一下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-24.png)

aaa、bbb、ccc 通过 @ApiProperty 标识下，并且 bbb 是 @ApiPropertyOptional，也就是可选，这个和 @ApiProperty({ required: false }) 等价。

aaa 可以传 enum 的值，取值范围是 a1、a2、a3。

同样，CccVo 也加一下：

```javascript
import { ApiProperty } from "@nestjs/swagger";

export class CccVo {
    @ApiProperty({ name: 'aaa' })
    aaa: number;

    @ApiProperty({ name: 'bbb' })
    bbb: number;
}
```
刷新下，现在就可以看到 CccDto、CccVo 的 schema 有属性了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-25.png)

其中 bbb 是没有 * 的，代表可不传。

上面的接口部分也有了请求和响应的示例：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-26.png)

点下 try it out，可以自己编辑请求体：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-27.png)

然后点击 execute 就可以看到响应的内容和 header：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-28.png)

服务端也确实接收到了这个请求：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-29.png)

可以用 swagger 来方便的测试接口。

此外，还可以通过 @ApiTags 来给接口分组：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-30.png)

比如 controller 是 xxx 开头的，那可以用 @ApiTags 来分组到 xxx。

显示的时候，就会把这个 controller 的接口分到一个组下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-31.png)

也可以添加在 handler 上：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-32.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-33.png)

比如把 aaa、bbb 接口分到 xxx-get 的组。

那显示的时候就会把这俩接口分出来：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-34.png)

当接口多了之后，分组还是很有必要的。

回过头来，再讲下 @ApiProperty，其实它还有很多属性：

```javascript
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CccDto {
    @ApiProperty({ name: 'aaa', enum: ['a1', 'a2', 'a3'], maxLength: 30, minLength: 2, required: true})
    aaa: string;

    @ApiPropertyOptional({ name: 'bbb', maximum: 60, minimum: 40, default: 50, example: 55})
    bbb: number;

    @ApiProperty({ name: 'ccc' })
    ccc: Array<string>;
}
```

比如 required、minium、maximum、default、maxLength 等。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-35.png)

此外，很多接口是需要登录才能访问的，那如何限制呢？

swagger 也提供了这方面的支持。

常用的认证方式就是 jwt、cookie。

分别在 aaa、bbb、ccc 接口添加 @ApiBearerAuth、@ApiCookieAuth、@ApiBasicAuth

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-36.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-37.png)


![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-38.png)

然后在 main.ts 里添 3 种认证方式的信息：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-39.png)

```javascript
const config = new DocumentBuilder()
    .setTitle('Test example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('test')
    .addBasicAuth({
      type: 'http',
      name: 'basic',
      description: '用户名 + 密码'
    })
    .addCookieAuth('sid', {
      type: 'apiKey',
      name: 'cookie',
      description: '基于 cookie 的认证'
    })
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证',
      name: 'bearer'
    })
    .build();
```
刷新页面就可以看到接口出现了锁的标记：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-40.png)

点击 aaa 的锁：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-41.png)

输入 jwt 的 token，然后点击 authorize。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-42.png)

锁会变成锁住状态，代表授权成功了。

这时候再发一个请求：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-43.png)

会发现带上了 Authorization 的 header，这就是我们见过的 jwt 认证方式。

同理，下面的 cookie 会带上对应的 cookie来认证：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-44.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-45.png)

而 basic 的方式，会要求你输入用户名密码：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-46.png)

请求时会带上 Authorization： Basic xxx 的 header 来访问。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-47.png)

这样，这些需要授权的接口就分别添加上了不同的认证方式的标识。

其实，swagger 是一种叫做 openapi 标准的实现。

在 /doc 后加上个 -json 就可以看到对应的 json

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-48.png)

装个格式化 chrome 插件格式化一下，大概是这样的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第71章-49.png)

如果你觉得 swagger 文档比较丑，可以这个 json 导入别的平台。

一般 api 接口的平台都是支持 openapi 的。


案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/swagger-test)

## 总结

这节我们学习了 swagger 自动生成文档。

需要先安装 @nestjs/swagger 的包。

然后在 main.ts 里用 DocumentBuilder + SwaggerModule.createDocuemnt 创建 swagger 文档配置，然后 setup 跑起来就好了。

还需要手动加一些装饰器来标注：

- ApiOperation：声明接口信息
- ApiResponse：声明响应信息，一个接口可以多种响应
- ApiQuery：声明 query 参数信息
- ApiParam：声明 param 参数信息
- ApiBody：声明 body 参数信息，可以省略
- ApiProperty：声明 dto、vo 的属性信息
- ApiPropertyOptional：声明 dto、vo 的属性信息，相当于 required: false 的 ApiProperty
- ApiTags：对接口进行分组
- ApiBearerAuth：通过 jwt 的方式认证，也就是 Authorization: Bearer xxx
- ApiCookieAuth：通过 cookie 的方式认证
- ApiBasicAuth：通过用户名、密码认证，在 header 添加 Authorization: Basic xxx

swagger 是 openapi 标准的实现，可以在 url 后加个 -json 拿到对应的 json，然后导入别的接口文档平台来用。

绝大多数公司的接口文档都是用 swagger 来自动生成的，不然手动维护太麻烦了。

而且 swagger 还可以方便的测试接口，自动添加身份认证等。

你们公司用的是 swagger 生成的接口文档么？
