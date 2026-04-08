产品性能越来越重要
=========

在"后"互联网时代，用户对产品的期望变的越来越高，他们不仅要求产品功能完善，还希望能够以更快、更流畅的方式与产品进行交互。 说到这里想到当年用迅雷看电影的情形，当时在线看电影经常卡顿，但是也没有太多选择，而且自己根本也没看过几部电影 ，只要有的看一点都不挑，而且由于在线观看太卡顿有时只能选择花费几个小时下载下来，然后再用播放器进行观看，但这这丝毫不影响当年成为迅雷的忠实用户，这在2024年的今天是不可想象的。

互联网产品的蓝海时代已经结束，产品的同质化越来越严重，你很难发现一个很好用的功能是只在某一个产品中才有的，大家都在借鉴产品功能，在产品功能都一样的情况下，性能成为了产品脱颖而出的关键因素。用户更倾向于选择那些能够提供更快速、更流畅体验的产品。无论是网页加载速度、移动应用的响应速度，还是交互的流畅性，都直接影响着用户的满意度和留存率。

而且对于某些产品来说，性能甚至是一项必备的功能。比如，对于在线游戏来说，低延迟和高帧率是保证游戏体验的关键要素；对于电商平台来说，快速的加载速度和流畅的购物流程能够提升用户的购买意愿；对于社交媒体应用来说，快速的内容加载和平滑的滚动体验能够吸引用户的持续关注。

因此，前端性能优化不仅仅是为了提升用户体验，更是为了在激烈的市场竞争中脱颖而出，本小节我们探讨下前端性能优化中的关键技术和策略，开始关注你的产品性能吧！

前端性能优化概述
========

前端性能优化的内容非常多，如果没有一个合理的分类和归纳是很难记住全部内容的，特别是在面试的时候，大脑一紧张全都忘记了，或者只能说出几个非常简单的优化方式，降低了面试官对自己的认可，其实归根结底，我认为性能优化就两大块内容：能优化的和不能优化的。

能优化的一般再分为两部分：

*   降低时间消耗：让页面更加快速地展示在用户面前（如1秒内），或者尽快响应用户的操作（如50毫秒内）
*   减少资源占用：减少前端对本地缓存、网络带宽、CPU及内存的占用

如果前端实在不能优化，那么也可以采用两种方式处理：

*   转移复杂度：可以通过产品设计规避一些高性能损耗的事情或者将复杂度转移到后端，如前端将一个特别大的资源导出为一个PDF文件导致页面卡死，但是文件有时候确实非常大，前端导出必然会大量占用内存和CPU，这种情况是不是可以考虑改为后端导出前端下载的方式实现。
*   友好的提示：实在耗时特别长，也没有办法优化，那是不是可以给出优化的提示，如loading、进度条等

整理的前端性能优化思维导图如下：

![性能优化概览-括号图.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eec1e834dcdf40f0a808bcc0955877da~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1898&h=2034&s=352132&e=png&b=fffcfc)

降低时间损耗
------

在实际业务开发过程中，时间消耗较大的一般都在这三方面：网络请求、页面渲染和长任务。

### 网络请求优化

网络请求优化可以考虑从这5个方面进行：减少网络请求数量、减少网络请求大小、加快网络速度、并行加载、预加载。

*   **减少网络请求数量**
    
    *   **合并文件**：通过打包技术，将多个页面的js、css、组件等资源打包到一起，减少最终文件数量，比如原来项目中组件、js和样式文件加起来可能有上百个，最终打包出去的可能也就10个左右，大大减少了网络请求数量。
        
    *   **雪碧图**：特别适合将多个小图片合并成一张大图。即使再小的一张图片，在请求时也要建立一次网络链接，走一遍请求过程，请求1张10B大小的图片和请求一张1KB大小的图片时间差别并不大，如果把100张10B的图片合成为1张1KB的图片，那么整体加载速度可能提升了100倍，使用雪碧图的关键是如何自动化合成图片并生成样式。
        
    *   **字体图标**：使用字体图标代替传统的图片图标，字体图标可以通过CSS直接渲染，无需额外的网络请求。
        
    *   **懒加载**：针对图片等资源使用懒加载技术，只在出现在视窗区域中时才加载资源。
        
    *   **浏览器缓存**：通过缓存技术，特别是强制缓存，减少请求资源数量，js、css、图片等资源尽量使用强制缓存。
        
