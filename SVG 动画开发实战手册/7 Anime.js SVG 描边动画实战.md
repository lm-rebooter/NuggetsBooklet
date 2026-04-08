## Anime SVG 描边动画

### 描边动画效果

上一章节，我们学习来 Anime 的基本知识，这一节我们来学习使用 Anime 高效的开发 SVG 动画，首先要学习的是使用 Anime 开发 SVG 描边动画。描边动画在前面的 CSS SVG 描边动画章节中已经详细的介绍过来，这里就不再阐述。

这篇教程我们会使用 Anime 来实现这样一个文字描边的动画效果：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/168410b38b5c7425~tplv-t2oaga2asx-image.image)

通过前面的学习，我们知道要实现这样的描边动画效果，其实就是通过 SVG 路径即 Path 的 stroke-dasharray 和 stoke-dashoffset 来实现的。

具体到上面这个效果，除来描边之外，还有填充颜色的一个效果，如果使用 CSS 来实现的话，除了要计算各个文字动画之间的延迟时间外，还需要在文字描完边后，对颜色进行填充，写起来还是有点麻烦，那如果使用 Anime 来实现的话，就方便很多了。下面我们就一步一步来实现这个描边填充动画效果。

### 准备工作

首先是准备文字的路径，这个很简单，我们只需要在 Adobe Illustrator 即 AI 设计软件中处理就可以了。

在 AI 中新建一个 300X200 的画布，然后在上面使用文本工具打上 ISUX 这个几个字母，选择适当的字体和字号，然后在文字上右击鼠标选择创建轮廓命令把文字转换为矢量图层，这样就可以得到这些文字到路径数据。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/168410e141914084~tplv-t2oaga2asx-image.image)

转换为轮廓之后，我们就可以选择把文件导出为 SVG 文件，得到这几个字母的路径数据：

```
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="鍥惧眰_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 300 200" style="enable-background:new 0 0 300 200;" xml:space="preserve">
<g id="XMLID_2_">
	<path id="XMLID_3_" d="M82.4,127.1V75.6h6.8v51.5H82.4z"/>
	<path id="XMLID_5_" d="M98.9,110.6l6.4-0.6c0.3,2.6,1,4.7,2.1,6.3s2.8,3,5.2,4s5,1.5,7.9,1.5c2.6,0,4.9-0.4,6.9-1.2
		s3.5-1.8,4.4-3.2s1.5-2.8,1.5-4.4c0-1.6-0.5-3-1.4-4.2s-2.5-2.2-4.6-3c-1.4-0.5-4.4-1.4-9.2-2.5s-8.1-2.2-9.9-3.2
		c-2.5-1.3-4.3-2.9-5.5-4.8c-1.2-1.9-1.8-4-1.8-6.4c0-2.6,0.7-5,2.2-7.3c1.5-2.3,3.6-4,6.5-5.2c2.8-1.2,6-1.8,9.5-1.8
		c3.8,0,7.2,0.6,10.1,1.8s5.2,3,6.7,5.4s2.4,5.1,2.5,8.1l-6.5,0.5c-0.4-3.3-1.5-5.7-3.6-7.4c-2-1.7-5-2.5-9-2.5
		c-4.1,0-7.1,0.8-9,2.3s-2.8,3.3-2.8,5.5c0,1.9,0.7,3.4,2,4.6c1.3,1.2,4.7,2.4,10.3,3.7c5.5,1.3,9.3,2.4,11.4,3.3
		c3,1.4,5.2,3.1,6.6,5.3s2.1,4.6,2.1,7.3c0,2.7-0.8,5.3-2.4,7.8s-3.8,4.3-6.8,5.7s-6.3,2-9.9,2c-4.7,0-8.6-0.7-11.7-2
		c-3.2-1.4-5.6-3.4-7.4-6.1C99.9,117.1,99,114,98.9,110.6z"/>
	<path id="XMLID_7_" d="M183.1,75.6h6.8v29.8c0,5.2-0.6,9.3-1.8,12.3s-3.3,5.5-6.3,7.4s-7.1,2.9-12,2.9c-4.8,0-8.8-0.8-11.8-2.5
		s-5.3-4.1-6.6-7.2s-2-7.5-2-12.9V75.6h6.8v29.7c0,4.5,0.4,7.8,1.2,9.9s2.3,3.8,4.3,4.9s4.5,1.7,7.4,1.7c5,0,8.6-1.1,10.7-3.4
		s3.2-6.6,3.2-13.1V75.6z"/>
	<path id="XMLID_9_" d="M196,127.1l19.9-26.9l-17.6-24.7h8.1l9.4,13.2c1.9,2.7,3.3,4.9,4.1,6.3c1.1-1.9,2.5-3.8,4.1-5.9l10.4-13.7
		h7.4l-18.1,24.3l19.5,27.2h-8.4l-13-18.4c-0.7-1.1-1.5-2.2-2.2-3.4c-1.1,1.9-2,3.2-2.5,3.9l-12.9,18H196z"/>
</g>
</svg>

```
从上面的代码可以看到，AI 默认导出的数据有很多的冗余信息，有很多都是可有可无的，我们可以把他们删除掉，整理得到下面的代码：

