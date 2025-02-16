我们从 0 到 1 实现了和 [vue playground](https://play.vuejs.org/) 功能一样的项目：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f6d276902e2434e9f715d4380f7f54e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2782&h=1364&s=919630&e=gif&f=63&b=fdfdfd)

整体测试一下 react playground 的功能：

我们用 create-vite 创建的项目，进入项目，把开发服务跑起来：

```
npm run dev
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71d44af4619f4e8faba7b26367b411b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=990&h=512&s=62848&e=png&b=191919)

浏览器访问下：

我们可以在左侧编辑器写组件和样式，然后在右边实时预览：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55e1b2011f4b436881e2d641fcd4621a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2840&h=1356&s=928235&e=gif&f=69&b=fdfdfd)

css 和 ts 代码都有提示：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7f038ad53c745deadfa18ac2f19100c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1264&h=964&s=182109&e=png&b=fdfdfc)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d72ea10b45604a19bfd3428279b457a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=686&s=143117&e=png&b=fafafa)

并且我们后面引入的 npm 包也会有类型提示：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93d9b8102fe5436e916a6ad5a9c189cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1112&h=702&s=115448&e=png&b=fcfcfb)

但额外引入的 npm 包不能直接用：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da19a5272a5b4d4780debf418225c12b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2832&h=1378&s=236393&e=png&b=ffffff)

需要在 import-map.json 里配置下才行：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3ac6b4a440d4e3bb39e055ac3637ce1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2630&h=1166&s=178337&e=png&b=fffefe)

文件可以新增、删除、修改：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d239832d560a4a9e92c589ce3178d296~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2840&h=1356&s=619432&e=gif&f=70&b=fdfdfd)

比如我们新增一个 Aaa.tsx 组件

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72babc98d417498ba89e42ccd4a97b40~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=606&s=77490&e=png&b=fefefd)

还有它的样式 Aaa.css

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c272d4fb92214a6ea35bd1bde7dff3d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1154&h=526&s=69102&e=png&b=fefefd)

在 App.tsx 里引入后就可以使用：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca1b162f854e4b608b3c9c5c4461a6f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2642&h=1198&s=255120&e=png&b=fffefe)

你可以直接打开[这个 url](http://localhost:5173/#eNqNVV9v2zYQ/yqcgsI2ZsmyEreZlgTtugHrwzage9jDtAdapCQ2FCmQlGPX8HffkdQ/O97QKLapu9/9P94dgxozERm9D9JjIHBNg3QkLQOORdni0lLNoaE6V6wxQN9h3loiqxupDPpMcW5QoWSNZsqeZ5mYsn7+47cpNySyXuWcUWGBA/RD03SoaAVnx+rFoxwkDf0spZkTmbc1yEYlNb9wao8/HT6R+UwBd7b4bhEpKghV80wg+HuweldPmVhkIjgtA3i9CLinfHO8R9Rq+qcBh5b2hE7XY/dxRLnWI41LgnXV4f1LSPXsxzELGI9ZwNhyMlG0IjdMCpuj+QIdbWS5FNqgv3PZCrNEmpqP9vQPehycm8cQMkL2o6hplUB9SiAb9tcmB2Obm+6tWj/9SjmX6C+pODl6/yJMyPz29naJkiRZnB5WgBokCNuhnGOtf4dcPs5yrMhs4AJ/2xoDfkvxkbP8+fEI3j8+Dd7O5859R3Mn9D1aL05P/sw0OroT2PR6RrsrMNy9PfgAINaTzRXduzwSWuCWu64a6w6luKi7pZzV3RP6gqe2p3y+CylMWOCa8UOKPglDFWT9oA2tw5Yt0YcdFQxIkL8dNSzHQFIMcwBhoUNNFSuglgiFL3T7zECV1adr0F8xUaYICwNwhjUlHlfLr6HU+1fAUuGDzjGnDua4L5SVlUnRXRw7ImeChlVHXEcbR8wllypFqtzOk80G9Z8Vun/3ZuEQhu5N6C+PsyQbw2r2lXJasi3jzBxGmAZ6iMmXVlsTcfzGsbY4fy4V1IyEnbmb5M4+owehziu4tCk4Ce4hgtXzGIg+CFNRzXSKhBQ2QlfTm7EMNd6HL4yYCqwm93Gzd8IN9KhzOVG0dpQaq5KJFMUIt0aOfkOKSyDnMDWo6vVvJTl49YTphmOocMGpV10z0Ru8TXp7ljjkN4531blN7xPHOQ0ZNAhEc26vWk96ymYSdEdJ5/lF8daDk/4qOcEh3jh6S2tA9cJnXcpEBZU0k/Q6U+sptm+dTdc6eau0rVsjWefx1aqusX08VypoGFDb7JGWnBFkFLR8g6GTvG2PCBUmrIVc3HdJdDBm51raQ5x6CCrZ6POw00ruqPLBT7Hgytu7t3lh79YUXsCS0Mvz13DHNNty6rXI1thMw6UBv22PTG6mBdsr4G30qt/XlDCM5o2iBVXaM8/buZvNk7Ex3LubZH27uXvnIr+a0sIFgZCzBYhJua/jf7BPLwL/dsr5LRLWuIm+aCkm0+6Sczb1Oko/9pzRrBPRWZD2bmSB23GWkgWVMY1OVyuq60hXK8d5v76PkijOAsj9RGCy8v9b1oJeyw9L8qrghHueCFhsl2u+o3zzmvcb2O3viy2Msd3CZ6vVbUJGHrMAY5wFT/DdL6mrawlAg58Xa6mj/M9augHtfUkmF3vTj6eh6baAf9VxMNjh5pVuugan0796w1lP) 试试

这个通过 url 分享代码也是 playgrond 的功能。

点击右上角的分享按钮可以复制分享链接：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cef550b88cd64d52b373a7876a86e4b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2840&h=1356&s=264451&e=gif&f=22&b=fdfdfd)

此外，还可以下载代码到本地：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a81a1ce7b90a4cf4ac638c240f22eb9c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2840&h=1356&s=3769565&e=gif&f=70&b=fdfdfd)

还有切换亮色、暗色主题：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d67d379551a04728b3cf7de3c8e10107~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2840&h=1356&s=643387&e=gif&f=33&b=fdfdfd)

这些就是 React Playground 的全部功能。

最终实现的效果还不错。

回顾下我们的开发过程：

我们首先写了下布局：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d5c8a87949345848d0bd5af2f771a8a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2108&h=1306&s=165328&e=gif&f=27&b=fefefe)

用 [allotment](https://www.npmjs.com/package/allotment) 实现的 split-pane，两边可以通过拖动改变大小。

然后集成 @monaco-editor/react 实现的编辑器。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d54980cb577f436d8e4d15e48a4fb539~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1626&h=798&s=75944&e=png&b=fffffe)

还用 @typescript/ata 包实现了代码改变时自动下载 dts 类型包的功能。

这样，在编辑器里写代码就有 ts 类型提示了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96d008524701479fbf6eb1bdd213af2b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1960&h=532&s=490136&e=png&b=fbfbfb)

然后我们实现了多文件的切换：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6b606b0784f4a61993497a121650c3b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2210&h=1098&s=514149&e=gif&f=32&b=fdfdfd)

在 Context 中保存全局数据，比如 files、selectedFileName，还有对应的增删改的方法。

对 Context.Provider 封装了一层来注入初始化数据和方法，提供了 initFiles 的信息。

然后在 FileNameList 里读取 context 里的 files 来渲染文件列表。

点击 tab 的时候切换 selectedFileName，从而切换编辑器的内容。

然后实现了编译以及在 iframe 里预览。

使用 @babel/standalone 做的 tsx 代码的编译，编译过程中需要对 .tsx、.css、.json 等模块的 import 做处理，变成 blob url 的方式。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51233e2e566e452984d5bc618307bf51~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2782&h=690&s=249318&e=png&b=fffffe)

通过 babel 插件实现了对 import 语句的修改：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad6d09400c264a4da97634d177a3cae9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1674&h=1422&s=303099&e=png&b=1f1f1f)

css 模块包一层代码加到 head 的 style 标签里，json 包一层代码直接 export，而 tsx 模块直接 babel 编译即可。

对于 react、react-dom/client 这种，用浏览器的 import maps 来引入。

然后通过 iframe 实现了预览：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2e0cb9853964d4e9c9844c273f8fb43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1260&h=1490&s=324643&e=png&b=1f1f1f)

替换 html 模版里 import maps 和 src 部分的 script 标签后，同样用 blob url 设置为 iframe 的 src 就可以了。

这样就可以预览了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0db0b3acda04ebba949c3c30cc62e22~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1482&h=1190&s=251029&e=png&b=fefdfd)
iframe 的代码如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1f2fe71111c4632a935a8b6b45186e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1478&h=1090&s=273922&e=png&b=f8f8f8)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0db0b3acda04ebba949c3c30cc62e22~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1482&h=1190&s=251029&e=png&b=fefdfd)

正是替换了 importmap 和 src 部分的 html，并且 css 也被添加到了 head 里的 style 标签下。

然后我们实现了文件的新增、删除、修改：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbb5ad3cc79f488ea87abb2a2c51234c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2098&h=1272&s=365503&e=gif&f=39&b=fefefe)

main.tsx、App.tsx、import-map.json 设置为 readonly，不可编辑和删除。

之后实现了错误的显示，在 iframe 里监听 error 事件，发生错误的时候通过 postMessage 传递给父窗口。

父窗口里监听 message 事件传过来的错误，用 Message 组件显示。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddab8bd9d9c94d8993008b7ff3648bc8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1736&h=1046&s=1817146&e=gif&f=51&b=fdfcfc)

然后实现了主题切换：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ad369f4498e4a8ca831b3ee887d70d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2868&h=1314&s=537354&e=gif&f=43&b=fefefe)

主题切换就是在根元素加一个 .light、.dark 的 className，里面声明 css 变量，因为 css 变量可以在子元素里生效，子元素写样式基于这些变量，那切换了 className 也就切换了这些变量的值，从而实现主题切换。

之后实现了通过链接分享代码的功能：

原理就是把 files 信息 JSON.stringify 之后保存到 location.hash。

然后初始化的时候从 location.hash 读取出来 JSON.parse 之后设置到 files。

这个过程中还要做下压缩，用 fflate 这个包来对字符串进行压缩，然后用 btoa 转为 asc 码字符串。

代码下载则是基于 jszip 和 file saver 包实现的。

这样，playground 里写的代码内容就可以通过 url 分享出去，并且可以下载了。

之后做了下性能优化：

用 Performance 分析了页面的 Event Loop，发现有 long task，性能优化的目标就是消除 long task。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bdcbbcbc73043488d91efb5641b9379~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2604&h=828&s=294387&e=png&b=f7f1ed)

分析发现是 babel 编译的逻辑导致的。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c142b810445436f8cc9d542a9ce3edf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1796&h=1034&s=172285&e=png&b=e6ebcd)

我们通过 Web Worker 把 babel 编译的逻辑放到了 worker 线程跑，通过 message 事件和 postMessage 和主线程通信。

拆分后功能正常，再用 Performance 分析，发现耗时逻辑被转移到了 worker 线程，主线程这个 long task 没有了。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e4cb528a96048ccb57e311670deebfa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2066&h=1106&s=301171&e=png&b=f5efe9)

这就是我们开发这个 playground 的全过程。

其实这个项目完全可以写到简历里，而且非常好讲故事，比如你开发的组件库，用这个 playground 来实现组件的在线预览。

而且这个项目有挺多技术亮点的：

- 用 @monaco-editor/react 实现了网页版 typescript 编辑器，并且实现了自动类型导入
- 通过 @babel/standalone 实现了文件编译，并且写了一个 babel 插件实现了 import 的 source 的修改
- 通过 blob url 来内联引入其他模块的代码，通过 import maps 来引入 react、react-dom 等第三方包的代码
- 通过 iframe 实现了预览功能，并且通过 postMessage 和父窗口通信来显示代码运行时的错误
- 基于 css 变量 + context 实现了主题切换功能
- 通过 fflate + btoa 实现了文件内容的编码、解码，可以通过链接分享代码
- 通过 Performance 分析性能问题，并通过 Web Worker 拆分编译逻辑到 worker 线程来进行性能优化，消除了 long lask

而且这些技术点也挺有价值的，通过 playground 项目对这些技术点有很好的掌握之后，在别的地方也能用到。

总之，大家可以把这个项目消化吸收，内化成你自己的东西。