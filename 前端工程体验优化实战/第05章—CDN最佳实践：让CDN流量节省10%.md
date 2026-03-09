笔者供职的公司运营着全球互联网访问量前50的网站，CDN每月有数千TB的巨大流量，相应的金钱开销也非常庞大。

但是通过优化CDN配置，切换到`Brotli`压缩算法，流量开销减少了约 10%，资金开销每月就可节省约 6 万元，一年累计更是超过 70 万。

如此高投入产出比的优化，学习了下文介绍的《CDN最佳实践》，只用 3 分钟就能实现，让我们一起学起来吧。

> 注：CDN流量达到上千TB（PB）量级后，每个月的开销就可能有几十万元之巨。
>
> 以AWS的 cloudfront CDN为例，每月 2 PB的流量，预计成本就达到了 14万美元。所以仅仅 10% 的流量节省，也能带来可观的直接收益。
>
> ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/570c618426a9446fa02d96c54b9d0ca2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=624&s=132339&e=png&b=fefefe)

## 1. CDN对体验的影响因素

CDN（内容分发网络 Content delivery network）是前端工程的核心基础设施，是各类静态资源的来源，也是我们优化用户体验的重要目标之一。

从用户体验和开发体验角度看，CDN影响体验的因素主要有 5类：

1. CDN服务器所在地理位置

1. CDN缓存配置

1. CDN域名导致的跨域问题

1. CDN所使用的压缩算法

1. CDN 服务器 HTTP 协议版本


下面我们将一一介绍其上下文信息。

### 1. CDN服务器所在地理位置

服务器地理位置直接影响用户访问CDN服务的延迟和下载CDN上各类资源的耗时，CDN服务器的位置距离用户越近，其下载速度、连接延迟时间等影响体验的指标状况通常也会越好。

大多数成熟的CDN云服务都有负载均衡服务器遍布全球，但往往有不同的定价策略，还需要手动切换、配置。

所以在使用CDN服务时有必要确定我们的前端项目所面向用户的地理位置，基于用户的位置选择CDN服务器的地理位置。

### 2. CDN缓存配置

CDN上的资源一经上传就不再改变，这是CDN服务的特点，也是CDN的标准用法。

对CDN上资源的缓存策略直接决定了用户是否需要**重复下载**同一资源文件，进而影响FCP、LCP等页面加载耗时相关指标，也是影响前端应用用户体验的重要因素。

具体来说，控制CDN缓存主要是通过调整CDN对应域名的 HTTP 请求头、响应头，基于**强缓存**或**协商缓存**来实现。

#### **强缓存**

指缓存生效后，再次加载资源时，**不需要**再次与源服务器通信即可复用的缓存类型。相关HTTP头部有：

1.响应头`Cache-Control`：例如`Cache-Control: public, max-age= 60 48 00`，指定资源缓存是否可以共享、缓存时长等因素。

2.响应头`Expires`：例如：`Expires: Fri, 19 Jan 2024 13:59:47 GMT`，指定资源缓存的到期时间，在这个时间之前，浏览器都不会再次发送HTTP请求下载对应资源，而是直接从本地的缓存中读取。

#### **协商缓存**

指缓存生效后，再次加载资源时，**仍然需要**再次与源服务器通信、协商确认后才可复用的缓存类型。相关HTTP头部有：

1. 成对配套使用的请求头`If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT`和响应头`Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT`：

浏览器会在初次获取到响应头`Last-Modified`后保存下来，再次请求加载资源时作为`If-Modified-Since`的值随HTTP请求发送，服务器端会验证时间，确认所请求资源是否更新后，返回状态码：

*   `304 Not Modified`表示**无需更新**资源。
*   或`200 OK`表示资源**需要更新**为此次响应体的内容。

这一对协商缓存头的主要**缺点**是指定的缓存有效时间精度最小到秒，无法精确到毫秒级别。

2. 成对配套使用的请求头`If-None-Match: "51-47cf7e6ee8400"`和响应头`ETag: "51-47cf7e6ee8400"`：

缓存效果和过程类似上一对协商缓存头部，但不同之处是`If-None-Match`和`ETag`校验缓存是否有效是基于字符串ID是否匹配，而非时间。

