

上节带领大家学习了`点图元`的绘制过程，内容涉及到着色器的语法部分以及 JavaScript 操作 WebGL 的步骤。如果大家能够按照例子多练习几遍的话，之后的学习会更容易一些。

本节带大家练习绘制三角形，三角形的绘制比较简单。 因为它是 WebGL 提供给我们的基本图元之一，我们只需要给着色器提供三角形的顶点数据，调用 WebGL 的绘制命令 `gl.drawArrays` 即可。

## 目标
本节通过实现利用鼠标动态绘制三角形的功能，学习使用缓冲区向 GPU 中传递数据。最终效果如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/5/165a8dc46e5a511b~tplv-t2oaga2asx-image.image)

* [演示地址](http://ifanqi.top/webgl/pages/lesson2.html)
* [源码地址](https://github.com/lucefer/webgl/blob/master/pages/lesson2.html)。

通过本节学习，你将会掌握如下内容：

* 三角形图元的分类。
* 使用缓冲区传递数据。
* 类型化数组的作用。
* 动态绘制三角形。



## 三角形图元的分类
WebGL 的基本图元包含点、线段、三角形，而三角形又分为三类

* 基本三角形
* 三角带
* 三角扇

那么，他们之间有什么区别呢？

* 基本三角形（TRIANGLES）

基本三角形是一个个独立的三角形，假如我们提供给着色器六个顶点，那么 WebGL 会绘制两个三角形，前三个顶点绘制一个，后三个顶点绘制另一个，互不相干。
举个例子来说，假如我们有六个顶点【v1, v2, v3, v4, v5, v6】，采用基本三角形图元进行绘制，绘制完是这个样子：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/5/165a8dc0abecae80~tplv-t2oaga2asx-image.image)

 【v1, v2, v3】为一个三角形，【v4, v5, v6】 为另一个三角形。

`绘制三角形的数量 = 顶点数 / 3`。

* 三角带（TRIANGLE_STRIP）

同样是这六个顶点，如果采用三角带的方式绘制的话，则会绘制 【v1, v2, v3】, 【v3, v2, v4】, 【v3, v4, v5】, 【v5, v4, v6】 共计 4 个三角形，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/22/16875b8e51710e48~tplv-t2oaga2asx-image.image)

`绘制三角形的数量 = 顶点数 - 2`

* 三角扇（TRIANGLE_FAN）

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/5/165a8dc2bb044266~tplv-t2oaga2asx-image.image)

可以看出，三角扇的绘制方式是以第一个顶点作为所有三角形的顶点进行绘制的。采用三角扇绘制方式所能绘制的三角形的数量和顶点个数的关系如下：

`绘制三角形的数量 = 顶点数 - 2`


本节我们主要学习基本三角形图元的绘制。

## 绘制基本三角形



我们的目标是在 canvas 上点击三个位置作为三角形的三个顶点，然后绘制一个红颜色的三角形，本节还是不涉及深度信息（Z值），所以每个顶点我们只传入【x, y】坐标即可。

我们从简单之处着手，首先实现一个固定顶点坐标的三角形。

按照惯例，我们先准备着色器程序：

### 顶点着色器

```glsl
//设置浮点数据类型为中级精度
precision mediump float;
//接收顶点坐标 (x, y)
attribute vec2 a_Position;

void main(){
   gl_Position = vec4(a_Position, 0, 1);
}
```

### 片元着色器

```glsl
//设置浮点数据类型为中级精度
precision mediump float;
//接收 JavaScript 传过来的颜色值（rgba）。
uniform vec4 u_Color;

void main(){
   vec4 color = u_Color / vec4(255, 255, 255, 1);
   gl_FragColor = color;
}

```

### HTML 部分
HTML 部分还是包含一个 `canvas` 标签，以及存储片元和顶点着色器源码的 `script` 标签，和之前绘制点的内容大致相同，仅着色器源码有所差异。
为了节省篇幅，我们不贴这部分的源码了。

### JavaScript 部分

首先，定义三角形的三个顶点：

```
var positions = [1,0, 0,1, 0,0];
```

给着色器传递顶点数据和上节采用的方式不同，区别在于如何将三角形的三个顶点数据传递到顶点着色器中。  
按照惯例，我们还是先找到 a_Position 变量：

```javascript
var a_Position = gl.getAttribLocation(program, 'a_Position')
```

找到了该变量，接下来我们该怎么传递数据呢？按照上节绘制点的方式传递数据肯定不行了，因为这次我们要传递多个顶点数据。这里我们借助一个强大的工具`缓冲区`，通过缓冲区我们可以向着色器传递多个顶点数据。

首先创建一个缓冲区：

