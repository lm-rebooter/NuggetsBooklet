上节学会了用 Chrome 远程调试 Android 网页，这节来调试下 iOS 网页。

ios 网页调试只能用 safari 浏览器。

打开偏好设置 > 高级，勾选显示“开发”菜单：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/680d81d5342d4438bdf197815e017fd4~tplv-k3u1fbpfcp-watermark.image?)

之后就会出现“开发”菜单，下面会展示所有连接的设备：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2308dc22c55472fa24dc7815d7c6efb~tplv-k3u1fbpfcp-watermark.image?)

它会提示你在 iPhone 上启用网页检查器。

这个是在 设置 > safari 浏览器 > 高级里开启的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a5dc23b739f4876a244a6414b5025c8~tplv-k3u1fbpfcp-watermark.image?)

网页检查器下面也有这么一行提示：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12fe302f9dae4ff1a48649fba31d60ff~tplv-k3u1fbpfcp-watermark.image?)

之后在 Safari 浏览器里打开一个页面，比如 baidu.com：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0bc41ff738a4cf0939d74e9a67a29e2~tplv-k3u1fbpfcp-watermark.image?)

在电脑的 Safari 浏览器的开发菜单里就会显示出这个网页：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2a49706ec5347d08ea31cacf7ad64b4~tplv-k3u1fbpfcp-watermark.image?)

不只是 Safari 浏览器，一些 APP 里内嵌的网页开启了调试的话也可以连接。

之后就可以在电脑上远程调试 iphone 上的网页了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5f0abd6d6384e488c75acc59ae261fc~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd64fd0e85524a1789577776bf585ff3~tplv-k3u1fbpfcp-watermark.image?)

可以调试网络请求：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae8d89757b6a44c7af251439d0b2a528~tplv-k3u1fbpfcp-watermark.image?)

可以断点调试：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3032a6c7a01e4982a8bea6a6621d7fa2~tplv-k3u1fbpfcp-watermark.image?)

比如可以在所有未捕获的异常处断住，这是异常断点。

可以在请求某个 URL 的时候断住，这是 URL 断点：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4e2fedfd34849519987db89cc950acd~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f636564bdb684f338dba6c719168e7cd~tplv-k3u1fbpfcp-watermark.image?)

可以添加事件断点：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d42dd08935964a1285adbef861b3ccef~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df5aff8a0c864d5a8d9f0fd73225adc0~tplv-k3u1fbpfcp-watermark.image?)

还可以在 requestAnimationFrame、setInterval 的回调处断住。

而且在 Chrome DevTools 里的 DOM 断点，这里也同样支持：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ff9c1ec1f29480ca305ac7d7790e2da~tplv-k3u1fbpfcp-watermark.image?)

也就是元素子树修改、属性修改、节点移除的时候断住。

而且也可以分析网页的图层：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42527bc908624aa688e15bee684106ae~tplv-k3u1fbpfcp-watermark.image?)

基本所有的网页调试功能都支持。

## 总结

调试 iphone 上的网页要用 Safari 浏览器，支持各种断点、支持元素审查、网络请求的调试等等各种功能。

当你需要调试 ios 的网页的时候，不管是 safari 打开的网页，还是 APP 里内嵌的网页，都可以用这种方式来调试。


