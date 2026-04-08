生活中各种排行榜可太多了。

比如经常有瓜的微博文娱榜：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/895af4664f9c4d408bb3af1a3ad3fe8b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=2400&s=707863&e=jpg&b=fefefe)

掘金的文章榜：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb4f4b0f17c14e8db8c970921d52ed77~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1450&h=1034&s=254377&e=png&b=ffffff)

作者榜：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5cdddd483994ca0b4b30cace85d46ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2010&h=1280&s=446810&e=png&b=ffffff)

微信的步数排行榜：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8faab6319eff4995bef431ba5d648df6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=2400&s=475034&e=jpg&b=f6f5f5)

我最近订的自习室也有学习时长排行榜：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b76913360af465397faa8726871cf14~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=2400&s=446365&e=jpg&b=fcfbfb)

排行的依据各有不同，有的是根据学习时长，有的是根据阅读数、点赞数，有的是根据搜索次数等。

那这些排行榜是怎么实现的呢？

有的同学说，在 mysql 里加一个排序的字段，比如热度，然后根据根据这个字段来排序不就行了？

这样是能完成功能，但是效率太低了。

数据库的读写性能比 Redis 低很多，而且可能这个排序的依据只是一个临时数据，不需要存到数据库里。

一般涉及到排行榜，都是用 Redis 来做，因为它有一个专为排行榜准备的数据结构：有序集合 ZSET。

它有这些命令：

**ZADD**：往集合中添加成员

**ZREM**：从集合中删除成员

**ZCARD**：集合中的成员个数

**ZSCORE**：某个成员的分数

**ZINCRBY**：增加某个成员的分数

**ZRANK**：成员在集合中的排名

**ZRANGE**：打印某个范围内的成员

**ZRANGESTORE**：某个范围内的成员，放入新集合

**ZCOUNT**：集合中分数在某个返回的成员个数

**ZDIFF**：打印两个集合的差集

**ZDIFFSTORE**：两个集合的差集，放入新集合

**ZINTER**：打印两个集合的交集

**ZINTERSTORE**：两个集合的交集，放入新集合

**ZINTERCARD**：两个集合的交集的成员个数

**ZUNION**：打印两个集合的并集

**ZUNIONSTORE**：两个集合的并集，放回新集合

我们依次来试一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a956d7f9f434c3aa3a97ac728539a7f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1886&h=408&s=78708&e=png&b=121212)

```redis
ZADD set1 1 mem1 2 mem2 3 mem3
```

在 RedisInsight 里输入命令，点击执行。

点击刷新就可以看到这个集合：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07c822cc10144c0d829d63a7851d6194~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2112&h=486&s=97806&e=png&b=121212)

三个成员，分数分别是 1、2、3

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8ad9d771a03471baaed48004c7e22cb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1758&h=760&s=72686&e=png&b=1a1a1a)

用命令看的话就是 ZRANGE：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8360e1995a34411b9f78b42470e25221~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1396&h=636&s=47921&e=png&b=121212)

```
ZRANGE set1 0 -1
```

范围从 0 到 -1 就是返回全部。

默认是分数从小到大排序，也可以从大到小，加个 REV 就行：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c2274688df24252b6f1af2fa6e6d34d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=640&h=604&s=32033&e=png&b=111111)

```
ZRANGE set1 0 -1 REV
```
还可以用 ZRANGESTORE 把它存入新集合：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dee4156d2a21452f9df5000b0cd5b3d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=814&h=542&s=33577&e=png&b=131313)

```
ZRANGESTORE rangeset set1 0 -1
```

查看下新集合：

