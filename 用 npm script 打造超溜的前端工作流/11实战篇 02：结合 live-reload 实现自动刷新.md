# 4.2 使用 livereload 实现自动刷新

前端工程师日常开发最频繁（实际上最浪费时间）的操作是什么？可能你已经想到了，就是刷新页面，要让变更生效，需要重新加载，刷新页面的操作就变成了重复低效的操作。

于是社区里出现了 [LiveReload](https://www.npmjs.com/package/livereload) 来把这个过程自动化，react 种子项目生成工具 [create-react-app](https://github.com/facebookincubator/create-react-app) 中就使用了这种技术。

但随着技术的演化，在单页应用中刷新页面意味着客户端状态的全部丢失，特别是复杂的单页应用刷新意味着更大量的重复工作才能回到刷新前的状态，于是社区又捣鼓出了 [Hot Module Replacement，简称为 HMR](https://webpack.js.org/concepts/hot-module-replacement/)，比如使用 [vue-cli](https://github.com/vuejs/vue-cli) 创建的 [webpack](https://github.com/vuejs-templates/webpack) 种子项目中就包含这种特性，[react-native](https://facebook.github.io/react-native/blog/2016/03/24/introducing-hot-reloading.html) 也内置了这种特性，来帮助开发者提高效率。

读到这里，你可能会嘀咕，看起来 LiveReload 并不是最新的技术，还讨论它干啥，实际上它是自动刷新技术的鼻祖，后续的 HMR、HR 等都是它的改良版，动手配置下自动刷新，也能让你对这些技术的基本原理略知一二。

下面介绍如何在经典的前端项目中（引用了 css、js 的 html 页面）接入 LiveReload 的详细步骤：

### 1. 安装项目依赖

使用如下命令安装 [livereload](https://www.npmjs.com/package/livereload) 和 [http-server](https://www.npmjs.com/package/http-server) 到项目依赖中：

```shell
npm i livereload http-server -D
# npm install livereload http-server --save-dev
# yarn add livereload http-server -D
```

### 2. 添加 npm script

按如下提示添加命令，方便我们启动 LiveReload 服务器和通过 HTTP 的方式访问页面：

```patch
-    "cover:open": "scripty"
+    "cover:open": "scripty",
+    "client": "npm-run-all --parallel client:*",
+    "client:reload-server": "livereload client/",
+    "client:static-server": "http-server client/"
```

其中 client 命令能同时启动 livereload 服务、静态文件服务。

> **TIP#16**：可能有同学会问，为什么需要启动两个服务，其中 http-server 启动的是静态文件服务器，该服务启动后可以通过 http 的方式访问文件系统上的文件，而 livereload 是启动了自动刷新服务，该服务负责监听文件系统变化，并在文件系统变化时通知所有连接的客户端，在 `client/index.html` 中嵌入的那段 js 实际上是和 livereload-server 连接的一个 livereload-client。

### 3. 在页面中嵌入 livereload 脚本

修改 client/index.html 嵌入 livereload 脚本（能够连接我们的 livereload 服务），diff 如下：

```patch
 <body>
   <h2>LiveReload Demo</h2>
+  <script>
+    document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
+      ':35729/livereload.js?snipver=1"></' + 'script>')
+  </script>
 </body>
```

> **TIP#17**：livereload 是支持在启动时自定义端口的，如果你使用了自定义端口，在页面中嵌入的这段 js 里面的 `35729` 也需要替换成对应的端口。

### 4. 启动服务并测试

最后，运行 npm run client 之后，截图如下，注意两个红框里面的输出表示服务启动成功：

![](https://user-gold-cdn.xitu.io/2017/12/14/1605294cbbf843bc?w=1066&h=503&f=png&s=111997)

然后，打开浏览器访问：http://localhost:8080，接着修改 client/main.css 并保存（**别忘了保存**），你会发现浏览器自动刷新了。如果没有刷新，欢迎留言交流。

> **TIP#18**：有代码洁癖的同学可能会问，在页面中嵌入的那段 js 在线上环境咋办？实际上在嵌入这段脚本的时候可以通过简单的手段（比如判断 location.hostname）去检查当前页面运行环境，如果是线上环境就不嵌入了，或者使用打包工具处理 html 文件，上线前直接去掉即可。

----------------------------
> 本节用到的代码见 [GitHub](https://github.com/wangshijun/automated-workflow-with-npm-script/tree/10-livereload-with-npm-script)，想边看边动手练习的同学可以拉下来自己改，注意切换到正确的分支 `10-livereload-with-npm-script`。

----------------------------
