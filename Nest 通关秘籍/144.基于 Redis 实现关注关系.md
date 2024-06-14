在掘金、知乎、抖音等平台，我们可以关注其他用户，其他用户也可以关注我们，而且如果彼此关注，会标出共同关注：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83cfee2985794c9aa70681c0a8befe65~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=402&h=226&s=16200&e=png&b=ffffff)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6267eb7098864bc9ad1bd38947d6396b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=646&h=224&s=17183&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a840d5d8c2d441e0a6e624bf718c570e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1390&h=854&s=150292&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f37bcdaf9ee4ad0805b2386d4841768~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1370&h=924&s=226747&e=png&b=ffffff)

这种关注、被关注，相互关注，我们每天都能见到。

那它是怎么实现的呢？

一般是用 redis 的 Set 实现的。

Set 是集合，有很多命令：

**SADD**：添加元素

**SMEMBERS**：查看所有元素

**SISMEMBER**：某个 key 是否在集合中

**SCARD**：集合中某个 key 的元素数量

**SMOVE**：移动元素从一个集合到另一个集合

**SDIFF**：两个集合的差集

**SINTER**：两个集合的交集

**SUNION**：两个集合的并集

**SINTERSTORE**：两个集合的交集，存入新集合

**SUNIONSTORE**：两个集合的并集，存入新集合

**SDIFFSTORE**：两个集合的差集，存入新集合

更多命令可以在 [redis 文档](https://redis.io/commands/sismember/)中搜索以 S 开头的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57f47f68a51a4c18ab0c9f0cb694007f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=814&h=902&s=151766&e=png&b=f6f8fb)

关注关系用 redis 来实现就是这样的：

比如张三 的 userId 是 1

那我们用一个 set 来存储它的关注者 followers:1

比如其中有 2、3、4 三个用户

然后用一个集合来存储他关注的人 following:1

其中有 2、5、6 三个用户

那相互关注的人就是 followers:1 和 following:1 的交集 SINTERSTORE 的结果，存入新集合，比如叫 follow-each-other:1

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63be34aa78174e28ac576083e41f44f1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184&h=470&s=50305&e=png&b=fef9f9)

然后返回关注者或者关注的人的时候，用 SISMEMBER 判断下用户是否在 follow-each-other:1 这个集合中，是的话就可以标记出互相关注。

思路理清了，我们来写下代码。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f80d025db48e4f358a6990a8cb2963b0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=898&h=688&s=160896&e=png&b=010101)

安装 TypeORM 的包：
```bash
npm install --save @nestjs/typeorm typeorm mysql2
```
在 app.module.ts 引入下 TypeOrmModule：

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "following_test",
      synchronize: true,
      logging: true,
      entities: [],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
在 mysql workbench 里创建 following_test 数据库：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96d52317035e4069a495f0c8b1d928c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1800&h=1114&s=382459&e=png&b=e7e5e5)

新建一个 user 模块：

```
nest g resource user --no-spec
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2113f05c4cb44006a79a500b07759a25~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=784&h=292&s=73752&e=png&b=191919)

改下 user.entity.ts

```javascript
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => User, user => user.following)
    @JoinTable()
    followers: User[];

    @ManyToMany(() => User, user => user.followers)
    following: User[];
}
```

这里用户和用户是多对多的关系，因为用户可以关注多个用户，用户也可以被多个用户关注。

所以用 @ManyToMany 还有 @JoinTable 来声明。

在 entities 引入这个 User：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4826a80c3214e9e924d716151c163fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=776&h=692&s=110245&e=png&b=202020)

把开发服务跑起来：

```
npm run start:dev
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6a173d5becc446cb5d62accf25edfd2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1686&h=636&s=280881&e=png&b=191919)

在 mysql workbench 里可以看到 user 表和 user_followers_user 中间表

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8f0ffa92f154d039c53f79c766ee62d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=854&h=280&s=65482&e=png&b=ebe7e6)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/580588f3d64041ea8831439904c18034~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=892&h=250&s=56217&e=png&b=ebe8e7)

我们在 UserService 添加一个初始化数据的方法：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b3cd38c8cf84e59ad7cecc5c546db53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=1166&s=213194&e=png&b=1f1f1f)
```javascript
@InjectEntityManager()
entityManager: EntityManager;

async initData() {    
    const user2 = new User();
    user2.name = '李四';

    const user3 = new User();
    user3.name = '王五';

    const user4 = new User();
    user4.name = '赵六';

    const user5 = new User();
    user5.name = '刘七';

    await this.entityManager.save(user2);
    await this.entityManager.save(user3);
    await this.entityManager.save(user4);
    await this.entityManager.save(user5);

    const user1 = new User();
    user1.name = '张三';

    user1.followers = [user2, user3, user4];

    user1.following = [user2, user5];

    await this.entityManager.save(user1);
}
```
在 UserController 里添加一个路由：

```javascript
@Get('init')
async init() {
    await this.userService.initData();
    return 'done'
}
```
浏览器访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67cae28e4c0c49cc974bc594837e73d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=738&h=188&s=21060&e=png&b=ffffff)

