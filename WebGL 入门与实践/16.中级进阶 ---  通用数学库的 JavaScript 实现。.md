

上一节我们介绍了图形学涉及到的数学知识，并介绍了了它们的各种运算规则，掌握这些规则对我们开发 3D 应用有着至关重要的作用。本节我们看一下如何将这些运算规则表示出来。

业界已经有一些有名的数学库，比如基于 JavaScript 的`Threejs`框架中就内置了 `matrix` 和 `vector` 的操作类，还有基于 C++ 语言进行实现的 `GLM`。

由于我们是 WebGL 开发，所以我将带大家使用 JavaScript 实现这些数学算法。

## 需要实现哪些功能？

那么，我们即将编写的数学库要能够实现哪些功能呢？

上一节已经讲了，主要是`向量`和`矩阵`的表示、运算。

在此罗列一下：

* 向量
    * 初始化向量
    * 归一化向量
    * 向量相加
    * 向量相减
    * 向量与标量相乘
    * 向量与标量相除
    * 向量与向量相乘
    * 点积
    * 叉积
* 矩阵
    * 初始化矩阵   
    * 创建单位矩阵
    * 矩阵与矩阵相乘
    * 矩阵相加
    * 矩阵相减
    * 求转置矩阵
    * 求逆矩阵

## 矩阵在 GLSL 中的存储特点。
在用 JavaScript 实现数学库之前，我们必须先想清楚如何使用开发出来的库。大家应该都知道，WebGL 应用中的数据一般是从 CPU 传入 GPU 的，语言层面从 JavaScript 传入 GLSL。假如我们要把在 JavaScript 中生成的矩阵传入到 GLSL 中，那么就得保证生成的矩阵能够被 GLSL 所理解，换句话说，JavaScript 矩阵和 GPU 中的矩阵要有相同的表示形式，避免不必要的转换过程。
那么 GPU 中向量和矩阵是如何存储的呢？

在前面章节的初级练习中，我们已经频繁接触了 GLSL 中的向量`vec`和矩阵`mat`，GLSL遵循的是线性代数的标准，也就是上一节我们所讲的内容，只是在存储方式上有所不同。

### 行主序和列主序
存储顺序说明了线性代数中的矩阵如何在线性的内存数组中存储，按照存储方式分为行主序和列主序。

行主序是按照行向量的方式组织矩阵。列主序是按照列向量的方式组织矩阵，为了便于理解，我们看下图示。


假设有一个 3 阶方阵 M：

$
\begin{aligned}
M = \begin{pmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{pmatrix}
\end{aligned}
$

那么它在内存中的排布方式如下：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/20/1669106cb868043c~tplv-t2oaga2asx-image.image)

观察上面的图，就能够一目了然地看出行主序和列主序的区别了。

请务必谨记，D3D 中矩阵采用的是行主序的存储方式，GLSL 中采用的是列主序。

## 实现JavaScript数学库 
那么，既然 GLSL 采用的是列主序存储，为了保持一致，我们在JavaScript中最好也采用列主序的方式存储，和 GLSL 保持一致。

### JavaScript中 用什么数据结构来表示矩阵
我们用`数组`来表示矩阵，但由于 JavaScript 数组是弱类型的，并没有严格按照内存位置进行排布，而 GLSL 中的矩阵元素是严格按照内存地址顺序排列的，所以我们需要将弱类型数组转化成二进制形式，通常我们使用 Float32Array 把弱类型数组转化成强类型数组。

```javascript
let M = [1, 2, 3, 4, 5, 6, 7, 8, 9];
M = new Float32Array(M);
```

### 实现数学库中的方法
图形学中多用方阵来表示变换，因为我们要在 3D 坐标系中变换，所以我们要用 4 阶方阵，所以关于矩阵的运算，我们主要以 4 阶矩阵为基础。

#### 3维向量初始化
 图形学编程中用的比较多的是 3 维、4 维向量，3 维向量多用来表示笛卡尔坐标系中的顶点坐标(X, Y, Z)，4维向量通常表示齐次坐标，如(X, Y, Z, W)，以及颜色信息(R, G, B, A)。
 我们需要初始化向量的方法，默认值为 0。
 
 下面以 3 维向量为例进行实现， 4 维向量和 3维类似。
 
 ##### 3 维向量初始化
 * 输入参数 source 是 JavaScript 弱类型数组（Array），包含3个元素，比如[0, 0, 1]。
 * 返回结果是强类型数组，包含 3 个元素[0, 0, 1]。
 ```javascript
 function Vector3(x, y, z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
 }
 ```