CDN一般基于流量付费，往往是云服务中成本最高、开销最大的一项，所以配置积极有效的缓存策略，不仅能节省用户的带宽和流量，还能显著降低CDN的流量开销。

### 3. CDN域名导致的跨域问题

CDN的域名一般不会直接影响用户体验，但是对开发体验、工作效率和问题排查修复却有显著影响，所以也会间接影响用户体验。

具体表现在CDN域名是否满足**同源策略**上，如果CDN的域名与前端应用部署的域名不符合同源策略，那么就需要开发者配置许多复杂、特殊的跨域头，例如：

*   `Access-Control-Allow-Origin:  https://github.com`
*   `Access-Control-Allow-Headers: origin, content-type, accept`
*   `Access-Control-Allow-Methods: GET`
*   `Access-Control-Allow-Credentials: true`
*   ......

这些用于实现**跨域资源共享（CORS）** 的HTTP标头复杂且易错，如果有多个CDN域名，统一管理这些标头更是麻烦甚至痛苦的任务。

对于POST方法等复杂请求，还需要额外支持`OPTIONS`方法的预检请求，对网络带宽、流量资源也有额外的开销。

浏览器平台设置如此多复杂的标头配置，实际上是在表达着一个潜台词：**避免加载跨域资源**。

总之，CDN域名如果跨域，会降低我们的工作效率，对开发体验产生负面影响，影响我们开发工作和服务客户的效率，进而间接损害用户体验。

### 4. 压缩算法

CDN服务一般支持`gzip, deflate, br`等 3 种资源压缩算法，这些算法通常能将资源体积压缩到原体积的 20% 到 30% 左右，效果非常显著。

近几年发布的现代浏览器也都普遍支持`gzip, deflate, br`这三类压缩算法。

其具体逻辑是，浏览器发送HTTP请求时，会根据本地支持的压缩算法类型，生成请求头`Accept-Encoding: gzip, deflate, br`来提醒CDN服务器响应浏览器支持的压缩算法处理过的资源。

CDN服务器会通过响应头`Content-Encoding: br`来标注响应使用的是哪一种算法，`br`即表明服务器响应的静态资源经过了`Brotil`压缩算法处理。

> 注：还有更复杂的压缩算法处理配置，例如指定各类算法的优先级：
>
> `Accept-Encoding: br;q= 1.0,gzip;q= 0.8,*;q=0.1`，
>
> 这个例子表示优先 Brotli 压缩算法，其次选择 Gzip 。最后， `*;q=0.1`表示任何其他压缩方案的也可以作为兜底选项接受。

