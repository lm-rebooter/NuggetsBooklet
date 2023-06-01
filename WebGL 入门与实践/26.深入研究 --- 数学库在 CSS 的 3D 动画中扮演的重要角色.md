

前面两节，我们详细讲述了CSS 3D 属性的相关概念与使用方法，本节我们看一下 3D 数学库如何与 CSS 中的 tranform 属性实现复杂的 3D 效果。


我们依然从最简单的平移、旋转、缩放开始演示，但是不再使用 translate、scale、rotate 等属性来实现，而是采用 matrix 和 matrix3d。

## matrix 和 matrix3d
作为 transform 属性最冷门的两个属性值，我想大家很少有人会用到它们，或者不知道它们是做什么的，以及不知道该如何使用它们。

上一节我简单介绍了 matrix 和 matrix3d  的使用方法，本节我会详细介绍一下它们。

* matrix 和 matrix3d 的作用。
* 它们的使用方法。
* 属性值的生成方式。


### matrix 
matrix 是 transform 的 2 维变换矩阵，由六个数字组成。

> transform: matrix(a, b, c, d, e, f);

事实上，二维变换矩阵是一个 3 阶矩阵，包含 3 x 3 = 9 个数字，但是你会发现 matrix 是由 6 个数字组成，它们对应一个 3 阶矩阵的如下部分：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/16841fb9efa3a4fd~tplv-t2oaga2asx-image.image)

很容易理解，由于第三行的数字始终是固定的，所以 css 规范中把第三行给省略了，matrix 只需要接收前两行数字即可。

对于基本变换，matrix 各个元素表示如下：

#### 平移


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/168420213d728550~tplv-t2oaga2asx-image.image)

如果 matrix 只表示平移时，只需要改变 tx 和 ty 即可，其中 tx 代表沿着 X 轴平移的像素值，ty 代表沿着 Y 轴平移的像素值。其余元素都是固定值，仅仅改变 tx 和 ty即可。

比如，让一个 dom 元素沿着 X 轴平移 30 像素，沿着 Y 轴平移 40 像素，那么，用 matrix 表示如下：

```css
transform: matrix(1, 0, 0, 1, 30, 40);
```

> 注意，`tx` 和 `ty` 只能用数字表示，后面不可接 `px` 。

#### 缩放
单一矩阵表示缩放时，各个位置的元素如下：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/168420a52a9fb0da~tplv-t2oaga2asx-image.image)

其中 sx 代表 X 轴方向的缩放比例，sy 代表 Y 轴方向的缩放比例，其余位置的元素都是固定的。
比如，沿着 X 轴放大两倍，沿着 Y 轴放大两倍时，css 表示如下：

```css
transform: matrix(2, 0, 0, 0, 2, 0, 0, 0, 1);
```

等价于

```css
transform: scale(2);
transform: scale(2, 2);
```

当我们想通过 matrix 设置缩放比例时，只需要改变 sx、sy 即可。

#### 旋转
单一矩阵表示旋转时，各个位置元素表示如下：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/13/168457c7ab0fc5ec~tplv-t2oaga2asx-image.image)

由于 2D 旋转是在 XY 平面的旋转，也就是绕 Z 轴的旋转，所以 θ 角度是绕 Z 轴旋转的角度。
比如旋转 45 度时：

$
cos45^。 = \frac{\sqrt{2}}{2} \approx 0.7071
$

$
sin45^。 = \frac{\sqrt{2}}{2} \approx 0.7071
$

将各个数字代入公式后，css 表示如下：

```css
transform: matrix(0.7071, 0.7071, -0.7071, 0.7071, 0, 0);
```
等价于

```css
transform: rotate(45deg);
transform: rotateZ(45deg);
```


以上就是通过单一矩阵介绍了 matrix 的用法。大家可能会有如下疑惑：transform 已经内置了基本变换属性`translate`、`rotate`、`scale`，所以，我们为什么还要用 matrix？况且 matrix 更复杂，更不易于理解。回答这个问题之前，我们趁热打铁，先了解下 3 维变换 matrix3d 的用法。

### matrix3d
顾名思义，matrix3d 是transform 的 3 维变换矩阵，由 16 个数字组成。

