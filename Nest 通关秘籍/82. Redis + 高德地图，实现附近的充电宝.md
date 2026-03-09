想必大家都打过车，打车软件可以根据你的当前位置搜索附近的车辆：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cc1b4c36782437a8dfdcd6495161e30~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=696&h=924&s=462559&e=png&b=f7f2ee)

这两天国庆节，大家出去玩可能会借用共享充电宝。它也是基于你的位置来搜索附近充电宝：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/162332a323994cd0adc59478b4524747~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=1414&s=485485&e=jpg&b=f7f5f2)

再就是大家搜索附近的酒店、餐厅等，也是基于位置的搜索。

那么问题来了：这种附近的人、附近的酒店、附近的充电宝的功能是怎么实现的呢？

答案是用 Redis 实现的。

很多人对 Redis 的认识停留在它能做缓存，也就是从数据库中查询出来的数据，放到 redis 里，下次直接拿 redis 的数据返回：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55f331ce98fe4a00a7cbcdfce9b1e1ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=582&h=532&s=25021&e=png&b=ffffff)

确实，缓存是 redis 的常见应用。

但它并不只是可以做缓存，很多临时的数据，比如验证码、token 等，都可以放到 redis 里。

redis 是 key-value 的数据库，value 有很多种类型：

- **string**： 可以存数字、字符串，比如存验证码就是这种类型
- **hash**：存一个 map 的结构，比如文章的点赞数、收藏数、阅读量，就可以用 hash 存
- **set**：存去重后的集合数据，支持交集、并集等计算，常用来实现关注关系，比如可以用交集取出互相关注的用户
- **zset**：排序的集合，可以指定一个分数，按照分数排序。我们每天看的文章热榜、微博热榜等各种排行榜，都是 zset 做的
- **list**：存列表数据
- **geo**：存地理位置，支持地理位置之间的距离计算、按照半径搜索附近的位置

其中，geo 的数据结构，就可以用来实现附近的人等功能。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e010dc001c742ee998f14e3b4f988f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1096&h=438&s=111789&e=png&b=fefefe)

比如大众点评、美团外卖这种，就是用 redis 实现的基于地理位置的功能。

今天我们就来实现一下：

在 RedisInsight 里输入命令，点击执行：

```redis
geoadd loc 13.361389 38.115556 "guangguang" 15.087269 37.502669 "dongdong" 
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/682a25f128d44b2f8b34196a1d774499~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1882&h=536&s=111119&e=png&b=141414)

我们用 geoadd 命令添加了两个位置。

guangguang 的位置是经度 13.361389，纬度 38.11556

dongdong 的位置是经度 15.08729 ，纬度 37.502669

点击刷新，就可以看到 loc 的 key：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f653c454fac34e618576ea33c9e4a5b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1448&h=650&s=88500&e=png&b=181818)

然后可以用 geodist 计算两个位置之间的距离：

```
geodist loc guangguang dongdong
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e02e4b19c5e4a2fae164a35701b2912~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=488&h=162&s=15606&e=png&b=222535)

可以看到相距差不多 166 km

然后用 georadius 分别查找经度 15、纬度 37 位置的附近 100km 半径和 200km 半径的点：

```
georadius loc 15 37 100 km
georadius loc 15 37 200 km
```
结果如下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a259b3ff0314f5386c66eb5abc5b65d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=440&h=368&s=27172&e=png&b=020202)

因为两个点相距 166km，所以搜索 100km 以内的点，只能搜到一个。而 200km 的内的点，能搜到两个。

这样，我们就可以实现搜索附近 1km 的充电宝的功能。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff90584ad1994d4d8aa43c3a23ed94cd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=1414&s=979580&e=png&b=f7f5f1)

服务端提供一个接口，让充电宝机器上传位置信息，然后把它存到 redis 里。

再提供个搜索的接口，基于传入的位置用 georadius 来搜索附近的充电宝机器，返回客户端。