打印了 6 条 sql 语句：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46b3c6c867c0414a8747d2f010301653~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2074&h=626&s=233512&e=png&b=181818)

在 mysql workbench 里看下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b09a5afe2774f7787e83c60c4bd2b58~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=868&h=380&s=104706&e=png&b=eae6e5)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a574da7bcdae49e88309da8c20eadac0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=852&h=314&s=78866&e=png&b=ebe8e7)

张三的 id 是 5，他的三个关注者李四、王五、赵六，他关注的人李四、刘七。

关系都保存下来了。

接下来实现相互关注功能，我们要引入 redis。

安装 redis 的包：

```
npm install --save redis
```

然后创建个 redis 模块：

```
nest g module redis
nest g service redis
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eaf36dbe385544309bc35de23c2a45a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=722&h=196&e=webp&b=1f1f1f)

在 RedisModule 创建连接 redis 的 provider，导出 RedisService，并把这个模块标记为 @Global 模块

```javascript
import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });
        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
```

然后在 RedisService 里注入 REDIS_CLIENT，并封装一些方法：

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

    @Inject('REDIS_CLIENT') 
    private redisClient: RedisClientType;

    async sAdd(key: string, ...members: string[]) {
        return this.redisClient.sAdd(key, members);
    }

    async sInterStore(newSetKey: string, set1: string, set2: string) {
        return this.redisClient.sInterStore(newSetKey, [set1, set2]);
    }

    async sIsMember(key: string, member: string) {
        return this.redisClient.sIsMember(key, member);
    }
    
    async sMember(key: string) {
        return this.redisClient.sMembers(key);
    }
    
    async exists(key: string) {
        const result =  await this.redisClient.exists(key);
        return result > 0
    } 
}
```
封装 SADD、SINTERSTORE、SISMEMBER、SMEMBER 命令，分别用来往集合中添加元素，求两个集合的交集创建新集合，判断元素是否在某个集合中、返回集合中的所有元素。

还有 EXISTS 用来判断某个 key 是否存在，返回 1 代表存在，返回 0 代表不存在。

然后在 UserService 添加一个方法：

```javascript
@Inject(RedisService)
redisService: RedisService;

async findUserByIds(userIds: string[] | number[]) {
  let users = [];

  for(let i = 0; i< userIds.length; i ++) {
    const user = await this.entityManager.findOne(User, {
      where: {
        id: +userIds[i]
      }
    });
    users.push(user);
  }

  return users;
}

async getFollowRelationship(userId: number) {
  const exists = await this.redisService.exists('followers:' + userId);
  if(!exists) {
    const user = await this.entityManager.findOne(User, {
      where: {
        id: userId
      },
      relations: ['followers', 'following']
    });

    if(!user.followers.length || !user.following.length) {
      return {
        followers: user.followers,
        following: user.following,
        followEachOther: []
      }
    }

    await this.redisService.sAdd('followers:' + userId, ...user.followers.map(item => item.id.toString()));

    await this.redisService.sAdd('following:' + userId, ...user.following.map(item => item.id.toString()))

    await this.redisService.sInterStore('follow-each-other:' + userId, 'followers:' + userId, 'following:' + userId);

    const followEachOtherIds = await this.redisService.sMember('follow-each-other:' + userId);
    
    const followEachOtherUsers = await this.findUserByIds(followEachOtherIds);

    return {
      followers: user.followers,
      following: user.following,
      followEachOther: followEachOtherUsers
    }
  } else {

    const followerIds = await this.redisService.sMember('followers:' + userId);
    
    const followUsers = await this.findUserByIds(followerIds);
    
    const followingIds = await this.redisService.sMember('following:' + userId);
    
    const followingUsers = await this.findUserByIds(followingIds);

    const followEachOtherIds = await this.redisService.sMember('follow-each-other:' + userId);
    
    const followEachOtherUsers =await this.findUserByIds(followEachOtherIds);

    return {
      followers: followUsers,
      following: followingUsers,
      followEachOtherUsers: followEachOtherUsers
    }
  }
}
```

代码比较多，我们一部分一部分的看：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e80fde93df5e4afda2f192156ce50967~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=894&h=616&s=84452&e=png&b=1f1f1f)

传入 userIds，查询对应的 User 信息返回。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4eac4179dcc14c92b0ce7facdef2bc4c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=890&h=504&s=72159&e=png&b=1f1f1f)

根据 id 查询用户的信息，关联查出 followers 和 following。

如果 follwers 或者 following 为空，那就没有互相关注，可以直接返回。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56c098baa25a416989b89b25e8594bc1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1698&h=558&s=159931&e=png&b=1f1f1f)

否则就分别把 follwers 和 follwing 的 id 用 SADD 添加到两个集合中。

之后求两个集合的交集，存入 follow-each-other:userId 的集合。

最后把 followers、following 还有求出来的相互关注的关系返回。

如果 exits 判断 followers 集合存在，就是处理过了，那就直接取 redis 里的这三个集合。

根据集合的 id 求出用户信息返回：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a9ee41036d649d0b76554eb9ac5cf66~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1424&h=860&s=202230&e=png&b=1f1f1f)

在 UserController 添加一个路由：

