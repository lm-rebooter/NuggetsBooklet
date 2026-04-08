## Anime.js
[A](https://github.com/juliangarnier/anime)[nime.js](https://github.com/juliangarnier/anime) 是一个强大的用来制作动画的 javascript 库，虽然功能没有 GASP（greensock）这种大型平台的功能丰富，但胜在它足够轻便，gzip 压缩完只有6kb 左右，麻雀虽小，却五脏俱全。
相比较其它动画平台，Anime.js 具有一下一些优点：
* 体积小，gzip 压缩完只有6kb 左右。
* 支持大部分的 CSS 属性动画。
* 功能强大，支持 SVG 常见的动效开发以及强大的时间轴功能。

其中有一个特别重要的特性是，它对 SVG 的支持非常友好，用它来开发 SVG 动画会变得非常高效。

这篇教程我们就先来学习下 Anime.js 的一些基础知识，以及如何使用它来编写动画效果。
首先在 [github](https://github.com/juliangarnier/anime) 下载好 Anime.js，然后在页面引入它。
下面，就来开始我们的 Anime.js 之旅。
## Anime.js 基础知识
为了行文方便，下面以 Anime 来指代 Anime.js。
Anime 提供的 API 非常的简单，用起来非常的方便。只需要声明一个 Anime 的对象，然后在对象传入你需要运动的对象和相关的属性就可以使元素动起来。

```
const animeObject = anime({
  /* 需要运动的相关属性 */
});
```
下面我们使用一个简单的实例来讲解下 Anime 的语法知识：
![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678c9ff177ecc76~tplv-t2oaga2asx-image.image)
先准备基本的 HTML 和 CSS：
HTML：
```
<div class="box"></div>
```
CSS：
```
.box {
  width:100px;
  height: 100px;
  margin-top: 100px;
  background-color: rgb(251, 21, 90);
}
```
然后是使用 Anime 来实现这个移动动画效果，代码非常简单：

```
anime({
  targets: '.box',
  translateX: 300,
  duration: 800,
  delay: 600,
  easing: 'easeInOutSine',
  loop: true
});
```
[代码演示地址](https://codepen.io/janily/pen/aPojEm)

简单的几行代码就可以实现这个元素移动的动画效果，下面我们就用上面的这个代码来学习下 Anime 的基本语法知识，在 Anime 的对象中，我们可以操作和定义元素动画相关的属性：

```
{
  /* 需要运动的元素，它可以是 div 或者是 CSS 类名 ID名 .box #box，也可以是SVG元素 */
  /* 操作指定元素的相关属性，比如宽、高、透明度、颜色，位置等属性 */
  /* 定义动画的时间，延迟时间以及运动曲线等 */
  /* 指定元素的动画是否循环播放或者自动播放等属性 */
}
```

具体到我们上面的这个实例：

```
anime({
  targets: '.box',
  translateX: 300,
  duration: 800,
  delay: 600,
  easing: 'easeInOutSine',
  loop: true
});
```

* targets：表示需要运动的元素，可以是 CSS 类和 ID 来指定。
* translateX：指定需要运动的属性，我们这里指定的是元素的 transform 这个位移属性，除此之外，我们还可以指定元素的其它 CSS 属性，比如宽和高等。
* 动画相关属性，比如动画的执行时间（duration）、延迟执行时间（delay）、动画的运动曲线（easing）和动画是否循环执行（loop）等。
* loop 默认值是 false，当为 true 的时候，表示动画不断的循环执行。

在上面代码中 target 我们使用 CSS 中的类选择器，除此之外，我们还可以使用下面这几种方法来选择元素：

* DOM 选择方法 document.querySelector('.box') 或者是 document.querySelectorAll('.box') 方法;
* js 数组的方法 ['box']；
* js 对象的方式 {elementNmae:'box'}

如果需要操作多个元素，还可以这样做：

```
var animeaBox = anime({
  targets: ['.box', '.circle'],
});
```

在上面代码中，第二个属性是 translateY，也就是要操作元素做出变化的属性，和 CSS 中操作元素的方法非常相似。作为一个经常和动画打交道的前端开发人员，对于使用 transform 属性来提高动画的性能想必是非常清楚的，同样在使用 animejs 来编写动画效果的时候，特别涉及操作元素位置的时候也建议使用 transform 等属性来操作来提高动画性能。

当然，对于任何属性的值，也可以使用特定的函数来随机分配它们的值，比如像下面这样的：

```
translateX: (elm, index, t) => index * 2
```

在多个元素运动的时候就特别管用。

```
easing: 'easeInOutSine'
```
easing，它是用来定义动画运行速度曲线的，与 CSS3 中的动画曲线一样。

我们可以使用下面的方法来查看 Anime 中有哪些运动曲线：

```
console.log(anime.easings);
```
## 运动多个元素
我们来实现下面这个多个元素的移动动画效果：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678c9ff6c89c875~tplv-t2oaga2asx-image.image)

先来看下代码：

```
anime({
  targets: '.box',
  translateX: (elm, index, t) => index * 150,
  duration: 1200,
  delay: (elm, index, t) => index * 20,
  easing: 'easeInOutSine',
  loop: true,
  direction: 'alternate',
});
```

代码是非常的简单明了，对代码做个简单的说明：

* 我们需要运动的元素全部是类名为 box 的元素。
* 使用了 transform 中的 translateX 属性来移动元素。
* 其中 translateX 的值使用一个方法来计算，每个元素的值都依赖它们的索引值。
* 上面的代码中还用到来 direction 这个属性，它的值又 **normal** 和 **reverse**，当值为 reverse 的时候，表示动画回来回的执行，就像我们上面的这个效果一样，direction 的值为 **reverse**。所以元素在移动到目标位置的时候，会往回运动到元素的初始位置，如此不断的反复。

除了多个元素的控制，也可以同时针对一个元素的某一个属性，来进行多个值的控制，比如上面动画中我们可以不停的改变元素的背景颜色：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678c9ff39b2601e~tplv-t2oaga2asx-image.image)


代码也非常的简单：

```
anime({
  targets: '.box',
  translateX: (elm, index, t) => index * 150,
  backgroundColor: [
    {value: '#000'}, // Or #FFFFFF
    {value: 'rgb(255, 0, 0)'},
    {value: 'hsl(100, 60%, 60%)'}
  ],
  duration: 1200,
  delay: (elm, index, t) => index * 20,
  easing: 'easeInOutSine',
  loop: true,
  direction: 'alternate',
});
```

在上面的代码中，我们通过 **backgroundColor** 这个属性来改变元素的背景颜色，不同的是这里我们通过一个数组赋予它一组颜色的值，Anime 会自动的在这几个值中来回的填充元素的背景颜色。

[代码演示地址](https://codepen.io/janily/pen/JwPaaa)
## 动画控制
Anime 还提供来注入 **play、pause** 和 **restart** 方法来控制动画的执行、暂停和重新开始运行动画。也可以使用 **seek** 方法来执行跳帧动画。

下面仍然通过上面的动画效果来实际体验下动画的控制。

我们先改造下代码：

```
var movingBox = anime({
  targets: '.box',
  translateX: (elm, index, t) => index * 150,
  backgroundColor: [
    {value: '#000'}, // Or #FFFFFF
    {value: 'rgb(255, 0, 0)'},
    {value: 'hsl(100, 60%, 60%)'}
  ],
  duration: 1200,
  delay: (elm, index, t) => index * 20,
  easing: 'easeInOutSine',
  loop: true,
  direction: 'alternate',
});

var pauseBtn = document.getElementById("pause");
var playBtn = document.getElementById("play");
var restartBtn = document.getElementById("restart");

pauseBtn.addEventListener('click', function(e) {
  e.preventDefault();
  movingBox.pause();
});

playBtn.addEventListener('click', function(e) {
  e.preventDefault();
  movingBox.play();
});

restartBtn.addEventListener('click', function(e) {
  e.preventDefault();
  movingBox.restart();
});
```

在上面代码中我们定义来3个按钮，分别表示动画的播放、暂停和重新开始，给3个按钮绑定 Anime 提供的 **pause、play** 和 **restart** 方法来控制动画，如下图所示：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678c9ffa4ed9419~tplv-t2oaga2asx-image.image)

通过这几个方法，我们可以轻松的对动画的播放、暂停等进行控制。

[代码演示地址](https://codepen.io/janily/pen/pqzxod)

这里有点需要注意的是：为了在页面加载完的时候，不运行动画，需要设置 autoplay 的值为 false。
## 时间轴
如果大家有接触过 GreenSock 这个动画库的话，相信你对它提供的时间轴的功能一定印象深刻。Anime 虽然很轻量，但它也提供来时间轴的功能。

时间轴是用来控制动画执行的先后顺序的。一般我们做动画的时候，默认情况下，动画是同时执行的。如果要按顺序执行，则要设置动画延时来达到目的。

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678c9ff6c89c875~tplv-t2oaga2asx-image.image)

比如我们上面实现的这个动画，如果，我们把它们运动的值设置为一样，那它们会同时执行动画效果，如下图所示：

![图片](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678c9ff65c69014~tplv-t2oaga2asx-image.image)

那如果我们想要这3个元素按顺序来执行动画，该怎么办呢？这个时候就可以借助 Anime 强大的时间轴功能来实现这个按顺序执行的动画效果。

在 Anime 中，定义一个时间轴也非常简单：

```
var basicTimeline = anime.timeline();
```
一行代码足矣。

下面使用上面定义的这个时间轴来实现按顺序执行的动画效果。

```
var basicTimeline = anime.timeline({
  duration: 1200,
  easing: 'easeOutExpo',
  loop: true
});

basicTimeline
  .add({
    targets: '.box1',
    translateX: 750,
  })
  .add({
    targets: '.box2',
    translateX: 550,
  })
  .add({
    targets: '.box3',
    translateX: 350,
  });
```

在上面的代码中，我们首先使用 Anime 提供的 **anime.timeline** 方法定义了一个 **basicTimeline** 的时间轴，然后在时间轴定义了整个动画的一些公共属性，比如动画的执行时间，动画是否循环执行等。

然后在时间轴使用 **.add** 的方式来添加动画效果，这样定义的动画它会按顺序来执行，第一个动画执行完，接着执行第二个动画效果，而不是同时执行。如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/8/1678caab47203271~tplv-t2oaga2asx-image.image)

[代码演示地址](https://codepen.io/janily/pen/roBqmQ)

Anime 的基本知识就介绍到这里，更多它的使用方法，可以去[官方文档](http://animejs.com/documentation/)详细查看。从下一节开始，我们来学习使用 Anime 来高效的开发 SVG 动画。