# 使你的随机粒子动起来
在第 5 节，我们使用 js +  Canvas 一起制作了随机粒子特效，那么怎么才能使你的随机粒子动起来呢？本节就跟我一起来试一试吧 (๑´ㅂ`๑)

## `animate()` 函数
本节的代码是在第 5 节代码的基础上完成的，在第 5 节我们已经实现了随机粒子的效果，本节的目标是能够让粒子动起来。

其实，Canvas 制作动画是一个不断擦除再重绘的过程，跟最原始实现动画的方式类似。在纸片上画每一帧，然后以很快的速度翻动小本本，就会有动画的效果。

现在我们实现动画需要在很短的时间内不断的清除内容再重新绘制，新的图形和原先清除的图形之间有某种位置关系，速度足够快的话，我们就会看到动画的效果。

所以我们需要一个 `animate()` 函数，这个函数的作用是帮助我们形成动画，我们在这个函数中首先需要清除当前屏幕，这里的清除函数用到的是 `content.clearRect()` 方法。

我们先来看一下 canvas 的 `content.clearRect()` 方法：

`context.clearRect(x,y,width,height);`
- x：要清除的矩形左上角的 x 坐标
- y：要清除的矩形左上角的 y 坐标
- width：要清除的矩形的宽度，以像素计
- height：要清除的矩形的高度，以像素计

在刚刚的分析中可以得出，我们需要清除的区域是整个屏幕，所以 `content.clearRect()` 的参数就是 `content.clearRect(0, 0, WIDTH, HEIGHT);`，这里我们就用到了之前获取的屏幕宽度和高度的常量：`WIDTH` 和 `HEIGHT`。这样我们就将屏幕上的所有内容都清除了。

清除了屏幕内容之后我们就要重新绘制图形，重新绘制的图形是需要和原图形之间有一定的关系，我们先制作一个简单的效果 —— 粒子匀速上升。粒子匀速上升，也就是 y 坐标在不断地变化，既然是匀速的，那么也就是在相同的时间位移是相同的。

我们将粒子位移的变化函数 `move()` 写在 `Round_item` 的原型上。稍后我们再实现。

重新绘制完图形之后，我们就完成了清除屏幕内容再重新绘制新的图形的任务。那么还需要有一个步骤 —— “
不断”，要想实现动画的效果，就需要 “不断” 地进行清除再重绘，并且中间间隔的时间还不能过长。

这时你可能会想到使用 js 的 `setTimeout()` 方法，但是 `setTimeout` 和 `setInterval` 的问题是，它们都不精确。它们的内在运行机制决定了时间间隔参数实际上只是指定了把动画代码添加到浏览器 UI 线程队列中以等待执行的时间。如果队列前面已经加入了其他任务，那动画代码就要等前面的任务完成后再执行。

我们需要使用另外一个函数 —— `requestAnimationFrame()` 。

> `window.requestAnimationFrame()` 方法告诉浏览器，你希望执行动画，并请求浏览器调用指定的函数在下一次重绘之前更新动画。该方法使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。

`requestAnimationFrame()` 函数可以说是专门用来写动画的。那么 `requestAnimationFrame()` 有什么优点呢？

> 编写动画循环的关键是要知道延迟时间多长合适。一方面，循环间隔必须足够短，这样才能让不同的动画效果显得平滑流畅；另一方面，循环间隔还要足够长，这样才能确保浏览器有能力渲染产生的变化。
>
> 大多数电脑显示器的刷新频率是 60Hz，大概相当于每秒钟重绘 60 次。大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会有提升。因此，最平滑动画的最佳循环间隔是 1000ms/60，约等于 16.6ms。
>
> `requestAnimationFrame` 采用系统时间间隔，保持最佳绘制效率，不会因为间隔时间过短，造成过度绘制，增加开销；也不会因为间隔时间太长，使动画卡顿不流畅，让各种网页动画效果能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。

所以我们就使用 `requestAnimationFrame()` 函数递归的调用 `animate()` 函数来实现动画的效果。

```js
    function animate() {
        content.clearRect(0, 0, WIDTH, HEIGHT);

        for (var i in round) {
            round[i].move();
        }
        requestAnimationFrame(animate);
    }
```
## 创建 `move()` 函数
在上一节，我们说到了使用 `move()` 函数来改变 round 的 y 坐标。那么我们就来实现一下。

和第 5 节的 `draw()` 方法相同，我们也要将 `move()` 方法写在 `Round_item` 的原型上，这样我们创建的每一个 round 都具有了 `move()` 方法。

在 `move()` 方法中，我们只需要改变 round 的 y 坐标即可，并且设置边界条件，当 y 坐标的值小于 `-10`（也可以是其他负值），代表该 round 已经超出了屏幕，这个时候我们要将其移动到屏幕的最底端，这样才能保证我们创建的粒子数不变，一直是 `initRoundPopulation` 的值。

这样就是一个粒子在不断地上升，上升到了最顶端再移动到最底端的循环过程，看起来像是有源源不断的粒子，但其实总数是不变的。

在 y 坐标的变化之后，我们还需要使用新的 y 坐标再来重新绘制一下该 round。

经过上面的分析，`move()` 写起来是不是很简单呢？ 
```js
    Round_item.prototype.move = function () {
        this.y -= 0.15;
        if (this.y <= -10) {
            this.y = HEIGHT + 10;
        }
        this.draw();
    };
```

## 在 `init()` 中加入 `animate()`
我们想要实现动画的效果，还需要在 `init()` 中加入 `animate()` 函数。

最后，我们来看一下动画完整的实现代码吧:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        html, body {
            margin: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
            cursor: none;
            background: black;
        }
    </style>
</head>
<body>
<canvas id="canvas"></canvas>

<script>
    var ctx = document.getElementById('canvas'),
        content = ctx.getContext('2d'),
        round = [],
        WIDTH,
        HEIGHT,
        initRoundPopulation = 80;


    WIDTH = document.documentElement.clientWidth;
    HEIGHT = document.documentElement.clientHeight;

    ctx.width = WIDTH;
    ctx.height = HEIGHT;

    function Round_item(index, x, y) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.r = Math.random() * 2 + 1;
        var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
        this.color = "rgba(255,255,255," + alpha + ")";
    }

    Round_item.prototype.draw = function () {
        content.fillStyle = this.color;
        content.shadowBlur = this.r * 2;
        content.beginPath();
        content.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        content.closePath();
        content.fill();
    };

    function animate() {
        content.clearRect(0, 0, WIDTH, HEIGHT);

        for (var i in round) {
            round[i].move();
        }
        requestAnimationFrame(animate)
    }

    Round_item.prototype.move = function () {
        this.y -= 0.15;
        if (this.y <= -10) {
            this.y = HEIGHT + 10;
        }
        this.draw();
    };


    function init() {
        for (var i = 0; i < initRoundPopulation; i++) {
            round[i] = new Round_item(i, Math.random() * WIDTH, Math.random() * HEIGHT);
            round[i].draw();
        }
        animate();

    }

    init();
</script>
</body>
</html>
```

效果如下：

![最终效果](https://user-gold-cdn.xitu.io/2017/12/3/1601ce8973f24a8d?w=960&h=640&f=gif&s=77934)

参考文章：
- [深入理解定时器系列第二篇——被誉为神器的requestAnimationFrame](https://user-gold-cdn.xitu.io/2017/12/3/1601cd6b7a0d58b7)
