# 使你的 Canvas 更加优雅
本节作为本小册的最后一节，将带大家一起对你的 Canvas 进行优化，使你的 Canvas 更加优雅。我们来看一下都有哪些方法可以优化我们的 Canvas。

## 常见的 Canvas 优化方法

### 避免浮点数的坐标点
绘制图形时，长度与坐标应选取整数而不是浮点数，原因在于 Canvas 支持半个像素绘制。

会根据小数位实现插值算法实现绘制图像的反锯齿效果，如果没有必要请不要选择浮点数值。

### 使用多层画布去画一个复杂的场景
一般在游戏中这个优化方式会经常使用，但是在我们的背景特效中不经常使用，这个优化方式是将经常移动的元素和不经常移动的元素分层，避免不必要的重绘。

比如在游戏中，背景不经常变换和人物这些经常变换的元素分成不同的层，这样需要重绘的资源就会少很多。

### 用 CSS `transform` 特性缩放画布
如果你使用 `left`、`top` 这些 CSS 属性来写动画的话，那么会触发整个像素渲染流程 —— `paint`、`layout` 和 `composition`。

但是使用 `transform` 中的 `translateX/Y` 来切换动画，你将会发现，这并不会触发 `paint` 和 `layout`，仅仅会触发 `composition` 的阶段。

这是因为 `transform` 调用的是 GPU 而不是 CPU。

### 离屏渲染
名字听起来很复杂，什么离屏渲染，其实就是设置缓存，绘制图像的时候在屏幕之外的地方绘制好，然后再直接拿过来用，这不就是缓存的概念吗?!︿(￣︶￣)︿.

建立两个 Canvas 标签，大小一致，一个正常显示，一个隐藏（缓存用的，不插入 DOM 中）。先将结果 draw 到缓存用的 canvas 上下文中，因为游离 Canvas 不会造成 UI 的渲染，所以它不会展现出来；再把缓存的内容整个裁剪再 draw 到正常显示用的 Canvas 上，这样能优化不少。

## 离屏渲染
我们主要来介绍一下 Canvas 的离屏渲染优化，就拿第 5 节和第 6 节的那个示例来继续。

忘记的童鞋再去重温下第 5 节和第 6 节的内容。

离屏渲染的主要过程就是将一个一个的粒子先在屏幕之外创建出来，然后再使用 `drawImage()` 方法将其“放入”到我们的主屏幕中。

在了解了思想之后，我们就来实现一下吧！ｂ（￣▽￣）ｄ

我们首先要在全局设置一个变量 `useCache` 来存放我们是否使用离屏渲染这种优化方式。

```js
var useCache = true;
```

### `Round_item` 方法
然后我们在 `Round_item` 原型的 `draw()` 方法中创建每一个离屏的小的 `canvas`。

```js
    function Round_item(index, x, y) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.useCache = useChache;
        
        this.cacheCanvas = document.createElement("canvas");
        this.cacheCtx = this.cacheCanvas.getContext("2d");

        this.r = Math.random() * 2 + 1;
        
        this.cacheCtx.width = 6 * this.r;
        this.cacheCtx.height = 6 * this.r;
        
        var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
        this.color = "rgba(255,255,255," + alpha + ")";

        if(useChache){
            this.cache();
        }
    }
```

有人会产生疑问，为什么这里的 `cacheCanvas` 画布的宽度要设置为 6 倍的半径？那是因为，我们创建的 `cacheCanvas` 不仅仅是有圆，还包括圆的阴影，所以我们要将 `cacheCanvas` 的面积设置得稍微大一些，这样才能将圆带阴影一起剪切到我们的主 Canvas 中。

在 `draw()` 方法中，我们新创建了 `cacheCanvas`，并获取到了 `cacheCanvas` 的上下文环境，然后设置其宽高。

然后我们判断了 `useChache` 变量的值，也就是说，如果我们将 `useChache` 设置为 `true`，也就是使用缓存，我们就调用 `this.cache()` 方法。接下来，我们来看一下 `this.cache()` 方法。

### `this.cache()` 方法 
同样的，我们也是在 `Round_item` 的原型中设置 `this.cache()` 方法。

在 `this.cache()` 方法中，我们的主要任务是在每一个 `cacheCanvas` 中都绘制一个圆。

```js
    Round_item.prototype.cache = function () {
        this.cacheCtx.save();
        this.cacheCtx.fillStyle = this.color;
        this.cacheCtx.shadowColor = "white";
        this.cacheCtx.shadowBlur = this.r * 2;
        this.cacheCtx.beginPath();
        this.cacheCtx.arc(this.r * 3, this.r * 3, this.r, 0, 2 * Math.PI);
        this.cacheCtx.closePath();
        this.cacheCtx.fill();
        this.cacheCtx.restore();
    };
```

这里需要注意的是，和在 `draw()` 方法中画的圆不同之处是，要注意这里设置的圆心坐标，是 `this.r * 3`，因为我们创建的 `cacheCanvas` 的宽度和高度都是 `6 * this.r`，我们的圆是要显示在 `cacheCanvas` 的正中心，所以设置圆心的坐标应该是 `this.r * 3,this.r * 3`。

### `draw()` 方法
既然设置了 `cacheCanvas`，那么我们在 `draw()` 中，就需要使用 Canvas 的 `drawImage` 方法将 `cacheCanvas` 中的内容显示在屏幕上。

```js
    Round_item.prototype.draw = function () {

        if( !useChache){
            content.fillStyle = this.color;
            content.shadowBlur = this.r * 2;
            content.beginPath();
            content.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            content.closePath();
            content.fill();
        }else{
            content.drawImage(this.cacheCanvas, this.x - this.r, this.y - this.r);
        }

    };
```

这里也是要判断下，如果没有使用缓存的话，还是使用最原始的创建圆的方式。

这样，我们就完成了离屏渲染的优化，我们来一起看一下完整的代码：
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
        initRoundPopulation = 80,
        useChache = true;



    WIDTH = document.documentElement.clientWidth;
    HEIGHT = document.documentElement.clientHeight;

    ctx.width = WIDTH;
    ctx.height = HEIGHT;

    function Round_item(index, x, y) {
        this.index = index;
        this.x = x;
        this.y = y;
        this.useCache = useChache;
        this.cacheCanvas = document.createElement("canvas");
        this.cacheCtx = this.cacheCanvas.getContext("2d");

        this.cacheCtx.width = 6 * this.r;
        this.cacheCtx.height = 6 * this.r;
        this.r = Math.random() * 2 + 1;
        var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
        this.color = "rgba(255,255,255," + alpha + ")";

        if(useChache){
            this.cache();
        }
    }

    Round_item.prototype.draw = function () {

        if( !useChache){
            content.fillStyle = this.color;
            content.shadowBlur = this.r * 2;
            content.beginPath();
            content.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            content.closePath();
            content.fill();
        }else{
            content.drawImage(this.cacheCanvas, this.x - this.r, this.y - this.r);
        }

    };

    Round_item.prototype.cache = function () {
        this.cacheCtx.save();
        this.cacheCtx.fillStyle = this.color;
        this.cacheCtx.shadowColor = "white";
        this.cacheCtx.shadowBlur = this.r * 2;
        this.cacheCtx.beginPath();
        this.cacheCtx.arc(this.r * 3, this.r * 3, this.r, 0, 2 * Math.PI);
        this.cacheCtx.closePath();
        this.cacheCtx.fill();
        this.cacheCtx.restore();
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