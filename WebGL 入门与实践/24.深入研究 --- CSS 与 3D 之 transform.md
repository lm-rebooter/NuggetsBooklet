
 
 前面介绍了 3D 变换的原理和算法实现，并通过一些简单的 demo 演示了变换效果，但这些 demo 都是使用 WebGL 技术渲染。本节我们暂时不使用 WebGL，而是改用前端同学最熟悉的 CSS 技术来实现 3D 效果，并进一步了解 CSS 中的 3D 属性和 WebGL 中 3D 概念的异同之处。
 
 ## CSS 中的 3D 属性
 

下面是 CSS3 中的几个很重要的 3D 属性：
 
 * transform：对 DOM 进行变换，相当于 WebGL 中对模型进行的变换。
 * transform-origin：设置变换的中心点。
 * perspective-origin：视点，相当于 WebGL 中摄像机的 X、Y 轴坐标。
 * perspective：视距，启用该属性相当于在 WebGL 中设置摄像机和 DOM 元素之间在 Z 轴方向上的距离，设置该属性不等于 0 时会自动启用透视投影效果。
 * transform-style：是否启用 3D 变换。
 * backface-visibility：背面是否可见。
 
本节我们主要讲述 CSS 中的变换属性`transform`，变换分为`基本变换`和`矩阵变换`，基本变换大家都比较熟悉了，本节不做过多介绍，我们主要介绍`矩阵变换`和`组合变换`。



### 变换：transform

`transform` 是大家最常用的一个属性，我们经常会使用它实现一像素的边框和以及容器或者内容的水平、垂直居中，又或者利用它实现强制 GPU 渲染，提升动画性能。

transform 分为 2D 和 3D 变换，3D 变换只是在 2D 的基础上增加了 Z 轴方向的变换。

一般情况下，如果对一个 DOM 施加变换，那么变换的中心往往是 DOM 的中心位置，类比到 WebGL 中，也就是模型的中心，我们可以把 CSS 中的 DOM 看做 WebGL 中的模型。

transform 包含四个基本变换属性值：`translate`、`rotate`、`skew`、`scale`，对应的 3D 变换属性值为 `translate3d`、`rotate3d`、`scale3d`。

> 注意，skew 没有对应的 3D 变换设置。

基本变换大家应该都很熟悉了，后面重点要讲解的是 `matrix` 、`matrix3d`的计算与使用，以及`组合变换`的使用技巧。


当然，下面我们还是先回顾一下 `transform` 的基本用法。

####  平移

平移的使用方法：

* translate(tx, ty)
* translate3d(tx, ty, tz)
* translateX(tx)
* translateY(ty)
* translateZ(tz)

将 dom 元素分别沿着 X、Y、Z 轴向平移 30 px。

```css
/* 分别沿 X 轴和 Y 轴平移 30 px。*/
transform: translate(30px, 30px);
/* 分别沿 X 轴、 Y 轴、Z 轴平移 30 px。*/
transform: translate3d(30px, 30px, 30px);
/* 沿 X 轴平移 30 px。*/
transform: translateX(30px);
/* 沿 Y 轴平移 30 px。*/
transform: translateY(30px);
/* 沿 Z 轴平移 30 px。*/
transform: translateZ(30px);
```



#### 旋转

旋转用法也比较简单，在此不做过多描述。

* rotate(angle)，绕 Z 轴旋转。
* rotate3d(x, y, z, angle)。绕轴`axis = {x:x, y:y, z:z}`旋转指定角度`angle`。
* rotateX(angle)，绕 X 轴旋转。
* rotateY(angle)，绕 Y 轴旋转。
* rotateZ(angle)，绕 Z 轴旋转。


```css
/*绕 X 轴旋转 45 deg。*/
transform: rotate(45deg);
/* 将第一个参数设置为 1， 代表绕 X 轴旋转 45 deg。*/
transform: rotate3d(1, 0, 0, 45deg);
/* 将第二个参数设置为 1， 代表绕 Y 轴旋转 45 deg。*/
transform: rotate3d(0, 1, 0, 45deg);
/* 将第三个参数设置为 1， 代表绕 Y 轴旋转 45 deg。*/
transform: rotate3d(0, 0, 1, 45deg);
/* 将三个参数都设置为 1， 代表绕 Y 轴旋转 45 deg。*/
transform: rotateZ(45deg);
```


