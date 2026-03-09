## SMIL动画简介
所谓SMIL动画指在 SVG 集成了 Synchronized Multimedia Integration Language (SMIL) 这种动画标准，该语言被 SVG 原生支持，主要是使用标签来描述动画。

SMIL 允许你：

1、变动一个元素的数字属性（x、y……）

2、改变元素的变形属性（translation或rotation）

3、改变元素的颜色属性

4、跟随路径运动

5、控制形状之间的变化

通过添加 SVG 动画元素，比如 animate 到 SVG 元素内部来实现动画，就能实现让元素动起来。下面来看几个实例来演示四种不同的动画方式。

### SMIL 动画使用方法

先定义一个SVG：

```
<svg width="500px" height="500px" viewBox="0 0 500 500">  
</svg>
```

然后在里面定义一个矩形，并且定义好填充颜色等属性：

```
<svg width="500px" height="500px" viewBox="0 0 500 500"> 
    <rect x="0" y="0" width="100" height="100" fill="#feac5e"> 
    </rect>
</svg>
```

如果要使这个矩形动起来，我们需要在矩形这个元素里使用 &lt;animate /&gt; 这个元素来使它动起来。

在 &lt;animate /&gt;，我们需要添加一些属性，首先使用 **attributeName** 来定义我们需要元素发生变化的属性，在这个实例中，我们需要它左右移动，即横坐标X，就可以把用 **attributeName** 设置为 **x**。这样就可以使元素在X轴上运动。

然后定义 **from** 的值和 **to** 的值，指定元素要运动的距离；使用 **dur** 来定义运动的时长；使用 **repeatCount** 去定义动画运行的次数，**repeatCount** 值为 **indefinite** 表示无限循环这个动画。

```
<svg width="500px" height="500px" viewBox="0 0 500 500"> 

    <rect x="0" y="0" width="100" height="100" fill="#feac5e"> 
        <animate attributeName="x" from="0" to="500" dur="2s" repeatCount="indefinite" /> 
    </rect> 

</svg>
```

一个简单SVG SMIL动画就完成了。

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676eed7f7648ede~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/zmrQKE)

当然，我们可以在改变它位置的时候，同时改变其它的属性。比如，我们多定义2个 &lt;animate /&gt; 来改变它的宽度和颜色：

```
<animate attributeName="x" from="0" to="500" dur="2s" repeatCount="indefinite" />
<animate attributeName="width" to="500" dur="2s" repeatCount="indefinite" />
<animate attributeName="fill" to="black" dur="2s" repeatCount="indefinite" />
```

效果如下图所示：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676eed7f7e06218~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/vVLwXv)

我们还可以使用 &lt;animateTransform /&gt; 来代替 &lt;animate /&，可以操作元素 **transform** 相关的属性，使用type来指定要操作 **transform** 的属性，还可以使用begin来指定动画从哪开始。比如，下面这个实例我们要使元素旋转起来，那我们就要把 **type** 的值指定为 **rotate**，**rotate** 属性的值包含三个坐标的值，分别为角度，横坐标的值即 x 和和纵坐标的值即 y。代码如下所示：

```
<svg width="500px" height="500px" viewBox="0 0 500 500">
    <rect x="250" y="250" width="50" height="50" fill="#4bc0c8">
        <animateTransform attributeName="transform" type="rotate" begin="0s" dur="10s" from="0 200 200" to="360 400 400" repeatCount="indefinite" />
    </rect>
</svg>
```
在上面的代码中我们可以看到 **from** 的值为 **0 200 200**，to的值为 **360 400 400**，即表示元素在横坐标和纵坐标分别为200的位置旋转360度到横坐标和纵坐标分别为400的位置。

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676eed7f94e8115~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/XxNejW)

通过上面一个简单的动画效果，我们对SMIL动画也有了一个初步的认识，下面再通过一个稍微复杂点效果，来进一步加深对 SMIL 动画的认识。

## SMIL 动画实战

接下来我们一起来使用 SMIL 来实现下面这个简单的加载动画效果：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676eed7f9267bdb~tplv-t2oaga2asx-image.image)

开始之前先来分析下这个动画效果的构成。

* 首先是旋转动画，这个可以用 transform 中的 rotate 属性来实现。
* 然后是这个圆圈边框的颜色变化，这个可以通过改变 stroke 的颜色的值来实现。
* 最后，是边框的长短变化，这个可以通过改变 stroke 的 stoke-dashoffset 来实现。

先来准备基本的 HTML 结构：

```
<svg width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
  <g>   
    <circle fill="none" stroke-width="6" stroke-linecap="round" stroke="#000" cx="33" cy="33" r="30" >    </circle>
   </g>
</svg>
```

