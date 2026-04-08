GIF是网络上常见的图片格式，具有**自动播放动态内容**的独特功能，常用于动态表情包或功能演示，在网页中应用广泛。

但是GIF图片也有显著的痛点，主要体现在：

-   体积巨大
-   加载慢
-   帧数低
-   分辨率不高

因此，对GIF图片进行优化的方案应运而生，这其中，经过实践检验，投入产出比最高的就是GIF图片转视频优化。

## 1. GIF、MP4和Webm格式对比

首先，让我们对比一下3种格式的异同，请看这张表格：

| **特性 \ 格式**       | GIF                    | MP4                         | Webm                                          |
| ----------------- | ---------------------- | --------------------------- | --------------------------------------------- |
| 动态内容              | 支持                     | 支持                          | 支持                                            |
| 自动播放              | 支持                     | 支持（仅限静音时）                   | 支持（仅限静音时）                                     |
| 包含音频              | **不**支持                | 支持                          | 支持                                            |
| 体积* 体积变化视文件内容有所波动 | 695 KB (100%)          | 191 KB (27%)                | 88 KB（12%）                                    |
| 浏览器兼容性            | 几乎所有浏览器                | 几乎所有浏览器                     | - Chrome 25+ （2013年发布） <br/>- Safari 16+ （2022年发布） |
| 开始播放时机            | 图片完全加载后， `onload`事件触发时 | 第一帧加载后， `onloadeddata`事件触发时 | 第一帧加载后， `onloadeddata`事件触发时                   |

通过上述对比可以看出，同样是展示动态内容，MP4 和 WebM 等视频格式相较于GIF格式图片有显著优势，主要体现在：

### 1. 视频格式的体积显著小于GIF格式图片：

因为视频格式有**运动估计(Motion Estimation)、预测编码(Predictive Coding)**  等专用的编码优化技术，可以实现`相邻帧优化`，对于视频中相邻的几帧图像，只需要保存帧与帧之间的**部分**差异像素数据，而GIF格式则需要保存每一帧的**所有**像素。

### 2. 视频格式播放开始时间早于GIF格式图片：

视频格式在浏览器中可以利用**HTTP范围请求（HTTP Range 响应头）**  实现`分片加载`，一个视频文件，只需要加载一小部分即可开始播放，同时边播放边下载剩余部分。

但GIF格式的图片，则必须要等待完全加载（触发`onload`事件）才能开始播放，通常要远远慢于视频格式。

总之，MP4 和 WebM 等视频格式的在体积，播放开始时间等各方面都优于GIF格式。

如果我们的前端工程有大量GIF格式的图片，将GIF图片转为MP4和WebM视频格式，既可以节省用户的带宽和CDN流量，也能为前端应用带来更好用户体验。

> 注：[Twitter](http://twitter.com)、[Imgur](https://imgur.com/)、[知乎](https://zhihu.com)等网站都有应用这项GIF转视频优化方案，经过了业界的实践检验。
>
> ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7af13742b9a4faa9b98e2bec2628dfa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=934&s=112506&e=webp&b=2a2a2a)

那么在实践中，如何方便快捷地为前端项目实现 GIF 图片转换视频呢？

## 2. 用 FFmpeg 实现 GIF 图片转视频

`FFmpeg`是广泛使用的开源跨平台音视频处理工具，持续维护了20余年，是开源界的常青树。众多流行的视频剪辑应用、图片裁剪工具、格式转换工具底层都是基于FFmpeg实现的。

其主要使用方式是通过命令行调用，接下来我们首先学习以命令行的形式，使用FFmpeg将GIF图像转换为MP4或WebM视频格式的步骤。

### 1. 下载并安装FFmpeg

我们可以从官方网站（https://ffmpeg.org ）下载安装程序，也可以使用`apt-get`等包管理工具安装：

``` sh
// 示例：Ubuntu 系统使用 apt-get 安装 ffmpeg
sudo apt-get update && sudo apt install ffmpeg

ffmpeg -v
// 输出：ffmpeg version 4.2.7-0ubuntu0.1 Copyright (c) 2000-2022 the FFmpeg developers...
```

### 2. GIF图像转MP4示例

