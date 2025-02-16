上节做了 esm 和 commonjs、scss 代码的编译，并发布到 npm，在项目里使用没啥问题。

绝大多数情况下，这样就足够了。

umd 的打包做不做都行。

想一下，你是否用过 antd 的 umd 格式的代码？

是不是没用过？

但如果你做一个开源组件库，那还是要支持的。

这节我们就来做下 umd 的打包：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa8f1c8fc6464480b6efbbbf5c74988f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1262&h=928&s=90089&e=png&b=fdf9f8)

前面分析过，大多数组件库都用 webpack 来打包的。

我们先用下 antd 的 umd 的代码。

```
mkdir antd-umd-test
cd antd-umd-test
npm init -y
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c5ce5a438754716bed03d99829f3526~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=858&h=496&s=89752&e=png&b=ffffff)

新建 index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.11/dayjs.min.js"></script>
    <script src="https://unpkg.com/antd@5.19.0/dist/antd.min.js"></script>
</head>
<body>
    
</body>
</html>
```
antd 依赖的 react、react-dom、dayjs 包也得用 umd 引入。

跑个静态服务：

```
npx http-server .
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1da996b0f7e4450783e4bde4e858551b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=824&h=668&s=101294&e=png&b=181818)

浏览器访问下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f13bf2d3442942c5894f362d1373c17c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1256&h=1218&s=152721&e=png&b=f9f7fd)

通过全局变量 antd 来访问各种组件。

我们渲染个 Table 组件试一下：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.11/dayjs.min.js"></script>
    <script src="https://unpkg.com/antd@5.19.0/dist/antd.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script>
        const dataSource = [
            {
                key: '1',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号',
            },
            ];

            const columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '住址',
                dataIndex: 'address',
                key: 'address',
            },
            ];

            const container = document.getElementById('root');
            const root = ReactDOM.createRoot(container);

            root.render(React.createElement(antd.Table, { dataSource: dataSource, columns: columns }));
    </script>
</body>
</html>
```

这里不能直接写 jsx，需要用 babel 或者 tsc 之类的[编译一下](https://www.typescriptlang.org/play/?#code/DwFQhgRgNgpgBAEzAFzAZQPYFcBOBjGAXgG8lVNcCBfOPDKLAWwDsBnEuhl1mgegD4gA)：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6cd6fff609642359972c60aed1cef60~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2368&h=586&s=143866&e=png&b=fdfcfc)

浏览器看一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afbf94dc01764f32992f0d02978eb7de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2162&h=616&s=67081&e=png&b=fcfcfc)

渲染成功！

这就是 umd 的方式如何使用组件库。

我们的组件库也支持下 umd：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa8f1c8fc6464480b6efbbbf5c74988f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1262&h=928&s=90089&e=png&b=fdf9f8)

加一下 webpack.config.js

```javascript
const path = require('path');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        index: ['./src/index.ts']
    },
    output: {
        filename: 'guang-components.js',
        path: path.join(__dirname, 'dist/umd'),
        library: 'Guang',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.build.json'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        dayjs: 'dayjs'
    }
};
```
就是从 index.ts 入口开始打包，产物格式为 umd，文件名 guang-components.js，全局变量为 Guang。

用 ts-loader 来编译 ts 代码，指定配置文件为 tsconfig.build.json。

注意打包的时候不要把 react 和 react-dom、dayjs 包打进去，而是加在 external 配置里，也就是从全局变量来访问这些依赖。

安装依赖：

```
npm install --save-dev webpack-cli webpack ts-loader
```

这里的 jsdoc 注释是为了引入 ts 类型的，可以让 webpack.config.js 有类型提示：

![js.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff65da8d15cf4e079fec9a1e7fb3b26d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=772&h=498&s=77934&e=png&b=202020)

对 jsdoc 感兴趣的话可以看我这篇文章：[JSDoc 真能取代 TypeScript？](https://juejin.cn/post/7292437487011856394)

打包一下：

```
npx webpack
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d01ae0da59442eea272a7712f46c350~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1352&h=938&s=278643&e=png&b=191919)

然后看下产物：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09a35292cdde49c19cc9e5d38d097e18~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1848&h=810&s=313770&e=png&b=1d1d1d)

看起来没啥问题。

这三个模块也都是通过直接读取全局变量的方式引入，没有打包进去：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e73005d2ba0c4fcc8773da160b9802b1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1628&h=1400&s=375228&e=png&b=1d1d1d)

在 package.json 改下版本号，添加 unpkg 的入口，然后发布到 npm：
```
npm publish
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b5dcf28251e4821bbcc24fe8f5bb550~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1786&h=1840&s=512475&e=png&b=1a1a1a)

在 unpkg 访问下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e11dc57e269b443a8b1c3d0a4dec41be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2126&h=1438&s=706479&e=png&b=fdfdfd)

访问 https://unpkg.com/guang-components 会自动重定向到最新版本的 umd 代码。

回到刚才的 antd-umd-test 项目，添加一个 index2.html，引入 guang-components

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7fd49f4e4074e5b9397cda4026336f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2466&h=1350&s=341245&e=png&b=1c1c1c)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.11/dayjs.min.js"></script>
    <script src="https://unpkg.com/guang-components@0.0.7/dist/umd/guang-components.js"></script>
</head>
<body>
    <div id="root"></div>
    <script>

    </script>
