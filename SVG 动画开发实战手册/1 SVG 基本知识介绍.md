## SVG概述
### SVG基本介绍
SVG 是一种开放标准的矢量图形语言，即表示可缩放矢量图形（Scalable Vector Graphics）格式，是由万维网联盟（W3C）开发并进行维护的。

那 SVG 都有哪些优点呢？

由于 SVG 图像是矢量图像，可以无限缩小放大，所以 SVG 可以在任何分辨率的设备上高清显示，不需要再像以前一样输出各种 **@2x** 倍图来适配不同分辨率的屏幕。

而且有非常成熟的设计工具支持导出 SVG 的图形格式，比如，AI 或者是 Sketch 等设计软件都支持直接导出 SVG 的图形格式，非常方便。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/28/1693309201182bd7~tplv-t2oaga2asx-image.image)

而且，因为 SVG 还是一种 XML 格式的图形，所以我们可以使用 CSS 和 JavaScript 与它们进行交互，这使得 SVG 在动画方面有着很大潜力和想象力。

### SVG兼容性

而现在随着浏览器变得越来越好，现在我们可以安全地使用 SVG 图像，对于对 SVG 支持不是很好的设备和浏览器，我们也有很多的降级方案来使用 SVG。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/28/1693400d3c51d375~tplv-t2oaga2asx-image.image)

从上图可以看出，主流的平台设备已经可以很好的支持 SVG，特别是在移动端可以放心大胆的使用 SVG 来开发。下面先来了解下 SVG 基本的知识。
## SVG基本知识
### SVG基本形状
先来看下面这组代码：

```
<svg x="0px" y="0px" width="300px" height="100px" viewBox="0 0 300 100">
  <rect x="10" y="5" fill="white" stroke="black" width="90" height="90"></rect>
  <circle cx="170" cy="50" r="45" fill="white" stroke="black"></circle>
  <line fill="none" stroke="black" x1="230" y1="6" x2="260" y2="95"></line>
</svg>
```
表现结果如下图所示：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/4/16946735b02144b6~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/EprZPe)

在上面的代码中，我们定义了3种不同的形状，**rect** 是用来定义矩形或者是正方形，其中
x和y属性，相对于 **svg** 元素进行定位，在这个例子中是相对 **svg** 左上角进行定位的。

**fill** 表示填充形状的颜色，**stroke** 表示边框的颜色。如果没有指定值，则它们的默认值是 **fill:black，** 和 **stroke:none** 即表示没有描边。

**circle** 顾名思义，就是用来定义一个圆：

```
<circle cx="170" cy="50" r="45" fill="white" stroke="black"></circle>
```

cx 和 cy 定义的是圆心坐标，r 为圆的半径。当然，也可以使用 **ellipse** 元素来绘制椭圆形，只不过是多了两个参数：rx（短轴长）和 ry（横轴长）。
比如下面代码就表示一个短轴长为 100，横轴长为50的椭圆。

```
<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="50" rx="100" ry="50" />
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/28/1693317fdae5bbb3~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/XGmjeO)

从代码可以看出，SVG 的语法非常简单。在根结点 SVG 中，x 和 y 两个属性的值为0，(0,0)点是SVG坐标系统的起点。同时 width 和 height 都指定来对应的宽和高。

**line** 表示一条直线，也非常的简单：

```
<line fill="none" stroke="black" x1="230" y1="6" x2="260" y2="95"></line>
```

x1和y1为直线的起点，x2和y2表示线的终点。 
### viewBox
SVG 的 **viewBox** 是一个非常强大的属性，它可以精确的控制和定义SVG的可视空间。它实际上可以看做是一个定义了可视范围的坐标系统。

实际上我们在不设置 viwebox 的时候，viewbox 整个范围就是 viewport 的大小，如果指定了 viewbox 的话，则表示，我只需要表现这个区域的东西，我们用一张图来对 viewbox 进行下说明。

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/28/16932fff571cf24d~tplv-t2oaga2asx-image.image)

感谢[oxxostudio](https://github.com/oxxostudio)提供的图片说明

从上面的代码可以看到，viewBox 有4个参数需要设置，x、y、width、height。并且都是没有带单位的，是因为 SVG 可视空间并不是基于像素来设定的，而是一个任意扩展的空间，这样就可以适用于不同尺寸的空间。

我们来看一个实际的例子来演示 viewBox 的用法。

```
<svg width="400" height="300" style="border:1px solid blue;">
   <circle cx="10" cy="10" r="10" fill="blue"></circle>