```
<svg x="0px" y="0px" viewBox="0 0 300 200">
 <path class="letter-i" d="M82.4,127.1V75.6h6.8v51.5H82.4z" stroke="none" fill="none" />
	<path class="letter-s" d="M98.9,110.6l6.4-0.6c0.3,2.6,1,4.7,2.1,6.3s2.8,3,5.2,4s5,1.5,7.9,1.5c2.6,0,4.9-0.4,6.9-1.2
		s3.5-1.8,4.4-3.2s1.5-2.8,1.5-4.4c0-1.6-0.5-3-1.4-4.2s-2.5-2.2-4.6-3c-1.4-0.5-4.4-1.4-9.2-2.5s-8.1-2.2-9.9-3.2
		c-2.5-1.3-4.3-2.9-5.5-4.8c-1.2-1.9-1.8-4-1.8-6.4c0-2.6,0.7-5,2.2-7.3c1.5-2.3,3.6-4,6.5-5.2c2.8-1.2,6-1.8,9.5-1.8
		c3.8,0,7.2,0.6,10.1,1.8s5.2,3,6.7,5.4s2.4,5.1,2.5,8.1l-6.5,0.5c-0.4-3.3-1.5-5.7-3.6-7.4c-2-1.7-5-2.5-9-2.5
		c-4.1,0-7.1,0.8-9,2.3s-2.8,3.3-2.8,5.5c0,1.9,0.7,3.4,2,4.6c1.3,1.2,4.7,2.4,10.3,3.7c5.5,1.3,9.3,2.4,11.4,3.3
		c3,1.4,5.2,3.1,6.6,5.3s2.1,4.6,2.1,7.3c0,2.7-0.8,5.3-2.4,7.8s-3.8,4.3-6.8,5.7s-6.3,2-9.9,2c-4.7,0-8.6-0.7-11.7-2
		c-3.2-1.4-5.6-3.4-7.4-6.1C99.9,117.1,99,114,98.9,110.6z" stroke="none" fill="none" />
	<path class="letter-u" d="M183.1,75.6h6.8v29.8c0,5.2-0.6,9.3-1.8,12.3s-3.3,5.5-6.3,7.4s-7.1,2.9-12,2.9c-4.8,0-8.8-0.8-11.8-2.5
		s-5.3-4.1-6.6-7.2s-2-7.5-2-12.9V75.6h6.8v29.7c0,4.5,0.4,7.8,1.2,9.9s2.3,3.8,4.3,4.9s4.5,1.7,7.4,1.7c5,0,8.6-1.1,10.7-3.4
		s3.2-6.6,3.2-13.1V75.6z" stroke="none" fill="none" />
	<path class="letter-x" d="M196,127.1l19.9-26.9l-17.6-24.7h8.1l9.4,13.2c1.9,2.7,3.3,4.9,4.1,6.3c1.1-1.9,2.5-3.8,4.1-5.9l10.4-13.7
		h7.4l-18.1,24.3l19.5,27.2h-8.4l-13-18.4c-0.7-1.1-1.5-2.2-2.2-3.4c-1.1,1.9-2,3.2-2.5,3.9l-12.9,18H196z" stroke="none" fill="none"/>
</svg>
```
从上面的代码中，可以看到我们把 path 元素的 stroke 和 fill 属性的值都设置为了 none，这样就可以在执行描边动画前，使得字母都是不可见。并且每个 path 元素都定义来一个类名，这个会在后面的颜色填充效果中需要用到。