*   **减少网络请求大小**
    
    *   **打包压缩**：对生产环境的代码进行压缩，如使用UglifyJS、Terser、Webpack插件（TerserWebpackPlugin、MiniCssExtractPlugin）等
        
    *   **代码拆分**：如果把所有的文件打包成一个文件，那么必然导致这个文件过大，影响首次加载的速度，可以按照使用频次进行拆包，只把经常使用的包打到公共包中，如使用webpack的splitChunks功能来完成该功能。
        
    *   **按需引入**：一些第三方库或者组件库都支持按需引入，减少无用的代码
        
    *   **异步路由**：通过异步路由，将页面的代码从打包文件中分离出来，减少主文件的大小
        
    *   **gzip压缩**：通过nginx等服务将返回的数据进行gzip压缩，gzip可以有效提升网络传输速度，但是要注意平衡压缩质量，压缩的太狠，虽然传输时间减少，但是服务器压缩时间就会加长，可通过测试找出最合理的配置
        
    *   **图片压缩**：不要直接使用UI设计师提供的图片，记得先压缩一下，如[TinyPNG](https://tinify.cn/ "https://tinify.cn/")
        
    *   **更换图片格式**：不知道你注意到没有，不同格式的图片大小是不一样的，JPEG的通常要比PNG的小，而WebP的图片压缩体积大约只有JPEG的2/3。
        
*   **加快网络速度**：
    
    *   **http2代替http**：HTTP/1.1中，一个连接在同一时间只能处理一个请求，而HTTP/2通过多路复用技术解决了这个问题，允许单个TCP连接上并发多个请求，而且HTTP/2使用HPACK算法对头部信息进行压缩，大大减少了传输的数据量。
        
    *   **提升服务器带宽**：没啥说的，如果经费充足，提高服务器带宽能同时为更多用户提供良好的传输速度。
        
    *   **使用CDN**：服务器带宽一般有限，那么可以将静态资源放到CDN服务上，由专业的供应商提供更好的网络传输速度。
        
*   **并行加载**：
    
    *   **不同资源采用不同域名**：不知道你发现没有，浏览器请求资源时，同一个域名下最多只能同时发起6-8个请求，即使你一下子发出几十个文件请求，浏览器也只会按照最大并发6-8个来顺序执行，那如果我们给不同的资源分配不同的域名呢，是不是就可以同时请求更多的资源以加快整体完成速度了。
        
    *   **并发请求**：业务开发中，对于多个没有先后顺序的请求，可以通过Promise.all并行发起请求，而不必await上一个完成再发送下一个。
        
            //bad，两个请求没有先后顺序，但是却按照串行发起请求
            async function getData(){
                let userInfo = await getUserInfo();
                let productInfo = await getProductInfo();
            }
            
        
            //good
            async function getData(){
                let [userInfo, productInfo] = await Promise.all([
                    getUserInfo(),
                    getProductInfo()
                ])
            }
            
        
*   **预加载**：
    
    *   **DNS预解析**：如果打开淘宝网站，就能在head中发现如下的代码，通过浏览器闲时DNS预解析，可以加快后续资源加载速度
    
        <link rel="dns-prefetch" href="//g.alicdn.com">
        <link rel="dns-prefetch" href="//o.alicdn.com">
        <link rel="dns-prefetch" href="//img.alicdn.com">
        <link rel="dns-prefetch" href="//tce.alicdn.com">
        <link rel="dns-prefetch" href="//gm.mmstat.com">
        
    
    *   **资源预加载**：可以在页面或者某个功能呈现之前提前加载其所需的资源，比如在浏览器闲时加载后续可能用到的资源，或者为了后续效果更流畅先把所有资源加载完成，就像之前很流行的H5动画，上来会有个加载进度的动画，在这期间就是在预加载后续所用到的图片或音频资源，如果不这么做，动画中用到某个图片时临时加载很可能会有个短暂的白屏加载过程，这样动画效果就给人感觉很不流畅。
        
            let resources = [
               '1.png',
               '2.png',
               'n.png'
            ]
            
            let totalCount = resources.length;
            let loadedCount = 0;
            
            resources.forEach(url =>{
               const img = new Image();
               img.onload = () =>{
                   loadedCount++;
               }
               img.onerror = () =>{
                   loadedCount++;
               }
            })
            
        

### 页面渲染优化

网络请求获取完资源后，必然要把画面渲染出来，这个过程中可能会产生一些耗时严重的问题，页面渲染的优化可以考虑从这几个方面进行：首屏优化、减少不必要的渲染次数、GPU加速和Canvas渲染优化等。

**1\. 首屏优化**

首屏优化是指在网页加载过程中，通过一系列技术手段，尽快展示给用户可见的内容，以提高用户体验和页面加载速度。

加快首屏渲染速度有很多方法，包括不限于：

*   通过服务端渲染技术（SSR）加快首屏的渲染速度

首次进入单页面类应用中，要想渲染出页面内容，必须经过以下步骤：加载页面对应的html文件、html文件发起对js、css等资源的请求、js加载完成并执行后发起API接口的调用以获取首页所需的数据、前端框架根据数据渲染出对应DOM，整个过程比较长，特别是其中还有资源的加载和接口的请求，这都必然要消耗一定的时间。

而服务端渲染时，会在服务端就拿到页面所需的数据，然后直接生成带有页面DOM的html文件，这样就会在html加载完成后第一时间进行渲染，速度上肯定相对较快一些。

*   内容懒加载

其实不光图片需要懒加载，页面内容组件也可以采用懒加载技术延迟渲染，尽量不加载用户看不到的内容，加快首屏渲染速度。

*   异步加载js

当浏览器遇到

    <!--淘宝页面中的异步加载js-->
    <script async src="https://g.alicdn.com/tbhome/??taobao-2021/0.0.53/lib/monitor-min.js"></script>
    <script async src="//g.alicdn.com/??secdev/entry/index.js,alilog/oneplus/entry.js"></script>
    <script async src="https://g.alicdn.com/mm/tb-page-peel/0.0.5/index-min.js"></script>
    

**2\. 减少渲染次数**

我们应该尽量避免一些无意义的页面渲染，包括不限于：

*   批量操作DOM：如果你需要对多个DOM元素进行修改，尽量将这些修改合并成一次操作。例如，使用DocumentFragment或innerHTML可以一次性添加或修改多个元素，而不是逐个修改。
    
*   避免使用innerHTML进行大量更新：虽然innerHTML可以一次性更新多个元素，但如果内容较大或更新频繁，可能会导致性能问题。在这种情况下，使用DOM API（如createElement、appendChild等）进行更精细的控制可能更有效。
    
*   优化数据绑定：如果你使用的是现代前端框架（如React、Vue或Angular），确保你正确使用了数据绑定和组件更新机制。这些框架通常提供了优化数据绑定和减少不必要渲染的方法，如React的shouldComponentUpdate或Vue的computed属性。
    
*   使用虚拟列表技术：用户看不到的内容是不必渲染的，这和懒加载类似，对于一些长列表，可以通过虚拟列表技术，减少不必要的DOM渲染
    
*   避免频繁的样式更改：频繁的样式更改可能导致浏览器的重排（reflow）和重绘（repaint），这是非常耗时的操作。尽量将样式更改合并到一起，或者使用CSS类名来切换样式，而不是直接操作样式属性。
    
*   使用虚拟DOM：虚拟DOM技术可以模拟真实的DOM结构，并在数据变化时计算出最小的DOM操作集，从而避免不必要的重复渲染。React等现代前端框架就使用了这种技术。
    
*   防抖或节流：使用防抖或节流来减少一些短时间内频繁用户操作带来的多次渲染问题。
    
*   减少重排：一些CSS设置不当会导致页面重排，导致不必要的大面积重新渲染；也可以利用GPU加速提升一些动画的渲染流畅度
    

**3\. Canvas优化**

canvas渲染可能一般业务中接触不到，仅在一些图形化项目中遇到，因此我们仅简单介绍下：

*   控制Canvas尺寸：避免使用过大的Canvas，因为大尺寸会增加渲染的计算量和时间。同时，对于性能不佳的设备，可以手动设置像素比率（pixelRatio）为1，以减少渲染负担，特别注意手机上Canvas尺寸过大会直接白屏，并不会报任何错误，如果你遇到这种异常，可以试试减小尺寸。
    
*   图层管理与分层渲染：将复杂的场景分解为多个图层，每个图层只负责绘制一部分内容。这样可以减少每帧的渲染负担，提高性能。对于经常变动的元素，可以将其放在单独的图层上，以便在需要时只重绘该图层，而不是整个画布。
    
*   使用离屏Canvas：离屏Canvas是在内存中创建的画布，可以在上面进行绘制操作而不影响屏幕上的显示。完成绘制后，可以一次性将内容绘制到屏幕上的Canvas中，从而减少渲染时间。
    
*   减少上下文切换：Canvas绘制API都是在上下文（context）上进行调用，频繁对Canvas上下文属性修改赋值有一定的性能开销。因此，应尽量减少上下文切换，例如可以将相同样式的绘制内容收集起来，切换上下文后批量绘制。
    
*   动静分离：根据变更频率来拆分Canvas内容，将静态和动态内容分离到不同的Canvas上。这样可以避免不必要的渲染，并减少频繁变更的渲染范围，这个和图层管理与分层渲染思想是一致的。
    

### 长任务

长任务指的是浏览器执行耗时超过50毫秒的操作，这类任务可能会阻塞主线程，导致用户界面响应变慢或卡顿，这是因为JS是单线程的，一旦出现一个非常耗时的任务占据线程，其他任务就无法被及时响应了。

解决长任务方法很多，比如：

*   将耗时较长的同步任务拆成多个异步任务：根据浏览器事件循环机制可以知道，长的同步任务会阻塞页面渲染，而拆成小任务并通过异步（如setTimeout）将任务依次执行，则不会阻塞页面渲染
    
*   使用Worker执行长任务：Web Workers允许你在浏览器的后台线程中运行JavaScript，这样就不会阻塞主线程
    
*   更合理的数据结构：有时长任务可能是因为数据结构不合理导致查询、变更耗时较长，可以考虑修改数据结构减低时间复杂度
    

减少资源占用
------

相比之下，我们平时更注重时间损耗方面的性能优化，一般很少注意资源的占用情况，除非发生了内存溢出之类的严重情况才考虑对资源占用进行优化，这里也建议大家关注下资源占用情况。

1.  空间占用：

前端缓存会占据一定的用户计算机空间，比如我们经常看到某某APP占据了好多个G的手机空间，所以还是尽量减少缓存占用，及时清理缓存。比如能用sessionStorage的地方就不要用localStorage，因为sessionStorage会在页面关闭后自动清除缓存，而localStorage则需要代码执行清理逻辑。

2.  内存占用：

对于大部分web应用来说，用户一般用完就走，所以内存占用情况并不突出，而如果是那种长时间放置的监控画面，如果内存处理不好，则很容易随着时间的增长而导致内存溢出，建议平时也养成良好的编码习惯，比如组件销毁时记得清除组件中使用的对象（eCharts等实例）、及时清理定时器、清空闭包中使用的变量等。

3.  网络占用：

有些场景下需要循环进行网络请求，比如需要每隔一段时间刷新页面中某个数据的状态，很多同学会不假思索地使用setInterval进行轮询。

    setInterval(getData, 5000); //每隔5秒请求一次资源
    

服务正常情况下，这样没问题，每隔5秒有一个网络请求更新数据，但是如果网络不好时，每次getData获取数据可能就超过了5秒，那么打开控制台你就会发现网络请求越积越多，最终可能会同时存在几百个请求，很容易造成问题，也造成不必要的网络占用。

更好的做法是通过setTimeout，在每次请求成功后再间隔5秒发起请求，确保每次网络请求的间隔为5秒，就算请求时间很长也没有影响。

    getData().then(res=>{
        setTimeout(getData, 5000);
    })
    

如果对实时性要求较高，还可以更换为Web Socket或SSE，减少不必要的轮询请求，只在有数据时，服务器主动推送给客户端。

转移复杂度
-----

前面提到了很多前端性能优化的方法，但是难免会有一些确实不好优化的功能，那么这时也可以换个角度考虑，能不能把这些不好处理的性能卡点转移到别的地方，比如修改产品设计或者交由后端处理，这样前端就不存在性能瓶颈了，注意，这不是推脱责任，我们的目标是最终得到性能较好的产品，而不是一定要前端进行优化。

比如我们要开发一套基于canvas渲染的低代码大屏编辑器，可以把元素拖拽到画布上，并绑定一些实时数据，如果一个页面非常复杂，那么这个canvas的渲染就会非常耗时，那是不是可以考虑将产品设计进行一些调整，比如像PhotoShop那样增加图层的概念，在不同的图层上拖拽不同的元素，用户在绘制大屏时可以规划出背景层、静态图像层、动态数据层等不同的层次，在运行时只需要对绑定数据的动态数据层进行实时重绘，而没有绑定数据的其他层则不需要重绘，是不是也可以在一定程度上提高了产品性能。

再比如需要将一些数据导出为PDF格式，如果数据量特别巨大，前端进行导出时无疑为非常耗时且占用大量内存，此时是不是也可以改成交由后端服务进行生成，前端只在生成结束后提供下载入口，对用户来说，前端导出还是后端导出其实是无感知的。

所以当遇到实在解决不了的优化问题，不妨尝试换个思路，转移复杂度。

友好提示
----

如果实在遇到有性能问题暂时解决不掉的情况，别忘记添加一个友好的提示，例如一个有趣的loading或者进度条，能有效缓解用户的焦虑，至少能让用户知道，他的操作得到了你的响应，而不是被忽视了。

关于loading有个要注意的地方，就是页面加载过程的loading到底应该放哪里？很多同学都把页面加载loading放到了App组件中（页面的入口组件），这是有问题的，因为App组件的渲染是比较滞后的，从用户请求的首个html渲染到App组件的渲染之间会有个时间窗口，这期间很可能是白屏的，我们应该尽量减少这个白屏时间，所以应该在入口html中也增加一个loading，样式可以和App中的loading保持一致。

    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>**平台</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <style>
            #loading{
                width: 100vw;
                height: 100vh;
            }
            /*设置loading样式*/
        </style>
    </head>
    
    <body>
        <div id="app">
            <!-- 添加loading，html加载成功很快就会出现loading -->
            <!-- 当组件开始渲染后，此处loading会被App中的loading取代 -->
            <div id="loading">
                <div class="el-loading-mask" style="background-color: rgba(255, 255, 255, 0.6);">
                    <div class="el-loading-spinner">
                        <i class="el-icon-loading"></i>
                        <p class="el-loading-text">拼命加载中</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    
    