</body>
</html>
```
浏览器访问下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39d7182b1a3647cb818cd90af1fb5bde~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1368&h=626&s=102155&e=png&b=fcfafe)

可以通过全局变量 Guang 来拿到组件。

css 也是通过 [unpkg 来拿到](https://unpkg.com/guang-components@0.0.8/dist/esm/Calendar/index.css)：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2786da2e5fdf4abcb6bcadfd665c47a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1390&h=1108&s=173601&e=png&b=ffffff)

然后我们渲染下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.11/dayjs.min.js"></script>
    <script src="https://unpkg.com/guang-components@0.0.7/dist/umd/guang-components.js"></script>
    
    https://unpkg.com/guang-components@0.0.8/dist/esm/Calendar/index.css
</head>
<body>
    <div id="root"></div>
    <script>
        const container = document.getElementById('root');
        const root = ReactDOM.createRoot(container);

        root.render(React.createElement(Guang.Calendar, { value: dayjs('2024-07-01') }));
    </script>
</body>
</html>
```
jsx 在 [ts playground](https://www.typescriptlang.org/play/?#code/DwYQhgNgpgdgJmATgAgG6QK5QLwG8ECeAVgM4AUA5AEwAMVALALQ0DszAjBQJQC+AfMAD04aPCR8AUEA) 编译：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0321c55ee894ac3879187603228803b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2108&h=560&s=142025&e=png&b=fdfcfc)

浏览器访问下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f16065ff1e404f9e905ddf7701820cf3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1840&h=1288&s=88559&e=gif&f=19&b=fdfdfd)

可以看到，umd 的组件库代码生效了。

但是控制台有个报错：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cd5e93c211540fe839d73167843f389~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1464&h=574&s=194323&e=png&b=f9eceb)

点进去可以看到是 \_jsx 这个函数的问题：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1877c6caae9046919d03e9b3aba82051~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1382&h=982&s=287344&e=png&b=fdfbff)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e97a87bf323474fa74b924e9faa269e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1768&h=514&s=143739&e=png&b=fdfbff)

react 我们通过 externals 的方式，从全局变量引入。

但是这个 react/jsx-runtime 不会。

这个 react/jsx-runtime 是干啥的呢？

同一份 [jsx 代码](https://www.typescriptlang.org/play/?jsx=4#code/DwFQhgRgNgpgBAEzAFzAZQPYFcBOBjGAXgG8lVNcCBfOPDKLAWwDsBnEuhl1mgegD4gA)：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b42357b4855415084c5f6648de106e6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2622&h=548&s=114922&e=png&b=fefdfd)

你在 [typescript playground](https://www.typescriptlang.org/play/?jsx=4#code/DwFQhgRgNgpgBAEzAFzAZQPYFcBOBjGAXgG8lVNcCBfOPDKLAWwDsBnEuhl1mgegD4gA) 里把 jsx 编译选项切换为 react：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d494ae83431484597f6e098da10645d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2886&h=892&s=195377&e=png&b=fefefe)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3861ee6277f344458429b07f1b964e9f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2472&h=838&s=182964&e=png&b=fefefe)

可以看到是不同的编译结果。

React 17 之前都是编译为 React.createElement，这需要运行的时候有 React 这个变量，所以之前每个组件都要加上 import React from 'react' 才行。

React 17 之后就加了下面的方式，直接编译为用 react/jsx-runtime 的 api 的方式。不再需要都加上 import React from 'react' 了。

我们组件库也是用的这种：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cc7f24e192e44a096cb6a51ee55cbde~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1400&h=810&s=205652&e=png&b=1d1d1d)

但现在打包 umd 代码的时候，这样有问题。

所以我们把 jsx 编译配置改一下就好了。

修改 jsx 为 react 之后，会有一些报错：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5baf830a05d4a98bac5bac94ed8d58f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1700&h=1650&s=423910&e=png&b=1b1b1b)

在每个报错的组件加一下 React 全局变量：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbe55da03a264299a4f19663697ff392~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=452&s=99700&e=png&b=1f1f1f)

再次打包就好了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbab57136cc3441fa7a235175f32b0b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1318&h=928&s=295102&e=png&b=191919)

改下版本号，重新发布一下：

```
npm publish
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74a034c3fe4b4a79bcf1dca45551896d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1796&h=1100&s=330525&e=png&b=1a1a1a)

改下 index2.html 里用的组件库的版本号：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a68eb2f2b76e44d9aa2521272e146285~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2020&h=726&s=238364&e=png&b=1f1f1f)

现在就没报错了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a640d7c4d26456bb36cb6486c85ab1b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2814&h=1388&s=161178&e=png&b=fefefe)

这样，我们的组件库就支持了 umd。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/guang-components)。
## 总结

前面分析过，组件库基本都会提供 esm、commonjs、umd 三种格式的代码。

这节我们实现了 umd 的支持，通过 webpack 做了打包。

打包逻辑很简单：用 ts-loader 来编译 typescript 代码，然后 react、react-dom 等模块用 externals 的方式引入就好了。

再就是 react 通过 externals 的方式，会导致 react/jsx-runtime 引入有问题，所以我们修改了 tsconfig.json 的 jsx 的编译为 react，也就是编译成 React.createElement 的代码。

虽然 umd 的方式用的场景不多，但我们组件库还是要支持的。