##### 绕任意轴的旋转。
关于旋转，我想说明一下`rotate3d` 的使用方式，它接收一个`轴向量`和一个`角度`，代表绕`轴向量`旋转某个`角度`。

举个例子来说，我们想让模型绕轴 axis= {x: 1,y: 1,z: 1}进行旋转，那么用rotate3d表示如下：

```
.box{
    animation: rotate 3s infinite linear;
}
@keyframes rotate{
    0% {
        transform:rotate3d(1, 1, 1, 0deg);
    }
    100% {
        transform:rotate3d(1, 1, 1, 360deg);
    }
}
```


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/10/167974020596bd07~tplv-t2oaga2asx-image.image)

##### 变换参照点 transform-origin

根据上图的例子，你会发现，默认的旋转是绕着模型的中心位置进行的，这个位置是浏览器默认的。但事实上，CSS 仍然提供了对变换中心的设置功能，通过设置 `transform-origin` 来实现。

* transform-origin 包含 X、Y、Z 轴坐标的设置。
* transform-origin 接收百分比数值时，是以自身尺寸为基准的。

比如，我们让一个 DOM 元素沿着上边沿进行进行旋转，只需要将 transform-origin 的 Y 轴分量设置为 0% 或者 0 即可。

```css
transform-origin: 50% 0%;
transform: rotateX(90deg);
```


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/10/16797ac6ac7cad17~tplv-t2oaga2asx-image.image)


这个概念比较简单，但是很灵活。利用它我们能实现很多有意思的 3D 效果，比如 CSS 版的`魔方`。

### 缩放

缩放的使用方法也很简单。

* scale(sx, sy)，沿 X 轴方向缩放 sx 倍，沿 Y 轴方向缩放 sy 倍。
* scale(sx)，沿 X 轴方向和 Y 轴方向缩放 sx 倍。
* scale3d(sx, sy, sz)，分别沿 X、Y、Z 轴方向缩放 sx、sy、sz 倍。
* scaleX(sx)，沿 X 轴方向缩放 sx 倍。
* scaleY(sy)，沿 Y 轴方向缩放 sy 倍。

代码示例：

```css
/* 沿 X 轴和 Y 轴 放大两倍。*/
transform: scale(2);
/* 沿 X 轴方向当大 3 倍，沿 Y 轴方向放大 2 倍。*/
transform: scale(3, 2);
/* 分别在 X 、Y、 Z 轴方向放大 2倍、3倍、4倍。*/
transform: scale3d(2, 3, 4);
/* 在 X 轴方向放大两倍。*/
transform: scaleX(2);
/* 在 Y 轴方向放大两倍。*/
transform: scaleY(2);
```

### 斜切

斜切的使用方法：

* skew(xAngle, yAngle)，DOM 元素沿着 X 方向切变 xAngle 度，沿 Y 轴方向切变 yAngle 度。
* skewX(xAngle)，沿 X 轴方向切变 xAngle 度。
* skewY(yAngle)，沿 Y 轴方向切变 yAngle 度。

斜切可以理解为将 DOM 元素沿 X 轴或者 Y 轴拉伸，切变会改变物体的形状。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/6/167817da6a38183a~tplv-t2oaga2asx-image.image)


代码示例：

```css
/* 沿 X 轴切变 30 度。*/
transform: skew(30deg);
/* 沿 X 轴切变 30 度，沿 Y 轴切变 40 度。*/
transform: skew(30deg, 40deg);
/* 沿 X 轴方向切变 30 度。*/
transform: skewX(30deg);
/* 沿 Y 轴方向切变 40 度。*/
transform: skewY(40deg);
```

以上就是 `transform` 的常见用法，接下来我们开始讲重点了：`组合变换`和 `matrix`

### 组合变换

`组合变换`就是在 transform 的属性值中附加多个变换效果，而不只是单一的变换。

比如下面这个变换样式：

```css
transform: rotateX(60deg) rotateY(60deg);
```

这个样式的作用是先让 DOM 元素绕着 X 轴旋转 60 度，注意此时 DOM 元素的坐标系改变了，再绕变换后的坐标系的 Y 轴旋转 60 度。

需要谨记的是：

