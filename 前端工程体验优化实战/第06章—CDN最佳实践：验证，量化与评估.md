CDN是前端应用的核心基础设施，相关改动应该充分验证，确保稳定性，其优化效果也需要专门指标来量化分析，这一节我们就将一起深入探究验证、量化和评估CDN最佳实践的具体细节。

## 3. 验证，量化与评估

### 1. 上线前验证

#### 1. 验证CDN服务器地理位置和HTTP协议版本的影响

地理位置和HTTP协议版本的变化，对CDN的HTTP连接耗时会有显著影响，可以通过观察CDN静态资源加载时，Devtool Network标签页测量出的初始化连接、SSL握手等计时数据，对比优化前后耗时，来验证优化效果。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4b1cc55ed414aef979e64155eab198e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=653&s=87608&e=webp&b=222427)

> 注：[Google介绍QUIC协议（HTTP/3）的论文](https://link.juejin.cn/?target=https%3A%2F%2Fdl.acm.org%2Fdoi%2Fpdf%2F10.1145%2F3098822.3098842 "https://dl.acm.org/doi/pdf/10.1145/3098822.3098842")有提到，应用QUIC协议后，谷歌搜索加载搜索结果页面的指标 Search Latency 有16.7%的改善：
>
> ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8f3d80033cb4c368bc12026394e0c4d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=594&h=428&s=29530&e=webp&b=fefdfd)

#### 2. 验证CDN缓存时间配置的影响

CDN优化是否生效，可以在上线前通过模拟HTTP请求头、响应头在本地验证。

Chrome Devtool 自113版本开始，新增了[覆盖HTTP响应体、响应头（Override web content and HTTP response headers locally）](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fdevtools%2Foverrides%2F "https://developer.chrome.com/docs/devtools/overrides/")功能，可以帮助我们简单方便地验证CDN缓存时间配置的影响。

具体用法是，在Devtool的Network标签页中选中目标请求，找到对应响应头，鼠标悬浮，就会出现铅笔图标，点击后就可以修改为任意值，并且会在页面刷新后仍然保持生效。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e15effbb0860435cb226c95f8d1600db~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=622&s=136572&e=webp&b=232628)