非常简单，只需要2项参数：

-   输入文件路径：`input.GIF`
-   输出文件路径：`output.mp4`

``` sh
ffmpeg -i input.GIF output.mp4
```


此外，我们还可以通过以下参数调整细节：

-   `-crf 10`，CRF即Constant Rate Factor，用于指定视频质量。值的范围视编码器而定，以`x264`编码器为例取值范围是0到51，0表示无损转换，51表示最低质量转换。质量参数也会直接影响产物的体积，值越小，产物质量越高、体积越大。

-   `-c:v`指定使用libvpx编解码器进行视频编码，可选值有：

    -   `libx264`即H.264编码器，默认CRF值为23。
    -   `libx265`即H.265/HEVC编码器，默认CRF值为28。

### 3. GIF图像转Webm示例

``` sh
ffmpeg -i input.GIF output.webm
```

仍然只需要输入文件路径和输出文件路径项2项参数即可。

#### 封装FFMpeg Shell脚本示例

如果需要转换格式的图片来自前端项目内部，可以将上述命令行封装成Shell脚本文件，做为前端项目构建的一个步骤执行。

例如对指定的`dist/images`目录下的所有`.GIF`格式图片，用FFmpeg转换成WebM格式，Shell脚本就可以写成：

``` sh
#!/bin/bash

# 指定要转换的目录和文件类型
dir="./materials"
filetype=".GIF"
for file in "$dir"/*"$filetype"; do
echo "Start process for $file"

# 获取文件名和路径
filename=$(basename "$file")
filepath=$(dirname "$file")
output="${filename%.*}.webm"
output_path="$filepath/$output"

# 使用FFmpeg将 GIF 转换成 WebM 文件
ffmpeg -i "$file" "$output_path"
done
```

但是如果GIF图片来自项目外部，且数量较多，例如**用户上传GIF图片**这一常见场景。

我们又该如何实现GIF转视频这一关键步骤呢？

## 3. GIF转视频后端服务

对于用户上传GIF图片的场景，我们可以考虑新建一个后端服务，用于在用户上传GIF图片时，转换成视频格式文件，供后续使用。

### 1. 新建Node.js服务器应用

首先，我们需要新建一个Node.js服务器应用，用于接收用户上传的GIF图片文件，为了便于前端工程师理解和开发维护，我们仍然选择Node.js && Express 的架构，初始代码很简单：

```js
// index.js
const express = require('express');
const app = express();
const port = 3088;

app.listen(port, () => {
  console.log(`GIF2Video Server listening on http://localhost:${port}`);
});
```

在配置几个package.json脚本命令用于本地环境开发调试，即可开始大展身手了：

```json
"scripts": {
    "start-debug": "node --inspect ./src/index",
    "start": "node ./src/index"
  },
```

这个Node.js服务器的主要功能是2方面：

1.  接收并保存上传的GIF图片到服务器本地
1.  调用FFmpeg将服务器本地的GIF图片转换为视频格式，并消费（例如上传到CDN）

### 2. 接收并保存上传的GIF图片

所以，接下来，让我们实现第一部分功能：接收并保存上传的GIF图片。

我们先用Express的路由，搭建一个上传文件的HTML页面作为测试场地playground，用于测试上传功能：

```js
app.get('/upload-page', (req, res) => {
  res.sendFile(__dirname + '/upload-page.html');
});
```

响应的`upload-page.html`是一个以`FormData`形式调用HTTP接口上传文件的简单页面，代码如下：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>文件上传示例</title>
  </head>
  <body>
    <h1>文件上传</h1>
    <input type="file" id="fileInput" name="file" />
    <button onclick="uploadFile()">上传</button>
    <div>
      <br />
      <a target="_blank" href="https://github.com/JuniorTour/fe-optimization-demo"
        >《现代前端工程体验优化》示例</a
      >
    </div>

    <script>
      function uploadFile() {
        var fileInput = document.getElementById('fileInput');
        var file = fileInput.files[0];

        var formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);
        formData.append('type', file.type);

        fetch('http://localhost:3088/GIF2video', {
          method: 'POST',
          body: formData,
        })
          .then(function (response) {
            if (response.ok) {
              // 请求成功处理逻辑
              return response.text();
            } else {
              // 请求失败处理逻辑
              throw new Error('上传文件失败');
            }
          })
          .then(function (data) {
            console.log(data);
          })
          .catch(function (error) {
            // 错误处理逻辑
            console.error(error);
          });
      }
    </script>
  </body>
</html>
```

