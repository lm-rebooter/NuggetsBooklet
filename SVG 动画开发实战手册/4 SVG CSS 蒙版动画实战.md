## SVG 蒙版动画

这一章节来讲讲 SVG 中的蒙版(mask)也可以叫遮罩和裁剪路径(clip-path)在制作动画中的一些使用方法。为了行文方便，下面就统称蒙版和裁剪。
## 裁剪和蒙版
### 共同点
首先它们的共同点都是用来隐藏元素的一些部分、显示其他部分的。也就是在蒙版或者是裁剪定义的区域内是可见的，在区域外是不可见的。
### 区别
蒙版使用的是图像，裁剪使用的是路径。

蒙版是一种容器，它定义了一组图形并将它们作为半透明的媒介，可以用来组合前景对象和背景。

裁剪路径和其它的蒙版一个重要的区别就是：裁剪路径覆盖的对象要么就是全透明(可见的，位于裁剪路径内部)，要么就是全不透明(不可见，位于裁剪路径外部)。而蒙版可以指定不同位置的透明度，可以使用渐变等属性来定义。

这么说可能还不是很明白，下面用两个简单的实例来解释下它们的区别：
### 裁剪实例
```
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="200" height="200">
  <defs>
    <clipPath id="cut-off-bottom">
      <rect x="0" y="0" width="200" height="100" />
    </clipPath>
  </defs>
  <circle cx="100" cy="100" r="100" clip-path="url(#cut-off-bottom)" />
</svg>
```
在 SVG 中我们使用**clip-path**元素来表示裁剪路径。

在上面的代码中，我们使用 circle 元素定义来一个半径为100的圆形。然后使用 clip-path 属性定义了一个宽为200，高为100的 rect 元素矩形。这里要注意的一点的是，clipPath 元素经常放在一个defs元素内。

然后我们在 circle 元素中使用 **clip-path** 属性来引用已经定义好的 ID 为 cut-off-bottom 的裁剪路径。因为裁剪路径的宽和高分别为200和100，而圆圈的直径是200，而圆圈的下半部分因为没有在裁剪路径的范围内，所以最终呈现的效果是圆圈的下半部分消失了，如下图所示：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676ec4e2f31ecc0~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/gBLXKV)

### 蒙版实例

在 SVG 中，使用 **mask** 元素来表示蒙版。上面说过，蒙版可以指定不同位置的透明度，可以使用渐变等属性来定义蒙版。

```
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

  <defs>
    <linearGradient id="Gradient">
      <stop offset="0" stop-color="white" stop-opacity="0" />
      <stop offset="1" stop-color="white" stop-opacity="1" />
    </linearGradient>
    <mask id="Mask">
      <rect x="0" y="0" width="200" height="200" fill="url(#Gradient)"  />
    </mask>
  </defs>
  <rect x="0" y="0" width="200" height="200" fill="green" />
  <rect x="0" y="0" width="200" height="200" fill="red" mask="url(#Mask)" />
</svg>
```
上面的代码中，我们定义了一个 mask 元素，它的内容是一个单一的 rect 元素，它填充了一个透明到白色的渐变。作为红色矩形继承 mark 内容的 alpha 值（透明度）的结果，所以我们看到一个从绿色到红色渐变的输出：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676ec5b9db06250~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/NObwBx)

一图胜千言，来张图总结下裁剪和蒙版的区别：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676ec661fcef5e6~tplv-t2oaga2asx-image.image)

ok，裁剪和蒙版的基本知识就这些了，下面我们来看看如何使用裁剪和蒙版来制作一些有趣的动画效果。

## 裁剪动画效果

第一个动画效果是用 SVG 中的裁剪来做一个如下图所示的动画效果：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676ec7674d777dc~tplv-t2oaga2asx-image.image)

原理其实很简单，我们在 SVG 中先定义一个 clip-path 元素，并且是引用了一个带单个 circle 元素的 clipPath 元素，然后在 SVG 中使用 image 元素来引入图片并且使用 clip-path 属性引用我们定义的 clip-path 元素。这样初始的时候，图片只会显示我们定义好里面的部分，其余部分不可见。代码如下所示：

```
<svg viewBox="0 0 1400 800">
<title>Animated clip-path SVG</title>
<defs>
<clipPath id="cd-image-1">
<circle id="cd-circle-1" cx="110" cy="400" r="60"/>
</clipPath>
</defs>
<image height='800px' width="1400px" clip-path="url(#cd-image-1)" xlink:href="img.jpg"></image>
</svg>
```

具体到我们这个实例中就是，图片初始的时候只会显示半径为60的这个区域里，如下图所示：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676ec854003be9e~tplv-t2oaga2asx-image.image)

那怎么让它动起来呢？

其实就是动态改变 clip-path 元素中 circle 元素的半径的值即 r 的值。我们这里使用的是 CSS3 中的 animation 方法来做的，点击图片区域的时候添加一个类来改变 clip-path 中 circle 元素的 r 的值来做到的，代码非常简单如下图所示：

