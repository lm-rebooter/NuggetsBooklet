这节我们来实现考试微服务的功能。

首先创建考试表：

| 字段名 | 数据类型 | 描述 |
| --- | --- | --- |
| id | INT | 考试ID |
| createUserId| INT | 创建者ID |
| name | VARCHAR(50) |考试名 |
| isPublish | BOOLEAN | 是否发布 |
| isDelete | BOOLEAN | 是否删除 |
| content | TEXT |试卷内容 JSON |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

改下 prisma 的 shema 文件：

```
model User {
  id  Int @id @default(autoincrement())
  username String @db.VarChar(50) @unique
  password String @db.VarChar(50)
  email String @db.VarChar(50)
  createTime DateTime @default(now())
  updateTime DateTime @updatedAt

  exams  Exam[]
}

model Exam {
  id  Int @id @default(autoincrement())
  name String @db.VarChar(50)
  isPublish Boolean @default(false)
  isDelete Boolean @default(false)
  content String @db.Text 
  createTime DateTime @default(now())
  updateTime DateTime @updatedAt

  createUserId Int
  createUser     User  @relation(fields: [createUserId], references: [id])
}
```
除了基本字段外，还要加一个多对一的关联：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9611195e28ac456b9325d54996a8f25e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1238&h=918&s=207560&e=png&b=1f1f1f)

生成这个表：

```
npx prisma migrate dev --name exam
```
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61804e7ff52245a3b456b9ef034eabf8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1212&h=474&s=80260&e=png&b=191919)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abcb3e46457e4522a11f84237076dd0b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1754&h=754&s=239791&e=png&b=1d1d1d)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0698df3f8e3f40e793860cb72cd179f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1258&h=638&s=263028&e=png&b=eeebeb)

然后实现下 exam 的几个接口：

| 接口路径 | 请求方式 | 描述 |
| -- |-- |-- |
| /exam/add | POST | 创建考试 |
| /exam/delete | DELETE | 删除考试|
| /exam/list | GET | 考试列表 |
| /exam/save | POST | 保存试卷内容 |
| /exam/publish | GET | 发布考试 |

在 exam 微服务改一下 ExamController：

```javascript
@Post('add')
@RequireLogin()
async add(@Body() dto: ExamAddDto, @UserInfo('userId') userId: number) {
    return this.examService.add(dto, userId);
}
```
创建考试需要关联用户，所以需要登录，拿到用户信息。

加一下全局的 Guard：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2308246a331a4248bcd72496b1d3f02e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=664&h=556&s=68857&e=png&b=1f1f1f)
```javascript
{
  provide: APP_Guard,
  useClass: AuthGuard
}
```

创建用到的 dto：

dto/exam-add.dto.ts
```javascript
import { IsNotEmpty } from "class-validator";

export class ExamAddDto {
    @IsNotEmpty({ message: '考试名不能为空' })
    name: string;
}
```
还有  service：

引入 PrismaModule：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9611cdda96df4b86befbfc95c32ccb55~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=846&h=576&s=114918&e=png&b=1f1f1f)

注入 PrismaService，实现关联插入：
```javascript
import { Inject, Injectable } from '@nestjs/common';
import { ExamAddDto } from './dto/exam-add.dto';
import { PrismaService } from '@app/prisma';

@Injectable()
export class ExamService {
  getHello(): string {
    return 'Hello World!';
  }

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async add(dto: ExamAddDto, userId: number) {

    return this.prismaService.exam.create({
      data: {
        name: dto.name,
        content: '',
        createUser: {
          connect: {
              id: userId
          }
        }
      }
    })
  }
}

```
然后在 main.ts 加一下 ValidationPipe：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03f64557faca4c6a9beb31f1257309ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1192&h=748&s=162394&e=png&b=1f1f1f)

```javascript
app.useGlobalPipes(new ValidationPipe({ transform: true }));
```
把 user 和 exam 服务跑起来：
```
npm run start:dev user
npm run start:dev exam
```
测试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d583d90d8fb4086bf10637b79ea4ee6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1236&h=948&s=166512&e=png&b=fdfdfd)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0663825464604e60b4a4d1b41a229287~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=960&s=85763&e=png&b=fdfdfd)

它会提示你找不到 JwtService：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e239e4792e44fab88fcc927cddab4dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1390&h=402&s=114183&e=png&b=181818)

我们之前在 UserModule 用的时候是引入了 JwtModule 所以才能找到：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/673ae08a799e476da40ec7976c55a2c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1330&h=932&s=215341&e=png&b=1d1d1d)

但每个微服务都引入 JwtService 明显不好。

在 CommonModule 里引入就好了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cd6992635e441eda76565560c11d2e4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1412&h=922&s=234810&e=png&b=1d1d1d)

