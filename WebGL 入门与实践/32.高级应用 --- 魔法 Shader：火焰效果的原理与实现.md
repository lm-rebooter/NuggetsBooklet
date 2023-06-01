
前面的一系列学习中，我们用到的着色器（Shader） 程序，仅仅是一些简单的着色器使用。但其实，着色器程序是实现各种特效的秘密武器，那么本节我 将带领大家学习一下 Shader 的深入使用。


### 片元着色器
很多特效事实上都是基于片元着色器来实现，所以我们着重讲解一下片元着色器。

接下来我们先了解一下片元着色器中的常用内置变量以及内置函数。

#### 内置变量
* gl_FragColor
* gl_FragCoord


#### 内置函数
着色器中有很多内置数学和几何函数，有一些是很常见且易于理解的，譬如如下几种：
* abs(x)
    * 返回绝对值。
* sin(x)
    * 返回对应弧度值的正弦值。
* cos(x)
    * 返回对应弧度值的余弦值。 
* mod(x, y)
    * 求模计算，返回 x - y * floor(x / y)，其实就是我们小学学的取余数。
    * 比如：mod(5, 10)，返回的模是 5。
* min
    * 返回两个数之间的最小值。 
* max
    * 返回两个数之前的最大值

但是还有一些很常用但是我们不太熟悉的函数，比如下面的这些函数：

* fract
    * 返回一个数的小数部分。
* mix
    * 接收三个参数：x，y，a
    * 返回（
* smoothstep(edge0, edge1, x)
    * 这个函数也很常用，主要用于平滑取值，当 x 小于edge0 时，返回 edge0，当 x 大于edge1 时，返回 edge1。当 x 介于 edge0 和 edge1 时，返回该区间内的平滑过渡值，并非线性值哦。


### 着色器的优势
有些同学见到这些函数可能会有想法了：

```!
 这些类型的函数计算我们完全可以在应用层面完成，为什么着色器语言还要再设计这么一套函数呢？
```

这个问题其实比较关键，是图形学编程中性能优化的一个参考基点。

这里给大家普及下 GPU 与 CPU 的区别。

首先，着色器程序运行在 GPU 上。

我想大家都知道 GPU 擅长图形运算，但不知大家有没有想过，为什么是 GPU 擅长而不是 CPU 呢？

原理就在于 GPU 的硬件设计，GPU 内部存在数以千计的微处理器，这些微处理器可以并行地同时执行一类相似的任务。也就是说，如果我们要对屏幕图像进行像素处理，让图像的每一个像素都变成红色，每一个像素的处理可以看成一个微任务，微处理器会并行执行这些任务，如果是 CPU 的话，恐怕要针对每一个像素的任务进行串行处理，显而易见，在重复简单任务的执行效率上，GPU 更胜一筹。



常用的一些数学函数我们就先介绍到这里，接下来，我们使用这些函数做一些效果，在实践中加深对这些函数的理解。

### 对角线的画法
先来实现一个特别简单的效果，我们使用着色器程序在屏幕上绘制一个对角线。

####  原理
实现这个效果有很多种方式，本节主要使用着色器程序实现。
原理很简单。
* 首先，在片元着色器中，获取每一个像素在屏幕上的坐标。利用 gl_FragCoord 内置变量来获取。
* 判断 X 轴坐标。
* 使用 mix 线性函数，求得 Y 轴坐标。
* 将符合 X、Y 轴坐标的像素，涂抹成待绘制的线条颜色。


#### 实现
* 顶点着色器代码

```glsl
precision highp float;
attribute vec3 a_Position;

void main () {
    gl_Position = vec4(a_Position, 1.0);
}
```
* 片元着色器代码

```glsl
precision highp float;
uniform vec2 u_Screen;

void main() {
    float y = mix(0., u_Screen.y, gl_FragCoord.x/u_Screen.x);
    if(abs(y - gl_FragCoord.y) <= 1.){
        gl_FragColor = vec4(0, 1, 1, 1);
    } else {
        gl_FragColor = vec4(0, 0, 0, 1);
    }
    return;
}
```

实现效果如下图：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/10/16e54c9a1a80e414~tplv-t2oaga2asx-image.image)

可以看出，画一个对角线，我们主要使用了 gl_FragCoord 内置变量，该变量可以让我们在片元着色器中拿到当前像素在绘制屏幕的坐标值。

然后我们通过线性计算 mix，计算出对角线上的 Y 轴坐标，并将处于对角线上点的颜色设置成我们需要的颜色。

### 抛物线的画法

接下来，我们提升下难度，看一下抛物线的绘制方法。

#### 原理

利用抛物线公式:

$y = ax^2 + bx + c$

将坐标符合以上抛物线公式求得的点，渲染成我们需要的颜色，即可绘制出一条抛物线来。

#### 实现
* 顶点着色器代码

```glsl
precision highp float;
attribute vec3 a_Position;

void main () {
    gl_Position = vec4(a_Position, 1.0);
}

```
* 片元着色器代码