如果浏览器Devtool不能满足需求，也可以考虑使用[Whistle](https://github.com/avwo/whistle)，[Charles Proxy](https://www.charlesproxy.com/)等能力更全面的专用代理工具，模拟CDN优化后的状态来验证。

#### 3. 验证CDN同源的影响

具体实践中，建议另起一个新的同源域名CDN，充分测试影响后，再逐步替换旧的跨域CDN。

量化评估影响时，可以额外统计对开发体验的影响，例如以下方面：

-   精简了多少行CORS代码、配置；
-   节省了多少次OPTIONS预检请求；
-   解决了多少个开发、生产环境的跨域资源报错；

#### 4. 验证压缩算法的影响

CDN配置修改前，在本地就可以用Node.js自带的`zlib`库验证压缩后效果，示例代码：

```js
/* eslint-disable no-console */
const path = require('path');
const zlib = require('zlib');
const { writeFileSync, readFileSync } = require('fs');

const logFileName = 'localLogFile.js';

function getFileContent(filePath = logFileName) {
  let ret = '';
  try {
    ret = readFileSync(path.join(__dirname, filePath), {
      encoding: 'utf 8',
    });
  } catch (err) {
    console.error(err);
  }
  return ret;
}

function writeFile(content, filePath = logFileName) {
  return writeFileSync(path.join(__dirname, filePath), content);
}

function compress(fileName, type = 'gzip') {
  const str = getFileContent(fileName);
  const bufferData = Buffer.from(str, 'utf- 8');
  const inputSize = Buffer.byteLength(str, 'utf 8');
  console.log(`inputSize=${inputSize}`);

  let result = '';

  if (type === 'br') {
    result = zlib.brotliCompressSync(bufferData);
  } else if (type === 'gzip') {
    result = zlib.gzipSync(bufferData);
  } else if (type === 'deflate') {
    result = zlib.deflateSync(bufferData);
  }

  const outputSize = Buffer.byteLength(result, 'utf 8');
  console.log(`${type} outputSize=${outputSize}\n`);

  writeFile(result, fileName.replace('.js', `.${type}.js`));
}

const inputFilePath = './dist/yourJS.min.js';

compress(inputFilePath, 'gzip');
compress(inputFilePath, 'deflate');
compress(inputFilePath, 'br');
```

这段代码中，我们直接调用Node.js原生的压缩算法API：

-   `brotli`：`zlib.brotliCompressSync(bufferData)`
-   `gzip`：`zlib.gzipSync(bufferData);`
-   `defalte`：`zlib.deflateSync(bufferData);`

对buffer类型的数据进行压缩，并通过`Buffer.byteLength(str, 'utf 8');`API计算体积，来预测压缩后的体积变化，验证优化效果。

经笔者测试，压缩效果数据如下：

|  压缩算法   | 压缩前体积 （单位：byte）   | 压缩后体积 （单位：byte） | 压缩后体积百分比       |
| ------- | ----------------- | --------------- | -------------- |
| gzip    | 示例1: 原体积 1004821  | 124821          | 12%            |
| gzip    | 示例2: 原体积 443093   | 54278           | 12%            |
| gzip    | 示例3: 原体积 28955164 | 5400234         | 18%            |
| deflate | 示例1: 原体积 1004821  | 124809          | 12%            |
| deflate | 示例2: 原体积 443093   | 54266           | 12%            |
| deflate | 示例3: 原体积 28955164 | 5400222         | 18%            |
| br      | 示例1: 原体积 1004821  | 90423           | 8%             |
| br      | 示例2: 原体积 443093   | 16923           | 3%             |
| br      | 示例3: 原体积 28955164 | 3348745         | 11% （运行耗时近30s） |

### 2. 量化与评估

#### 1. CDN流量开销

CDN服务一般基于流量收费，在2023年，下载1GB流量一般收费0.2元左右，上述优化措施中的延长缓存时间，选择最佳压缩算法，都有助于减少流量开销，节省流量花费。

所以我们量化CDN的优化效果时应该优先观察对流量开销的影响。

我们可以利用云服务商提供的后台流量记录或账单，对比优化前后的流量开销，分析优化的效果。

#### 2. CDN**资源加载**耗时指标

为了便于观察CDN优化的效果，我们可以复用在[《第3节 光速入门Performance API》中介绍的**资源加载耗时指标**](https://juejin.cn/book/7306163555449962533/section/7310567914266951695#heading-8)，来量化**CDN域名的连接、加载耗时**，从而评估优化效果。

#### 3. 加载资源总体积指标

我们还可以进一步利用浏览器 Perfomance API 的`transferSize`属性建立**加载资源总体积**指标，上报页面`onload`事件触发时，加载的所有JS，CSS，图片等资源的总体积。

并通过Grafana将数据可视化，以便于我们在优化前后，对比这一指标的变化，来评估优化的效果。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTTP Resource Size Metric</title>
    <link
      rel="prefetch"
      href="https://static.zhihu.com/heifetz/6116.216a26f4.7e059bd26c25b9e701c1.css"
    />
  </head>
  <body>
    <h1>2.3.2.3 加载静态资源总体积指标</h1>
    <h2>
      <a href="https://juejin.cn/post/7274889579076108348">
      《1.4秒到0.4秒-2行代码让JS加载耗时减少67%-《现代前端工程体验优化》-第二章-第一节》
      </a>
    </h2>
    <img
      src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5abdb9a058574c2e84c09883ac65541d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=972&h=550&s=79523&e=png&b=ffffff"
      alt=""
    />

    <script>
      async function reportGauge(name, help, labels, value) {
        await fetch('http://localhost:4001/gauge-metric', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            help,
            labels,
            value,
          }),
        });
      }

      // 定义资源类型的映射关系
      const resourceTypes = {
        document: 'Document',
        script: 'Script',
        link: 'Link',
        stylesheet: 'Stylesheet',
        img: 'Image',
        media: 'Media',
        font: 'Font',
        xhr: 'XHR',
        fetch: 'Fetch',
        other: 'Other',
      };

      function getResourceSize() {
        // 获取所有资源的性能信息
        const resources = performance.getEntriesByType('resource');

        // 统计各类资源的加载体积
        const resourceSizes = {};

        resources.forEach((resource) => {
          const type =
            resourceTypes[resource.initiatorType] || resourceTypes['other'];

          resourceSizes[type] =
            (resourceSizes[type] || 0) + resource.transferSize;
        });

        // 输出加载体积结果
        console.log('资源加载体积统计：');
        for (const type in resourceSizes) {
          // console.log(`${type}: ${resourceSizes[type]} bytes`);

          reportGauge(
            `ResourceSize`,
            `resource size load of ${type} from front-end project`,
            {
              type,
              id: Date.now(),
            },
            resourceSizes[type],
          );
        }
      }

      setTimeout(() => {
        getResourceSize();
      }, 1000); // 可以按需改成项目完全加载的时间点
    </script>
  </body>
</html>
```

上述代码逻辑和《CDN域名连接耗时指标》的实现类似，都由调用Performance API、计算数据、上报数据这3步实现：

1.  调用`performance.getEntriesByType('resource')` API 获取性能记录数据；
1.  遍历检查资源加载的性能记录数据，获取其类型（`type`）、体积（`transferSize`）等数据；
1.  最后将数据，通过`reportGauge(name, help, labels, value)`方法发送HTTP请求到后端数据收集服务；

> 注意：
>
> 对于**跨域资源，**  需要为对应域名加上` Timing-Allow-Origin: https://your-domain.org` 这一专用的HTTP响应头才能正常获取`transferSize`属性，否则其值将始终为 0。

