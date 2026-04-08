基本所有网站都有登录功能，登录之后再次请求依然是登录状态。

但 http 是无状态的，也就是说上一次请求和下一次请求之间没有任何关联。

那如何实现的这种登录状态的保存呢？

这个问题的解决有两种方案：

*   服务端存储的 session + cookie 的方案
*   客户端存储的 jwt token 的方案

但这两种方式也都有各自的缺点。

## 服务端存储的 session + cookie

给 http 添加状态，那就给每个请求打上个标记，然后在服务端存储这个标记对应的数据。这样每个被标记的请求都可以找到对应的数据，自然可以做到登录、权限等状态的存储。

这个标记应该是自动带上的，所以 http 设计了 cookie 的机制，在里面存储的数据是每次请求都会带上的。

然后根据 cookie 里的标记去查找的服务端对应的数据叫做 session，这个标记就是 session 的 id。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a447e0090f047c5ba6d5ed4df8d3207~tplv-k3u1fbpfcp-watermark.image?)

如图，因为请求自动带上 cookie，那两次请求就都可以找到 id 为 1 对应的 session，自然就知道当前登录的用户是谁，也可以存储其他的状态数据。

这就是 session + cookie 的给 http 添加状态的方案。

大家觉得这种方案有问题么？

有问题，而且问题还挺多的。

最大的一个问题就是臭名昭著的 CSRF（跨站请求伪造）：

### CSRF

因为 cookie 会在请求时自动带上，那你在一个网站登录了，再访问别的网站，万一里面有个按钮会请求之前那个网站的，那 cookie 依然能带上。而这时候就不用再登录了。

这样万一点了这个按钮之后做了一些危险的操作呢？

是不是就很危险。

而且一般这种利用 CSRF 漏洞的网站都会伪装的很好，让你很难看出破绽来，这种网站叫做钓鱼网站。

为了解决这个问题，我们一般会验证 referer，就是请求是哪个网站发起的，如果发起请求的网站不对，那就阻止掉。

但这样依然不能完全解决问题，万一你用的浏览器也是有问题的，能伪造 referer 呢？

所以一般会用随机值来解决，每次随机生成一个值返回，后面再发起的请求需要包含这个值才行，否则就认为是非法的。

这个随机值叫做 token，可以放在参数中，也可以放在 header 中，因为钓鱼网站拿不到这个随机值，就算带了 cookie 也没发通过服务端的验证。

这是 session + cookie 这种方案的一个缺点，但是是有解决方案的。

它还有别的缺点，比如分布式的时候：

### 分布式 session

session 是把状态数据保存在服务端，那么问题来了，如果有多台服务器呢？

当并发量上去了，单台服务器根本承受不了，自然需要做集群，也就需要多台服务器来提供服务。

而且现在后端还会把不同的功能拆分到不同的服务中，也就是微服务架构，自然也需要多台服务器。

那不同服务器之间的 session 怎么同步？

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84a780b5c8ba496b8c72bd60c7d7e1cc~tplv-k3u1fbpfcp-watermark.image?)

登录之后 session 是保存在某一台服务器的，之后可能会访问到别的服务器，这时候那台服务器是没有对应的 session 的，就没法完成对应的功能。

这个问题的解决有两种方案：

一种是 session 复制，也就是通过一种机制在各台机器自动复制 session，并且每次修改都同步下。这个有对应的框架来做，比如 java 的 spring-session。

各台服务器都做了 session 复制了，那你访问任何一台都能找到对应的 session。

还有一种方案是把 session 保存在 redis，这样每台服务器都去那里查，只要一台服务器登录了，其他的服务器也就能查到 session，这样就不需要复制了。

分布式会话的场景，redis + session 的方案更常用一点。

还好，session 在分布式时的这个问题也算是有解决方案的。

但你你以为这就完了么？session + cookie 还有跨域的问题：

### 跨域

cookie 为了安全，是做了 domain 的限制的，设置 cookie 的时候会指定一个 domain，只有这个 domain 的请求才会带上这个 cookie。

而且还可以设置过期时间、路径等：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d04f84f204e64ae48e94579b1e21a19f~tplv-k3u1fbpfcp-watermark.image?)

那万一是不同 domain 的请求呢？也就是跨域的时候，怎么带 cookie 呢？

a.xxx.com 和 b.xxx.com 这种还好，只要把 domain 设置为顶级域名 xxx.com 就可以了，那二三级域名不同也能自动带上。

但如果顶级域名也不同就没办法了，这种只能在服务端做下中转，把这俩个域名统一成同一个。

上面说的不是 ajax 请求，ajax 请求有额外的机制：

ajax 请求跨域的时候是不会挟带 cookie 的，除非手动设置 withCredentials 为 true 才可以。

而且也要求后端代码设置了对应的 header：

    Access-Control-Allow-Origin: "当前域名";
    Access-Control-Allow-Credentials: true