```javascript
JwtModule.registerAsync({
  global: true,
  useFactory() {
    return {
      secret: 'guang',
      signOptions: {
        expiresIn: '30m' // 默认 30 分钟
      }
    }
  }
}),
```
然后在 UserModule、ExamModule 里引入 CommonModule，自然也就引入了 JwtModule：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6eb02a9aa0c4e71b969a67e54add965~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1008&h=842&s=168140&e=png&b=1f1f1f)

再跑下：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ece999762724e2489d69dd0908cb57c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=860&h=926&s=112566&e=png&b=fcfcfc)

带上 token 访问接口。

可以看到创建成功了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/217ee022bbba4e328a71b575026ecf8b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1532&h=304&s=131024&e=png&b=e9e7e6)

然后我们再实现下 list 接口：

添加一个路由：

```javascript
@Get('list')
@RequireLogin()
async list(@UserInfo('userId') userId: number) {
    return this.examService.list(userId);
}
```

在 service 实现 list 方法：

```javascript
async list(userId: number) {
    return this.prismaService.exam.findMany({
      where: {
        createUserId: userId
      }
    })
}
```
查询当前用户的所有考试。

测试下：

先创建一个：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0073614a29604af48cba992633887c48~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974&h=940&s=117421&e=png&b=fcfcfc)

查询下：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/917bdd378af446c7a77d1f930de0608a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=936&h=1148&s=154926&e=png&b=fdfdfd)

没啥问题。

然后继续实现删除考试接口：

```javascript
@Delete('delete/:id')
@RequireLogin()
async del(@UserInfo('userId') userId: number, @Param('id') id: string) {
  return this.examService.delete(userId, +id);
}
```
在 service 里实现下：

```javascript
async delete(userId: number, id: number) {
    return this.prismaService.exam.update({
      where: {
        id,
        createUserId: userId
      },
      data: {
        isDelete: true
      }
    })
  }
```
因为有回收站功能，所以这里只做逻辑删除，把 isDelete 设置为 true 就行。

试下效果：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/750df06bb4934de59e7899601a65fad6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=964&h=804&s=104501&e=png&b=fcfcfc)



![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5ad508bfa47400d96ddec320039b2e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=908&h=1154&s=153645&e=png&b=fdfdfd)

当然，这个 list 接口也得改下：

```javascript
@Get('list')
@RequireLogin()
async list(@UserInfo('userId') userId: number, @Query('bin') bin: string) {
    return this.examService.list(userId, bin);
}
```
只要传了 bin 参数，就查询回收站中的，否则返回正常的列表。

```javascript
async list(userId: number, bin: string) {
    return this.prismaService.exam.findMany({
      where: bin !== undefined ? {
        createUserId: userId,
        isDelete: true
      } : {
        createUserId: userId,
      }
    })
}
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2386e3373fcf40b4adba9a7a440aee45~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=950&h=1232&s=158817&e=png&b=fdfdfd)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4ffe918169448cab540030a34efe9dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=970&h=800&s=101260&e=png&b=fcfcfc)


接下里实现保存考试内容的功能。

| 接口路径 | 请求方式 | 描述 |
| -- |-- |-- |
| /exam/add | POST | 创建考试 |
| /exam/delete | DELETE | 删除考试|
| /exam/list | GET | 考试列表 |
| /exam/save | POST | 保存试卷内容 |
| /exam/publish | GET | 发布考试 |

这个就是修改 content：

添加路由：

```javascript
@Post('save')
@RequireLogin()
async save(@Body() dto: ExamSaveDto) {
    return this.examService.save(dto);
}
```
创建 dto：
dto/exam-save.dto.ts

```javascript
import { IsNotEmpty, IsString } from "class-validator";

export class ExamSaveDto {
    @IsNotEmpty({ message: '考试 id 不能为空' })
    id: number;

    @IsString()
    content: string;
}
```
实现下 service：

```javascript
async save(dto: ExamSaveDto) {
    return this.prismaService.exam.update({
      where: {
        id: dto.id
      },
      data: {
        content: dto.content
      }
    })
}
```

测试下：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/891938d96f9543908833f674d70b5987~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=872&h=888&s=110694&e=png&b=fcfcfc)

保存成功。

最后再来实现发布方法：

这个其实也是改个字段，把 exam 的 isPublish 改为 true 就好了：

```javascript
@Get('publish/:id')
@RequireLogin()
async publish(@UserInfo('userId') userId: number, @Param('id') id: string) {
    return this.examService.publish(userId, +id);
}
```

```javascript
async publish(userId: number, id: number) {
    return this.prismaService.exam.update({
      where: {
        id,
        createUserId: userId
      },
      data: {
        isPublish: true
      }
    })
}
```
测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b077bd82b7f4c948a792180a174cf52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=922&h=900&s=110821&e=png&b=fdfdfd)

这样，考试微服务的接口就完成了。

代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/exam-system)。

## 总结

这节我们实现了考试微服务的接口，包括考试列表、考试创建、考试删除、发布考试、保存试卷内容的接口。

当然，具体试卷内容的 JSON 格式还没定，等写前端代码的时候再说。