```glsl
precision highp float;
// canvas 尺寸
uniform vec2 u_Screen;

void main () {
    // 求得符合抛物线公式的 Y 轴坐标。
    float y = -6.0 * pow((gl_FragCoord.x-u_Screen.x/2.)/u_Screen.x ,2.) + 0.5;
    //  将距离求得的 Y 轴坐标不超过 0.005 的点涂抹成我们需要的颜色，0.28 是抛物线和 X 轴的焦点，也就是说我们将 X 轴以上的抛物线部分绘制出来。
    if(abs(gl_FragCoord.y / u_Screen.y - y) <=0.005 && abs((gl_FragCoord.x-u_Screen.x/2.)/u_Screen.x)<=0.28){
        gl_FragColor = vec4(0,1,1,1);
    } else {
        gl_FragColor = vec4(0,0,0,1);
    }
    return;
}
```

效果如下：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/11/16e593b76337eac8~tplv-t2oaga2asx-image.image)

### 正弦波的画法

从上面大家可以看出，当我们想绘制一些曲线的时候，我们只需要找到对应的公式就可以了。

接下来，我们再学习绘制一个动态曲线，正弦波。

#### 原理
* 首先，根据当前点的 X 轴坐标，算出对应 X 轴坐标的正弦值，以该正弦值作为 Y 轴坐标的参照。
* 然后将当前点的 Y 轴坐标和第一步计算出来的正弦值作比较，相差不超过0.005 时，将该点渲染成期望的颜色。
* 我们每次都往着色器中传递一个时间参数 u_Time，通过它让正弦波动起来。

#### 实现

* 顶点着色器

```glsl
precision highp float;
attribute vec3 a_Position;

void main () {
    gl_Position = vec4(a_Position, 1.0);
}
```
* 片元着色器

```glsl
precision highp float;
uniform vec2 u_Screen;
uniform float u_Time;
const float PI = 3.1415926;

void main () {
    float x = gl_FragCoord.x +(u_Screen.x / 8.) * u_Time;
    float y = sin(8.* PI * (x-u_Screen.x)/u_Screen.x)+ 2.;
    
    if(abs(4. * gl_FragCoord.y / u_Screen.y - y) <=0.01 ){
        gl_FragColor = vec4(0,1,1,1);
    } else {
        gl_FragColor = vec4(0,0,0,1);
    }
}
```

效果如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/11/16e599972435ed5b~tplv-t2oaga2asx-image.image)

很简单有木有。

### 火焰效果实现

最后我们综合运用以上的函数和内置变量，讲解一下火焰效果的实现。

#### 原理
* 首先根据当前点的 X 轴坐标，计算出符合火焰抛物线性质的 Y 轴坐标。
* 将当前点的 Y 轴坐标和第一步计算出的 Y 轴坐标点作比较，如果这两个点的距离小于某个阈值，则将该点的颜色置为火焰颜色，为了做出一种平滑渐变的感觉，使用 smooth_step 计算火焰颜色。
* 弱化绿色通道的颜色，使火焰颜色偏红。


#### 实现

* 顶点着色器
```glsl
precision highp float;
attribute vec3 a_Position;

void main () {
    gl_Position = vec4(a_Position, 1.0);
}
```
* 片元着色器
```glsl
precision highp float;
uniform vec2 u_Screen;
varying vec3 v_Position;
uniform float u_Time;
const float PI = 3.1415926;

void main () {
    // 将坐标系坐标范围约束在【-4，4】和【-5，3】之间。
    vec2 pos = ( gl_FragCoord.xy / u_Screen.xy )*8.-vec2(4., 5.);
    if(pos.y>-5.){
        pos.y += 0.1 * sin(u_Time * 3.) + 0.13 * cos(u_Time * 2. + 0.6) + .1 * sin(u_Time * 3. + 0.4) + 0.2 * fract(sin(u_Time * 400.));
    }
    vec3 color = vec3(0., 0., 0.0);
    float y = -pow(pos.x, 3.2)/(0.008) * 3.3;
    //计算当前点与抛物线点的距离，并缩小距离范围。
    float dir = length(pos-vec2(pos.x, y)) * sin(0.3);
    if(dir < 0.7){
        color.rg += smoothstep(0.0,1.,.75-dir);
        //弱化绿色通道颜色
        color.g /=2.4;
    }
    //强化红色通道颜色。
    color += pow(color.r,1.1);
    gl_FragColor = vec4(vec3(color) , 1.0 );
}
```

最终效果如下：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/11/16e59ba223e08828~tplv-t2oaga2asx-image.image)


> 注意：在用 GLSL 实现一些复杂效果的时候，需要有一定的耐心，去调配各种参数。

### 总结

以上就是 GLSL 一些基本函数的使用，通过这些函数，我们可以实现很多特效。当然，这其中离不开数学公式，大家还是要多温习一下初中高中学过的数学函数，这样才更容易发挥想象力，实现各种各样的特效。

