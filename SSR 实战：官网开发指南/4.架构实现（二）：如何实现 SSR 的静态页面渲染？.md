> 仓库地址：https://github.com/czm1290433700/ssr-server

上一节，我们搭建了代码的 lint，写了一个很简单的服务器端 demo，并通过运行构建产物的方式运行了项目，对于上次的页面，大家打开 network 可以看到它向服务器端的请求是一个完整的 HTML。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/263f09614cbf41ef9299c47f188f6f22~tplv-k3u1fbpfcp-watermark.image?)

在前几节，我们介绍过服务器端渲染的特点就是所有 dom 、数据的拼接在服务器端完成，使得在客户端拿到的是一个完整的 url，这个其实就是服务器端渲染，但是这里我们是通过 send 直接返回的 HTML 字符串，和我们渲染静态页面的预期还有差距，那么我们应该怎么在现在的基础上去渲染一个静态页面呢？

一个应用渲染静态页面的过程，其实可以分为以下三个步骤：

-   模板页面的渲染：即 HTML中 body 标签下的 dom 内容，像我们平时写一个基于 React 或是 Vue 的前后端分离项目，首先我们会去编写对应页面的模板模块，再写相关的数据请求，最后统一导出进行页面的渲染。

<!---->

-   路由的匹配：一个 Web 工程下可能会有多个模板页面需要渲染，我们会使用路由去对应指定的模板页面进行渲染，体现在浏览器中，也就是我们域名后的后缀。

<!---->

-   header标签的修改：模板页面本身是没办法去修改页面的 header 标签的，但是修改 header 标签的需求其实并不少见，类似修改站点的标题， 或是进行多媒体适配，可能都需要对 header 标签有一定修改。

包括上面三个能力的静态渲染才是完整的，这点对于 SSR 也是类似的，所以这小节我们将就三个方面来完成 SSR 的静态页面渲染。

# 模板页面的渲染

我们先安装一下 React 模板相关的依赖， 然后在 src/pages 下创建一个简单的模板页面。这边是使用 React 函数式的写法来搭建模板而不是创建类的形式，在大型项目中， React 函数式的写法不需要创建实例，可以按照实际的业务情形来拆分组件的粒度，加上有 react hook 的帮助，我们已经不再需要去过多关注生命周期，相反更多是一种“组合大于继承”的思想，对大家理解函数式编程也会有大的帮助。

```
npm install react react-dom --save
npm install @types/react @types/react-dom --save-dev
```

```
// ./src/pages/Home/index.tsx
const Home = () => {
  return (
    <div>
      <h1>hello-ssr</h1>
      <button
        onClick={(): void => {
          alert("hello-ssr");
        }}
      >
        alert
      </button>
    </div>
  );
};

export default Home;
```

模板创建好了，现在我们需要思考，怎么才能把这个模板转换成 HTML 标签传递给服务器端呢？这里我们可以使用 react-dom 中暴露的 renderToString 方法，这个方法可以把模板元素转换成 HTML 字符串返回。它的底层和客户端模板编译其实是一样的，都是根据 AST （也就是虚拟 DOM ）来转化成真实 DOM 的过程，React 在它的基础上，提供了更多流相关的能力，返回了一套 server 相关的 api，感兴趣的同学可以阅读[ React 官方文档对应的描述](https://reactjs.org/docs/react-dom-server.html)。

现在我们来通过 renderToString 改造一下我们的 server入口文件。

```
// ./src/server/index.tsx
import express from "express";
import childProcess from "child_process";
import { renderToString } from "react-dom/server";
import Home from "@/pages/Home";

const app = express();
const content = renderToString(<Home />);

app.get("*", (req, res) => {
  res.send(`
    <html
      <body>
        <div>${content}</div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("ssr-server listen on 3000");
});

