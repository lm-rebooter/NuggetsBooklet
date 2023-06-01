
在开发 Web 应用时，我们通常需要编写大量 JavaScript 代码 —— 用于控制页面逻辑；编写大量 CSS 代码 —— 用于调整页面呈现形式。问题在于，CSS 语言在过去若干年中一直在追求样式表现力方面的提升，工程化能力薄弱，例如缺乏成熟的模块化机制、依赖处理能力、逻辑判断能力等。为此，在开发现代大型 Web 应用时，通常会使用 Webpack 配合其它预处理器编写样式代码。

本章主要介绍 Webpack 中如何使用 CSS 代码处理工具，包括：

- 如何使用 `css-loader`、`style-loader`、`mini-css-extract-plugin` 处理原生 CSS 文件？
- 如何使用 Less/Sass/Stylus 预处理器？
- 如何使用 PostCSS ？

## Webpack 如何处理 CSS 资源？

原生 Webpack 并不能识别 CSS 语法，假如不做额外配置直接导入 `.css` 文件，会导致编译失败：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f538975af33141acb130ced3e89ab220~tplv-k3u1fbpfcp-zoom-1.image)


为此，在 Webpack 中处理 CSS 文件，通常需要用到：

- [`css-loader`](https://webpack.js.org/loaders/css-loader/)：该 Loader 会将 CSS 等价翻译为形如 `module.exports = "${css}"` 的JavaScript 代码，使得 Webpack 能够如同处理 JS 代码一样解析 CSS 内容与资源依赖；
- [`style-loader`](https://webpack.js.org/loaders/style-loader/)：该 Loader 将在产物中注入一系列 runtime 代码，这些代码会将 CSS 内容注入到页面的 `<style>` 标签，使得样式生效；
- [`mini-css-extract-plugin`](https://webpack.js.org/plugins/mini-css-extract-plugin)：该插件会将 CSS 代码抽离到单独的 `.css` 文件，并将文件通过 `<link>` 标签方式插入到页面中。

> PS：当 Webpack 版本低于 5.0 时，请使用 [`extract-text-webpack-plugin`](https://www.npmjs.com/package/extract-text-webpack-plugin) 代替 `mini-css-extract-plugin`。

三种组件各司其职：`css-loader` 让 Webpack 能够正确理解 CSS 代码、分析资源依赖；`style-loader`、`mini-css-extract-plugin` 则通过适当方式将 CSS 插入到页面，对页面样式产生影响：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5be680b877f44414a4349b62bc0143ba~tplv-k3u1fbpfcp-zoom-1.image)


下面我们先从 `css-loader` 聊起，`css-loader` 提供了很多处理 CSS 代码的基础能力，包括 CSS 到 JS 转译、依赖解析、Sourcemap、css-in-module 等，基于这些能力，Webpack 才能像处理 JS 模块一样处理 CSS 模块代码。接入时首先需要安装依赖：

```bash
yarn add -D css-loader
```

之后修改 Webpack 配置，定义 `.css` 规则：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["css-loader"],
      },
    ],
  },
};
```

此后，执行 `npx webpack` 或其它构建命令即可。经过 `css-loader` 处理后，样式代码最终会被转译成一段 JS 字符串：

<table data-ace-table-col-widths="346;389;" class="ace-table author-6857319138482798593"><colgroup><col width="346"><col width="389"></colgroup><tbody><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1rwmud4aapesi0z5h10iktwy8w4ssaafqxc1zn6g86wdwibvaqqg7p4hjfnrvgfqly3c">源码</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1rwmud4aapesi0z5h10iktwy8w4ssaafqxc1bjl15wq72k8wok87m68bsg4g29ehlwbh">转译后</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1g961801vd9z6t4km380ky3drzv4s4vcfxc1zn6g86wdwibvaqqg7p4hjfnrvgfqly3c"><pre data-wrap="false" class="language-CSS"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="ppv4hfvwfi">.main-hd {
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="ppv4hfvwfi">    font-size: 10px;
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="ppv4hfvwfi">}
</div></code></pre></div><div style="white-space: pre;" data-line-index="1" data-zone-id="xr1g961801vd9z6t4km380ky3drzv4s4vcfxc1zn6g86wdwibvaqqg7p4hjfnrvgfqly3c"></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1g961801vd9z6t4km380ky3drzv4s4vcfxc1bjl15wq72k8wok87m68bsg4g29ehlwbh"><pre data-wrap="false" class="language-JavaScript"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="1y5yy9gi5d">//...
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="1y5yy9gi5d">var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="1y5yy9gi5d">// Module
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="1y5yy9gi5d">___CSS_LOADER_EXPORT___.push([
</div><div style="white-space: pre;" data-line-index="4" data-zone-id="1y5yy9gi5d">  module.id, 
</div><div style="white-space: pre;" data-line-index="5" data-zone-id="1y5yy9gi5d">  ".main-hd {\n    font-size: 10px;\n}", ""
</div><div style="white-space: pre;" data-line-index="6" data-zone-id="1y5yy9gi5d">]);
</div><div style="white-space: pre;" data-line-index="7" data-zone-id="1y5yy9gi5d">// Exports
</div><div style="white-space: pre;" data-line-index="8" data-zone-id="1y5yy9gi5d">/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);
</div><div style="white-space: pre;" data-line-index="9" data-zone-id="1y5yy9gi5d">//...
</div></code></pre></div></td></tr></tbody></table>

但这段字符串只是被当作普通 JS 模块处理，并不会实际影响到页面样式，后续还需要：

1.  **开发环境**：使用 `style-loader` 将样式代码注入到页面 `<style>` 标签；
2.  **生产环境**：使用 `mini-css-extract-plugin` 将样式代码抽离到单独产物文件，并以 `<link>` 标签方式引入到页面中。

经过 `css-loader` 处理后，CSS 代码会被转译为等价 JS 字符串，但这些字符串还不会对页面样式产生影响，需要继续接入 `style-loader` 加载器。

与其它 Loader 不同，`style-loader` 并不会对代码内容做任何修改，而是简单注入一系列运行时代码，用于将 `css-loader` 转译出的 JS 字符串插入到页面的 `style` 标签。接入时同样需要安装依赖：

```
yarn add -D style-loader css-loader
```

之后修改 Webpack 配置，定义 `.css` 规则：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

> PS：注意保持 `style-loader` 在前，`css-loader` 在后

上述配置语义上相当于 `style-loader(css-loader(css))` 链式调用，执行后样式代码会被转译为类似下面这样的代码：

```js
// Part1: css-loader 处理结果，对标到原始 CSS 代码
const __WEBPACK_DEFAULT_EXPORT__ = (
"body {\n    background: yellow;\n    font-weight: bold;\n}"
);
// Part2: style-loader 处理结果，将 CSS 代码注入到 `style` 标签
injectStylesIntoStyleTag(
 __WEBPACK_DEFAULT_EXPORT__
)
```

至此，运行页面触发 `injectStylesIntoStyleTag` 函数将 CSS 代码注入到 `<style>` 标签，样式才真正开始生效。例如：

<table data-ace-table-col-widths="357;373;" class="ace-table author-6857319138482798593"><colgroup><col width="357"><col width="373"></colgroup><tbody><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr14t86hsmer73kplanz4snfrd74kwukaydxc1fd08twsjv6rr9nv3r8r3skwyzls6z2l3"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">index.css</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr14t86hsmer73kplanz4snfrd74kwukaydxc1whgw3pqqvo39bpcawt7lnlianv4s00cb"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">index.js</code></div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1mvvsczpazqogyfjcokksaovsmn04plrqxc1fd08twsjv6rr9nv3r8r3skwyzls6z2l3"><pre data-wrap="false" class="language-CSS"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="2cl8mi6khh">body {
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="2cl8mi6khh">    background: yellow;
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="2cl8mi6khh">    font-weight: bold;
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="2cl8mi6khh">}
</div></code></pre></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1mvvsczpazqogyfjcokksaovsmn04plrqxc1whgw3pqqvo39bpcawt7lnlianv4s00cb"><pre data-wrap="false" class="language-JavaScript"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="crd1ic6qtc">import './index.css';
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="crd1ic6qtc">
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="crd1ic6qtc">const node = document.createElement('span');
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="crd1ic6qtc">node.textContent = 'Hello world';
</div><div style="white-space: pre;" data-line-index="4" data-zone-id="crd1ic6qtc">document.body.appendChild(node);
</div></code></pre></div></td></tr></tbody></table>

页面运行效果：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c4206f0d4834065acaf50f53147228b~tplv-k3u1fbpfcp-watermark.image?)

经过 `style-loader` + `css-loader` 处理后，样式代码最终会被写入 Bundle 文件，并在运行时通过 `style` 标签注入到页面。这种将 JS、CSS 代码合并进同一个产物文件的方式有几个问题：

- JS、CSS 资源无法并行加载，从而降低页面性能；
- 资源缓存粒度变大，JS、CSS 任意一种变更都会致使缓存失效。

因此，生产环境中通常会用 [`mini-css-extract-plugin`](https://webpack.js.org/plugins/mini-css-extract-plugin) 插件替代 `style-loader`，将样式代码抽离成单独的 CSS 文件。使用时，首先需要安装依赖：

```
yarn add -D mini-css-extract-plugin
```

之后，添加配置信息：

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                // 根据运行环境判断使用那个 loader
                (process.env.NODE_ENV === 'development' ?
                    'style-loader' :
                    MiniCssExtractPlugin.loader),
                'css-loader'
            ]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HTMLWebpackPlugin()
    ]
}
```

