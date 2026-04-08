## SVG 描边动画

由于 SVG 是一种 XML 格式的文档，和 HTML 中的 DOM 类似。所以，SVG 也能通过 CSS 执行动画效果。

通过 CSS 的关键帧（keyframes）可以很轻松的对 SVG 进行操控，进而执行指定的动画效果。

在开始之前，你可能会有一个疑问，使用 CSS 控制 HTML 不是也可以制作动画么，为啥还要用到 SVG 呢？

下面就来说说使用 SVG 的一些优势。

## SVG 的一些优点

首先从一个小小的实例来看一下 SVG 的一些优点。比如，我这里要绘制一个六边形，我只需要在 AI 等矢量设计软件中绘制一个六边形，然后导出 SVG 代码就可以了，得到 SVG 代码如下：

```
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 300 200" xml:space="preserve">
<path  class="st0" fill="red" stroke="#000" d="M181.5,111l-32,18l-31.6-18.7l0.4-36.7l32-18l31.6,18.7L181.5,111z M181.7,111.4l0.3-0.1
	l0.4-37.3l-32.1-19l-32.5,18.3l-0.4,37.3l32.1,19L181.7,111.4z M118.8,73.9l31.5-17.8l31.1,18.4l-0.4,36.1l-31.5,17.8l-31.1-18.4
	L118.8,73.9z"/>
</svg>
```
得到如下图所示的一个六边形：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676ddc25728a356~tplv-t2oaga2asx-image.image)

只需要三行代码就可以得到一个六边形，而且可以无限放大缩小，改变颜色也是一句代码的事儿。这代码量明显少于使用 HTML 和 CSS 来实现的代码量，你也许会说，我直接切一张图不就得了，不比 SVG 的代码量更小。

可是你想过么，如果后面变更了需求，需要改变它的颜色，或者是增加它的尺寸，那你就不得不重新在设计软件中切图调整，反复折腾，相信我，你不会愿意这样做的。

而使用 SVG，比如，当我们想改变这个形状颜色的时候，只需要一句代码就可以完成：

```
fill="green"
```

就可以得到一个填充颜色为绿色的六边形：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676dde4f6ee2916~tplv-t2oaga2asx-image.image)

就是这么简单。

当然，如果只是拿这个说事，现在 CSS 也可以做到，但是再加上 SVG 可以轻松的来做出下面这样的描边动画效果，那 CSS 就是望尘莫及了。

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676dcae65adde18~tplv-t2oaga2asx-image.image)

话不多说，下面我们来一个 SVG 和 CSS 的动画实例来初步领略下 SVG 动画的魅力。

## SVG CSS 描边动画

我们将要完成的效果如下图所示：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676dcae65adde18~tplv-t2oaga2asx-image.image)

这个动画是由一个颜色填充动画、描边线条动画和放大动画这三个动画组成。描边线条动画可以说是 SVG 的独门武器了，现在在互联网上几乎是遍地开花，无处不在。

### 描边动画原理

开始之前，我们先来了解下在 SVG 中描边动画原理，在后面的章节中，我们还会跟它经常打交道。

通过第一章节，我们了解到在 SVG 中，很多的形状都是由 **path** 元素构成的，这里就不再多介绍了，这里主要介绍下跟 SVG 描边动画密切相关的3个属性，分别为 **stroke，stroke-dasharray** 和 **stroke-dashoffset。**

stroke：是用来定义边框的颜色。

stroke-dasharray：定义 dash 和 gap 的长度。它主要是通过使用 , 来分隔实线和间隔的值。其实就是用来实现 CSS 中边框虚线的效果。和 CSS 中的 dash 的效果一样。例如：stroke-dasharray="5, 5" 表示，按照实线为 5，间隔为 5 的排布重复下去。如下图：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676dcae65b87d7b~tplv-t2oaga2asx-image.image)

stroke-dashoffset：用来设置 dasharray 定义 dash 线条开始的位置。值可以为 number || percentage。百分数是相对于 SVG 的 viewport。通常结合 dasharray 可以实现描边动画效果。

介绍完关于 path 的所有 stroke 属性之后，下面就来解释下 SVG 线条描边动画的原理。简单来说，就是通过 stroke-dashoffset 和 stroke-dasharray 来做。主要是以下两个步骤：