childProcess.exec("start http://127.0.0.1:3000");
```

刷新一下页面：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5573f7909c3c4b3fa16a29197685f9aa~tplv-k3u1fbpfcp-watermark.image?)
可以看到，已经可以渲染出页面，不过按钮上的事件没绑定上去，点 alert 是没有反应的，因为 rendertoString 只是渲染页面，而事件相关的绑定是没办法在服务器端中进行的，那我们怎么才能把事件绑定到静态页面呢？

之前我们有介绍过，掘金也是服务端渲染，我们看看它是怎么做的。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/caac374cfbd34b8fa47879f1660a5357~tplv-k3u1fbpfcp-watermark.image?)
可以看到，掘金服务端返回的 HTML 文本中包括一组打包过后的 JS，这个其实就是这个页面所对应的相关事件和脚本，我们只需要打包过后将 JS 绑定在 HTML 中就可以。

**这个也叫“同构”，是服务器端渲染的核心概念**，同一套 React 代码在服务器端渲染一遍，然后在客户端再执行一遍。服务端负责静态 dom 的拼接，而客户端负责事件的绑定，不仅是模板页面渲染，后面的路由，数据的请求都涉及到同构的概念。可以理解成，服务器端渲染都是基于同构去展开的，大家这里关注一下这个概念，对后面的学习理解会有很大的帮助

现在我们就开始将模板中的脚本打包引入到 HTML 中，这里我们就要用到`ReactDom.hydrateRoot`了，这个在上面给到的 React官网中也有相关的介绍：

> If you call `ReactDOM.hydrateRoot()` on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

在已经提供了服务器端静态渲染节点的情况下使用，它只会对模板中的事件进行处理，这样就可以满足我们的需求了，新增一个 src/client/index.tsx 作为我们客户端页面的构建入口：

```
// src/client/index.tsx

import { hydrateRoot } from "react-dom/client";
import Home from "@/pages/Home";

hydrateRoot(document.getElementById("root") as Document | Element, <Home />);
```

`ReactDom.hydrateRoot` 需要指定一个绑定的真实 dom，我们给 server 入口 send 的页面加一个id ：

```
// src/server/index.tsx
import express from "express";
import childProcess from "child_process";
import { renderToString } from "react-dom/server";
import Home from "@/pages/Home";

const app = express();
const content = renderToString(<Home />);

app.get("*", (req, res) => {
  res.send(`
    <html
      <body>
        <div id="root">${content}</div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("ssr-server listen on 3000");
});

childProcess.exec("start http://127.0.0.1:3000");
```

这样客户端的部分就改造好了，我们也对应给它配一套 webpack 配置，加上对应的构建命令：

```
// webpack.client.js
const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");

module.exports = merge(baseConfig, {
  mode: "development",
  entry: "./src/client/index.tsx",
  output: {
    filename: "index.js",
    path: path.resolve(process.cwd(), "client_build"),
  },
});
```

```
// package.json
"scripts": {
    "start": "npx nodemon --watch src server_build/bundle.js",
    "build:client": "npx webpack build --config ./webpack.client.js --watch",
    "build:server": "npx webpack build --config ./webpack.server.js --watch",
},
```

我们执行一下`npm run build:client` 看看构建结果：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c169c82fba449809d132c6febf040ac~tplv-k3u1fbpfcp-watermark.image?)

可以看到构建成功了，并且页面目录下会生成对应的 build_client/index.js 的构建文件，下一步我们将 index.js 加入到返回的 HTML 中：

```
// ./src/server/index.tsx
import express from "express";
import childProcess from "child_process";
import { renderToString } from "react-dom/server";
import Home from "@/pages/Home";
import path from "path";

const app = express();
const content = renderToString(<Home />);

app.use(express.static(path.resolve(process.cwd(), "client_build")));

app.get("*", (req, res) => {
  res.send(`
    <html
      <body>
        <div id="root">${content}</div>
        <script src="/index.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("ssr-server listen on 3000");
});