这里需要注意几个点：

- `mini-css-extract-plugin` 库同时提供 Loader、Plugin 组件，需要同时使用
- `mini-css-extract-plugin` 不能与 `style-loader` 混用，否则报错，所以上述示例中第 9 行需要判断 `process.env.NODE_ENV` 环境变量决定使用那个 Loader
- `mini-css-extract-plugin` 需要与 `html-webpack-plugin` 同时使用，才能将产物路径以 `link` 标签方式插入到 html 中

至此，运行 Webpack 后将同时生成 JS、CSS、HTML 三种产物文件，如：

<table data-ace-table-col-widths="357;373;" class="ace-table author-6857319138482798593"><colgroup><col width="357"><col width="373"></colgroup><tbody><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1qkhfozbj82s0wtumrndeqeuw3ho8221hxc1gmpvgv53jwlapvtu2w3kddvqajk3287e"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">index.css</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1qkhfozbj82s0wtumrndeqeuw3ho8221hxc1vdn5inp7a7wdbms25poe4mgossvugph4"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">index.js</code></div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1svu5dhf6f3c9v16obmcl6r0vzufac3fgxc1gmpvgv53jwlapvtu2w3kddvqajk3287e"><pre data-wrap="false" class="language-CSS"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="ior8piyfrz">body {
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="ior8piyfrz">    background: yellow;
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="ior8piyfrz">    font-weight: bold;
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="ior8piyfrz">}
</div></code></pre></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1svu5dhf6f3c9v16obmcl6r0vzufac3fgxc1vdn5inp7a7wdbms25poe4mgossvugph4"><pre data-wrap="false" class="language-JavaScript"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="zqmdjiw5if">import './index.css';
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="zqmdjiw5if">
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="zqmdjiw5if">const node = document.createElement('span');
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="zqmdjiw5if">node.textContent = 'Hello world';
</div><div style="white-space: pre;" data-line-index="4" data-zone-id="zqmdjiw5if">document.body.appendChild(node);
</div></code></pre></div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1qggoqeo6mzfpvbq9mlutplaud82d8fluxc1gmpvgv53jwlapvtu2w3kddvqajk3287e">产物 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">main.css</code>：</div><div style="white-space: pre;" data-line-index="1" data-zone-id="xr1qggoqeo6mzfpvbq9mlutplaud82d8fluxc1gmpvgv53jwlapvtu2w3kddvqajk3287e"><div data-ace-gallery-json="{&quot;items&quot;:[{&quot;uuid&quot;:&quot;d2c8c030-01e7-4c20-a832-014373046523&quot;,&quot;height&quot;:&quot;446&quot;,&quot;width&quot;:&quot;758&quot;,&quot;currHeight&quot;:&quot;446&quot;,&quot;currWidth&quot;:&quot;758&quot;,&quot;natrualHeight&quot;:&quot;446&quot;,&quot;natrualWidth&quot;:&quot;758&quot;,&quot;file_token&quot;:&quot;boxcn5qv2eknaxruxwI1v5ref2e&quot;,&quot;src&quot;:&quot;https%3A%2F%2Finternal-api-drive-stream.feishu.cn%2Fspace%2Fapi%2Fbox%2Fstream%2Fdownload%2Fall%2Fboxcn5qv2eknaxruxwI1v5ref2e%2F%3Fmount_node_token%3DdoccnfsrCcpLnHmaqnSuAFQSZqh%26mount_point%3Ddoc_image&quot;,&quot;image_type&quot;:&quot;image/png&quot;,&quot;size&quot;:54482,&quot;comments&quot;:[],&quot;pluginName&quot;:&quot;imageUpload&quot;,&quot;scale&quot;:1.6995515695067265}]}" class="image-uploaded gallery"><img data-width="758" data-height="446" data-suite="eyJmaWxlVG9rZW4iOiJib3hjbjVxdjJla25heHJ1eHdJMXY1cmVmMmUiLCJvYmpUeXBlIjoiZG9jIiwib2JqVG9rZW4iOiJkb2NjbmZzckNjcExuSG1hcW5TdUFGUVNacWgiLCJvcmlnaW5TcmMiOiJodHRwczovL2ludGVybmFsLWFwaS1kcml2ZS1zdHJlYW0uZmVpc2h1LmNuL3NwYWNlL2FwaS9ib3gvc3RyZWFtL2Rvd25sb2FkL2FsbC9ib3hjbjVxdjJla25heHJ1eHdJMXY1cmVmMmUvP21vdW50X25vZGVfdG9rZW49ZG9jY25mc3JDY3BMbkhtYXFuU3VBRlFTWnFoJm1vdW50X3BvaW50PWRvY19pbWFnZSJ9" data-src="https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/all/boxcn5qv2eknaxruxwI1v5ref2e/?mount_node_token=doccnfsrCcpLnHmaqnSuAFQSZqh&amp;mount_point=doc_image" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f787b0f8d5b4088b4de4e64dc71ec04~tplv-k3u1fbpfcp-zoom-1.image"></div></div><div style="white-space: pre;" data-line-index="2" data-zone-id="xr1qggoqeo6mzfpvbq9mlutplaud82d8fluxc1gmpvgv53jwlapvtu2w3kddvqajk3287e"></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1qggoqeo6mzfpvbq9mlutplaud82d8fluxc1vdn5inp7a7wdbms25poe4mgossvugph4">产物 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">main.js</code>：</div><div style="white-space: pre;" data-line-index="1" data-zone-id="xr1qggoqeo6mzfpvbq9mlutplaud82d8fluxc1vdn5inp7a7wdbms25poe4mgossvugph4"><div data-ace-gallery-json="{&quot;items&quot;:[{&quot;uuid&quot;:&quot;58bde67e-6273-4df8-a3cb-83d89a2d4cb1&quot;,&quot;height&quot;:&quot;670&quot;,&quot;width&quot;:&quot;1100&quot;,&quot;currHeight&quot;:&quot;670&quot;,&quot;currWidth&quot;:&quot;1100&quot;,&quot;natrualHeight&quot;:&quot;670&quot;,&quot;natrualWidth&quot;:&quot;1100&quot;,&quot;file_token&quot;:&quot;boxcnDAtFL0snEPJP5tKDkh9qUf&quot;,&quot;src&quot;:&quot;https%3A%2F%2Finternal-api-drive-stream.feishu.cn%2Fspace%2Fapi%2Fbox%2Fstream%2Fdownload%2Fall%2FboxcnDAtFL0snEPJP5tKDkh9qUf%2F%3Fmount_node_token%3DdoccnfsrCcpLnHmaqnSuAFQSZqh%26mount_point%3Ddoc_image&quot;,&quot;image_type&quot;:&quot;image/png&quot;,&quot;size&quot;:120359,&quot;comments&quot;:[],&quot;pluginName&quot;:&quot;imageUpload&quot;,&quot;scale&quot;:1.6417910447761195}]}" class="image-uploaded gallery"><img data-width="1100" data-height="670" data-suite="eyJmaWxlVG9rZW4iOiJib3hjbkRBdEZMMHNuRVBKUDV0S0RraDlxVWYiLCJvYmpUeXBlIjoiZG9jIiwib2JqVG9rZW4iOiJkb2NjbmZzckNjcExuSG1hcW5TdUFGUVNacWgiLCJvcmlnaW5TcmMiOiJodHRwczovL2ludGVybmFsLWFwaS1kcml2ZS1zdHJlYW0uZmVpc2h1LmNuL3NwYWNlL2FwaS9ib3gvc3RyZWFtL2Rvd25sb2FkL2FsbC9ib3hjbkRBdEZMMHNuRVBKUDV0S0RraDlxVWYvP21vdW50X25vZGVfdG9rZW49ZG9jY25mc3JDY3BMbkhtYXFuU3VBRlFTWnFoJm1vdW50X3BvaW50PWRvY19pbWFnZSJ9" data-src="https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/all/boxcnDAtFL0snEPJP5tKDkh9qUf/?mount_node_token=doccnfsrCcpLnHmaqnSuAFQSZqh&amp;mount_point=doc_image" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d436857927f94c418538da8120513824~tplv-k3u1fbpfcp-zoom-1.image"></div></div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);" colspan="2"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1mqfcp93skz7j72t7l1nb94qbqw6fwis3xc1gmpvgv53jwlapvtu2w3kddvqajk3287e"><div style="text-align: left;">产物 <code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">index.html</code>：</div></div><div style="white-space: pre;" data-line-index="1" data-zone-id="xr1mqfcp93skz7j72t7l1nb94qbqw6fwis3xc1gmpvgv53jwlapvtu2w3kddvqajk3287e"><pre data-wrap="false" class="language-HTML"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="x1oqp3qyu4">&lt;!DOCTYPE html&gt;
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="x1oqp3qyu4">&lt;html&gt;
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="x1oqp3qyu4">&lt;head&gt;
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="x1oqp3qyu4">  &lt;meta charset="utf-8"&gt;
</div><div style="white-space: pre;" data-line-index="4" data-zone-id="x1oqp3qyu4">  &lt;title&gt;Webpack App&lt;/title&gt;
</div><div style="white-space: pre;" data-line-index="5" data-zone-id="x1oqp3qyu4">  &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
</div><div style="white-space: pre;" data-line-index="6" data-zone-id="x1oqp3qyu4">  &lt;script defer src="main.js"&gt;&lt;/script&gt;
</div><div style="white-space: pre;" data-line-index="7" data-zone-id="x1oqp3qyu4">  &lt;link href="main.css" rel="stylesheet"&gt;
</div><div style="white-space: pre;" data-line-index="8" data-zone-id="x1oqp3qyu4">&lt;/head&gt;
</div><div style="white-space: pre;" data-line-index="9" data-zone-id="x1oqp3qyu4">
</div><div style="white-space: pre;" data-line-index="10" data-zone-id="x1oqp3qyu4">&lt;body&gt;
</div><div style="white-space: pre;" data-line-index="11" data-zone-id="x1oqp3qyu4">&lt;/body&gt;
</div><div style="white-space: pre;" data-line-index="12" data-zone-id="x1oqp3qyu4">
</div><div style="white-space: pre;" data-line-index="13" data-zone-id="x1oqp3qyu4">&lt;/html&gt;
</div></code></pre></div></td></tr></tbody></table>