性能优化的思路
=======

搞懂流程，找到关键路径
-----------

搞懂运行流程对我们优化非常重要，比如非常经典的一个问题，"一个网页从用户输入地址到完全展示，经历了怎样的流程"，以及时间循环机制等，搞懂这些流程就知道一条链路上有哪些关键路径，找到了关键路径就能找出性能差的原因，然后针对性的进行优化。

比如看到下面这个输入url后的加载过程，你就自然而然可以想到在缓存、DNS解析、数据返回等关键路径上进行优化。

![url-load-path.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0baabb66da7b4ba5a0f0aa4c61e5ff27~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1616&h=2536&s=237465&e=png&b=fdfdfd)

了解流程可以让我们快速定位到出问题的节点，就像之前在客户现场遇到的一个接口访问缓慢问题，虽然接口访问缓慢绝大部分都是后端问题，但是当你在客户现场时，如果能帮忙定位到出问题的具体服务，肯定能更快解决客户问题，这时候如果对整个接口请求的流程不熟悉，肯定是做不到的。

![api-path.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e8bc10b77e74791ab1315ca2c1b1690~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1065&h=151&s=34201&e=png&b=ffffff)

当时我们的接口访问流程大概如上图所示，Nginx将域名访问反向代理到网关，经过网关鉴权后转发到微服务，现在通过域名访问接口很慢，我们首先可以绕过Nginx，直接访问网关地址10.110.10.1:8080，看看是不是域名解析相关的问题，如果还是缓慢，再直接调用微服务10.110.10.1:9090，看看是不是网关的问题，如果发现接口不慢了，那么问题很可能出现在网关鉴权这一步，只需要找负责网关的同学帮检查下问题即可，熟悉流程可以帮助我们快速定位到性能卡点。