```javascript
@Get('follow-relationship')
async followRelationShip(@Query('id') id: string) {
    if(!id) {
      throw new BadRequestException('userId 不能为空');
    }
    return this.userService.getFollowRelationship(+id);
}
```

浏览器访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7a125740526474bab7354d8c28ecb6c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1228&h=1384&s=112362&e=png&b=fefefe)

结果是正确的。

在 RedisInsight 里可以看到这三个 set：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aebac60669f74b2f9c8ab9c102a5756f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1686&h=932&s=114978&e=png&b=181818)

逻辑比较复杂，我们调试下。

点击 debug 面板的 create a launch.json file

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/244adf5d3f7f4cd5bef548988ca69475~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=642&h=472&s=51348&e=png&b=181818)

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "debug nest",
            "request": "launch",
            "runtimeArgs": [
                "run",
                "start:dev"
            ],
            "runtimeExecutable": "npm",
            "console": "integratedTerminal",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "type": "node"
        }
    ]
}
```

在代码里打两个断点：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e67fc1bbf94a49f7b0ca57f4a24ac4f2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=934&s=221261&e=png&b=1f1f1f)

点击 debug 启动：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d3354bf801c4579a7018287ccb23d0b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2042&h=1498&s=516798&e=png&b=1a1a1a)

浏览器访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30ff0d0aed9f4666990e7904286807c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1696&h=1056&s=406680&e=png&b=1e1e1e)

可以看到，它走到了 else 部分。

在 RedisInsight 里把这三个集合删掉：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afc555a52bde484ba2bfaea75811a36b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1282&h=598&s=61292&e=png&b=1a1a1a)

再次访问：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c10201730b174780bbeefb5edc839f2b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1660&h=1148&s=434894&e=png&b=1d1d1d)

这时候走的就是另一个分支了。

那如果有新的关注者呢？

比如张三又关注了 id 为 3 的赵六：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77c732eae95149668f24eac579a7ca9b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1088&h=1376&s=109163&e=png&b=fefefe)

这时要更新下数据库，并且更新 redis 里的 follwing 和 follow-each-other 集合。

在 UserService 添加 follow 方法：

```javascript
async follow(userId: number, userId2: number){
  const user = await this.entityManager.findOne(User, {
    where: {
      id: userId
    },
    relations: ['followers', 'following']
  });

  const user2 = await this.entityManager.findOne(User, {
    where: {
      id: userId2
    }
  });

  user.followers.push(user2);

  await this.entityManager.save(User, user);

  const exists = await this.redisService.exists('followers:' + userId);

  if(exists) {
    await this.redisService.sAdd('followers:' + userId, userId2.toString());
    await this.redisService.sInterStore('follow-each-other:' + userId, 'followers:' + userId, 'following:' + userId);
  }
  
 const exists2 = await this.redisService.exists('following:' + userId2);

 if(exists2) {
    await this.redisService.sAdd('following:' + userId2, userId.toString());
    await this.redisService.sInterStore('follow-each-other:' + userId2, 'followers:' + userId2, 'following:' + userId2);
  }
}
```
先查询出 user 的数据，在 followers 添加 user2，然后 save 保存到数据库。

之后查询下 redis，如果有 followers:userId 的 key，就更新下 followers 和 follow-each-other 集合。

这里 user1 和 user2 的集合都要查询并更新下。

然后在 UserController 里添加下路由：

```javascript
@Get('follow')
async follow(@Query('id1') userId1: string, @Query('id2') userId2: string) {
    await this.userService.follow(+userId1, +userId2);
    return 'done';
}
```
浏览器访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36a9600f47804417b175b7716f7c46bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=990&h=214&s=26300&e=png&b=ffffff)

可以看到，数据库和 redis 都更新了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c1b8185529c4bfeba6ebf39cc7212eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1456&h=806&s=244939&e=png&b=191919)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0312d3a592146e4a4cf4092dbf424f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1508&h=754&s=81248&e=png&b=1b1b1b)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70c7de7fc8784cb5b7ab87a9f47dd463~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1554&h=692&s=80814&e=png&b=1c1c1c)

再次查询下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/140b07a1de3a4e099c5787c07f9de2e6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1078&h=1538&s=129669&e=png&b=fefefe)

这样，相互关注的功能就实现了。

知乎、掘金这种关注关系都是这样实现的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6267eb7098864bc9ad1bd38947d6396b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=646&h=224&s=17183&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a840d5d8c2d441e0a6e624bf718c570e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1390&h=854&s=150292&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f37bcdaf9ee4ad0805b2386d4841768~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1370&h=924&s=226747&e=png&b=ffffff)

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/following)

## 总结

这节我们实现了下关注、被关注、互相关注。

在 mysql 里用中间表来存储 user 和 user 的关系，在 TypeORM 里用 @ManyToMany 映射。

互相关注用 redis 的 Set 来实现，先把 user 的 followers 和 following 存储到集合中。

然后把两个集合的交集求出来放入一个新的集合。

这样就能求出互相关注的关系。

当有新的关注或者取消关注时，除了要更新数据库外，也要顺便更新下 redis。

这样，查询互相关注关系的功能就完成了。