其中的上传接口URL：[http://localhost:3088/GIF2video](http://localhost:3088/GIF2video) ，就是我们要新增的另一个后端路由接口：

```js
const multer = require('multer');
const { v4: uuid } = require('uuid');

const upload = multer();

app.post('/GIF2video', upload.single('file'), async (req, res) => {
  console.log(`/GIF2video get formData`);
  const fileId = uuid();
  
  // https://www.npmjs.com/package/multer#file-information
  // startGIF2Video(fileId, req.file);

  res.send({
    msg: 'FormData数据已接收',
    fileId,
  });
});
```

这个接口中，我们使用开源库[multer](https://www.npmjs.com/package/multer)的`upload.single('file')`中间件，来方便地获取随HTTP请求上传的文件数据。

同时使用`uuid`库，生成一个唯一ID供我们关联定位GIF图片及其转换后的视频文件。

最后，我们就要实现核心的转换格式逻辑了。

### 3. 在Node.js平台使用FFmpeg

在Node.js平台调用FFmpeg有很多方式，笔者接下来分享一套基于`fluent-ffmpeg`和`@ffmpeg-installer/ffmpeg`开源库简单方便的实现方案。

安装`@ffmpeg-installer/ffmpeg`NPM包后，会附带下载当前系统对应的FFmpeg运行时到`node_modules`文件夹中。

> 例如 Windows 平台对应FFmpeg的下载路径是：`node_modules@ffmpeg-installer\win32-x64\ffmpeg.exe`

再调用`ffmpeg.setFfmpegPath(ffmpegPath.path)`，就可以将FFmpeg的运行时上下文同步给`fluent-ffmpeg`库供我们后续在JS代码中以链式调用的形式使用FFmpeg。

请看示例代码：

```js
const ffmpegPath = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath.path);

ffmpeg()
  .input(absPath)
  // 其余常用选项示例：
  // .videoCodec('libx264')    
  // .inputFPS(24)
  // .size('320x240')
  .on('stderr', function (stderrLine) {
    console.log('[FFmpeg] ' + stderrLine);
  })
  .on('error', (err) => {
    console.error(err);
    reject(err);
  })
  .on('end', () => {
    console.log(
      `[FFmpeg] Convert end. Time cost: ${Date.now() - startTime} ms`
    );
    resolve();
  })
  .save(path.resolve(outputFilePath, outputFileName));
```

上述代码逻辑，就是`/GIF2video`HTTP接口的核心逻辑，我们加以封装后，就可以实现输入指定路径的GIF文件，输出指定格式的视频文件。

```js
async function runConvertFile(fileId) {
  const GIFData = getGIFFilePath(fileId);
  console.log(`GIFData=${JSON.strinGIFy(GIFData)}`);
  try {
    await convertGIFFileToVideo(GIFData, 'webm');
    await convertGIFFileToVideo(GIFData, 'mp4');
  } catch (error) {
    console.error(`runConvertFile ERROR:`, error);
    return false;
  }
  return true;
}

function afterConvertRenameDir(fileId, convertSuccess) {
  const GIFDirPath = getGIFDir(fileId);
  const newGIFDirPath = GIFDirPath.replace(
    fileId,
    `${
      convertSuccess
        ? CONVERT_STATUS.convertFinish
        : CONVERT_STATUS.convertFailed
    }_${fileId}`
  );
  console.log(`renameGIFDir \nfrom:${GIFDirPath}\nto  :${newGIFDirPath}`);
  fs.renameSync(GIFDirPath, newGIFDirPath);
}

async function startGIF2Video(fileId, file) {
  saveFile(fileId, file);
  const convertSuccess = await runConvertFile(fileId);
  afterConvertRenameDir(fileId, convertSuccess)
  // TODO 上传到 CDN
}
```

最终生成的转换后文件会统一存放在项目根目录下的`/materials/convertFinish_${fileID}`文件夹中，我们可以根据项目的架构决定使用方式，常见的使用方式，可以考虑：

1.  统一上传到CDN上的相同路径，供前端项目方便地转换格式，例如：

 ``` json
-   https://cdn.com/GIF2video/${fileID}/dynamic.GIF
-   https://cdn.com/GIF2video/${fileID}/dynamic.webm
-   https://cdn.com/GIF2video/${fileID}/dynamic.mp4
 ```

1.  提供专用HTTP接口，响应包含GIF和视频对应URL的JSON格式数据，供前端获取GIF及视频资源URL

> GIF2Video 项目 GitHub 仓库：[https://github.com/JuniorTour/GIF2video-node-server](https://github.com/JuniorTour/GIF2video-node-server)

GIF转视频后端服务，为我们提供了`MP4`和`Webm`2种格式作为候选项，我们通过本节开头的对比也了解到，同样的视频内容，Webm的体积一般只有MP4的50%左右，比MP4格式体积更小。

但是Webm格式在Safari浏览器中兼容性较差，2022年发布的Safari 16才完全支持播放Webm视频。再次遇到了兼容性和节省体积不可兼得的问题。

别担心，我们也有解决方案！

## 4. 自适应选择最优视频格式

类似上文第9节介绍的《自适应选择最优**图片**格式》解决方案，浏览器平台的视频资源，也有根据浏览器兼容性自适应加载视频格式的API，请看示例代码：

```html
<video muted autoplay loop playsinline>
  <source src="GIF-demo.webm" type="video/webm">
  <source src="GIF-demo.mp4" type="video/mp4">
</video>
```

这段代码中，首先，我们为Video元素声明了4项属性，用于模仿GIF图片的特性：

-   `muted`：静音播放，是浏览器允许自动播放的前提条件。
-   `autoplay`：加载完成后，自动开始播放。
-   `loop`：循环播放。
-   `playsinline`：用于控制视频是否在行内播放。在移动端 Safari 浏览器上常见视频播放后，自动全屏这一特性，设置`playsinline=true`就会禁用该自动全屏特性。

其次，我们在`video`元素中声明了2个`source`元素，分别设置了MP4和Webm 2种格式的视频作为`src`属性值及`type`属性值。

> **注意：**
>
> 与`<picture>`元素**不同**，`<video>`元素中的`source`使用的是`src`属性，而非`<picture>`中的`srcset`。
>
> `type`属性**相同**，都是格式对应的[MIME类型](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FHTTP%2FBasics_of_HTTP%2FMIME_types%23image_types "https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types")

这样浏览器就能像`<picture>`元素一样，按**从上到下的顺序**解析，根据浏览器自身的兼容性，决定播放某一个兼容格式的`source`元素对应的视频源。

我们将Webm格式**先于**MP4格式声明，从而实现**优先**播放Webm格式视频，减少加载视频文件体积的优化效果。

如果用户的浏览器不支持播放Webm格式，就会忽略其对应的`source`元素，降级到使用下一个MP4格式的视频作为播放源。

这样我们就实现了自适应选择最优视频格式的目标，优先加载体积较小的Webm格式视频，加快内容播放，节省CDN流量开销，兼容性和节省体积一举两得。

## 5. 验证、量化和评估

### 1. 验证

#### 1. 统计用户UA，验证视频格式兼容性

因为Webm格式的视频，在浏览器平台的兼容性一般，所以建议优化上线前，提前统计用户的浏览器版本，系统版本等用户代理信息，用来验证Webm格式上线后的使用量。

推荐使用[ua-parser-js](https://www.npmjs.com/package/ua-parser-js)开源库获取用户代理信息，Gzip压缩后仅有7KB，体积较小，但功能完善，且有千万下载量，维护长达十年，久经考验。

获取用户代理数据示例代码：

```js
import UAParser from 'ua-parser-js';

async function reportCount({ name, labels, help, sampleRate = 1 }) {
  if (Math.random() > sampleRate) {
    return;
  }
  await fetch('http://localhost:4001/counter-metric', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.strinGIFy({
      name,
      help,
      labels,
    }),
  });
}

export function reportUAInfo() {
  const parser = new UAParser();
  const ret = parser.getResult();
  // console.log(`getUAInfo ret=${JSON.strinGIFy(ret)}`);
  reportCount({
    name: 'UAInfo',
    help: 'User Agent Info of fe-optimizaion-demo',
    labels: {
      browser: `${ret.browser.name}_${ret.browser.major}`,
      os: `${ret.os.name}_${ret.os.version}`,
    },
    sampleRate: 0.01,
    // sampleRate: 1,
  });
}
```

上报这些数据到Grafana后，我们就可以创建出多张可视化图表，包括：

-   各浏览器版本访问量（Pege View）
-   各系统版本访问量（Pege View）
-   各浏览器版本占比
-   各系统版本占比

示例图如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c69e33b5b8af4013a73f841bb0cb18a4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1903&h=724&s=56242&e=webp&b=191b1f)

<details> 
    <summary>▶点击展开：《各浏览器版本访问量（Pege View）》Grafana 图表配置JSON</summary> 
    
``` json
{
  "type": "timeseries",
  "title": "各浏览器版本访问量（Pege View）",
  "gridPos": {
    "x": 0,
    "y": 1,
    "w": 12,
    "h": 8
  },
  "datasource": {
    "uid": "grafanacloud-prom",
    "type": "prometheus"
  },
  "id": 41,
  "targets": [
    {
      "datasource": {
        "type": "prometheus",
        "uid": "grafanacloud-prom"
      },
      "refId": "A",
      "expr": "sum by(browser) (increase(UAInfo[$__rate_interval]))",
      "range": true,
      "instant": false,
      "editorMode": "builder",
      "legendFormat": "__auto",
      "useBackend": false,
      "disableTextWrap": false,
      "fullMetaSearch": false,
      "includeNullMetadata": true,
      "format": "time_series"
    }
  ],
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
        "min",
        "max",
        "sum"
      ]
    }
  },
  "fieldConfig": {
    "defaults": {
      "custom": {
        "drawStyle": "line",
        "lineInterpolation": "linear",
        "barAlignment": 0,
        "lineWidth": 1,
        "fillOpacity": 0,
        "gradientMode": "none",
        "spanNulls": false,
        "insertNulls": false,
        "showPoints": "auto",
        "pointSize": 5,
        "stacking": {
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
            "value": null,
            "color": "green"
          },
          {
            "value": 80,
            "color": "red"
          }
        ]
      },
      "unit": "short"
    },
    "overrides": []
  },
  "interval": null
}
``` 
</details>
<details>

<summary>▶点击展开：《各浏览器版本占比》Grafana 图表配置JSON</summary>


```json
{
  "type": "piechart",
  "title": "各浏览器版本占比",
  "gridPos": {
    "x": 12,
    "y": 1,
    "w": 12,
    "h": 8
  },
  "datasource": {
    "uid": "grafanacloud-prom",
    "type": "prometheus"
  },
  "id": 43,
  "targets": [
    {
      "refId": "A",
      "expr": "sum by(browser) (UAInfo)",
      "range": true,
      "instant": false,
      "datasource": {
        "type": "prometheus",
        "uid": "grafanacloud-prom"
      },
      "editorMode": "builder",
      "legendFormat": "__auto",
      "useBackend": false,
      "disableTextWrap": false,
      "fullMetaSearch": false,
      "includeNullMetadata": true
    }
  ],
  "options": {
    "reduceOptions": {
      "values": false,
      "calcs": [
        "sum"
      ],
      "fields": ""
    },
    "pieType": "pie",
    "tooltip": {
      "mode": "single",
      "sort": "none"
    },
    "legend": {
      "showLegend": true,
      "displayMode": "table",
      "placement": "right",
      "values": [
        "percent",
        "value"
      ]
    },
    "displayLabels": [
      "percent",
      "name"
    ]
  },
  "fieldConfig": {
    "defaults": {
      "custom": {
        "hideFrom": {
          "tooltip": false,
          "viz": false,
          "legend": false
        }
      },
      "color": {
        "mode": "palette-classic"
      },
      "mappings": []
    },
    "overrides": []
  }
}
```
</details>


#### 2. 验证GIF转视频后帧数，分辨率，体积变化

优化上线前，推荐先在本地用上文的[GIF2video-node-server](https://github.com/JuniorTour/gif2video-node-server)服务，用多个站内的GIF图文件转换格式后，对比体积，初步验证体积优化效果。

GIF转视频后分辨率，帧数可能都会有所变化，建议大量测试后，充分验证。

如果视觉上有肉眼可见的显著变化，建议检查FFMpeg的参数配置，例如：

1.  `-crf`视频质量：值越小，产物质量越高、体积越大。调整`crf`值，控制转换后的视频质量。例如`-crf 28`，表示将产物视频质量调整到28分（最大最小分值、）。
1.  `-s`视频分辨率：指定产物视频的宽度和高度。例如`-s 1280x720`表示将产物视频调整为1280x720的分辨率。

### 2. 量化

#### 1. 开始播放耗时指标

这一节开头我们学习过3种格式的**开始播放时间时机**不同，

-   GIF图片：在完全加载GIF图片后，`onload`事件触发后，开始播放。
-   视频（MP4和Webm）：第一帧加载后，`onloadeddata`事件触发后，开始播放。

相对来说，视频类开始播放的时间要显著早于GIF图片，因为：

-   视频的完整体积远远小于GIF
-   加载视频第一帧的体积和耗时更是远远小于完全加载GIF图片

这一区别会进一步导致GIF图片开始播放的耗时会比视频更**多**，也就意味着用户看到GIF图片开始播放要等待更长的时间，用户体验更差。

所以，我们可以统计**开始播放时间点**这一数据，作为量化优化效果的方式。

具体来说，就是分别监听GIF的`onload`事件和视频的`onloadeddata`事件，统计其触发耗时，请看示例代码：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>GIF和视频对比加载耗时DEMO</title>
    <style>
      .box {
        width: 450px;
        height: 450px;
        font-size: 60px;
        display: flex;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <h1>GIF Example</h1>
    <h3>
      <a href="https://github.com/JuniorTour/blog/issues/13" 
         target="_blank"
        >《现代前端工程体验优化》DEMO</a>
    </h3>
    <div>
      <button onclick="handleClickLoad('GIF')">加载GIF</button>
      <button onclick="handleClickLoad('mp4')">加载MP4</button>
      <button onclick="handleClickLoad('webm')">加载Webm</button>
    </div>

    <h4>data: <span id="data"></span></h4>

    <div id="player"></div>

    <script>
      async function reportGauge({ name, help, labels, value, sampleRate }) {
        if (Math.random() > sampleRate) {
          return;
        }
        await fetch('http://localhost:4001/gauge-metric', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.strinGIFy({
            name,
            help,
            labels,
            value,
          }),
        });
      }

      const player = document.querySelector('#player');
      function initLoad(loadType) {
        if (loadType === 'GIF') {
          html = `
  <div class="box">
    <img src="https://colinbendell.github.io/webperf/animated-GIF-decode/1.GIF" 
         onload="onLoad('GIF_onload')"/>
    <div>GIF</div>
  </div>
            `;
        } else {
          html = `
  <div class="box">
    <video src="https://colinbendell.github.io/webperf/animated-GIF-decode/1.${loadType}"
           muted autoplay loop 
           onloadeddata="onLoad('${loadType}_onloadeddata')"
           ></video>
    <div>${loadType}</div>
  </div>
            `;
        }
        player.innerHTML = html;
      }

      const query = new URLSearchParams(location.search);
      const loadType = query.get('type');
      initLoad(loadType);

      function handleClickLoad(type) {
        location.search = `type=${type}`;
      }

      // 视频素材：
      // https://colinbendell.github.io/webperf/animated-GIF-decode/1.avif
      // https://colinbendell.github.io/webperf/animated-GIF-decode/1.webm
      // https://colinbendell.github.io/webperf/animated-GIF-decode/1.GIF
      let data = {};
      const ele = document.querySelector('#data');
      function printData() {
        if (ele) {
          ele.innerHTML = JSON.strinGIFy(data, null, 2);
        }
      }

      function onLoad(type) {
        const time = performance.now();
        data[type] = time;
        printData();

        reportGauge(
          {
            name: `GIF2VideoPlayTime`,
            help: `start to play time for GIF2Video optimization`,
            labels: {
              type,
            },
            value: time,
            sampleRate: 1,
          },
        );
      }
    </script>
  </body>
</html>
```

在这段HTML代码中，我们对加载视频的`video`和加载GIF图片的`img`元素分别监听了`onloadeddata`和`onload`事件，并在事件回调`function onLoad(type)`中统计了其触发耗时`const time = performance.now();`，

最后使用`function reportGauge(name, help, labels, value)`，将类型（`type`）和耗时（`time`），通过我们的老朋友数据收集服务的HTTP接口[/gauge-metric](https://github.com/JuniorTour/node-prometheus-grafana-demo)，都上报到了Grafana。

有了这些数据，我们就可以创建一张可视化图表，用于分析对比GIF和视频文件**开始播放耗时指标**的差异，用来帮助我们量化GIF转视频优化的收益。

在具体实践中，推荐在优化上线之前，**预先**上线开始播放耗时指标，统计优化前GIF图片的播放耗时数据。等优化上线后，和之前的GIF数据对比，分析优化效果。

#### 2. GIF图片和视频体积指标

GIF转视频优化的直接收益就是加载体积显著减少，所以量化GIF图片和视频体积指标也必不可少。

推荐在转视频的后端项目中，使用Node.js的`fs`模块，计算并上报体积数据，

```js
function getFileSize(type, files, targetDir) {
  const fileName = files.find((fileNmae) => fileNmae.includes(`.${type}`));
  return fs.statSync(path.resolve(targetDir, fileName)).size; // unit: byte
}

// ...
const GIFFileSize = getFileSize('GIF', files, targetDir);
const webmFileSize = getFileSize('webm', files, targetDir);
const mp4FileSize = getFileSize('mp4', files, targetDir);

reportSizeRatio('Webm', webmFileSize / GIFFileSize);
reportSizeRatio('MP4', mp4FileSize / GIFFileSize);
```

上报数据继续复用我们久经考验的Node.js数据收集服务HTTP接口：[/gauge-metric](https://github.com/JuniorTour/node-prometheus-grafana-demo) 及其封装函数：`function reportGauge() `，上传到Grafana用于制作可视化图表。

> 《GIF2Video feat: 增加体积数据统计》完整代码Commit：<https://github.com/JuniorTour/GIF2video-node-server/commit/cc27be71ac6759e0aeb981bb81dc06f90393910c>)

### 3. 评估

#### 1. 开始播放耗时下降50%

基于我们在GIF转视频优化上线前，提前创建好的Grafana可视化图表：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/662780f1ab794a37bb2a20d68ce02cf9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1356&h=483&s=18262&e=webp&b=181c1f)

在优化上线后，应该能观察到视频的**开始播放耗时**显著低于GIF图片，有50%以上的降幅，具体数据如下：

| 对比项 / 开始播放耗时（单位：毫秒 ms） | 优化前（**仅GIF图片**） | 优化后（**Webm视频**） | 差异               |
| ---------------------- | --------------- | --------------- | ---------------- |
| 平均值                    | 70.9            | 31.9            | -39ms (-55.0%)   |
| 最大值                    | 95.3            | 38.8            | -56.5ms (-59.3%) |
| 最小值                    | 59.5            | 25.8            | -33.7ms (-56.6%) |

#### 2. GIF图片和视频体积比例指标仅20%左右

此外，优化上线后，我们应该能看到 GIF2Video 服务上报的体积比例指标，长期保持在20%左右较低的水平，表示我们的优化让用户加载的资源体积大幅了减少80%，取得了显著的优化收益。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2db97be9158e4ee082493fe68cefdbb8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=948&h=434&s=10558&e=webp&b=191b1f)

## 6. 小结

这一节中，我们首先了解了GIF、MP4和Webm格式的异同。

接下来，为了解决GIF图片格式体积大、加载播放慢的痛点，我们学习了用FFMpeg实现GIF图片转视频的解决方案，以及用Node.js服务器应用实现GIF图片转视频的代码逻辑。

最后，介绍了使用`<video>`和`<source>`元素，自适应选择最优视频格式的细节。
