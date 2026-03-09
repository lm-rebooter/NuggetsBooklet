在这里，我们先装作对 Node.js 不了解，从头来过吧。你有没有假装不了解 Node.js 我不知道，但我就当作你不了解了。

本节会跟大家详细剖析一下 Node.js 到底是个什么东西。在它官网上是这么讲的：

> Node.js® is an open-source, cross-platform JavaScript runtime environment.

翻译过来：Node.js 是一个开源的、跨平台的 JavaScript 运行时环境。这里要敲黑板划重点了，**`JavaScript 运行时环境`**。

JavaScript 运行时环境
----------------

网上其实有很多人图一时嘴快，包括很多招聘的 JD 也都这么写（估计你也没少见过）：

> 熟悉（精通、blahblah……）Node.js 语言。

这其实是一个非常常见的常识错误。`Node.js 并不是语言，而是一个 JavaScript 运行时环境，它的语言是 JavaScript。`这就跟 PHP、Python、Ruby 这类不一样，它们既代表语言，也可代表执行它们的运行时环境（或解释器）。

Node.js 与 JavaScript 真要按分层说，大概是这么个意思吧，如下图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e6ae194a5994631a7124ea5ebd50096~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1563&h=263&s=35649&e=png&a=1&b=ffffff)

这里我们`从下往上`梳理。

*   最下面一层是**脚本语言规范（Spec）** ，由于我们讲的是 Node.js，所以这里最下层只写 ECMAScript。
    
*   再往上一层就是**对于该规范的实现**了，如 JavaScript、JScript 以及 ActionScript 等都属于对 ECMAScript 的实现。
    
*   然后就是**执行引擎**，JavaScript 常见的引擎有 V8、SpiderMonkey、QuickJS 等（其相关 Logo 如下图所示）。
    
*   最上面就是**运行时环境**了，比如基于 V8 封装的运行时环境有 Chromium、Node.js、Deno、CloudFlare Workers 等等。而我们所说的 Node.js 就是在运行时环境这一层。
    

可以看到，JavaScript 在第二层，Node.js 则在第四层。

![趣学 Node.js-01-三图标.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c59af279ed67486cb0a9c0c8c0dade80~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1284&h=496&s=183905&e=png&b=ffffff)