善用工具，快速定位问题
-----------

在解决性能问题时，不能凭空猜测一点一点去试，要善用工具帮助我们快速定位到问题。

比如我们觉得打包后的bundle文件太大了，想减少bundle体积，那你最好先找一个工具能让你看到bundle中有哪些文件，到底是哪个文件导致的bundle过大，然后再针对性的解决，比如在webpack中就有一款名为webpack-bundle-analyzer的插件，可以将 bundle 内容展示为一个便捷的、交互式、可缩放的树状图形式，很容易找到问题所在。

![webpack-bundle-analyzer.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3004b17deaa04770b0f409d55c7765ea~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1280&h=639&s=721750&e=png&b=dcd0b0)

再比如我们发现页面卡顿，不要犹豫，赶紧打开浏览器的性能分析，它能帮我们定位到到底是哪个js函数运行耗时过长，从而让页面变得卡顿，然后按照固定的套路去解决长任务就行了，下面我们会专门讲一下如何优化长任务。

如下图，在chrome的性能分析中，我们很容易看到耗时较长的是名为longTask和childTask的函数，我们只需要找到对应的代码，然后进行优化即可。

![chrome-long-task.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d95894927a4a42eab5a5efa5aa801f27~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1431&h=535&s=215328&e=png&b=2b2b2b)

