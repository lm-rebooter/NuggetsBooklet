兽人永不拖堂！

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/819aa267f8644c27be9082bcdee02829~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=269&h=188&s=107070&e=png&b=8b6d47)

我们写本章之前，先介绍一下什么是 WinterCG。

WinterCG 与 Winter
-----------------

我们在[第一章](https://juejin.cn/book/7196627546253819916/section/7195089399787290635 "https://juejin.cn/book/7196627546253819916/section/7195089399787290635")的时候有提过一嘴 Winter 与 WinterCG。不过当时作为开篇，讲得还有点抽象。

WinterCG（Web-interoperable Runtime Community Group）是一个 W3C 下的社区组织，旨在为不同 JavaScript 运行时提供一个合作的空间，从而一起提高跨不同 JavaScript 运行时中 Web 平台 API 的可互操性。

简而言之，就是几个 W3C 下的成员公司或组织都做了一个跑在后端的 JavaScript 运行时，如 Cloudflare Workers、Vercel Edge Runtime，字节跳动内部的 Goofy Worker 等。后来大家发现，大家都在往 Web 平台 API 靠，说得直白一点，都搬用了浏览器中的 Service Worker API。几家公司一碰头，Service Worker API + JavaScript 后端运行时，有搞头！

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eac0725f35ab4f8eaeb238abad3d46fb~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=297&h=170&s=63645&e=png&b=6f3830)

于是撺掇了这个 WinterCG，制定 Winter 规范，几家公司各自做的后端运行时都往规范上靠。这样，大家可共用生态、相互移植——可互操性（interoperable）。Winter 即 Web-interoperable Runtime（Web 可互操运行时）的缩写，WinterCG 里的 CG 则是 Community Group。

这么说起来，大家可能还有点抽象。如果类比成浏览器，各家有各家的浏览器，IE、Chrome、Firefox、Opera、Edge 等等，但大家都遵循同一套标准去渲染页面，同一套脚本语言标准（ECMAScript），所以同一个网站在不同浏览器中执行结果几乎一样。

同理，Cloudflare Workers、Vercel Edge Runtime、字节的 Goofy Worker、阿里的 Noslate 都遵循 Winter 标准，那么同一套代码理论上可以运行在任意供应商的运行时活服务中。再加上这一套标准是从 Service Worker API 演进而来，又可以复用海量的大前端生态（npm 包），使其可如虎添翼。

