我们已经写了很多组件了，比如 Calendar、Watermark、OnBoarding 等，但都是用 cra 或者 vite 单独创建项目来写的。

这节我们把它们整合一下，加上构建脚本，发布到 npm，做成和 Ant Design 一样的组件库。

组件库的构建我们上节分析过，就是构建出 esm、commonjs、umd 3 种格式的代码，再加上 css 的构建就好了。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14e1ff13fc1f4a13afdad3e11ffd8ad0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=838&s=53137&e=png&b=ffffff)

ant design、arco design、semi design 都是这样。

我们再看几个组件库：

```
mkdir tmp
cd tmp
npm init -y
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b287c628ff8412cbd25effdf6eb8a84~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880&h=502&s=85373&e=png&b=fefefe)

安装 react-bootstrap：

```
pnpm install react-bootstrap
```
（用 pnpm 安装，node_modules 下目录比较简洁）

看下 node_modules/react-bootstrap 的 package.json

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12de8d4e32cc491180ab049c065d52f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1186&h=688&s=167869&e=png&b=1d1d1d)

可以看到，它也有 main 和 module，也就是 commonjs 和 es module 两种入口。

当你 import 的时候，引入的是 esm 的代码。

当你 require 的时候，引入的是 commonjs 的代码。

看一下 esm 和 cjs 下的代码：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d83083918483470eb625884bc39aaf32~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1586&h=672&s=240530&e=png&b=1d1d1d)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/624a5483b42a42e286c92f2eda5d6a96~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1634&h=644&s=287469&e=png&b=1d1d1d)

当然，它也是支持 umd 的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/573c5142ddc04484aa389d0a3287aab2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1822&h=622&s=262140&e=png&b=1d1d1d)
 
看下 [build 脚本](https://github.com/react-bootstrap/react-bootstrap/blob/master/tools/build.js#L101-L103)：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0d1707bb9cf4cd09530d475ac783bf5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1274&h=968&s=163076&e=png&b=fffbfa)

就是分别用 babel 编译出 commonjs 和 esm 的代码就可以了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d594710dee8c4743b1d5a264c3f96e55~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1162&h=946&s=177591&e=png&b=ffffff)

用 tsc 也行。

umd 格式代码也同样是 [webpack 打包的](https://github.com/react-bootstrap/react-bootstrap/blob/master/tools/build.js#L64)：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1f83b9f340845bfa495b66b680965bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1224&h=904&s=148407&e=png&b=fffefe)

不同于 antd、arco design 和 semi design，它就没有用 gulp 来组织流程。

gulp 本来就不是必须的，可用可不用。

甚至连单独的脚本都不需要，直接 tsc 编译就行：

比如这个 [blueprint 组件库](https://github.com/palantir/blueprint/blob/develop/packages/table/package.json#L22-L25)：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a75449789fd64820bd34141386dd2718~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1616&h=482&s=128671&e=png&b=fef6ef)

之前总结的组件库的构建流程是没问题的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14e1ff13fc1f4a13afdad3e11ffd8ad0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=838&s=53137&e=png&b=ffffff)

然后我们新建一个项目来试一下：

```
npx create-vite guang-components
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d79184681c64173ba6bfed6081bd659~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=922&h=412&s=85973&e=png&b=ffffff)

进入项目，复制几个之前的组件过来：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a3e9a1ecc1c436f921b362524380480~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1866&h=446&s=152280&e=png&b=fcfcfc)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00927eb51a1a4688a85cc55b483e01e1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1884&h=730&s=195675&e=png&b=fdfdfd)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8280c32caddc4db58d5c479f91646ae2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1922&h=534&s=193901&e=png&b=fcfcfc)

复制 Calendar、Watermark、Message 这三个组件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/592fb63501b44f6eb7d487609c5c56d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=598&h=762&s=74081&e=png&b=191919)

然后安装下依赖：

```
npm install

npm install --save react-transition-group lodash-es dayjs classnames

npm i --save-dev @types/react-transition-group
```
然后去掉 Calendar 和 Message 组件里样式的引入，css 和 js 是分开编译的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ceab8ad1b843405192db61d70a238ae2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=838&h=442&s=102515&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f25f4b5fb2984058b488ed835ab31b40~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=890&h=476&s=110108&e=png&b=1f1f1f)

把这些没用的文件删掉：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd79546307b24a6d8a23c44db7b60b59~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=520&h=404&s=35604&e=png&b=191919)

