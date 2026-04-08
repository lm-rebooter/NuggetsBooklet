### 本资源由 itjc8.com 收集整理
﻿想必大家都打过车，打车软件可以根据你的当前位置搜索附近的车辆：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-1.png)

这两天国庆节，大家出去玩可能会借用共享充电宝。它也是基于你的位置来搜索附近充电宝：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-2.png)

再就是大家搜索附近的酒店、餐厅等，也是基于位置的搜索。

那么问题来了：这种附近的人、附近的酒店、附近的充电宝的功能是怎么实现的呢？

答案是用 Redis 实现的。

很多人对 Redis 的认识停留在它能做缓存，也就是从数据库中查询出来的数据，放到 redis 里，下次直接拿 redis 的数据返回：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-3.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-4.png)

比如大众点评、美团外卖这种，就是用 redis 实现的基于地理位置的功能。

今天我们就来实现一下：

在 RedisInsight 里输入命令，点击执行：

```redis
geoadd loc 13.361389 38.115556 "guangguang" 15.087269 37.502669 "dongdong" 
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-5.png)

我们用 geoadd 命令添加了两个位置。

guangguang 的位置是经度 13.361389，纬度 38.11556

dongdong 的位置是经度 15.08729 ，纬度 37.502669

点击刷新，就可以看到 loc 的 key：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-6.png)

然后可以用 geodist 计算两个位置之间的距离：

```
geodist loc guangguang dongdong
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-7.png)

可以看到相距差不多 166 km

然后用 georadius 分别查找经度 15、纬度 37 位置的附近 100km 半径和 200km 半径的点：

```
georadius loc 15 37 100 km
georadius loc 15 37 200 km
```
结果如下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-8.png)

因为两个点相距 166km，所以搜索 100km 以内的点，只能搜到一个。而 200km 的内的点，能搜到两个。

这样，我们就可以实现搜索附近 1km 的充电宝的功能。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-9.png)

服务端提供一个接口，让充电宝机器上传位置信息，然后把它存到 redis 里。

再提供个搜索的接口，基于传入的位置用 georadius 来搜索附近的充电宝机器，返回客户端。

客户端可以在地图上把这些点画出来。

这里用高德地图或者百度地图都行，他们都支持在地图上绘制 marker 标记的功能：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-10.png)

比如上面我们分别在地图上绘制了 marker 和 circle：

这是添加 Marker 的代码：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-11.png)

指定 marker 的经纬度和图片就行。

这是添加 Circle 的代码：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-12.png)

指定圆心经纬度和半径就行。

都挺简单的。

这样，后端和前端分别怎么实现，我们就都理清了。

接下来用代码实现下。

创建个 nest 项目：

```
npm install g @nestjs/cli

nest new nearby-search
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-13.png)

进入项目目录，把它跑起来：

```
npm run start:dev
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-14.png)

浏览器访问 http://localhost:3000 可以看到 hello world，就代表 nest 服务跑起来了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-15.png)

然后我们安装连接 redis 的包：

```
npm install --save redis
```

创建个 redis 模块和 service：

```
nest g module redis
nest g service redis
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-16.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-17.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-18.png)

/addPos?name=guang&longitude=15&latitude=35

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-19.png)

/addPos?name=dong&longitude=15&latitude=85

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-20.png)

然后去 RedisInsight 里看下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-21.png)

点击刷新，可以看到确实有了 positions 的数据。

然后我们再添加个查询位置列表的接口：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-22.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-23.png)

没啥问题。

在 AppController 添加两个路由：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-24.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-25.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-26.png)

最后，还要提供一个搜索附近的点的接口：

在 RedisService 添加 geoSearch 方法，传入 key，经纬度、搜索半径，返回附近的点：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-27.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-28.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-29.png)

大概 5561 km

在 guang 附近搜索半径 5000km 内的位置：

/nearbySearch?longitude=15&latitude=35&radius=5000

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-30.png)

找到了一个点。

然后搜索半径 6000km 内的位置：

/nearbySearch?longitude=15&latitude=35&radius=6000

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-31.png)

不过现在的经纬度我们是随便给的。

可以用高德地图的坐标拾取工具来取几个位置：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-32.png)

天安门： 116.397444,39.909183

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-33.png)

文化宫科技馆：116.3993,39.908578

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-34.png)

售票处：116.397283,39.90943

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-35.png)

故宫彩扩部：116.398002,39.909175

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-36.png)

把这样 4 个位置添加到系统中：

/addPos?name=天安门&longitude=116.397444&latitude=39.909183

/addPos?name=文化宫科技馆&longitude=116.3993&latitude=39.908578

/addPos?name=售票处&longitude=116.397283&latitude=39.90943

/addPos?name=故宫彩扩部&longitude=116.398002&latitude=39.909175

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-37.png)

先计算下天安门到故宫彩扩部的距离：

```
GEODIST positions 天安门 故宫彩扩部 km
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-38.png)

是 0.0476km

那么我们在天安门的位置搜索 0.04km 内的点，应该搜不到它。

搜索 0.05 km 的点的时候，才能搜到。

试一下：

/nearbySearch?longitude=116.397444&latitude=39.909183&radius=0.04

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-39.png)

/nearbySearch?longitude=116.397444&latitude=39.909183&radius=0.05

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-40.png)

没啥问题，这样我们搜索附近的充电宝的后端功能就完成了。

然后写下前端页面。

在 main.ts 指定 public 目录为静态文件的目录：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-41.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-42.png)

接下来要接入高德地图。

先按照[文档](https://lbs.amap.com/api/javascript-api-v2/getting-started)的步骤获取 key

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-43.png)

这个很简单，填一下信息就好。

点击[创建新应用](https://console.amap.com/dev/key/app)，选择 web 应用，就可以生成 key 了

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-44.png)

然后把文档的 [demo 代码](https://lbs.amap.com/demo/javascript-api-v2/example/map-componets/map-overlays)复制过来：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-45.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-46.png)

接下来引入 axios，来调用服务端接口：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-47.png)
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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-48.png)

然后把 radius 改成 0.05，是这样的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第69章-49.png)

这样就实现了查找附近的充电宝的功能。

代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/nearby-search)
## 总结

我们经常会使用基于位置的功能，比如附近的充电宝、酒店，打车，附近的人等功能。

这些都是基于 redis 实现的，因为 redis 有 geo 的数据结构，可以方便的计算两点的距离，计算某个半径内的点。

前端部分使用地图的 sdk 分别在搜出的点处绘制 marker 就好了。

geo 的底层数据结构是 zset，所以可以使用 zset 的命令。

我们在 Nest 里封装了 geoadd、geopos、zrange、georadius 等 redis 命令。实现了添加点，搜索附近的点的功能。

以后再用这类附近的 xxx 功能，你是否会想起 redis 呢？