这里的 allow origin 设置 \* 都不行，必须指定具体的域名才能接收跨域 cookie。

这是 session + cookie 方式的第三个坑，好在也是有解决方案的。

我们做下小结：

**session + cookie 的给 http 添加状态的方案是服务端保存 session 数据，然后把 id 放入 cookie 返回，cookie 是自动携带的，每个请求可以通过 cookie 里的 id 查找到对应的 session，从而实现请求的标识。这种方案能实现需求，但是有 CSRF、分布式 session、跨域等问题，不过都是有解决方案的。**

session + cookie 的方案确实不太完美，我们再来看另一种方式怎么样：

## 客户端存储的 token

session + cookie 的方案是把状态数据保存在服务端，再把 id 保存在 cookie 里来实现的。

既然这样的方案有那么多的问题，那我反其道而行之，不把状态保存在服务端了，直接全部放在请求里，也不放在 cookie 里了，而是放在 header 里，这样是不是就能解决那一堆问题了呢？

token 的方案常用 json 格式来保存，叫做 json web token，简称 JWT。

JWT 是保存在 request header 里的一段字符串（比如用 header 名可以叫 authorization），它分为三部分：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fc3b58e61d34f4a9096c55aad5bd8c7~tplv-k3u1fbpfcp-watermark.image?)

如图 JWT 是由 header、payload、verify signature 三部分组成的：

header 部分保存当前的加密算法，payload 部分是具体存储的数据，verify signature 部分是把 header 和 payload 还有 salt 做一次加密之后生成的。（salt，盐，就是一段任意的字符串，增加随机性）

这三部分会分别做 Base64，然后连在一起就是 JWT 的 header，放到某个 header 比如 authorization 中：

    authorization: Bearer xxxxx.xxxxx.xxxx

请求的时候把这个 header 带上，服务端就可以解析出对应的 header、payload、verify signature 这三部分，然后根据 header 里的算法也对 header、payload 加上 salt 做一次加密，如果得出的结果和 verify signature 一样，就接受这个 token。

把状态数据都保存在 payload 部分，这样就实现了有状态的 http:

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b161071501442dfa83e639dac13a89b~tplv-k3u1fbpfcp-watermark.image?)

而且这种方式是没有 session + cookie 那些问题的，不信我们分别来看一下：

**CSRF**：因为不是通过自动带的 cookie 来关联服务端的 session 保存的状态，所以没有 CSRF 问题。

**分布式 session**： 因为状态不是保存在服务端，所以无论访问哪台服务器都行，只要能从 token 里解析出状态数据就行。

**跨域**：因为不是 cookie 那一套，自然也没有跨域的限制，只要手动带上 JWT 的 header 就行。

看起来这种方式好像很完美？

其实也不是，JWT 有 JWT 的问题：

### 安全性

因为 JWT 把数据直接 Base64 之后就放在了 header 里，那别人就可以轻易从中拿到状态数据，比如用户名等敏感信息，也能根据这个 JWT 去伪造请求。

所以 JWT 要搭配 https 来用，让别人拿不到 header。

### 性能

JWT 把状态数据都保存在了 header 里，每次请求都会带上，比起只保存个 id 的 cookie 来说，请求的内容变多了，性能也会差一些。

所以 JWT 里也不要保存太多数据。

### 没法让 JWT 失效

session 因为是存在服务端的，那我们就可以随时让它失效，而 JWT 不是，因为是保存在客户端，那我们是没法手动让他失效的。

比如踢人、退出登录、改完密码下线这种功能就没法实现。

但也可以配合 redis 来解决，记录下每个 token 对应的生效状态，每次先去 redis 查下 jwt 是否是可用的，这样就可以让 jwt 失效。

所以说，JWT 的方案虽然解决了很多 session + cookie 的问题，但也不完美。

小结下：

**JWT 的方案是把状态数据保存在 header 里，每次请求需要手动携带，没有 session + cookie 方案的 CSRF、分布式、跨域的问题，但是也有安全性、性能、没法控制等问题。**

## 总结

http 是无状态的，也就是请求和请求之间没有关联，但我们很多功能的实现是需要保存状态的。

给 http 添加状态有两种方式：

**session + cookie**：把状态数据保存到服务端，session id 放到 cookie 里返回，这样每次请求会带上 cookie ，通过 id 来查找到对应的 session。这种方案有 CSRF、分布式 session、跨域的问题。

**jwt**：把状态保存在 json 格式的 token 里，放到 header 中，需要手动带上，没有 cookie + session 的那些问题，但是也有安全性、性能、没法手动控制失效的问题。

上面这两种方案都不是完美的，但那些问题也都有解决方案。

常用的方案基本是 session + redis、jwt + redis 这种。

软件领域很多情况下都是这样的，某种方案都解决了一些问题，但也相应的带来了一些新的问题。没有银弹，还是要熟悉它们的特点，根据不同的需求灵活选用。