* transform 后的多个变换要用空格分开。
* 从前往后理解这些变换，后一个变换都是基于前一个变换后的新坐标系进行，也称`动态坐标系变换`。
* 从后往前理解，每一个变换都是按照 DOM 元素最开始的坐标轴（可以理解为世界坐标系）进行，也称为`静态坐标系变换`。

至于多个变换是基于动态坐标系进行构思，还是基于静态的世界坐标系进行构思，取决于每个人的理解习惯，但最终的变换效果都是一样的。

>在欧拉角章节我们也讲过了多个矩阵相乘时，从前往后和从后往前理解变换所基于的坐标系是不同的。transform 多个变换理解顺序和前面所讲的保持一致。

再举个比较明显的例子，我们先让 DOM 旋转 60 度，然后将其沿 X 轴平移 200 像素，大家觉得 DOM 会按照怎样的轨迹变换？

我们看一下：

```css
transform: rotateX(60) translateX(200px);
```

为了更方便观察 3D 组合变换的效果，我将图片外层容器的`视点`设置在了右上方：

```css
.imgWrapper{
    perspective: 300px;
    margin-top:300px;
    position: relative;
    perspective-origin: 100% -100px;
}
```

关于视点 `perspective-origin` 和 视距 `perspective` 我们放在下一节讲述。

#### 从前往后理解变换，需要按照`模型坐标系`理解：

下图，白色坐标轴是图片默认的坐标系，当图片绕 X 轴旋转 60 度后，坐标系变成红色坐标轴的指向。

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/6/1678241bcd2eb3a7~tplv-t2oaga2asx-image.image" width="80%" />

接着沿当前图片坐标系的红色 X' 轴平移 200 像素，此时，应该朝向屏幕里侧和右侧移动。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/6/16782469359b66e3~tplv-t2oaga2asx-image.image)

#### 从后往前理解多个变换，需按照世界坐标系理解

请注意，`CSS` 中的`世界坐标系`就是 施加变换的 DOM 节点（本例为图片）最开始的坐标系，即图中的白色坐标轴。

* 首先沿着 X 轴平移 200 像素。
* 接着绕世界坐标系的 Y 轴旋转 60 度。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/6/16782664ef6d8d2e~tplv-t2oaga2asx-image.image)

可以看出，无论我们按照哪种坐标系理解，最终变换效果都是一样的，看下图：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/6/16782681da82aeb6~tplv-t2oaga2asx-image.image)


这就是`组合变换`要注意的地方，了解了组合变换的规律，我们才能做出很有意思的特效，比如照片墙：

照片墙的核心原理就是先将图片沿着 Z 轴方向移动一定距离，之后绕世界坐标系的Y 轴旋转指定角度。

```css
transform: rotateY(30deg) translateX(200px);
```

当然，这只是核心原理，事实上我们还需要做如下几步：
* 让图片能够显示出 3D 效果，这一步需要让图片父容器的 `transform-style` 属性设置为 `preserve-3d`。
* 为父容器加上透视属性`perspective`，设置为透视投影，并调整合适的视距 ，这样才能实现近大远小的效果。

这几个属性我们下节细讲，先贴下照片墙的效果：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/4/16778c9cd6a5b210~tplv-t2oaga2asx-image.image)

具体的实现我们在讲视点和视距属性时再分析。

又比如 3D 盒效果：
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/6/16783e9b138a5848~tplv-t2oaga2asx-image.image)


这是一个立方体盒子，每个面上都对应一张图片，当然，你也可以根据自己的需要往各个面上放置自己的内容。

立方体盒子的原理也是利用组合变换实现的：

* 前面：沿着 Z 轴往前（朝向屏幕外）平移指定像素。
* 后面，沿着 Z 轴往后（朝向屏幕里）平移指定像素。
* 上面，沿着 Y 轴往上平移，接着绕 X 轴旋转 90 度。
* 下面，沿着 Y 轴往下平移，接着绕 X 轴旋转 90 度。
* 左面，沿着 X 轴往左平移，接着绕 Y 轴旋转 90 度。
* 右面，沿着 X 轴往右平移，接着绕 Y 轴旋转 90 度。

当然，为了实现 3D 效果，也要在图片的父容器上设置 `transform-style` 为 `preserve-3d` 才可以。

这里主要展示组合变换顺序的理解与强大，不对实现做分析，`实现过程`留在下一节和`视点`以及`视距`一起介绍。


我们还是先把变换讲完，接下来介绍 `transform` 的另一个重要用法，`matrix` 和 `matrix3d`。

