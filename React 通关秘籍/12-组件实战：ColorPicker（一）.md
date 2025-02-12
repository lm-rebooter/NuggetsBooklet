选择颜色是常见需求，想必大家都用过 ColorPicker 组件。

比如 Chrome DevTools 的这个：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70b63054318548fa82b2a24d7c3fbcfe~tplv-k3u1fbpfcp-watermark.image?)

antd 也有 ColorPicker 组件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd74bb11e1fc41da9cf01281eb0a655e~tplv-k3u1fbpfcp-watermark.image?)

其实浏览器原生也支持 color 类型的 input：
```html
<input type="color"/>：
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd93cd2b8b574651a33052c5f83f78a7~tplv-k3u1fbpfcp-watermark.image?)

功能更强大，还支持网页颜色吸取。

兼容性也很不错：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4cdf86413c8445faf9118e3e9c02f0a~tplv-k3u1fbpfcp-watermark.image?)

那为什么 antd 还在 5.5 版本实现一个 ColorPicker 呢？

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5102f76b104b40d4b4a1be2a98f29e29~tplv-k3u1fbpfcp-watermark.image?)

主要是为了统一 UI，因为浏览器原生组件各个浏览器都不一样。

比如 safari 的 \<input type="color"/> 是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65d26bb69984430992cf77260cf45026~tplv-k3u1fbpfcp-watermark.image?)

safari 的这个做的还挺复杂的，还有一个原生的窗口来做选择，支持的功能挺多：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a073b8e2ce4d484bbfb38d1d9defed77~tplv-k3u1fbpfcp-watermark.image?)

但这样会导致产品在各个浏览器的体验是不一致的。

出于这个原因，我们会用 antd 的 ColorPicker 组件，而不是原生的 color 类型的 input。

那这个颜色选择组件是怎么实现的呢？

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc166c5f1eb548bd8f4e38796ab25705~tplv-k3u1fbpfcp-watermark.image?)

这就要学习一些颜色的知识了。

颜色有很多种表示法，RGB 是最常用的，分别是 red、green、blue，还可以用十六进制标识法 #FFFFFF

R、G、B 的取值范围是 0 到 255。

颜色用空格或者逗号分隔都行，最后的 / 后面是透明度，可以用百分比或者小数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92a56b379e12489fbcf88b4dacf4a21b~tplv-k3u1fbpfcp-watermark.image?)

此外，HSL 标识法也很常用，分别是色相、饱和度、亮度，/ 后面是透明度。

色相的取值范围是 0 到 360

饱和度和亮度都是 0% 到 100%

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/338fa3357213456592f349060618d1a9~tplv-k3u1fbpfcp-watermark.image?)

那为什么还会有 0.3turn、150deg 这种单位呢？

因为色相是色相环上的颜色：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3592e184efc42c2bf2355d8912328a8~tplv-k3u1fbpfcp-watermark.image?)

美术生应该很熟悉这种色相环，什么相差 60 度是邻近色、相差 180 度是互补色等等。

所以色相的取值范围是 0 到 360 也就是共 360 度。

0.3 turn 就是一圈的 0.3 的地方的颜色，而 150 deg 就是 150 度的地方的颜色。

有 RGB 不就好了么？为啥还要搞个 HSL？

红绿蓝是计算机存储颜色的方式，它喜欢这种表示法，可以直接用来显示颜色。

但是对人来说，是不是还是明暗关系、色彩饱和度更容易理解一点？

所以选色的时候都是基于色相、饱和度、亮度这些东西，但存储的时候使用 RGB，最后屏幕显示颜色也是基于 RGB的。

此外，还有 HSV/HSB，这俩用明度而不是亮度，都是差不多的东西：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dc7df452f644c66ab1a95e90f484574~tplv-k3u1fbpfcp-watermark.image?)

所以说，HSL 对人很友好，调解下明暗度、色彩饱和度等很直观。在网页里支持 RGB 和 HSL 这俩表示法。

颜色选择器一般都是基于 HSL 来做的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95f615bbbe1543c5b40bc3dee2f0fe67~tplv-k3u1fbpfcp-watermark.image?)

你拖动下面的色彩条的时候，调节的就是色相环的位置，色相环为 0 的时候是红色、色相环 360 的时候也是红色，正好转一圈。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b97f49a8115490b9fccdea513a1a180~tplv-k3u1fbpfcp-watermark.image?)

你拖动上面的滑块的时候，调节的就是饱和度和亮度。

图中可以看到色相没变，往下滑亮度减少、往左滑饱和度减少。

是不是很直观？调节颜色的体验很好？

那如果用 RBG 来做这种颜色调节呢？

safari 的颜色选择器里就有这个，是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f232cf61064421dbbbb2df6cb8345c2~tplv-k3u1fbpfcp-watermark.image?)

是不是用起来一脸懵逼？

怎么就变成粉色了，怎么又变紫色了？

不止你懵逼，设计师用起来也懵逼。

所以颜色选择器一般都是 HSL 的，调节色相、饱和度、亮度这三者，而不是直接调节 RGB。

最后显示的时候才转成 RGB。

rgb 和 hsl 的互转算法都是固定的，可以安装用 [@swiftcarrot/color-fns](https://www.npmjs.com/package/@swiftcarrot/color-fns) 这个包来做：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8506009211dc4300b5072ddfb3756f07~tplv-k3u1fbpfcp-watermark.image?)

然后我们具体来看下 ColorPicker 的每一部分怎么实现：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/613a6c76ae4349abb0b010bc303a0b72~tplv-k3u1fbpfcp-watermark.image?)

下面这个透明度滑块很容易理解，拖动改变的是透明度，从 0% 到 100%，

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fce26288128f49ee826bba0af06aa527~tplv-k3u1fbpfcp-watermark.image?)

滑块设置一个渐变背景就行。

上面色相的滑块也差不多，取值范围是 0 到 360

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7424ebb016a742b695157e806ce1d561~tplv-k3u1fbpfcp-watermark.image?)

但它的渐变设置比较麻烦，不是两个颜色的渐变。不然从红色渐变到红色么？

而是根据取色相环不同角度的颜色来设置渐变：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3592e184efc42c2bf2355d8912328a8~tplv-k3u1fbpfcp-watermark.image?)

比如取 0、60、120、180、240、360 这些角度共 7 个颜色来渐变：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3a49ee68d084a87bb3812ef9b39fd3a~tplv-k3u1fbpfcp-watermark.image?)

取出的值是 0 到 360 的色相值。

最后，上面的调整饱和度亮度的部分又是怎么实现的呢？

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/faaae949de7f40d7a49713490c51495f~tplv-k3u1fbpfcp-watermark.image?)

其实也很简单，也是加了渐变，把渐变去掉就是纯色了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8755aa92d994a0bb57c735a058e0d02~tplv-k3u1fbpfcp-watermark.image?)

一共两个渐变：

从下到上是黑色到透明的渐变。

然后从左到右是从白到透明的渐变。

这样，就可以根据 left、top 的值，计算出饱和度和亮度的值，从上到下饱和度从 100% 到 0%，从由向左饱和度从 100% 到 0%。

这样通过 3 个滑块，就实现了任意透明度、任意色相、亮度、饱和度的颜色的选取。

之后再转成计算机喜欢的 RGB 就好了。

这就是 ColorPicker 的实现原理。

有同学可能会问，那这个吸色器呢？

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/480d6baa87be4f0e88a9991dd87688e5~tplv-k3u1fbpfcp-watermark.image?)

这个东西可不是网页里实现的，这个是原生组件，浏览器底层可以很方便的拿到网页渲染的结果，然后取色。

不过浏览器现在也有这个 api 了，叫做 EyeDropper

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ec15e8998d24a5d8bfe9c3fe73e8451~tplv-k3u1fbpfcp-watermark.image?)

用起来很简单：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fef4690ac3148c3b8abed473338cec5~tplv-k3u1fbpfcp-watermark.image?)

效果也很好：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fc936972a85421f8d044e9978dcbeb0~tplv-k3u1fbpfcp-watermark.image?)

但是你看看这个惨不忍睹的兼容性：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bd493e04b6c41a3807d12f04de13570~tplv-k3u1fbpfcp-watermark.image?)

如果你要吸取颜色，还是用原生组件 \<input type="color"/>好了。

## 总结

选择颜色是常见需求，可以用浏览器的 \<input type="color"/> 的原生标签，也可以用 antd 的 ColorPicker 组件。

原生标签虽然支持的功能多，但是各个浏览器实现不一致。

实现这样的颜色选择组件，需要了解颜色表示法：

网页支持的颜色表示法有 RGB、HSL 两种：

RGB 是计算机喜欢的颜色表示法，可以直接用红绿蓝来显示颜色。

HSL 是人更喜欢的颜色表示法，用色相、饱和度、亮度来表示颜色，最后转成 RGB。

（HSV/HSB 和 HSL 是一样的东西，只不过叫明度而不是亮度）

ColorPicker 一般都是用 HSL 来实现的，通过滑块调节色相、饱和度、亮度，显示的时候加上几个渐变，就能实现这种组件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/689b202d2ee34d03bcf1b87afad4bd0a~tplv-k3u1fbpfcp-watermark.image?)

理解了 HSL 颜色表示法，下节我们自己实现下 ColorPicker 组件。
