
本节内容涉及一些术语，为了便于大家理解，在讲解之前，我对相关术语做个简单解释：

* 图元：WebGL 能够绘制的基本图形元素，包含三种：`点`、`线段`、`三角形`。
* 片元：可以理解为像素，像素着色阶段是在片元着色器中。
* 裁剪坐标系：裁剪坐标系是顶点着色器中的 `gl_Position` 内置变量接收到的坐标所在的坐标系。
* 设备坐标系：又名 NDC 坐标系，是裁剪坐标系各个分量对 w 分量相除得到的坐标系，特点是 x、y、z 坐标分量的取值范围都在 【-1，1】之间，可以将它理解为边长为 2 的正方体，坐标系原点在正方体中心。

## 目标
本节实现一个最简单的 WebGL 程序：鼠标点击一次，就会在点击位置处绘制一个随机颜色的点。

效果如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/5/165a8dc5bf0fe41b~tplv-t2oaga2asx-image.image)

希望通过这个例子，能够让大家掌握 WebGL 的绘制过程。

* [演示地址](http://ifanqi.top/webgl/pages/lesson1.1.html)
* [源码地址](https://github.com/lucefer/webgl/blob/master/pages/lesson1.1.html)。

## 编写第一个 WebGL 程序


上节我们讲到 WebGL 应用包含两个要素：`JavaScript程序`和`着色器程序`。本节我们通过绘制一个点来演示这个过程，麻雀虽小，但五脏俱全。使用 WebGL 绘制一个点虽然简单，但是它仍需要 JavaScript 程序和着色器程序共同完成。


我们的目标是绘制一个在屏幕中心，大小为 10，颜色是红色的点。  



### 1、准备着色器源码

我们从`着色器程序`开始入手，先用GLSL编写`顶点着色器`和`片元着色器`。
  
  * 顶点着色器
  
顶点着色器的主要任务是告诉 GPU 在`裁剪坐标系`的原点（也就是屏幕中心）画一个大小为 10 的点。

```glsl
void main(){
    //声明顶点位置
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    //声明待绘制的点的大小。
    gl_PointSize = 10.0;
}
  ```
  
 * 片元着色器

顶点着色器中的数据经过`图元装配`和`光栅化`之后，来到了`片元着色器`，在本例中，片元着色器的任务是通知 GPU 将光栅化后的像素渲染成红色，所以片元着色器要对内置变量 `gl_FragColor` （代表像素要填充的颜色）进行赋值。

 
```glsl
void main(){
    //设置像素的填充颜色为红色。
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
}
```


至此，我们完成了着色器的开发，是不是很简单呢？

但是我相信会有一部分细心的同学产生了疑问：

* gl_Position、gl_PointSize、gl_FragColor 代表什么？为什么没有声明就可以赋值？
* vec4 的含义？
* 在 CSS 语法中或者一些制图软件中，`RGBA` 模式下红色用（255, 0, 0, 1）来表示，为什么片元着色器中颜色用 `vec4(1.0, 0.0, 0.0, 1.0)` 来表示呢？

这些是 GLSL 的语法细节，后面章节我会对 GLSL 语法作详细介绍，但在这之前，我们先要认识一下它们。


那么，解释一下上面列出的三个疑问：

* gl\_Position、gl\_PointSize、gl_FragColor 是 GLSL 的内置属性。

	* gl_Position：顶点的`裁剪坐标系坐标`，包含 X, Y, Z，W 四个坐标分量，顶点着色器接收到这个坐标之后，对它进行透视除法，即将各个分量同时除以 W，转换成 `NDC 坐标`，NDC 坐标每个分量的取值范围都在【-1, 1】之间，GPU 获取这个属性值作为顶点的最终位置进行绘制。
	
	* gl_FragColor：片元（像素）颜色，包含 R, G, B, A 四个颜色分量，且每个分量的取值范围在【0,1】之间，GPU 获取这个值作为像素的最终颜色进行着色。
	
	* gl\_PointSize：绘制到屏幕的点的大小，需要注意的是，gl\_PointSize只有在绘制图元是`点`的时候才会生效。当我们绘制线段或者三角形的时候，gl_PointSize是不起作用的。
	
* vec4：包含四个浮点元素的`容器类型`，vec 是 vector（向量）的单词简写，vec4 代表包含 4 个浮点数的向量。此外，还有 `vec2`、`vec3` 等类型，代表包含`2个`或者`3个`浮点数的容器。

* GLSL 中 gl\_Position 所接收的坐标所在坐标系是裁剪坐标系 ，不同于我们的浏览器窗口坐标系。所以当我们赋予 gl\_Position 位置信息的时候，需要对其进行转换才能正确显示。

* gl_FragColor，属于 GLSL 内置属性，用来设置片元颜色，包含 4 个分量 (R, G, B, A)，各个颜色分量的取值范围是【0，1】，也不同于我们常规颜色的【0，255】取值范围，所以当我们给 gl\_FragColor 赋值时，也需要对其进行转换。平常我们所采用的颜色值（R, G, B, A），对应的转换公式为： (R值/255，G值/255，B值/255，A值/1）。拿红色举例，在CSS中，红色用 `RGBA` 形式表示是（255，0，0，1），那么转换成 GLSL 形式就是(255 / 255, 0 / 255, 0 / 255, 1 / 1)，转换后的值为（1.0, 0.0, 0.0, 1.0)。

> 注意，GLSL 是强类型语言，定义变量时，数据类型和值一定要匹配正确，比如我们给浮点数 a 赋值 1，我们需要这样写：`float a = 1.0;` 如果用 `float a = 1;` 的话会报错。

至此，着色器源码部分编写好了，那么着色器源码该如何使用呢？

着色器源码本质是字符串，所以我们既可以把着色器源码存储在 JavaScript 变量里，也可以放在 script  标签里，甚至存储在数据库中并通过 ajax 请求获取。之后的章节，为了使用方便，我们把着色器源码放在 `script` 标签中。

### 2、准备 HTML 文件
HTML 文件至少需要包含一个 `canvas` 标签，另外需要两个存储`着色器源码`的 script 标签。

```html
<body>
	<!-- 顶点着色器源码 -->
	<script type="shader-source" id="vertexShader">
	 void main(){
  		//声明顶点位置
  		gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  		//声明要绘制的点的大小。
  		gl_PointSize = 10.0;
  	}
	</script>
	
	<!-- 片元着色器源码 -->
	<script type="shader-source" id="fragmentShader">
	 void main(){
	 	//设置像素颜色为红色
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
	}
	</script>
	
	<canvas id="canvas"></canvas>
</body>
```

### 3、JavaScript 程序
准备好了 HTML 文件，我们接着编写 JavaScript 部分。

首先，获取 WebGL 绘图环境：

```javascript
var canvas = document.querySelector('#canvas');
var gl = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");
```
> 在某些浏览器中，我们还需要做下兼容处理，加上实验前缀。


创建顶点着色器对象：

```javascript
// 获取顶点着色器源码
var vertexShaderSource = document.querySelector('#vertexShader').innerHTML;
// 创建顶点着色器对象
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
// 将源码分配给顶点着色器对象
gl.shaderSource(vertexShader, vertexShaderSource);
// 编译顶点着色器程序
gl.compileShader(vertexShader);
```

接下来，创建片元着色器，该过程和顶点着色器的创建过程类似，区别在于`着色器源码`和`着色器类型`。

```javascript
// 获取片元着色器源码
var fragmentShaderSource = document.querySelector('#fragmentShader').innerHTML;
// 创建片元着色器程序
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
// 将源码分配给片元着色器对象
gl.shaderSource(fragmentShader, fragmentShaderSource);
// 编译片元着色器
gl.compileShader(fragmentShader);
```

着色器对象创建完毕，接下来我们开始创建着色器程序

```javascript
//创建着色器程序
var program = gl.createProgram();
//将顶点着色器挂载在着色器程序上。
gl.attachShader(program, vertexShader); 
//将片元着色器挂载在着色器程序上。
gl.attachShader(program, fragmentShader);
//链接着色器程序
gl.linkProgram(program);
```

有时候一个 WebGL 应用包含多个 program，所以在使用某个 program 绘制之前，我们要先启用它。

```javascript
// 使用刚创建好的着色器程序。
gl.useProgram(program);
```

准备工作做好了，接下来开始绘制：

```javascript
//设置清空画布颜色为黑色。
gl.clearColor(0.0, 0.0, 0.0, 1.0);

//用上一步设置的清空画布颜色清空画布。
gl.clear(gl.COLOR_BUFFER_BIT);

//绘制点。
gl.drawArrays(gl.POINTS, 0, 1);
```


gl.drawArrays 的语法简单介绍如下，详细介绍参见[这里](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/drawArrays)。
> void gl.drawArrays(mode, first, count);
* 参数：
    * mode，代表图元类型。
    * first，代表从第几个点开始绘制。
    * count，代表绘制的点的数量。
    


`gl.drawArrays` 是执行绘制的 API，上面示例中的第一个参数 `gl.POINTS` 代表我们要绘制的是`点图元`，第二个参数代表要绘制的顶点的起始位置，第三个参数代表顶点绘制个数。

至此，着色器部分和 JavaScript 程序都写完了，运行看下效果：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/5/165a8dc66b729ea4~tplv-t2oaga2asx-image.image)

上面这些代码实现了点的绘制。大家应该发现了，在 `gl.drawArrays` 方法之前有很多重复的代码，这些重复代码是我们实现每个 WebGL 应用都要编写的，为了避免重复工作，我们把这些代码封装一下，封装出的函数库放在 webgl-helper.js 文件中，优化过后的代码如下：

```javascript
//获取canvas
var canvas = getCanvas(id);

//获取webgl绘图环境
var gl = getWebGLContext(canvas);

//创建顶点着色器
var vertexShader = createShaderFromScript(gl, gl.VERTEX_SHADER,'vertexShader');
//创建片元着色器
var fragmentShader = createShaderFromScript(gl, gl.FRAGMENT_SHADER,'fragmentShader');

//创建着色器程序
var program = createProgram(gl ,vertexShader, fragmentShader);
//告诉 WebGL 运行哪个着色器程序
gl.useProgram(program);

//设置清空画布颜色为黑色。
gl.clearColor(0.0, 0.0, 0.0, 1.0);
//用上一步设置的清空画布颜色清空画布。
gl.clear(gl.COLOR_BUFFER_BIT);
//绘制点
gl.drawArrays(gl.POINTS, 0, 1);
```

九行代码就实现了绘制点的程序，是不是简洁了很多？

## 点的动态绘制
上例只是实现了一个静态点的绘制，但是真正的 WebGL 应用总是需要通过网页和用户进行交互，进而改变画面的。所以接下来，我们要实现一个简单交互程序：在鼠标点击过的位置绘制一个点，而且这个点的颜色是随机的。

这要求我们有能力通过 JavaScript 往着色器程序中传入顶点位置和颜色数据，从而改变点的位置和颜色。

### 着色器程序
我们修改一下着色器程序，修改后的着色器程序要能够接收 JavaScript 传递过来的数据：

* 顶点着色器

```glsl
//设置浮点数精度为中等精度
precision mediump float;
//接收点在 canvas 坐标系上的坐标 (x, y)
attribute vec2 a_Position;
//接收 canvas 的宽高尺寸
attribute vec2 a_Screen_Size;
void main(){
    //start 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
   vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0; 
   position = position * vec2(1.0, -1.0);
   gl_Position = vec4(position, 0, 1);
   //end 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
   //声明要绘制的点的大小。
   gl_PointSize = 10.0;
}
```

* 片元着色器

```glsl
//设置浮点数精度为中等精度
precision mediump float;
//接收 JavaScript 传过来的颜色值（RGBA）。
uniform vec4 u_Color;
void main(){
    //将普通的颜色表示转化为 WebGL 需要的表示方式，即将【0-255】转化到【0,1】之间。
   vec4 color = u_Color / vec4(255, 255, 255, 1);
   gl_FragColor = color; 
}
```

这次的着色器和上例中的着色器有很大不同，大家可以发现，顶点着色器中在给 `gl_Position` 赋值之前，进行了一系列运算。片元着色器中给 `gl_FragColor` 赋值之前，也进行了一系列运算。代码注释大家应该能看懂，我简单讲一下：

* 顶点着色器  

我们在顶点着色器中定义两个 attribute 变量： `a_Position` 和 `a_Screen_Size`，a_Position 接收 `canvas 坐标系`下的点击坐标。  
`vec2` 代表存储两个浮点数变量的容器，因本节不涉及`深度计算`，所以我们只接收顶点的 x 和 y 坐标。  
a_Screen_Size 变量用来接收 JavaScript 传递过来的 canvas 的宽高尺寸。

```glsl
vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0
```
上面这句代码用来将浏览器窗口坐标转换成裁剪坐标，之后通过透视除法，除以 w 值（此处为 1 ）转变成设备坐标（NDC坐标系）。这个算法首先将(x,y) 转化到【0, 1】区间，再将 【0, 1】之间的值乘以 2 转化到 【0, 2】区间，之后再减去 1 ，转化到 【-1, 1】之间的值，即 `NDC 坐标`。   

事实上，这是我们第一次接触坐标系变换: 从 Canvas 坐标系转变到 NDC 坐标系（即设备坐标系），这个变换比较简单，我们用基本运算就可以实现。

>在中级进阶阶段，我会给大家介绍一种更通用的转换方法：矩阵变换。



* 片元着色器  

片元着色器定义了一个`全局变量` (被 uniform 修饰的变量) ，用来接收 JavaScript 传递过来的随机颜色。

大家应该注意到了，到目前为止，我们定义变量采用过两种形式，一种是通过 attribute 修饰，一种是通过 uniform 修饰。同样都是用来接收 JavaScript 传递过来的信息，它们有什么区别呢？

* attribue 变量：只能在`顶点着色器`中定义。

* uniform 变量：既可以在`顶点着色器`中定义，也可以在`片元着色器中`定义。

* 最后一种变量类型 `varing` 变量：它用来从`顶点着色器`中往`片元着色器`传递数据。使用它我们可以在顶点着色器中声明一个变量并对其赋值，经过插值处理后，在片元着色器中取出插值后的值来使用。


### HTML 部分

```html
<script type="shader-source" id="vertexShader">
    precision mediump float;
	//接收点在 canvas 坐标系上的坐标 (x, y)
    attribute vec2 a_Position;
	//接收 canvas 窗口尺寸(width, height)
    attribute vec2 a_Screen_Size;
    void main(){
	    //将屏幕坐标系转化为 GLSL 限定的坐标值（NDC坐标系）
   	    vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0; 
   	    position = position * vec2(1.0, -1.0);
   	    gl_Position = vec4(position, 0, 1);
   	    //声明要绘制的点的大小。
   	    gl_PointSize = 10.0;
    }  
 </script>

  <!-- 片元着色器源码 -->
  <script type="shader-source" id="fragmentShader">
    precision mediump float;
    //接收 JavaScript 传过来的颜色值（rgba）。
    uniform vec4 u_Color;
    void main(){
   	    vec4 color = u_Color / vec4(255, 255, 255, 1);
   	    gl_FragColor = color; 
    }
   </script>

  <canvas id="canvas"></canvas>

```

### JavaScript 程序
JavaScript 部分的实现与静态点的绘制大致相同，只是增加了为着色器中变量进行赋值的代码。

动态绘制点的逻辑是：

* 声明一个数组变量 `points`，存储点击位置的坐标。
* 绑定 canvas 的点击事件。
* 触发点击操作时，把点击坐标添加到数组     `points` 中。
* 遍历每个点执行 `drawArrays(gl.Points, 0, 1)` 绘制操作。

```javascript
...省略着色器创建部分。
//找到顶点着色器中的变量a_Position
var a_Position = gl.getAttribLocation(program, 'a_Position');
//找到顶点着色器中的变量a_Screen_Size
var a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');
//找到片元着色器中的变量u_Color
var u_Color = gl.getUniformLocation(program, 'u_Color');
//为顶点着色器中的 a_Screen_Size 传递 canvas 的宽高信息
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);
//存储点击位置的数组。
var points = [];
canvas.addEventListener('click', e => {
   var x = e.pageX;
   var y = e.pageY;
   var color = randomColor();
   points.push({ x: x, y: y, color: color })
   gl.clearColor(0, 0, 0, 1.0);
   //用上一步设置的清空画布颜色清空画布。
  	gl.clear(gl.COLOR_BUFFER_BIT);
   for (let i = 0; i < points.length; i++) {
     var color = points[i].color;
     //为片元着色器中的 u_Color 传递随机颜色
     gl.uniform4f(u_Color, color.r, color.g, color.b, color.a);
     //为顶点着色器中的 a_Position 传递顶点坐标。
     gl.vertexAttrib2f(a_Position, points[i].x, points[i].y);
     //绘制点
     gl.drawArrays(gl.POINTS, 0, 1);
   }
 })
 // 设置清屏颜色
 gl.clearColor(0, 0, 0, 1.0);
 // 用上一步设置的清空画布颜色清空画布。
 gl.clear(gl.COLOR_BUFFER_BIT);

```



至此，我们实现了在 canvas 上进行点击，在点击位置处绘制一个随机颜色的点的程序。



#### 不足之处：  
本示例我们采用 `gl.vertexAttrib2f ` 直接给 a_Position 赋值，所以每绘制一个点，都要给着色器变量赋值一次，并且绘制一次，效率比较低。后面我们会介绍一种更快速的方式：利用缓冲区传递多个顶点数据。

## 回顾

本小节通过演示如何使用 WebGL 绘制一个动态位置、随机颜色的点，向大家介绍 WebGL 程序的组成要素，以及一些简单的 GLSL 语法。
总结一下本节所学内容：

* GLSL
	* gl_Position： 内置变量，用来设置顶点坐标。
	* gl_PointSize： 内置变量，用来设置顶点大小。
	* vec2：2 维向量容器，可以存储 2 个浮点数。
	* gl_FragColor： 内置变量，用来设置像素颜色。
	* vec4：4 维向量容器，可以存储 4 个浮点数。
	* precision：精度设置限定符，使用此限定符设置完精度后，之后所有该数据类型都将沿用该精度，除非单独设置。
	* 运算符：向量的对应位置进行运算，得到一个新的向量。  
	    * vec * 浮点数： vec2(x, y) * 2.0 = vec(x * 2.0, y * 2.0)。  
	    * vec2 * vec2：vec2(x1, y1) * vec2(x2, y2) = vec2(x1 * x2, y1 * y2)。  
	    * 加减乘除规则基本一致。但是要注意一点，如果参与运算的是两个 vec  向量，那么这两个 vec 的维数必须相同。
	
* JavaScript 程序如何连接着色器程序
	* createShader：创建着色器对象
	* shaderSource：提供着色器源码
	* compileShader：编译着色器对象
	* createProgram：创建着色器程序
	* attachShader：绑定着色器对象
	* linkProgram：链接着色器程序
	* useProgram：启用着色器程序
* JavaScript 如何往着色器中传递数据
	* getAttribLocation：找到着色器中的 `attribute 变量`地址。
	* getUniformLocation：找到着色器中的 `uniform 变量`地址。
	* vertexAttrib2f：给 `attribute 变量`传递两个浮点数。
	* uniform4f：给`uniform变量`传递四个浮点数。
* WebGL 绘制函数
	* drawArrays: 用指定的图元进行绘制。
* WebGL 图元
	* gl.POINTS: 将绘制图元类型设置成`点图元`。
	
另外需要注意，本节例子的坐标系转换我们是在着色器阶段完成的，事实上，我们通常在 JavaScript 上计算出`转换矩阵`，然后将`转换矩阵`连同`顶点信息`一并传递给着色器。大家可以尝试把这部分坐标转换算法移到 JavaScript 中试试，效果是一样的。

好好消化一下本节内容，之后的章节仍然会用到这些知识。

接下来让我们进入下一环节，学习三角形图元的绘制吧~