##### 设置各个分量

```javascript
Vector3.prototype.setX = function(x) {
    this.x = x || 0;
    return this;
}
Vector3.prototype.setY = function(y) {
    this.y = y || 0;
    return this;
}
Vector3.prototype.setZ = function(z) {
    this.z = z || 0;
    return this;
}

```
#### 归一化向量
归一化向量比较简单，首先求出向量的长度（模），然后将各个分量除以模即可。


```javascript
Vector3.prototype.normalize = function() {
    var length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if(length > 0.00001){
        return new Vector3(this.x / length, this.y / length, this.z / length);
    }
    return new Vector3();
}
```

#### 向量与向量相加

```javascript
Vector3.prototype.addVectors = function(vec1, vec2){
    this.x = vec1.x + vec2.x;
    this.y = vec1.y + vec2.y;
    this.z = vec1.z + vec2.z;
    return this;
}
```

```javascript
Vector3.prototype.add = function(vec1, vec2){
    if(vec2){
       return this.addVector(vec1, vec2);
    }
    this.x += vec1.x;
    this.y += vec1.y;
    this.z += vec1.z;
    return this;
}
```
#### 向量与向量相减
```javascript
Vector3.prototype.sub = function(vec1, vec2){
    if(vec2){
       return this.addVector(vec1, -vec2);
    }
    this.x -= vec1.x;
    this.y -= vec1.y;
    this.z -= vec1.z;
    return this;
}
```

#### 向量与标量相乘

```javascript
Vector3.prototype.multiplyScalar = function(scalar){
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
}
```
#### 向量与向量相乘
其实数学中是没有向量和向量相乘这一说法的，只是为了更方便的计算两个向量各个分量的乘积，所以增加这个计算，在GLSL 中 vec4 和 vec4 相乘返回的新向量就是将各个分量相乘，在计算光照时经常用到。

```javascript
Vector3.prototype.multiplyVector = function(vec1, vec2){
    this.x = vec1.x * vec2.x;
    this.y = vec1.y * vec2.y;
    this.z = vec1.z * vec2.z;
    return this;
}
Vector3.prototype.multiply = function(vec1, vec2){
    if(vec2){
        return this.multiplyVector(vec1, vec2);
    }
    this.x *= vec1.x;
    this.y *= vec1.y;
    this.z *= vec1.z;
    return this;
}
```

#### 点乘
上一节讲过了，点乘就是将向量的各个分量相乘然后再相加，返回的结果是一个标量。

```javascript
function dot(vec1, vec2){
    return vec1.x * vec2.x + vec1.y *vec2.y + vec1.z * vec2.z;
}
```

#### 叉乘
叉乘的计算方法也比较简单，上一节我们讲了计算公式：

```javascript
function cross(vec1, vec2){
    var x = vec1.y * vec2.z - vec2.y * vec1.z;
    var y = vec2.x * vec1.z - vec1.x * vec2.z;
    var z = vec1.x * vec2.y - vec1.y * vec2.x;
    return new Vector3(x, y, z);
}
```


#### 初始化 4 阶单位矩阵
我们需要一个方法能够自动生成一个单位矩阵：

$
\begin{pmatrix}
1 &  0 &  0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1 \\
\end{pmatrix}
$

4 阶矩阵包含 16 个元素，所以我们要初始化 16 个元素的类型化数组，处于性能考虑，我们需要支持对一个矩阵进行单位化。

```javascript
function identity(target) {
    target = target || new Float32Array(16);
}
```
默认各个元素值都是 0 ，我们要将该数组中各个元素的值与数学中的单位矩阵对应上，又由于矩阵以列主序存储，所以每四个数字代表一列：