加一个 index.ts 来导出组件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b7720468849400a8b2e56e43d68b153~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1446&h=786&s=216895&e=png&b=1d1d1d)

```javascript
import Calendar, { CalendarProps } from './Calendar';
import Watermark, { WatermarkProps } from './Watermark';
import { MessageProps, Position, MessageRef} from './Message';
import { useMessage } from './Message/useMessage';
import { ConfigProvider } from './Message/ConfigProvider';

export {
    Calendar,
    Watermark,
    ConfigProvider,
    useMessage
}

export type {
    CalendarProps,
    WatermarkProps,
    MessageProps,
    Position,
    MessageRef
}
```
接下来加上 tsc 和 sass 的编译：

添加一个 tsconfig.build.json 的配置文件：

```json
{
    "compilerOptions": {
      "declaration": true,
      "allowSyntheticDefaultImports": true,
      "target": "es2015",
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "Node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "react-jsx",  
      "allowImportingTsExtensions":null,
      "strict": true,
    },
    "include": [
      "src"
    ],
    "exclude": [
      "src/**/*.test.tsx",
      "src/**/*.stories.tsx"
    ]
}
```
然后编译下：

```bash
npx tsc -p tsconfig.build.json --module ESNext --outDir dist/esm

npx tsc -p tsconfig.build.json --module commonjs --outDir dist/cjs
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d11f3af339a344ca83e63d9f75d82083~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1278&h=176&s=42495&e=png&b=181818)

看下 dist 的产物：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efc3bc2b1012411f9de5d0e712deaa17~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=462&h=708&s=62856&e=png&b=1a1a1a)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/727d8abe092c4140825f85a93a9a04af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1294&h=798&s=277775&e=png&b=1d1d1d)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7e81d77d7c743d38a6302341afcf380~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1360&h=744&s=258810&e=png&b=1d1d1d)

没啥问题，esm 和 commonjs 格式的代码都生成了。

然后再编译下样式：

```
npx sass ./src/Calendar/index.scss ./dist/esm/Calendar/index.css

npx sass ./src/Calendar/index.scss ./dist/cjs/Calendar/index.css

npx sass ./src/Message/index.scss ./dist/esm/Message/index.css

npx sass ./src/Message/index.scss ./dist/cjs/Message/index.css
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3517a532c0e4d1bb198e1914c08c1bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1230&h=234&s=61294&e=png&b=191919)

看下产物：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20d5652508484d8a976ecd7452d02d72~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1176&h=904&s=213179&e=png&b=1d1d1d)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec7848ecbf144988974e91b1f296e01f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1142&h=746&s=168668&e=png&b=1d1d1d)

没问题。

当然，sass 文件多了以后你可以写个 node 脚本来自动查找所有 sass 文件然后编译。

接下来只要把这个 dist 目录发到 npm 仓库就可以了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61d8fb84c2cb45abb0c802886f2a238e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=844&h=692&s=106448&e=png&b=1f1f1f)

```javascript
"main": "dist/cjs/index.js",
"module": "dist/esm/index.js",
"types": "dist/esm/index.d.ts",
"files": [
    "dist",
    "package.json",
    "README.md"
],
```
main 和 module 分别是 commonjs 和 es module 的入口。

types 是 dts 的路径。

files 是哪些文件发布到 npm 仓库，没列出来的会被过滤掉。

并且，还需要把 private: true 和 type: module 的字段给去掉。

然后我们来发布 npm 包：

```
npm adduser
```
执行 npm adduser 命令，会打印一个链接让你登录或者注册：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d10aae554875447aafb8aeddd0c2cc54~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=182&s=47735&e=png&b=181818)

登录后就可以 npm publish 了：

```javascript
npm publish
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2f04f9951ec47aaba6ec10cce138810~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=672&s=184611&e=png&b=161616)

发布完之后，在 https://www.npmjs.com 就可以搜索到：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72f9671eb37046488b6a388a19f9a9b1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2452&h=1892&s=410143&e=png&b=fdfdfd)

我们新建个项目来用用看：

```
npx create-vite guang-test
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51a0dd12f2b04f4a8c51adc42e28f322~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=820&h=338&s=58742&e=png&b=ffffff)

安装依赖：

```
pnpm install

pnpm install guang-components
```
在 App.tsx 里用一下：