客户端可以在地图上把这些点画出来。

这里用高德地图或者百度地图都行，他们都支持在地图上绘制 marker 标记的功能：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50accb5e2298400bb92f97bab49cb5ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1636&h=1226&s=3894495&e=gif&f=44&b=f5eee3)

比如上面我们分别在地图上绘制了 marker 和 circle：

这是添加 Marker 的代码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf7986d1420f40cd9da90d72a2c11614~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=678&s=115472&e=png&b=ffffff)

指定 marker 的经纬度和图片就行。

这是添加 Circle 的代码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f877c980ae7343c3a04a5f69f5f4c047~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=780&s=156708&e=png&b=ffffff)

指定圆心经纬度和半径就行。

都挺简单的。

这样，后端和前端分别怎么实现，我们就都理清了。

接下来用代码实现下。

创建个 nest 项目：

```
npm install g @nestjs/cli

nest new nearby-search
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b92de697f7c9479980b928e675a01f46~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=760&s=287965&e=png&b=010101)

进入项目目录，把它跑起来：

```
npm run start:dev
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2eb33e14ce0644748607f503bd30dd29~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1560&h=350&s=112251&e=png&b=181818)

浏览器访问 http://localhost:3000 可以看到 hello world，就代表 nest 服务跑起来了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3a81755e0f646658bd5a08d2e97bd98~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=564&h=202&s=16433&e=png&b=ffffff)

然后我们安装连接 redis 的包：

```
npm install --save redis
```

创建个 redis 模块和 service：

```
nest g module redis
nest g service redis
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eaf36dbe385544309bc35de23c2a45a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=722&h=196&e=webp&b=1f1f1f)

在 RedisModule 创建连接 redis 的 provider，导出 RedisService：

```javascript
import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

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

然后在 RedisService 里注入 REDIS_CLIENT，并封装一些操作 redis 的方法：

```javascript
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

    @Inject('REDIS_CLIENT') 
    private redisClient: RedisClientType;

    async geoAdd(key: string, posName: string, posLoc: [number, number]) {
        return await this.redisClient.geoAdd(key, {
            longitude: posLoc[0],
            latitude: posLoc[1],
            member: posName
        })
    }
}
```
我们先添加了一个 geoAdd 的方法，传入 key 和位置信息，底层调用 redis 的 geoadd 来添加数据。

在 AppController 里注入 RedisService，然后添加一个路由：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c748eec3bc424829ae279c62629dd86d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1396&h=1080&s=245118&e=png&b=1f1f1f)

添加 addPos 的 get 请求的路由，传入 name、longitude、latitude，调用 redisService添加位置信息。

```javascript
import { BadRequestException, Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(RedisService)
  private redisService: RedisService;

  @Get('addPos')
  async addPos(
    @Query('name') posName: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number
  ) {
    if(!posName || !longitude || !latitude) {
      throw new BadRequestException('位置信息不全');
    }
    try {
      await this.redisService.geoAdd('positions', posName, [longitude, latitude]);
    } catch(e) {
      throw new BadRequestException(e.message);
    }
    return {
      message: '添加成功',
      statusCode: 200
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```
测试下：

/addPos?name=guang

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6f12110e3294c50b2e68b50c20b55ef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=886&h=230&s=33422&e=png&b=fcfcfc)

/addPos?name=guang&longitude=15&latitude=35

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a93b4b67a4d340b1b5dbce4eb653150b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1214&h=234&s=37494&e=png&b=fcfcfc)

/addPos?name=dong&longitude=15&latitude=85

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b2eb8b9b4f74d5b999135180d251627~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1180&h=190&s=35916&e=png&b=fbfbfb)

然后去 RedisInsight 里看下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e114cfd7b084284b9f4baee1009746a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2472&h=742&s=140318&e=png&b=1c1c1c)

点击刷新，可以看到确实有了 positions 的数据。

