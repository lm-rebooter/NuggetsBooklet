今天我们来实现一个查询城市天气预报的服务。

使用的是和风天气的免费 api。

免费的接口一天可以请求 1000 次，自己的项目足够用了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd080c15ff9b49579616c43883947447~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1818&h=888&s=183028&e=png&b=ffffff)

最多可以查询未来 7 天的天气预报。

首先，登录[和风天气](https://id.qweather.com/#/login)，

然后在用户中心绑定邮箱和手机号：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4908b91761a407eb62089cf9121d330~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2268&h=1246&s=651917&e=png&b=ffffff)

之后进入[控制台](https://console.qweather.com/#/console)，点击创建项目：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab22d18cf7864dbb93f2b10aa39ec78e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2654&h=892&s=179435&e=png&b=fcfcfc)

这里大家选择免费订阅（我别的项目用了，就没免费名额了），指定 key 的名字：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a135fc697bcf490a9eb83cf995d68782~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1640&h=1438&s=213709&e=png&b=fcfcfc)

然后就可以看到你的 key 了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32199a8ca61a4732a47fb0bc937b6eee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1792&h=974&s=427945&e=gif&f=19&b=fbfbfb)

如果我们要查询青岛未来 7 天的天气。

需要先查询青岛的 id：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2125713b249e46f48dd6c55157543060~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1778&h=1414&s=238721&e=png&b=ffffff)

location 是城市名字的拼音，然后带上刚刚的 key：

```
https://devapi.qweather.com/v7/weather/7d?location=101120606&key=aff40f07926348b9b06f3229d2b52e6a
```
返回了青岛市和各个区的信息。

有了城市 id 之后就可以查询天气了：

```
https://api.qweather.com/v7/weather/7d?location=101120201&key=187d6c3dd15f4d2d99e2a7e0ee08ba04
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5087b11b581944299bc04b42b5b01ddd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1720&h=1324&s=246256&e=png&b=fefefe)

这里返回了从 2024-5-1 到 2024-5-7 的天气。

具体字段的解释可以看[文档](https://dev.qweather.com/docs/api/weather/weather-daily-forecast/#%E8%BF%94%E5%9B%9E%E6%95%B0%E6%8D%AE)：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f4093ff415646fe9c2a3eac82275eec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1758&h=1230&s=265571&e=png&b=ffffff)

这样我们就实现了查询某个城市为了 7 天的天气的功能。

还有个问题，现在是先用城市的拼音查的 id，再用 id 查的天气。

那直接让用户输入城市拼音么？

这样也不好，我们可以用 pinyin 这个包：

它可以拿到中文的拼音：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4175dcffcd46470cacdbbb4adbaca2b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1234&h=656&s=121783&e=png&b=f7f7f7)

这样，整个流程就串起来了。

当然，如果你想让用户直接选择城市，然后查询城市的天气，这种就要拿到所有城市的信息了。

网上有挺多这种 [JSON 数据](https://blog.csdn.net/qq_32353771/article/details/82221604)的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b84fcc5eb6914e4bbf4d0749c16a7cf1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1588&h=1272&s=240917&e=png&b=fbfbfb)

有所有城市名和它的 id。

思路理清了，我们来写下代码：

```
npm install -g @nestjs/cli

nest new city-weather
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/544f4edefd1b44c6ba22d76f94220727~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=848&h=692&s=163005&e=png&b=010101)

安装 pinyin 包和它的类型：

```
npm install --save pinyin@alpha
npm install --save-dev @types/pinyin
```
然后我们加个接口测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bfe31ea79eb40d1bc22cc485484de98~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=662&s=128808&e=png&b=1f1f1f)

```javascript
@Get('pinyin')
pinyin(@Query('text') text: string) {
    return pinyin(text).join('')
}
```

把服务跑起来：

