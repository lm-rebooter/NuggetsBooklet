网页开发中我们经常要处理用户交互，我们会用 addEventListener 添加事件监听器来监听各种用户操作，比如 click、mousedown、mousemove、input 等，这些都是由用户直接触发的事件。

那么对于一些不是由用户直接触发的事件呢？ 比如元素从不可见到可见、元素大小的改变、元素的属性和子节点的修改等，这类事件如何监听呢？

浏览器提供了 5 种 Observer 来监听这些变动：MutationObserver、IntersectionObserver、PerformanceObserver、ResizeObserver、ReportingObserver。

我们分别来看一下：

## IntersectionObserver

一个元素从不可见到可见，从可见到不可见，这种变化如何监听呢？

用 IntersectionObserver。

**IntersectionObserver 可以监听一个元素和可视区域相交部分的比例，然后在可视比例达到某个阈值的时候触发回调。**

我们准备两个元素：
```html
<div id="box1">BOX111</div>
<div id="box2">BOX222</div>
```
加上样式：
```css
#box1,#box2 {
    width: 100px;
    height: 100px;
    background: blue;
    color: #fff;

    position: relative;
}
#box1 {
    top: 500px;
}
#box2 {
    top: 800px;
}
```
这两个元素分别在 500  和 800 px 的高度，我们监听它们的可见性的改变。

```javascript
const intersectionObserver = new IntersectionObserver(
    function (entries) {
        console.log('info:');
        entries.forEach(item => {
            console.log(item.target, item.intersectionRatio)
        })
    }, {
    threshold: [0.5, 1]
});

intersectionObserver.observe( document.querySelector('#box1'));
intersectionObserver.observe( document.querySelector('#box2'));
```
创建一个 IntersectionObserver 对象，监听 box1 和 box2 两个元素，当可见比例达到 0.5 和 1 的时候触发回调。

浏览器跑一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0a7e768453e4bb99365e614a98d8b3f~tplv-k3u1fbpfcp-watermark.image?)

可以看到元素 box1 和 box2 在可视范围达到一半（0.5）和全部（1）的时候分别触发了回调。

这有啥用？

这太有用了。我们在做一些数据采集的时候，希望知道某个元素是否是可见的，什么时候可见的，就可以用这个 api 来监听，还有做图片的懒加载的时候，可以当可视比例达到某个比例再触发加载。

除了可以监听元素可见性，还可以监听元素的属性和子节点的改变：
## MutationObserver

监听一个普通 JS 对象的变化，我们会用 Object.defineProperty 或者 Proxy：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f7c3f41e1924c62942a741bd7d4baa5~tplv-k3u1fbpfcp-watermark.image?)

而监听元素的属性和子节点的变化，我们可以用 MutationObserver：

**MutationObserver 可以监听对元素的属性的修改、对它的子节点的增删改。**

我们准备这样一个盒子：
```html
<div id="box"><button>光</button></div>
```
加上样式：
```javascript
 #box {
    width: 100px;
    height: 100px;
    background: blue;

    position: relative;
}
```
就是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/647a660a3f0f40ea90cff9b2a6ea8398~tplv-k3u1fbpfcp-watermark.image?)

我们定时对它做下修改：

```javascript
setTimeout(() => {
    box.style.background = 'red';
},2000);

setTimeout(() => {
    const dom = document.createElement('button');
    dom.textContent = '东东东';
    box.appendChild(dom);
},3000);

setTimeout(() => {
   document.querySelectorAll('button')[0].remove();
},5000);
```

2s 的时候修改背景颜色为红色，3s 的时候添加一个 button 的子元素，5s 的时候删除第一个 button。

然后监听它的变化：

```javascript
const mutationObserver = new MutationObserver((mutationsList) => {
    console.log(mutationsList)
});

mutationObserver.observe(box, {
    attributes: true,
    childList: true
});
```
创建一个 MutationObserver 对象，监听这个盒子的属性和子节点的变化。

