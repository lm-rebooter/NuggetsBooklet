## Anime.js 蒙版动画
## 蒙版 Morphing 动画实战
在前面 CSS 动画部分，我们学习了使用 CSS 来实现来 SVG 蒙版动画。这一章节我们来学习使用 Anime 来操作 SVG 中的蒙版，实现更强大的 SVG 蒙版动画。

通过前面章节的学习，我们知道蒙版是用来控制元素的可见范围的。利用蒙版这一特性，再结合前面章节学习到的关于 SVG Morphing 动画和描边动画的知识，我们可以使用 Anime 实现更加有趣的动画效果。

下面就用两个实际的例子来抛砖引玉下，看看使用 SVG 蒙版结合 Anime 的来开发 SVG 蒙版动画的方法。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/15/167b13533e0290eb~tplv-t2oaga2asx-image.image)

从上面这个动画可以看出，我们的 SVG 蒙版是一个不规则的形状，并且这个蒙版在两个形状之间有一个 Morphing 动画。

所以在开始之前我们需要设计两个形状，并且导出为 SVG 代码，先来使用 AI  设计好两个形状：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/15/167b133949e5a2bd~tplv-t2oaga2asx-image.image)

然后导出为 SVG 代码，使用导出的代码来定义一个蒙版，对图片进行遮罩，代码整理如下所示：

```
<svg width="500" height="500" viewBox="0 0 600 600" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/">
	<defs>
		<clipPath id="Mask">
			<path d="M64,168c0,0-30-123,80-108s91,54,182,64s137-83,163-57s119,203-37,214s-205,89-299,22
	S64,168,64,168z"/>
		</clipPath>
	</defs>
	<image width="900px" height="600px" xlink:href="https://ws1.sinaimg.cn/large/006tNbRwgy1fy5hoffs0kj30p00gon2m.jpg" clip-path="url(#Mask)"/>
</svg>
```

通过前面的学习，上面的代码很简单，这里就不再进行解释了，得到下面所示的效果：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/15/167b133903c1820c~tplv-t2oaga2asx-image.image)

而要实现一个 Morphing 动画效果，我们还需要准备另外一个形状，这样才可以在两个形状之间实现 Morphing 动画。

这个也简单，我们只需要在第一个形状的基础上，使用路径选择工具，选中节点进行拖拽就可以得到我们想要的形状：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/15/167b133ed3fd9a89~tplv-t2oaga2asx-image.image)

得到我们想要的形状之后，直接把文件另存为 SVG 代码得到 path 的数据。

```
M64,168c0,0-30-123,80-108s91,54,182,64s95,10,121,36s161,110,5,121s-239,115.9-333,48.9S64,168,64,168z
```

在前面的章节中，我们学习了如何使用 Anime 来实现动画效果，代码照搬就可以了：

```
var morph = anime({
	targets: 'path',
	d: []
	easing: 'easeInOutQuad',
  duration: 3000,
  direction: 'alternate',
  loop: true
	
});

```
使用 Anime 来编写动画效果，基本上都可以套用上面的代码，在这里需要操作 path 属性 d 的值，只需要把我们上面得到的 path 数据中 d 的值填进去就可以了：

```
var morph = anime({
	targets: 'path',
	d: [
		{value: 'M64,168c0,0-30-123,80-108s91,54,182,64s95,10,121,36s161,110,5,121s-239,115.9-333,48.9S64,168,64,168z' }
	],
	easing: 'easeInOutQuad',
  duration: 3000,
  direction: 'alternate',
  loop: true
});

```
[代码演示地址](https://codepen.io/janily/pen/yGeYOX)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/15/167b13533e0290eb~tplv-t2oaga2asx-image.image)

就是这么简单，一个蒙版 Morphing 动画就完成了。

## 黑白蒙版动画实战

下面我们再来看一个使用 Anime 和蒙版实现的动画效果，效果如下图所示：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/15/167b1338d80c9675~tplv-t2oaga2asx-image.image)

先来看下这个动画效果，主要是两部分组成：

* 第一部分是心从小到大的缩放动画，这里面还伴随着透明度的变化。
* 第二部分动画是心外面一个圆圈的缩放动画，这个缩放动画不是简简单单的缩放，而是还带有一个蒙版遮罩的动画，伴随着在圆圈放大的过程中也慢慢的消失的一个动画效果。

下面我们一步步来拆解实现这个动画，首先是中间的心从小到大的缩放动画：

先准备 HTML 结构：

```
<div class="wrap">
  <div class="heart"></div>
</div>
```

CSS代码：