> ### 冷知识
> 
> 几年前微软的 Edge 浏览器还在用 Chakra 引擎的时候，Node.js 其实有个官方的 Chakra 发行版。其原理是，为 Chakra 引擎做一层 V8 的适配层（Shim API）。后来 Edge 浏览器转投 V8 怀抱，微软也就放弃了对 Chakra 引擎的维护。Node.js 的 Chakra 发行版自然而然就不维护了，而 Chakra 引擎也交予社区发展。
> 
> *   Chakra 仓库：[github.com/chakra-core…](https://github.com/chakra-core/ChakraCore "https://github.com/chakra-core/ChakraCore")
> *   Node.js Chakra 仓库：[github.com/nodejs/node…](https://github.com/nodejs/node-chakracore "https://github.com/nodejs/node-chakracore")

本节关于 JavaScript、ECMAScript 的掰扯点到为止。如果大家想多看看关于这一块内容的八卦的话，推荐大家去读一下[《JavaScript 20 年》](https://cn.history.js.org/ "https://cn.history.js.org/")。

总之，以后出去千万别再说 “**Node.js 语言**”这个词啦，要说 “**Node.js 运行时**”。

Node.js 原初
----------

Node.js 是由 Ryan Dahl 在 2009 年初次发布的。但是关于 Node.js 为什么会在这个时间点发布，这得回溯到更早，我们还是得扒一扒一些历史。

JavaScript 本身是在 1995 年发行的，由 Brendan Eich 花了不到两周时间搞出一个初始版本，能跑在网景浏览器中做一些动态的效果等。本来 JavaScript 叫 Mocha，后来改名 LiveScript，再后来为了蹭 Java 热度，改成了 JavaScript。

兜兜转转十多年，JavaScript 一直是运行在浏览器里面的简单语言，哪怕在 1997 年，它就开始 ECMAScript 标准化。因为跑在浏览器里，又是做一些简单的操作，所以性能什么的无关紧要。这一切的转折点在 2008 年。

当年浏览器大战在白热化阶段，国内各种套皮的浏览器不算，最大的主战场在 IE、FireFox、Opera 等中间。2008 年谷歌入局，推出了 Chrome 浏览器及其开源版本 Chromium。以前的浏览器中，JavaScript 虽然重要，但是也没有到极致优化的程度。但是 Chrome 的出现搭载上了 V8 引擎，而这个引擎的开发小组是一群正儿八经的编程语言专家。当时主导这个项目的核心工程师是 [HotSpot VM](https://www.oracle.com/java/technologies/javase/vmoptions-jsp.html "https://www.oracle.com/java/technologies/javase/vmoptions-jsp.html") 和 [Strongtalk](http://strongtalk.org/ "http://strongtalk.org/") 的工程师 Lars Bak。自此，JavaScript 逐渐摆脱了它在脚本语言中性能也很低的名头。

书归正传，**JavaScript 性能开始有了质的飞跃，自然就有人瞄上了服务端领域**。比较像 PHP、Python、Ruby 这些也都是脚本语言，也都在服务端领域吃得开；还有像在游戏领域大行其道的 Lua，等等。

**基于上面的这些原因，Node.js 在 `2009 年`横空出世便显得有迹可循了**。但这玩意儿从传入国内并开始慢慢火起来，还是经历了一两年的。就像天猪，是在 2011 年无意间刷 OSChina 资讯时看到 Node.js 的新闻，当时他第一反应是：“又一个 jQuery 轮子？切！”没成想，无聊时候随意研究了一下就走上了这条不归路。

Node.js 思潮
----------

上面讲了这么多，`Node.js 到底适合做什么呢？`其实**这个问题的答案随着时间推移是一直在变化的**。

在 Node.js 创造之初，主推的是“单线程”“天然异步 API”下的高性能运行时。单线程，意味着业务逻辑不用考虑各种锁的问题；天然异步 API，意味着可以方便地处理并发。这种方式自然适合做**服务端**。

事实上，Ryan 的确也是这么想的。

Node.js 提供了基于事件驱动和非阻塞的接口，可用于编写高并发状态下的程序，而且 JavaScript 的匿名函数、闭包、回调函数等特性就是为事件驱动而设计的。

Node.js 的一些内置模块如 `http`、`net`、`fs` 等，就是为服务端设计的。无论是 HTTP 服务端，还是其他一些 TCP、UDP 的服务端。各种框架开始冒出，最有名的如 Express.js、Koa.js 等，以及像 LoopBack 这类在国内可能并不那么有名的。与其说框架，Express.js 和 Koa.js 更像是对于 HTTP 服务端 API 的上层封装，实际上远没到框架级别。

除了 HTTP 服务，RPC 服务自然也是可以的。各种 RPC 的服务在各大公司都有各自的最佳实践。其实 RPC 与 HTTP 类似，都是要异步处理并发。只不过可能在长短连接上会有不同，在协议的序列化与反序列化上不一样而已。各种社区流行的 RPC 协议也都有 Node.js 的 SDK，如 gRPC 等。

都说 2011、2012 年左右 Node.js 在国内开始萌芽，2013、2014 年开始爆炸，其实是差不多的。在服务端领域，网易也曾在 2012 年末开源了基于 Node.js 的分布式游戏服务端引擎 [pomelo](https://github.com/NetEase/pomelo "https://github.com/NetEase/pomelo")。这个引擎的开源和商用，也昭示着其的确可以在`游戏领域`也吃得开。

> ### 2014～2015 年：Node.js 与 io.js
> 
> Node.js 社区其实在 2014 年底的时候经历过一波社区分裂。有一部分核心开发者从 Node.js v0.12 的源码 Fork 出来，发布 io.js。起因是当时的 GateKeeper 者 Isaac Z. Schlueter 卸任之后，Node.js 的发展（发版）变得缓慢，当时控制 Node.js 的公司 Joyent 又不作为，Node.js v1.0 遥遥无期；再加上本身社区处于一个急速上升期，这自然就引发社区的不满，于是开始自己搞。但又由于可能存在的商标问题，Fork 出来的项目就叫 io.js 了。
> 
> io.js 采用 CTC（核心技术委员会，Core Technical Committee）模式来运作，由他们来决定技术的方向、项目管理和流程、贡献的原则、管理附加的合作者等。并引入 Core Collaborators，代码仓库的维护不仅仅局限在几个核心贡献者手中。不过现在 Node.js 已经没有 CTC 了，而是转成了 TSC（技术指导委员会，Technical Steering Committee）。
> 
> io.js 在 2015 年初就马上发布了 v1.0 版本，后续 v2.0 版本也很快就跟上。彼时 Node.js 还在 v0.13、v0.14 徘徊。后来 Node.js 与 io.js 达成了和解，Joyent 公司做出了让步，并将 Node.js 迁移至基金会。后续 Node.js 和 io.js 在合并之前仍各自发展，直至最终融合。
> 
> 下图是目前 Node.js 官方文档站里面列出的“版本们”，我们可以看到 Node.js v0.12.x 之后，缺失了 v1.x、v2.x 和 v3.x。这就是 Node.js 与 io.js 分裂时期，合并之后，Node.js 直接从 v0.12.x 版本跨越到了 v4.x。
> 
> ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/932bbe26353445bf87b2ce471ad7cd79~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=2910&h=1638&s=1080643&e=png&b=f0f0f0)

除了服务端外，Node.js 提供的形如 `tty`、`repl`、`readline` 等内置模块，同时又为创造各种工具提供了方便的能力。**前端**生态也因此变得庞大，虽然现在 Rust 开始乱入，但泛前端领域自身的 CLI 大抵都还是 Node.js 写的。

Node.js 还有一个用途就是**桌面端**。一路发展过来，从 [NW.js](https://nwjs.io/ "https://nwjs.io/")（前身 node-webkit）到 [Electron.js](https://www.electronjs.org/ "https://www.electronjs.org/")（前身 Atom Shell），以及之前网易也搞过一个叫 [heX](https://hex.youdao.com/ "https://hex.youdao.com/") 的桌面端运行时，之前的有道词典就是基于他们自己的 heX 开发的。heX 一样也是诞生于百花齐放、神仙打架的年代，2013 年。那个时候 Node.js 的土壤简直不要太好。其实很多有名的软件都是基于 Electron 开发的，比如微软的代码编辑器 [Visual Studio Code](https://code.visualstudio.com/ "https://code.visualstudio.com/")，又比如 1Password、钉钉等。

桌面端应用以外，Node.js 一样有可能在**端游**上产生价值。[Lua](https://love2d.org/ "https://love2d.org/")、Python、Ruby 都能写端游（泛指，并不只指各种次时代、巨型游戏），同为脚本语言，JavaScript 自然也可以，而且有 V8 的加持至少性能上不会劣化。除了通过 WebGL 在浏览器里面写前端页面上的游戏、通过 Electron 封装成看起来像端游的游戏，JavaScript 自然还能通过 Node.js 的 binding 去使用 OpenGL 甚至 DirectX 去写货真价实桌面上的游戏，比如 [sfml.js](https://github.com/XadillaX/sfml.js "https://github.com/XadillaX/sfml.js")（一些[小游戏](https://github.com/XadillaX/node-sfml-demos "https://github.com/XadillaX/node-sfml-demos")，以及一个 [NES 模拟器](https://github.com/XadillaX/play-nes "https://github.com/XadillaX/play-nes")）。

但目前来看，**Node.js 最大的场景已经变成了泛前端领域的工具链了**。也正是因为泛前端生态的涌入，Node.js 的趋势越来越往前端生态的补足发展，加上桌面端领域，统称泛前端，服务端领域日渐式微。这个时间点基本上就是在 Node.js 合并快速发展的一两年左右，也就是 2017、2018 年左右。

*   一方面是泛前端生态的涌入，让更多的前端开发者有了更多、更广泛的 Node.js 使用场景，从而出现了国内 Node.js 后端开发者的断层现象，现在招一个 Node.js 后端开发真的是太难了，找来找去就是那么几个熟悉的面孔。
*   另一方面，其他语言或框架也逐渐更现代化起来，原来 Node.js 的异步机制已不再是一家独大和独易用。

> **我写本小册的一个私心，就是想填补国内这块开发者的断层。**

后来 `Serverless` 出现了，Node.js 再次迎来一波焕新。相较于其他的运行时（比如 Java），它在冷启动速度上有着绝对的优势，所占资源也小很多。再加上这两年 Node.js 在冷启动速度上下了比较大的功夫，从 Node.js 自身的 Snapshot 再到用户侧 Snapshot，一一解决。所以很多 Serverless 或者 FaaS 场景下，大家都乐意用 JavaScript 来写，写得快，弹得也快。这里的 JavaScript 底层自然就是指 Node.js 了。当然也有不是 Node.js 的，这个是后话。

一圈看下来，**Node.js 可适配的领域涵盖了泛前端和后端，传统服务和 Serverless，工具、商业、游戏等等**。什么？你说机器学习？看看 [pipcook](https://github.com/alibaba/pipcook "https://github.com/alibaba/pipcook")。阿特伍德定律有云：

> Any application that can be written in JavaScript, will eventually be written in JavaScript.

虽然各领域的板子长短参差不齐，但好歹该有的能力都有了。毕竟底层是 C++ 实现的，想要什么能力，binding 一个就好了。

总之，即使你别的语言都不会，只会 JavaScript 也没关系。虽然不一定精，但有了 Node.js 之后，好歹自己想要什么都能自给自足了。

Node.js 与 Web-interoperable Runtime
-----------------------------------

既然这两年风口是 Serverless，这里就不得不提一下 Web-interoperable Runtime，以及 Node.js 与它的关系。

Web-interoperable Runtime 简称 Winter，**`Web 可互操（cāo）运行时`**。这里有一个核心的单词叫 interoperable，就是可互操。什么是可互操？就是**运行时之间是可以互相替代、互相兼容的**。各种浏览器之间就是 interoperable，经过标准化之后，大家 API 长的都一样，这就是所谓的互通性。

Winter 就是针对服务端 JavaScript 提出的一种规范。只要大家都遵循了 Winter 规范，那么整个生态又是可共享的。因为好多厂商都基于 V8 做了 JavaScript 的运行时，但是后来经过标准化、规范化之后，国际上的几家厂商就一起给它起了一个新的名字，并且开始做一些标准化的事情，组建了一个组织叫做 WinterCG（Web-interoperable Runtimes Community Group），它是由几家国际公司联合起来搞的 W3C 下的一个社区组，致力于做 Web-interoperable Runtime 标准化。

大家可以在 [WinterCG 的官网首页](https://wintercg.org "https://wintercg.org")上看有哪几个公司正在遵循 Winter 的标准做他们的运行时，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a737c7107b474f318f6f32b8a1a04271~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=3744&h=2106&s=1781558&e=png&b=ffffff)

Winter 目前遵循的路线就是，取 Web API（Service Worker）的子集，并不定义新的 API。当然运行时自己想新增也是没问题的，只要保证满足 Winter 的 API 就可以算是合格的 Web-interoperable Runtime 了。

相较于轻量级的 Winter 来说，其实 Node.js 还是显得重了。比如，阿里巴巴动辄亚毫秒级进程冷启动速度的 Noslate，以及字节跳动用于 FaaS、边缘等业务的 Hourai.js，都属于更轻量级的 Winter。市面上有名的 Winter 还有 CloudFlare Workers。

不过其实 Node.js 也正在往 Winter 标准上靠，比如它实现了 WHATWG 的 `URL`、`TextEncoder`、`TextDecoder`、`fetch` 等等。这是后话了。大家都在往标准上做，往标准上靠，殊途同归。

有了 Web-interoperable Runtime 的加持，Node.js 也能在后续持续投入和使用广大 Winter 共同的社区生态，这也算是为未来的 Serverless 架构铺路了。

小结
--

Node.js 经过了十多年发展，其可覆盖的领域已非常完善。从最开始的专注于服务端，到后面泛前端工具链、桌面端、游戏等一应俱全。部署模式也从传统应用到了现在的 Serverless。但如果想要更深地理解自己在写的代码，还是需要对 Node.js 有一个更深的了解，而不仅仅是看文档、用 API。

知其然，知其所以然。这是本小册所期望带给大家的。