然后我们再添加个查询位置列表的接口：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5da22b8a12a24f9b87473b8614366517~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1204&h=1124&s=219532&e=png&b=1f1f1f)

```javascript
async geoPos(key: string, posName: string) {
    const res = await this.redisClient.geoPos(key, posName);

    return {
        name: posName,
        longitude: res[0].longitude,
        latitude: res[0].latitude
    }
}

async geoList(key: string) {
    const positions = await this.redisClient.zRange(key, 0, -1);

    const list = [];
    for(let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        const res = await this.geoPos(key, pos);
        list.push(res);
    }
    return list;
}
```
因为 geo 信息底层使用 zset 存储的，所以查询所有的 key 使用 zrange。

zset 是有序列表，列表项会有一个分数，zrange 是返回某个分数段的 key，传入 0、-1 就是返回所有的。

然后再用 geoPos 拿到它对应的位置信息。

我们先在 RedisInsight 测试下这两个命令：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d204e7129f734932b9b87422691d74d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=534&h=390&s=34803&e=png&b=010101)

没啥问题。

在 AppController 添加两个路由：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce2f5fb88bc14082a01539fd9f4c0c74~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=822&s=151436&e=png&b=202020)

```javascript
@Get('allPos')
async allPos() {
    return this.redisService.geoList('positions');
}

@Get('pos')
async pos(@Query('name') name: string) {
    return this.redisService.geoPos('positions', name);
}
```

访问下试试：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d80c0bb3369475a88eebbb21df8b8f1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=764&h=308&s=38044&e=png&b=fdfdfd)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ca48e0678864b64b80f3192d15f2073~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=624&h=436&s=48980&e=png&b=fdfdfd)

最后，还要提供一个搜索附近的点的接口：

在 RedisService 添加 geoSearch 方法，传入 key，经纬度、搜索半径，返回附近的点：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a638bcdcc37d49bf9c717c86e0ec6b5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1200&h=750&s=139520&e=png&b=1f1f1f)

这里单位用的 km。

```javascript
async geoSearch(key: string, pos: [number, number], radius: number) {
    const positions = await this.redisClient.geoRadius(key, {
        longitude: pos[0],
        latitude: pos[1]
    }, radius, 'km');

    const list = [];
    for(let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        const res = await this.geoPos(key, pos);
        list.push(res);
    }
    return list;
}
```
先用 geoRadius 搜索半径内的点，然后再用 geoPos 拿到点的经纬度返回。

在 AppController 添加 nearbySearch 接口：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03a99a13b3594c589818f9dec3329eaa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1394&h=814&s=183689&e=png&b=1f1f1f)

```javascript
@Get('nearbySearch')
async nearbySearch(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('radius') radius: number
) {
    if(!longitude || !latitude) {
      throw new BadRequestException('缺少位置信息');
    }
    if(!radius) {
      throw new BadRequestException('缺少搜索半径');
    }

    return this.redisService.geoSearch('positions', [longitude, latitude], radius);
}
```

首先我们在 RedisInsight 里算下两点的距离：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3c061264dd14b9287f3b5b7cf1d8f2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=684&h=442&s=31930&e=png&b=0e0e0e)

大概 5561 km

在 guang 附近搜索半径 5000km 内的位置：

/nearbySearch?longitude=15&latitude=35&radius=5000

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f6ac88afcb34c3586635f29a1f3187f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1250&h=344&s=49400&e=png&b=fdfdfd)

找到了一个点。

然后搜索半径 6000km 内的位置：

/nearbySearch?longitude=15&latitude=35&radius=6000

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a45cf75b41544bdfa537a6ee02e3364a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1252&h=446&s=67371&e=png&b=fcfcfc)

不过现在的经纬度我们是随便给的。

可以用高德地图的坐标拾取工具来取几个位置：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd406c9760e24e12ab78450ac5a9630e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2316&h=1390&s=513513&e=png&b=f1ebd2)