可以看到，样式代码会被抽离到单独的 CSS 文件，并且在最终生成的 html 中包含了指向 JS、CSS 两种资源的标签：

```html
<script defer src="main.js"></script>
<link href="main.css" rel="stylesheet">
```

综上，在 Webpack 中处理 CSS，通常需要使用 `css-loader + style-loader` 或 `css-loader + mini-css-extract-plugin` 组合，两种方式最终都能实现加载样式代码的效果。但鉴于原生 CSS 语言的种种缺陷，我们还可以在此基础上增加更多 Webpack 组件，更优雅、高效地编写页面样式，下面一一展开介绍。

## 使用预处理器

CSS —— Cascading Style Sheet-级联样式表，最初设计用于描述 Web 界面样式的描述性语言，经过这么多年的发展其样式表现力已经突飞猛进，但核心功能、基本语法没有发生太大变化，至今依然没有提供诸如循环、分支判断、扩展复用、函数、嵌套之类的特性，以至于原生 CSS 已经难以应对当代复杂 Web 应用的开发需求。

为此，社区在 CSS 原生语法基础上扩展出一些更易用，功能更强大的 CSS 预处理器\(Preprocessor\)，比较知名的有 [Less](https://lesscss.org/)、[Sass](https://sass-lang.com/)、[Stylus](https://stylus-lang.com/) 。这些工具各有侧重，但都在 CSS 之上补充了扩展了一些逻辑判断、数学运算、嵌套封装等特性，基于这些特性，我们能写出复用性、可读性、可维护性更强，条理与结构更清晰的样式代码，以 Less 为例：

```less
// 变量
@size: 12px;
@color: #006633;

// 混合
.mx-bordered() {
    border: 1px solid #000;
}

// 嵌套
body {
    // 函数计算
    background: spin(lighten(@color, 25%), 8);
    font-weight: bold;
    padding: @size;

    .main {
        // 数学运算
        font-size: @size * 2;
        .mx-bordered;
        color: darken(@color, 10%);
        padding: @size * 0.6;
    }
}
```

在 Webpack 中只需使用适当 Loader 即可接入预处理器，以 Less 为例，首先安装依赖：

```
yarn add -D less less-loader
```

其次，修改 Webpack 配置，添加 `.less` 处理规则：

```js
module.exports = {
    module: {
        rules: [{
            test: /\.less$/,
            use: [
                'style-loader',
                'css-loader',
                'less-loader'
            ]
        }]
    }
}
```

可以看到这里需要同时使用三种 Loader，其中 `less-loader` 用于将 Less 代码转换为 CSS 代码，上述示例转换结果：

<table data-ace-table-col-widths="346;389;" class="ace-table author-6857319138482798593"><colgroup><col width="346"><col width="389"></colgroup><tbody><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1ak8hn2fouotuktopkp2bzzrwpw553ck9xc1lin29s95taalhot7smasuy0v88hztj0j"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">.less</code> 源码</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1ak8hn2fouotuktopkp2bzzrwpw553ck9xc1nuepuufboyr2kuq2vy5ieypsvwsyug2n"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">less-loader</code> 处理结果：</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1lmk6n2f4rmvl0tsbi4f7g5nv5nkiwkzbxc1lin29s95taalhot7smasuy0v88hztj0j"><pre data-wrap="false" class="language-CSS"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="jrt3iwddap">// 变量
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="jrt3iwddap">@size: 12px;
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="jrt3iwddap">@color: #006633;
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="jrt3iwddap">
</div><div style="white-space: pre;" data-line-index="4" data-zone-id="jrt3iwddap">// 混合
</div><div style="white-space: pre;" data-line-index="5" data-zone-id="jrt3iwddap">.mx-bordered() {
</div><div style="white-space: pre;" data-line-index="6" data-zone-id="jrt3iwddap">    border: 1px solid #000;
</div><div style="white-space: pre;" data-line-index="7" data-zone-id="jrt3iwddap">}
</div><div style="white-space: pre;" data-line-index="8" data-zone-id="jrt3iwddap">
</div><div style="white-space: pre;" data-line-index="9" data-zone-id="jrt3iwddap">// 嵌套
</div><div style="white-space: pre;" data-line-index="10" data-zone-id="jrt3iwddap">body {
</div><div style="white-space: pre;" data-line-index="11" data-zone-id="jrt3iwddap">    // 函数计算
</div><div style="white-space: pre;" data-line-index="12" data-zone-id="jrt3iwddap">    background: spin(lighten(@color, 25%), 8);
</div><div style="white-space: pre;" data-line-index="13" data-zone-id="jrt3iwddap">    font-weight: bold;
</div><div style="white-space: pre;" data-line-index="14" data-zone-id="jrt3iwddap">    padding: @size;
</div><div style="white-space: pre;" data-line-index="15" data-zone-id="jrt3iwddap">
</div><div style="white-space: pre;" data-line-index="16" data-zone-id="jrt3iwddap">    .main {
</div><div style="white-space: pre;" data-line-index="17" data-zone-id="jrt3iwddap">        // 运算
</div><div style="white-space: pre;" data-line-index="18" data-zone-id="jrt3iwddap">        font-size: @size * 2;
</div><div style="white-space: pre;" data-line-index="19" data-zone-id="jrt3iwddap">        .mx-bordered;
</div><div style="white-space: pre;" data-line-index="20" data-zone-id="jrt3iwddap">        color: darken(@color, 10%);
</div><div style="white-space: pre;" data-line-index="21" data-zone-id="jrt3iwddap">        padding: @size * 0.6;
</div><div style="white-space: pre;" data-line-index="22" data-zone-id="jrt3iwddap">    }
</div><div style="white-space: pre;" data-line-index="23" data-zone-id="jrt3iwddap">}
</div></code></pre></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1lmk6n2f4rmvl0tsbi4f7g5nv5nkiwkzbxc1nuepuufboyr2kuq2vy5ieypsvwsyug2n"><pre data-wrap="false" class="language-CSS"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="gtglm5c6hj">body {
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="gtglm5c6hj">  background: #00e691;
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="gtglm5c6hj">  font-weight: bold;
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="gtglm5c6hj">  padding: 12px;
</div><div style="white-space: pre;" data-line-index="4" data-zone-id="gtglm5c6hj">}
</div><div style="white-space: pre;" data-line-index="5" data-zone-id="gtglm5c6hj">body .main {
</div><div style="white-space: pre;" data-line-index="6" data-zone-id="gtglm5c6hj">  font-size: 24px;
</div><div style="white-space: pre;" data-line-index="7" data-zone-id="gtglm5c6hj">  border: 1px solid #000;
</div><div style="white-space: pre;" data-line-index="8" data-zone-id="gtglm5c6hj">  color: #00331a;
</div><div style="white-space: pre;" data-line-index="9" data-zone-id="gtglm5c6hj">  padding: 7.2px;
</div><div style="white-space: pre;" data-line-index="10" data-zone-id="gtglm5c6hj">}
</div></code></pre></div><div style="white-space: pre;" data-line-index="1" data-zone-id="xr1lmk6n2f4rmvl0tsbi4f7g5nv5nkiwkzbxc1nuepuufboyr2kuq2vy5ieypsvwsyug2n"></div></td></tr></tbody></table>