### matrix

transform 除了提供一些基本变换，还提供了 `matrix` 和 `matrix3d` 属性值，这两个属性值是做什么的呢？

`matrix` 是矩阵的意思，transform 是变换属性，所以 matrix 就是对 DOM 执行变换的矩阵，这和我们前面讲的 WebGL 的变换矩阵概念相同。

根据前面的学习，我们知道 2 维平面的变换矩阵，是一个 3 阶矩阵，包含 9 个数字：

$
\begin{aligned}
\begin{pmatrix}
x0 & y0 & tx \\\
x1 & y1 & ty \\\
0 & 0 & 1
\end{pmatrix}
\end{aligned}
$

按照我们之前章节坐标系变换的原理分析：

* x0、x1 代表变换之后的 X 轴基向量在原坐标系中的表示。
* y0、y1 代表变换之后的 Y 轴基向量在原坐标系中的表示。
* tx、ty 代表坐标原点的偏移量。

如果没有看之前章节的话，可能不太理解基向量的含义以及坐标系的概念，大家可以去看一下，理解一下坐标系变换的原理。

你会看到第三行的数值是固定的` 0 0 1 `，所以，浏览器为了简化赋值，规定 transform 中的 matrix 只接受 3 阶矩阵的前两行参数，共 6 个数字。

请记住，matrix 的参数顺序对应上面的矩阵元素如下：

```css
transform: matrix(x0, x1, y0, y1, tx, ty);
```

前面章节我们推导过基本变换的矩阵表示：

* 平移

沿 X 轴平移 tx 像素，沿 Y 轴平移 ty 像素：
$
\begin{aligned}
\begin{pmatrix}
1 & 0 & tx \\\
0 & 1 & ty \\\
0 & 0 & 1
\end{pmatrix}
\end{aligned}
$



* 缩放

沿 X 轴方向缩放 sx 倍， 沿 Y 轴缩放 sy 倍：
$
\begin{aligned}
\begin{pmatrix}
sx & 0 & 0 \\\
0 & sy & 0 \\\
0 & 0 & 1
\end{pmatrix}
\end{aligned}
$

也就是说基本变换我们都可以用 `matrix` 来表示。

* 斜切
沿着 X 轴倾斜 α 度，沿着 Y 轴倾斜 θ 度：

$
\begin{aligned}
\begin{pmatrix}
1 & tan\alpha & 0 \\\
tan\theta & 1 & 0 \\\
0 & 0 & 1
\end{pmatrix}
\end{aligned}
$


* 旋转

绕 Z 轴旋转 θ 角度：

$
\begin{aligned}
\begin{pmatrix}
cos\theta & -sin\theta & 0 \\\
sin\theta & cos\theta & 0 \\\
0 & 0 & 1
\end{pmatrix}
\end{aligned}
$

* 绕 Z 轴旋转 60 度。

用 rotateZ 表示上面的旋转很简单，我们看下用 matrix 如何表示：

 $ cos(60) = 0.5$
 
 $sin60 = \frac{\sqrt3}{2} = 0.866（约等）$

将这两个数字代入 matrix 公式，得出变换样式为：

```css
transform: matrix(0.5, 0.866, -0.866, 0.5, 0, 0);
```

你会发现无论我们是用 rotateZ 表示，还是用 matrix 表示，变换效果都是一样的。

### matrix3d
matrix3d，顾名思义，代表 3 维变换，它是一个 4 阶矩阵，需要 16 个数字来表示。

$
\begin{aligned}
\begin{pmatrix}
x0 & y0 & z0 & tx \\\
x1 & y1 & z1 & ty \\\
x2 & y2 & z2 & tz \\\
0 & 0 & 0 & 1
\end{pmatrix}
\end{aligned}
$

可以看到，每一个基向量都增加了一个 Z 轴方向分量 x2、y2、z2、tz。


事实上，3D 的基本变换都可以用 matrix 或者 matrix3d 来表示，但是一些复杂变换只能使用 matrix 或者 matrix3d 来实现。




### matrix 对我们来说有什么用呢？

这是一个很关键的问题，大家会觉得，基本变换的用法更容易理解，更方便书写，matrix 需要的参数太多，而且参数值需要计算，更糟糕的是，我们往往不知道怎么计算，那 matrix 有什么用呢？

