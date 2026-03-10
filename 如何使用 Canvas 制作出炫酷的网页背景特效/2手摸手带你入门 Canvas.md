# 手摸手带你入门 Canvas 

## 创建 Canvas 画布
当我只在页面上写一个 Canvas 标签时，将其背景颜色设置为黑色，会是什么效果呢？
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        #canvas {
            background: #000;
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
</body>
</html>
```
我们打开浏览器来看一下：

![创建 Canvas 画布](https://user-gold-cdn.xitu.io/2017/11/21/15fddd0ac41789ce?w=1516&h=624&f=jpeg&s=67550)

在上面的例子中页面上只有一个 Canvas，没有设置宽高，那么会自动创建一个 300 * 150 的画布（单位默认为 `px`）。

那么我们怎么改变画布的大小呢，有三种方式
- HTML 设置 `width`、`height`；
- CSS 设置 `width`、`height`；
- JS 动态设置 `width`、`height`。

我们来试一下这三种方式。有的人会问了，这不是很简单的么，还有介绍的必要吗？这就和我们听数学课是一样的，那些很简单的知识点你就不注意听，然后 10 分钟过后，一脸懵逼的不知道老师在讲什么，或者说是遇到问题了不知道错在哪，往往也都是基础的问题没有仔细听~

### HTML 属性设置 `width`、`height`
我们先来看一下直接使用 HTML 属性来设置 `width`、`height`：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        #canvas {
            background: #000;
        }
    </style>
</head>
<body>
<canvas id="canvas" width="400" height="400">

</canvas>
<script>
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    context.beginPath();
    context.arc(100, 100, 50, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = 'rgb(255,255,255)';
    context.fill();
</script>
</body>
</html>
```
我们设置 Canvas 画布的宽度为 400，高度为 400，背景颜色为黑色（在 HTML 属性中直接设置宽度和高度是可以不加单位的，默认单位是 `px`）。在 Canvas 上画了一个圆心坐标为 100px、100px，半径为 50px 的白色的圆。来看一下浏览器中的显示效果：

![HTML 属性设置宽度高度](https://user-gold-cdn.xitu.io/2017/11/21/15fddf7f55e90c34?w=2876&h=984&f=jpeg&s=56453)

### CSS 属性设置 `width`、`height`
还是上面那个例子，这次我们将宽度和高度使用 CSS 来设置：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        #canvas {
            background: #000;
            width: 400px;
            height: 400px;
        }
    </style>
</head>
<body>
<canvas id="canvas">