childProcess.exec("start http://127.0.0.1:3000");
```

在上面的代码中，`app.use(express.static(path.resolve(process.cwd(), "client_build")));`我们将对应的打包文件作为静态文件导入，然后在 script中引入对应的路由访问即可，这时候大家可以运行`npm run start`看一下结果了：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8aabcb9f15745268d7bc7b5cddfe4ca~tplv-k3u1fbpfcp-watermark.image?)
可以看到，已经有对应静态资源的请求了，页面也已经可以绑定事件了，到这里模板页面的渲染就已经完成了。

# 路由的匹配

上面我们只加入了 Home 页面的访问，但是事实上咱们站点不可能只有一个页面，所以我们需要再加上路由的匹配，那我们应该怎么做呢？

上个小标题我们介绍了同构的概念，同构有一个原因是，客户端和服务端的返回需要保持一致，不然会有客户端的报错，页面也没办法正常匹配。所以我们需要同时为客户端和服务端的入口都加上对应的路由配置。

首先我们先安装一下路由相关的依赖：

```
npm install react-router-dom --save
```

再创建一个简单的 demo 模板页面，光只有一个模板页面，路由咱也不太好试验：

```
// ./src/pages/Demo/index.tsx
import { FC } from "react";

const Demo: FC = (data) => {
  return (
    <div>这是一个demo页面</div>
  );
};

export default Demo;
```

然后我们创建一个 router.tsx 来存放路由相关的配置，现在总共有两个路由：

```
// ./src/router.tsx
import Home from "@/pages/Home";
import Demo from "@/pages/Demo";

interface IRouter {
  path: string;
  element: JSX.Element;
}

const router: Array<IRouter> = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/demo",
    element: <Demo />,
  },
];

export default router;
```

接着我们来改造客户端，我们将上面路由的配置遍历一下，塞到对应 Route 节点中：

```
// ./src/client/index.tsx
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import router from "@/router";

const Client = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        {router?.map((item, index) => {
          return <Route {...item} key={index} />;
        })}
      </Routes>
    </BrowserRouter>
  );
};