```javascript
function identity(target) {
    target = target || new Float32Array(16);
    // 第一列
    target[0] = 1;
    target[1] = 0;
    target[2] = 0;
    target[3] = 0;
    // 第二列
    target[4] = 0;
    target[5] = 1;
    target[6] = 0;
    target[7] = 0;
    // 第三列
    target[8] = 0;
    target[9] = 0;
    target[10] = 1;
    target[11] = 0;
    // 第四列
    target[12] = 0;
    target[13] = 0;
    target[14] = 0;
    target[15] = 1;
    
    return target;
}
```

初始化单位矩阵的方法就算完成了，我们还可以用另一种方式来生成，先用 JavaScrpt 数组存储矩阵各个元素，然后用 Float32Array 转化成强类型数组。

```javascript
function identity(){
    var m = 
        [
            1, 0, 0, 0, // 第一列
            0, 1, 0, 0, // 第二列
            0, 0, 1, 0, // 第三列
            0, 0, 0, 1  // 第四列
        ]
    return new Float32Array(m);
}
```
这两种方法用哪种方法都可以，我们使用第一种方法。

#### 初始化 4 阶方阵
有时我们需要根据一个列主序的弱类型数组初始化成矩阵。

* 输入参数
    * source：源数组，包含16个元素。
    * target：目标数组，将目标数组初始化成source对应的元素。
* 返回结果
    * 如果source 不为空，返回该数组对应的强类型数组矩阵。  
    * 如果 source 为空，返回单位矩阵
```javascript
function initialize(source, target) {
    if(source){
        if(target){
            for(var i = 0;i < source.length; i++){
                target[i] = source[i];
            }
            return target;
        }
        return new Float32Array(source);
    }
    return identity(target);
}

//使用方法
initialize([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
```

#### 矩阵和矩阵相加减

虽然矩阵和矩阵相加减的场景很少，但我们仍然要支持它们。实现比较简单，但有一个前提：相加减的两个矩阵的行列必须相同。
* 输入参数
    * m1，操作符左边矩阵。
    * m2，操作符右边矩阵。
    * target，将结果存入 target 数组。
* 返回结果
    * 返回相加、减后的新矩阵。

```javascript
// m1 + m2
function addMatrix(m1, m2, target){
    target = target || new Float32Array(16);
    for(var i = 0; i < m1.length; i++){
        target[i] = m1[i] + m2[i]
    }
    return target;
}

// m1 - m2
function subtractMatrix(m1, m2, target){
    target = target || new Float32Array(16);
    for(var i = 0; i < m1.length; i++){
        target[i] = m1[i] - m2[i]
    }
    return target;
}
```

#### 矩阵和矩阵相乘

矩阵相乘是最经常用到的运算，我们看下如何用 JavaScript 实现。

假设有两个 4 阶方阵 M 和 N，其中：