重视监测，主动发现问题
-----------

在健壮性小节当中，我们就提到过这个观点，我们不应该被动地等着用户给我们提出问题，而是通过检测，更加全面地了解当前系统的运行状态，及时发现问题、解决问题。

![monitor.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e5285bdbfca4cb4a3ff5907c5be7c6f~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1384&h=519&s=171031&e=png&b=ffffff)

而且有了数据作为支撑，我们也好评估每次上线的优化功能是否真的起到了作用，用数据说话才有说服力。

性能优化的核心技术
=========

懒加载
---

懒加载是非常有用的一种性能优化方式，不仅可以减少网络请求数据，还能减少不必要的渲染，懒加载技术不仅可以应用到图片、音视频的加载上，还能用到组件的渲染上，当组件没有出现在视窗中时就不进行渲染，这对一些长页面的渲染来说是非常重要的优化手段。

### 懒加载使用形式

图片的懒加载：

    <img class="lazy" data-src="img.png" src="default.png"/>
    

组件形式的图片懒加载：

    <lazy-image src="img.png" />
    

Vue指令形式的懒加载

    <img v-lazy="img.src" >
    
    <div v-lazy-container="{ selector: 'img' }">
      <img data-src="//domain.com/img1.jpg">
      <img data-src="//domain.com/img2.jpg">
      <img data-src="//domain.com/img3.jpg">
    </div>
    

组件的懒加载：

    <lazy-component @show="handler">
      <CustomerComponent />
    </lazy-component>
    

可以看到，懒加载应用形式和场景多种多样，目前前端开发主要以组件开发为主，所以推荐组件或者指令形式使用懒加载，接下来我们了解下懒加载的实现原理。

### 懒加载原理

懒加载实现的核心是如何判断一个Dom元素是否出现在了视窗中，这里主要有两种实现方式。

1.  滚动监听 + 位置判断

由于没有一个方法可以监听到所有的滚动事件，所以需要找到懒加载元素的overflow样式为auto或scroll的父元素，在滚动的父元素上添加滚动监听。

可通过遍历元素的所有父节点，通过父节点的计算样式，判断父元素是否设置了滚动，如果所有父元素都没有设置滚动，则返回window对象。

    function findScrollParent(el) {
      if (!el && !el.parentNode) {
        return window;
      }
      
      let parent = el.parentNode;
      while (parent) {
        if (!parent || parent === document.documentElement || parent === document.body) {
          return window;
        }
        const computedStyle = getComputedStyle(parent);
        if (['auto', 'scroll'].includes(computedStyle.getPropertyValue('overflow'))
                || ['auto', 'scroll'].includes(computedStyle.getPropertyValue('overflow-x'))
                || ['auto', 'scroll'].includes(computedStyle.getPropertyValue('overflow-y'))) {
          return parent;
        }
    
        parent = parent.parentNode;
      }
    }
    
    let parent = findScrollParent(document.getElementById('lazy-img'));
    
    parent.addEventListener('scroll', function() {
      //这里判断元素是否出现在视窗中，并让元素开始加载
    });  
    

在找到父元素并成功设置监听后，接下来就是在scroll事件回调中判断元素是否出现在了视窗区域。可通过el.getBoundingClientRect()获取el元素相对视窗的位置，包括left、right、top、bottom位置信息和width、height大小信息，然后跟浏览器窗口大小相比，即可判断出元素是否在窗口内。

    function isInView(el){
        let rect = el.getBoundingClientRect();
        let notInView = rect.top > window.innerHeight || rect.bottom < 0;
        return !notInView;
    }
    

