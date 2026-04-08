在 [CSS 选择器的 Level4 （Selectors Level 4）](https://www.w3.org/TR/selectors-4/)中，有一个专门用来匹配当前处于画中画模式的元素的 CSS 伪类 `:picture-in-picture` 。你可以使用它来选择正在显示画中画的视频元素，并为其添加一些样式，例如将播放器控件隐藏、设置画中画窗口的位置和大小、背景色、字体大小、文本对齐方式等。

接下来，我们一起来简单了解一下画中画是什么，可以使用 `:picture-in-picture` 伪类做些什么。

## 画中画简介

视频和图片都是 Web 应用或页面的重要媒介之一，我们可以使用 HTML 的 `<video>` 标签在 Web 应用或页面向用户呈现一个视频。例如：

```HTML
<video autoplay muted playsinline loop src="https://storage.googleapis.com/media-session/caminandes/short.mp4"></video>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1898001a2c0047c9bb8fc45579c466d6~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/xxyWEgv>

你在 Web 中浏览视频的时候，可以选择“画中画”的模式播放视频：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da62ecbceaa740659212706aacd96630~tplv-k3u1fbpfcp-zoom-1.image)

正如上图所示，画中画是一种视频技术，可以在同一个屏幕上同时显示两个视频。其中一个视频通常在主屏幕上，而另一个视频则是较小的子画面，可以显示其他内容。用户可以根据需要调整子画面的位置和大小，以兼顾查看两个视频。

画中画技术相对来说比较实用，经常运用于电视、电影等行业，尤其在多任务处理和同时观看不同角度视频时非常有用。比如在观看体育比赛时，可以在主屏幕上观看比赛，在子画面中观看其他相关播报，更多地了解比赛状况。

最近，许多操作系统和应用程序也开始支持画中画技术，例如在桌面电脑或移动设备上的视频播放器、通话软件或浏览器等，这些应用程序可以让用户同时查看多个窗口或屏幕，以便完成更多任务。

## 画中画（Picture-in-Picture）Web API

时至今日，W3C 规范为 Web 开发者提供了相应的 API，即 **[Picture-In-Picture](https://www.w3.org/TR/picture-in-picture/)** ，简称 **PIP**。该 API 允许网站总是在其他窗口之上创建一个浮动的视频，以便用户在其他内容站点或者设备上的应用程序交互时可以继续播放视频。

换句话说，画中画 API 允许网站创建一块可浮动、可缩放、可拖拽的视频播放区域，该区域永远至于窗口顶层，用户可以在操作其他任务时继续观看视频，大大提升桌面空间利用率与用户时间效率。

除此之外，W3C 规范还提供了一个“文档画中画”，即 **[Document Picture-in-Picture](https://wicg.github.io/document-picture-in-picture/)**，简称 **DPIP**。该 API 允许你打开一个始终置顶的窗口，该窗口可以装入任意 HTML 内容。它扩展了现有的用于 `<video>` 的画中画（PIP）Web API，因为画中画 Web API 只允许你将 HTML 的 `<video>` 元素放入画中画窗口中。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fce20ca328f84c8fba69e915745383a4~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://document-picture-in-picture-api.glitch.me/> （请使用 Chrome 浏览器打开，该 Demo 来源于 《[Picture-in-Picture for any Element, not just ](https://developer.chrome.com/docs/web-platform/document-picture-in-picture/)》一文。）

注意，在文档画中画 API 中，画中画窗口类似于通过 `window.open()` 打开的同源空白窗口，但也有一些差异：

*   画中画窗口浮在其他窗口上面。
*   画中画窗口不会超过打开窗口的寿命而继续存在。
*   画中画窗口无法打开其他窗口。
*   画中画窗口无法被导航。
*   网站无法设置画中画窗口的位置。

不过，在这里我们只简单的聊一下画中画 Web API，如果你对文档画中画 API 感兴趣的话，建议你花时间阅读一下 [@François Beaufort](https://developer.chrome.com/authors/beaufortfrancois/) 发表在 Chrome 开发者平台上的 《[Picture-in-Picture for any Element, not just ](https://developer.chrome.com/docs/web-platform/document-picture-in-picture/)》。

## 如何使用画中画（Picture-In-Picture） Web API

在 W3C 的 Picture-In-Picture 规范中详细介绍了画中画 Web API 应该如何使用，这节课就不详细阐述了，因为已经超出这节课的范畴，但我将以一个简单的实例来告诉大家如何使用画中画 Web API。

首先，在你的 HTML 中要有一个视频元素（`<video>`），一个切换按钮（`<button>`），它们分别用来：

*   `<video>` 用来展示视频；
*   `<button>` ，使用画中画 Web API 替换浏览器中进入画中画模式的默认方法。例如，点击按钮时启用画中画模式。

```HTML
<video autoplay muted playsinline loop src="https://storage.googleapis.com/media-session/caminandes/short.mp4"></video>
<button id="togglePipButton" class="button">进入画中画模式</button>
```

### 进入画中画模式

你要以在视频元素（`<video>`）上调用 `requestPictureInPicture()` ，请求用户代理（比如浏览器）将视频切换为画中画模式。

```JavaScript
const video = document.querySelector('video');
const togglePipButton = document.getElementById('togglePipButton');

togglePipButton.addEventListener('click', () => {
    video.requestPictureInPicture()
})
```

这个时候，你点击按钮，视频就进入了画中画的模式：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7e8416a81ef4fcc8064fe0b567b7a7c~tplv-k3u1fbpfcp-zoom-1.image)

当视频进入画中画模式时，你可以使用画中画的另一个 API ，即给视频元素（`<video>`）绑定一个 `enterpictureinpicture` 事件（画中画的事件）。这样一来，你可以做一些其他的事情。例如，改变按钮的颜色和文本内容：

```JavaScript
video.addEventListener('enterpictureinpicture', () => {
    togglePipButton.textContent = '退出画中画模式';
    togglePipButton.classList.add("button--secondary")
});
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8156165b4ad419cb1acc9adf70db536~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poxLNez>

### 退出画中画模式

当视频进入画中画模式播放的时候，客户端（如浏览器）会提供一个“关闭按钮”，用户可以点击这个“关闭”按钮退出画中画的模式。如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e71090e61a28483293b74ee225a8a4a6~tplv-k3u1fbpfcp-zoom-1.image)