这段 CSS 随后会被 `css-loader` 与 `style-loader` 处理，最终在页面生效。

目前，社区比较流行的预处理器框架有：Less、Sass、Stylus，它们接入 Webpack 的方式非常相似：

<table data-ace-table-col-widths="82;321;350;368;" class="ace-table author-6857319138482798593"><colgroup><col width="82"><col width="321"><col width="350"><col width="368"></colgroup><tbody><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1q6hzag24np3tdom00vbtbff62kmkyyv5xc1a3b8epqw6uq06id1s4doqvqyq95zv4kf"></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1q6hzag24np3tdom00vbtbff62kmkyyv5xc1p5a7ai5nk2kc8w4yzcoes0oycjpbkkz8">Less</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1q6hzag24np3tdom00vbtbff62kmkyyv5xc18tagsy3h9znfu7pcf6cbtmuzhupeq6va">Sass</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1q6hzag24np3tdom00vbtbff62kmkyyv5xc1oitt2lim2b20fq183ifqcyy4yh08j4zk">Stylus</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1doid6mftkj2wbhws2e74yd9p9bpt3v88xc1a3b8epqw6uq06id1s4doqvqyq95zv4kf">安装依赖</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1doid6mftkj2wbhws2e74yd9p9bpt3v88xc1p5a7ai5nk2kc8w4yzcoes0oycjpbkkz8"><pre data-wrap="false" class="language-Bash"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="rwgpwytfyh">yarn add -D less less-loader
</div></code></pre></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1doid6mftkj2wbhws2e74yd9p9bpt3v88xc18tagsy3h9znfu7pcf6cbtmuzhupeq6va"><pre data-wrap="false" class="language-Bash"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="ahtbunu0ln">yarn add -D sass sass-loader
</div></code></pre></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1doid6mftkj2wbhws2e74yd9p9bpt3v88xc1oitt2lim2b20fq183ifqcyy4yh08j4zk"><pre data-wrap="false" class="language-Bash"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="pur6kdoi0s">yarn add -D stylus stylus-loader
</div></code></pre></div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1e2ehaccrt8whqlo0ehe28n87bljv2kokxc1a3b8epqw6uq06id1s4doqvqyq95zv4kf">添加配置</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1e2ehaccrt8whqlo0ehe28n87bljv2kokxc1p5a7ai5nk2kc8w4yzcoes0oycjpbkkz8"><pre data-wrap="false" class="language-JavaScript"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="anlbiu3jgh">module.exports = {
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="anlbiu3jgh">  module: {
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="anlbiu3jgh">    rules: [
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="anlbiu3jgh">      {
</div><div style="white-space: pre;" data-line-index="4" data-zone-id="anlbiu3jgh">        test: /\.less$/,
</div><div style="white-space: pre;" data-line-index="5" data-zone-id="anlbiu3jgh">        use: [
</div><div style="white-space: pre;" data-line-index="6" data-zone-id="anlbiu3jgh">          "style-loader", 
</div><div style="white-space: pre;" data-line-index="7" data-zone-id="anlbiu3jgh">          "css-loader", 
</div><div style="white-space: pre;" data-line-index="8" data-zone-id="anlbiu3jgh">          "less-loader"
</div><div style="white-space: pre;" data-line-index="9" data-zone-id="anlbiu3jgh">        ],
</div><div style="white-space: pre;" data-line-index="10" data-zone-id="anlbiu3jgh">      },
</div><div style="white-space: pre;" data-line-index="11" data-zone-id="anlbiu3jgh">    ],
</div><div style="white-space: pre;" data-line-index="12" data-zone-id="anlbiu3jgh">  }
</div><div style="white-space: pre;" data-line-index="13" data-zone-id="anlbiu3jgh">};
</div></code></pre></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1e2ehaccrt8whqlo0ehe28n87bljv2kokxc18tagsy3h9znfu7pcf6cbtmuzhupeq6va"><pre data-wrap="false" class="language-JavaScript"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="eyrtmjujdq">module.exports = {
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="eyrtmjujdq">  module: {
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="eyrtmjujdq">    rules: [
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="eyrtmjujdq">      {
</div><div style="white-space: pre;" data-line-index="4" data-zone-id="eyrtmjujdq">        test: /\.s[ac]ss$/,
</div><div style="white-space: pre;" data-line-index="5" data-zone-id="eyrtmjujdq">        use: [
</div><div style="white-space: pre;" data-line-index="6" data-zone-id="eyrtmjujdq">          "style-loader", 
</div><div style="white-space: pre;" data-line-index="7" data-zone-id="eyrtmjujdq">          "css-loader", 
</div><div style="white-space: pre;" data-line-index="8" data-zone-id="eyrtmjujdq">          "sass-loader"
</div><div style="white-space: pre;" data-line-index="9" data-zone-id="eyrtmjujdq">        ],
</div><div style="white-space: pre;" data-line-index="10" data-zone-id="eyrtmjujdq">      },
</div><div style="white-space: pre;" data-line-index="11" data-zone-id="eyrtmjujdq">    ],
</div><div style="white-space: pre;" data-line-index="12" data-zone-id="eyrtmjujdq">  }
</div><div style="white-space: pre;" data-line-index="13" data-zone-id="eyrtmjujdq">};
</div></code></pre></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1e2ehaccrt8whqlo0ehe28n87bljv2kokxc1oitt2lim2b20fq183ifqcyy4yh08j4zk"><pre data-wrap="false" class="language-JavaScript"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="qfe4px2ikg">module.exports = {
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="qfe4px2ikg">  module: {
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="qfe4px2ikg">    rules: [
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="qfe4px2ikg">      {
</div><div style="white-space: pre;" data-line-index="4" data-zone-id="qfe4px2ikg">        test: /\.styl$/,
</div><div style="white-space: pre;" data-line-index="5" data-zone-id="qfe4px2ikg">        use: [
</div><div style="white-space: pre;" data-line-index="6" data-zone-id="qfe4px2ikg">          "style-loader", 
</div><div style="white-space: pre;" data-line-index="7" data-zone-id="qfe4px2ikg">          "css-loader", 
</div><div style="white-space: pre;" data-line-index="8" data-zone-id="qfe4px2ikg">          "stylus-loader"
</div><div style="white-space: pre;" data-line-index="9" data-zone-id="qfe4px2ikg">        ],
</div><div style="white-space: pre;" data-line-index="10" data-zone-id="qfe4px2ikg">      },
</div><div style="white-space: pre;" data-line-index="11" data-zone-id="qfe4px2ikg">    ],
</div><div style="white-space: pre;" data-line-index="12" data-zone-id="qfe4px2ikg">  }
</div><div style="white-space: pre;" data-line-index="13" data-zone-id="qfe4px2ikg">};
</div></code></pre></div></td></tr></tbody></table>

