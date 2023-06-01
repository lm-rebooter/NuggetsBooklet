

性能监测是前端性能优化的重要一环。监测的目的是为了确定性能瓶颈，从而有的放矢地开展具体的优化工作。   

平时我们比较推崇的性能监测方案主要有两种：**可视化方案、可编程方案**。这两种方案下都有非常优秀、且触手可及的相关工具供大家选择，本节我们就一起来研究一下这些工具的用法。    
   
## 可视化监测：从 Performance 面板说起

Performance
是
Chrome
提供给我们的开发者工具，用于记录和分析我们的应用在运行时的所有活动。它呈现的数据具有实时性、多维度的特点，可以帮助我们很好地定位性能问题。 

### 开始记录

右键打开开发者工具，选中我们的
Performance
面板：   

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664d6a13652f0db~tplv-t2oaga2asx-image.image)

当我们选中图中所标示的实心圆按钮，Performance
会开始帮我们记录我们后续的交互操作；当我们选中圆箭头按钮，Performance
会将页面重新加载，计算加载过程中的性能表现。    
tips：使用
Performance
工具时，为了规避其它
Chrome
插件对页面的性能影响，我们最好在无痕模式下打开页面：   

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664d6cba417ba48~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664d6d61365b9fd~tplv-t2oaga2asx-image.image)   
  
### 简要分析

这里我打开掘金首页，选中 Performance 面板中的圆箭头，来看一下页面加载过程中的性能表现：   

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664d714642f4dcb~tplv-t2oaga2asx-image.image)
   
从上到下，依次为概述面板、详情面板。下我们先来观察一下概述面板，了解页面的基本表现：

  ![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664d75451ddcd18~tplv-t2oaga2asx-image.image) 
  
我们看右上角的三个栏目：FPS、CPU 和 NET。

**FPS**：这是一个和动画性能密切相关的指标，它表示每一秒的帧数。图中绿色柱状越高表示帧率越高，体验就越流畅。若出现红色块，则代表长时间帧，很可能会出现卡顿。图中以绿色为主，偶尔出现红块，说明网页性能并不糟糕，但仍有可优化的空间。

**CPU**：表示CPU的使用情况，不同的颜色片段代表着消耗CPU资源的不同事件类型。这部分的图像和下文详情面板中的Summary内容有对应关系，我们可以结合这两者挖掘性能瓶颈。

**NET**：粗略的展示了各请求的耗时与前后顺序。这个指标一般来说帮助不大。

### 挖掘性能瓶颈

详情面板中的内容有很多。但一般来说，我们会主要去看 Main 栏目下的火焰图和 Summary 提供给我们的饼图——这两者和概述面板中的 CPU 一栏结合，可以帮我们迅速定位性能瓶颈（如下图）。   

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664d9d24ee5bd4e~tplv-t2oaga2asx-image.image)   

先看 CPU 图表和 Summary 饼图。CPU 图表中，我们可以根据颜色填充的饱满程度，确定 CPU 的忙闲，进而了解该页面的总的任务量。而 Summary 饼图则以一种直观的方式告诉了我们，哪个类型的任务最耗时（从本例来看是脚本执行过程）。这样我们在优化的时候，就可以抓到“主要矛盾”，进而有的放矢地开展后续的工作了。  

再看 Main 提供给我们的火焰图。这个火焰图非常关键，它展示了整个运行时主进程所做的每一件事情（包括加载、脚本运行、渲染、布局、绘制等）。x 轴表示随时间的记录。每个长条就代表一个活动。更宽的条形意味着事件需要更长时间。y 轴表示调用堆栈，我们可以看到事件是相互堆叠的，上层的事件触发了下层的事件。   

CPU 图标和 Summary 图都是按照“类型”给我们提供性能信息，而 Main 火焰图则将粒度细化到了每一个函数的调用。到底是从哪个过程开始出问题、是哪个函数拖了后腿、又是哪个事件触发了这个函数，这些具体的、细致的问题都将在 Main 火焰图中得到解答。   
## 可视化监测： 更加聪明的 LightHouse   

Performance 无疑可以为我们提供很多有价值的信息，但它的展示作用大于分析作用。它要求使用者对工具本身及其所展示的信息有充分的理解，能够将晦涩的数据“翻译”成具体的性能问题。    

程序员们许了个愿：如果工具能帮助我们把页面的问题也分析出来就好了！上帝听到了这个愿望，于是给了我们 LightHouse：    

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664db3f31e0b6a6~tplv-t2oaga2asx-image.image)   

> Lighthouse 是一个开源的自动化工具，用于改进网络应用的质量。 你可以将其作为一个 Chrome 扩展程序运行，或从命令行运行。 为Lighthouse 提供一个需要审查的网址，它将针对此页面运行一连串的测试，然后生成一个有关页面性能的报告。   
  
敲黑板划重点：它生成的是一个报告！Report！不是干巴巴地数据，而是一个通过测试与分析呈现出来的结果（它甚至会给你的页面跑一个分数出来）。这个东西看起来也真是太赞了，我们这就来体验一下！    
  
首先在 Chrome 的应用商店里下载一个 LightHouse。这一步 OK 之后，我们浏览器右上角会出现一个小小的灯塔 ICON。打开我们需要测试的那个页面，点击这个 ICON，唤起如下的面板：   

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664db9c661bfee3~tplv-t2oaga2asx-image.image)  

然后点击“Generate report”按钮，只需静候数秒，LightHouse 就会为我们输出一个完美的性能报告。   