> transform: matrix3d(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);

CSS 中 matrix3d 的参数顺序对应变换矩阵的元素位置如下图所示。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/14/1684a5d49cf364c7~tplv-t2oaga2asx-image.image)


16 个数字乍看之下很多，初学者容易犯晕，不过大家可以根据上图对这 16 个数字进行分类，分为四组，每组 4 个数字，每组数字代表变换矩阵的每一列，每一列数字代表的含义如下：

* 第一列，代表变换后的坐标系的 X 轴在原坐标系下的坐标。
    * a：X 轴坐标分量
    * b：Y 轴坐标分量
    * c：Z 轴坐标分量
    * d：通常为 0，代表向量。
* 第二列，代表变换后的坐标系的 Y 轴在原坐标系下的坐标。
    * e：X 轴坐标分量
    * f：Y 轴坐标分量
    * g：Z 轴坐标分量
    * h：通常为 0，代表向量。
* 第三列，代表变换后的坐标系的 Z 轴在原坐标系下的坐标。
    * i：X 轴坐标分量
    * j：Y 轴坐标分量
    * k：Z 轴坐标分量
    * l：通常为 0，代表向量。
* 第四列，代表变换后的坐标系原点在原坐标系下的坐标
    * m：X 轴坐标分量。
    * n：Y 轴坐标分量。
    * o：Z 轴坐标分量。
    * p：通常为 1，代表点。

如果你看过在之前章节坐标系变换原理的话，相信你会很容易理解上面的解释，如果你没看过，那也没关系，只需要掌握数学矩阵库的使用即可生成这么一个`变换矩阵`，之后将矩阵的各个元素填入 matrix3d 的 对应位置即可。

接下来看一下 matrix3d 是如何达到 transform 基本变换效果的。
###  3D 平移

3D 平移无非就是增加了一个 Z 轴的平移效果。

平移时，matrix3d 对应变换矩阵的各个元素位置如下：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/14/1684b07647e78b71~tplv-t2oaga2asx-image.image)

其中：
* tx：代表沿 X 轴的平移量。
* ty：代表沿 Y 轴的平移量。
* tz：代表沿 Z 轴的平移量。


如果，我们想通过 matrix3d 表示平移的话，只需要改变 tx、ty、tz 三个元素即可，其余元素如上图，无需变化。

假设我们要实现沿 X 轴平移 30 像素，沿 Y 轴平移 40 像素，沿 Z 轴平移 50 像素，那么 CSS 可以像下面这样设置：

```css
transform: matrix3d(
1, 0, 0, 0, 
0, 1, 0, 0, 
0, 0, 1, 0, 
30, 40, 50, 1
);
```

等价于

```css
transform: translate(30px, 40px, 50px);
```

注意哦，当使用 translate 时需要带上单位 `px`。

> 大家仍然不难发现，使用 matrix3d 比 translate 复杂，要书写的属性内容也多，并且不易于理解。

### 3D缩放
3D 缩放仍然增加了 Z 轴方向的缩放效果，当 transform-style 设置为 preserve-3d 时，能够看到缩放 Z 轴所带来的视觉效果。

缩放对应的变换矩阵各个元素的位置如下图：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/14/1684b328f0962081~tplv-t2oaga2asx-image.image)

其中：
* sx：代表沿 X 轴缩放的比例。
* sy：代表沿 Y 轴缩放的比例。
* sz：代表沿 Z 轴缩放的比例。

除了 sx、sy、sz 这三个元素需要我们自己设置，其余位置的元素都是固定值，如上图。

假设我们要将一个 dom 元素沿 X 轴、Y 轴、Z 轴各放大两倍，那么用 matrix3d 表示如下：

```css
transform: matrix3d(
    2, 0, 0, 0,
    0, 2, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, 1
);
```

等价于：

```css
transform: scale3d(2, 2, 2);
```

我们通过一个小例子，看下效果。

```html
<div class="parent">
    <div class="son"></div>
</div>
```