天安门： 116.397444,39.909183

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcfec6d97f254cb1a574b52610a5a3a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1530&h=796&s=240197&e=png&b=e4ebc0)

文化宫科技馆：116.3993,39.908578

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4155cd3d110f421a96227f7b98c8742d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1462&h=670&s=154219&e=png&b=e8ecc4)

售票处：116.397283,39.90943

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea18ac14e76a40efbd86d85800d69612~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1230&h=748&s=163260&e=png&b=e4ebc1)

故宫彩扩部：116.398002,39.909175

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dca4d64e6774277835632f2842f597d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1272&h=758&s=171813&e=png&b=e6ecc2)

把这样 4 个位置添加到系统中：

/addPos?name=天安门&longitude=116.397444&latitude=39.909183

/addPos?name=文化宫科技馆&longitude=116.3993&latitude=39.908578

/addPos?name=售票处&longitude=116.397283&latitude=39.90943

/addPos?name=故宫彩扩部&longitude=116.398002&latitude=39.909175

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/335950667b4b49a9b5cebbb5e910646e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1480&h=200&s=43493&e=png&b=fcfcfc)

先计算下天安门到故宫彩扩部的距离：

```
GEODIST positions 天安门 故宫彩扩部 km
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e9c32db99ae43a597e398e3b5c02ca8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=772&h=442&s=35420&e=png&b=0f0f0f)

是 0.0476km

那么我们在天安门的位置搜索 0.04km 内的点，应该搜不到它。

搜索 0.05 km 的点的时候，才能搜到。

试一下：

/nearbySearch?longitude=116.397444&latitude=39.909183&radius=0.04

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97a07d29baa54e68a92473888e921935~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1496&h=568&s=89712&e=png&b=fefefe)

/nearbySearch?longitude=116.397444&latitude=39.909183&radius=0.05

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c39141f291c45758c09ba655f8320fc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1516&h=674&s=116630&e=png&b=fefefe)

没啥问题，这样我们搜索附近的充电宝的后端功能就完成了。

然后写下前端页面。

在 main.ts 指定 public 目录为静态文件的目录：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f58898faa46436887d0ba68230c8a49~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1212&h=502&s=113981&e=png&b=1f1f1f)

```javascript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('public');

  await app.listen(3000);
}
bootstrap();
```
然后创建 public/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    光光光
</body>
</html>
```
访问下看看：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d94267c266948a9a60ef3126813091f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=550&h=164&s=15408&e=png&b=ffffff)

接下来要接入高德地图。

先按照[文档](https://lbs.amap.com/api/javascript-api-v2/getting-started)的步骤获取 key

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9309773ea1294e8caad93a28821e1b0a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2322&h=790&s=251333&e=png&b=fefefe)

这个很简单，填一下信息就好。

点击[创建新应用](https://console.amap.com/dev/key/app)，选择 web 应用，就可以生成 key 了

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8facc24e999347cc9eb9357f3b88f9a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2326&h=468&s=99448&e=png&b=fcfcfc)