```javascript
M = 
    [
        a00, a01, a02, a03, //第一列
        a10, a11, a12, a13, //第二列
        a20, a21, a22, a23, //第三列
        a30, a31, a32, a33, //第四列
    ] 
N = 
    [
        b00, b01, b02, b03, //第一列
        b10, b11, b12, b13, //第二列
        b20, b21, b22, b23, //第三列
        b30, b31, b32, b33, //第四列
    ]
```
 参考上一节的矩阵乘法， $N \times M $的算法表示如下：
 
 ```javascript
 // 此处的 prev 代表 M，next 代表 N
 function multiply(next, prev, target){
    target = target || new Float32Array(16);
    // 第一列
    var p00 = prev[0];
    var p10 = prev[1];
    var p20 = prev[2];
    var p30 = prev[3];
    // 第二列
    var p01 = prev[4];
    var p11 = prev[5];
    var p21 = prev[6];
    var p31 = prev[7];
    // 第三列
    var p02 = prev[8];
    var p12 = prev[9];
    var p22 = prev[10];
    var p32 = prev[11];

    // 第四列
    var p03 = prev[12];
    var p13 = prev[13];
    var p23 = prev[14];
    var p33 = prev[15];

    // 第一行
    var n00 = next[0];
    var n01 = next[4];
    var n02 = next[8];
    var n03 = next[12];
    // 第二行
    var n10 = next[1];
    var n11 = next[5];
    var n12 = next[9];
    var n13 = next[13];
    // 第三行
    var n20 = next[2];
    var n21 = next[6];
    var n22 = next[10];
    var n23 = next[14];

    // 第四行
    var n30 = next[3];
    var n31 = next[7];
    var n32 = next[11];
    var n33 = next[15];

    target[0] = p00 * n00 + p10 * n01 + p20 * n02 + p30 * n03;
    target[1] = p00 * n10 + p10 * n11 + p20 * n12 + p30 * n13;
    target[2] = p00 * n20 + p10 * n21 + p20 * n22 + p30 * n23;
    target[3] = p00 * n30 + p10 * n31 + p20 * n32 + p30 * n33;

    target[4] = p01 * n00 + p11 * n01 + p21 * n02 + p31 * n03;
    target[5] = p01 * n10 + p11 * n11 + p21 * n12 + p31 * n13;
    target[6] = p01 * n20 + p11 * n21 + p21 * n22 + p31 * n23;
    target[7] = p01 * n30 + p11 * n31 + p21 * n32 + p31 * n33;

    target[8] = p02 * n00 + p12 * n01 + p22 * n02 + p32 * n03;
    target[9] = p02 * n10 + p12 * n11 + p22 * n12 + p32 * n13;
    target[10] = p02 * n20 + p12 * n21 + p22 * n22 + p32 * n23;
    target[11] = p02 * n30 + p12 * n31 + p22 * n32 + p32 * n33;

    target[12] = p03 * n00 + p13 * n01 + p23 * n02 + p33 * n03;
    target[13] = p03 * n10 + p13 * n11 + p23 * n12 + p33 * n13;
    target[14] = p03 * n20 + p13 * n21 + p23 * n22 + p33 * n23;
    target[15] = p03 * n30 + p13 * n31 + p23 * n32 + p33 * n33;

    return target;
 }
 ```
 
 我们一共要计算 16 个元素，可以看出计算步骤很繁琐，但都没有难度，都是简单的基本运算，我们只要保证好顺序正确就可以。
 
#### 矩阵和标量相乘

矩阵和标量相乘比较简单，各个位置的元素分别乘以标量就可以了。

```javascript
function multiplyScalar(m, scalar){
    if(scalar === undefined || scalar === null){
        return m;
    }
    for(var i = 0; i < m.length; i++){
        m[i] *= scalar;
    }
    return m;
}
```

 

#### 转置矩阵

转置矩阵其实就是将原矩阵的行变成列。
有一个矩阵 M ：

$
\begin{pmatrix}
1 & 2 & 3 & 4 \\\
5 & 6 & 7 & 8 \\\
9 & 10 & 11 & 12 \\\
13 & 14 & 15 & 16
\end{pmatrix}
$

M 的转置矩阵：
$
\begin{pmatrix}
1 & 5 & 9 & 13 \\\
2 & 6 & 10 & 14 \\\
3 & 7 & 11 & 15 \\\
4 & 8 & 12 & 16
\end{pmatrix}
$

我们转置函数接收一个输入参数，表示待转置的矩阵，用m 表示：
* 输入参数：
    * m，原矩阵
* 输出结果
    * target，转置矩阵。 
```javascript
function transpose(m, target){
    target  = target || new Float32Array(16);
    //转置矩阵的第一列
    target[0] = m[0];
    target[1] = m[4];
    target[2] = m[8];
    target[3] = m[12];
    //转置矩阵的第二列
    target[4] = m[1];
    target[5] = m[5];
    target[6] = m[9];
    target[7] = m[13];
    //转置矩阵的第三列
    target[8] = m[2];
    target[9] = m[6];
    target[10] = m[10];
    target[11] = m[14];
    //转置矩阵的第四列
    target[12] = m[3];
    target[13] = m[7];
    target[14] = m[11];
    target[15] = m[15];
    
    return target;
}
```

#### 计算逆矩阵
逆矩阵的计算是最复杂的计算，很容易把人绕晕，如果大家感兴趣，按照上一节讲的逆矩阵求解步骤，可以自己写一下这个算法。

回忆一下，逆矩阵的计算分为 4 步：

* 求出余子式矩阵。
* 为余子式矩阵增加符号。
* 转置第二步的矩阵。
* 将第三步得出的矩阵乘以 1/行列式。

完成以上四步，最后得出的矩阵就是逆矩阵了。
我们实现一下该算法：

#####  1、求出余子式矩阵
假设矩阵M，$m_{ij}$来表示各个位置的元素，i 表示第几行，j 表示第几列。