> 注：CDN服务运营商的压缩功能一般对文件**最大体积**有限制，例如 cloudfront 的CDN仅支持对**体积小于 10MB**的文件进行压缩。
>
> 如果资源体积过大，建议进行代码拆分（详见后文[第7节：《代码分割最佳实践：细粒度代码分割(Granular Code Split)》](https://juejin.cn/book/7306163555449962533/section/7310996946196365346)）之类的处理，以便CDN压缩能顺利生效。

### 5. CDN 服务器 HTTP 协议版本

HTTP 协议是浏览器客户端与服务器通信最常用的协议，在近 30年的发展中，有多个HTTP协议版本，分别支持不同的特性，对用户体验和开发体验有显著影响。下面我们来简单回顾一下HTTP协议各版本的历史和特性。

#### HTTP协议历史

##### 1. HTTP/0.9

> （发明者当时并没有明确版本，后来约定俗成称为0.9版本）

1990年前后，由当时在欧洲核子研究中心工作的前端祖师爷蒂姆伯纳斯李（Tim Berners Lee）提出草案，基于TCP、IP协议实现了HTTP协议。<br/> 0.9版本简单却不简陋，一经发布，就让浏览器和服务器对HTTP协议产生了旺盛的需求，在随后的几年里社区对0.9版本的协议自发地进行了许多修补和增强。 

###### 解决的**痛点**

欧洲核子研究中心内部文档管理混乱，信息交流不便。

###### 新特性

只有GET方法，仅支持传输HTML内容，没有实现HTTP请求头和请求体，HTTP请求只有1行内容：`GET /juniortour.html` <br/> 除了HTTP协议，还一并实现了HTML，主要用于学术交流，仅支持纯文本信息。也正是因为简单好用，HTTP协议迅速在互联网上流行开来，被众多浏览器和服务器接纳。


##### 2. HTTP/1.0
1996年前后，为了强化HTTP协议、解决不同浏览器、服务器之间基于`HTTP/0.9`协议通信靠互相试探的问题，由蒂姆伯纳斯李发起了一份意见征求稿RFC 1945，从众多自发的实践经验中汲取精华，讨论确立了`HTTP/1.0`版本。

###### 解决的痛点
- 0.9版仅支持文本一种类型的信息交流，无法满足日益多样的互联网通信需求。

- 0.9版无状态，导致无法感知成功、失败状态。
> 队头阻塞（HOL blocking）问题：
> 浏览器和服务器通信过程中，因为部分请求长期无响应，导致阻塞后续请求发送和响应接受。
> 
> 例如，浏览器请求一个1MB的JS文件时，如果响应较慢，就会导致后续1KB的CSS文件长时间等待、无法加载。就像我们去火车站排队买票时，排在队头的第一个客户长时间占据窗口，就会导致后续用户等待较长时间。

###### 新特性
 1. 明确了HTTP/1.0的版本，并且规定随请求头发送。<br/> 
 2. 引入请求、响应以及状态码等诸多基础概念；<br/> 
 3. 引入HTTP头的概念，支持传输各类自定义数据，大大强化HTTP协议的灵活性、拓展性；<br/> 
 4. 引入Content-Type响应头，支持图片等更多类型的响应；



##### 3. HTTP/1.1

与1.0版本几乎同时，更正式的规范讨论也在进行，并于1997年发布了意见征求稿：RFC 2068，进一步解决了HTTP协议的诸多痛点。HTTP/1.1版本后续虽有小修小补，但总体上稳定了长达15年之久。

###### 解决的痛点

- 1.0版链接延迟较大：因为队头阻塞（HOL blocking）导致浏览器传输效率受限。
- 1.0版仅支持短连接：每一对请求响应，都必须经历TCP三握四挥的过程，才能通信，开销较大。这也是为什么早年间的网页流行使用精灵图（Sprites）技术，以减少请求数量的原因。

###### 新特性

1. 长连接（Persistent Connection）：支持在一个TCP连接上传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟
2. 通过Host字段，支持虚拟主机，允许多个域名共用同一个IP地址。
3. 新的缓存机制：`Etag, If-None-Match, Cache-Control`等专用头部。 
4. 新增了`OPTIONS, HEAD, PUT, PATCH, DELETE`等一批新的HTTP方法，以及307永久重定向等一批新的HTTP状态码。


##### 4. HTTP/2

2009年前后，为解决HTTP/1.1版本性能，Google实现了名为SPDY的实验性协议。2015年，由Google推动，在SPDY协议的基础上，标准化了HTTP/2协议。 

###### 解决的痛点
十几年过去，HTTP/1.1版本的性能表现日渐落后，急需大幅优化性能。

###### 新特性
 1. 多路复用：<br/>
 - 同域名下所有通信都在单个 TCP 连接上完成，消除了因创建多个 TCP 连接而带来的延时和内存消耗。<br/> 
 - 解决了HTTP层的队列头阻塞问题（但TCP层的队列头阻塞问题仍然存在）。<br/> 
 - 单个连接上可以并行交错的请求和响应，相互之间互不干扰。
> 也是因为这一特性，使后文中我们即将介绍的代码分割最佳实践Granular Code Split成为了可能。<br/> 
2. 服务端推送：

建立链接后，即使还没有收到浏览器的请求，服务器也可以主动把各种类源推送给浏览器。

比如，浏览器只请求了index.html，但是服务器把index.html、style.css、example.png全部发送给浏览器。这样的话，只需要一轮 HTTP 通信，浏览器就得到了全部资源，提高了性能。

不建议一次推送太多资源，这样反而会拖累性能，因为浏览器不得不处理所有推送过来的资源。只推送 CSS 样式表可能是一个比较好的选择。<br/> 

4. 头部压缩：

将有大量重复内容的HTTP请求响应头进行压缩，节省网络流量。<br/> 

5. 全面基于二进制格式传输：

此前的HTTP/1.1版本，头部必须是文本格式，数据体支持文本、二进制两种格式。HTTP/2进一步全面支持二进制格式，以及基于二进制数据分帧，从客户端乱序发送，到服务端再按帧内数据排序组装




##### 4. HTTP/3

2013年，Google 为了进一步优化HTTP协议的性能，加快网页传输，设计并实现了快速UDP互联网连接（Quick UDP Internet Connection，简称`QUIC`） ，为2018年 HTTP/3 的确立奠定了基础。

###### 解决的痛点

HTTP/2连接建立时间较长，因为基于TCP协议，三握四挥的过程开销无法避免。

TCP队头阻塞问题： HTTP/2 运行在单个 TCP 连接上，因此 TCP 层进行丢包检测和重传时可能会阻塞后续数据。

HTTP/2在弱网络环境，尤其是移动互联网场景中性能较差，因为移动设备连接互联网时，往往会时不时切换网络环境，例如从4G切换到WiFi，这种情况下HTTP/2不得不重新创建TCP连接，开销较大。

###### 新特性

1. 基于UDP协议实现：

减少了连接延迟，避免了TCP三握四挥的开销。避免网络环境变化时需要重新连接的问题，优化了移动设备的连接性能。

2. 囊括TLS协议：

更快的实现TLS握手，进一步减少往返时间（Round Trip Time，`RTT`）延迟。


CDN服务器使用的是哪个版本的HTTP协议，可以通过Devtool-Network标签页中的 Protocol（协议）列检查：

> 如果没有这一列，可以右键点击表头，选中添加
> ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e3e644bf7b04b94ba8d2d90632704e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1918&h=918&s=681561&e=png&b=292b2d)