浏览器跑一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7e836594b754b2e8d262c3fee602ec9~tplv-k3u1fbpfcp-watermark.image?)

可以看到在三次变化的时候都监听到了并打印了一些信息：

第一次改变的是 attributes，属性是 style：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d2b3290ac244c319a307dfe74d9aad8~tplv-k3u1fbpfcp-watermark.image?)

第二次改变的是 childList，添加了一个节点：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35be2e97254f41d9b04e8e7544a1c12b~tplv-k3u1fbpfcp-watermark.image?)

第三次也是改变的 childList，删除了一个节点：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e22cf73b71342069320a7067fc7d9ef~tplv-k3u1fbpfcp-watermark.image?)

都监听到了！

这个可以用来做什么呢？比如文章水印被人通过 devtools 去掉了，那么就可以通过 MutationObserver 监听这个变化，然后重新加上，让水印去不掉。

比如 antd 的 Watermark 组件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46c803113ecd469cb1341c094636a47a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=1126&s=295537&e=jpg&b=1f1f1f)

当删除了水印节点，或者修改了水印节点的属性，就会重新渲染水印：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8119b259a5640218a61f530573c956a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1354&h=504&s=132070&e=png&b=202020)

当然，还有很多别的用途，这里只是介绍功能。

除了监听元素的可见性、属性和子节点的变化，还可以监听大小变化：

## ResizeObserver

窗口我们可以用 addEventListener 监听 resize 事件，那元素呢？

**元素可以用 ResizeObserver 监听大小的改变，当 width、height 被修改时会触发回调。**

我们准备这样一个元素：
```html
<div id="box"></div>
```
添加样式：
```css
#box {
    width: 100px;
    height: 100px;
    background: blue;
}
```
在 2s 的时候修改它的高度：

```javascript
const box = document.querySelector('#box');

setTimeout(() => {
    box.style.width = '200px';
}, 3000);
```

然后我们用 ResizeObserver 监听它的变化：

```javascript
const resizeObserver = new ResizeObserver(entries => {
    console.log('当前大小', entries)
});
resizeObserver.observe(box);
```
在浏览器跑一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3712761d69f142e6bbe580db5a712977~tplv-k3u1fbpfcp-watermark.image?)

大小变化被监听到了，看下打印的信息：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c64db90b225e4350b777f8ec57032043~tplv-k3u1fbpfcp-watermark.image?)

可以拿到元素和它的位置、尺寸。

这样我们就实现了对元素的 resize 的监听。

除了元素的大小、可见性、属性子节点等变化的监听外，还支持对 performance 录制行为的监听：

## PerformanceObserver

浏览器提供了 performance 的 api 用于记录一些时间点、某个时间段、资源加载的耗时等。

我们希望记录了 performance 那就马上上报，可是怎么知道啥时候会记录 performance 数据呢？

用 PeformanceObserver。

**PerformanceObserver 用于监听记录 performance 数据的行为，一旦记录了就会触发回调，这样我们就可以在回调里把这些数据上报。**

比如 performance 可以用 mark 方法记录某个时间点：

```javascript
performance.mark('registered-observer');
```

用 measure 方法记录某个时间段：
```javascript
performance.measure('button clicked', 'from', 'to');
```
后两个个参数是时间点，不传代表从开始到现在。

我们可以用 PerformanceObserver 监听它们：

```html
<html>
<body>
  <button onclick="measureClick()">Measure</button>

  <img src="https://p9-passport.byteacctimg.com/img/user-avatar/4e9e751e2b32fb8afbbf559a296ccbf2~300x300.image" />

  <script>
    const performanceObserver = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        console.log(entry);// 上报
      })
    });
    performanceObserver.observe({entryTypes: ['resource', 'mark', 'measure']});

    performance.mark('registered-observer');

    function measureClick() {
      performance.measure('button clicked');
    }
  </script>
</body>
</html>
```
创建 PerformanceObserver 对象，监听 mark（时间点）、measure（时间段）、resource（资源加载耗时）
这三种记录时间的行为。