</canvas>
<script>
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    context.beginPath();
    context.arc(100, 100, 50, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = 'rgb(255,255,255)';
    context.fill();
</script>
</body>
</html>
```
我们来看下浏览器中的显示效果：

![CSS 属性设置宽高](https://user-gold-cdn.xitu.io/2017/11/21/15fddfa24d991c6d?w=2878&h=868&f=jpeg&s=54176)

OMG ヽ(；´Д｀)ﾉ，怎么会是这个样子，我明明是要画一个圆啊，怎么变成椭圆了，是不是我代码写的有问题？

检查下代码，没问题呀o((⊙﹏⊙))o.那么为什么会显示成这个样子呢？

原来是因为如果使用 CSS 来设置宽高的话，画布就会按照 `300 * 150` 的比例进行缩放，也就是将 `300 * 150` 的页面显示在 `400 * 400` 的容器中。

### JS 属性设置 `width`、`height`
那我们再来看一下如果使用 JS 来设置宽高会是神马效果呢~
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        #canvas {
            background: #000;
        }
    </style>
</head>
<body>
<canvas id="canvas">

</canvas>
<script>
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    context.beginPath();
    context.arc(100, 100, 50, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = 'rgb(255,255,255)';
    context.fill();
</script>
</body>
</html>
```
在浏览器中的效果如下：
![JS动态设置宽度高度](https://user-gold-cdn.xitu.io/2017/11/21/15fddf7f55e90c34?w=2876&h=984&f=jpeg&s=56453)

这样就是正常的嘛~

所以我们尽量使用 HTML 的`width` 和 `height` 属性或者直接使用 JS 动态来设置宽高，不要使用 CSS 设置。

## 获取 Canvas 对象
在前面的例子中，我们已经创建了一个 Canvas 画布，那么第二步要做的就是获取到 Canvas 的上下文环境，对应的语法为：
`canvas.getContext(contextType, contextAttributes);` 
- 上下文类型（contextType）：
  - 2d（本小册所有的示例都是 2d 的）：代表一个二维渲染上下文
  - webgl（或"experimental-webgl"）：代表一个三维渲染上下文
  - webgl2（或"experimental-webgl2"）：代表一个三维渲染上下文；这种情况下只能在浏览器中实现 WebGL 版本2 (OpenGL ES 3.0)。

第二个参数并不是经常用到，所以这里就不给大家介绍了，有兴趣的可以查阅 MDN 文档~

通常在创建好一个 Canvas 标签的时候，我们要做的第一步就是要先获取到这个 Canvas 的上下文对象：
```js
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
```

## 绘制路径
使用过 PS 的应该都会知道在 PS 中有路径的概念，在 Canvas 中也有路径的概念。只不过和 PS 中的路径不同的是，PS 中的路径是矢量的，而 Canvas 中的路径不是。下面我们来看一下有哪些创建路径的方法：

方法 | 描述
---|---
`fill()` | 填充路径
`stroke()` | 描边
`arc()` | 创建圆弧
`rect()` | 创建矩形
`fillRect()` | 绘制矩形路径区域
`strokeRect()` | 绘制矩形路径描边
`clearRect()` | 在给定的矩形内清除指定的像素
`arcTo()` | 创建两切线之间的弧/曲线
`beginPath()` | 起始一条路径，或重置当前路径
`moveTo()` | 把路径移动到画布中的指定点，不创建线条
`lineTo()` | 	添加一个新点，然后在画布中创建从该点到最后指定点的线条
`closePath()` | 创建从当前点回到起始点的路径
`clip()` | 从原始画布剪切任意形状和尺寸的区域
`quadraticCurveTo()` | 创建二次方贝塞尔曲线
`bezierCurveTo()` | 创建三次方贝塞尔曲线
`isPointInPath()` | 如果指定的点位于当前路径中，则返回 true，否则返回 false

看完了上述方法你是不是有点不知所措，一下子这么多方法(╬￣皿￣)=○

你可以把上面的表格作为一个“字典”，在下面的代码中如果遇到不认识的方法可以查找一下，一回生，二回熟。

下面我将上面的方法分为以下几部分来给大家介绍下。

### 使用 Canvas 画一个点
我们先从最基本的开始，使用 Canvas 画一个点。其实画一个点也就相当于画一个半径为 1 的圆，那我们就可以改造这一节开始的例子，将半径由 50 变为 1。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        #canvas {
            background: #000;
        }
    </style>
</head>
<body>
<canvas id="canvas">

</canvas>
<script>
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    context.beginPath();
    context.arc(100, 100, 1, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = 'rgb(255,255,255)';
    context.fill();
</script>
</body>
</html>
```

让我们来看一下效果：

![使用 Canvas 画一个点](https://user-gold-cdn.xitu.io/2017/11/21/15fdef2b5e60b531?w=2876&h=840&f=jpeg&s=46319)

有没有看到左上部分有一个白色的点，没有看到？没有看到的同学点开大图看一下(／_＼)

细心的小伙伴可能会发现我们改动了哪里：
```js
context.arc(100, 100, 1, 0, Math.PI * 2, true);
```
将第三个参数由 50 改为了 1，聪明的你一定可以猜出来 `arc()` 这个方法的作用了。\（￣︶￣）/，稍后我们再介绍 `arc()` 函数。

先来看一下在获取完 Canvas 的上下文环境之后，我们又做了哪些操作：
```js
context.beginPath();       // 起始一条路径，或重置当前路径
context.arc(100, 100, 1, 0, Math.PI * 2, true);  // 创建弧/曲线
context.closePath();       // 创建从当前点回到起始点的路径
context.fillStyle = 'rgb(255,255,255)'; // 设置或返回用于填充绘画的颜色、渐变或模式
context.fill();            // 填充当前绘图（路径）
```
我们可以总结出，使用 Canvas 绘制图像的步骤：

![使用 Canvas 绘制图像的步骤](https://user-gold-cdn.xitu.io/2017/11/22/15fe148e8cf9d486?w=2330&h=482&f=jpeg&s=114987)

通过使用 Canvas 绘制一个点，我们了解了在 Canvas 中绘图的大致步骤，下面我们来看一下刚刚提到的 `arc()` 方法。


## 绘制弧/曲线
`arc()` 方法创建弧/曲线（用于创建圆或部分圆）。
```js
context.arc(x,y,r,sAngle,eAngle,counterclockwise);
```
- x：圆心的 x 坐标
- y：圆心的 y 坐标
- r：圆的半径
- sAngle：起始角，以弧度计（弧的圆形的三点钟位置是 0 度）
- eAngle：结束角，以弧度计
- counterclockwise：可选。规定应该逆时针还是顺时针绘图。false 为顺时针，true 为逆时针
- 
![图片来自 w3cschool](https://user-gold-cdn.xitu.io/2017/11/21/15fdf0929fbe015f?w=204&h=210&f=gif&s=1857)

比如我们想画一个顺时针的四分之一圆，应该怎么写呢？
```js
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    context.beginPath();
    context.arc(100, 100, 50, 0, Math.PI * 0.5, false);
    context.strokeStyle="white";
    context.stroke();
```

我们先来看一下浏览器中的效果：

![画一个顺时针的四分之一圆](https://user-gold-cdn.xitu.io/2017/11/22/15fe41d14b171fe5?w=2878&h=834&f=jpeg&s=44174)

是不是你想要的效果呢(๑´ㅂ`๑)

其实只要找好起始角和结束角就成功一半了呢。

因为我们设置的起始角是 0，对照 w3cschool 上的截图可知弧度的 0 的位置是 3 点钟方向，然后结束角我们设置为 0.5 PI，也就是 6 点钟方向，然后我们再设置描边颜色并且进行描边，就得出上图的效果。

这里你可能会问，为什么这个不是闭合的图形呢？因为我只设置了 beginPath 并没有设置 closePath，所以这就不是一条闭合的路径。我们加上 cloasePath 看一下效果。

![闭合图形](https://user-gold-cdn.xitu.io/2017/11/22/15fe4234b5e759a9?w=2878&h=838&f=jpeg&s=45006)

如果跟着我一起写代码的话你就会发现，这个是空心的，并没有整个路径都被填充，这是怎么回事呢？

这是因为 `stroke()` 和 `fill()` 的区别，根据上面的两个例子，我们很容易看出这两个函数的区别：一个是描边，一个是填充。

- `stroke()` ：描边
- `fill()` ：填充

我们可以通过 `strokeStyle`属性 和 `fillStyle`属性来设置描边和填充的颜色。这里不仅可以设置单一的颜色，还可以设置渐变。

### 绘制直线
下面我们来绘制一条线。
```js
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    context.beginPath();
    context.moveTo(50,50);
    context.lineTo(100,100);
    context.strokeStyle = '#fff';
    context.stroke();
```
我们来看一下浏览器中的效果：

![绘制直线](https://user-gold-cdn.xitu.io/2017/11/22/15fe430d0904b0fd?w=2878&h=832&f=jpeg&s=46505)

在绘制直线的例子中，我们使用了
- `moveTo(x,y)`：把路径移动到画布中的指定点，不创建线条
- `lineTo(x,y)`：添加一个新点，然后在画布中创建从该点到最后指定点的线条

这里需要注意以下几点：
- 如果没有 moveTo，那么第一次 lineTo 的就视为 moveTo
- 每次 lineTo 后如果没有 moveTo，那么下次 lineTo 的开始点为前一次 lineTo 的结束点。

也就是这种情况：
```js
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    context.beginPath();
    context.lineTo(200, 200);
    context.lineTo(200, 100);
    context.lineTo(100,50);
    context.strokeStyle = '#fff';
    context.stroke();
```
我们没有设置 moveTo，而是设置了三个 lineTo，这也是可以的，将三个 lineTo 设置的点依次连接就好~

效果如下：

![绘制直线](https://user-gold-cdn.xitu.io/2017/11/22/15fe45033e25f58e?w=2878&h=836&f=jpeg&s=49033)

在绘制了直线之后，我们来看一下怎么给绘制的直线添加样式：
样式 | 描述
---|---
`lineCap` | 设置或返回线条的结束端点样式
`lineJoin` | 设置或返回两条线相交时，所创建的拐角类型
`lineWidth` | 设置或返回当前的线条宽度
`miterLimit` | 设置或返回最大斜接长度

我们来看下这些 **属性** 是怎么使用的。
```html
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    context.beginPath();

    context.moveTo(10,10);
    context.lineTo(100,100);
    context.lineWidth = 10;
    context.lineCap = 'round';
    context.strokeStyle = '#fff';
    context.stroke()
```

![给直线添加属性](https://user-gold-cdn.xitu.io/2017/11/23/15fe80fe5707d56d?w=2878&h=838&f=jpeg&s=46446)

我绘制了一条由点 (10,10) 到点 (100,100) 的直线，然后将其宽度设置为 10，并且加上“圆角”的效果。

这里我们要注意区分哪些是方法哪些是属性，如果是方法，只需要在括号中传入参数就可以；如果是属性，那么我们就要使用等号给其赋值。有的时候你会奇怪，为什么我这么设置了但是却没有效果呢？很有可能是你将方法和属性搞混了哦 (●ﾟωﾟ●)

### 绘制矩形
在了解了最基本的绘制点、线的方法之后，我们来看一下如何绘制一个矩形。
```js
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    context.beginPath();
    context.fillStyle = '#fff';
    context.fillRect(10, 10, 100, 100);
    context.strokeStyle = '#fff';
    context.strokeRect(130, 10, 100, 100);
```
这里我们使用下面的方法： 
- `fillRect(x,y,width,height)`：绘制一个实心矩形
- `strokeRect(x,y,width,height)`：绘制一个空心矩形

同样的，我们可以通过 `fillStyle()` 和 `strokeStyle()` 来设置填充的颜色和描边的颜色。

## 颜色、样式和阴影
上面几个函数教大家怎么绘制点、线、以及圆形和矩形，都是通过先创建路径，然后再使用 `fill()` 或 `stroke()` 进行填充或者描边。

下面我们再具体看一下都可以给路径设置哪些属性来改变其样式。
属性 | 描述
---|---
`fillStyle` | 设置或返回用于填充绘画的颜色、渐变或模式
`strokeStyle` | 设置或返回用于笔触的颜色、渐变或模式
`shadowColor` | 设置或返回用于阴影的颜色
`shadowBlur` | 设置或返回用于阴影的模糊级别
`shadowOffsetX` | 设置或返回阴影距形状的水平距离
`shadowOffsetY` | 设置或返回阴影距形状的垂直距离

`fillStyle` 和 `strokeStyle` 这两个属性我们一直在使用，所以对于它们我们不再作过多的介绍。

### 设置阴影
设置阴影我们用到的是 `shadowBlur` 这个属性。
```html

    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    context.beginPath();
    context.arc(100,100,50,0,2*Math.PI,false);
    context.fillStyle = '#fff';
    context.shadowBlur = 20;
    context.shadowColor = '#fff';
    context.fill()
```
同样的方（tao）法（lu），我们只要在 `fill()` 方法之前设置模糊指数（`shadowBlur`）和颜色（`shadowColor`）就可以了。让我们来看一下浏览器中的效果：

![设置阴影](https://user-gold-cdn.xitu.io/2017/11/23/15fe859e34cf24d3?w=2876&h=820&f=jpeg&s=46979)

在暗色背景中有一个亮色的圆并且加了阴影效果，是不是很像发光的月亮呢(●´∀｀●)ﾉ

### 设置渐变
我们先来看一下怎么设置渐变：

方法 | 描述
---|---
`createLinearGradient()` | 创建线性渐变（用在画布内容上）
`createPattern()` | 在指定的方向上重复指定的元素
`createRadialGradient()` | 创建放射状/环形的渐变（用在画布内容上）
`addColorStop()` | 规定渐变对象中的颜色和停止位置


其中绘制渐变主要用到了 `createLinearGradient()` 方法，我们来看一下这个方法：
`context.createLinearGradient(x0,y0,x1,y1);`
- x0：开始渐变的 x 坐标
- y0：开始渐变的 y 坐标
- x1：结束渐变的 x 坐标
- y1：结束渐变的 y 坐标

这是设置比如说我们下一个粉色到白色的由上向下的渐变：
```html
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    var grd = context.createLinearGradient(100,100,100,200);
    grd.addColorStop(0,'pink');
    grd.addColorStop(1,'white');

    context.fillStyle = grd;
    context.fillRect(100,100,200,200);
```
我们看一下浏览器中的效果：

![设置渐变](https://user-gold-cdn.xitu.io/2017/11/26/15ff82a119940d21?w=2874&h=836&f=jpeg&s=55739)

可以看出，`createLinearGradient()` 的参数是两个点的坐标，这两个点的连线实际上就是渐变的方向。我们可以使用 `addColorStop()` 方法来设置渐变的颜色。

`gradient.addColorStop(stop,color);`:
- `stop`：介于 0.0 与 1.0 之间的值，表示渐变中开始与结束之间的位置
- `color`：在结束位置显示的 CSS 颜色值

我们可以设置多个颜色断点，比如，要实现一个彩虹的效果，只需要多增加几个颜色断点就可以了~
```js
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    var grd = context.createLinearGradient(0,0,0,400);
    grd.addColorStop(0,'rgb(255, 0, 0)');
    grd.addColorStop(0.2,'rgb(255, 165, 0)');
    grd.addColorStop(0.3,'rgb(255, 255, 0)');
    grd.addColorStop(0.5,'rgb(0, 255, 0)');
    grd.addColorStop(0.7,'rgb(0, 127, 255)');
    grd.addColorStop(0.9,'rgb(0, 0, 255)');
    grd.addColorStop(1,'rgb(139, 0, 255)');

    context.fillStyle = grd;
    context.fillRect(0,0,400,400);
```
效果如下：

![彩虹渐变效果](https://user-gold-cdn.xitu.io/2017/11/26/15ff86ac19b66d3e?w=2878&h=838&f=jpeg&s=73835)

## 图形转换
在了解完了最基本的绘制路径和设置样式之后，我们来看一下怎么来进行图形的变换。

我们先来看一下图形转换都有哪些方法：

方法 | 描述
---|---
`scale()` | 缩放当前绘图至更大或更小
`rotate()` | 旋转当前绘图
`translate()` | 重新映射画布上的 (0,0) 位置
`transform()` | 替换绘图的当前转换矩阵
`setTransform()` | 将当前转换重置为单位矩阵，然后运行 `transform()`

### 缩放
我们来看一下怎么使用 Canvas 实现缩放的功能，绘制一个矩形；放大到 200%，再次绘制矩形；放大到 200%，然后再次绘制矩形；放大到 200%，再次绘制矩形：
```js
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    context.strokeStyle = 'white';
    context.strokeRect(5,5,50,25);
    context.scale(2,2);
    context.strokeRect(5,5,50,25);
    context.scale(2,2);
    context.strokeRect(5,5,50,25);
```
只是使用 `scale()` 方法就可以实现缩放的效果，我们再来看一下浏览器中的显示情况：

![实现缩放](https://user-gold-cdn.xitu.io/2017/11/26/15ff8975e0c5a4e3?w=2878&h=830&f=jpeg&s=48668)

可以看到，在设置 `scale()` 方法之后再设置的矩形，无论是线条的宽度还是坐标的位置，都被放大了。并且 `scale()` 的效果是可以叠加的，也就是说，我们在上面的例子中使用了两次 `scale(2,2)` 那么，最后一个矩形相对于第一个矩形长和宽，以及坐标的位置就放大了 4 倍。

### 旋转
其实在图形变换中，只要掌握了一种，其他的图形变换方式就会迎刃而解了。我们再来看一下旋转的例子吧。

```js
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var cx = canvas.width = 400;
    var cy = canvas.height = 400;

    context.fillStyle = 'white';
    context.rotate(20*Math.PI/180);
    context.fillRect(70,30,200,100);
``` 
我们使用的是 `rotate()` 方法
`context.rotate(angle);`
- `angle` : 旋转角度，以弧度计。
如需将角度转换为弧度，请使用 `degrees*Math.PI/180` 公式进行计算。
举例：如需旋转 5 度，可规定下面的公式：`5*Math.PI/180`。

在刚刚的例子中，我们将画布旋转了 20°，然后再画了一个矩形。

通过上述两个例子，我们会发现一个特点，在进行图形变换的时候，我们需要画布旋转，然后再绘制图形。

这样的结果是，我们使用的图形变换的方法都是作用在画布上的，既然对画布进行了变换，那么在接下来绘制的图形都会变换。这点是需要注意的。

比如我对画布使用了 `rotate(20*Math.PI/180)` 方法，就是将画布旋转了 20°，然后之后绘制的图形都会旋转 20°。

## 图像绘制
Canvas 还有一个经常用的方法是`drawImage()`。

方法 | 描述
---|---
`drawImage()` | 向画布上绘制图像、画布或视频

`context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);` 
- `img`：规定要使用的图像、画布或视频
- `sx`：可选。开始剪切的 x 坐标位置
- `sy`：可选。开始剪切的 y 坐标位置
- `swidth`：可选。被剪切图像的宽度
- `sheight`：可选。被剪切图像的高度
- `x`：在画布上放置图像的 x 坐标位置
- `y`：在画布上放置图像的 y 坐标位置
- `width`：可选。要使用的图像的宽度（伸展或缩小图像）
- `height`：可选。要使用的图像的高度（伸展或缩小图像）

经过上面对 Canvas 常见方法的介绍，相信你也可以绘制一些基本的图形了，你看到的那些炫酷的效果都是由这些简单的图形构成的。在下一节我将会带大家分析怎么使用这些最基本的元素来组成炫酷的特效~~

## 源码
本小册中各种特效的源码地址：[sunshine940326/canvas](https://github.com/sunshine940326/canvas)