从代码中可以看到，我们使用 g 标签把圆圈包裹起来，这样我们就可以嵌套动画来，先把 g 元素旋转起来，代码如下：

```
<svg width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
  <g>   
    <animateTransform attributeName="transform" type="rotate" values="0 33 33;270 33 33" begin="0s" dur="1.4s" fill="freeze" repeatCount="indefinite"/> 
    <circle fill="none" stroke-width="6" stroke-linecap="round" stroke="#000" cx="33" cy="33" r="30" >    </circle>
   </g>
</svg>

```

在上面的代码中有个新的参数 **values**，**values** 可以是一个值或多值。多值时候有动画效果。当 values 值设置并能识别时候，from, to 的值都会被忽略。

### values 属性

那 values 属性是干什么的呢？在实际开发动画的时候，不可能就是单纯的从 a 位置到 b 位置。有时候，需要去 c 位置过渡下。此时，实际上有3个动画关键点。而 from, to/by 只能驾驭两个，此时就是 values 大显身手的时候了，它可以设置多个值。

比如我们可以把文章最开始的动画修改一下：

```
<svg width="500px" height="500px" viewBox="0 0 500 500"> 

    <rect x="0" y="0" width="100" height="100" fill="#feac5e"> 
        <animate attributeName="x" values="160;40;160
" dur="2s" repeatCount="indefinite" /> 
    </rect> 
</svg>
```

在上面代码中，values 设置了3个值，这样当矩形运行到160的时候，会返回到40的位置，然后再运动到160的位置，这样就形成来一个来回运动的动画效果。

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676eed7f9327757~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/rqWGWB)

### 加载动画实现

具体到这个旋转动画中，我们使用 animateTransform 标签来实现旋转动画，values 的值为 values="0 33 33;270 33 33" 表示元素在横坐标和纵坐标分别为33的这个位置保持不动，从0到270这个角度不停的旋转，因为 **repeatCount** 的值为 **indefinite**。

OK，圆圈旋转动画完成后，接下来是边框颜色的变化，这个圆圈在旋转的过程中，有5中颜色的变化，这个时候 values 就派上用场了：

```
<svg width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
  <g>
    <animateTransform attributeName="transform" type="rotate" values="0 33 33;270 33 33" begin="0s" dur="1.4s" fill="freeze" repeatCount="indefinite"/>
    <circle fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30" stroke-dasharray="187" stroke-dashoffset="610">
      <animate attributeName="stroke" values="#4285F4;#DE3E35;#F7C223;#1B9A59;#4285F4" begin="0s" dur="5.6s" fill="freeze" repeatCount="indefinite"/>
    </circle>
   </g>
</svg>
```

颜色的变化我们使用 **attributeName** 的值指定为 **stroke**，然后使用 **values** 指定5个颜色的值，这样元素的 stroke 也就是边框的颜色会在这5中颜色来回不停的变化。

在上面的代码中，还设置了圆圈的 **stroke-dasharray** 和 **stroke-dashoffset** 两个属性的值，在后面的用来实现边框长短变化动画用的。

代码中的 **fill** 表示动画间隙的填充方式。支持参数有： **freeze** | **remove**。其中 remove 是默认值，表示动画结束直接回到开始的地方。freeze “冻结” 表示动画结束后像是被冻住了，元素保持了动画结束之后的状态。

接下来就是实现边框长短变化的动画，这里的值没有固定的，需要我们不停的调试，最后选择一个最舒服的值就可以了，完整代码如下：

```
<svg width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
  <g>
    <animateTransform attributeName="transform" type="rotate" values="0 33 33;270 33 33" begin="0s" dur="1.4s" fill="freeze" repeatCount="indefinite"/>
    <circle fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30" stroke-dasharray="187" stroke-dashoffset="610">
      <animate attributeName="stroke" values="#4285F4;#DE3E35;#F7C223;#1B9A59;#4285F4" begin="0s" dur="5.6s" fill="freeze" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="rotate" values="0 33 33;135 33 33;450 33 33" begin="0s" dur="1.4s" fill="freeze" repeatCount="indefinite"/>
      <animate attributeName="stroke-dashoffset" values="187;46.75;187" begin="0s" dur="1.4s" fill="freeze" repeatCount="indefinite"/>
    </circle>
   </g>
</svg>
```

一个使用 SMIL 的加载动画就完成了。

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676eed7f9267bdb~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/GYNMBG)

到这里，SVG 基础的动画实现方式就讲完了，那如果要制作更加强大的动画效果，要更加灵活的控制 SVG，就不得不借助于 JavaScript 了。

下一章节我们就开始来讲解使用 JavaScript 来高效的开发SVG动画。

关于 SMIL 详细的介绍可以去这个[文档](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_animation_with_SMIL)看看。