### 实现描边动画效果

得到 SVG 代码后，接下来就开始正式的编码工作了。先准备基本的 HTML：

```
<div class="line-draw">
  <svg x="0px" y="0px" viewBox="0 0 300 200">
 <path class="letter-i" d="M82.4,127.1V75.6h6.8v51.5H82.4z" stroke="none" fill="none" />
	<path class="letter-s" d="M98.9,110.6l6.4-0.6c0.3,2.6,1,4.7,2.1,6.3s2.8,3,5.2,4s5,1.5,7.9,1.5c2.6,0,4.9-0.4,6.9-1.2
		s3.5-1.8,4.4-3.2s1.5-2.8,1.5-4.4c0-1.6-0.5-3-1.4-4.2s-2.5-2.2-4.6-3c-1.4-0.5-4.4-1.4-9.2-2.5s-8.1-2.2-9.9-3.2
		c-2.5-1.3-4.3-2.9-5.5-4.8c-1.2-1.9-1.8-4-1.8-6.4c0-2.6,0.7-5,2.2-7.3c1.5-2.3,3.6-4,6.5-5.2c2.8-1.2,6-1.8,9.5-1.8
		c3.8,0,7.2,0.6,10.1,1.8s5.2,3,6.7,5.4s2.4,5.1,2.5,8.1l-6.5,0.5c-0.4-3.3-1.5-5.7-3.6-7.4c-2-1.7-5-2.5-9-2.5
		c-4.1,0-7.1,0.8-9,2.3s-2.8,3.3-2.8,5.5c0,1.9,0.7,3.4,2,4.6c1.3,1.2,4.7,2.4,10.3,3.7c5.5,1.3,9.3,2.4,11.4,3.3
		c3,1.4,5.2,3.1,6.6,5.3s2.1,4.6,2.1,7.3c0,2.7-0.8,5.3-2.4,7.8s-3.8,4.3-6.8,5.7s-6.3,2-9.9,2c-4.7,0-8.6-0.7-11.7-2
		c-3.2-1.4-5.6-3.4-7.4-6.1C99.9,117.1,99,114,98.9,110.6z" stroke="none" fill="none" />
	<path class="letter-u" d="M183.1,75.6h6.8v29.8c0,5.2-0.6,9.3-1.8,12.3s-3.3,5.5-6.3,7.4s-7.1,2.9-12,2.9c-4.8,0-8.8-0.8-11.8-2.5
		s-5.3-4.1-6.6-7.2s-2-7.5-2-12.9V75.6h6.8v29.7c0,4.5,0.4,7.8,1.2,9.9s2.3,3.8,4.3,4.9s4.5,1.7,7.4,1.7c5,0,8.6-1.1,10.7-3.4
		s3.2-6.6,3.2-13.1V75.6z" stroke="none" fill="none" />
	<path class="letter-x" d="M196,127.1l19.9-26.9l-17.6-24.7h8.1l9.4,13.2c1.9,2.7,3.3,4.9,4.1,6.3c1.1-1.9,2.5-3.8,4.1-5.9l10.4-13.7
		h7.4l-18.1,24.3l19.5,27.2h-8.4l-13-18.4c-0.7-1.1-1.5-2.2-2.2-3.4c-1.1,1.9-2,3.2-2.5,3.9l-12.9,18H196z" stroke="none" fill="none"/>
</svg>
<button class="play-drawing">isux</button>
</div>
```
然后是样式：