```css
.parent{
    transform-style: preserve-3d;
    background: bisque;
    transition: 2s;
}
.parent:hover{
    transform: rotateY(80deg);
}
.son{
    width: 100px;
    height: 100px;
    background-color: blueviolet;
    transform: matrix3d(1 , 0, 0, 0,
    0, 1, 0, 0, 
    0, 0, 4, 0,
    0, 0, 0, 1) 
    rotateX(60deg);
}
```
>为了便于观察 Z 轴放大效果，此处我对子元素做了一个多重变换，首先将子元素沿着 X 轴旋转 60 度，之后再执行缩放变换。多重变换的细节大家可以参见[CSS 与 3D 变换之 transform](https://juejin.cn/book/6844733755580481543/section/6844733755945402382)章节。

我们将子元素沿着 Z 轴放大四倍，X 轴和 Y 轴比例不变，观察下效果：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/14/1684b783f6e95e9b~tplv-t2oaga2asx-image.image)

大家可以发现， Z 轴长度变为了之前的 4 倍。
上面我们是用 matrix3d 实现的，使用 scale3d 同样能达到上述效果，大家不妨试一试。

### 旋转
3D 旋转是基本变换最复杂的一个，涉及到绕基本坐标轴的旋转、绕任意轴的旋转、欧拉角旋转、四元数旋转等，但是 CSS 中除了 matrix 和 matrix3d 以外，只提供了绕基本轴旋转、绕任意轴旋转，欧拉角旋转和四元数旋转需要通过数学库计算出对应的旋转矩阵。我们还是先看下如何使用 matrix3d 实现基本旋转。


#### 绕 X 轴旋转
绕 X 轴旋转 θ 角度对应的变换矩阵各个元素的位置如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/14/1684baa31098682e~tplv-t2oaga2asx-image.image)

举个例子，假设我们实现绕 X 轴旋转 45 度的效果，那么对应的 css 表示如下：

```css
transform: matrix3d(
    1, 0, 0, 0,
    0,  0.7071, 0.7071, 0,
    0, -0.7071, 0.7071, 0,
    0, 0, 0, 1
);
```
等价于

```css
transform: rotateX(45deg);
transform: rotate3d(1, 0, 0, 45deg);
```

效果如下图：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/15/1684f46a4978eabe~tplv-t2oaga2asx-image.image)

#### 绕 Y 轴旋转

绕 Y 轴旋转 θ 角度对应的变换矩阵各个元素的位置如下图所示：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/14/1684bec76da1333f~tplv-t2oaga2asx-image.image)

举个例子，假设我们实现绕 Y 轴旋转 45 度的效果，那么对应的 css 表示如下：

```css
transform: matrix3d(
    0.7071, 0, 0.7071, 0,
    0,  1, 0, 0,
    -0.7071, 0, 0.7071, 0,
    0, 0, 0, 1
);
```
等价于

```css
transform: rotateY(45deg);
transform: rotate3d(0, 1, 0, 45deg);
```

效果如下图：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/15/1684f4708c2daaa6~tplv-t2oaga2asx-image.image)

#### 绕 Z 轴旋转

绕 Z 轴旋转 θ 角度对应的变换矩阵各个元素的位置如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/14/1684bee618018b04~tplv-t2oaga2asx-image.image)

举个例子，假设我们实现绕 Z 轴旋转 45 度的效果，那么对应的 css 表示如下：

```css
transform: matrix3d(
    0.7071, -0.7071, 0, 0,
    0.7071, 0.7071, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
);
```
等价于

```css
transform: rotateZ(45deg);
transform: rotate3d(0, 0, 1, 45deg);
```

效果如下图：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/15/1684f473b63d8879~tplv-t2oaga2asx-image.image)

以上就是使用 matrix 和 matrix3d 来代替基本变换属性的讲解内容。大家应该能明白它们的用法了，归纳起来如下：

* matrix 接收二维变换矩阵。
* matrix3d 接收三维变换矩阵。


很简单。

那另一个问题是，如何求得变换矩阵呢？这就需要用到我们前面总结的数学矩阵库了。

### 矩阵库与 matrix 的搭配。

对于基本变换，我们没有必要使用 matrix 来实现，但是对于一些基本变换满足不了的效果，我们就需要考虑 matrix 了。

比如，我需要为一个 dom 元素进行如下变换：

