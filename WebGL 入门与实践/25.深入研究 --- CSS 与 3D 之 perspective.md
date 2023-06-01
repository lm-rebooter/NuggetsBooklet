

上节我们讲述了 CSS 中的变换方式以及对它们原理的深入理解。本节我们介绍一下 3D 变换的投影方式`perspective`相关属性，并通过`照片墙`和`图片盒`的实现学习它们的深入使用方法。

本节要介绍的主要属性有如下几个：

* transform-style：子元素变换的表现形式。
* perspective：视距。
* perspective-origin： 视点位置。
* backface-visibility：背面是否可见。

本节教大家掌握这几个属性，之后用 CSS 就能够很轻松地做出有创意的 3D 效果了。

## transform-style

该属性是用来设置子元素变换的展示形式，默认是 2D 平面展示，当我们需要让子元素的渲染有 3D 效果时，那么我们要将当前元素的 transform-style 属性设置为 preserve-3d。

我们用一张图片做示例：

```html
<div class="image-wrapper">
    <img src="xxx" />
</div>
```

```css
.image-wrapper{
    text-align: center;
    font-size: 0;
    margin-top: 200px;
}

.image-wrapper img{
    width: 150px;
    height: 110px;
}
```

我们不对图片施加变换，图片是正常状态：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/167884e85db72163~tplv-t2oaga2asx-image.image)

记住图片默认时的样子。

此时，我们对图片施加变换，让图片绕 X 轴旋转 60 度。

```css
.image-wrapper img{
    transform: rotateX(60deg);
}
```


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/7/167885037d697934~tplv-t2oaga2asx-image.image)

可以看出，图片因为旋转，展示到屏幕上已经变形了，正常情况下，绕 X 轴旋转，图片的上半部分应该转到屏幕内侧，下半部分转到屏幕外侧。

我们看一下，是不是这样子的。

我们让图片的父容器也绕 X 轴旋转，这样就能看出图片到底是不是真的有了 3D 效果。

```css
.img-wrapper{
    transform: rotateX(0deg);
    animation: rotate 3s linear;
}
@keyframes rotate{
    0%{
        rotateX(0deg);
    }
    50%{
        transform: rotateX(120deg);
    }
    100%{
        transform: rotateX(0deg);
    }
}
```


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678d28a3c32c952~tplv-t2oaga2asx-image.image)

可以看到，图片并没有呈现出立体效果。

那如何让图片呈现立体效果呢？

transform-style 要闪亮登场了。



我们将 transform-style 设置为 preserve-3d 即可。

另一个问题是，为哪个元素设置 transform-style 属性呢？

### 舞台

WebGL 中有舞台和场景的概念， CSS 中也有类似概念。

我们需要一个舞台，然后为舞台设置展示方式。

上面的示例，大家觉得哪个元素是舞台呢？

很简单，图片的祖先容器都可以当做图片的舞台，我们将一个祖先容器设定为舞台，祖先容器的子元素就是舞台上的元素。

因此，既然我们想让元素呈现立体效果，我们就要在元素所在的舞台上设置 transform-style 属性，对于图片来说，图片的任何一个祖先元素都可以作为舞台，我们将图片的父容器作为舞台，为它设置舞台元素的呈现效果。

```css
.img-wrapper{
    transform-style: preserve-3d;
}
```


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678d2b82976fbad~tplv-t2oaga2asx-image.image)

很明显，图片呈现出了 3D效果。

通过这两幅动图，我相信大家已经明白 transform-style 的作用了。

我们总结一下：

transform-style用来设置容器中子元素的呈现方式
。
* 当设置为 preserve-3d 时，子元素进行 3D 变换会呈现出 3D 立体效果。
* 当不设置或者设置为 `flat` 时，子元素不管采用 2D 变换还是 3D 变换，总是呈现出平面效果。


## 观察点位置

如何改变观察点位置呢？

这就涉及到两个新属性 `perspective`和`perspective-origin`，这两个属性用来设置观察点的坐标，并让投影产生透视效果，透视效果最明显的现象就是近大远小。


perspective 用来设置观察点在 Z 轴方向的位置，默认时观察点在元素中心，即 z = 0 位置，我们可以调整它到元素中心的距离。

设置这个属性会产生两个效果：

* 改变了观察点距离元素的 Z 轴距离.
* 使得子元素的 3D 变换产生透视效果。

### 舞台

我们想换个角度看图片，那观察点需要设置在哪个元素上呢？

perspective 这个属性也是在舞台上设置的。

我们为舞台设置 perspective属性。


> 请注意，perspective 默认值是 0，此时不产生透视效果。只有不为 0 时才会形成透视效果。