大家可根据项目背景选择接入适当的预处理器框架。

## 使用 post-css

与上面介绍的 Less/Sass/Stylus 这一类预处理器类似，PostCSS 也能在原生 CSS 基础上增加更多表达力、可维护性、可读性更强的语言特性。两者主要区别在于预处理器通常定义了一套 CSS 之上的超集语言；PostCSS 并没有定义一门新的语言，而是与 `@babel/core` 类似，只是实现了一套将 CSS 源码解析为 AST 结构，并传入 PostCSS 插件做处理的流程框架，具体功能都由插件实现。

> 预处理器之于 CSS，就像 TypeScript 与 JavaScript 的关系；而 PostCSS 之于 CSS，则更像 Babel 与 JavaScript。

PostCSS 的接入步骤也很简单，首先安装依赖：

```
yarn add -D postcss postcss-loader
```

之后添加 Webpack 配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader", 
          "css-loader", 
          "postcss-loader"
        ],
      },
    ],
  }
};
```

不过，这个时候的 PostCSS 还只是个空壳，下一步还需要使用适当的 PostCSS 插件进行具体的功能处理，例如我们可以使用 [`autoprefixer`](https://github.com/postcss/autoprefixer) 插件自动添加浏览器前缀，首先安装依赖：

```
yarn add -D autoprefixer
```

之后，修改 Webpack 配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader", 
          {
            loader: "css-loader",            
            options: {
              importLoaders: 1
            }
          }, 
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // 添加 autoprefixer 插件
                plugins: [require("autoprefixer")],
              },
            },
          }
        ],
      },
    ],
  }
};
```