当元素出现在可视区域后，就可以让元素进行加载了，比如将img的data-src的地址赋值给src属性，让img开始加载图片。

    parent.addEventListener('scroll', function() {
      //这里判断元素是否出现在视窗中，并让元素开始加载
      if(isInView(imgDom)){
        let src = imgDom.dataset.src;
        imgDom.setAttribute('src', src);
      }
    }); 
    

2.  InterSectionObserver

交叉观察器 API（Intersection Observer API）提供了一种异步检测目标元素与祖先元素或顶级文档的视口相交情况变化的方法。

过去实施相交检测时，需要调用事件处理程序和循环方法，如 Element.getBoundingClientRect() 来为每个受影响的元素建立所需的信息。由于所有这些代码都在主线程上运行，因此即使是其中的一行代码也会导致性能问题。当网站加载这些测试时，情况会变得非常糟糕。

交叉观察器 API 可令代码注册一个回调函数，当特定元素进入或退出与另一元素（或视口）的交集时，或者当两个元素之间的交集发生指定变化时，该函数就会被执行。这样，网站就不再需要在主线程上做任何事情来监视这种元素交集，浏览器也可以根据自己的需要优化交集管理。

所以利用交叉观察器API判断元素是否可见的性能要更高一些，下面看看如何检测元素可见性。

    //获取要观测的懒加载img Dom对象数组
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
    
    //创建交叉观测器，第一个参数为回调函数，第二个为options
    let lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            //entry.isIntersecting 为true，则元素可见
            if (entry.isIntersecting) {
                // 当图片进入视窗时
                const lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src; // 将真实图片地址赋给src属性
                lazyImage.classList.remove('lazy'); // 移除lazy类，防止重复观察
                lazyImageObserver.unobserve(lazyImage); // 停止观察该图片
            }
        });
    }, {
        rootMargin: '200px' //距离窗口还有200px时就认为可见了，提前加载
    });
    
    // 开始观察所有图片
    lazyImages.forEach(lazyImage => {
        //把要观测的元素添加进去
        lazyImageObserver.observe(lazyImage);
    });
    

可以看到，通过 new IntersectionObserver(callback\[, options\]) 可以创建一个交叉观察器，然后通过 IntersectionObserver.observe(targetElement)方法把要观测的Dom添加进去，而在懒加载成功之后，通过IntersectionObserver.unobserve(target)将观测的Dom移除，这样可以减少不必要观测对象，提高性能。

### 封装一个懒加载组件

好了，在了解了懒加载的原理之后，我们试着封装一个懒加载组件 LazyComponent，用来控制业务组件的懒加载，使用形式如下：

    <lazy-component>
      <CustomerComponent />
    </lazy-component>
    

只有当组件CustomerComponent的位置处在可视区内时，才开始加载，在没加载之前，需要告诉懒加载组件应该占据多大的位置，否则懒加载组件高度撑不起来，计算的位置就不准确；其次还应该支持设置在距离可视区域多远时开始加载，这样当用户看到时，大概了已经加载完成了，让用户无感知。据此，应该对外抛出3个属性 width、height和rootMargin。

实现原理也非常简单，在懒加载组件mounted时，观察组件el的可见情况，如果可见则允许插槽内的子组件渲染。

    <template>
        <div :style="style" ref="wrapper">
            <slot v-if="show"></slot>
        </div>
    </template>
    
    <script>
    export default {
        name: "LazyComponent",
        props: {
            width: {
                type: Number
            },
            height: {
                type: Number
            },
            rootMargin: {
                type: Number
            }
        },
        data() {
            return {
                show: false
            };
        },
        computed: {
            style() {
                if(this.show){
                    return ''; //如果展示了子元素，则去除样式，避免影响子元素样式
                }
                let style = {};
                if (this.width) {
                    style.width = this.width + 'px';
                }
                if (this.height) {
                    style.height = this.height + 'px';
                }
                return style;
            }
        },
        mounted() {
            //低版本浏览器降级处理
            if(!window.hasOwnProperty('IntersectionObserver')){
                this.show = true;
            }
            
            this.intersectionObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.show = true;
                        this.intersectionObserver.disconnect(); //销毁观察器
                    }
                });
            }, {
                rootMargin: this.rootMargin ? this.rootMargin + 'px' : '0px'
            });
            this.intersectionObserver.observe(this.$refs.wrapper);
        },
        beforeDestroy() {
            this.intersectionObserver && this.intersectionObserver.disconnect(); //销毁观察器
        }
    };
    </script>
    

可以看到，使用 new IntersectionObserver 实现懒加载非常的简单，需要思考的一个可能的性能问题是，当该组件被大量使用时，会创建多个IntersectionObserver实例，如果要优化也可以通过单例模式，只创建一个IntersectionObserver实例，进行多个元素的监听，不过这样做就没法对每个组件设置rootMargin了，需要进行平衡。

长任务优化
-----