```
body {
  background-color: #000;
}
.line-draw {
  position: relative;
  width:600px;
  height: 400px;
  text-align:center;
}

svg {
   width:600px;
   height: 400px;
   padding: 10px;
}

button {
  width:100px;
  margin-left: auto;
  margin-right: auto;
  margin-top: -30px;
  background: #007fff;
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-family: 'Lato';
  cursor: pointer;
  border: none;
  outline: none;
}

```
接下来就使用 Anime 来实现描边填充动画效果。

首先是来实现文字的描边动画效果：

```
var letterTime = 2000;

var lineDrawing = anime({
  targets: "path",
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: "easeInOutCubic",
  duration: letterTime,
  delay: function(el, i) {
    return letterTime * i;
  },
  begin: function(anim) {
    var letters = document.querySelectorAll("path"),
      i;

    for (i = 0; i < letters.length; ++i) {
      letters[i].setAttribute("stroke", "white");
      letters[i].setAttribute("fill", "none");
    }
  }
  autoplay: false
});
```
通过上一章节的学习，我们知道来 Anime 的基本操作方法，具体到 SVG 大部分的 API 使用方法也一样，大同小异。

依然先选择目标元素，比如这里的 path 元素，然后是要改变的属性。具体到描边动画也就是需要改变 path 元素的 stroke-dashoffset 的值。

Anime 提供了 strokeDashoffset 这个属性，它会自动计算 path 的长度然后来设置 path 的 stroke-dasharry 和 stroke-dashoffset 的值，再动态的改变 stroke-dashoffset 的值来实现描边动画效果。也就是这个方法的目的所在：

```
strokeDashoffset: [anime.setDashoffset, 0],
```
Anime 还提供了很多的回调方法，比如在上面的代码中，我们看到了 begin 这个方法，从这个单词也可以看出它是用来在动画刚开始的时候用来设置一些属性的。比如，这里设置了 path 的 stroke 和 fill 属性的值。autoplay 的值为 false，这样动画不会在一加载的时候就执行。效果如下所示：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/1684113fcc1a6a14~tplv-t2oaga2asx-image.image)

描边动画完成后，接下来就是颜色的填充效果的实现。

从我们要实现的效果可以知道，每个字母的颜色的填充是要在对应的文字描完边后来实现颜色填充的。这里就需要知道每个文字描完边的时间，这样就可以根据这个时间来来是否填充文字的颜色。

要实现这个填充颜色的效果，可以使用 Anime 提供的 update 这个回调方法来完成。这个方法可以监控到动画运行过程中所有属性的变化，比如动画的时间等。所以我们可以通过监控动画时间来确定是否执行颜色的填充。

我们定义了动画的延迟时间是：

```
delay: function(el, i) {
    return letterTime * i;
}
```

动画的延迟时间是一个常数即 letterTime  乘以元素的索引值，而 Anime 也提供了 currentTime 这个参数来获取动画执行过程中的时间。所以，我们可以通过判断 currentTime 是否大于每个元素的延迟时间来执行颜色的填充，代码如下所示：

```
update: function(anim) {
    if (anim.currentTime >= letterTime) {
      document.querySelector(".letter-i").setAttribute("fill", "#fff");
    }
    if (anim.currentTime >= 2 * letterTime) {
      document.querySelector(".letter-s").setAttribute("fill", "#fff");
    }
    if (anim.currentTime >= 3 * letterTime) {
      document.querySelector(".letter-u").setAttribute("fill", "#fff");
    }
    if (anim.currentTime >= 4 * letterTime) {
      document.querySelector(".letter-x").setAttribute("fill", "#fff");
    }
  },
  
```
我们使用 setAttribute 这个方法来改变元素的 fill 属性来填充元素的颜色。

最后绑定动画播放的事件到按钮就可以了：

```
document.querySelector(".play-drawing").onclick = lineDrawing.restart;
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/168410b38b5c7425~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/PXxOZV)

一个简单描边填充动画就完成了。通过这个实例可以看到使用 Anime 实现文字描边填充动画效果，高效简洁，相比使用CSS，其开发效率一目了然。

下一章节我们来学习下使用 Anime 来实现 SVG 的路径动画。