hydrateRoot(document.getElementById("root") as Document | Element, <Client />);
```

服务端也相同，我们用路由的部分来替换上面固定的`<Home />`：

```
// ./src/server/index.tsx
import express from "express";
import childProcess from "child_process";
import { renderToString } from "react-dom/server";
import path from "path";
import router from "@/router";
import { Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";

const app = express();

app.use(express.static(path.resolve(process.cwd(), "client_build")));

app.get("*", (req, res) => {
  const content = renderToString(
    <StaticRouter location={req.path}>
      <Routes>
        {router?.map((item, index) => {
          return <Route {...item} key={index} />;
        })}
      </Routes>
    </StaticRouter>
  );

  res.send(`
    <html
      <body>
        <div id="root">${content}</div>
        <script src="/index.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("ssr-server listen on 3000");
});

childProcess.exec("start http://127.0.0.1:3000");
```

其中` StaticRouter  `是无状态的路由，因为服务器端不同于客户端，客户端中，浏览器历史记录会改变状态，同时将屏幕更新，但是服务器端是不能改动到应用状态的，所以我们这里采用无状态路由。

做完这些路由的改造就完成了，还是很简单的，只是在客户端和服务器端都进行路由配置即可，这时候大家可以重新运行，打开 http://127.0.0.1:3000/demo，可以看到已经可以进行路由匹配了。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8b8585a5d524ff0905ca70d0d8336eb~tplv-k3u1fbpfcp-watermark.image?)
因为存在客户端路由和服务端路由，所以服务器端渲染通过不同的方式跳转也会采用不同的渲染方式，当使用 React 内置的路由跳转的时候，会进行客户端路由的跳转，采用客户端渲染；而通过 a 标签，或者原生方式打开一个新页面的时候，才会进行服务器端路由的跳转，使用服务器端渲染。

我们可以做个小实验来验证一下，改造 home 页面如下：

```
// ./src/pages/Home/index.tsx
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>hello-ssr</h1>
      <button
        onClick={(): void => {
          alert("hello-ssr");
        }}
      >
        alert
      </button>
      <a href="http://127.0.0.1:3000/demo">链接跳转</a>
      <span
        onClick={(): void => {
          navigate("/demo");
        }}
      >
        路由跳转
      </span>
    </div>
  );
};

export default Home;
```

我们加上了两个跳转，刷新页面，当点击“**链接跳转** **”** 的时候，可以看到 network 中会有对服务器端的请求，所以是通过服务器端渲染的页面。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dee615f8810544a8b777632ecbb51d7c~tplv-k3u1fbpfcp-watermark.image?)
当我们点击“**路由跳转** **”** 的时候，走的是客户端路由，这时候打开的页面将不是服务器端渲染，而是会走客户端渲染兜底，可以看到 network 中是没有对服务器端的 HTML 请求的。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/374ed47e47994e0db7160483532563c4~tplv-k3u1fbpfcp-watermark.image?)
# Header 标签的修改

上面我们一起来实践了 SSR 的模板页面的渲染和路由匹配，不过这个还不能满足我们所有静态页面的需求，因为模板页面只是影响到 body 的部分，修改不同路由下对应的标题，多媒体适配或是 SEO 时加入的相关 meta 关键字，都需要加入相关的 header。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa55dce108af4e5683ea3d142a4fef80~tplv-k3u1fbpfcp-watermark.image?)
我们进入正题，服务器端渲染怎么才能修改到对应的 header 呢？可以使用 react-helmet 来实现我们的需求，这个依赖支持对文档头进行调整，我们先来安装一下依赖：

```
npm install react-helmet --save
npm install @types/react-helmet --save-dev
```

同样，这个调整是需要同构的，客户端和服务端都要针对性调整，我们先对客户端进行改造，以 Home页举例：

```
// ./src/pages/Home/index.tsx
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { Helmet } from "react-helmet";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Helmet>
        <title>简易的服务器端渲染 - HOME</title>
        <meta name="description" content="服务器端渲染"></meta>
      </Helmet>
      <div>
        <h1>hello-ssr</h1>
        <button
          onClick={(): void => {
            alert("hello-ssr");
          }}
        >
          alert
        </button>
        <a href="http://127.0.0.1:3000/demo">链接跳转</a>
        <span
          onClick={(): void => {
            navigate("/demo");
          }}
        >
          路由跳转
        </span>
      </div>
    </Fragment>
  );
};

export default Home;
```

然后我们对服务器端也进行相同的同构，保证服务器端的返回也是相同的 header，这一点很重要，因为大部分搜索引擎的爬虫关键词爬取都是根据服务器返回内容进行关键词检索的。

```
import express from "express";
import childProcess from "child_process";
import { renderToString } from "react-dom/server";
import path from "path";
import router from "@/router";
import { Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";

const app = express();

app.use(express.static(path.resolve(process.cwd(), "client_build")));

app.get("*", (req, res) => {
  const content = renderToString(
    <StaticRouter location={req.path}>
      <Routes>
        {router?.map((item, index) => {
          return <Route {...item} key={index} />;
        })}
      </Routes>
    </StaticRouter>
  );

  const helmet = Helmet.renderStatic();

  res.send(`
    <html
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
      </head>
      <body>
        <div id="root">${content}</div>
        <script src="/index.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("ssr-server listen on 3000");
});

childProcess.exec("start http://127.0.0.1:3000");
```

`Helmet.renderStatic()`可以提供渲染时添加的所有内容，这样我们就已经完成 header 标签的修改了，可以刷新一下页面看一下效果：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b43b3830b212463fb9faf28072bb30a4~tplv-k3u1fbpfcp-watermark.image?)
# 小结

这一节课，我们学习了如何实现 SSR 的静态页面渲染，包括模板页面的渲染、路由的匹配和 Header 标签的修改，同时也介绍了服务器端渲染中一个很重要的概念 -- 同构，相信大家学习后对服务器端渲染已经有了一个相对深刻的了解，同学们也可以结合下面画的思维导图回忆温习一下今天的内容，加深对整个过程的理解。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ad5d258c1114da3936b9dc642ae37bf~tplv-k3u1fbpfcp-watermark.image?)

现在我们已经实现了静态页面的部分，但是实际上，并不是所有的数据都是静态的，往往需要通过接口的请求来拿到预期的数据。所以在下节课，我们将来学习，如何支持 SSR 的数据请求。