例如m00，就代表处于第一行第一列的元素。

$
\begin{pmatrix}
m00 & m01 & m02 & m03 \\\
m10 & m11 & m12 & m13 \\\
m20 & m21 & m22 & m23 \\\
m30 & m31 & m32 & m33 
\end{pmatrix}
$


```javascript
function inverse(m){
    //第一列
    var m00 = m[0];
    var m10 = m[1];
    var m20 = m[2];
    var m30 = m[3];
    // 第二列
    var m01 = m[4];
    var m11 = m[5];
    var m21 = m[6];
    var m31 = m[7];
    // 第三列
    var m02 = m[8];
    var m12 = m[9];
    var m22 = m[10];
    var m32 = m[11];
    // 第四列
    var m03 = m[12];
    var m13 = m[13];
    var m23 = m[14];
    var m33 = m[15];
}

```

矩阵的行列式：

```javascript
  var tmp_22_33 = m22 * m33;
  var tmp_32_23 = m32 * m23;
  var tmp_21_33 = m21 * m33;
  var tmp_31_23 = m31 * m23;
  var tmp_12_23 = m12 * m23;
  var tmp_22_13 = m22 * m13;
  var tmp_10_23 = m10 * m23;
  var tmp_20_13 = m20 * m13;
  var tmp_11_23 = m11 * m23;
  var tmp_21_13 = m21 * m13;
  var tmp_20_32 = m20 * m32;
  var tmp_10_22 = m10 * m22;
  var tmp_20_12 = m20 * m12;
  var tmp_10_21 = m10 * m21;
  var tmp_20_11 = m20 * m11;
  var tmp_31_22 = m31 * m22;
  var tmp_30_23 = m30 * m23;
  var tmp_30_22 = m30 * m22;
  var tmp_20_33 = m20 * m33;
  var tmp_20_31 = m20 * m31;
  var tmp_30_21 = m30 * m21;
  var tmp_21_32 = m21 * m32;
  var tmp_12_33 = m12 * m33;
  var tmp_32_13 = m32 * m13;
  var tmp_11_32 = m11 * m32;
  var tmp_31_12 = m31 * m12;
  var tmp_11_33 = m11 * m33;
  var tmp_31_13 = m31 * m13;
  var tmp_10_33 = m10 * m33;
  var tmp_30_13 = m30 * m13;
  var tmp_10_32 = m10 * m32;
  var tmp_30_12 = m30 * m12;
  var tmp_10_31 = m10 * m31;
  var tmp_30_11 = m30 * m11;
  var tmp_11_22 = m11 * m22;
  var tmp_21_12 = m21 * m12;

  var t00 =
    m11 * (tmp_22_33 - tmp_32_23) -
    m12 * (tmp_21_33 - tmp_31_23) +
    m13 * (tmp_21_32 - tmp_31_22);
  var t01 =
    m10 * (tmp_22_33 - tmp_32_23) -
    m12 * (tmp_20_33 - tmp_30_23) +
    m13 * (tmp_20_32 - tmp_30_22);
  var t02 =
    m10 * (tmp_21_33 - tmp_31_23) -
    m11 * (tmp_20_33 - tmp_30_23) +
    m13 * (tmp_20_31 - tmp_30_21);
  var t03 =
    m10 * (tmp_21_32 - tmp_31_22) -
    m11 * (tmp_20_32 - tmp_30_22) +
    m12 * (tmp_20_31 - tmp_30_21);

  // 矩阵的行列式
  var determinant = m00 * t00 - m01 * t01 + m02 * t02 - m03 * t03;
```

##### 余子式矩阵
余子式矩阵是将原矩阵各个位置的行列式求解出来放在对应位置，生成的一个新矩阵。

求解行列式是一个很繁琐但是很简单的过程，因为它涉及到的只是简单的算术运算。