* 首先绕 X 轴旋转 45 度。
* 接着沿 Y 轴平移 30 像素。
* 然后绕 Z 轴旋转 45 度。
* 最后沿 Y 轴方向旋转 90 度。

> 以上变换基于静态坐标系（世界坐标系）进行的。

对于这么一个复杂的变换，我们有两种方式来实现：

* 组合变换，上节已经讲过。
* matrix 变换。

首先，我们看下如何使用组合变换来实现：

```css
transform: rotateY(90deg) 
    rotateZ(45deg) 
    translateY(30px) 
    rotateX(45deg);
```

> 在 css transform 章节中介绍了 transform 组合变换时各个变换的顺序与坐标系的关系，如果大家还没忘记的话，应该记得变换属性从后往前排列代表按照世界坐标系进行变换。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/15/1684fa203ee5ce01~tplv-t2oaga2asx-image.image)


变换的分步执行过程如上图。

你会发现，如果变换过程比较多的话，transform 中要书写很多属性，所以可以尝试另一种思路，matrix3d。

我们看下如何使用 matrix3d 来表示。

利用之前的矩阵库，我们需要如下几个方法计算最终的变换矩阵：

* rotateZ：绕 Z 轴旋转。
* rotateX：绕 X 轴旋转。
* rotationY：绕 Y 轴旋转。
* translate：平移。

> 你可能没有发现矩阵相乘的方法，这是因为 rotateZ、rotateX、translate 方法允许传入一个矩阵作为左乘矩阵，返回一个组合矩阵。当然，你也可以用矩阵相乘方法来实现组合矩阵的求值，但是那样会多执行一些重复运算。


这几个方法在之前章节已经讲述过，所以我们拿来使用即可：

```javascript
var deg = Math.PI / 180;
// 首先创建一个沿 Y 轴旋转矩阵。
var target = matrix.rotationY(90 * deg); 
// 接着计算 Y 轴旋转矩阵与 Z 轴旋转矩阵的组合变换。
// 等价于 matrix.multiply(target, matrix.rotationZ(45 * deg));
target = matrix.rotateZ(target, 45 * deg);
// 等价于 matrix.multiply(target, matrix.translate(0, 30, 0));
target = matrix.translate(target, 0, 30, 0, target);
// 等价于 matrix.multiply(target, matrix.rotationX(45 * deg));
target = matrix.rotateX(target, 45 * deg, target);
```

我们将 target 打印出来看一下：

```javascript
[
    4.329780632585522e-17, 0.7071067690849304,
    -0.7071067690849304, 0,
    0.7071067690849304, 0.5, 0.5, 0,
    0.7071067690849304, -0.5, -0.5, 0,
    -1.298934236097771e-15, 21.21320343017578,
    21.21320343017578, 1
]
```

target 就是上面几种变换组合后的最终矩阵，我们将它转化为 css 的 matrix3d 属性：

```javascript
// 将矩阵转化为transform matrix 属性值。
function matrix2css(m){
    var style = 'matrix(';
    if(m.length == 16){
        style = 'matrix3d('
    }
    for(let i =0; i< m.length; i++){
        style += m[i];
        if(i !== m.length - 1){
            style += ','
        }else{
            style +=')'
        }
    }
    return style;
}
```

最终效果如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/15/168506ba371e5fbf~tplv-t2oaga2asx-image.image)


很显然，通过组合变换和 matrix，我们达到了同样的效果。

通过比较上面的两种实现，我们发现，组合变换相较于 matrix 更容易理解，当变换次数较少时，使用组合变换更优一些。但是当变换次数越来越多时，就需要使用 matrix 了。那么，什么时候变换次数会越来越多呢？

* 分段动画
    * 当一段动画分成很多段时，变换次数会越来越多，这时，需要针对动画做关键帧处理，每一个关键帧处使用 matrix 来表示。
* 复杂交互
    * 当交互比较复杂时，每一次交互都会在原来的变换属性上触发一次或者多次变换，这就需要使用数学库的矩阵乘法来计算组合矩阵。
    
下面，我会通过一个魔方格子的旋转来讲述 matrix3d 的使用场景。

## 魔方格子的旋转。

大家都玩过魔方吧，沿不同方向进行旋转，可以将一个面的格子绕指定轴旋转 90 度。

