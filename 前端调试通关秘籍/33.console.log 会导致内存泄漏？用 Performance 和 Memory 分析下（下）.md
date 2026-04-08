上节通过 Performance 和 Memory 工具证明了打开 devtools 的时候 console.log 会有内存泄漏。

有 console.log 的时候，内存是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8675af65e0394403ad46dd3fedb42e3c~tplv-k3u1fbpfcp-watermark.image?)

去掉之后是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a884087e19804e5a9533f2ef47c8501f~tplv-k3u1fbpfcp-watermark.image?)

我们得出结论，console.log 会导致内存泄漏。

这点没错。

但很多同学会有疑问，是不是因为打开 devtools 才有内存泄漏，不打开就不会呢？

不打开 devtools 怎么确定内存泄漏问题呢？

看下内存大小就知道了。

通过 performance.memory.totalJSHeapSize 是可以拿到堆内存大小的。

我们通过分析 console.log 的代码执行后的堆内存大小变化就行。

也就是这样：

```html
<!DOCTYPE html>
<html lang="en">
<body>
    <button id="btn">点我</button>
    <div id="box"></div>  
    <script>
        const btn = document.getElementById('btn');
        const box = document.getElementById('box');

        btn.addEventListener('click', function() {
            const MB = 1024 * 1024;
            log();

            function log() {
                const memory = performance.memory.totalJSHeapSize;
                const usagedMemory = Math.floor(memory / MB);
                box.insertAdjacentHTML('beforeend', `<span>${usagedMemory} </span>`);

                const obj = {usagedMemory, str: 'g'.repeat(50 * MB)};
                console.log(obj); 

                setTimeout(() => log(), 50);
            }
        });
    </script>
</body>
</html>
```

按钮点击的时候，拿到当前堆内存的大小。然后打印一个大字符串和堆内存大小。

因为我们看不到控制台，所以也会加到 dom 中来显示。

通过定时器不断的执行这样的操作。

我们先打开 devtools 测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4bf7f9187004061a47b4391c1415597~tplv-k3u1fbpfcp-watermark.image?)

可以看到每次打印后内存都在增长，并且在内存达到 4G 的时候就崩溃了。

说明 console.log 确实存在内存泄漏。

那我们再关掉 devtools 测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/264efe34ca984abda4ad654081a70e5c~tplv-k3u1fbpfcp-watermark.image?)

内存一直稳定不变，说明函数执行完之后，作用域销毁，打印的对象就被销毁了，没有内存泄漏。

我们过程中打开 devtools 测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26dcb75a85d54c218628acc20d52325f~tplv-k3u1fbpfcp-watermark.image?)

可以看到一打开 devtools，再次执行 console.log 的时候，内存就增长了，说明这时候内存泄漏了。

那如果我先打开 devtools，然后再关掉呢？

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5324973da8c4ce38e877cdeac7cf887~tplv-k3u1fbpfcp-watermark.image?)

可以看到，只要关闭了 devtools，内存就稳定了。但之前打印的对象依然被引用着，那部分内存不会被释放。

这样，我们就可以得出结论：**不打开 devtools 的时候，console.log 不会内存泄漏。**

还有同学问，那如果直接打印字符串呢？

我们直接打印字符串试一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad3b477d2df747f699eca9da161a56d4~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6417ec409a6344a8a68c5e5aeabf6cf8~tplv-k3u1fbpfcp-watermark.image?)

可以看到，内存也是平稳的。

为什么呢？字符串不也是对象、可以看到详情的吗？

这是因为字符串比较特殊，有个叫做常量池的东西。

录制一下内存快照：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a921bcba93c74ad6943a04fc71c391db~tplv-k3u1fbpfcp-watermark.image?)

看一下字符串占用的内存：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20d027ee350b420e8e1eb97806beba55~tplv-k3u1fbpfcp-watermark.image?)

是 @91 的地址。

我过了一段时间再录制了一次快照，依然只有一个字符串，地址是 @91。

这就是字符串常量池的作用，同样的字符串只会创建一次，减少了相同字符串的内存占用。

但 string 还有另一种创建方式：new String

这种方式就不一样了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d030f75174aa42b79a24ea2eb4fcaa65~tplv-k3u1fbpfcp-watermark.image?)

这时候创建的是一个堆中的对象，然后引用了常量池中的 string。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdf00dda30e64e72903022491be41058~tplv-k3u1fbpfcp-watermark.image?)

这也是为啥字符串字面量是 string，而 new String 是 object：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc373996c17f48dfb68e5c4cfe7c466f~tplv-k3u1fbpfcp-watermark.image?)

因为会不断在堆中创建对象，所以这时候 console.log 的内存泄漏依然会使堆内存上升：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fe7838f922b4188bfbb3d210bc2692c~tplv-k3u1fbpfcp-watermark.image?)

那 node.js 的 console.log 有没有内存泄漏呢？

我们也用同样的方式测试下就好了，只是这时候拿到内存数据是用 progress.memoryUsage() 的 api：

```javascript
const MB = 1024 * 1024;

log();

function log() {
    const memory = process.memoryUsage().heapUsed
    const usagedMemory = Math.floor(memory / MB);

    const obj = { usagedMemory, obj: 'g'.repeat(50 * MB) };
    console.log(obj); 

    setTimeout(() => log(), 50);
}
```

执行一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f19f72ef028542b5a0794d611bbb2bd2~tplv-k3u1fbpfcp-watermark.image?)

可以看到内存是稳定的，并不会内存泄漏。

这是因为 node 打印的是序列化以后的对象，并不是对象引用。

## 总结

console.log 在 devtools 打开的时候是有内存泄漏的，因为控制台打印的是对象引用。但是不打开 devtools 是不会有内存泄漏的。

我们通过打印内存占用大小的方式来证明了这一点。

string 因为常量池的存在，同样的字符串只会创建一次。new String 的话才会在堆中创建一个对象，然后指向常量池中的字符串字面量。

此外，nodejs 打印的是序列化以后的对象，所以是没有内存泄漏的。

当你一打开 devtools 网页就崩了，不打开没事，这时候一般就是因为 console.log 导致的内存泄漏了。