```javascript
// 第一行
  var n00 = t00;
  var n01 = t01;
  var n02 = t02;
  var n03 = t03;

  // 第二行
  var n10 =
    m01 * (tmp_22_33 - tmp_32_23) -
    m02 * (tmp_21_33 - tmp_31_23) +
    m03 * (tmp_21_32 - tmp_31_22);
  var n11 =
    m00 * (tmp_22_33 - tmp_32_23) -
    m02 * (tmp_20_33 - tmp_30_23) +
    m03 * (tmp_20_32 - tmp_30_22);
  var n12 =
    m00 * (tmp_21_33 - tmp_31_23) -
    m01 * (tmp_20_33 - tmp_30_23) +
    m03 * (tmp_20_31 - tmp_30_21);
  var n13 =
    m00 * (tmp_21_32 - tmp_31_22) -
    m01 * (tmp_20_32 - tmp_30_22) +
    m02 * (tmp_20_31 - tmp_30_21);

  // 第三行
  var n20 =
    m01 * (tmp_12_33 - tmp_32_13) -
    m02 * (tmp_11_33 - tmp_31_13) +
    m03 * (tmp_11_32 - tmp_31_12);
  var n21 =
    m00 * (tmp_12_33 - tmp_32_13) -
    m02 * (tmp_10_33 - tmp_30_13) +
    m03 * (tmp_10_32 - tmp_30_12);
  var n22 =
    m00 * (tmp_11_33 - tmp_31_13) -
    m01 * (tmp_10_33 - tmp_30_13) +
    m03 * (tmp_10_31 - tmp_30_11);
  var n23 =
    m00 * (tmp_11_32 - tmp_31_12) -
    m01 * (tmp_10_32 - tmp_30_12) +
    m02 * (tmp_10_31 - tmp_30_11);

  // 第四行
  var n30 =
    m01 * (tmp_12_23 - tmp_22_13) -
    m02 * (tmp_21_33 - tmp_31_23) +
    m03 * (tmp_11_22 - tmp_21_12);
  var n31 =
    m00 * (tmp_12_23 - tmp_22_13) -
    m02 * (tmp_10_23 - tmp_20_13) +
    m03 * (tmp_10_22 - tmp_20_12);
  var n32 =
    m00 * (tmp_11_23 - tmp_21_13) -
    m01 * (tmp_10_23 - tmp_20_13) +
    m03 * (tmp_10_21 - tmp_20_11);
  var n33 =
    m00 * (tmp_11_22 - tmp_21_12) -
    m01 * (tmp_10_22 - tmp_20_12) +
    m02 * (tmp_10_21 - tmp_20_11);

```

##### 代数余子式矩阵
把"纵横交错"排列的正负号放在"余子式矩阵"上。换句话说，我们需要每隔一个格改变正负号，像这样：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/21/16696adefc66dacf~tplv-t2oaga2asx-image.image)

```javascript
n01 = -n01;
n03 = -n03;
n10 = -n10;
n12 = -n12;
n21 = -n21;
n23 = -n23;
n30 = -n30;
n32 = -n32;
```

##### 转置代数余子式矩阵

将上面经过转换符号的余子式矩阵转置。

```javascript
target = target || new Float32Array(16);
target[0] = n00;
target[1] = n01;
target[2] = n02;
target[3] = n03;
target[4] = n10;
target[5] = n11;
target[6] = n12;
target[7] = n13;
target[8] = n20;
target[9] = n21;
target[10] = n22;
target[11] = n23;
target[12] = n30;
target[13] = n31;
target[14] = n32;
target[15] = n33;
```

##### 乘以 1/原矩阵的行列式
最后一步，我们将上面得到的转置矩阵乘以 1/原矩阵的行列式，得出的新矩阵就是所求逆矩阵。

```javascript
for(var i = 0; i< result.length; i++){
    target[i] = target[i] * 1 / determinant;
}

return target;
```

哇哦，历尽九九八十一难，我们终于求出了逆矩阵。

大家可以看到，数学库所做的就是将数学中的矩阵、向量以及它们之间的运算表示出来，步骤很繁琐，但是都不难。这些函数我们只要会用，知道它们所适用的场景就可以了。

## 回顾
本节主要实现了图形学涉及到数学中的向量和矩阵的基本运算，除此以外，我们还有一些3D 开发中经常用到的方法没有实现，比如顶点旋转、平移、缩放等变换矩阵。

但在这之前，我们要先学习为什么需要这些变换，具体需要哪些变换。
 
这些东西在下一节揭晓，下一节主要涉及到 WebGL  中的常见坐标系以及坐标系之间的变换，让我们拭目以待吧~



