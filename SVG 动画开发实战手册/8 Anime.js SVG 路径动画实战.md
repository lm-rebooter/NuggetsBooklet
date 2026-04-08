## Anime SVG 路径跟随动画

这章节我们来学习下 Anime 中如何来实现一个路径跟随动画的。所谓路径动画，其实就是指定义好的运动对象沿着特定的路径在运动的动画效果，比如下面这样的效果：


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/9/16792deb76878f41~tplv-t2oaga2asx-image.image)

实际在开发动效时，路径动画也应用的非常多。虽然，CSS 的最新标准已经有提案支持路径运动，但目前来看，正式实施估计还要等很久的，而 Anime 提供的解决方案无疑是非常高效的一种实现路径动画的解决方案。

下面我们就通过一个简单的实例来了解下，使用 Anime 如何来实现这样一个路径跟随动画，要实现的效果如下所示：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/9/16792de1dce04c0c~tplv-t2oaga2asx-image.image)

### 准备工作

要实现这样一个效果，我们首先要准备图中所示的这样一个曲线路径，这个简单，我们只需要在 AI 中用钢笔工具勾一条就可以了：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/9/16792de1d85b8c7f~tplv-t2oaga2asx-image.image)

设计好路径后，我们把文件导出为 SVG 格式的图片，就可以得到这条路径的数据：

```
<path  class="st0" d="M11.6,246.9c0,0,143.1-274.1,267.8-137.9s124.7,136.2,124.7,136.2L11.6,246.9z"/>
```
得到路径数据后接下来的事情就好办了。

### 编码实现

先准备基本的 HTML 结构：

```
<div id="motionPath">
  <div class="motion-path">
    <div class="square">
    </div> <svg width="600" height="400" viewBox="0 0 600 400">
        <path id="curpath" fill="none" stroke="currentColor" stroke-width="1" d="M11.6,246.9c0,0,143.1-274.1,267.8-137.9s124.7,136.2,124.7,136.2L11.6,246.9z"/>
      </svg> 
  </div>
</div>

```
然后是样式：

```
.motion-path {
  width: 600px;
  height: 400px;
  position: relative;
}
.square {
  width:30px;
  height: 30px;
  background-color: #000;
}
```
在 Anime 中，要实现一个路径跟随动画，需要用到：

```
anime.path(pathEl)
```

这个方法是专门用来实现路径跟随动画的，它接受 CSS 选择器或者是 DOM 元素，而且它会返回路径上每个点在 X 轴和 Y 轴上的坐标：

```
var path = anime.path('path');
 // 或者
 
var path = anime.path('.path');
```
 
使用了这个方法后，路径元素上每个点在 X 轴和 Y 轴上的坐标都会存储在定义好的 path 这个变量中，那我们要使元素沿着这条曲线运动，就很简单了，只需要不停的使用 transform 中的 translate 来改变元素的 X 轴和 Y 轴的坐标就可以了。

结合我们前面学到的 Anime 的知识，代码如下：

```
var path = anime.path('path');

anime({
  targets: '.square',
  translateX: path('x'),
  translateY: path('y'),
  rotate: path('angle'),
  duration: 3000,
  loop: true,
  easing: 'linear'
});
```

从上面的代码中我们可以看到这3行代码：

```
  translateX: path('x'),
  translateY: path('y'),
  rotate: path('angle'),
```

可以发现，通过得到路径元素每个点的坐标，然后通过 translateX 和 translateY 来改变元素的坐标值，从而使元素沿着路径的轨迹移动，实现路径跟随动画效果。

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/9/16792de1dce04c0c~tplv-t2oaga2asx-image.image)

我们还可以看到在代码中有一个rotate的属性，它是用来实时返回当前在 SVG 中 path 元素的一个角度，这样当元素实时移动的时候有一个角度的倾斜，动画才更加的自然。

我们来看看，如果没有这个 rotate 的属性会怎么样？

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/6/16951bcd49d31c2b~tplv-t2oaga2asx-image.image)

可以看到没有设置 rotate 属性的时候，元素运动起来非常的不自然生硬。

[代码演示地址](https://codepen.io/janily/pen/roNebb)

这章节简介绍了使用 Anime 来实现路径跟随动画效果，下一章节来学习下使用 Anime 在蒙版动画中的运用。

