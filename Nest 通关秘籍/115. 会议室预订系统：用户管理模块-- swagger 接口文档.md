后端写完接口，都会提供一份接口文档给前端。

这节我们就来做下这件事情，通过 swagger 生成接口文档。

安装 swagger 的包：

```
npm install --save @nestjs/swagger
```
在 main.ts 添加这段代码：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cb79629ae02494a8f10ee0ba0d210c3~tplv-k3u1fbpfcp-watermark.image?)

```javascript
const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-doc', app, document);
```
用 SwaggerModule 生成接口文档，url 是 /api-doc

访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb0ec13a8f534454b21c93635207f038~tplv-k3u1fbpfcp-watermark.image?)

可以看到所有接口都列出来了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2632002787d947f896e24819148cac6d~tplv-k3u1fbpfcp-watermark.image?)

还有用到的 schema，也就是对象的结构：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/422a5f7fc0074ab896e81c8a23ac8f3d~tplv-k3u1fbpfcp-watermark.image?)

只不过很多接口的文档是不对的：

比如用户列表接口，这些参数都不是必选的，而且也没有响应相关的信息：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8db08cdb95824d03817172059cc059a5~tplv-k3u1fbpfcp-watermark.image?)

还有 schema 也没有具体的内容。

这些需要我们加一些装饰器来告诉 swagger。

在 UserController 添加一个 @ApiTags

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d230e072de054ef4be2972b2c50c78de~tplv-k3u1fbpfcp-watermark.image?)

这样这个 cotroller 的接口会被单独分组：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10fa746380f6435f9fc4e32c868999f2~tplv-k3u1fbpfcp-watermark.image?)

然后我们一个个接口来看：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ed9e75309924374a97f66b08911680a~tplv-k3u1fbpfcp-watermark.image?)

先是 /user/register-captcha 接口

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff4429ddfe634070b93ed382853ab6c1~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'xxx@xx.com'
})
@ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String
})
```
通过 @ApiQuery 描述 query 参数，通过 @ApiResponse 描述响应。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c226a2c226604c82b080bc06a776aa28~tplv-k3u1fbpfcp-watermark.image?)

然后是 /user/register 接口：

它一共有 2 种状态码，200 和 400：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2348b92ec922492bb9220b5141255cee~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1073f3ea16e14f3d9924a7aac2dbaa7a~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@ApiBody({type: RegisterUserDto})
@ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String
})
@ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String
})
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7d3888d71464440bc6c4c08d8206055~tplv-k3u1fbpfcp-watermark.image?)

请求体的属性需要去 dto 里标识：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e23b1103900f49c195545a8f211a2969~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c904de33d354e11916f56d400d9e0f5~tplv-k3u1fbpfcp-watermark.image?)

然后接口文档里就可看到请求体的信息了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd9ae1fb9e054b62b36db1e11ff91592~tplv-k3u1fbpfcp-watermark.image?)

下面的 schema 里的 RegisterUserDto 也有了内容：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/507510e54dca43c2a52a79abbec80b1e~tplv-k3u1fbpfcp-watermark.image?)

接下来是 /user/login 接口：

它也是有 400 和 200 两种响应：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1938c62e487448dd847280e2565bb1be~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3138960114d142e793814edbfc206885~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@ApiBody({
    type: LoginUserDto
})
@ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String
})
@ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和 token',
    type: LoginUserVo
})
```
通过 @ApiResponse 标识两种响应，通过 @ApiBody 标识请求体。

然后在 LoginUserDto 和 LoginUserVo 里标识下属性：

LoginUserDto：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e784199fc1447ffb5bdffee2d5b6ab8~tplv-k3u1fbpfcp-watermark.image?)

LoginuserVo：

```javascript
import { ApiProperty } from "@nestjs/swagger";

class UserInfo {
    @ApiProperty()
    id: number;

    @ApiProperty({example: 'zhangsan'})
    username: string;

    @ApiProperty({example: '张三'})
    nickName: string;

    @ApiProperty({example: 'xx@xx.com'})
    email: string;

    @ApiProperty({example: 'xxx.png'})
    headPic: string;

    @ApiProperty({example: '13233333333'})
    phoneNumber: string;

    @ApiProperty()
    isFrozen: boolean;

    @ApiProperty()
    isAdmin: boolean;

    @ApiProperty()
    createTime: number;

    @ApiProperty({example: ['管理员']})
    roles: string[];

    @ApiProperty({example: 'query_aaa'})
    permissions: string[]
}
export class LoginUserVo {

    @ApiProperty()
    userInfo: UserInfo;

    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}
```