这是个好问题，但我想说的是 matrix 能完成基本变换不能完成的变换，能做出基本变换完成不了的效果。

这时你就该考虑使用 matrix 了。

紧跟而来的问题是，matrix 如何求得呢？

我们前面章节讲述了 matrix 矩阵的求法，一旦你确定了需要的变换，你就可以计算变换后的基向量，然后将基向量的各个分量代入矩阵的各个位置即可求出变换矩阵，有了变换矩阵，也就有了 matrix 所需要的各个元素，将矩阵转化成 matrix 或者 matrix3d 所需要的字符串就轻而易举了。



* 镜像效果

镜像效果，采用基本变换是实现不了的，只能借助于矩阵。
比如左右镜像，左右镜像无非就是 Y 轴基向量不变，X 轴坐标对调，原坐标与新坐标关系如下：

$
\begin{aligned}
x^{'} &= -x \\\
y^{'} &= y
\end{aligned}
$

所以有：

$
\begin{aligned}
x0 &= -1 \\\
x1 &= 0 \\\
y0 &= 0 \\\
y1 &= 1
\end{aligned}
$

将这些值，代入 matrix公式中，可以得出变换：

```css
transform: matrix(-1,0,0,1,0,0);
```

我们看下效果：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/6/16783fcc8bcfd906~tplv-t2oaga2asx-image.image)

当然大家也可以举一反三，比如上下镜像：

```css
transfom: matrix(1,0,0,-1,0,0)
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/6/16783fea86654f76~tplv-t2oaga2asx-image.image)


* 绕任意轴旋转。

绕任意轴的旋转，除了可以使用 rotate3d 来实现，还可以使用 matrix3d。这个旋转矩阵该如何计算呢？

还记得基本变换章节我们推导出的绕固定轴旋转的矩阵方法`axisRotation`吗？

`axisRotation(axis, angle)`，其中 axis 是一个三维向量，angle 是一个弧度值。

这里我不准备举绕基本轴旋转的例子，因为它们不需要matrix3d 出手，我们想绕`{x:1, y: 1, z: 1}`的倾斜轴旋转，上面的 axisRotation 方法该出场了，它会为我们提供变换矩阵，但是我们还需要将变换矩阵转化为 css 样式，我们先封装一个矩阵转 css 的方法：

```javascript
function matrix2css(mt){
    var transformStyle = 'matrix(';
    if(mt.length == 16){
        css = 'matrix3d('
    }
    for(let i =0; i< mt.length; i++){
        transformStyle += mt[i];
        if(i !== mt.length - 1){
            transformStyle += ','
        }else{
            transformStyle +=')'
        }
    }
    return transformStyle;
}
```

接着可以通过 axisRotation 方法计算出变换矩阵了，比如旋转 90 度。

```javascript
let mt = matrix.axisRotation({x:1, y:1, z:1}, Math.PI / 180 * 90)
```

在这里我用绕轴向量 axis = {x:1, y:1, z:1} 不停旋转的动画演示：

```javascript
function render(){
    if(!playing){
        return;
    }
    angle ++;
    mt = matrix.axisRotation({x: 1,y: 1,z: 1}, Math.PI / 180 * angle);
    let css = matrix2css(mt);
    ?('.box')[0].style.transform = css;
    requestAnimationFrame(render);
}
document.body.addEventListener('click',function(){
  playing = !playing;
  render();
})
```


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/6/16784262a1dc9805~tplv-t2oaga2asx-image.image)


是不是很简单呢？

### 总结

transform 中的基本变换都可以使用 matrix 和 matrix3d 来表示，只有当基本变换表示不了我们的变换时，我们才考虑使用 matrix 或者 matrix3d 。

可见，即使不做 WebGL 开发，我们之前学到的内容也会对普通开发者大有帮助，掌握变换原理，配合 CSS3 中的 3D 属性，照样可以做出很酷炫的 3D 动画效果。



## 回顾

本节讲述了 CSS 中的 3D 变换，以及它们与 WebGL 变换的相同之处。总的来说，基本原理都是一样的，之前封装的数学矩阵库，不仅可以用在 WebGL 领域，也可以用在 css 领域。

下一节，我们讲述 CSS 中 3D 变换 的其它几个重要属性，`变换类型(transform-style)`、`视点(perspective-origin)`、`视距(perspective)`。