之后，再次运行 Webpack 即可为 CSS 代码自动添加浏览器前缀，例如：

<table data-ace-table-col-widths="344;386;" class="ace-table author-6857319138482798593"><colgroup><col width="344"><col width="386"></colgroup><tbody><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1s1u31zet2tvi3bb6cq0bzdl27wsr9sb8xc10f2bqk3hwbmbc7ihzwa8qgsyh2ef3ucz">CSS 源码</div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1s1u31zet2tvi3bb6cq0bzdl27wsr9sb8xc12o3sr44tmryj9eowrwgv1tco0fqgy61y">PostCSS 处理结果</div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1d330i1shhdae5j86faywuaroqcrpwtl0xc10f2bqk3hwbmbc7ihzwa8qgsyh2ef3ucz"><pre data-wrap="false" class="language-CSS"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="zndqrxx7bm">::placeholder {
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="zndqrxx7bm">    color: gray;
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="zndqrxx7bm">}
</div></code></pre></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1d330i1shhdae5j86faywuaroqcrpwtl0xc12o3sr44tmryj9eowrwgv1tco0fqgy61y"><pre data-wrap="false" class="language-CSS"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="5oyukibzad">::-moz-placeholder {
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="5oyukibzad">    color: gray;
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="5oyukibzad">}
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="5oyukibzad">
</div><div style="white-space: pre;" data-line-index="4" data-zone-id="5oyukibzad">:-ms-input-placeholder {
</div><div style="white-space: pre;" data-line-index="5" data-zone-id="5oyukibzad">    color: gray;
</div><div style="white-space: pre;" data-line-index="6" data-zone-id="5oyukibzad">}
</div><div style="white-space: pre;" data-line-index="7" data-zone-id="5oyukibzad">
</div><div style="white-space: pre;" data-line-index="8" data-zone-id="5oyukibzad">::placeholder {
</div><div style="white-space: pre;" data-line-index="9" data-zone-id="5oyukibzad">    color: gray;
</div><div style="white-space: pre;" data-line-index="10" data-zone-id="5oyukibzad">}
</div></code></pre></div></td></tr></tbody></table>