然后把文档的 [demo 代码](https://lbs.amap.com/demo/javascript-api-v2/example/map-componets/map-overlays)复制过来：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d4a2c8d922e4a1c917db9ca543da97f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2814&h=1408&s=816652&e=png&b=f9eeec)

改成这样：

```html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <title>附近的充电宝</title>
  <link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css" />
    <script src="https://cache.amap.com/lbs/static/es5.min.js"></script>
    <script type="text/javascript" src="https://cache.amap.com/lbs/static/addToolbar.js"></script>
    <style>
        html,
        body,
        #container {
          width: 100%;
          height: 100%;
        }
    </style>
</head>
<body>
<div id="container"></div>
<script src="https://webapi.amap.com/maps?v=2.0&key=f96fa52474cedb7477302d4163b3aa09"></script>
<script>
var map = new AMap.Map('container', {
    resizeEnable: true,
    zoom: 6,
    center: [116.397444, 39.909183]
});

var marker = new AMap.Marker({
    icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
    position: [116.399327,39.908562],
    anchor:'bottom-center'
});

var circle = new AMap.Circle({
    center: new AMap.LngLat(116.397444, 39.909183), // 圆心位置
    radius: 50,
    strokeColor: "#F33",  //线颜色
    strokeOpacity: 1,  //线透明度
    strokeWeight: 3,  //线粗细度
    fillColor: "#ee2200",  //填充颜色
    fillOpacity: 0.35 //填充透明度
});

map.add(marker);
map.add(circle);

map.setFitView();

</script>
</body>
</html>
```
在天安门画了一个 circle，然后在文化宫科技馆画了一个 marker：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67157c4f02dd413fad750239e3a17dc2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1028&h=568&s=151672&e=png&b=e4eecb)

接下来引入 axios，来调用服务端接口：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc1d4f26b8454ece90d20733a7b64d53~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1344&h=956&s=184709&e=png&b=1f1f1f)
```html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <title>附近的充电宝</title>
  <link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css" />
    <script src="https://cache.amap.com/lbs/static/es5.min.js"></script>
    <script type="text/javascript" src="https://cache.amap.com/lbs/static/addToolbar.js"></script>
    <style>
        html,
        body,
        #container {
          width: 100%;
          height: 100%;
        }
        
        label {
            width: 55px;
            height: 26px;
            line-height: 26px;
            margin-bottom: 0;
        }
        button.btn {
            width: 80px;
        }
    </style>
</head>
<body>
<div id="container"></div>
<script src="https://webapi.amap.com/maps?v=2.0&key=f96fa52474cedb7477302d4163b3aa09"></script>
<script src="https://unpkg.com/axios@1.5.1/dist/axios.min.js"></script>
<script>

    const radius = 0.2;

    axios.get('/nearbySearch', {
        params: {
            longitude: 116.397444,
            latitude: 39.909183,
            radius
        }
    }).then(res => {
        const data = res.data;

        var map = new AMap.Map('container', {
            resizeEnable: true,
            zoom: 6,
            center: [116.397444, 39.909183]
        });

        data.forEach(item => {
            var marker = new AMap.Marker({
                icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: [item.longitude, item.latitude],
                anchor: 'bottom-center'
            });
            map.add(marker);
        });


        var circle = new AMap.Circle({
            center: new AMap.LngLat(116.397444, 39.909183), // 圆心位置
            radius: radius * 1000,
            strokeColor: "#F33",  //线颜色
            strokeOpacity: 1,  //线透明度
            strokeWeight: 3,  //线粗细度
            fillColor: "#ee2200",  //填充颜色
            fillOpacity: 0.35 //填充透明度
        });

        map.add(circle);
        map.setFitView();
    })
        
</script>
</body>
</html>
```
效果是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7857bdf3275f4f549619dae6cfb5d1f3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1518&h=1148&s=518801&e=png&b=e9eecb)

然后把 radius 改成 0.05，是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/498e4b77aee8419fb8d10b3d06a4861a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1042&h=576&s=156421&e=png&b=e6eecd)

这样就实现了查找附近的充电宝的功能。

代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/nearby-search)
## 总结

我们经常会使用基于位置的功能，比如附近的充电宝、酒店，打车，附近的人等功能。

这些都是基于 redis 实现的，因为 redis 有 geo 的数据结构，可以方便的计算两点的距离，计算某个半径内的点。

前端部分使用地图的 sdk 分别在搜出的点处绘制 marker 就好了。

geo 的底层数据结构是 zset，所以可以使用 zset 的命令。

我们在 Nest 里封装了 geoadd、geopos、zrange、georadius 等 redis 命令。实现了添加点，搜索附近的点的功能。

以后再用这类附近的 xxx 功能，你是否会想起 redis 呢？
