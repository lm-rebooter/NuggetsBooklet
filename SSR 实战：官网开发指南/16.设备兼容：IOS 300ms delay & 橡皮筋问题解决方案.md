> 仓库地址： https://github.com/czm1290433700/nextjs-demo
>
> 本节课程效果查看依赖 mac 环境，windows 环境的 chrome 没办法完全模拟橡皮筋等效果，windows系统的同学可以安装虚拟机或是直接查看录屏 gif

上节课我们学习了针对低网速场景，怎么对高分辨率图进行首屏优化，我们使用了 webp 的方式优化了静态资源的加载，对低网速下的首屏场景进行了优化。与首屏优化同样常见的，还有 IOS 的兼容场景。

移动端的 Web 应用用户有不少的比例是 IOS 相关设备，IOS 与安卓的规则和标准不尽相同，我们需要对这些场景进行兼容。这一节课我们就 IOS 最常见的 300ms delay 和橡皮筋问题来一起探讨一下解决的方案。

## 300 ms delay

我们平时的开发中，事件的触发大部分都是立刻响应，但是在 IOS 中，移动端的触摸事件会有 300ms 的延迟。使用过 IOS 的同学应该知道，IOS 浏览器有一个特点，可以通过双击来对屏幕页面进行缩放，这是导致 300ms 延迟的核心原因。因为当一个用户点击链接后，浏览器没办法判定用户是想双击缩放，还是进行点击事件触发，所以 IOS Safari 会统一等待 300ms，来判断用户是否会再次点击屏幕。

#### Meta 禁用缩放

**这个是我比较推荐的方案**，因为 300ms 延迟的初衷是为了解决点击和缩放没办法区分的问题，针对不需要缩放的页面，我们可以通过禁用缩放来解决。事实上，大部分移动端页面都是可以避免缩放的，通过交互等样式的兼容即可。

```
// ./pages/_app.tsx
// head加这两行即可
// ...
< meta name="viewport" content="user-scalable=no" >
< meta name="viewport" content="initial-scale=1,maximum-scale=1" > 
```

#### 更改视口尺寸