然后我们用 mark 记录了某个时间点，点击 button 的时候用 measure 记录了某个时间段的数据，还加载了一个图片。

当这些记录行为发生的时候，希望能触发回调，在里面可以上报。

我们在浏览器跑一下试试：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5d336a321b147f2ab655e1c6857d55d~tplv-k3u1fbpfcp-watermark.image?)

可以看到 mark 的时间点记录、资源加载的耗时、点击按钮的 measure 时间段记录都监听到了。

分别打印了这三种记录行为的数据：

mark：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4aacfb0969534307b2718f27e3b52472~tplv-k3u1fbpfcp-watermark.image?)

图片加载：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11a00ac93d614c50a272728b4afd319d~tplv-k3u1fbpfcp-watermark.image?)

measure：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0795f5a92e2947caa1d2c8939912dab3~tplv-k3u1fbpfcp-watermark.image?)

有了这些数据，就可以上报上去做性能分析了。

除了元素、performance 外，浏览器还有一个 reporting 的监听：

## ReportingObserver

当浏览器运行到过时（deprecation）的 api 的时候，会在控制台打印一个过时的报告:

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7d6bcc99daa4c588ccf9005fbfbb453~tplv-k3u1fbpfcp-watermark.image?)

浏览器还会在一些情况下对网页行为做一些干预（intervention），比如会把占用 cpu 太多的广告的 iframe 删掉：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7bb6903a6f846908cde63064336ceab~tplv-k3u1fbpfcp-watermark.image?)

会在网络比较慢的时候把图片替换为占位图片，点击才会加载：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fa5be3e31ff4846ad8b90b1a61e6ee7~tplv-k3u1fbpfcp-watermark.image?)

这些干预都是浏览器做的，会在控制台打印一个报告：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d5f7d6e298a49e8af99792f696ae803~tplv-k3u1fbpfcp-watermark.image?)

这些干预或者过时的 api 并不是报错，所以不能用错误监听的方式来拿到，但这些情况对网页 app 来说可能也是很重要的：

比如我这个网页就是为了展示广告的，但浏览器一干预给我把广告删掉了，我却不知道。如果我知道的话或许可以优化下 iframe。

比如我这个网页的图片很重要，结果浏览器一干预给我换成占位图了，我却不知道。如果我知道的话可能会优化下图片大小。

所以自然也要监听，所以浏览器提供了 ReportingObserver 的 api 用来监听这些报告的打印，我们可以拿到这些报告然后上传。


```javascript
const reportingObserver = new ReportingObserver((reports, observer) => {
    for (const report of reports) {
        console.log(report.body);//上报
    }
}, {types: ['intervention', 'deprecation']});

reportingObserver.observe();
```

**ReportingObserver 可以监听过时的 api、浏览器干预等报告等的打印，在回调里上报，这些是错误监听无法监听到但对了解网页运行情况很有用的数据。**

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/observer)

## 总结

监听用户的交互行为，我们会用 addEventListener 来监听 click、mousedown、keydown、input 等事件，但对于元素的变化、performance 的记录、浏览器干预行为这些不是用户交互的事件就要用 XxxObserver 的 api 了。

浏览器提供了这 5 种 Observer：

- IntersectionObserver：监听元素可见性变化，常用来做元素显示的数据采集、图片的懒加载
- MutationObserver：监听元素属性和子节点变化，比如可以用来做去不掉的水印
- ResizeObserver：监听元素大小变化

还有两个与元素无关的：

- PerformanceObserver：监听 performance 记录的行为，来上报数据
- ReportingObserver：监听过时的 api、浏览器的一些干预行为的报告，可以让我们更全面的了解网页 app 的运行情况

这些 api 相比 addEventListener 添加的交互事件来说用的比较少，但是在特定场景下都是很有用的。

浏览器的这 5 种 Observer，你用过几种呢？在什么情况下用到过呢？不妨来讨论下。