接下来我们构造一个魔方格子，演示一下如何通过 matrix3d 完成这种交互。

### 构造魔方格子。
首先，我们要构造一个魔方格子，魔方格子是一个立方体，在前面章节我曾经介绍过图片盒的实现，此处仍然采用图片盒的实现方式，只不过将图片换成 DIV 容器。

```html
<div class="block" id="block">
    <div class="face front"></div>
    <div class="face back"></div>
    <div class="face up"></div>
    <div class="face down"></div>
    <div class="face left"></div>
    <div class="face right"></div>
</div>
```

样式如下：

```css
.block {
    position: absolute;
    transform-style: preserve-3d;
    width: 100px;
    height: 100px;
    transform-origin: 50px 50px;
}
.front {
    background: fuchsia;
}

.back {
    transform: translate3d(0, 0, 100px) rotateY(180deg);
    background: red;
}
.left {
    transform-origin: 100% 50% 0px;
    transform: rotateY(90deg);
    background: aqua;
}
.right {
    transform-origin: 0% 50% 0px;
    transform: rotateY(-90deg);
    background: blueviolet;
}
.up {
    transform-origin: 50% 0% 0px;
    transform: rotateX(90deg);
    background: darkorange;
}
.down {
    transform-origin: 50% 100% 0px;
    transform: rotateX(-90deg);
    background: darkviolet;
}
```

为了便于观察，我们为让魔方格子旋转起来：

```css
@keyframes rotate {
    0% {
        transform: translate(-50%, -50%) rotate3d(1, 1, 1, 0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate3d(1, 1, 1, 360deg);
    }
}

.block{
    animation: rotate 3s linear infinite;
}
```

魔方格子效果如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/15/16850e6ba543ba69~tplv-t2oaga2asx-image.image)


上图魔方格子的旋转是通过CSS 中的 `animation` 属性 来实现的，并没有通过交互来触发，接下来，我们讲解一下如何通过鼠标滑动进行旋转。

### 旋转。

鼠标滑动分为左、右、上、下滑动，每种滑动对应一种方向的格子旋转。

* 从右往左：绕 Y 轴旋转 θ 角。
* 从左往右：绕 Y 轴旋转 -θ 角。
* 从上往下：绕 X 轴旋转 θ 角。
* 从下往上：绕 X 轴旋转 -θ 度。

当然旋转需要有一个参照点，默认盒子中心。在 23 章节[深入研究 --- 四元数的应用：使用鼠标控制模型的旋转]()我们使用四元数、欧拉角分别实现了模型的旋转交互，本节我们依然采用旋转矩阵的生成原理，区别就是将生成的矩阵转化为 CSS 中 transform 的 matrix3d 属性值。

```javascript
var currentQ = {x:0, y:0, z:0, w:1};
var lastQ = {x:0, y:0, z:0, w:1};
var currentMatrix = matrix.identity();
var l = Math.sqrt(dx * dx + dy * dy);
if(l <= 0)return;
var x = dx / l, y = dy / l;
var axis = {x: x, y: y, z: 0};
var q = matrix.fromAxisAndAngle(axis, l);
currentQ = matrix.multiplyQuaternions(q, lastQ);
currentMatrix = matrix.makeRotationFromQuaternion(currentQ);
```
通过上述方式我们计算出了当前旋转矩阵 currentMatrix，接下来，我们使用上面介绍的矩阵转化成对应 css 的函数，生成对应的 transform 属性。

```javascript
var style = matrix2css(currentMatrix);
```

最后将生成的样式应用到魔方格子上。

```javascript
document.querySelector('#block').style.transform = style;
```

至此，我们通过 matrix3d 实现了使用鼠标控制魔方格子旋转的效果。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/15/1685233083461428~tplv-t2oaga2asx-image.image)

## 回顾
以上就是数学矩阵库与 CSS transform 属性的高级使用技巧，通过这两个例子的学习，大家应该对 transform 的 3D 属性更有信心了，希望大家以后碰到交互给出的 3D 特效时不再畏手畏脚，而是大胆的拥抱它。

至此，我们对 CSS 的 3D 属性的学习就告一段落了。下一节，我们还是回到 WebGL 的学习内容上来。