</svg>
```
上面的代码是没有设置 viewBox，效果如下图所示：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/4/1694673fc4f1ab17~tplv-t2oaga2asx-image.image)

下面来设置下 viewBox：

```
<svg width="400" height="300" viewBox="0 0 20 20" style="border:1px solid blue;">
   <circle cx="10" cy="10" r="10" fill="blue"></circle>
</svg>
```
因为我们的圆的半径是10，所以圆的直径就是20。而我们的 viewBox 后面的两个值为都为20，则相当于在SVG画布的左上角画来一个20x20的框，然后把这个框放大填充整个 SVG 区域，即告诉 SVG 我只需要展现这个区域内的内容，效果如下图所示：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/4/1694674301464393~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/oMmZqZ)

### SVG组合和路径
下面来介绍下在 SVG 动画开发中最重要的一个元素 path 即路径。

先来看一段代码：

```
<svg viewBox="0 0 580 400" xmlns="http://www.w3.org/2000/svg">
<g>
  <path id="svg_5" d="m148.60774,139.10039c28.24222,-69.1061 138.89615,0 0,88.8507c-138.89615,-88.8507 -28.24222,-157.9568 0,-88.8507z" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="none"/>
  <path id="svg_6" d="m265.00089,146.09396l19.88082,-21.09307l21.11909,22.40665l21.11909,-22.40665l19.88101,21.09307l-21.11909,22.40684l21.11909,22.40684l-19.88101,21.09326l-21.11909,-22.40684l-21.11909,22.40684l-19.88082,-21.09326l21.11891,-22.40684l-21.11891,-22.40684z" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="none"/>
 </g>
</svg>
```
结果如下图所示：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/4/1694674797d67a67~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/vPNyVj)

这里需要注意一点的是，这个 SVG 中我们没有定义 width 和 height，实际上，我们把 SVG 的 width 和 height 定义在外部的 CSS 中。

```
svg {
  width:580px;
  height:400px;
}
```
虽然没有在 SVG 标签中声明 width 和 height，SVG 依然可以继承包含自身的父级元素的 width 和 height。

然后是 g 标签即 group 组，它可以用来集合多个 SVG 元素，比如上面的两个 path 元素。而且 g 所设置的 fill 和 stroke 可以直接应用到没有设置相关属性的子元素。

最后来解释下path元素的语法，路径起始于 d 属性，即 data，也就是一条路径的绘图数据。d 一般是以一个 M 或者是 m（moveTo）为第一个值，即确定一个起点。

下面来看看 path 语法中的各种命令的含义。

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/28/16932ffeed1ea5ba~tplv-t2oaga2asx-image.image)
## SVG使用方法
那在实际开发中，如何来使用 SVG 呢？现在主流是有以下3种使用用法：
### 在<img>标签里应用SVG图片
直接在 img 标签里，导入你的 SVG 文件：

```
<img src="emoj.svg" alt="emoj">
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/28/169333925cc1d858~tplv-t2oaga2asx-image.image)

### 使用SVG作为背景图片
定义 SVG 图片为背景图片也很简单，直接在 CSS 里定义背景图片就可以了。

```
<a href="/" class="emoji">
	emoji
</a>
```
CSS：

```
 .emoji {
   display: block;
   text-indent: -9999px;
   width: 100px;
   height: 82px;
   background: url(emoji.svg);
   background-size: 100px 82px;
 }
```

这里的 CSS 我们用了一个很常见的  CSS 技巧，以图换字，用图片来代替文字。你如果不知道实际SVG图片的大小，你可以使用 **background-size** 来定义背景图片的大小。

如果您想要 SVG 与您的脚本进行任何交互，它必须以内联的方式加载到 HTML 中。即下面要讲到的内联 SVG 的使用方法。
### 内联（inline）应用SVG
所谓内联，就是直接把 SVG  代码插入到html文件中，使用你喜欢的编辑器打开 SVG 文件，就可以得到 SVG 图片的代码如下所示，然后把它插入到html文件中就可以了。