之前这里的 UserInfo 是 interface，这里要改成 class 才能加装饰器。

测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4becc1d39cbc4a5dbe146986295b6896~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6e1168f077343d4908e1616bbaa9a8b~tplv-k3u1fbpfcp-watermark.image?)

/user/admin/login 的 swagger 装饰器和 /user/login 一样。

然后继续看 /user/refresh 接口：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c03e7389acd24c89aeaf92d1657ba9c3~tplv-k3u1fbpfcp-watermark.image?)
```javascript
@ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新 token',
    required: true,
    example: 'xxxxxxxxyyyyyyyyzzzzz'
})
@ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登录'
})
@ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功'
})
```

用 @ApiQuery 标识 query 参数，用 @ApiResponse 标识两种响应。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb5d7836c77d445482bd6e1d90414ab2~tplv-k3u1fbpfcp-watermark.image?)
 
但现在刷新成功的 access_token 和 refresh_token 没有显示。

所以我们也需要把这个返回值封装成 vo：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/027cb4c54b00432190bb3554dfa992d4~tplv-k3u1fbpfcp-watermark.image?)

新建 src/user/vo/refresh-token.vo.ts

```javascript
import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenVo {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    refresh_token: string;
}
```
把返回的结果封装成 vo：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29ee014300c440d4ab5ce5e322d42f0a~tplv-k3u1fbpfcp-watermark.image?)

```javascript
const vo = new RefreshTokenVo();

vo.access_token = access_token;
vo.refresh_token = refresh_token;

return vo;
```
在 @ApiResponse 里标识这个 type

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d390166b24b4c33952a19651a1338b6~tplv-k3u1fbpfcp-watermark.image?)

刷新下页面，可以看到现在接口文档里就有了返回数据的结构：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8725ded96f484f40acc168a8526547e9~tplv-k3u1fbpfcp-watermark.image?)

/user/admin/login 的处理方式一样。

接下来是 /user/info 接口：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bdef74a687d4786ac2e4b483b1dffdd~tplv-k3u1fbpfcp-watermark.image?)

加一下返回的数据的标识 @ApiResponse。

然后在 UserDetailVo 里加一下 @ApiProperty：

```javascript
import { ApiProperty } from "@nestjs/swagger";

export class UserDetailVo {
    @ApiProperty()
    id: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    nickName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    headPic: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    isFrozen: boolean;

    @ApiProperty()
    createTime: Date;
}
```
这样返回的数据结构就对了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6967a10bb794b11b30b24575a73f97f~tplv-k3u1fbpfcp-watermark.image?)

但这个接口是需要登录的，我们加一下标识：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/413d5a6bf0c945f4a7857742b53f524a~tplv-k3u1fbpfcp-watermark.image?)

然后在 main.ts 里加一下这种 bearer 的认证方式：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/586a90ae7d964291b21bedb0f75bcc62~tplv-k3u1fbpfcp-watermark.image?)

这时候这个接口就有了锁的标记，代表需要登录了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f872562f56c54288803535e014dff025~tplv-k3u1fbpfcp-watermark.image?)

点击锁，填入 access_token，这样再测试接口的时候，会自动带上 token 标识：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e90bb9dd2914fc7864dc067df8a3845~tplv-k3u1fbpfcp-watermark.image?)

比如我输入 xxx，然后点击 authorize

然后点击 try it out 和 execute，可以看到浏览器发送了这个请求，并且带上了 authorization 的 header 

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de975505b4374adc932e8980b8602ee7~tplv-k3u1fbpfcp-watermark.image?)

可以在 swagger 文档里测试这个接口。

