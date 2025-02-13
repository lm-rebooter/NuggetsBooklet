## 前言
桌面端截图功能是大多数桌面端应用都具备的功能，在 Electron中，实现截图方案一般有两种。

- 一种是通过 Electron 提供的截取屏幕 API [desktopCapturer](https://www.electronjs.org/zh/docs/latest/api/desktop-capturer)，获取每个屏幕（存在外接显示器的情况）和每个窗口的图像信息，传递给浏览器的 [`navigator.mediaDevices.getUserMedia`](https://developer.mozilla.org/en/docs/Web/API/MediaDevices/getUserMedia) API 获取桌面视频的媒体源的信息，在获取到整个屏幕图像后再通过 canvas 标签绘制截图区域。

- 第二种方式是使用操作系统自带的截图功能或者调用三方可执行截图文件（比如 Windows 的 .exe 文件）来实现屏幕的截图。

接下来，我们详细介绍这两种截图方式的实现原理。


## Electron 手动实现截图能力

在介绍实现截图功能前，我们首先需要认识两个 API。

### desktopCapturer API

Electron 中的 `desktopCapturer` 对象是一个用于获取屏幕截图和视频流的 API。它允许你从用户的屏幕上捕获图像，并且可以用于创建截图工具、屏幕录制应用程序等。

这个对象返回了 `Promise<DesktopCapturerSource[]>` 这样一个结果，其中 [DesktopCapturerSource](https://www.electronjs.org/zh/docs/latest/api/structures/desktop-capturer-source) 是一个对象类型的数组，每个 `DesktopCapturerSource` 代表一个屏幕或一个可以被捕获的独立窗口。

### navigator.mediaDevices.getUserMedia
`navigator.mediaDevices.getUserMedia()` 是一个 Web API，允许网页或应用程序访问用户的摄像头和麦克风，以便获取视频流、音频流或者二者的组合。

`getUserMedia()` 的第一个参数是一个对象，用于指定你要访问的每种媒体类型的详细信息和要求。例如，如果你要访问摄像头，第一个参数应为 `{video: true}`。要同时使用麦克风和摄像头，第一个参数为`{video: true, audio: true}`：

```html
<video style="width: 100vw;height: 100vh" autoplay></video>

<script>
  navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
    const video = document.querySelector('video');
    // 为 video 标签添加实时视频流
    video.srcObject = stream;
  
    // 当浏览器已经获取了视频的基本元数据（比如视频的长度、尺寸、帧率等信息），并已准备好开始播放时，这个事件就会被触发。
    video.onloadedmetadata = function(e) {
      // todo
    };
  }).catch((e) => {
    // 异常处理
    console.log('Reeeejected!', e);
  });
</script>
```
通过以上代码，我们就可以实现实时捕捉电脑摄像头的音视频并播放到 `<video>` 标签中。

`getUserMedia()` 的第一个参数还可用于指定对返回的媒体流的更多要求（或限制条件）。例如，你还可以通过 `video.mandatory` 参数指定视频的来源和尺寸：

```js
navigator.mediaDevices.getUserMedia({
  audio: false,
  video: {
    mandatory: {
      // 视频源来自 desktop
      chromeMediaSource: 'desktop',
      // 屏幕 id
      chromeMediaSourceId: id,
      // 指定尺寸
      minWidth: 1280,  
      maxWidth: 1280,  
      minHeight: 720,  
      maxHeight: 720
    }
  }
})
```

### 结合 desktopCapturer 和 getUserMedia
通过以上的介绍，我们大致了解了这两个 API 的用处，下面我们就来详细介绍一下截屏的思路：
1. 首先通过调用 `desktopCapturer` API 来获取所有屏幕信息。
2. 将 `desktopCapturer` 返回结果中的 `sourceId`（一个 window 或者 screen 的唯一标识）传递给 `getUserMedia`，作为 `chromeMediaSourceId` 的约束条件。
3. 调用 `getUserMedia` API 来实时获取桌面屏幕视频流。
4. 获取视频流第一帧的图像进行截图操作。

其中，1-3 比较好实现，我们一起来看一下代码：

```html
<template>
  <video style="width: 100vw;height: 100vh;" />
</template>

<script setup>
import {desktopCapturer, screen} from '@electron/remote';

// 获取屏幕列表
const displays = screen.getAllDisplays();

desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {
  for (const source of sources) {
    // 找到屏幕信息
    const display = displays.filter((d) => +source.display_id === d.id)[0]
    try {
      // 获取屏幕视频流
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id,
            minWidth: display.bounds.width,
            maxWidth: display.bounds.width * display.scaleFactor,
            minHeight: display.bounds.height,
            maxHeight: display.bounds.height * display.scaleFactor
          }
        }
      })
      handleStream(stream)
    } catch (e) {
      handleError(e)
    }
  }
  function handleStream (stream) {
    const video = document.querySelector('video')
    video.srcObject = stream
    // 播放视频流
    video.onloadedmetadata = () => video.play()
  }
  
  function handleError (e) {
    console.log(e)
  }
})
</script>
```

以上代码的作用是获取屏幕信息，使用 `navigator.mediaDevices.getUserMedia` 捕获屏幕视频流，并将视频流显示在 `<video>` 元素中，效果如下：

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a792546232946629b22feefcda131e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1141&h=753&s=855810&e=png&b=e1dad2" alt="image.png"  /></p>

接下来就是第 4 步，要开始截图了，先说一下原理：
1. **窗口层：** 为每个显示器创建一个透明的、全屏的、置顶的 BrwoserWindow 窗口。
2. **图像层：** 然后将 `getUserMedia` 捕捉的图像信息生成图片后传递到 `BrwoserWindow` 窗口中的 `<img>` 标签中，这样就会模拟出一个虚拟桌面。
3. **蒙版层：** 在图片上再覆盖一层灰色透明的蒙版，模拟截图黑屏的效果。
4. **操作层：** 全屏窗口中监听 `mousedown`、`mousemove` 事件，然后通过一个 canvas 动态绘制截图区域，并展示出对应的操作（比如文字标注、区域尺寸）。

以上步骤如果理解起来比较困难，我制作了一个表述层级关系的效果图来帮助你理解：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a08c116dd5bf42a0821d73d2587aca3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1786&h=1156&s=747244&e=png&a=1&b=f1f0f0)

对应到代码实现：

#### 1. 创建透明的、全屏的、置顶的 BrwoserWindow 窗口

```js
// 主进程中
function createWindow() {
  // 获取屏幕数
  let displays = screen.getAllDisplays();
  
  mainWindows = displays.map(display => {
    let winOption = {
      // 全屏
      fullscreen: true,
      width: display.bounds.width,
      height: display.bounds.height,
      // 设置位置
      x: display.bounds.x,
      y: display.bounds.y,
      // 透明无边框
      frame: false,
      transparent: true,
      // 不允许尺寸调整
      movable: false,
      resizable: false,
      hasShadow: false,
      enableLargerThanScreen: true,
      webPreferences: {
        // 允许html中运行nodejs
        nodeIntegration: true,
        sandbox: false,
        webSecurity: false,
        contextIsolation: false,
      }
    }
    
    // 对Windows的基本主题和高对比度主题单独处理，因为它不支持transparent
    if (iswin32) {
      winOption.opacity = 0.0;
    }
    
    let mainWindow = new BrowserWindow(winOption);
    
    // 置顶
    mainWindow.setAlwaysOnTop(true);
    // 加载一个模拟桌面页面
    mainWindow.loadURL(winURL);
    return mainWindow;
  });
}
```

以上代码核心功能就是创建了多个透明的 Electron 窗口，每个窗口对应一个显示器，窗口的大小和位置需要正好覆盖完整个显示器。

#### 2. 生成图像
```js
const ratio = window.devicePixelRatio || 1;
// 获取图像层
const imgDom = doucment.body.getElementById('screenImg');

function handleStream(stream) {
  let video = document.createElement('video');
  
  video.addEventListener('loadedmetadata', () => {
    video.play();
    // 创建canvas
    let canvas = document.createElement('canvas');
    // 高清处理
    canvas.width = currentWidth * ratio;
    canvas.height = currentHeight * ratio;
    canvas.style.width = currentWidth + 'px';
    canvas.style.height = currentWidth + 'px';
    
    let ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio)
    
    // 视频流绘制到 canvas 中
    ctx.drawImage(video, 0, 0, currentWidth, currentHeight);
    video.remove();
    
    // 生成 img base64 格式图像并设置到图像层
    imgDom.src = canvas.toDataURL();
    
    // ...
    
  }, false);
  
  video.srcObject = stream;
  video.style.visibility = 'hidden';
  document.body.appendChild(video);
}
```
这段代码的主要目的是将通过 `getUserMedia` 获取到的屏幕视频流以 `<video>` 的形式加载，然后在 Canvas 中绘制视频帧，并将绘制后的图像以 base64 格式设置到页面的图像层上显示。

#### 3. 模拟截图桌面
```html
<!--蒙版层-->
<div id="mask" class="mask"></div>
<!--操作层-->
<canvas id="canvas" class="canvas"></canvas>
<!--图像层-->
<img id="screenImg" class="screen-img" src="">
```
这里的蒙版层是一个固定定位具有透明度的全屏 `div` 标签：
```css
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 10;
  opacity: .3;
}
```
操作层 `canvas` 默认是隐藏的，需要等到用户触发鼠标动作后动态显示区域大小：
```css
.canvas {
  position: fixed;
  z-index: 30;
  background: #fff;
  display: none;
}
```
图像层是在蒙版层和操作层之间的内容，主要用来加载一个全屏桌面的图片：

```css
.screen-img{
  position: fixed;
  left: 0;
  top: 0;
  opacity: .7;
  z-index: 20;
  cursor: crosshair;
}
```


#### 4. 模拟截图鼠标动作
```js
 document.addEventListener('mousedown', mousedownFun, false);
 document.addEventListener('mousemove', mousemoveFun, false);
 document.addEventListener('mouseup', mouseupFun, false);
 
// 拿 mousemoveFun 举例
mousemoveFun = e => {
 e.stopPropagation();
 e.preventDefault();
 
 // 定义起点坐标
 let nowX = e.clientX;
 let nowY = e.clientY;

 // 边界控制，不允许从一个屏幕滑到另一个屏幕
 if(nowX >= currentWidth) {
  nowX = currentWidth;
 }
 if(nowY >= currentHeight) {
  nowY = currentHeight;
 }
 // 移动canvas
 if (canMove) {
  // 计算移动量
  let left = nowX - moveStartX;
  let top = nowY - moveStartY;

  // 边界控制
  left = limit(left, top, canvasWidth, canvasHeight).left;
  top = limit(left, top, canvasWidth, canvasHeight).top;

  // 显示操作层位置
  canvasDom.style.cssText += 'left: ' + left + 'px; top: ' + top + 'px;';
  // 绘制区域图像
  canvasDomCtx.drawImage(imgDom, -left * ratio, -top * ratio);
 }
}
```
上面代码也很简单，当鼠标 `mousemove` 的时候，动态计算需要截屏的大小，并将区域矩形图片传递给 `canvas` 进行动态绘制，以模拟出截屏的效果：


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b2059f2e579484ca11c48d866ccd7ce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1480&h=958&s=879174&e=png&b=090909" alt="image.png"  /></p>

> 完整代码见：https://github.com/muwoo/desktop-capture-demo

这样，我们就实现了一个“模拟截图的功能”，这个“模拟截图”因为是纯前端绘制，所以最大的优势就是我们可以自定义一些操作层的使用方式，比如画笔、取色、文案绘制……但也会有一些其他问题的产生：

1. 每次截图都需要创建模拟窗口，对于 Electron 而言，创建窗口是需要耗时的。（可以用窗口池解决，提前预先创建窗口，但容易占用不少内存。）
2. Linux 只支持单屏幕截图。由于 Chrome 内核的原因，Linux 系统无法区分多个屏幕，它所有的屏幕 ID 都是 `0:0`。
3. 使用 `Canvas` 绘制的屏幕在高分辨率的显示器中，图片总是会模糊。
4. 使用 `Canavs` 生成图像层的时候，比较耗时，越高分辨率耗时越高。
5. 毕竟是模拟窗口，在 macOS 上，还是可以对窗口进行滑屏操作，体验非常不好。

接下来我们接着介绍另外一种截图实现方式。



## 使用三方能力
使用三方能力是一种取巧的方式，利用的是 Electron 可以通过 `nodejs` 调用 `Shell` 脚本的方式来执行命令行命令。

### MacOS
在 `MacOS` 中，我们调用系统自带的 `screencapture` 命令来实现截图：

```js
import { clipboard, app } from 'electron'
const { execFile, exec } = require('child_process')

// 截图方法mac
export const handleScreenShots = () => {
  // 这里咱们设置-c将截图保存到剪切板上
  exec('screencapture -i -U -c', (error, stdout, stderr) => {
    // 从剪切板上取到图片
    const pngs = clipboard.readImage().toPNG()
    const imgs = 'data:image/png;base64,' + pngs.toString('base64')
    // mainWin是窗口实例，这里是将图片传给渲染进程
    mainWin.webContents.send('captureScreen', imgs)
  })
}
```

`screencapture` 是 macOS 系统中的命令行工具，用于捕获屏幕截图或录制屏幕视频。代码中：
-   `-i`：表示进行交互式捕获，允许你选择捕获的区域。
-   `-U`：指示在捕获之前将屏幕图像缓存刷新，以确保最新的屏幕内容。
-   `-c`：将捕获的屏幕图像复制到剪贴板中，而不是保存为文件。

### Windows
在 `Windows` 中，我们可以通过 `node` 调用一些三方提供的截图应用程序，比如 [ScreenCapture.exe](https://github.com/xland/ScreenCapture)：
```js
// 截图方法windows
export const screenWindow = (cb) => {
  // 内置 ScreenCapture.exe 文件
  const url = path.resolve(__static, 'ScreenCapture.exe');
  const screen_window = execFile(url);
  screen_window.on('exit', (code) => {
    if (code) {
      const image = clipboard.readImage();
      cb && cb(image.isEmpty() ? '' : image.toDataURL());
    }
  });
};
```

效果如下：

<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/186c2a6f413649438dffd56103691ee8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=775&s=426266&e=png&b=fef7d4" alt="image.png"  /></p>

> 注意：我们在打包的时候，注意不要将 `.exe` 文件一起打包到 `.asar` 文件中，需要额外地告诉打包工程在打包的时候需要排除 `.exe` 文件，详细的操作见：[《通用篇：electron 应用打包》](https://juejin.cn/book/7302990019642261567/section/7304842389166751754)。

## 总结

本小节我们详细介绍了 Electron 实现截图的两种方式，一种是通过前端“模拟”截图操作，这种操作最大的优势就是前端可以自定义一些图像操作，但缺点就是性能不佳，体验也不是很好。还有一种就是借助三方能力，虽然解决了性能问题，但是没有办法自定义一些样式和功能。

本小节主要为没有原生开发能力的小伙伴提供了一种折中式的解决方案，如果既想要性能优秀、体验完美、可自定义样式的截图工具，还是需要祭出原生开发的方式。