此外，还可以选择将 PostCSS 相关配置抽离保存到 `postcss.config.js` 文件：

<table data-ace-table-col-widths="344;386;" class="ace-table author-6857319138482798593"><colgroup><col width="344"><col width="386"></colgroup><tbody><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1nnaea690pn11rit3gqafm551w80woqdcxc1q9hratqmmzwuq58hy1to1qcom6yh404v"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">postcss.config.js</code></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1nnaea690pn11rit3gqafm551w80woqdcxc15uw6yn7krznbq5jelmvvzqdv0fo4wpdc"><code style="font-family: SourceCodeProMac;
      border: 1px solid #dee0e3;
      background-color: #f5f6f7;
      border-radius: 4px;
      margin-left: 2px;
      margin-right: 2px;">webpack.config.js</code></div></td></tr><tr><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1feddhmb7fhgrcpjcc00s2r37k4loaudpxc1q9hratqmmzwuq58hy1to1qcom6yh404v"><pre data-wrap="false" class="language-JavaScript"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="uqdxklitlc">module.exports = {
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="uqdxklitlc">  plugins: [
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="uqdxklitlc">    require("autoprefixer")
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="uqdxklitlc">  ],
</div><div style="white-space: pre;" data-line-index="4" data-zone-id="uqdxklitlc">};
</div></code></pre></div><div style="white-space: pre;" data-line-index="1" data-zone-id="xr1feddhmb7fhgrcpjcc00s2r37k4loaudpxc1q9hratqmmzwuq58hy1to1qcom6yh404v"></div></td><td style="border: 1px solid rgb(222, 224, 227);"><div style="white-space: pre;" data-line-index="0" data-zone-id="xr1feddhmb7fhgrcpjcc00s2r37k4loaudpxc15uw6yn7krznbq5jelmvvzqdv0fo4wpdc"><pre data-wrap="false" class="language-JavaScript"><code><div style="white-space: pre;" data-line-index="0" data-zone-id="ujkmg9igyb">module.exports = {
</div><div style="white-space: pre;" data-line-index="1" data-zone-id="ujkmg9igyb">  module: {
</div><div style="white-space: pre;" data-line-index="2" data-zone-id="ujkmg9igyb">    rules: [
</div><div style="white-space: pre;" data-line-index="3" data-zone-id="ujkmg9igyb">      {
</div><div style="white-space: pre;" data-line-index="4" data-zone-id="ujkmg9igyb">        test: /\.css$/,
</div><div style="white-space: pre;" data-line-index="5" data-zone-id="ujkmg9igyb">        use: [
</div><div style="white-space: pre;" data-line-index="6" data-zone-id="ujkmg9igyb">          "style-loader", 
</div><div style="white-space: pre;" data-line-index="7" data-zone-id="ujkmg9igyb">          {
</div><div style="white-space: pre;" data-line-index="8" data-zone-id="ujkmg9igyb">            loader: "css-loader",            
</div><div style="white-space: pre;" data-line-index="9" data-zone-id="ujkmg9igyb">            options: {
</div><div style="white-space: pre;" data-line-index="10" data-zone-id="ujkmg9igyb">              importLoaders: 1
</div><div style="white-space: pre;" data-line-index="11" data-zone-id="ujkmg9igyb">            }
</div><div style="white-space: pre;" data-line-index="12" data-zone-id="ujkmg9igyb">          }, 
</div><div style="white-space: pre;" data-line-index="13" data-zone-id="ujkmg9igyb">          "postcss-loader"
</div><div style="white-space: pre;" data-line-index="14" data-zone-id="ujkmg9igyb">        ],
</div><div style="white-space: pre;" data-line-index="15" data-zone-id="ujkmg9igyb">      },
</div><div style="white-space: pre;" data-line-index="16" data-zone-id="ujkmg9igyb">    ],
</div><div style="white-space: pre;" data-line-index="17" data-zone-id="ujkmg9igyb">  }
</div><div style="white-space: pre;" data-line-index="18" data-zone-id="ujkmg9igyb">};
</div></code></pre></div></td></tr></tbody></table>