长任务是指浏览器执行耗时操作超过50ms的宏任务，根据事件循环机制我们知道，浏览器会在宏任务执行之后将控制权交给UI线程进行页面渲染，而如果一个宏任务执行时间过长，则会导致UI长时间得不到渲染，给用户造成卡顿的感觉。

就像下面这块代码，id为"box"的元素设置了移动动画，在没有执行长任务时，动画一直流畅进行。

    <style>
        @keyframes moveAndRotate {
            from { left: 0; }
            to{ left: 800px;}
        }
        #box{
           width: 60px;
            height: 60px;
            background: blue;
            animation: moveAndRotate 6s infinite linear;
            position: relative;
        }
    </style>
    <div id="box"></div>
    <button onclick="longTask()">执行长任务</button>
    <script>
      function childTask(){
        let startTime = Date.now();
        while (Date.now() - startTime < 30){}
      }
    
      function longTask(){
        console.log('开始执行长任务')
        for(let i = 0; i < 100; i++){
          childTask();
        }
        console.log('长任务执行完成')
      }
    </script>
    

在点击执行长任务后，执行函数longTask，longTask中循环100次调用childTask，每个childTask预计耗时30ms左右，可以看到，在执行longTask后动画被阻塞住，直到任务执行完成。

![long-task-1.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e21930373f34347a006058b610dda6a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=747&h=336&s=52190&e=gif&f=18&b=fdfdfd)

为了解决这个问题我们有几种办法，第一种就是将一个长任务改成多个小任务，并通过异步方式（setTimeout、requestIdleCallback）依次调用这些小任务，这样每个小任务执行后重新将控制权交给UI渲染线程，就不会造成页面卡顿；另一种是通过Web Worker在后台运行js代码，不阻塞UI渲染。

### 通过setTimeout拆分longTask

每次执行一个小任务，然后通过setTimeout调度下一个小任务，直到所有子任务执行完成即可。

    <script>
        function childTask(){
            let startTime = Date.now();
            while (Date.now() - startTime < 30){}
        }
    
        function longTask(){
            console.log('开始执行长任务')
            function execChildTask(maxIndex, currentIndex){
                if(currentIndex > maxIndex){
                    console.log('长任务执行完成')
                    return
                }
                childTask();
                //通过setTimeout异步执行每个小任务
                setTimeout(()=>{
                  execChildTask(maxIndex, currentIndex+1)
                })
            }
            execChildTask(99, 0)
        }
    </script>
    

我们知道，setTimeout最小间隔为4ms左右，所以总耗时会增加"4ms\*次数"左右。

### 通过requestIdleCallback拆分longTask

requestIdleCallback 用于在浏览器的空闲时段执行**低优先级**的回调，它允许开发者在主事件循环上执行后台和低优先级工作，而不会阻塞或影响延迟关键事件（如动画和输入响应）的处理，特别适用于处理不重要且不紧急的任务，如日志记录、非关键性的数据更新等。

    <script>
      function childTask(){
        let startTime = Date.now();
        while (Date.now() - startTime < 30){}
      }
    
      function longTask(){
        let startTime = Date.now();
        console.log('开始执行长任务')
        function execChildTask(maxIndex, currentIndex){
          if(currentIndex > maxIndex){
            console.log('长任务执行完成', Date.now() - startTime)
            return
          }
          childTask();
          requestIdleCallback(()=>{
            execChildTask(maxIndex, currentIndex+1)
          })
        }
        execChildTask(99, 0)
      }
    </script>
    

如果没有特别多的任务，requestIdleCallback理想情况下耗时相比setTimeout较短，但在某些情况下，如果浏览器持续处于忙碌状态，requestIdleCallback 的回调可能永远不会被调用，所有如果任务需要在特定时间之前完成，使用requestIdleCallback可能不如使用setTimeout。

### 使用Web Worker执行longTask

Web Worker 是运行在浏览器后台的 JavaScript 线程，它可以与主线程进行通信，且不会阻塞主线程，利用这个特性可以在Web Worker中执行复杂的计算任务。

使用Web Worker需要创建一个单独的js文件，用来存放Worker内容。

    //worker.js 
    function childTask(){
        let startTime = Date.now();
        while (Date.now() - startTime < 30){}
    }
    
    function longTask(){
        for(let i = 0; i < 100; i++){
            childTask();
        }
    }
    
    //和主应用进行通信，接到消息后开始执行长任务
    self.onmessage = function (event){
        let task = event.data
        if(task === 'startExec'){
            longTask();
            //完成后通知主程序
            self.postMessage('execSuccess');
        }
    }
    

在主程序中创建Worker实例，并与之通信：

    function longTask(){
       let startTime = Date.now();
       console.log('开始执行长任务')
      //创建worker实例
       let worker = new Worker('./worker.js');
       //通知执行长任务
       worker.postMessage('startExec')
       worker.onmessage = function (event){
           //接收worker发来的消息
           console.log('长任务执行完成', Date.now() - startTime)
       }
    }
    

和setTimeout拆分任务相比，使用Worker执行长任务更加简单，不需要拆分长任务，而且不会占用js线程，性能也更好，但缺点就是浏览器兼容性不够好，而且不能访问Dom。