```
.wrap {
  position: relative;
  width:200px;
  height: 200px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
}
.heart {
   position: absolute;
   left:50%;
   top:50%;
   margin-top: -25px;
  margin-left: -25px;
   width:50px;
   height:50px;
  background-image: url(https://ws1.sinaimg.cn/large/006tNbRwgy1fy7habfwcmj303k03k0sj.jpg);
  background-size: 100% 100%;
  transform:scale(0);
  opacity:0;
}

```

然后是使用 Anime 来实现这个缩放动画，也非常简单，就是改变它的 scale 和 opacity 的值就可以实现：

```
var timeline = anime.timeline({ autoplay: true, loop: true });

timeline
.add({  targets: '.heart',
  scale: {
    value: [0, 1],
    duration: 500,
    delay: 1500,
    easing: 'easeOutQuad'
  },
  opacity: {
    value: 1,
    duration: 600,
    delay: 1500
  }
 })

```

因为动画由两部分动画组成，所以需要用到 Anime 的时间轴，先定义一个 timeline 的时间轴，然后定义动画自动循环播放。

其它的就简单了，通过前几章的学习，我们应该轻车熟路了，就是选择我们需要改变的属性就可以了，其它的就交给 Anime 来处理，这里就不再解释了。

第一个动画完成了，接下来来实现第二部分的动画。这里需要使用 SVG 来定义蒙版来实现，先来看下代码：

```
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
<defs>
  <mask id="heart-mask">
    <rect width="100%" height="100%" fill="white"/>
    <circle class="heart-inner" cx="50" cy="50" r="0" fill="black"></circle>
</mask>
</defs>
<circle class="heart-outer" cx="50" cy="50" r="50" fill="red" mask="url(#heart-mask)"></circle>
</svg>
```

在上面代码的蒙版中，定义了两个元素，一个白色填充的矩形和一个黑色填充的圆圈，在蒙版中，黑色蒙版是表现“隐藏”当前图层的内容，可以隐藏原先的图层，显示出修改过的图层。白色蒙版是表示“显示”当前图层的内容，即显示出原图层原本的样子。

具体到这个动画效果中，圆圈在放大的过程中，同时也慢慢的消失，这个动画效果就可以借助黑白蒙版这个特性来实现。

我们在蒙版中定义了一个黑色的圆圈，初始化的时候，它的半径为0，而矩形是白色的，这样整个圆圈即类名为 heart-outer 的圆圈在初始化的时候是可见的。

在样式中把两个圆圈的 scale 属性的值全部定义为0，同时使用 Anime 来把它们的 scale 的值改为1，这样当 heart-outer 这个圆圈在放大的时候，蒙版中的 heart-inner 的圆圈也在放大，因为 heart-inner 圆圈的填充颜色为黑色。所以，在它放大的时候，就会隐藏 heart-outer 的圆圈，从而实现圆圈在放大的过程中，同时也慢慢的消失的动画效果。

整体的代码如下：

```
var timeline = anime.timeline({ autoplay: true, loop: true });

timeline
.add({
  targets: '.heart-outer',
  scale: {
    value: [0, 1],
    duration: 500,
    delay: 1300,
    easing: 'easeOutQuad'
  },
  offset: 0
})
.add({
  targets: '.heart-inner',
  r: {
    value: [0, 50],
    duration: 500,
    delay: 1300,
    easing: 'easeOutQuad'
  },
  offset: 0
})
.add({
  targets: '.heart',
  scale: {
    value: [0, 1],
    duration: 500,
    delay: 1500,
    easing: 'easeOutQuad'
  },
  opacity: {
    value: 1,
    duration: 600,
    delay: 1500
  },
  offset: 0
})
```

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/15/167b1338d80c9675~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/dwMzWo)

上面的代码中，用到了 offset 这个参数，这个参数是用来定义在时间轴中动画开始的时间的。默认情况下，在 Anime  中，时间轴的动画都是按次序来执行的，也就是上一个动画执行完后，再执行下一个动画效果。

具体到我们这个动画效果中，这两个动画效果是同时开始的，所以把 offset 的值设置为0，即表示这个动画在一开始的同时执行。如果把 offset 的值设置为 500，则表示在时间轴上动画开始500毫秒后就开始执行。

这个参数在开发动画的时候还是挺有用的，特别当我们不需要定义在时间轴上的动画全部一起执行的时候，非常的好用。

蒙版是一个非常强大的特性，使用它我们还可以实现更多的有趣的动画效果，这里只是抛砖引玉下，要开发更多有趣的动画，就要我们开开脑洞了。

下一章节我们来学习使用 Anime 来开发 SVG Morphing 动画效果，Morphing动画也是 SVG 动画中用的非常广泛的一个动画效果。