接下来是 /user/update_password

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7359a3f566124a72b8b601b8014a9314~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@ApiBearerAuth()
@ApiBody({
    type: UpdateUserPasswordDto
})
@ApiResponse({
    type: String,
    description: '验证码已失效/不正确'
})
```
在 UpdateUserPasswordDto 里加一下 @ApiProperty

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f620d8c3ee744c249c6364103c655e02~tplv-k3u1fbpfcp-watermark.image?)
接口文档没啥问题：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70b6e7de3485400aacd615e947b5c5e5~tplv-k3u1fbpfcp-watermark.image?)

接下来是 /user/update_password/captcha 接口

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1926854b29ed408dbfe6cdb36ed3c3cb~tplv-k3u1fbpfcp-watermark.image?)

这个接口是需要登录的，当时为了测试方便没有加，现在加一下：

```javascript
@ApiBearerAuth()
@ApiQuery({
    name: 'address',
    description: '邮箱地址',
    type: String
})
@ApiResponse({
    type: String,
    description: '发送成功'
})
@RequireLogin()
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2f4a7401c5849d79f3715bdc1e1c19e~tplv-k3u1fbpfcp-watermark.image?)

然后是 /user/update 接口：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7dd319f321d46b4b9d13f1cc058d76a~tplv-k3u1fbpfcp-watermark.image?)
```javascript
@ApiBearerAuth()
@ApiBody({
    type: UpdateUserDto
})
@ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/不正确'
})
@ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: String
})
```
在 UpdateUserDto 里标识下 @ApiProperty
 
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e1ff3f94f254dc4b6387bc0966104ed~tplv-k3u1fbpfcp-watermark.image?)

刷新下，可以看到最新的接口文档：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a4d3ead23cd499e9aab5fc18fd63def~tplv-k3u1fbpfcp-watermark.image?)

然后是 /user/freeeze 接口

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee6adf9f9a2745eab7d181f23ae83d70~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@ApiBearerAuth()
@ApiQuery({
    name: 'id',
    description: 'userId',
    type: Number
})
@ApiResponse({
    type: String,
    description: 'success'
})
@RequireLogin()
```

刷新下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc42883dc2c24c5e94c3c82af1982836~tplv-k3u1fbpfcp-watermark.image?)

没啥问题。

最后，还剩下 /user/list 接口：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac7c6fda80da4c1fa23381a93ecbee06~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@ApiBearerAuth()
@ApiQuery({
    name: 'pageNo',
    description: '第几页',
    type: Number
})
@ApiQuery({
    name: 'pageSize',
    description: '每页多少条',
    type: Number
})
@ApiQuery({
    name: 'username',
    description: '用户名',
    type: Number
})
@ApiQuery({
    name: 'nickName',
    description: '昵称',
    type: Number
})
@ApiQuery({
    name: 'email',
    description: '邮箱地址',
    type: Number
})
@ApiResponse({
    type: String,
    description: '用户列表'
})
@RequireLogin()
```
这里的返回值需要封装个 vo：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc5f0e83f0984c51be62858635595658~tplv-k3u1fbpfcp-watermark.image?)

创建 src/user/vo/user-list.vo.ts
```javascript
import { ApiProperty } from "@nestjs/swagger";

class User {
    @ApiProperty()
    id: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    nickName: string;
    
    @ApiProperty()
    email: string; 

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    isFrozen: boolean;
    
    @ApiProperty()
    headPic: string;

    @ApiProperty()
    createTime: Date;
}

export class UserListVo {

    @ApiProperty({
        type: [User]
    })
    users: User[];

    @ApiProperty()
    totalCount: number;
}
```

注意这里标识 User 数组要用 [User]

然后把 findUsers 的返回值改为 UserListVo

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b61308edae734d78aa9518c0dcc3058a~tplv-k3u1fbpfcp-watermark.image?)

```javascript
const vo = new UserListVo();

vo.users = users;
vo.totalCount = totalCount;
return vo;
```

刷新下接口文档：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bde29165e214d35b8fb42a9a3628a93~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b502e1a38ba4aff97c84993d23778cf~tplv-k3u1fbpfcp-watermark.image?)

没啥问题。

这样，我们就给所有的接口生成了 api 文档。

代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/meeting_room_booking_system_backend)。

## 总结

这节我们用 swagger 生成了接口文档。

在 main.ts 里调用 SwaggerModule.setup 来生成接口文档。

然后用 @ApiQuery、@ApiBody、@ApiResponse、@ApiProperty 等来标识每个接口的参数和响应。

并且通过 @ApiBearerAuth 标识需要 jwt 认证的接口。

返回对象的接口需要把它封装成 vo，然后再添加 @ApiProperty。

接口文档提供给前端之后，前端就可以基于这个来写页面了。