```
ZRANGE rangeset 0 -1
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50ecf49386114801aeab23920d74d6ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=652&h=588&s=29240&e=png&b=111111)

删除个成员试试：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00cabb70cf4646b5a47fa4b4f13c1713~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=546&h=526&s=21630&e=png&b=141414)

```
ZREM set1 mem1
```
再查看下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33f92801ae5b494e8128597c1c062d26~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=590&h=566&s=25035&e=png&b=111111)

```
ZRANGE set1 0 -1
```

用 ZCARD 查看集合的成员个数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a98952d1ed5497d832f7504ae104b89~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=530&h=540&s=22247&e=png&b=141414)

```
ZCARD set1
```
用 ZSCORE 查看某个成员的分数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62a0fcae34644e75a0e9b885b350d3eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=586&h=526&s=22440&e=png&b=131313)

用 ZRANK 查看成员在集合内的排名：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8bc518809ac41f2870f4bdacfc8be32~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=596&h=518&s=23513&e=png&b=121212)

```
ZRANK set1 mem2
```

然后用 ZINCRBY 给成员增加分数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72d32e595e9749439810722b7388aa9b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=568&h=532&s=21346&e=png&b=121212)
```
ZINCRBY set1 3 mem2
```
看下新排名：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8f8bf78ef574f449938869d196d3fbd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=662&h=554&s=26498&e=png&b=101010)

```
ZRANGE set1 0 -1
```

mem2 就到下面去了。

再创建一个集合 set2：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/307e9040f5ca4b1089e0eaf8defbdd0e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=598&h=530&s=27282&e=png&b=131313)

```
ZADD set2 4 aaa 6 bbb
```
用 ZUNION 合并下：

```
ZUNION 2 set1 set2
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0127cdaf4fe2489bad1ec981effefe98~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=576&h=630&s=31858&e=png&b=101010)

还可以加上分数一起：
```
ZUNION 2 set1 set2 WITHSCORES
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02c6bbc5651e417cb43ad35c9ca256ce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=832&h=762&s=46886&e=png&b=0c0c0c)

或者把合并后放到另一个集合：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc9243e2262e486b8c45f2d210f7de5d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=712&h=520&s=30388&e=png&b=121212)

```
ZUNIONSTORE set3 2 set1 set2
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/842a9bdc20f341579da82c5bb894aca5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=558&h=610&s=31416&e=png&b=0f0f0f)

```
ZRANGE set3 0 -1
```
交集和差集的命令也差不多，就不一个个试了。

并集合并的时候相同的 key 的 score 会求和。

```
ZADD s1 1 aa 2 bb

ZADD s2 1 aa 3 cc

ZUNIONSTORE s3 2 s1 s2
```

在 s1 和 s2 集合中都有 aa，合并到 s3 之后 aa 的分数也合并了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67681baa9fc24e1f8d7384da1ddf636a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1508&h=710&s=65434&e=png&b=1b1b1b)

周榜、月榜、年榜就是这么实现的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b76913360af465397faa8726871cf14~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=2400&s=446365&e=jpg&b=fcfbfb)

月榜就是对周榜的合并，然后年榜就是月榜的合并，最后就会算出一个新的排行榜。

我们用 Nest 实现下类似的排行榜功能：

```
nest new ranking-list-test
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd50fea9c1484a23b5bfd18e0ceda0a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=914&h=698&s=162505&e=png&b=010101)

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

    async zRankingList(key: string, start: number = 0, end: number = -1) {
        const keys = await this.redisClient.zRange(key, start, end, {
            REV: true
        });
        const rankingList = {};
        for(let i = 0; i< keys.length; i++){
            rankingList[keys[i]] = await this.zScore(key, keys[i]);
        }
        return rankingList;
    }

    async zAdd(key: string, members: Record<string, number>) {
        const mems = [];
        for(let key in members) {
            mems.push({
                value: key,
                score: members[key]
            });        
        }
        return  await this.redisClient.zAdd(key, mems);
    }

    async zScore(key: string, member: string) {
        return  await this.redisClient.zScore(key, member);
    }

    async zRank(key: string, member: string) {
        return  await this.redisClient.zRank(key, member);
    }

    async zIncr(key: string, member: string, increment: number) {
        return  await this.redisClient.zIncrBy(key, increment, member)
    }

    async zUnion(newKey: string, keys: string[]) {
        if(!keys.length) {
            return []
        };
        if(keys.length === 1) {
            return this.zRankingList(keys[0]);
        }

        await this.redisClient.zUnionStore(newKey, keys);

        return this.zRankingList(newKey);
    }

    async keys(pattern: string) {
        return this.redisClient.keys(pattern);    
    }
}
```
这里我们对 zset 的命令进行了封装，比如 zRange 只会返回成员名，我们顺带把分数也取出来。

