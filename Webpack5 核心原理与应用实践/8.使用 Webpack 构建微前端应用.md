> Module Federation 通常译作“**模块联邦**”，是 Webpack 5 新引入的一种远程模块动态加载、运行技术。MF 允许我们将原本单个巨大应用按我们理想的方式拆分成多个体积更小、职责更内聚的小应用形式，理想情况下各个应用能够实现独立部署、独立开发\(不同应用甚至允许使用不同技术栈\)、团队自治，从而降低系统与团队协作的复杂度 —— 没错，这正是所谓的微前端架构。
>
> _An architectural style where independently deliverable frontend applications are composed into a greater whole —— 摘自《__[Micro Frontends](https://martinfowler.com/articles/micro-frontends.html)__》。_

英文社区对 Webpack Module Federation 的响应非常热烈，甚至被誉为“[A game-changer in JavaScript architecture](https://medium.com/swlh/webpack-5-module-federation-a-game-changer-to-javascript-architecture-bcdd30e02669)”，相对而言国内对此热度并不高，这一方面是因为 MF 强依赖于 Webpack5，升级成本有点高；另一方面是国内已经有一些成熟微前端框架，例如 [qiankun](https://qiankun.umijs.org/zh/guide)。不过我个人觉得 MF 有不少实用性强，非常值得学习、使用的特性，包括：

- 应用可按需导出若干模块，这些模块最终会被单独打成模块包，功能上有点像 NPM 模块；
- 应用可在运行时基于 HTTP\(S\) 协议动态加载其它应用暴露的模块，且用法与动态加载普通 NPM 模块一样简单；
- 与其它微前端方案不同，MF 的应用之间关系平等，没有主应用/子应用之分，每个应用都能导出/导入任意模块；
- 等等。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbb78e89b39941818ab0c323d4873c1f~tplv-k3u1fbpfcp-watermark.image?)

> 图片摘自：《[Webpack 5 之 模块联合（Module Federation）](https://www.lumin.tech/articles/webpack-module-federation/#%E5%85%B1%E4%BA%AB%E6%A8%A1%E5%9D%97)》


## 简单示例

Module Federation 的基本逻辑是一端导出模块，另一端导入、使用模块，实现上两端都依赖于 Webpack 5 内置的 `ModuleFederationPlugin` 插件：

1.  对于模块生成方，需要使用 `ModuleFederationPlugin` 插件的 `expose` 参数声明需要导出的模块列表；
2.  对于模块使用方，需要使用 `ModuleFederationPlugin` 插件的 `remotes` 参数声明需要从哪些地方导入远程模块。

接下来，我们按这个流程一步步搭建一个简单的 Webpack Module Federation 示例，相关代码已上传到 [小册仓库](https://github1s.com/Tecvan-fe/webpack-book-samples/blob/HEAD/MF-basic)。首先介绍一下示例文件结构：

```
MF-basic
├─ app-1
│  ├─ dist
│  │  ├─ ...
│  ├─ package.json
│  ├─ src
│  │  ├─ main.js
│  │  ├─ foo.js
│  │  └─ utils.js
│  └─ webpack.config.js
├─ app-2
│  ├─ dist
│  │  ├─ ...
│  ├─ package.json
│  ├─ src
│  │  ├─ bootstrap.js
│  │  └─ main.js
│  ├─ webpack.config.js
├─ lerna.json
└─ package.json
```

> 提示：为简化依赖管理，示例引入 [lerna](https://github.com/lerna/lerna) 实现 Monorepo 策略，不过这与文章主题无关，这里不做过多介绍。

其中，`app-1`、`app-2` 是两个独立应用，分别有一套独立的 Webpack 构建配置，类似于微前端场景下的“微应用”概念。在本示例中，`app-1` 负责导出模块 —— 类似于子应用；`app-2` 负责使用这些模块 —— 类似于主应用。

我们先看看模块导出方 —— 也就是 `app-1` 的构建配置：

```js
const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "development",
  devtool: false,
  entry: path.resolve(__dirname, "./src/main.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    // 必须指定产物的完整路径，否则使用方无法正确加载产物资源
    publicPath: `http://localhost:8081/dist/`,
  },
  plugins: [
    new ModuleFederationPlugin({
      // MF 应用名称
      name: "app1",
      // MF 模块入口，可以理解为该应用的资源清单
      filename: `remoteEntry.js`,
      // 定义应用导出哪些模块
      exposes: {
        "./utils": "./src/utils",
        "./foo": "./src/foo",
      },
    }),
  ],
  // MF 应用资源提供方必须以 http(s) 形式提供服务
  // 所以这里需要使用 devServer 提供 http(s) server 能力
  devServer: {
    port: 8081,
    hot: true,
  },
};
```

> 提示：Module Federation 依赖于 Webpack5 内置的 [ModuleFederationPlugin](https://webpack.js.org/plugins/module-federation-plugin/) 实现模块导入导出功能。

作用模块导出方，`app-1` 的配置逻辑可以总结为：

1.  需要使用 `ModuleFederationPlugin` 的 `exposes` 项声明哪些模块需要被导出；使用 `filename` 项定义入口文件名称；
2.  需要使用 `devServer` 启动开发服务器能力。

使用 `ModuleFederationPlugin` 插件后，Webpack 会将 `exposes` 声明的模块分别编译为独立产物，并将产物清单、MF 运行时等代码打包进 `filename` 定义的**应用入口文件**\(Remote Entry File\)中。例如 `app-1` 经过 Webpack 编译后，将生成如下产物：

```
MF-basic
├─ app-1
│  ├─ dist
│  │  ├─ main.js
│  │  ├─ remoteEntry.js
│  │  ├─ src_foo_js.js
│  │  └─ src_utils_js.js
│  ├─ src
│  │  ├─ ...
```

- `main.js` 为整个应用的编译结果，此处可忽略；
- `src_utils_js.js` 与 `src_foo_js.js` 分别为 `exposes` 声明的模块的编译产物；
- `remoteEntry.js` 是 `ModuleFederationPlugin` 插件生成的应用入口文件，包含模块清单、MF 运行时代码。

接下来继续看看模块导入方 —— 也就是 `app-2` 的配置方法：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "development",
  devtool: false,
  entry: path.resolve(__dirname, "./src/main.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
  },
  plugins: [
    // 模块使用方也依然使用 ModuleFederationPlugin 插件搭建 MF 环境
    new ModuleFederationPlugin({
      // 使用 remotes 属性声明远程模块列表
      remotes: {
        // 地址需要指向导出方生成的应用入口文件
        RemoteApp: "app1@http://localhost:8081/dist/remoteEntry.js",
      },
    }),
    new HtmlWebpackPlugin(),
  ],
  devServer: {
    port: 8082,
    hot: true,
    open: true,
  },
};
```

作用远程模块使用方，`app-2` 需要使用 `ModuleFederationPlugin` 声明远程模块的 HTTP\(S\) 地址与模块名称\(示例中的 `RemoteApp`\)，之后在 `app-2` 中就可以使用模块名称异步导入 `app-1` 暴露出来的模块，例如：

```js
// app-2/src/main.js
(async () => {
  const { sayHello } = await import("RemoteApp/utils");
  sayHello();
})();
```

到这里，简单示例就算是搭建完毕了，之后运行页面，打开开发者工具的 Network 面板，可以看到：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a52bfa6daf0e4c0fb181a6bdfb6698e2~tplv-k3u1fbpfcp-watermark.image?)

其中：

- `remoteEntry.js` 即 `app-1` 构建的应用入口文件；
- `src_utils_js.js` 则是 `import("RemoteApp/utils")` 语句导入的远程模块。

总结一下，MF 中的模块导出/导入方都依赖于 `ModuleFederationPlugin` 插件，其中导出方需要使用插件的 `exposes` 项声明导出哪些模块，使用 `filename` 指定生成的入口文件；导入方需要使用 `remotes` 声明远程模块地址，之后在代码中使用异步导入语法 `import("module")` 引入模块。

这种模块远程加载、运行的能力，搭配适当的 DevOps 手段，已经足以满足微前端的独立部署、独立维护、开发隔离的要求，在此基础上 MF 还提供了一套简单的依赖共享功能，用于解决多应用间基础库管理问题。

## 依赖共享

上例应用相互独立，各自管理、打包基础依赖包，但实际项目中应用之间通常存在一部分公共依赖 —— 例如 Vue、React、Lodash 等，如果简单沿用上例这种分开打包的方式势必会出现依赖被重复打包，造成产物冗余的问题，为此 `ModuleFederationPlugin` 提供了 `shared` 配置用于声明该应用可被共享的依赖模块。

例如，改造上例模块导出方 `app-1` ，添加 `shared` 配置：

```js
module.exports = {
  // ...
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: `remoteEntry.js`,
      exposes: {
        "./utils": "./src/utils",
        "./foo": "./src/foo",
      }, 
      // 可被共享的依赖模块
+     shared: ['lodash']
    }),
  ],
  // ...
};
```

接下来，还需要修改模块导入方 `app-2`，添加相同的 `shared` 配置：

```js
module.exports = {
  // ...
  plugins: [
    // 模块使用方也依然使用 ModuleFederationPlugin 插件搭建 MF 环境
    new ModuleFederationPlugin({
      // 使用 remotes 属性声明远程模块列表
      remotes: {
        // 地址需要指向导出方生成的应用入口文件
        RemoteApp: "app1@http://localhost:8081/dist/remoteEntry.js",
      },
+     shared: ['lodash']
    }),
    new HtmlWebpackPlugin(),
  ],
  // ...
};
```

> 提示：示例代码已上传到 [小册仓库](https://github1s.com/Tecvan-fe/webpack-book-samples/blob/HEAD/MF-shared/package.json)。

之后，运行页面可以看到最终只加载了一次 `lodash` 产物\(下表左图\)，而改动前则需要分别从导入/导出方各加载一次 `lodash`\(下表右图\)：

<table class="ace-table author-6857319138482798593" data-ace-table-col-widths="420;374;"><colgroup><col width="420"><col width="374"></colgroup><tbody><tr><td style="border: 1px solid rgb(222, 224, 227);"><div data-zone-id="xr1pg8wu8g0ewrir42n2ica0a51jelbdvz4xc1flh9irlrrjm7ou2ltge9kh06818lf37z" data-line-index="0" style="white-space: pre;">添加 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">shared</code> 后</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div data-zone-id="xr1pg8wu8g0ewrir42n2ica0a51jelbdvz4xc10py4qfkv81t4cjqoj0beo28toifyek5i" data-line-index="0" style="white-space: pre;">改动前</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div data-zone-id="xr1rn6f9a7urmq4u80eca8d2dgflngo3qzpxc1flh9irlrrjm7ou2ltge9kh06818lf37z" data-line-index="0" style="white-space: pre;"><div class="image-uploaded gallery" data-ace-gallery-json="{&quot;items&quot;:[{&quot;uuid&quot;:&quot;Vc3DuFWnNQqC&quot;,&quot;src&quot;:&quot;https%3A%2F%2Finternal-api-drive-stream.feishu.cn%2Fspace%2Fapi%2Fbox%2Fstream%2Fdownload%2Fall%2FboxcnIYPPV8dsJhoIrxDleiawLg%2F%3Fmount_node_token%3Ddoccn54FoC3PjXKQQFxKzDUJU1f%26mount_point%3Ddoc_image&quot;,&quot;height&quot;:&quot;176&quot;,&quot;width&quot;:&quot;400&quot;,&quot;currHeight&quot;:&quot;176&quot;,&quot;currWidth&quot;:&quot;400&quot;,&quot;natrualHeight&quot;:&quot;452&quot;,&quot;natrualWidth&quot;:&quot;1044&quot;,&quot;file_token&quot;:&quot;boxcnIYPPV8dsJhoIrxDleiawLg&quot;,&quot;image_type&quot;:&quot;image/png&quot;,&quot;size&quot;:92043,&quot;comments&quot;:[],&quot;pluginName&quot;:&quot;imageUpload&quot;,&quot;scale&quot;:2.309734513274336}]}"><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55d6c1597e6743a29067aa5ab64c3544~tplv-k3u1fbpfcp-zoom-1.image" data-src="https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/all/boxcnIYPPV8dsJhoIrxDleiawLg/?mount_node_token=doccn54FoC3PjXKQQFxKzDUJU1f&amp;mount_point=doc_image" data-suite="eyJmaWxlVG9rZW4iOiJib3hjbklZUFBWOGRzSmhvSXJ4RGxlaWF3TGciLCJvYmpUeXBlIjoiZG9jIiwib2JqVG9rZW4iOiJkb2NjbjU0Rm9DM1BqWEtRUUZ4S3pEVUpVMWYiLCJvcmlnaW5TcmMiOiJodHRwczovL2ludGVybmFsLWFwaS1kcml2ZS1zdHJlYW0uZmVpc2h1LmNuL3NwYWNlL2FwaS9ib3gvc3RyZWFtL2Rvd25sb2FkL2FsbC9ib3hjbklZUFBWOGRzSmhvSXJ4RGxlaWF3TGcvP21vdW50X25vZGVfdG9rZW49ZG9jY241NEZvQzNQalhLUVFGeEt6RFVKVTFmJm1vdW50X3BvaW50PWRvY19pbWFnZSJ9" data-height="176" data-width="400"></div></div><div data-zone-id="xr1rn6f9a7urmq4u80eca8d2dgflngo3qzpxc1flh9irlrrjm7ou2ltge9kh06818lf37z" data-line-index="1" style="white-space: pre;"></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div data-zone-id="xr1rn6f9a7urmq4u80eca8d2dgflngo3qzpxc10py4qfkv81t4cjqoj0beo28toifyek5i" data-line-index="0" style="white-space: pre;"><div class="image-uploaded gallery" data-ace-gallery-json="{&quot;items&quot;:[{&quot;uuid&quot;:&quot;9PIT3Ugi0jQZ&quot;,&quot;src&quot;:&quot;https%3A%2F%2Finternal-api-drive-stream.feishu.cn%2Fspace%2Fapi%2Fbox%2Fstream%2Fdownload%2Fall%2Fboxcn2Z6DvqYAcFCW4PJDfGiKhb%2F%3Fmount_node_token%3Ddoccn54FoC3PjXKQQFxKzDUJU1f%26mount_point%3Ddoc_image&quot;,&quot;height&quot;:&quot;171&quot;,&quot;width&quot;:&quot;354&quot;,&quot;currHeight&quot;:&quot;171&quot;,&quot;currWidth&quot;:&quot;354&quot;,&quot;natrualHeight&quot;:&quot;494&quot;,&quot;natrualWidth&quot;:&quot;1040&quot;,&quot;file_token&quot;:&quot;boxcn2Z6DvqYAcFCW4PJDfGiKhb&quot;,&quot;image_type&quot;:&quot;image/png&quot;,&quot;size&quot;:104324,&quot;comments&quot;:[],&quot;pluginName&quot;:&quot;imageUpload&quot;,&quot;scale&quot;:2.1052631578947367}]}"><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d216a327b16d414eaa4f7cba93d16476~tplv-k3u1fbpfcp-zoom-1.image" data-src="https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/all/boxcn2Z6DvqYAcFCW4PJDfGiKhb/?mount_node_token=doccn54FoC3PjXKQQFxKzDUJU1f&amp;mount_point=doc_image" data-suite="eyJmaWxlVG9rZW4iOiJib3hjbjJaNkR2cVlBY0ZDVzRQSkRmR2lLaGIiLCJvYmpUeXBlIjoiZG9jIiwib2JqVG9rZW4iOiJkb2NjbjU0Rm9DM1BqWEtRUUZ4S3pEVUpVMWYiLCJvcmlnaW5TcmMiOiJodHRwczovL2ludGVybmFsLWFwaS1kcml2ZS1zdHJlYW0uZmVpc2h1LmNuL3NwYWNlL2FwaS9ib3gvc3RyZWFtL2Rvd25sb2FkL2FsbC9ib3hjbjJaNkR2cVlBY0ZDVzRQSkRmR2lLaGIvP21vdW50X25vZGVfdG9rZW49ZG9jY241NEZvQzNQalhLUVFGeEt6RFVKVTFmJm1vdW50X3BvaW50PWRvY19pbWFnZSJ9" data-height="171" data-width="354"></div></div><div data-zone-id="xr1rn6f9a7urmq4u80eca8d2dgflngo3qzpxc10py4qfkv81t4cjqoj0beo28toifyek5i" data-line-index="1" style="white-space: pre;"></div></td></tr></tbody></table>

注意，这里要求两个应用使用 **版本号完全相同** 的依赖才能被复用，假设上例应用 `app-1` 用了 `lodash@4.17.0` ，而 `app-2` 用的是 `lodash@4.17.1`，Webpack 还是会同时加载两份 lodash 代码，我们可以通过 `shared.[lib].requiredVersion` 配置项显式声明应用需要的依赖库版本来解决这个问题：

```js
module.exports = {
  // ...
  plugins: [
    new ModuleFederationPlugin({
      // ...
      // 共享依赖及版本要求声明
+     shared: {
+       lodash: {
+         requiredVersion: "^4.17.0",
+       },
+     },
    }),
  ],
  // ...
};
```

上例 `requiredVersion: "^4.17.0"` 表示该应用支持共享版本大于等于 `4.17.0` 小于等于 `4.18.0` 的 lodash，其它应用所使用的 lodash 版本号只要在这一范围内即可复用。`requiredVersion` 支持 [Semantic Versioning 2.0](https://semver.org/) 标准，这意味着我们可以复用 `package.json` 中声明版本依赖的方法。

`requiredVersion` 的作用在于限制依赖版本的上下限，实用性极高。除此之外，我们还可以通过 `shared.[lib].shareScope` 属性更精细地控制依赖的共享范围，例如：

```js
module.exports = {
  // ...
  plugins: [
    new ModuleFederationPlugin({
      // ...
      // 共享依赖及版本要求声明
+     shared: {
+       lodash: {
+         // 任意字符串
+         shareScope: 'foo'
+       },
+     },
    }),
  ],
  // ...
};
```

在这种配置下，其它应用所共享的 lodash 库必须同样声明为 `foo` 空间才能复用。`shareScope` 在多团队协作时能够切分出多个资源共享空间，降低依赖冲突的概率。

除 `requiredVersion`/`shareScope` 外，`shared` 还提供了一些不太常用的 [配置](https://webpack.js.org/plugins/module-federation-plugin/)，简单介绍：

- `singletong`：强制约束多个版本之间共用同一个依赖包，如果依赖包不满足版本 `requiredVersion` 版本要求则报警告：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bbdf553eb2b4c8e9d38ffb2e1695948~tplv-k3u1fbpfcp-watermark.image?)

- `version`：声明依赖包版本，缺省默认会从包体的 `package.json` 的 `version` 字段解析；
- `packageName`：用于从描述文件中确定所需版本的包名称，仅当无法从请求中自动确定包名称时才需要这样做；
- `eager`：允许 webpack 直接打包该依赖库 —— 而不是通过异步请求获取库；
- `import`：声明如何导入该模块，默认为 shared 属性名，实用性不高，可忽略。

## 示例：微前端

Module Federation 是一种非常新的技术，社区资料还比较少，接下来我们来编写一个完整的微前端应用，帮助你更好理解 MF 的功能与用法。微前端架构通常包含一个作为容器的主应用及若干负责渲染具体页面的子应用，分别对标到下面示例的 `packages/host` 与 `packages/order` 应用：

```
MF-micro-fe
├─ packages
│  ├─ host
│  │  ├─ public
│  │  │  └─ index.html
│  │  ├─ src
│  │  │  ├─ App.js
│  │  │  ├─ HomePage.js
│  │  │  ├─ Navigation.js
│  │  │  ├─ bootstrap.js
│  │  │  ├─ index.js
│  │  │  └─ routes.js
│  │  ├─ package.json
│  │  └─ webpack.config.js
│  └─ order
│     ├─ src
│     │  ├─ OrderDetail.js
│     │  ├─ OrderList.js
│     │  ├─ main.js
│     │  └─ routes.js
│     ├─ package.json
│     └─ webpack.config.js
├─ lerna.json
└─ package.json
```

> 提示：示例代码已上传到：[MF-micro-fe](https://github1s.com/Tecvan-fe/webpack-book-samples/blob/HEAD/MF-micro-fe/package.json)，务必 Clone 下来辅助阅读。

先看看 `order` 对应的 MF 配置：

```js
module.exports = {
  // ...
  plugins: [
    new ModuleFederationPlugin({
      name: "order",
      filename: "remoteEntry.js",
      // 导入路由配置
      exposes: {
        "./routes": "./src/routes",
      },
    }),
  ],
};
```

注意，`order` 应用实际导出的是路由配置文件 `routes.js`。而 `host` 则通过 MF 插件导入并消费 `order` 应用的组件，对应配置：

```js
module.exports = {
  // ...
  plugins: [
    // 模块使用方也依然使用 ModuleFederationPlugin 插件搭建 MF 环境
    new ModuleFederationPlugin({
      // 使用 remotes 属性声明远程模块列表
      remotes: {
        // 地址需要指向导出方生成的应用入口文件
        RemoteOrder: "order@http://localhost:8081/dist/remoteEntry.js",
      },
    })
  ],
  // ...
};
```

之后，在 `host` 应用中引入 `order` 的路由配置并应用到页面中：

```js
import localRoutes from "./routes";
// 引入远程 order 模块
import orderRoutes from "RemoteOrder/routes";

const routes = [...localRoutes, ...orderRoutes];

const App = () => (
  <React.StrictMode>
    <HashRouter>
      <h1>Micro Frontend Example</h1>
      <Navigation />
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <React.Suspense fallback={<>...</>}>
                <route.component />
              </React.Suspense>
            }
            exact={route.exact}
          />
        ))}
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

export default App;
```

通过这种方式，一是可以将业务代码分解为更细粒度的应用形态；二是应用可以各自管理路由逻辑，降低应用间耦合性。最终能降低系统组件间耦合度，更有利于多团队协作。除此之外，MF 技术还有非常大想象空间，国外有大神专门整理了一系列实用 MF 示例：[Module Federation Examples](https://github.com/module-federation/module-federation-examples/)，感兴趣的读者务必仔细阅读这些示例代码。

## 总结

Module Federation 是 Webpack 5 新引入的一种远程模块动态加载、运行技术，虽然国内讨论热度较低，但使用简单，功能强大，非常适用于微前端或代码重构迁移场景。

使用上，只需引入 `ModuleFederationPlugin` 插件，按要求组织、分割好各个微应用的代码，并正确配置 `expose/remotes` 配置项即可实现基于 HTTP\(S\) 的模块共享功能。此外，我们还可以通过插件的 `shared` 配置项实现在应用间共享基础依赖库，还可以通过 `shared.requireVersion` 等一系列配置，精细控制依赖的共享版本与范围。

## 思考题

Module Federation 实现的微前端架构并未提供沙箱能力，会不会导致一些安全问题？