```
<body>
<svg width="128" height="128" style="enable-background:new 0 0 128 128;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <path d="M63.89,9.64C1.58,9.64,0.1,79.5,0.1,93.33c0,13.83,28.56,25.03,63.79,25.03 c35.24,0,63.79-11.21,63.79-25.03C127.68,79.5,126.21,9.64,63.89,9.64z" style="fill:#FCC21B;"/>
  <g>
    <defs>
      <path id="SVGID_1_" d="M63.89,98.06c23.15,0.05,40.56-12.97,41.19-29.05c-27.24,4.91-55.14,4.91-82.38,0 C23.33,85.09,40.74,98.11,63.89,98.06z"/>
    </defs>
    <use style="overflow:visible;fill:#FFFFFF;" xlink:href="#SVGID_1_"/>
    <clipPath id="SVGID_2_">
      <use style="overflow:visible;" xlink:href="#SVGID_1_"/>
    </clipPath>
    <g style="clip-path:url(#SVGID_2_);">
      <path d="M78.05,108c-1.1,0-2-0.9-2-2V61.07c0-1.1,0.9-2,2-2s2,0.9,2,2V106C80.05,107.1,79.16,108,78.05,108 z" style="fill:#2F2F2F;"/>
    </g>
    <g style="clip-path:url(#SVGID_2_);">
      <path d="M92.21,108c-1.1,0-2-0.9-2-2V61.07c0-1.1,0.9-2,2-2s2,0.9,2,2V106C94.21,107.1,93.32,108,92.21,108 z" style="fill:#2F2F2F;"/>
    </g>
    <g style="clip-path:url(#SVGID_2_);">
      <path d="M63.89,108c-1.1,0-2-0.9-2-2V61.07c0-1.1,0.9-2,2-2s2,0.9,2,2V106 C65.89,107.1,64.99,108,63.89,108z" style="fill:#2F2F2F;"/>
      <path d="M49.72,108c-1.1,0-2-0.9-2-2V61.07c0-1.1,0.9-2,2-2s2,0.9,2,2V106 C51.72,107.1,50.83,108,49.72,108z" style="fill:#2F2F2F;"/>
      <path d="M35.56,108c-1.1,0-2-0.9-2-2V61.07c0-1.1,0.9-2,2-2s2,0.9,2,2V106 C37.56,107.1,36.67,108,35.56,108z" style="fill:#2F2F2F;"/>
    </g>
  </g>
  <path d="M64.01,100.56h-0.25c-24.13,0-42.86-13.52-43.56-31.46c-0.03-0.76,0.29-1.49,0.86-1.98 c0.57-0.5,1.33-0.71,2.08-0.57c26.82,4.84,54.67,4.84,81.5,0c0.75-0.14,1.51,0.08,2.08,0.57c0.57,0.5,0.89,1.23,0.86,1.98 C106.87,87.04,88.14,100.56,64.01,100.56z M63.88,95.56h0.13c19.55,0,35.56-10.1,38.2-23.52c-25.29,4.18-51.36,4.18-76.65,0 c2.64,13.42,18.65,23.52,38.2,23.52H63.88z" style="fill:#2F2F2F;"/>
  <path d="M31.96,54.45c-0.78,1.28-2.44,1.7-3.73,0.93c-1.29-0.77-1.71-2.42-0.96-3.71 c0.18-0.31,4.6-7.62,14.37-7.62c9.78,0,14.2,7.31,14.39,7.62c0.76,1.29,0.32,2.97-0.97,3.73c-0.44,0.26-0.91,0.38-1.39,0.38 c-0.92,0-1.83-0.47-2.34-1.32c-0.13-0.22-3.12-4.96-9.69-4.96C35.07,49.49,32.1,54.24,31.96,54.45z" style="fill:#2F2F2F;"/>
  <path d="M100,55.39c-0.43,0.26-0.91,0.38-1.37,0.38c-0.94,0-1.85-0.49-2.36-1.34 c-0.11-0.2-3.08-4.94-9.66-4.94c-6.69,0-9.66,4.89-9.69,4.94c-0.77,1.29-2.43,1.73-3.73,0.96c-1.29-0.76-1.73-2.44-0.96-3.73 c0.18-0.31,4.6-7.62,14.38-7.62c9.77,0,14.18,7.31,14.36,7.62C101.73,52.96,101.29,54.63,100,55.39z" style="fill:#2F2F2F;"/>
</svg>
</body>

```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/28/169333925cc1d858~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/ExxXBXe)

SVG 基本知识大概介绍到这里，下一章节将介绍 SVG 的导出和优化的一些建议。