暴露 zAdd、zScore、zRank、zIncr 等方法。

zUnion 要做下边界的处理，如果只传了一个 set 的名字，就染回这个 set 的内容，否则才合并。

创建一个 ranking 模块：

```
nest g module ranking
nest g controller ranking --no-spec
nest g service ranking --no-spec
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca093838eec144deaf478aefe1bd3739~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1032&h=280&s=75766&e=png&b=191919)

我们就实现下自习室学习时长的月榜和年榜吧。

实现下 RankingService：

```javascript
import { RedisService } from './../redis/redis.service';
import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

@Injectable()
export class RankingService {

    @Inject(RedisService)
    redisService: RedisService;

    private getMonthKey() {
        const dateStr = dayjs().format('YYYY-MM');
        return `learning-ranking-month:${dateStr}`;
    }

    private getYearKey() {
        const dateStr = dayjs().format('YYYY');
        return `learning-ranking-year:${dateStr}`;
    }

    async join(name: string) {
        await this.redisService.zAdd(this.getMonthKey(), { [name]: 0 });
    }

    async addLearnTime(name:string, time: number) {
        await this.redisService.zIncr(this.getMonthKey(), name, time);
    }

    async getMonthRanking() {
        return this.redisService.zRankingList(this.getMonthKey(), 0, 10);
    }

    async getYearRanking() {
        const dateStr = dayjs().format('YYYY');
        const keys = await this.redisService.keys(`learning-ranking-month:${dateStr}-*`);

        return this.redisService.zUnion(this.getYearKey(), keys);
    }
}
```
这里用到了 dayjs，安装下：

```
npm install --save dayjs
```

月份的榜单是 learning-ranking-mongth:2024-01、learning-ranking-mongth:2024-02 这样的格式。

年份的榜单是 learning-ranking-mongth:2023、learning-ranking-mongth:2024 这样的格式。

我们用 dayjs 拿到当前的年份和月份，拼接出需要的 key。

年份的榜单就是拿到用 learning-ranking-month:当前年份- 开头的所有 zset，做下合并。

在 RankingController 加一下接口：

```javascript
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {

    @Inject(RankingService)
    rankingService: RankingService;

    @Get('join')
    async join(@Query('name') name: string) {
        await this.rankingService.join(name);
        return 'success';
    }

    @Get('learn')
    async addLearnTime(@Query('name') name:string, @Query('time') time: string) {
        await this.rankingService.addLearnTime(name, parseFloat(time));
        return 'success';
    }

    @Get('monthRanking')
    async getMonthRanking() {
        return this.rankingService.getMonthRanking();
    }

    @Get('yearRanking')
    async getYearRanking() {
        return this.rankingService.getYearRanking();
    }   
}
```
join 是加入自习室，learn 是增加学习时长，monthRanking 和 yearRanking 是拿到月榜和年榜。

把服务跑起来：

```
npm run start:dev
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/beeb51e757d2420d842b38e470f7cc00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1626&h=526&s=243473&e=png&b=181818)

在 postman 里调用下：

```
localhost:3000/ranking/join?name=guang
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a97a74e8b1c3472b81243d6a13bc7f42~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=798&h=486&s=49735&e=png&b=fbfbfb)

```
localhost:3000/ranking/join?name=dong
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a5d5407bae542538e1fe82e33395044~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=834&h=508&s=50805&e=png&b=fbfbfb)
```
localhost:3000/ranking/join?name=xiaohong
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/447497049a044e03b4ad7e5fec13106d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=818&h=482&s=50845&e=png&b=fafafa)

调用 join 接口，加入三个同学。

看下现在的月榜：

```
localhost:3000/ranking/monthRanking
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b853d2f94b640a6a1b99e9210ee5e31~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=854&h=604&s=61985&e=png&b=fcfcfc)