CDN使用的HTTP协议版本，对流量开销、加载耗时等用户体验相关指标，都会有显著优化效果。也是我们优化的主要目标之一。

## 2. CDN配置最佳实践


### 1. 选择临近用户的CDN加速区域

CDN本质上也是一台台服务器，这些服务器距离用户物理距离的远近，对连接延迟、响应速度都有显著影响。

CDN服务供应商大多都在全世界各地部署有节点服务器，用来克服物理距离限制，降低CDN连接延迟，加快CDN的响应速度。例如：

-   [阿里云高性能节点全球分布](https://help.aliyun.com/zh/cdn/product-overview/pop-distribution?spm=a2c4g.11186623.0.0.1c768f68aUtZ82#section-7um-r9w-wvt)
-   [腾讯云境内节点分布](https://cloud.tencent.com/document/product/228/2941#.E5.A2.83.E5.86.85.E8.8A.82.E7.82.B9.E5.88.86.E5.B8.83)

所以选择临近用户的CDN加速区域对于用户体验也至关重要。

国内的CDN供应商，一般提供：

*   中国境内
*   中国境外
*   全球（境内 + 境外）

以腾讯云CDN为例，我们只需要在配置CDN时，选择用户所在的**加速区域**即可，例如：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b83bbec776604d1e9b0310ae67319c70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=707&s=266218&e=png&b=fefefe)

上述配置并不复杂，但难点在于如何确定用户所在地域，从而选择合适的CDN加速区域。

#### 示例：统计用户所在地域数据

如果不知道前端应用的用户分布地域情况，可以使用 [geoip-lite](https://www.npmjs.com/package/geoip-lite) NPM包基于用户请求的IP地址获取用户所在地域，再搭配上文提到的prom-client && Grafana来进行统计和数据可视化。

代码示例：
``` js
// src\get-geo.js
const geoip = require('geoip-lite');
const { useCounter } = require('./prom-client');

/* Return Example: 
{
  "range": [3745513472, 3745517567],
  "country": "CN",
  "region": "JS",
  "eu": " 0",
  "timezone": "Asia/Shanghai",
  "city": "Suzhou",
  "ll": [31.3041, 120.5954],
  "metro":  0,
  "area":  20
}
*/
function getGeoDataFromIP(ip) {
  return geoip.lookup(ip);
}

function userRegionStatistic(ip) {
  const geo = getGeoDataFromIP(ip);
  // console.log(`geo=${JSON.stringify(geo, null,  2)}`);

  if (!geo) {
    // 忽略 ' 12 7. 0. 0. 1'等特殊IP导致的数据为null
    return;
  }

  useCounter({
    name: 'UserRegion',
    help: 'user region data from node.js server',
    labels: {
      country: geo.country,
      city: geo.city,
    },
  });
}

module.exports = {
  userRegionStatistic,
};

// 用法：
// src\app.js
app.post('/counter-metric', function (req, res) {
  const { name, help, labels } = req.body;
  useCounter({ name, help, labels });

  userRegionStatistic(
    req.headers['x-forwarded-for'] || req.socket.remoteAddress
  );
  // ...
}
```

> [geoip-lite](https://www.npmjs.com/package/geoip-lite) 运行时需要加载一个体积较大的数据库，会占据约 100MB 的服务器内存，且有可能导致服务器应用启动变慢。
>
> 作为替代，也可以考虑用内存开销更小，但查询耗时略长的[fast-geoip](https://github.com/onramper/fast-geoip)库，两者API用法几乎一致。

统计用户所在地域，对面向全球用户的产品尤其有用，不仅有助于我们优化CDN配置配置，还可以辅助我们判断用户的来源，进而针对性的满足用户需求。

### 2. 配置最长缓存时间

CDN的最佳用法是文件上传后不再覆盖更新，这样能最大限度的利用CDN的缓存能力。而且CDN往往下载流量较多、较贵，上传流量较少、较便宜。

所以，现代架构的前端应用工程一般利用**文件重命名**的方式来实现版本更新，也就是在静态资源文件名中添加哈希字符串作为版本号，部署上线时更新文件名中的哈希字符串，从而实现版本更新。

例如：

*   01- 01上线版本JS文件名：`bundle.dhj12.js`
*   01- 15上线版本JS文件名更新为：`bundle.i125d.js`

基于这种部署上线方式，我们完全可以把CDN上资源的缓存时间设置为**固定的最大值**，来提高缓存效果，

具体来说，我们可以通过配置强缓存响应头`Cache-Contol`，并将缓存有效期设置为最大值`31536000`，即 365天，来实现这一目标。

例如：知乎CDN域名的就设置成了固定的`Cache-Control: max-age= 31536000`，这也是各大网站常用的基本配置，随处可见。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0b5b6cdeb9a46bab535de825743f77f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=622&s=372370&e=png&b=252629)

各大CDN供应商的管理后台一般都可以修改包括`Cache-Control`在内的各类响应头，可以参考文档：

-   [腾讯云-节点缓存过期配置](https://cloud.tencent.com/document/product/228/47672)
-   [阿里云-配置缓存过期时间](https://help.aliyun.com/zh/cdn/user-guide/add-a-cache-rule)

> 注：后文中我们即将介绍 2 类与CDN缓存密切配合相关优化方案：
>
> * [第6节 超简单的 LazyLoad](https://juejin.cn/book/7306163555449962533/section/7311224369847107624)
> * [代码分割最佳实践：细粒度代码分割(Granular Code Split)](https://juejin.cn/book/7306163555449962533/section/7310996946196365346)
>
> 这 2 节内容，就需要CDN的最长缓存时间配置，从而获得最佳优化效果。

### 3. 让CDN域名符合同源策略

如果你也：

*   苦于无法解决复杂的CORS报错；
*   受够了开发同事频频抱怨CDN资源因为跨域而无法加载；
*   厌倦了反复配置复杂的CORS响应头；

不妨试试把CDN域名改为同源域名，一劳永逸地解决这些痛点。

例如，我们观察YouTube加载的静态资源URL，会发现它的静态资源大都来自于**同源域名** <https://www.youtube.com>下的`/s/`路径，例如：

- <https://www.youtube.com/s/player/f130aa11/player_ias.vflset/zh_CN/inline_preview.js>
- <https://www.youtube.com/s/desktop/ffe751d9/cssbin/www-onepick-2x.css>
- ......


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2d900449a654d9bb27c242936025909~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=636&s=348619&e=png&b=27282b)
而不像其他网站，来自**跨域**的特殊二级域名，例如：
-   static.example.com
-   assets.test.com

YouTube使用这样的**同源CDN域名**作为静态资源路径，就能避免上述配置复杂跨域头的痛苦，这也是Web领域制定同源安全策略，设置如此多复杂标头逻辑的初衷，即：**避免加载跨域资源**。

#### 同源CDN实现方案参考

因为CDN域名同源的实现方案取决于服务器架构，需要具体问题具体分析，所以本节只介绍大致思路，仅供参考。

可以参考的实现思路是，使用**负载均衡**服务，将静态资源所在的同源域名路径的请求，转发到CDN服务，实现CDN域名同源。

例如，云服务供应商的负载均衡服务一般都支持基于**域名**和**URL路径**的灵活转发能力，参考文档：
- 谷歌云CDN + 负载均衡配置：https://cloud.google.com/cdn/docs/http-https-over-same-domain?hl=zh-cn#solution
- 腾讯云负载均衡配置：https://cloud.tencent.com/document/product/214/86948

我们可以利用基于**URL路径**的转发能力，实现把和前端应用所在域名同源的URL路径，例如`/static/*`，配置成静态资源专用路径。

对这个路径发送的静态资源HTTP请求，用负载均衡，转发到CDN服务器获得响应，从而确保CDN使用的是符合同源策略的URL路径域名，不必再配置复杂的CORS跨域资源共享响应头，从根本上规避千奇百怪的跨域报错，优化开发体验。

### 4. 选择先进的`Brotli`压缩算法

CDN支持的各种压缩算法有不同的压缩率，以体积为 1000KB 的源文件为例：

| 项目 \ 压缩算法      | Gzip    | Brotli  | 差异            |
| -------------- | ------- | ------- | ------------- |
| 源文件体积： 1000KB | 239 KB | 208 KB | -31KB（-13%） |

通常来说 Brotli 算法的压缩率比其他 2 种更高，用 Brotli 代替 Gzip 预计可以减少约 10% 的CDN流量开销。

虽然只有 10%，但对于有巨大CDN流量的商业公司，可能就意味着每月数万元甚至更多的开销，这是相当可观的直接收益，投入产出比极高。

此外，Brotli 算法的浏览器兼容性也相当好， 2016年发布的Chrome 50就开始支持Brotli压缩算法。在 2024年的今天，就更不必担心兼容性问题了。

> Brotli 算法浏览器兼容性详情：<https://caniuse.com/?search=Brotli>

如果CDN服务商支持，开启这一压缩算法也非常简单，一般只需要花费几分钟，修改后台配置即可。

CDN压缩算法参考文档：
-   [腾讯云-智能压缩配置](https://cloud.tencent.com/document/product/228/41736)
-   [阿里云-Brotli压缩](https://help.aliyun.com/zh/cdn/user-guide/configure-brotli-compression)

### 5. 使用新版本HTTP协议

如果你的CDN仍然在用**HTTP/1.1**协议，建议尽快升级到**HTTP/2**或**HTTP/3**，对节省流量、改善用户体验都会有显著优化效果。

各大CDN服务商大多都已经支持**HTTP/2**或**HTTP/3，配置即可生效，请参考对应文档：**

-   [阿里云-配置HTTP/2](https://www.alibabacloud.com/help/zh/cdn/user-guide/enable-http-or-2)
-   [阿里云-配置QUIC协议(HTTP/3)](https://www.alibabacloud.com/help/zh/cdn/user-guide/what-is-the-quic-protocol)
-   [腾讯云-配置HTTP/2](https://cloud.tencent.com/document/product/228/41689)
-   [腾讯云-配置QUIC（HTTP3）](https://cloud.tencent.com/document/product/228/51800)
 
如果使用了云服务供应商的CDN服务，想要修改配置，使用新版本HTTP协议，也非常简单，普遍都只需要在管理后台操作即可，

例如：如果使用了云服务供应商的CDN服务，想要修改配置，使用新版本HTTP协议，也非常简单，普遍都只需要在管理后台操作即可，例如：
- **HTTP/2**
    -   [腾讯云-HTTP/2.0 配置](https://cloud.tencent.com/document/product/228/41689)
    -   [阿里云-CDN：配置HTTP/2](https://www.alibabacloud.com/help/zh/cdn/user-guide/enable-http-or-2)

-   **HTTP/3**
    -   [腾讯云-QUIC](https://cloud.tencent.com/document/product/228/51800)
    -   [阿里云-配置QUIC协议](https://help.aliyun.com/zh/cdn/user-guide/configure-the-quic-protocol?spm=a2c4g.11186623.0.0.187935abaqRoRF)
    -   [华为云-QUIC](https://support.huaweicloud.com/usermanual-cdn/cdn_01_0012.html)