```javascript
import { Watermark } from 'guang-components';

const App = () => {
  return <Watermark
    content={['测试水印', '神说要有光']}
  >
   <div style={{height: 800}}>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
   </div>
  </Watermark>
};

export default App;
```
跑下开发服务：

```
npm run dev
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5fbd6de7bd5454a804771b56c510579~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=874&h=422&s=51516&e=png&b=181818)

浏览器访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b40de8500750429694d1bf0e92197bd9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2234&h=1530&s=509121&e=png&b=fefefe)

再试下另外两个组件：

```javascript
import dayjs from 'dayjs';
import {Calendar} from 'guang-components';
import 'guang-components/dist/esm/Calendar/index.css';

function App() {
  return (
    <div>
      <Calendar value={dayjs('2024-07-01')}></Calendar>
    </div>
  );
}

export default App;
```
这里用到了 dayjs：

```
pnpm install dayjs
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fc526abf45c4281bb70be5e85de3a47~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2062&h=1756&s=139328&e=png&b=ffffff)

这里样式受 index.css 影响了，去掉就好了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35fcf0f5bd554dc58940880f438afe28~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=428&s=79273&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/560f1fb5936444adb69718d91cd2e5ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2512&h=1562&s=152152&e=png&b=fefefe)

再来试下 Message 组件：

```javascript
import { ConfigProvider, useMessage } from "guang-components"
import 'guang-components/dist/esm/Message/index.css';

function Aaa() {
  const message = useMessage();

  return <button onClick={() =>{
    message.add({
      content:'请求成功'
    })
  }}>成功</button>
}

function App() {

  return (
    <ConfigProvider>
      <div>
        <Aaa></Aaa>
      </div>
    </ConfigProvider>
  );
}

export default App;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fbc6cd5ed9e4814b8cf704a00dc5d36~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1462&h=1170&s=198231&e=gif&f=28&b=fefefe)

没啥问题。

然后我们优化下依赖：

其实用到 guang-components 的项目都会安装 react 和 react-dom 包，不需要把它放在 dependencies 里。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd4db769717a46e2832be156a102856c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=776&h=376&s=59476&e=png&b=1f1f1f)

而是放在 peerDependencies 里：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94d5d50e256b44bebde63cc59443c7c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1188&h=776&s=183871&e=png&b=1d1d1d)

它和 dependencies 一样，都是依赖，但是 dependencies 是子级，而 peerDependencies 是平级。

如果和其他 react 包的版本冲突时，dependencies 会保留一份副本，而 peerDependencies  会提示开发者去解决冲突，不会保留副本。

改下版本号，重新 npm publish：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e803987156045e38ff0a08d79d228d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1332&h=1818&s=403193&e=png&b=1b1b1b)

这样，我们的组件库的 npm 包就发布成功了！

再测试下 commonjs 的代码。

用 cra 创建个项目：

```
npx create-react-app --template=typescript tmp4
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e9ff62251514dd1832806bdf8a709b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=244&s=149601&e=png&b=fefefe)

进入项目，安装组件库：

```
npm install --save guang-components
```

在 App.tsx 用一下：

```javascript
const { Watermark } = require('guang-components');

const App = () => {
  return <Watermark
    content={['测试水印', '神说要有光']}
  >
   <div style={{height: 800}}>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
   </div>
  </Watermark>
};

export default App;
```
注意，这次用 require 引入代码。

然后把开发服务跑起来：

```
npm run start
```
浏览器里看一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a394fadf1e29478dacc8534241220db9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1532&h=1094&s=311040&e=png&b=fefefe)

没啥问题。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/guang-components)。

## 总结

今天我们把之前写过的部分组件封装成了组件库并发布到了 npm 仓库。

可以直接在项目里引入来用，和 antd 等组件库一样。

构建部分我们分析过很多组件库，都是一样的：

- commonjs 和 esm 的代码通过 tsc 或者 babel 编译产生
- umd 代码通过 webpack 打包产生
- css 代码通过 sass 或者 less 等编译产生
- dts 类型也是通过 tsc 编译产生

我们在 package.json 里配置了 main 和 module，分别声明 commonjs 和 es module 的入口，配置了 types 指定类型的入口。

然后通过 npm adduser 登录，之后 npm publish 发布到 npm。

这样，react 项目里就可以引入这个组件库来用了，之前写过的所有组件都可以加到这个组件库里。