```javascript
var buffer = gl.createBuffer();
```
缓冲区创建好了，我们绑定该缓冲区为 WebGL 当前缓冲区 `gl.ARRAY_BUFFER`，绑定之后，对缓冲区绑定点的的任何操作都会基于该缓冲区（即buffer） 进行。

```javascript
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
```

接下来往当前缓冲区（即上一步通过 bindBuffer 绑定的缓冲区）中写入数据。


```javascript
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
```

>注意，着色器程序中的变量需要强类型数据，所以我们在往缓冲区写数据的时候，JS 的弱类型数组一定要用类型化数组转化一下。上面的 `new Float32Array(positions)`，目的就是将 JavaScript 中的弱类型数组转化为强类型数组。

总结一下这一系列步骤：

* 首先，创建了一个保存顶点坐标的数组，保存了三角形的顶点信息。
* 然后我们使用`gl.createBuffer`创建了一个缓冲区，并通过`gl.bindBuffer(gl.ARRAY_BUFFER, buffer)`绑定 `buffer` 为当前缓冲区。
* 之后我们用`new Float32Array(positions)`将顶点数组转化为更严谨的类型化数组。
* 最后我们使用 `gl.bufferData` 将类型化后的数组复制到缓冲区中，最后一个参数 `gl.STATIC_DRAW` 提示 WebGL 我们不会频繁改变缓冲区中的数据，WebGL 会根据这个参数做一些优化处理。

>以上这些代码属于初始化过程，在渲染过程中一般不会再次调用。

接下来，我们演示如何把顶点组成的模型渲染到屏幕上。

我们需要告诉 WebGL 如何从之前创建的缓冲区中获取数据，并且传递给顶点着色器中的 `a_Position` 属性。 那么，首先启用对应属性 `a_Position`：

```javascript
gl.enableVertexAttribArray(a_Position);
```

接下来我们需要设置从缓冲区中取数据的方式：

```javascript
//每次取两个数据
var size = 2;
//每个数据的类型是32位浮点型
var type = gl.FLOAT;  
//不需要归一化数据
var normalize = false; 
// 每次迭代运行需要移动数据数 * 每个数据所占内存 到下一个数据开始点。
var stride = 0;   
// 从缓冲起始位置开始读取     
var offset = 0; 
// 将 a_Position 变量获取数据的缓冲区指向当前绑定的 buffer。
gl.vertexAttribPointer(
   a_Position, size, type, normalize, stride, offset)
```


>需要注意的是，我们通过 `gl.vertexAttribPointer` 将属性绑定到了当前的缓冲区，即使之后我们使用 `bindBuffer` 绑定到其他缓冲区时，`a_Position` 也依然会从 `buffer` 这个缓冲区中获取数据。



这个函数比较关键，它决定了目标属性(本例是 a_Position )如何从缓冲区中读取数据，在这里我解释一下：

* gl.vertexAttribPointer (target, size, type, normalize, stride, offset)。
   	* target： 允许哪个属性读取当前缓冲区的数据。
   	* size：一次取几个数据赋值给 `target` 指定的目标属性。在我们的示例中，顶点着色器中 a\_Position 是 vec2 类型，即每次接收两个数据，所以 `size` 设置为 2。以后我们绘制立体模型的时候，a\_Position 会接收三个数据，size 相应地也会设置成 3。
   	* type：数据类型，一般而言都是浮点型。
   	* normalize：是否需要将非浮点类型数据`单位化`到【-1, 1】区间。
   	* stride：步长，即每个顶点所包含数据的字节数，默认是 0 ，0 表示一个属性的数据是连续存放的。在我们的例子中，我们的一个顶点包含两个分量，X 坐标和 Y 坐标，每个分量都是一个 Float32 类型，占 4 个字节，所以，stride = 2 * 4 = 8 个字节。但我们的例子中，缓冲区只为一个属性`a_Position`服务，缓冲区的数据是连续存放的，因此我们可以使用默认值 0 来表示。但如果我们的缓冲区为多个属性所共用，那么 stride 就不能设置为 0 了，需要进行计算。
   	* offset：在每个步长的数据里，目标属性需要偏移多少字节开始读取。在我们的例子中，buffer 只为 a_Position 一个属性服务，所以 offset 为 0 * 4 = 0。

假如我们的顶点数组为【10, 20, 30, 30, 40, 50, 60, 70】，每两个相邻数字代表一个顶点的 X 坐标和 Y 坐标。由于我们使用的是 Float32Array 浮点数组，每个数字占 4 个字节。

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165adbb47096a00f~tplv-t2oaga2asx-image.image" width="70%" height="70%">