1. 通过 dasharray 将实线部分增加至全长。比如：一条 path 的长度为300，如果把 SVG 中 path 的 stroke-dasharray 的值设置为300,300，即表示这条 path 将会按照实线为 300，间隔为 300 的排布重复下去。所以默认的情况下，我们只会看到一条300长度的实线，间隔300的线段由于已经在画布外，所以是不可见的。

2. 同时，通过 stroke-dashoffset 来移动新增的实线部分，造成线段移动的效果。比如由: stroke-dashoffset:500 变为 stroke-dashoffset:0。

这样讲解有点抽象，我们来通过一个简单的实例来演示下，更直观些。

首先是一条长度为300的直线：


```
<svg x="0px" y="0px" width="300px" height="100px" viewBox="0 0 300 100" class="svg1">
  <line x1="20" y1="50" x2="200" y2="50" stroke="#000" stroke-width="1" ></line>
</svg>
```

样式为：


```
.svg1 line {
    stroke-dasharray:300,300;
    stroke-dashoffset:300;
}
```

因为 stroke-dasharray 和 stroke-dashoffset 的值都是300，所以这条线段在网页初始化的时候，是看不见的。当我们把 stroke-dashoffset 的值设置为0的时候，它就可以显示出来，如下动图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676df7f0bf89f9f~tplv-t2oaga2asx-image.image)

从上面这个图中，大家就可以更加直观的理解 SVG 描边效果的一个实现原理，再配合下 CSS 中 transition 或者是 animation 就可以轻松的实现一个描边的动画效果。

我们把 CSS 稍微改一下，添加一个 transition 属性：


```
.svg1 line {
    stroke-dasharray:300,300;
    stroke-dashoffset:300;
    transition:all 2s linear;
}
```

这样当我们把 stroke-dashoffset 的值设置为0的时候，一个描边动画效果就完成来，来看下动图理解下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676e08a84364e84~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/LgVZxb)

### 描边动画实战

理解描边动画的原理后，下面我们就来实现本文刚开头提到的 SVG 描边动画效果。

首先在软件中设计好这个图形，然后导出 SVG 代码：

```
<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
  <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
  <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
</svg>
```

再来看下这个效果：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676dcae65adde18~tplv-t2oaga2asx-image.image)

初始状态是各个元素都没有显示，需要描边的动画效果是圆圈和中间的钩，在 SVG 代码也可以看到，圆圈的 fill 属性的值是 none，也就是没有填充颜色。而它们的描边动画则需要使用样式来设置，初始化的时候只需要把 path 元素的 stroke-dasharry 和 stroke-dashoffset 的值设置为 path 的长度的值就可以了，很简单代码如下所示：

```
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke: #7ac142;
  fill: none;
}

.checkmark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  margin: 10% auto;
  box-shadow: inset 0px 0px 0px #7ac142; 
}
.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
}

```

至于 path 的长度怎么获取，我们可以使用这个 JavaScript 的 API 来获取，只需要执行下面这两行代码就可以获取整条 path 的长度：

```
var path = document.querySelector('path');
var length = path.getTotalLength();
```

首先是圆圈和钩的线条描边动画，只需要使用关键帧把 stroke-dashoffset 设置为0就可以了。

```
@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}
```

然后是填充和缩放动画：

```
@keyframes scale {
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}
@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #7ac142;
  }
}
```

这两个动画主要是使用来 transform 和 box-shadow 这两个属性来实现的。

完整代码如下所示：

```
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke: #7ac142;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  margin: 10% auto;
  box-shadow: inset 0px 0px 0px #7ac142;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes scale {
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}
@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #7ac142;
  }
}
```
一个简单 SVG 描边动画就完成了。

这篇教程，只是简单的介绍了下 SVG 配合 CSS，就可以做出非常好玩的描边动画效果。配合 CSS 其它的属性，比如 transform，opacity 等，还可以做出更多有趣的动画效果。凡是使用 CSS 和 HTML 能实现的动画效果，SVG 一样可以实现。反过来，使用 SVG 能做的动画效果，HTML 就只能望洋兴叹了。

下一章节来介绍下 SVG 中的蒙版在动画中的运用。