> **自卖自夸：** Goofy Worker 是我在字节跳动内部用 C++ 基于 V8 引擎写的一套极速启动的 Web-interoperable Runtime。关于这块我在 ArchSummit 2022 上也有做过相关分享：[Serverless 高密度部署与 Web-interoperable Runtime 在字节跳动的实践](https://www.yuque.com/xadillax/koumakan/et4mpg "https://www.yuque.com/xadillax/koumakan/et4mpg")。

举个最简单的例子来说，这一份代码在上面几个运行时中的效果是一样的：

    addEventListener('fetch', event => {
      return event.respondWith(new Response('Hello world!'));
    });
    

结果都是你去请求它提供给你的地址，返回的页面内容是 `Hello world!`。这就是统一标准的好处。而且通常来说，Winter 都是跟随着 Serverless 相关架构托出的，像 Cloudflare、Vercel 这些，大家都不用正儿八经写需要监听端口、生成整套服务端的代码，只需要在代码里监听 `fetch` 事件即可，可以让大家更专注于业务逻辑的开发，不用管周边有的没的。

Node.js 与 Winter
----------------

我们在第一章提过：

> 其实 Node.js 也正在往 Winter 标准上靠，比如它实现了 WHATWG 的 `URL`、`TextEncoder`、`TextDecoder`、`fetch` 等等。

大家打开 WinterCG 的 Runtime Keys 的 Proposal（[runtime-keys.proposal.wintercg.org/](https://runtime-keys.proposal.wintercg.org/ "https://runtime-keys.proposal.wintercg.org/") ），可以看到现在列了几个对外提供服务的键值，Node.js 就是其中之一。

另外，我们也可以打开 WinterCG 的 Minimum Common Web Platform API 的 Proposal（[common-min-api.proposal.wintercg.org/#web-intero…](https://common-min-api.proposal.wintercg.org/#web-interoperable-runtime "https://common-min-api.proposal.wintercg.org/#web-interoperable-runtime") ）。在它术语那栏：

> The Web Platform is the combination of technology standards defined by organizations such as the W3C, the WHATWG, and others as implemented by Web Browsers.
> 
> A **Web-interoperable Runtime** is any EcmaScript-based application runtime environment that implements the subset of Web Platform APIs outlined in this specification. While this term is intentionally broad to also encompass Web Browsers, the primary focus here is on outlining expectations for non-browser runtimes.

讲的是 Web-interoperable Runtime 是基于 ECMAScript 的应用程序运行时环境，该环境得实现这个 Minimum Common Web Platform API 中指定的 API 集合——Web Platform API 中的子集。

但往往事与愿违，虽然我们期望一个标准的 Winter 是 Minimum Common Web Platform API 的超集：

![19流程图1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72e2b81f05014d8c992c69d71d6f0deb~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1204&h=1082&s=336867&e=png&b=fdf6f5)

实际上，只需要满足其子集（即与 Common Minimum API 成为交集）就可以一定程度上宣传自己是一个 Winter：

![19流程图2.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03fac9b3fa404bfca45e498bb5ae7c98~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1160&h=1202&s=298665&e=png&b=fcf7f7)

其实这也好理解，哪怕是 Chrome 也没完全按照 Web Platform API 去实现，V8 引擎实现的 JavaScript 与 ECMAScript 也只是个大面积重合的交集，各浏览器的 CSS 中还有各自的个性化前缀呢。大家求同存异，求同存异。

所以 Node.js 很明显，就只是满足其子集（成为交集）：

![19流程图3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e28efe35758448968650dfb284e20f39~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1190&h=1122&s=257055&e=png&b=fbf4f3)

这么一来，很多前端的 Service Worker API 相关的生态，在 Node.js 中也可以直接使用了。

> 状态机
> ---
> 
> 这里补充一个“状态机”的知识。如果大家了解什么是状态机，则可以直接跳过这一段。
> 
> 红绿灯是我们日常生活中常见的交通信号设备，它有三个状态：红灯、黄灯和绿灯。红绿灯按照一定的顺序和时间间隔在这三个状态之间切换，用以控制交通流。
> 
> 1.  红灯（状态A）：此时，车辆需要在路口停止等待；
>     
> 2.  绿灯（状态B）：车辆可以通过路口；
>     
> 3.  黄灯（状态C）：警示车辆准备停车，因为红灯即将亮起。
>     
> 
> 状态机在这里就是红绿灯控制系统，负责在这三个状态之间进行切换。整个过程是线性的，遵循以下规律：
> 
> 红灯 → 绿灯 → 黄灯 → 红灯 → 绿灯 → 黄灯...
> 
> 在每个状态，红绿灯会持续一定的时间。例如，红灯亮 30 秒，绿灯亮 60 秒，黄灯亮 5 秒。状态机根据时间间隔来判断何时进行状态转换。当一个状态结束时，它会自动切换到下一个状态。
> 
> 总之，在红绿灯的例子中，状态机就是控制红绿灯在三个状态之间线性切换的系统，以确保交通秩序井然有序。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d5f1cf997e74676840ea1a4192a82ac~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=225&h=225&s=78881&e=png&b=303842)

> 如果在程序中用伪代码来表示这个状态机，可能的方式如下：
> 
>     let left = 30;
>     let state = 'RED';
>     while (过了一秒) {
>       switch (state) {
>         case 'RED':
>           left--;
>           if (left === 0) {
>             state = 'GREEN';
>             left = 60;
>           }
>           break;
>           
>         case 'GREEN':
>           left--;
>           if (left === 0) {
>             state = 'YELLOW';
>             left = 5;
>           }
>           break;
>           
>         case 'YELLOW':
>           left--;
>           if (left === 0) {
>             state = 'RED';
>             left = 30;
>           }
>           breka;
>           
>         default:
>           throw new Error('夭寿啦状态错啦！');
>       }
>     }
>     
> 
> 这就是一个非常简单的状态机，给大家展示了状态是如何在红绿黄三种状态中切换。

url 与 querystring
-----------------

### `url`

这两个小可爱就是 Node.js 上面集合图中的粉色部分了——自己的内置模块。而且是历史遗留模块。

首先打开[文档](https://nodejs.org/dist/latest-v18.x/docs/api/url.html#legacy-url-api "https://nodejs.org/dist/latest-v18.x/docs/api/url.html#legacy-url-api")，我们能看到 `url` 已被标注为 Legacy。

> [Stability: 3](https://nodejs.org/dist/latest-v18.x/docs/api/documentation.html#stability-index "https://nodejs.org/dist/latest-v18.x/docs/api/documentation.html#stability-index") - Legacy: Use the WHATWG URL API instead.

如果要使用它，那就是直接 `require('url')` 即可。由于是 Node.js 自己写的 `url` 相关模块，自然 API 方面、行为方面没有什么严谨的标准可遵循。

`url.parse()` 实际上是一个简便写法，实际上它内部是：

    const urlObject = new Url(); // Node.js 的 Url
    urlObject.parse(url, parseQueryString, slashesDenoteHost);
    return urlObject;
    

而 `urlObject.parse()` 就是一个简单的字符串解析，逐段拆解。

> [github.com/nodejs/node…](https://github.com/nodejs/node/blob/v18.16.0/lib/url.js#L182-L514 "https://github.com/nodejs/node/blob/v18.16.0/lib/url.js#L182-L514")

就是非常暴力的逐字符解析，并以一些标识来记录当前的状态。首先[从头到尾遍历一遍整个 URL](https://github.com/nodejs/node/blob/v18.16.0/lib/url.js#L195-L236 "https://github.com/nodejs/node/blob/v18.16.0/lib/url.js#L195-L236")，做一些类似 Trim 的操作，然后看看其是否在 `?` 之前包含 `@`，以及是否包含 `#`，并打上标。并将反斜杠 `\` 改成斜杠 `/`。

    Url.prototype.parse = function parse(url, parseQueryString, slashesDenoteHost) {
      ...
    
      let hasAt = false;  // 是否包含 @
      let hasHash = false;  // 是否包含 #
      for (let i = 0, inWs = false, split = false; i < url.length; ++i) {
        const code = url.charCodeAt(i);
        
        <解析第 i 个字符>
      }
      
      ...
    }
    

如果既不包含 `#` 又不包含 `@`，则它有可能是一个简单的路径。那么就[用下面正则试一下](https://github.com/nodejs/node/blob/v18.16.0/lib/url.js#L261-L281 "https://github.com/nodejs/node/blob/v18.16.0/lib/url.js#L261-L281")：

    const simplePathPattern = /^(//?(?!/)[^?\s]*)(?[^\s]*)?$/;
    
    const simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      // 如果试成功了，则将各段赋值并返回
    }
    

在 `simplePath` 判断的语句里面，如果正则匹配成功，就开始赋值匹配到的各字段。其中 `query` 是 `simplePath[2]`（如果有的话），则用 Node.js 内置的 `querystring` 解析一下。

如果没试成功，那么就老老实实开始从判断协议开始。也是走正则：

    const protocolPattern = /^[a-z0-9.+-]+:/i;
    
    let proto = protocolPattern.exec(rest);
    let lowerProto;
    if (proto) {
      proto = proto[0];
      lowerProto = proto.toLowerCase();
      this.protocol = lowerProto;
      rest = rest.slice(proto.length);
    }
    

说白了就是正则匹配“:”这种形式的开头。如果匹配上了，就赋值给 `this.protocol`，并把这一段去掉，留之后的一段（`rest = rest.slice(...)`）给后续解析用。然后是判断后面两位是否是两个斜杠 `//`，具体就不表了。

接下去如果解析出来的协议是需要有 `host` 段的，或者其它一些情况，就开始用剩下的字符串进行 `host` 字段的解析。这里代码比较长，就不详细说明了。总之就是一个 `for` 语句，里面逐字扫描，用 `switch` 枚举不同字符所对应的状态。

例如，`Tab`、换行或者回车会被直接忽略；如果是 `#`、`/` 或者 `?` 则认为 `host` 字段结束，退出循环；如果是 `@` 则记录下位置，以供解析类似 `http://foo:bar@example.com/` 情况使用。

得到 `host` 起止位置之后，就可以开始解析该字段了，比如判断是不是一个 IP 地址，是 IPv4 还是 IPv6，还是非 IP 地址等情况。再之后又是下一段位置的匹配，如路由、`query` 等等。有兴趣可自行翻看源码。

总得来看，`url` 跑了好多次正则，并且来来回回遍历了不止一遍 URL，性能上没有纯状态机来得好。

### `querystring`

这类字符串解析的逻辑大多都是遍历字符串，逐字解析，按标识位进行不同的逻辑。`querystring` 的 `parse` 亦是如此，类似下面的逻辑：

    for (let i = 0; i < qs.length; ++i) {
      const code = String.prototype.charCodeAt.call(qs, i);
      
      if (code === '&') {
        // ...
      } else {
        if (code === '=') {
          // ...
        } else {
          // ...
        }
      }
    }
    

> 大家有兴趣可以自行尝试着做一下这个解析，然后再参照 Node.js 的相关源码看看哪里一样哪里不一样。

URL
---

`URL` 属于上面 Node.js 集合图中的黄色区域与 Node.js 的交集，Minimum Common Web Platform API 之一。也是浏览器 JavaScript 运行环境中很重要的类之一。相信各位前端大佬们对此并不陌生。这里的 `URL` 特指 WHATWG 规范的 `URL`。

### 什么是 WHATWG

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c68369fb82a14edfbd22aa472ee6b92f~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=150&h=150&s=11315&e=png&a=1&b=ffffff)

WHATWG Logo

Web Hypertext Application Technology Working Group（WHATWG）是一个专注于开发 Web 技术标准的组织。它成立于 2004 年，是由 Apple、Mozilla、Opera 和 Google 等公司的工程师共同发起的。起初，这个组织的成立是为了解决 W3C（万维网联盟）在当时推动的 XHTML 和 Web 应用技术方向的问题。WHATWG 的目标是开发一套简单、易于实现的Web标准，以便更好地满足Web开发者和用户的需求。

WHATWG 的工作主要集中在以下几个领域：

1.  **[HTML](https://html.spec.whatwg.org/multipage/ "https://html.spec.whatwg.org/multipage/")** **：** WHATWG 负责 HTML 标准的维护和开发，他们的 HTML Living Standard 版本持续更新，以适应 Web 技术的快速发展；
2.  **[DOM](https://dom.spec.whatwg.org/ "https://dom.spec.whatwg.org/")** **：** 文档对象模型（Document Object Model, DOM）是一种描述 Web 页面结构的编程接口。WHATWG 负责维护和更新 DOM 标准；
3.  **[Fetch](https://fetch.spec.whatwg.org/ "https://fetch.spec.whatwg.org/")** **：** Fetch API 提供了一种通用的资源获取机制，用于替换 `XMLHttpRequest`。WHATWG 负责这个 API 的标准化；
4.  **[URL](https://url.spec.whatwg.org/ "https://url.spec.whatwg.org/")** **：** WHATWG 维护了 URL 标准，这是一种用于解析和处理 URL 的规范。

除了上述领域，WHATWG 还关注其他 Web 相关的技术和标准。这个组织对 Web 技术的发展产生了重要影响，提供了许多关键标准，使得 Web 开发更加高效和便捷。

### URL 的 IETF RFC

**注意，此处的** **URL** **指广义的 URL，并非前端领域的 URL 规范。**

URL（Uniform Resource Locator，统一资源定位符）是一种用于定位和访问互联网资源的标准化地址格式。URL 的标准化过程主要参照了一系列 RFC（Request for Comments，征求意见稿）文档。RFC 是由 Internet Engineering Task Force（IETF，互联网工程任务组）负责编写和发布的一种技术标准文档。有关 URL 的 RFC 文档包括但不限于以下几个：

1.  **[RFC 1738](https://www.ietf.org/rfc/rfc1738.txt "https://www.ietf.org/rfc/rfc1738.txt")** **：** 这是 1994 年发布的一篇RFC文档，首次定义了 URL 的基本概念和格式。它详细介绍了 URL 的结构，包括方案（scheme）、主机（host）、端口（port）、路径（path）和查询字符串（query string）等部分；
2.  **[RFC 2396](https://www.ietf.org/rfc/rfc2396.txt "https://www.ietf.org/rfc/rfc2396.txt")** **：** 这篇 1998 年发布的文档对 RFC 1738 进行了修订，进一步明确了 URI（Uniform Resource Identifier，统一资源标识符）的概念，并提出了 URL 和 URN（Uniform Resource Name，统一资源名称）是 URI 的两个子集。此外，它还规范了一些 URL 的细节，如转义字符和相对 URL 的处理；
3.  **[RFC 3986](https://www.ietf.org/rfc/rfc3986.txt "https://www.ietf.org/rfc/rfc3986.txt")** **：** 这是 2005 年发布的一篇 RFC 文档，对 RFC 2396 进行了全面修订。它重新定义了 URI 的组成部分，包括方案、用户信息（user info）、主机、端口、路径、查询字符串和片段（fragment）等，并提供了一套严格的语法规则；此外，它还描述了URI的规范化、比较和解析方法；
4.  **[RFC 3987](https://www.ietf.org/rfc/rfc3987.txt "https://www.ietf.org/rfc/rfc3987.txt")** **：** 这篇 2005 年发布的文档定义了 IRI（Internationalized Resource Identifier，国际化资源标识符）的概念。IRI 是 URI 的一个扩展，允许使用非 ASCII 字符（如中文、日文等）表示资源地址；这使得资源地址能够更好地适应多种语言和文化背景。

值得注意的是，随着 Web 技术的发展，URL 的标准化工作逐渐从 IETF 转向了 WHATWG。WHATWG 负责维护一个名为“URL Standard”的文档，提供了一套更简洁、易于理解的规范，以满足现代 Web 应用的需求。尽管如此，前面提到的一些RFC文档仍然具有重要的参考价值。

### URL 的 IETF RFC 与 WHATWG URL

上面提到了，随着 Web 技术的发展，URL 的标准化工作逐渐从 IETF 转向了 WHATWG。WHATWG 自身的 URL 规范中就有这么一个大目标：

> URL 标准采用以下方法使 URL 完全可互操（interoperable）：
> 
> 1.  使 RFC 3986 和 RFC 3987 与现代实现保持一致，并在此过程中废弃这些 RFC； URL 解析需要变得像 HTML 解析一样稳固；
> 2.  统一使用 URL 这个术语；URI 和 IRI 只会让人困惑；实际上，一个算法被同时用于两者，所以保持它们的区别对任何人来说都没有帮助；URL 在搜索结果的受欢迎程度中也轻松获胜；
> 3.  取代 [RFC 6454](https://www.rfc-editor.org/rfc/rfc6454 "https://www.rfc-editor.org/rfc/rfc6454") 中的“[Origin of a URI](https://datatracker.ietf.org/doc/html/rfc6454#section-4 "https://datatracker.ietf.org/doc/html/rfc6454#section-4")”；
> 4.  详细定义 URL 现有的 JavaScript API，并添加增强功能，以便更容易使用；还要添加一个新的 `URL` 对象，以便在不使用 HTML 元素的情况下进行 `URL` 操作；
> 5.  确保解析器（parser）、序列化器（serializer）和 API 组合保证幂等性；例如，解析-序列化操作的非失败结果不会随着对其应用的任何进一步解析-序列化操作而改变。同样地，通过 API 操纵非失败结果不会因应用任何数量的序列化-解析操作而改变。

WHATWG 开始对 URL 标准进行维护和改进的时间并没有一个确切的年份。不过，可以追溯到 2012 年左右，URL 标准已经开始在 WHATWG 社区中出现和发展。从那时起，WHATWG 一直在努力完善和更新 URL 标准，以适应现代 Web 应用的需求和发展。

根据上面的这些描述，我们可以画出一张 URL 的演进图：

![19流程图4.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbf09b81b37f4eddb2e3dbff437147ce~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1148&h=566&s=124253&e=png&b=fef5e4)

在 WHATWG URL 目标中提到的 RFC 6454，其标题为《The Web Origin Concept》，即 Web 中的“源”概念。这是一篇于 2011 年发布的关于 Web 安全领域的技术标准文档。该文档定义了“源”的概念，“源”是一种用于区分不同 Web 资源的安全边界。“源”的概念在浏览器安全策略（如同源策略）中起着关键作用，有助于防止跨站脚本攻击（XSS）和其他 Web 安全风险。

RFC 6454 中有提到“URI 中的源”。鉴于后续逐渐由 WHATWG URL 来维护 URL 的概念，并淡出其它所有形如 URI、IRI、URN 等概念，RFC 6454 中的这个“URI 中的源”也应当被 WHATWG URL 的概念所取代。这就是 WHATWG URL 中第三个目标的意思。

WHATWG URL 不但定义了 URL 字符串的规范，还定义了 JavaScript 中符合 WHATWG 规范的 `URL` 类应该是什么样的，行为如何。浏览器中大家所使用的 `URL` 类就是 WHATWG URL；另外，WinterCG 中 Minimum Commom Web Platform API 中所定义要实现的 `URL` 也指的是 WHATWG URL。

所以大家看到 Cloudflare Workers 有，Deno 有。Node.js 也在 v6.13.0 中首次引入了 WHATWG 规范的 `URL` 类，此后原来的 `url` 就被标记成了 Legacy 了。

### Node.js 中的 `URL`

我们上面提到了，Node.js 在 v6.13.0 中首次引入了 WHATWG 规范的 `URL` 类。当时 Node.js 是完全自己将耦合的 `URL` 代码写进了项目中。

#### 小插曲

我曾在 2022 年 4 月从零开始完成过一版可通过当时 WHATWG URL 版本的 WPT 测试的 C++ URL 库（[libwhatwgurl](https://github.com/XadillaX/libwhatwgurl "https://github.com/XadillaX/libwhatwgurl")），并[建议](https://github.com/nodejs/node/issues/42545 "https://github.com/nodejs/node/issues/42545") Node.js 可基于解耦版本的且完全通过 WPT 测试的版本进行重构，若可以我会继续完善整个项目。后来被带偏不了了之了。

在我之前，有另一个小哥 [anonrig](https://github.com/anonrig "https://github.com/anonrig") 也在尝试类似的事，用 Rust 做了一个 Demo，想走 WASM 的路线。后来证明 WASM 的性能并不更好，他于 2022 年 12 月开始着手 C++ 版本的 [Ada URL](https://github.com/ada-url/ada/commit/ae7becb7f866178993ca3167e2033fd4ce363802#diff-b335630551682c19a781afebcf4d07bf978fb1f8ac04c6bf87428ed5106870f5 "https://github.com/ada-url/ada/commit/ae7becb7f866178993ca3167e2033fd4ce363802#diff-b335630551682c19a781afebcf4d07bf978fb1f8ac04c6bf87428ed5106870f5") 的开发。最后，用新的 Ada URL [替换了老的 Node.js 实现](https://github.com/nodejs/node/pull/46410 "https://github.com/nodejs/node/pull/46410")。

这个故事告诉我们，第一步做完了之后，不要等着不了了之，**干就是了**。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49adde5ced1e43809f47d274dfec6de4~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=600&h=395&s=247797&e=png&b=c5c0c0)

毕竟当时抽离出来的 libwhatwgurl 也是经过了长期几万 QPS 的洗礼。并不怂。

##### WPT 测试

[Web 平台测试](https://github.com/web-platform-tests/wpt "https://github.com/web-platform-tests/wpt")（WPT）是 W3C 的一个测试 Web 平台能力的基准测试集。其中涵盖了大量 Web 所需的标准 WHATWG API 等内容。像 Chrome、Mozilla 等遵循 W3C 标准的浏览器，以及像一些 Web-interoperable Runtime，都需要通过一定量的 WPT。

针对有 WHATWG 标准的那些 API，Node.js 都或多或少进行了 WPT 测试，以确保“可互操性”。Node.js 通过了 WPT，别的运行时也通过了 WPT，可以理解为他们在相关 API 上的行为都是标准且一致的，这个时候同一份代码就可以真正意义上在不同运行时中执行。

如果两个运行时都通过了 URL 的 WPT 测试，就意味着生态中的一些使用 URL 相关 API 做事情的库可随意跑在任意运行时中而不出错。这就是“可互操”。

前文中所讲的 libwhatwgurl、Ada URL 通过了 WPT 测试，就意味着相同 URL 字符串在这两个库中的解析最终结果是一致的。而原来版本的 Node.js 在 URL 上面并没有完全通过。

#### Ada URL

Ada URL 是 Node.js v18.16.0 中引入的。其历史也在小插曲中介绍了一下。相较于原版的耦合实现，Ada URL 更遵循 WHATWG URL 的规范，另外性能也得到了 100% 以上的提升。

它的原理与 libwhagwgurl 类似，都是一个正儿八经的状态机。在它的解析代码中，[结构就像这样](https://github.com/ada-url/ada/blob/4215aed05d6b98fbab7ab310f62d16ff90380924/src/parser.cpp "https://github.com/ada-url/ada/blob/4215aed05d6b98fbab7ab310f62d16ff90380924/src/parser.cpp")：

    template <class result_type>
    result_type parse_url(std::string_view user_input,
                          const result_type* base_url) {
      ...
      
      while (input_position <= input_size) {
        ...
        switch (state) {
          case ada::state::SCHEME_START:
            ...
          case ada::state::SCHEME:
            ...
          case ada::state::NO_SCHEME:
            ...
            
            ...
        }
      }
      
      return url;
    }
    

这里的各种状态之间转移，基本上就完全遵照了 WHATWG URL 规范中的[状态定义](https://url.spec.whatwg.org/#scheme-start-state "https://url.spec.whatwg.org/#scheme-start-state")，同样是 scheme start state、scheme state 等等，这些是规范中原原本本定义的，大家有兴趣可以自行通过前面的链接点进去瞄一眼。这就是先前提到的“详细定义 URL 现有的 JavaScript API，并添加增强功能，以便更容易使用”。**只要你按照规范逐字、逐逻辑实现，你就能写对；若你要性能有提升，则需要学会在不改变最终行为的前提下进行变通。**

基本上所有的 WHATWG 规范都是如此，只要你照着写，你的正确性下限不会低。但要抬高性能上限，就需要你加入自己的魔法。

由于该状态机过长，在 Ada URL 的解析代码中就实现了将近 1000 行（还不包含帮助类等），在 libwhatwgurl 中也实现了[一千多行](https://github.com/XadillaX/libwhatwgurl/blob/master/src/parse.cc "https://github.com/XadillaX/libwhatwgurl/blob/master/src/parse.cc")，所以再细节讲下去也无意义。原理都是刚才说的一样，按照 WHATWG URL 规范中所定义的状态机一样，逐步用 `switch-case` 复刻出来即可。若你想写，用 JavaScript 参照着规范，只要有足够耐心，都能实现。

比如我们在 scheme state 状态（且无 `base` 参数时），每次拿到一个新的字符时（这个例子中各状态不用深究，在没通读全貌的情况下，深究可能会自己走进死胡同，只需要知道状态是根据条件切换来切换去的即可）：

1.  如果该字符是数字、字母、`+`、`-` 或者 `.`，则将该字符拼接到临时缓冲区后面（以供后续 `scheme` 字段用）；
    
2.  如果该字符是 `:`，则
    
    a. 让 `scheme` 等于临时缓冲区的内容；
    
    b. 清空临时缓冲区；
    
    c. 如果这个时候拿到的 `scheme` 是 `file`，则
    
    *   若 URL 字符串后面两位不是 `//`，则抛错；
    *   否则切换状态为 file state，这样再遍历下个字符的时候就走 file state 逻辑来将后续内容以 file 状态去解析；
    
    d. 如果拿到的不是 `file`，且它是特殊的 scheme（`ftp`、`file`\*、`http`、`https`、`ws`、`wss`）之一，则切换状态为 special authority slashes state，这样再遍历下个字符的时候就走 special authority slashes state 逻辑，去处理后续可能的认证字段；
    
    e. 如果它不是特殊 scheme 之一，且后面一个字符是 `/`，则切换状态为 path or authority state，并跳过 `/` 这个字符的解析，即下标加一；
    
    f. 若后面字符不是 `/`，则将 `path` 字段设置为空，并切换状态为 opaque path state；
    
3.  如果该字符是其它字符，则清空临时缓冲区，并切换状态为 no scheme state，并将下标重置为 `0`，从头开始以 no scheme state（无 scheme 的 URL）进行解析。
    

> 在 `URL` 规范中，`protocol` 是一个 `getter`，其值为 `scheme + ':'`。

为了方便大家看得更直白，我修改了原规范中的一些措辞，虽然没那么严谨，但更加白话一些。如果用更白话来解释这段状态，就是：

> 如果我现在正在解析 scheme，那我遍历后面每一个字符，若字符是字母数字或者加减点号则把这个字符加到 scheme 后面去，直到碰到的是 `:` 为止。若这期间碰到非字母数字加减点号以及冒号的字符，则以“无 scheme”的方式重头再解析一遍。当我们碰到了 `:` 后，就认为前面的字符串就是我们要的 `scheme`，然后根据不同的 `scheme` 类型来决定后续解析的逻辑（即切换不同状态）。若是 `file` 类型，则判断后面是不是 `//`，若不是，则说明 URL 非法；若是，则后续使用 file state 状态去解析后续字符。若是非 `file` 的特殊 scheme，则切换 special authority slashes state 去解析后续字符。若不是特殊 scheme，那么看看后面的字符是不是 `/`。若是 `/`，则后续使用 path or authority state 去解析字符；若不是 `/`，则将 `path` 字段置空，并使用 opaque path state 解析后续字符。

这段逻辑释放了几个信号：

1.  URL 的 scheme 只能是字母数字加减点号，并且后面跟着的是冒号；
2.  `file` 类的 scheme 后面只能是 `//`；其余特殊 scheme，那么直接走 special authority slashes state 去处理后续逻辑；
3.  如果是非特殊 scheme，则有无 `/` 区别在于有 `/` 的情况下后面那一段是 `path` 或者 `authority`，若无 `/` 则代表没有 `path`。

在 Node.js 的文档中，是这么画出 `URL` 的格式的：

    ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                              href                                              │
    ├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
    │ protocol │  │        auth         │          host          │           path            │ hash  │
    │          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
    │          │  │                     │    hostname     │ port │ pathname │     search     │       │
    │          │  │                     │                 │      │          ├─┬──────────────┤       │
    │          │  │                     │                 │      │          │ │    query     │       │
    "  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
    │          │  │          │          │    hostname     │ port │          │                │       │
    │          │  │          │          ├─────────────────┴──────┤          │                │       │
    │ protocol │  │ username │ password │          host          │          │                │       │
    ├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
    │   origin    │                     │         origin         │ pathname │     search     │ hash  │
    ├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
    │                                              href                                              │
    └────────────────────────────────────────────────────────────────────────────────────────────────┘
    (All spaces in the "" line should be ignored. They are purely for formatting.)
    

我们可以看到，最开始就是以 `<foo>:` 开头，后面跟着 `<user>:<pass>@` 的 `authority` 字段，不过这个字段是可选的。所以我们在上面状态中能看到 `authority` 的字样。

简单画个图便于大家理解：

![19流程图5.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2dc69967ed7247dda4fd9f29f66a760a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1130&h=810&s=204327&e=png&b=fbfedb)

#### 扩展阅读

这里就有一份 JavaScript 版本的实现，大家有兴趣也可以阅读一下（[github.com/jsdom/whatw…](https://github.com/jsdom/whatwg-url "https://github.com/jsdom/whatwg-url") ）。真点进去看其实也是一个状态机，只不过它的实现有点不一样，并不是通过 `switch-case` 来做的，而是通过对象中的字段。

就像这样：

    function URLStateMachine(input, base, ...) {
      ...
      for (; this.pointer <= this.input.length; ++this.pointer) {
        const c = this.input[this.pointer];
        const cStr = isNaN(c) ? undefined : String.fromCodePoint(c);
    
        // exec state machine
        const ret = this[`parse ${this.state}`](c, cStr);
        if (!ret) {
          break; // terminate algorithm
        } else if (ret === failure) {
          this.failure = true;
          break;
        }
      }
      ...
    }
    
    URLStateMachine.prototype["parse scheme start"] = function(...) {
      // 逻辑
    }
    
    URLStateMachine.prototype["parse scheme"] = function(...) {
      // 逻辑
    }
    
    ...
    

通过事先定义好类似 `parse scheme start` 等名字的函数，然后在相关状态机状态下执行对应函数的方式来模拟一个 `switch-case` 的状态机。

本章小结
----

本章给大家介绍了什么是 Web-interoperable Runtime，以及什么是 WinterCG。一个 Web-interoperable Runtime 满足 WinterCG 标准中 Minimum Common Web Platform API 的子集，以及其它一些 API 集合即可。所以 Node.js 也是一个 Web-interoperable Runtime。

在此基础上，为大家介绍了老旧的 `url` 的一些内容。以及 Node.js 在契合 Web-interoperable Runtime 之后（开始契合时尚未有 Web-interoperable Runtime 的概念，只是往 Web Platform API 标准上靠），新出来的 `URL` 的一些内容。简单为大家介绍了 URL 的历史，从 IETF RFC 到 WHATWG。以及 Node.js 自身的 WHATWG URL 是如何发展的。

没有太深入到原理的细节实现，因为这是一个冗杂的状态机实现。但为大家简单介绍了一下状态机，以及 URL 中某个状态的逻辑是如何流转的。如果需要了解更多，推荐大家阅读 WHATWG URL 的定义，以及 Node.js、Ada URL 自身的源码。

在了解了状态机之后，这个源码应该还是可以看明白的。