值得一提的是，PostCSS 与预处理器并非互斥关系，我们完全可以在同一个项目中同时使用两者，例如：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          "style-loader", 
          {
            loader: "css-loader",            
            options: {
              importLoaders: 1
            }
          }, 
          "postcss-loader",
          "less-loader"
        ],
      },
    ],
  }
};
```

基于这一特性，我们既能复用预处理语法特性，又能应用 PostCSS 丰富的插件能力处理诸如雪碧图、浏览器前缀等问题。

PostCSS 最大的优势在于其简单、易用、丰富的插件生态，基本上已经能够覆盖样式开发的方方面面。实践中，经常使用的插件有：

+ [autoprefixer](https://github.com/postcss/autoprefixer)：基于 [Can I Use](https://caniuse.com/) 网站上的数据，自动添加浏览器前缀
+ [postcss-preset-env](https://github.com/jonathantneal/postcss-preset-env)：一款将最新 CSS 语言特性转译为兼容性更佳的低版本代码的插件
+ [postcss-less](https://github.com/shellscape/postcss-less)：兼容 Less 语法的 PostCSS 插件，类似的还有：[postcss-sass](https://github.com/AleshaOleg/postcss-sass)、[poststylus](https://github.com/madeleineostoja/poststylus)
+ [stylelint](https://github.com/stylelint/stylelint)：一个现代 CSS 代码风格检查器，能够帮助识别样式代码中的异常或风格问题

大家可按需扩展学习。

## 总结

本文介绍 `css-loader`、`style-loader`、`mini-css-extract-plugin`、`less-loader`、`postcss-loader` 等组件的功能特点与接入方法，内容有点多，重点在于：

- Webpack 不能理解 CSS 代码，所以需要使用 `css-loader`、`style-loader`、`mini-css-extract-plugin` 三种组件处理样式资源；
- Less/Sass/Stylus/PostCSS 等工具可弥补原生 CSS 语言层面的诸多功能缺失，例如数值运算、嵌套、代码复用等。

这些工具几乎已经成为现代 Web 应用开发的标配，能够帮助我们写出更清晰简洁、可复用的样式代码，帮助我们解决诸多与样式有关的工程化问题。

## 思考题

`style-loader` 与 `mini-css-extract-plugin` 实现的效果有什么区别？对页面性能会产生什么影响？