这里我拿掘金小册首页“开刀”：   

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664dbdb110cb4ee~tplv-t2oaga2asx-image.image)    

稍事片刻，Report 便输出成功了，LightHouse 默认会帮我们打开一个新的标签页来展示报告内容。报告内容非常丰富，首先我们看到的是整体的跑分情况：   

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664dc4798ee8992~tplv-t2oaga2asx-image.image)

上述分别是页面性能、PWA（渐进式 Web 应用）、可访问性（无障碍）、最佳实践、SEO 五项指标的跑分。孰强孰弱，我们一看便知。

向下拉动 Report 页，我们还可以看到每一个指标的细化评估：   

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664dc86aeeda780~tplv-t2oaga2asx-image.image)   

在“Opportunities”中，LightHouse 甚至针对我们的性能问题给出了可行的建议、以及每一项优化操作预期会帮我们节省的时间。这份报告的可操作性是很强的——我们只需要对着 LightHouse 给出的建议，一条一条地去尝试，就可以看到自己的页面，在一秒一秒地变快。   
   
除了直接下载，我们还可以通过命令行使用 LightHouse： 
```
npm install -g lighthouse
lighthouse https://juejin.cn/books
```
同样可以得到掘金小册的性能报告。
   
此外，从 Chrome 60 开始，DevTools 中直接加入了基于 LightHouse 的 Audits 面板：   

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664dd0337d66bfe~tplv-t2oaga2asx-image.image)

LightHouse 因此变得更加触手可及了，这一操作也足以证明 Chrome 团队对 LightHouse 的推崇。   
    
## 可编程的性能上报方案： W3C 性能 API

W3C 规范为我们提供了 Performance 相关的接口。它允许我们获取到用户访问一个页面的每个阶段的精确时间，从而对性能进行分析。我们可以将其理解为 Performance 面板的进一步细化与可编程化。    

当下的前端世界里，数据可视化的概念已经被炒得非常热了，Performance 面板就是数据可视化的典范。那么为什么要把已经可视化的数据再掏出来处理一遍呢？这是因为，需要这些数据的人不止我们前端——很多情况下，后端也需要我们提供性能信息的上报。此外，Performance 提供的可视化结果并不一定能够满足我们实际的业务需求，只有拿到了真实的数据，我们才可以对它进行二次处理，去做一个更加深层次的可视化。   
   
在这种需求背景下，我们就不得不祭出 Performance API了。

### 访问 performance 对象 

performance 是一个全局对象。我们在控制台里输入 window.performance，就可一窥其全貌：  

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664dd8ec761f69f~tplv-t2oaga2asx-image.image) 
   
### 关键时间节点

在 performance 的 timing 属性中，我们可以查看到如下的时间戳：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664dddde131e37a~tplv-t2oaga2asx-image.image)
   
这些时间戳与页面整个加载流程中的关键时间节点有着一一对应的关系：   

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/7/1664ddd4e3df9a14~tplv-t2oaga2asx-image.image)

通过求两个时间点之间的差值，我们可以得出某个过程花费的时间，举个🌰：     

```javascript
const timing = window.performance.timing
// DNS查询耗时
timing.domainLookupEnd - timing.domainLookupStart
  
// TCP连接耗时
timing.connectEnd - timing.connectStart
 
// 内容加载耗时
timing.responseEnd - timing.requestStart

···
```   
除了这些常见的耗时情况，我们更应该去关注一些**关键性能指标**：firstbyte、fpt、tti、ready 和 load 时间。这些指标数据与真实的用户体验息息相关，是我们日常业务性能监测中不可或缺的一部分：   
  
  
```javascript
// firstbyte：首包时间	
timing.responseStart – timing.domainLookupStart	

// fpt：First Paint Time, 首次渲染时间 / 白屏时间
timing.responseEnd – timing.fetchStart

// tti：Time to Interact，首次可交互时间	
timing.domInteractive – timing.fetchStart

// ready：HTML 加载完成时间，即 DOM 就位的时间
timing.domContentLoaded – timing.fetchStart

// load：页面完全加载时间
timing.loadEventStart – timing.fetchStart
```


以上这些通过 Performance API 获取到的时间信息都具有较高的准确度。我们可以对此进行一番格式处理之后上报给服务端，也可以基于此去制作相应的统计图表，从而实现更加精准、更加个性化的性能耗时统计。   
   
此外，通过访问 performance 的 memory 属性，我们还可以获取到内存占用相关的数据；通过对 performance 的其它属性方法的灵活运用，我们还可以把它耦合进业务里，实现更加多样化的性能监测需求——灵活，是可编程化方案最大的优点。    
   
## 小结

本节我们介绍了 Performance 开发者工具、LightHouse 与 Performance API 三种性能监测的方案。只要有 Chrome 浏览器，我们就可以实现上述的所有操作。    

由此可以看出，性能监测本身并不难。它的复杂度是在与业务发生耦合的过程中提升的。我们今天打下了坚实的地基，后续需要大家在业务中去成长、去发掘这些工具的更多的潜力，这样才能建立起属于我们自己的技术金字塔。    
   
推荐阅读：   
- [Performance 官方文档](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference) 

- [使用 Lighthouse 审查网络应用
](https://developers.google.com/web/tools/lighthouse/?hl=zh-cn) 

- [MDN Performance API 介绍](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance) 

（阅读过程中有任何想法或疑问，或者单纯希望和笔者交个朋友啥的，欢迎大家添加我的微信xyalinode与我交流哈~）