```
.visible #cd-image-1 circle { 
    animation: visible-clippath 1s linear forwards; 
}
@keyframes visible-clippath {
    to {
    r:1364;
    }
} 
```

有没有觉得很简单，简单的几行代码就可以做出这样有趣的动画效果。

详细的代码可以查看[在线的地址来](https://codepen.io/janily/pen/jeLoyr)查看。

上面这个只是简单的实例，充分发挥想象力，我们还可以做出更有趣的动画效果。

## 蒙版动画实战

### 手写文字动画效果

下面来看下第一个蒙版动画实例，是一个手写文字动画，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676ecb1daf69187~tplv-t2oaga2asx-image.image)

这个效果是蒙版和 path 动画相结合使用来实现的，至于 path 动画这里就不细说了，可以看看上一篇CSS 动画实战教程，里面有详细的说明。

首先在 AI 中用文字工具选择适当的字体写下你想写的文字，然后选择文字菜单中的创建轮廓命令把文字转化为路径(path)元素导出为path数据：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676ed49b6f6c9ea~tplv-t2oaga2asx-image.image)

现在转化为了 path 元素，那怎么让它一笔一笔写出来呢？

你也许觉得现在不都导出了 path 元素了么，直接使用 stroke-dashoffset 和 stroke-dasharray 来做动画不就行了不，那就太天真了。

因为我们的文字是直接转换为 path 元素的，不能控制它的起始位置，直接来使用它的 path 来做动画效果的话，就不能制作出从左到右一笔一笔写出来的动画效果，这样效果就不是很理想。所以我们还得用钢笔工具一笔一笔从左到右照着文字的轮廓勾画出字的路径，然后导出为 path 元素。如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676ed5cf06e63bc~tplv-t2oaga2asx-image.image)

如上图所示，我们使用了钢笔工具按照图中文字的从左到右重新勾画出了新的文字路径。

然后把它定义在 mask 中，使用 stroke-dashoffset 和 stroke-dasharray 来制作出动画效果。

代码如下所示：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676ed9df1dda7e1~tplv-t2oaga2asx-image.image)

从代码中可以看到，我们把重新勾画得到的文字路径定义在 id 为 mymask 的蒙版中，然后在下面的文字路径组中引用我们定义好的蒙版，

然后使用 CSS3 的 animation 来操作 stroke-dasharray 和 stroke-dashoffset 就可以实现一个文字书写的动画效果，这就非常的简单了

[代码演示地址](https://codepen.io/janily/pen/WYPPPo)。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676ee77d2f312d3~tplv-t2oaga2asx-image.image)

### SVG AI源文件下载：

[tony.ai](https://attachments-cdn.shimo.im/Ag0LDgPYagUXX4s9/tony.ai)

### 渐变显示文字动画效果

由于蒙版可以允许使用渐变等属性来定义透明区域，利用这一特性可以制作出渐变显示文字的动画效果。如下图所示：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676ebf9ec5162bf~tplv-t2oaga2asx-image.image)

先来定义一个矩形并引用一个白色有透明度渐变的蒙版，代码如下所示：

```
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 300" version="1.1">
  <defs>
    <linearGradient id="gradient" gradientUnits="userSpaceOnUse" gradientTransform="rotate(0)" x2="800" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="0.25" stop-color="#FFFFFF" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="1"/>
    </linearGradient>
    <mask id="mask" maskUnits="userSpaceOnUse">
      <rect width="800" height="300" fill="url(#gradient)"/>
    </mask>
    <text id="txt" x="400" y="150" font-family="Arial Black" font-size="60" text-anchor="middle">ISUX AWESOME</text>
  </defs>
  <use xlink:href="#txt" fill="#FFDD00" mask="url(#mask)"/>
  </svg>
```

然后在文字元素中引用这个蒙版，并且动态改变渐变的 transform 属性中的 rotate 值，就可以得到我们上面的这种渐变显示文字的动画效果。这里我使用了一点点 js(基于tweenmax这个库的技术) 来控制 rotate 的值，代码如下所示：

```
// 循环播放动画
  var tl = new TimelineMax({
    repeat: -1
  });

  // 获取svg中渐变的transform属性
  var gradient      = document.getElementById('gradient'),
      gradient_attr = gradient.getAttribute('gradientTransform');

  // 改变渐变transform的rotate属性
  for(var i = 0, l = 360; i <= l; i++) {
    tl.to(gradient, 0.01, {
      attr: {
        gradientTransform: 'rotate(' + -i + ')'
      },
      ease: Linear.easeInOut
    })
  }
```

轻松的就实现了渐变显示文字的动画效果。

[代码演示地址](https://codepen.io/janily/pen/aQXXMj)。

OK，SVG 的蒙版动画大概就这些了。SVG 蒙版的使用场景远不止如此，只要发挥你的想象力，完全可以做出更加有趣的动画效果。

这里推荐一些使用SVG的网站，来[看看SVG一些脑洞大开的玩法](http://www.awwwards.com/websites/svg/)。