除此之外，还可以提供另一种方式退出画中画模式。例如，点击按钮退出画中画模式。

```JavaScript
const video = document.querySelector('video');
const togglePipButton = document.getElementById('togglePipButton');

togglePipButton.addEventListener('click', () => {
    document.exitPictureInPicture()
})
```

点击按钮时，给文档（`document`）调用一个 `exitPictureInPicture()` 方法，然后退出画中画模式。当然，你可以做得更好些，在调用 `exitPictureInPicture()` 方法时，使用画中画 API 中的另一个 API 做个判断，即 `document.pictureInPictureElement` 。它会告诉你当前在画中画窗口中显示哪个元素。如果为 `null` ，则此文档没有节点处于画中画模式：

```JavaScript
const video = document.querySelector('video');
const togglePipButton = document.getElementById('togglePipButton');

togglePipButton.addEventListener('click', () => {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture() // 退出画中画模式
    } else {
        video.requestPictureInPicture() // 进入画中画模式
    }
})
```

和进入画中画模式相似，你在退出画中画模式时，可以给 `video` 绑定一个 `leavepictureinpicture` 事件，在该事件中做一些你想做的事情：

```JavaScript
video.addEventListener('leavepictureinpicture', () => {
    togglePipButton.textContent = '进入画中画模式';
    togglePipButton.classList.remove("button--secondary")
})
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f164d0aed6a74e37a9c98b11d5dade3b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/eYPMBog>

需要注意的是，`requestPictureInPicture()` 和 `exitPictureInPicture()` 会返回一个 `promise` ，如果视频的元数据尚未加载或视频上存在 `disablePictureInPicture` 属性，那么该 `promise` 可能会拒绝（`reject`）。我们可以添加一个 `catch` 块来捕获这个潜在的错误，并告诉用户发生了什么？例如：

```JavaScript
togglePipButton.addEventListener('click', () => {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(error => {
            // 错误处理
        })
    } else {
        video.requestPictureInPicture().catch(error => {
            // 错误处理
        });
    }
});
```

或者将 `async` 和 `await` 结合起来使用，使你的代码更健壮一些。例如：

```JavaScript
togglePipButton.addEventListener("click", async (event) => {
    try {
        if (video !== document.pictureInPictureElement) {
            await video.requestPictureInPicture();
        } else {
            await document.exitPictureInPicture();
        }
    } finally {
        // ...
    }
});
```

> Demo 地址：<https://codepen.io/airen/full/qBJoLbz>

你还可以使用该技术，将 Web 摄像头视频在画中画显示，这对于视频会议 Web 应用程序非常有用。比如下面这个示例：

```HTML
<button class="button" id="button">Web 摄像头视频在画中画中呈现</button>
```

```JavaScript
const button = document.getElementById("button");