在 RedisInsight 里看下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cae0e1e536243f58f5f4816ac97871c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=394&s=41369&e=png&b=181818)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c42317043a44a31813ee265ce01a395~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1398&h=716&s=75205&e=png&b=1b1b1b)

然后调用 learn 接口，增加学习时长：

```
localhost:3000/ranking/learn?name=dong&time=1
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42fe163b497e4e87a962ef59f104b020~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=930&h=530&s=52054&e=png&b=fcfcfc)

```
localhost:3000/ranking/learn?name=guang&time=2
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7a00ff1c3174b5eb8b6b8ad416ad5df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=828&h=512&s=50445&e=png&b=fbfbfb)

```
localhost:3000/ranking/learn?name=xiaohong&time=5
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd04544984174f71931f4f2e2c8c54d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=904&h=502&s=51566&e=png&b=fbfbfb)

```
localhost:3000/ranking/monthRanking
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2893cc2eab34c2cbde9bf6c6b080d21~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=874&h=610&s=58590&e=png&b=fcfcfc)

我们改下本地时间（mac 和 windows 改本地时间的方式不一样）：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71cc6666159d46d9a29733893a030bfd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=972&h=714&s=81104&e=png&b=f1edea)

然后再调用 join 接口：

```
localhost:3000/ranking/join?name=guang
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a97a74e8b1c3472b81243d6a13bc7f42~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=798&h=486&s=49735&e=png&b=fbfbfb)

```
localhost:3000/ranking/join?name=dong
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a5d5407bae542538e1fe82e33395044~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=834&h=508&s=50805&e=png&b=fbfbfb)
```
localhost:3000/ranking/join?name=xiaogang
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a465751d23d04e29b65f8e2213e55a99~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=768&h=492&s=49518&e=png&b=fcfcfc)

之后增加学习时长：


```
localhost:3000/ranking/learn?name=dong&time=2
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/196cbe861cd3404e8ea4e6e3f612cf03~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=874&h=478&s=50637&e=png&b=fbfbfb)

```
localhost:3000/ranking/learn?name=guang&time=3
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee692a502a5d4675b5fc17af21a257e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=876&h=494&s=50919&e=png&b=fbfbfb)
```
localhost:3000/ranking/learn?name=xiaogang&time=4
```

然后看下 3 月份的月榜：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/461d946832254886900f83491b3bbd1b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=858&h=502&s=51092&e=png&b=fbfbfb)

还有年榜：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e6b7c7751974570b23f4c8f5427e8c9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=780&h=658&s=60070&e=png&b=fcfcfc)

可以看到，年榜是合并了所有月榜的结果。

在 RedisInsight 里看下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2d7c497ada84c29920bdb0529789b40~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=598&s=71311&e=png&b=191919)

每个月榜和年榜都是单独的 zset。

这样我们就实现了学习时长的排行榜。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b76913360af465397faa8726871cf14~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=2400&s=446365&e=jpg&b=fcfbfb)

至于用户自己的排名和时长，就用 zScore、zRank 来实现。

也就是这个我的排名功能：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/388f457677374ca3aa86bdc156ae64c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=922&h=564&s=540511&e=png&b=374b6a)

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/ranking-list-test)

## 总结

生活中我们经常会见到各种排行榜，以及它们的周榜、月榜、年榜等。

这些排行榜的功能都是用 redis 的 zset 有序集合实现的。

它保存的值都有一个分数，会自动排序。

多个集合之间可以求并集、交集、差集。

通过并集的方式就能实现月榜合并成年榜的功能。

以后见到各种排行榜，你会不会想到 Redis 的 zset 呢？
