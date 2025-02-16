### 本资源由 itjc8.com 收集整理
﻿后端写完接口，都会提供一份接口文档给前端。

这节我们就来做下这件事情，通过 swagger 生成接口文档。

安装 swagger 的包：

```
npm install --save @nestjs/swagger
```
在 main.ts 添加这段代码：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-1.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-2.png)

可以看到所有接口都列出来了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-3.png)

还有用到的 schema，也就是对象的结构：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-4.png)

只不过很多接口的文档是不对的：

比如用户列表接口，这些参数都不是必选的，而且也没有响应相关的信息：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-5.png)

还有 schema 也没有具体的内容。

这些需要我们加一些装饰器来告诉 swagger。

在 UserController 添加一个 @ApiTags

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-6.png)

这样这个 cotroller 的接口会被单独分组：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-7.png)

然后我们一个个接口来看：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-8.png)

先是 /user/register-captcha 接口

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-9.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-10.png)

然后是 /user/register 接口：

它一共有 2 种状态码，200 和 400：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-11.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-12.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-13.png)

请求体的属性需要去 dto 里标识：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-14.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-15.png)

然后接口文档里就可看到请求体的信息了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-16.png)

下面的 schema 里的 RegisterUserDto 也有了内容：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-17.png)

接下来是 /user/login 接口：

它也是有 400 和 200 两种响应：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-18.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-19.png)

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
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-20.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-21.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-22.png)

/user/admin/login 的 swagger 装饰器和 /user/login 一样。

然后继续看 /user/refresh 接口：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-23.png)
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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-24.png)
 
但现在刷新成功的 access_token 和 refresh_token 没有显示。

所以我们也需要把这个返回值封装成 vo：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-25.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-26.png)

```javascript
const vo = new RefreshTokenVo();

vo.access_token = access_token;
vo.refresh_token = refresh_token;

return vo;
```
在 @ApiResponse 里标识这个 type

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-27.png)

刷新下页面，可以看到现在接口文档里就有了返回数据的结构：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-28.png)

/user/admin/login 的处理方式一样。

接下来是 /user/info 接口：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-29.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-30.png)

但这个接口是需要登录的，我们加一下标识：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-31.png)

然后在 main.ts 里加一下这种 bearer 的认证方式：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-32.png)

这时候这个接口就有了锁的标记，代表需要登录了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-33.png)

点击锁，填入 access_token，这样再测试接口的时候，会自动带上 token 标识：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-34.png)

比如我输入 xxx，然后点击 authorize

然后点击 try it out 和 execute，可以看到浏览器发送了这个请求，并且带上了 authorization 的 header 

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-35.png)

可以在 swagger 文档里测试这个接口。

接下来是 /user/update_password

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-36.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-37.png)
接口文档没啥问题：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-38.png)

接下来是 /user/update_password/captcha 接口

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-39.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-40.png)

然后是 /user/update 接口：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-41.png)
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
 
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-42.png)

刷新下，可以看到最新的接口文档：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-43.png)

然后是 /user/freeeze 接口

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-44.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-45.png)

没啥问题。

最后，还剩下 /user/list 接口：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-46.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-47.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-48.png)

```javascript
const vo = new UserListVo();

vo.users = users;
vo.totalCount = totalCount;
return vo;
```

刷新下接口文档：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-49.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第90章-50.png)

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