上面也介绍了，stride 代表每个顶点数据所占用字节数：

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165adbb5478cdcb9~tplv-t2oaga2asx-image.image" width="60%" height="60%">

>这两个图应该能让大家更容易理解 stride 的计算方式。关于 `gl.vertexAttribPointer` 的使用方式我们先告一段落，下节我们再介绍用一个缓冲区为多个属性传递数据时，stride 和 offset 该如何计算。



言归正传，设置完变量和缓冲区的绑定之后，我们接下来编写绘制代码：

```javascript
//绘制图元设置为三角形
var primitiveType = gl.TRIANGLES;
//从顶点数组的开始位置取顶点数据
var offset = 0;
//因为我们要绘制三个点，所以执行三次顶点绘制操作。
var count = 3;
gl.drawArrays(primitiveType, offset, count);
```

大功告成，我们看下效果：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/5/165a8dc7174338aa~tplv-t2oaga2asx-image.image)

>可以看出，使用 WebGL 绘制一个简单的三角形就需要很多代码。但请大家不要担心，代码固然多，但是很容易理解，而且这部分代码我们完全可以通过封装，减少调用。

大家看代码注释就能明白对应的含义，而且 GLSL 的语法也能够让人见名知意。本节不对 GLSL 做过多介绍。我会在之后的中级进阶里专门开辟一个章节详细介绍 GLSL 的语法细节。

一张图演示上面这个例子的数据传输过程：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/5/165a8f2f0f0caff2~tplv-t2oaga2asx-image.image)

## 动态绘制三角形
到目前为止，我们已经实现了在屏幕上绘制一个固定三角形的功能，接下来我们实现动态绘制三角形，大家回想一下上节动态绘制点的逻辑，动态三角形的绘制和它基本类似。

### 着色器部分

* 顶点着色器增加一个变量用来接收 canvas 的尺寸，将 canvas 坐标转化为 NDC 坐标。

```glsl
//设置浮点数精度为中等精度
precision mediump float;
// 接收顶点坐标 (x, y)
attribute vec2 a_Position;
// 接收 canvas 的尺寸(width, height)
attribute vec2 a_Screen_Size;
void main(){
    vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
    position = position * vec2(1.0,-1.0);
    gl_Position = vec4(position, 0, 1);
}

```

* 片元着色器部分没有改动。

### JavaScript 部分
在 JavaScript 代码部分，我们多了一些交互操作：

* 鼠标点击 canvas，存储点击位置的坐标。
* 每点击三次时，再执行绘制命令。因为三个顶点组成一个三角形，我们要保证当顶点个数是3的整数倍时，再执行绘制操作。

关键代码如下：

```javascript
canvas.addEventListener('mouseup', e => {
    var x = e.pageX;
    var y = e.pageY;
    positions.push(x, y);
    if (positions.length % 6 == 0) {
      //向缓冲区中复制新的顶点数据。
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
        //重新渲染
        render(gl);
    }
})

//渲染函数
function render(gl) {
    gl.clearColor(0, 0, 0, 1.0);
    //用上一步设置的清空画布颜色清空画布。
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制图元设置为三角形
    var primitiveType = gl.TRIANGLES;
    //从顶点数组的开始位置取顶点数据
    var drawOffset = 0;
    //因为我们要绘制 N 个点，所以执行 N 次顶点绘制操作。
    gl.drawArrays(primitiveType, 0, positions.length / 2);
}
```

至此，我们完成了动态绘制三角形的功能，效果如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/5/165a8dc46e5a511b~tplv-t2oaga2asx-image.image)


## 回顾

回顾一下我们本节学到的内容：

* 三角形图元分类
	* gl.TRIANGLES：基本三角形。
	* gl.TRIANGLE_STRIP：三角带。
	* gl.TRIANGLE_FAN：三角扇。
* 类型化数组的作用。
	* Float32Array：32位浮点数组。
* 使用缓冲区传递数据。
	* gl.createBuffer：创建buffer。
	* gl.bindBuffer：绑定某个缓冲区对象为当前缓冲区。
	* gl.bufferData：往缓冲区中复制数据。
	* gl.enableVertexAttribArray：启用顶点属性。
	* gl.vertexAttribPointer：设置顶点属性从缓冲区中读取数据的方式。
* 动态绘制三角形。
	* 改变顶点信息，然后通过缓冲区将改变后的顶点信息传递到着色器，重新绘制三角形。
	
## 思考与作业
大家有没有发现一些问题：

* 为什么绘制的所有三角形颜色都是一样的？
* 能不能不同的三角形显示不同的颜色？
* 同一个三角形能不能做成渐变色？

仔细思考一下，动手试试看。

下一节我们学习第三种基本图元：`线段`。