掌握数据结构和算法
---------

作为前端开发，对数据结构和算法的重视往往不够，认为业务中用不到这些，确实，如果是非常简单的业务，确实可能应用场景比较少，但是当设计复杂业务，特别是对性能要求较高时，数据结构和算法的作用就凸显出来了。在一些知名前端库中经常能看到它们的影子，比如React中的hooks 链表结构以及虚拟Dom的diff算法等，如果想让自己的编程技艺更上一层楼，必须掌握这些计算机基础知识。

我们要对每个数据结构的优缺点、应用场景了然于胸，比如：

*   数组：
    *   优点：
        *   连续存储：数组在内存中连续存储元素，因此通过索引访问元素的速度非常快
        *   空间利用率高：数组没有额外的空间开销来存储元素之间的关系，因此空间利用率高
        *   便于遍历：数组的遍历通常很简单，可以通过循环来遍历所有元素。
    *   缺点：
        *   插入和删除效率低：在数组中间插入或删除元素需要移动其他元素以保持连续性，这导致时间复杂度较高（O(n)）。
        *   大小固定：一旦数组被创建，它的大小就固定了。如果需要添加更多元素，可能需要重新分配更大的内存空间并将所有元素复制到新的数组中。
        *   无法动态扩展：与链表相比，数组不能动态地扩展和缩小以适应数据的变化。
*   链表：
    *   优点：
        *   动态扩展：链表可以动态地添加和删除元素，而无需像数组那样重新分配内存空间。
        *   插入和删除效率高：在链表中插入或删除元素只需要改变指针的指向，时间复杂度通常为O(1)（在已知位置插入或删除）或O(n)（在未知位置插入或删除）。
        *   灵活性强：链表可以轻松地调整元素的顺序，或者将链表拆分成多个子链表。
    *   缺点：
        *   访问效率低：访问链表中的元素需要从头节点开始遍历，直到找到目标元素，时间复杂度为O(n)。
        *   空间利用率低：链表中的每个节点都需要额外的空间来存储指针，因此空间利用率相对较低。
        *   不支持快速索引：链表不支持通过索引直接访问元素，只能从头节点开始遍历。
*   哈希表
    *   优点：
        *   快速查找：哈希表通过哈希函数将键映射到存储位置，从而实现了高效的查找、插入和删除操作（在理想情况下接近O(1)）。
        *   支持动态扩展：哈希表可以根据需要动态地扩展和缩小，以适应数据的变化。
        *   键的唯一性：哈希表中的键必须是唯一的，这有助于确保数据的准确性。
    *   缺点：
        *   空间利用率：哈希表通常需要额外的空间来存储哈希函数的结果和可能的冲突解决机制（如链表）。
        *   哈希冲突：当两个或多个键具有相同的哈希值时，需要额外的机制（如链地址法或开放寻址法）来解决冲突。
        *   不保证有序性：哈希表不保证元素的顺序，这对于需要排序或顺序访问的场景可能是一个问题。

在进行业务开发时，就可以利用这些特点来优化代码性能，比如现在有一个非常大的对象数组，经常要在里面进行一些查询操作，比如按照id进行查询。

    let nodes = [
      {
        id: '1qwe-323s-dse2',
        type: 'rect',
        meta: {}
      },
      {
        id: 'sasd-ggew-232s',
        type: 'circle',
        meta: {}
      }
      //省略更多数据
    ]
    
    function getNodeById(id){
        return nodes.find(item => item.id === id);
    }
    

这里通过对数组遍历进行查询操作，其时间复杂度为O(n)，查询时间依赖数组大小，如果数据量大且经常要查询，则可能带来性能问题，而如果我们将nodes数组转为以id为key的哈希表，则查询时间接近O(1)，可大幅减少查询时间。

    let nodes = [
      {
        id: '1qwe-323s-dse2',
        type: 'rect',
        meta: {}
      },
      {
        id: 'sasd-ggew-232s',
        type: 'circle',
        meta: {}
      }
      //省略更多数据
    ]
    
    //将数组改为哈希表
    const nodesMap = nodes.reduce((result, item)=>{
        result[item.id] = item;
        return result;
    }, {})
    
    function getNodeById(id){
        //查询非常快速
        return nodesMap[id];
    }
    

而如果我们需要频繁的对nodes数组进行插入操作，那么不放试试将数组改为链表结构，也可以提高插入时的性能问题。

总结
==

在产品交互同质化严重的时代，性能变的越来越重要，要更加重视性能优化，把性能当做功能来对待。

产品性能优化主要包括降低时间消耗和减少资源占用两个方面，降低时间消耗可以从网络请求优化、页面渲染优化和长任务优化三个角度进行。

对于不好进行前端优化的功能，可以考虑通过优化产品交互或转移到后端的方式来转移复杂度，同时通过友好的提示，让用户知道当前功能的处理状态。

在进行性能优化时需要搞懂流程，找到优化的关键路径，同时善用工具，快速定位问题，并重视前端性能的监控，主动发现问题解决问题。

本小节还介绍了懒加载的应用场景及2种实现方式，以及如何对长任务进行优化，鼓励大家掌握常用的数据结构和算法。