```
npm run start:dev
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd5279865b544614b67613a257cfacc9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1546&h=416&s=132568&e=png&b=181818)

访问下试试：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a96031961c24249b417a3f5ff0265e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=922&h=196&s=30543&e=png&b=ffffff)

可以看到，确实返回了拼音。

但是我们不需要知道是几声。

改下参数：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20c4cc49e3e34e61ac47bf8cf0ade96c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=844&h=584&s=99234&e=png&b=1f1f1f)

这样就好了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f2e0089a1524de78c824c73302e70d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=942&h=194&s=29927&e=png&b=ffffff)

然后 nest 服务里怎么访问三方接口呢？

直接用 axios 么？

可以，但是我们希望统一配置 axios，然后各个模块都用同一个 axios 实例。

所以用 @nestjs/axios 这个包：

```
npm install --save @nestjs/axios axios
```
在 AppModule 引入下 HttpModule：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4666a3c3e36b498d98810ef4954b94c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=852&h=542&s=106442&e=png&b=1f1f1f)

这里可以填入各种请求配置，比如 baseURL 等，其实就是 new 了一个 Axios 实例：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2aa369fd2ce74f198e0e645833c81e9e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=918&h=554&s=118186&e=png&b=1f1f1f)

然后在用到的地方注入 httpService：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2cc81ede47a4555a7cb63c26820d1a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1854&h=688&s=158219&e=png&b=1f1f1f)

```javascript
@Inject(HttpService)
private httpService: HttpService;

@Get('weather/:city')
async weather(@Param('city') city: string) {
  const cityPinyin = pinyin(city, { style: 'normal'}).join('');

  const { data } = await firstValueFrom(
    this.httpService.get(`https://geoapi.qweather.com/v2/city/lookup?location=${cityPinyin}&key=187d6c3dd15f4d2d99e2a7e0ee08ba04`)
  )

  return data;
}
```

用 @Param 取路径中的参数。

然后用 pinyin 拿到 city 的拼音，然后调用和风天气的接口。

这里为啥用 firstValueFrom 的 rxjs 操作符呢？

因为 HttpModule 把 axios 的方法返回值封装成了 rxjs 的 Observerable。

好处是你可以用 rxjs 的操作符了。

坏处是转成 promise 还得加一层 firstValueFrom。

它就是用来把 rxjs Observable 转成 promise 的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9412be39906406188b900d98593dab2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2072&h=630&s=154121&e=png&b=f8f8f8)

测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8590d3492ab4464b94ece31ce7fad104~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1174&h=808&s=115668&e=png&b=ffffff)

没啥问题。

然后继续调用天气预报接口：

```javascript
@Get('weather/:city')
async weather(@Param('city') city: string) {
    const cityPinyin = pinyin(city, { style: 'normal'}).join('');

    const { data } = await firstValueFrom(
      this.httpService.get(`https://geoapi.qweather.com/v2/city/lookup?location=${cityPinyin}&key=187d6c3dd15f4d2d99e2a7e0ee08ba04`)
    )

    const location = data?.['location']?.[0];

    if(!location) {
      throw new BadRequestException('没有对应的城市信息');
    }

    const { data: weatherData } = await firstValueFrom(
      this.httpService.get(`https://api.qweather.com/v7/weather/7d?location=${location.id}&key=187d6c3dd15f4d2d99e2a7e0ee08ba04`)
    )

    return weatherData;
}
```

如果没查到 location，返回 400 错误。

否则用 location.id 查询该城市天气预报。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb9f2cc2764843c6ba3e3f7c74f35814~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=818&h=330&s=42177&e=png&b=ffffff)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c1974d65642442289d5d449ee9df54b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1156&h=1278&s=198301&e=png&b=ffffff)

这样，我们的城市天气预报服务就完成了。

当然，这里最好用 redis 做一层缓存，同一个城市的一天内只查一次，避免接口反复调用。这个大家可以自己去优化。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/city-weather)

## 总结

我们基于和风天气的 api 实现了天气预报查询服务。

主要用到了 pinyin 这个包来完成中文转拼音，然后用 pinyin 去请求和风天气的 api 查询城市 id。

接下来用城市 id 请求天气数据。

和风天气的 api 免费版一天可以调用 1000 次，足够用了。

Nest 里发送 http 请求，我们用的是 @nestjs/axios 包的 HttpModule 来做的。

它可以统一配置，然后注入 HttpService 到用到的地方，并且 httpService 方法的返回值封装成了 rxjs 的 Observerable，可以直接用 rxjs 的操作符。

比如用 fistValueFrom 来把 rxjs 的 Observable 转为 Promise。

这样，你就可以在你的应用中集成天气预报功能了。