基于这些数据，我们也可以做出一套可视化图表，量化前端项目的**加载资源总体积**：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef72fe39414649fd88d8e2419be64820~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=956&h=357&s=17106&e=webp&b=1a1c20)

<details> 
    <summary>▶点击展开：《加载资源总体积指标》Grafana可视化图表配置源码</summary> 

``` json 
    {
      "datasource": {
        "uid": "grafanacloud-prom",
        "type": "prometheus"
      },
      "fieldConfig": {
        "defaults": {
          "custom": {
            "drawStyle": "line",
            "lineInterpolation": "linear",
            "barAlignment":  0, "lineWidth":  1, "fillOpacity":  0, "gradientMode": "none",
            "spanNulls": false,
            "insertNulls": false,
            "showPoints": "auto",
            "pointSize":  5, "stacking": {
              "mode": "none",
              "group": "A"
            },
            "axisPlacement": "auto",
            "axisLabel": "",
            "axisColorMode": "text",
            "axisBorderShow": false,
            "scaleDistribution": {
              "type": "linear"
            },
            "axisCenteredZero": false,
            "hideFrom": {
              "tooltip": false,
              "viz": false,
              "legend": false
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "color": {
            "mode": "palette-classic"
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value":  80   }
            ]
          },
          "unit": "decbytes"
        },
        "overrides": []
      },
      "gridPos": {
        "h":  8,"w":  12,
        "x":  0,"y": 0
      },
      "id":  24,
      "options": {
        "tooltip": {
          "mode": "multi",
          "sort": "none"
        },
        "legend": {
          "showLegend": true,
          "displayMode": "table",
          "placement": "right",
          "calcs": [
            "lastNotNull"
          ]
        }
      },
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "grafanacloud-prom"
          },
          "disableTextWrap": false,
          "editorMode": "builder",
          "expr": "sum(ResourceSize)",
          "fullMetaSearch": false,
          "includeNullMetadata": true,
          "instant": false,
          "legendFormat": "__auto",
          "range": true,
          "refId": "A",
          "useBackend": false,
          "hide": true
        },
        {
          "datasource": {
            "type": "prometheus",
            "uid": "grafanacloud-prom"
          },
          "disableTextWrap": false,
          "editorMode": "code",
          "expr": "avg(ResourceSize)",
          "fullMetaSearch": false,
          "hide": false,
          "includeNullMetadata": true,
          "instant": false,
          "legendFormat": "__auto",
          "range": true,
          "refId": "B",
          "useBackend": false
        },
        {
          "datasource": {
            "type": "prometheus",
            "uid": "grafanacloud-prom"
          },
          "disableTextWrap": false,
          "editorMode": "code",
          "expr": "min(ResourceSize)",
          "fullMetaSearch": false,
          "hide": false,
          "includeNullMetadata": true,
          "instant": false,
          "legendFormat": "__auto",
          "range": true,
          "refId": "C",
          "useBackend": false
        },
        {
          "datasource": {
            "type": "prometheus",
            "uid": "grafanacloud-prom"
          },
          "disableTextWrap": false,
          "editorMode": "code",
          "expr": "max(ResourceSize)",
          "fullMetaSearch": false,
          "hide": false,
          "includeNullMetadata": true,
          "instant": false,
          "legendFormat": "__auto",
          "range": true,
          "refId": "D",
          "useBackend": false
        }
      ],
      "title": "加载资源总体积 ResourceSize",
      "type": "timeseries"
    }
``` 
</details>

#### 4. 缓存命中率

上述CDN优化，对资源的缓存命中率也有显著优化有益，所以继续观测上一节《资源优先级提示优化》中建立的**缓存命中率指标**，也可以帮我们量化优化效果。

#### 5. TTFB，FCP，LCP，INP等Web Vitals指标

上述CDN优化，提高了静态资源的缓存命中率，对页面的加载耗时，加载资源总体积也有显著影响，所以观察优化前后Web Vitals各项指标的变化，也可以衡量我们优化的效果。

例如：

-   通过使用最新版本的HTTP协议，CDN的连接耗时显著降低，第一字节时间 (Time to First Byte，TTFB)指标就会相应地有所改善。
-   通过为CDN配置压缩率更高的压缩算法，使得用户首次访问前端页面时，加载的JS,CSS等阻碍渲染的资源体积有所减少，那么预期用户首次内容渲染（FCP）应该也会随之有所优化。

## 小结

在《CDN最佳实践》这2节中，我们介绍了CDN影响用户体验和开发体验的 5大因素：

1.  CDN服务器所在地理位置
1.  CDN缓存配置
1.  CDN域名导致的跨域问题
1.  CDN所使用的压缩算法
1.  CDN 服务器 HTTP 协议版本

及其对应的最佳实践建议：

1.  选择临近用户的CDN加速区域
1.  配置最长缓存时间
1.  让CDN域名符合同源策略
1.  选择先进的Brotil压缩算法
1.  使用新版本HTTP协议

最后，针对这些优化方案，验证功能，量化数据和评估效果的细节，提出了各种具体建议。