那么，观察点距离元素中心的远近对视觉呈现有什么影响呢？

千言万语抵不过一幅图。

我们通过一张动图感受一下，在这个动画里，我将观察点的 Z 轴坐标从 1 像素匀速改变到 100 像素，再从 100 像素移近到 1 像素，另外为了区别舞台和舞台元素在 Z 轴上的不同，我将舞台的背景颜色改为透明度为 70% 的红色。

```css
.img-wrapper{
    perspective: 300px;
    animation: camera 3s linear;
    background-color: rgba(255, 0, 0, .7);
}
@keyframes camera {
    0% {
        perspective: 1px;
    }
    50% {
        perspective: 100px;
    }
    100% {
        perspective: 1px;
    }
}
```


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678970a14c4eb7f~tplv-t2oaga2asx-image.image)


因为图片大小是 150 ，高度是 110px，当绕 X 轴旋转 60 度后，图片底边在 Z 轴的坐标为：

$
z = 110 \div 2 * \frac{\sqrt{3}}{2} \approx 49
$


所以，我们的观察点的 Z 轴坐标至少要大于这个值，才能看到图片的全貌。

距离越近，就越看不到图片在观察点后面的部分。

我们将 perspective （观察点的 Z 轴坐标）移动到 100px 处。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678cc5fc18c3c15~tplv-t2oaga2asx-image.image)

此时，图片有了近大远小的透视效果，这就是 perspective 的作用。

从感官上我们是能感受到它好像有了 3D 的感觉，但是还是看不出它在 Z 轴上的状态。

改变 perspective 只是改变了在 Z 轴的位置，也就是拉远或者拉近镜头，但是并没有将镜头移到图片上方去观察。


### 观察点在 X、Y 轴的位置

让观察点沿着左、右、上、下方向进行移动的话，该如何做呢？

这就是 perspective-origin 所扮演的重要角色。

它负责设置观察点在 X、Y 轴的偏移，即屏幕的左右、上下方向。

我们看下他的用法：

perspective-origin，接收两个参数，一个代表 X 轴偏移，一个代表 Y 轴偏移。

请谨记：该属性的默认值是 （50%，50%），在舞台 DOM 的中心位置。

回到上面的话题，移动镜头到图片上方，也就是设置观察点在舞台上的 Y 轴坐标，我们将镜头往上移动一定高度，从舞台上方观察图片。

还是用动图来演示这个过程。

```css
.img-wrapper{
    perspective: 200px;
    animation: camera 3s linear infinite;
}
@keyframes{
    0%{
        perspective-origin: 50% 50%;
    }
    50%{
        perspective-origin: 50% -200%;
    }
    100%{
        perspective-origin: 50% 50%;
    }
}
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678d97bfccd73ed~tplv-t2oaga2asx-image.image)

上面就是我们将镜头慢慢移动到上方时，对舞台元素的观察过程。

注意，图片本身并没有动，我们移动的只是镜头，虽然你会有一种镜头没动，图片在动的感觉。

通过这几幅动图，我相信大家对这几个属性有了更深刻的认识，接下来，我们介绍如何利用这几个属性实现照片墙和图片盒。

## 照片墙

在上一节，我介绍了照片墙的原理，简单来说，就是图片先旋转一定度数，之后沿着 Z 轴方向移动一定距离。

在动手写代码之前，我们要想清楚两个问题：

* 每张图片绕 Y 轴旋转的角度。
* 沿 Z 轴方向至少移动多少像素。

我想，只要你想清楚了这四个问题，代码就信手拈来了。

### 每张图片绕 Y 轴旋转的角度。
我们准备 12 张图片，并将每张图片设置成宽 150px，高 110px 。

```
img{
    width: 150px;
    height: 110px;
}
```

那么，每张图片旋转的角度是 360 / 12 = 30度。

### 沿 Z 轴方向最少移动距离

为了让图片能够不交叉，我们需要沿图片 Z 轴平移一定距离，那么，这个距离是多少呢？

当然我们可以一点点地区尝试，但是我想我还是教给大家一个严谨的思路比较好。

大家看下图：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678e79b9936cde6~tplv-t2oaga2asx-image.image)

根据下图，我们能够知道，图片在 Z 轴平移的最小距离是 $\vec{OB}$，那么如何求得 $\vec{OB}$ 的长度呢？

由最简单的三角公式可以得出：

$
OB =  BC \times \sqrt3 = （BD + DC）\times \sqrt3
$


仍然根据三角公式可以知道：

$
BD = AD \div 2 = 150 \div 2 = 75
$

$
DC = DE \div \frac{\sqrt3}{ 2} = 75 \times 2 \div \sqrt3 \approx 89
$

所以：

$
OB = (BD + DC) \times \sqrt3 \approx 280
$

也就是说，我们至少要让图片沿着 Z 轴移动 280 像素，才能让各个图片正好衔接。

口说无凭，看看效果吧。

```javascript
Array.prototype.forEach.call(?('img'), (item, i) => {
    item.style.transform = 'rotateY(' + i * 30 + 'deg) translateZ(280px)';
});
```

仍然用一幅动图来演示，我们将观察点移动到舞台上方：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/9/1678e93e5f22b564~tplv-t2oaga2asx-image.image)

可以看到，当我们让图片沿Z 轴移动 282 像素之后，各个图片的边缘正好能够对齐，和我们推导的结果一致。

将舞台绕 X 轴旋转 90 度，以自下而上的角度观察照片墙是如何从默认位置沿着 Z 轴移动到指定位置：

```css
.img-wrapper{
    transform: rotateX(90deg);
}
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/9/1678e9a7e142deb5~tplv-t2oaga2asx-image.image)