[Chrome 32 版本](https://codereview.chromium.org/18850005/) 中 Chrome 浏览器对包含 width=device-width 或者比 viewport 更小的页面禁用双击缩放，我们只需要加上下面的 meta 头，就可以在 IOS 中的 chrome 浏览器解决 300ms delay 的问题，这个方案的好处是，并不会完全禁用缩放。但是 IOS 默认的 Safari 浏览器没有支持这个能力，所以我们可以加上这个 meta 头来兼容视口尺寸，但并不作为这个的解决方案。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3e9bc977ea94a079de29240919f2897~tplv-k3u1fbpfcp-watermark.image?)

```
<meta name="viewport" content="width=device-width">
```

#### Touch-action

在 [W3C 草案](https://w3c.github.io/pointerevents/) 中，有提出一个 touch-action css 属性，通过设置 `touch-action: none`可以移除目标元素的 300ms delay，如果这个日后可以被主流浏览器支持，我更推荐大家用这种方式针对区域进行灵活的限制。

#### fastclick

这是一个老牌的解决 300ms 延迟的轻量 JS 库，可以通过 npm 安装，且使用方式简单。

```
window.addEventListener(
    'load',
    () => {
      FastClick.attach(document.body);
    },
    false
  );
```

这个依赖我也有试用过，但是我觉得并不是一个好的方案，不建议大家使用 fastclick 的方式解决这个问题，有几个原因：

-   对 TS 兼容性太差，fastclick 基于 JS ，虽然有 ts for fastclick 的依赖，但是不被原作者认可，并且类型定义存在问题，直接引入依赖存在问题，需要自行进入模块定义中修改，具体可参照 https://www.codenong.com/cs106613514/ 。

<!---->

-   包体过大，且包八年没再维护。

<!---->

-   不能直接用于 SSR ，里面有直接用到 BOM ，在服务器端渲染的时候会有相关报错，没找到比较好的插件可以兼容这个问题。

对 fastclick 感兴趣的同学可以下来试试，最终还是建议大家采用 meta 禁用缩放的方式，兼容性和效果相对是比较理想的。

## 橡皮筋问题

> IOS上，当页面滚动到顶部或底部仍可向下或向上拖拽，并伴随一个弹性的效果。该效果被称为“rubber band”——橡皮筋，十分贴切。

IOS 和安卓不同，即使页面没有设置滚动，仍然可以拉扯，给人一种橡皮筋的感觉，如果是 Mac 系统的同学，可以打开 Chrome 模拟查看我们的页面，可以看到下面的效果。



![dd956d94-6971-43af-8848-9ab4fdaa2297.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06767f47b965460085620ab0ec89e395~tplv-k3u1fbpfcp-watermark.image?)

那么怎么去解决这个问题呢？我们来讨论一下。

#### overflow 给定宽高 / 禁用 touchmove 事件

大家如果尝试搜索橡皮筋的解决方案，会发现很多文章都会采用下面这两种方案去解决。但是，这两种方案是完全不可取的，会完全禁用掉下滑的滚动，对即使有滚动的页面也会影响到原有的滚动。

```
html, body {
  width: 100%;
  height: 100%;
  overflow: hidden；
}
```

```
document.body.addEventListener('touchmove', function (e) {
    e.preventDefault() 
  }, {passive: false}) 
```

#### 监听滚动禁用

这是我之前开发时候想到的比较 hack 的方案，IOS 橡皮筋的原理还是通过滚动，只不过与安卓不同的是，当到边界状态时，仍允许滚动，如果我们替 IOS 禁用边界的情况，理论上就可以实现对橡皮筋效果的禁用。针对上述思路，我曾经有实现如下 hook。

```
import { useEffect } from 'react';


export const useForbidIosScroll = (): void => {
  let startEvent: TouchEvent;


  const cancelEvent = (e: TouchEvent): void => {
    // 有个瑕疵就是，如果是大惯性的那种滚动，浏览器该事件并不接受你禁用当前正在执行的动作
    // 导致如果猛地滑动会出页面边界
    if (e.cancelable) {
      e.preventDefault();
    }
  };


  const checkScroll = (e: TouchEvent): void => {
    const startY = Number(startEvent?.touches[0].pageY);
    const endY = Number(e?.touches[0].pageY);


    // 下滑且滑动到底
    if (startY > endY && window.scrollY + window.innerHeight >= document.body.scrollHeight) {
      cancelEvent(e);
    }


    // 上滑且滑动到顶
    if (startY < endY && window.scrollY <= 0) {
      cancelEvent(e);
    }
  };


  useEffect(() => {
    const start = (e: TouchEvent): void => {
      startEvent = e;
    };
    const end = (e: TouchEvent): void => {
      checkScroll(e);
    };
    window.addEventListener('touchstart', start);
    window.addEventListener('touchmove', end, { passive: false });
    return (): void => {
      window.removeEventListener('touchstart', start);
      window.removeEventListener('touchmove', end);
    };
  }, []);
};
```

这个效果其实并不是很理想，即使脚本已经走到我们中断的逻辑，滚动的行为在到达边界的时候仍然不会中止。感兴趣的同学可以 cancelEvent 方法中加一个 debugger 断点验证。

> The scroll event cannot be canceled. ( scroll 事件无法取消。) But you can do it by canceling these interaction events

到谷歌浏览器开发者文档里可以查看到，浏览器的事件其实分为两种，cancelable（可暂停）和uncancelable（不可暂停），能够通过阻止默认事件的和阻止冒泡的都是可暂停的事件，滚动事件和鼠标滚轮事件，在触发的瞬间，就已经决定了要滚动到终点再停止，你只能暂停可能会影响滚动的前提的**导线事件**，我们这个场景下，滚动事件就已经是起源的操作，不存在间接触发，所以不行。

#### 最终方案

有一个很简单的方案，并且可以完美解决[14 | 自定义组件: 如何实现一个动画弹窗组件？](https://bytedance.feishu.cn/docx/doxcnO1Ab9phKQaZiRHh63h2frg)中提到的滚动栏丢失的问题，我们给 body 进行隐藏，然后对根节点设置 100 页宽的高度，**将外部 body 的滚动移动到页面内，这样外界的滚动相关的问题都会解决**，因为我们页面采用的实际是内部滚动。

```
// ./pages/global.scss
.forbidScroll {
  height: 100vh;
  overflow: hidden;
}
body {
  //...
  overflow: hidden;
}

#__next {
  height: 100vh;
  overflow: auto;
}
```

大家可以看看改后的效果，发现橡皮筋的功能已经禁用了，大家可以再把之前解决弹窗的那部分代码移除，问题应该同样解决了，因为我们现在页面采用的是页面内部 div 的滚动，外部 body 的滚动相关的问题也随之解决。

![Screen-Recording-2022-08-27-at-4.05.26-PM.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f42b62f70054799a41e0a77d22fa8c5~tplv-k3u1fbpfcp-watermark.image?)
## 小结

这节课我们学习了 IOS 300ms delay 和橡皮筋问题的缘由和解决方案，我们对比了几种不同的方案，通过 meta 解决了 300ms delay，以及移除外部滚动，改用页面内滚动的方式解决了橡皮筋问题，并且我们还得到了一个意外的收获，之前在[14 | 自定义组件: 如何实现一个动画弹窗组件？](https://juejin.cn/book/7137945369635192836/section/7141554348504383500g) 中遇到的滚动栏丢失问题也因为禁用外部滚动，改用页面内滚动而随之解决。

当然 IOS 的问题还远不止此，作为一名 C 端开发者，我们不仅要考虑常规的 B 端 ie 等兼容问题，移动端的兼容问题我们也需要着重关注，后续大家遇到这类问题，大家没有思路可以到 MDN 或是浏览器的开发文档中看看最新的草案，评估兼容性，可能会有额外的收获。

到这里，我们性能优化篇也就画上句号了，我们官网大部分的功能都已经实现了，从下一节课开始，我们将开始进入部署篇的学习，为上线和之后的运营做准备。下一节课，我们将先首先来学习如何对官网项目进行压力测试。
