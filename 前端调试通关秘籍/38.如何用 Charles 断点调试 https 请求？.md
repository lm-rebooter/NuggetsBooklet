现在的网站基本都是 https 的，而 charles 是常用的 http 抓包工具，所以用 charles 调试 https 请求是常见的需求。

这节就来讲下如何用 charles 调试 https 请求，如何断点调试。

首先安装 charles，点击 start recording：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f68c65ee29e44ea993e1fa33e30b8300~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问一些页面，这时候左侧就会展示出抓到的 http/https 请求：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71c849035a1a4787a37f6232158a18cb~tplv-k3u1fbpfcp-watermark.image?)

但是这时候抓到的是加密过后的内容，这是 https 的机制导致的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebf3971c6c6f4c4498b96443aa950c53~tplv-k3u1fbpfcp-watermark.image?)

服务端会下发被 CA 认证过的证书，里面包含了公钥，而服务器自己保留私钥，通过这种机制完成对称密钥的传输和身份的认证，之后加密传输数据。

中间人拿到的数据自然都是被加密过的，也就是上图的那些乱码：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/717ba624949c4e0db3fec7a368b6f4e0~tplv-k3u1fbpfcp-watermark.image?)

那抓包工具怎么能拿到明文的数据呢？

自己用服务端的证书和服务端对接不就行了？

也就是这样：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51e6cd7de71449c5a6736b5d7eec6390~tplv-k3u1fbpfcp-watermark.image?)

Charles 自己用服务端的证书来和服务端通信，然后给浏览器一个自己的证书，这样就能解密传输的内容，拿到明文数据了。

点击 Proxy 的 SSL Proxy Setting：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a248f6d3ae048f697097f8cd9577f1b~tplv-k3u1fbpfcp-watermark.image?)

添加一条对 juejin 的 https 代理：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfe5185659cd4562a298dd3135fa69d8~tplv-k3u1fbpfcp-watermark.image?)

这是 juejin 之前的证书：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9755844ac52d4a98ba04556b3b833097~tplv-k3u1fbpfcp-watermark.image?)

代理之后就换成了 Charles 的证书，但是会提示不安全：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3fb9a6f7c784599bf7856519ca97099~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07d62e3a79ff4f9b99cbdeb8b038a20e~tplv-k3u1fbpfcp-watermark.image?)

这是因为系统有一个存放所有根证书的地方，要那里存在并且被信任的证书才是安全的。

点击 help > SSL Proxying > Install Charles Root Certificate，安装到系统的钥匙串中：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a13e9f4c716d46e1ad6b5a9a4e9ee7f8~tplv-k3u1fbpfcp-watermark.image?)

改为始终信任：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d64bbf9433d4514811562185eaa8286~tplv-k3u1fbpfcp-watermark.image?)

这时候浏览器里就会标记安全了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b3a2d75814f4154911212487bc92b73~tplv-k3u1fbpfcp-watermark.image?)

并且在 charles 里就会看到明文的 https 请求和响应内容：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fe4bf55d22040dfbfd2bb47a2f6be6a~tplv-k3u1fbpfcp-watermark.image?)

这个过程的原理就是这张图：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ad8cf4874b64e26b848a18c69bfb8b8~tplv-k3u1fbpfcp-watermark.image?)

现在能够抓 https 包了，但是还不够，现在只能看，很多情况下我们是希望能修改一下请求和响应内容的，这时候就要用断点功能了：

右键请求，勾选 breakpoints：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a58c9cb35b8743a7b9e32710d275a72f~tplv-k3u1fbpfcp-watermark.image?)

然后开启断点：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4398eaed3ca140b6bfa1faeb3df5252d~tplv-k3u1fbpfcp-watermark.image?)

刷新页面你会发现它断住了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49ab3977f671478cb8161d9b3a902c4b~tplv-k3u1fbpfcp-watermark.image?)

下面三个按钮分别是取消、终止、执行修改后的请求的意思。

上面可以改 url，添加 header，还可以改请求内容和 cookie：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c379e33651fc4aa79f5c45f39105644e~tplv-k3u1fbpfcp-watermark.image?)

点击 execute 之后就会发送请求。

之后响应的时候还会断住，这时候就可以用同样的方式修改响应了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82f7f757e7634ad7b59dd653a61b7f6c~tplv-k3u1fbpfcp-watermark.image?)

比如我把 title 修改了一下，点击 execute 之后，看到的网页就是修改过后的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1db9a1b4663e4ad09a9331bb17858787~tplv-k3u1fbpfcp-watermark.image?)

这样我们就可以断点调试 https 请求了。

为什么可以实现断点功能呢？

这个很容易想明白，怎么请求、怎么响应都是 Charles 控制的，那想实现一个断点和编辑的功能，岂不是很容易么？

有的同学可能会问，移动端怎么调试呢？

其实是一样的，只不过移动端也要把 Charles 证书安装到自己的系统中，需要点击安装 charles 证书到移动设备：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da733c16572e45cf9118f07f28a3ab11~tplv-k3u1fbpfcp-watermark.image?)

他会提示你在手机设置代理服务器，然后下载 Charles 证书：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebcf7e96073c427e8851bea4e5da3d23~tplv-k3u1fbpfcp-watermark.image?)

原理和我们在 PC 端下载 Charles 证书是一样的，后续流程也一样。

除此以外，chrome 还有一个浏览器插件可以更细粒度的控制代理，叫做 SwitchyOmega：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77f7202fae95419199bab9d5d62e9c06~tplv-k3u1fbpfcp-watermark.image?)

你可以配置若干个代理服务器，比如 charles 的代理服务器：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06e364ee8a324ce9a041e54a3ccbe695~tplv-k3u1fbpfcp-watermark.image?)

这个可以在 Charles 的 Proxy > Proxy Setting 里配置：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fba1b954d3d490a89defa2da91e66f9~tplv-k3u1fbpfcp-watermark.image?)

然后就可以配置什么 url 用什么代理，或者不用代理直接连接：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cc24041b84f44b08ddcc7a5943c414b~tplv-k3u1fbpfcp-watermark.image?)

当你有多个代理服务器，或者想控制有的页面走代理有的不走的时候，就可以用这个插件来控制了。

要让你配置的规则生效，这里要选择 auto switch，也就是根据规则自动切换：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71ee8842fd6b468db22ac32ea38d57ca~tplv-k3u1fbpfcp-watermark.image?)

这几个选项的意思分别是：

- 直接连接：不走代理
- 系统代理：用系统级别的代理配置
- proxy：这个是我们配置的那个代理服务器，可以指定网页走这个代理
- auto switch：根据规则自动切换代理

也可以为这个 url 单独设置代理方式：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a55fe7a042447d196e2160e322ed80c~tplv-k3u1fbpfcp-watermark.image?)

## 总结

用 Charles 调试 https 请求是常见的需求，它需要安装 Charles 的证书到本地系统，然后信任，之后就可以抓到明文数据了。

原理就是 Charles 会使用服务器的证书来和服务器通信，然后发一个自己的证书给浏览器。

Charles 还有断点调试功能，可以修改请求和响应的数据。

移动端 https 调试也是同样的原理，只不过需要配置下代理和证书。

如果想切换代理服务器或者设置有的页面不走代理，可以用 Chrome 插件 SwitchyOmega 来控制。

会断点调试 https 请求还是很有意义的，比如改改 header、改改 body，看看会有啥效果，使用场景有很多。