button.addEventListener("click", async () => {
    const video = document.createElement("video");
    video.muted = true;
    video.srcObject = await navigator.mediaDevices.getUserMedia({ 
        video: true 
    });
    video.play();
    video.addEventListener("loadedmetadata", () => {
        video.requestPictureInPicture().catch(console.error);
    });
});
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1610a42dbf2545e39d03e0d316217bef~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWOYeBY>

如果你不想让视频在画中画窗口中弹出，可以为其添加 `disablePictureInPicture` 属性，像这样：

```HTML
<video disablePictureInPicture autoplay muted playsinline loop src="https://storage.googleapis.com/media-session/caminandes/short.mp4"></video>
```

这就是画中画 Web API 的关键部分，如果希望更深入研究，建议阅读 W3C 上有关于画中画 Web API 的相关规范。

## 画中画伪类 :picture-in-picture

我们花了较长的篇幅向大家介绍了画中画相关的概念和 API。有了这个背景之后，我们就可以了解一下 CSS 的画中画伪类，即 `:picture-in-picture` ，它的主要作用是**允许你给视频的画中画添加样式**。

简单地说，当视频以画中画模式播放时，视频的占位符会切换到 `:picture-in-picture` 状态。`:picture-in-picture` 伪类允许你配置样式表，以便视频在画中画或者传统播放模式来回切换时自动调整内容的大小、样式或布局。

它的使用很简单，例如：

```CSS
:picture-in-picture {
    opacity: 0.3;
    filter: blur(5px);
}
```

当视频进入画中画模式时，上面的代码会使原视频元素 `<video>` 变得模糊：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ad5c797e47e4e36a98c8e9b5addfb7b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYgdMqN>

你也可以使用 `:has()` 、`:not()` 等伪类函数与 `:picture-in-picture` 伪类结合起来使用，给视频画中画添加不一样的样式。例如：

```HTML
<div class="video__container">
    <video autoplay muted playsinline loop src="https://storage.googleapis.com/media-session/caminandes/short.mp4"></video>
</div>
```

```CSS
video {
    display: block;
    aspect-ratio: 16 / 9;
    will-change: opacity;
}

video:not([controls]):picture-in-picture {
    opacity: 0;
}

.video__container {
    background-color: rgb(0 0 0 / 0.65);
    position: relative;
    backdrop-filter: blur(20px);
    background-image: 
        linear-gradient(135deg, rgb(0 0 0 / 0.8), rgb(0 0 0 / 0.5)),
        linear-gradient(to right in oklab,oklch(70% 0.5 340) 0%,oklch(90% 0.5 200) 100%),
        linear-gradient(to bottom left in oklab,oklch(55% 0.45 350) 0%,oklch(100% 0.4 95) 100%),
        linear-gradient(to top right in oklab,#fff 0%,#000 0% 20%,#fff 0% 40%,#000 0% 60%,#fff 0% 80%,#000 0% 100%);
    background-blend-mode: multiply, luminosity, exclusion, hard-light;
    background-size: cover, cover, cover, 3rem 3rem;
    border-radius: 6px;
    box-shadow: 0 0 0.2em 0.2em rgb(0 0 0 / 0.15);
}

.video__container:has(video:picture-in-picture)::before {
    content: "视频现在在画中画窗口中播放";
    position: absolute;
    right: 20px;
    bottom: 20px;
    color: #ddd;
    font-size: clamp(1.5rem, 5cqw + 2rem, 2.25rem);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cb68d0437b644fd97a26c65a2b4c180~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/poxLGzY>

## 小结

CSS 画中画伪类 `:picture-in-picture` 和画中画 Web API 是用于实现 Web 页面中画中画效果的技术。

通过使用 `:picture-in-picture` 伪类，开发者可以为网页中正在播放的画中画视频添加自定义样式，使其更加个性化和美观。

而使用画中画 Web API，则可以实现更加丰富和定制化的画中画效果。API 提供了许多方法和属性，包括在画中画模式下调整视频大小和位置、控制画中画窗口的行为等等。

需要注意的是，目前仅有少数浏览器支持这些功能，因此在使用时需要进行兼容性考虑。但是，随着技术的不断发展，这些功能在未来将会得到更广泛的支持，成为网页视频播放体验的重要组成部分。