从不同角度观看我们的舞台，展现效果也会不同。

### 背面是否可见

照片墙这个效果，大家应该能看到处于背面的元素还是能够可见的，这与实际有所差异，如果大家不想背面元素可见，我们可以设置 backface-visibility 属性来实现：

```css
backface-visibility: hidden;
```


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/9/1679202ab61c6b7d~tplv-t2oaga2asx-image.image)

大家可以看到，设置完背面不可见属性之后，位于后面的图片此时已经看不到了。



以上就是图片墙的主要原理，可见，了解一些图形学知识对于我们做 3D 动效有莫大的帮助。

接下来，我们看一下另一个效果`图片盒子`的分析实现过程。

## 图片盒

图片盒是一个包含 6 个面的立方体，每个面其实就是一个 DOM 元素。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/9/16791e7ad7c1ff01~tplv-t2oaga2asx-image.image)

上图就是一个图片盒子的例子，我们接下来的目标就是利用 CSS 的 3D 属性实现这样一个效果。

写代码之前还是先思考一下，不考虑动效，我们如何实现这样一个立方体。

其实很简单，主要思考清楚六个面的状态就可以了。

* 首先我们需要六个 DOM 元素，此时六个元素在同一位置。
* 处理前后两个平面在 Z 轴方向的差别。
* 对上下两个平面施加绕 X 轴旋转90度的效果，然后处理 Y 轴方向的差别。
* 对左右两个平面施加绕 Y 轴旋转90度的效果，然后处理 X 轴方向的差别。

想清楚这几个步骤，代码就很简单了。

为了让图片展示 3D 效果，我们需要为图片父容器设置 transform-style 属性：


```css
.img-wrapper{
    transform-style: preserve-3d;
    position: relative;
}
```

接下来，我们为图片元素设置宽高，并对六张图片采用绝对定位，使他们重合。

```css
img{
    width: 150px;
    height: 110px;
    position: absolute;
}
```

然后，开始处理各个面的状态，对于图片盒子的前后两个面，我们只需要改变它们的 Z 轴坐标就可以了，那么 Z 轴坐标设置多少呢？

聪明的同学已经想到了， Z 轴坐标是图片高度的一半。

```css
.front{
    transform: translateZ(55px);
}
.back{
    transform: translateZ(-55px);
}
```

前后平面处理完了，接下来处理上下两个面，上下两个面要绕 X 轴翻转 90 度，然后沿着 Y 轴分别向上下两个方向移动图片高度的一半距离。

```css
    .top{
        transform: translateY(-55px) rotateX(90deg);
    }
    .back{
        transform: translateZ(-55px) rotateX(180deg) ;
    }
```

最后，处理左右两个平面，左右两个平面需要绕 Y 轴旋转 90 度，然后沿着 X 轴进行平移，分别向左、向右平移图片宽度的一半。

```css
.left{
    transform: translateX(-75px) rotateY(90deg);
}
.right {
    transform: translateX(75px) rotateY(-90deg);
}
```

这样，就完成了一个图片盒子，很简单吧？



## 回顾

本节主要讲述了如何设置观察点在三维层面的坐标，并结合上节的变换属性实现照片墙和图片盒子的特效，主要目的不是教会大家做这些效果，而是教大家思考 3D 特效的分析过程。通过这两个例子，我想大家认识到了 css 的强大。即使不使用 WebGL ，我们依然可以用 DOM 元素结合 CSS 实现 3D 效果。

下一节，我们详细阐述一下数学库在 CSS 3D 属性中的高级应用。
