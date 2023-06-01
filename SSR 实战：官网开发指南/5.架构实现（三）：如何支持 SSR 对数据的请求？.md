> 仓库地址：https://github.com/czm1290433700/ssr-server

上一节课我们学习了怎么实现 SSR 的静态页面渲染，但是一个页面不可能只有静态的部分，那么 SSR 中我们应该怎么进行数据的请求和注入呢？我们先做下简单尝试，看能不能直接用平常我们开发的方式来请求。

# hook 请求是否可行？

我们先启一个路由，用来作为一个简单接口，因为 express 没办法直接读取请求的 body，所以我们需要用 body-parser 对请求进行一个解析：

```
npm install body-parser --save
```

```
// ./src/server/index.tsx
// ./src/server/index.tsx
import express from "express";
import childProcess from "child_process";
import { renderToString } from "react-dom/server";
import path from "path";
import router from "@/router";
import { Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";

const app = express();

const bodyParser = require("body-parser");

app.use(express.static(path.resolve(process.cwd(), "client_build")));

// 请求body解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 启一个post服务
app.post("/api/getDemoData", (req, res) => {
  res.send({
    data: req.body,
    status_code: 0,
  });
});

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

然后咱们在 Demo 页面中直接用 hook 来请求，这个过程需要装一下 axios 的依赖：

```
npm install axios --save
```

```
// ./src/pages/Demo/index.tsx
import { FC, useState, useEffect } from "react";
import axios from "axios";

const Demo: FC = (data) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    axios
      .post("/api/getDemoData", {
        content: "这是一个demo页面",
      })
      .then((res: any) => {
        setContent(res.data?.data?.content);
      });
  }, []);

  return <div>{content}</div>;
};

export default Demo;
```

然后我们刷新一下 Demo 页面看看：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e824dd29b0214eddaf7ea8a1235d3ba0~tplv-k3u1fbpfcp-watermark.image?)
数据请求成功了，不过，不对的是，我们可以在 network 中看到对应的请求，数据也没在服务器端请求的时候塞入 HTML，也就是说走的是客户端渲染，而不是服务端渲染，和我们预期的不一样，看来是不能直接用 hook 来常规请求的。

我们来回忆之前静态页面的思路，是在服务器端拼凑好 HTML 并返回，所以请求的话，咱们应该也是获取到每个模板页面初始化的请求，并在服务器端请求好，进行 HTML 拼凑，在这之前我们需要建立一个全局的 store，使得服务端请求的数据可以提供到模板页面来进行操作。确认好思路，咱们就根据这个思路先来解决试试。

# 全局 store 的建立

store 的建立我们可以基于 redux 去做，redux 是一个可以对 state 进行统一管理的库。全局 store 的核心在于上一章节提到的“同构”，服务器端和客户端都需要建立 store，我们先装一下相关的依赖：

```
npm install @reduxjs/toolkit redux-thunk react-redux --save
```

其中 @reduxjs/toolkit 是 redux 最新提供的工具包，可以用于状态的统一管理，提供了更多 hook 的能力，相对代码更为简易，至于 redux-thunk 是一个 redux 的中间件，提供了 dispatch 和 getState 与异步方法交互的能力。

然后我们在 Demo 页面下创建一个 store 目录，用来存放对应的 reducer，将之前客户端请求的逻辑加进去，并且设置一个默认值“默认数据”，如果请求成功的话，咱们就把传入参数返回一下。

```
// ./src/pages/Demo/store/demoReducer.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getDemoData = createAsyncThunk(
  "demo/getData",
  async (initData: string) => {
    const res = await axios.post("http://127.0.0.1:3000/api/getDemoData", {
      content: initData,
    });
    return res.data?.data?.content;
  }
);

const demoReducer = createSlice({
  name: "demo",
  initialState: {
    content: "默认数据",
  },
  // 同步reducer
  reducers: {},
  // 异步reducer
  extraReducers(build) {
    build
      .addCase(getDemoData.pending, (state, action) => {
        state.content = "pending";
      })
      .addCase(getDemoData.fulfilled, (state, action) => {
        state.content = action.payload;
      })
      .addCase(getDemoData.rejected, (state, action) => {
        state.content = "rejected";
      });
  },
});

export { demoReducer, getDemoData };
```

createSlice 这个函数我们着重讲一下，因为是 redux 比较新的版本，很多同学可能还是比较陌生的。

-   reducers：可以存放同步的 reducers（不需要请求参数）；

<!---->

-   initialState：可以理解成原来的 state；

<!---->

-   name： 是这个 reducer 的空间，后面取 store 的时候会根据这个进行区分；

<!---->

-   extraReducers：这个是我们这里需要的异步 reducer，其中包含三个状态，pending、fulfilled 和 rejected，分别对应到请求的三种状态。

这种函数式的写法可以即用即配，是个不错的改进版本。因为只是一个状态管理的方式，并不是我们这章的重点，更详细的参数和部分大家可以在[ @reduxjs/toolkit 的官网](https://redux-toolkit.js.org/introduction/getting-started)学习了解。

我们还可以创建一个 index.ts 来作为统一导出，因为一个页面可能不只有一个 reducer，这样引用的时候就不用每一个都写一个 import 了，都从 index.ts 中统一导出就可以：

```
// ./src/pages/Demo/store/index.ts
import { demoReducer } from "./demoReducer";

export { demoReducer };
```

然后我们分别创建一下客户端和服务器端的 store，将 reducer 导入一下，并且接入一下 thunk 的中间件，使得 dispatch 相关的函数支持异步函数的入参：

```
// ./src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { demoReducer } from "@/pages/Demo/store";

const clientStore = configureStore({
  reducer: { demo: demoReducer.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

const serverStore = configureStore({
  reducer: { demo: demoReducer.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export { clientStore, serverStore };
```

接下来我们将创建好的 store 分别在客户端和服务器端的路由处注入一下就可以：

```
// ./src/client/index.tsx
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import router from "@/router";
import { clientStore } from "@/store";
import { Provider } from "react-redux";

const Client = (): JSX.Element => {
  return (
    <Provider store={clientStore}>
      <BrowserRouter>
        <Routes>
          {router?.map((item, index) => {
            return <Route {...item} key={index} />;
          })}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

// 将事件处理加到ID为root的dom下
hydrateRoot(document.getElementById("root") as Document | Element, <Client />);
```

```
// ./src/server/index.tsx
import express from "express";
import childProcess from "child_process";
import { renderToString } from "react-dom/server";
import path from "path";
import router from "@/router";
import { Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";
import { serverStore } from "@/store";
import { Provider } from "react-redux";

const app = express();

const bodyParser = require("body-parser");

app.use(express.static(path.resolve(process.cwd(), "client_build")));

// 请求body解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 启一个post服务
app.post("/api/getDemoData", (req, res) => {
  res.send({
    data: req.body,
    status_code: 0,
  });
});

app.get("*", (req, res) => {
  const content = renderToString(
    <Provider store={serverStore}>
      <StaticRouter location={req.path}>
        <Routes>
          {router?.map((item, index) => {
            return <Route {...item} key={index} />;
          })}
        </Routes>
      </StaticRouter>
    </Provider>
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

到这里 store 就已经注入好了，我们只需要在 Demo 中与 store 连接就行。connect 暴露了两个参数，一个 state，一个 dispatch，它会根据你的需要拼接成指定的参数，以装饰器的形式包装你定义的函数，这样我们的 Demo 就可以接收到我们定义的 content 和 getDemoData 参数了。

```
// ./src/pages/Demo/index.tsx
import { FC, useState, useEffect, Fragment } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getDemoData } from "./store/demoReducer";
import { Helmet } from "react-helmet";

interface IProps {
  content?: string;
  getDemoData?: (data: string) => void;
}

const Demo: FC<IProps> = (data) => {
  // const [content, setContent] = useState("");

  // // 客户端异步请求
  // useEffect(() => {
  //   axios
  //     .post("/api/getDemoData", {
  //       content: "这是一个demo",
  //     })
  //     .then((res) => {
  //       setContent(res.data?.data?.content);
  //     });
  // }, []);

  return (
    <Fragment>
      <Helmet>
        <title>简易的服务器端渲染框架 - DEMO</title>
        <meta name="description" content="服务器端渲染框架"></meta>
      </Helmet>
      <div>
        <h1>{data.content}</h1>
        <button
          onClick={(): void => {
            data.getDemoData && data.getDemoData("刷新过后的数据");
          }}
        >
          刷新
        </button>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => {
  // 将对应reducer的内容透传回dom
  return {
    content: state?.demo?.content,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getDemoData: (data: string) => {
      dispatch(getDemoData(data));
    },
  };
};

const storeDemo: any = connect(mapStateToProps, mapDispatchToProps)(Demo);

export default storeDemo;
```

到这里我们的全局 store 就建立了，我们可以刷新一下页面试试。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/864e92b0f62146e18cc961179d126c41~tplv-k3u1fbpfcp-watermark.image?)
可以看到展示的是默认数据，那是因为我们并没有进行初始化的请求，所以它走了默认的 state 兜底，然后我们点击刷新试试。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/553e74ee93ba4490b286468c9828a252~tplv-k3u1fbpfcp-watermark.image?)
可以看到新增了对应的请求，对应展示的内容也切换为了刷新过后的数据，那这就意味着咱们 store的部分已经走通了，接下来咱们只需要考虑，应该怎样在服务器端进行请求，使得在 html 拼接的时候就可以拿到初始化的数据呢？

# 建立服务器端请求数据体系

需要在服务器端进行初始化，我们先来捋捋思路，首先我们肯定得先在服务器端拿到所有需要请求的函数，怎么透传过去呢？我们应该可以使用路由，因为客户端和服务端咱们都有配置路由，如果加一个参数通过路由把参数透传，然后在服务器端遍历，最后把结果对应分发是不是就可以了。

思路捋好咱们就可以开始做了，不过这里有个小细节大家要注意一下，服务器端不同于客户端，它是拿不到请求的域名的，**所以服务器端下的axios请求应该是包含域名的绝对路径，而不是使用相对路径，很多SSR的初学者在开发过程中很容易遇到类似问题** **。**

好了，进入正题，咱们先给 Demo 定义一个初始化的函数，两个入参，一个透传 store，另一个 data，对应页面展示的内容：

```
// ./src/pages/Demo/index.tsx
import { FC, useState, useEffect, Fragment } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getDemoData } from "./store/demoReducer";
import { Helmet } from "react-helmet";

interface IProps {
  content?: string;
  getDemoData?: (data: string) => void;
}

const Demo: FC<IProps> = (data) => {
  // const [content, setContent] = useState("");

  // // 客户端异步请求
  // useEffect(() => {
  //   axios
  //     .post("/api/getDemoData", {
  //       content: "这是一个demo",
  //     })
  //     .then((res) => {
  //       setContent(res.data?.data?.content);
  //     });
  // }, []);

  return (
    <Fragment>
      <Helmet>
        <title>简易的服务器端渲染框架 - DEMO</title>
        <meta name="description" content="服务器端渲染框架"></meta>
      </Helmet>
      <div>
        <h1>{data.content}</h1>
        <button
          onClick={(): void => {
            data.getDemoData && data.getDemoData("刷新过后的数据");
          }}
        >
          刷新
        </button>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => {
  // 将对应reducer的内容透传回dom
  return {
    content: state?.demo?.content,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getDemoData: (data: string) => {
      dispatch(getDemoData(data));
    },
  };
};

const storeDemo: any = connect(mapStateToProps, mapDispatchToProps)(Demo);

storeDemo.getInitProps = (store: any, data?: string) => {
  return store.dispatch(getDemoData(data || "这是初始化的demo"));
};

export default storeDemo;
```

咱们先对路由进行一下改造，将初始化的方法给路由带上：

```
// ./src/router/index.tsx
import Home from "@/pages/Home";
import Demo from "@/pages/Demo";

interface IRouter {
  path: string;
  element: JSX.Element;
  loadData?: (store: any) => any;
}

const router: Array<IRouter> = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/demo",
    element: <Demo />,
    loadData: Demo.getInitProps,
  },
];

export default router;
```

接下来咱们就该在服务器端拉取对应的初始化方法，并统一请求注入它们了，这个过程很简单，我们只需要改造 get 方法就可以，遍历所有的初始化方法，然后统一请求塞进 store 里。

```
// ./src/server/index.tsx
import express from "express";
import childProcess from "child_process";
import path from "path";
import { Route, Routes } from "react-router-dom";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { matchRoutes, RouteObject } from "react-router-dom";
import router from "@/router";
import { serverStore } from "@/store";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";

const app = express();

const bodyParser = require("body-parser");

// 请求body解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 注入事件处理的脚本
app.use(express.static(path.resolve(process.cwd(), "client_build")));

// demo api
app.post("/api/getDemoData", (req, res) => {
  res.send({
    data: req.body,
    status_code: 0,
  });
});

app.get("*", (req, res) => {
  const routeMap = new Map<string, () => Promise<any>>(); // path - loaddata 的map
  router.forEach((item) => {
    if (item.path && item.loadData) {
      routeMap.set(item.path, item.loadData(serverStore));
    }
  });

  // 匹配当前路由的routes
  const matchedRoutes = matchRoutes(router as RouteObject[], req.path);

  const promises: Array<() => Promise<any>> = [];
  matchedRoutes?.forEach((item) => {
    if (routeMap.has(item.pathname)) {
      promises.push(routeMap.get(item.pathname) as () => Promise<any>);
    }
  });

  Promise.all(promises).then((data) => {
    // 统一放到state里
    // 编译需要渲染的JSX, 转成对应的HTML STRING
    const content = renderToString(
      <Provider store={serverStore}>
        <StaticRouter location={req.path}>
          <Routes>
            {router?.map((item, index) => {
              return <Route {...item} key={index} />;
            })}
          </Routes>
        </StaticRouter>
      </Provider>
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
        <script>
          window.context = {
            state: ${JSON.stringify(serverStore.getState())}
          }
        </script>
        <script src="/index.js"></script>
      </body>
    </html>
  `);
  });
});

app.listen(3000, () => {
  console.log("ssr-server listen on 3000");
});

childProcess.exec("start http://127.0.0.1:3000");
```

到这里服务器端请求就走通了，我们重启项目访问一下 Demo 页面试试：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cb04622b30240b58c65743057eee21a~tplv-k3u1fbpfcp-watermark.image?)
但是很奇怪的是，可以看到服务器端的返回其实是符合预期的，是“这是初始化的demo"，但是页面展示的时候却是默认数据，这是为什么呢？

其实很简单，因为客户端和服务器端的 store 是不同步的，服务器端请求完成填充 store 后，客户端的 JS 又执行了一遍 store，取了默认的值，所以导致数据不能同步。要解决这个问题，就需要使用脱水和注水的方式。

# 脱水和注水

水在这里其实就是数据层，也就是 store，这里对客户端页面进行脱“水”，移除其数据层的部分，仅仅保留 dom 的部分，然后在服务器端请求拿到 store 以后，对数据进行注入，也就是注“水”，使得客户端的数据与服务端请求的数据保持一致，就可以解决掉不同步的问题了。

我们首先在服务器端，将“水”注入到客户端脚本中：

```
// ./src/server/index.tsx
import express from "express";
import childProcess from "child_process";
import path from "path";
import { Route, Routes } from "react-router-dom";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { matchRoutes, RouteObject } from "react-router-dom";
import router from "@/router";
import { serverStore } from "@/store";
import { Provider } from "react-redux";
import { Helmet } from "react-helmet";

const app = express();

const bodyParser = require("body-parser");

// 请求body解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 注入事件处理的脚本
app.use(express.static(path.resolve(process.cwd(), "client_build")));

// demo api
app.post("/api/getDemoData", (req, res) => {
  res.send({
    data: req.body,
    status_code: 0,
  });
});

app.get("*", (req, res) => {
  const routeMap = new Map<string, () => Promise<any>>(); // path - loaddata 的map
  router.forEach((item) => {
    if (item.path && item.loadData) {
      routeMap.set(item.path, item.loadData(serverStore));
    }
  });

  // 匹配当前路由的routes
  const matchedRoutes = matchRoutes(router as RouteObject[], req.path);

  const promises: Array<() => Promise<any>> = [];
  matchedRoutes?.forEach((item) => {
    if (routeMap.has(item.pathname)) {
      promises.push(routeMap.get(item.pathname) as () => Promise<any>);
    }
  });

  Promise.all(promises).then((data) => {
    // 统一放到state里
    // 编译需要渲染的JSX, 转成对应的HTML STRING
    const content = renderToString(
      <Provider store={serverStore}>
        <StaticRouter location={req.path}>
          <Routes>
            {router?.map((item, index) => {
              return <Route {...item} key={index} />;
            })}
          </Routes>
        </StaticRouter>
      </Provider>
    );

    const helmet = Helmet.renderStatic();

    // 注水
    res.send(`
    <html
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
      </head>
      <body>
        <div id="root">${content}</div>
        <script>
          window.context = {
            state: ${JSON.stringify(serverStore.getState())}
          }
        </script>
        <script src="/index.js"></script>
      </body>
    </html>
  `);
  });
});

app.listen(3000, () => {
  console.log("ssr-server listen on 3000");
});

childProcess.exec("start http://127.0.0.1:3000");
```

接下来我们在客户端处，Demo 的初始值中注入服务器端的值，这里需要做一个判断，因为服务器端下访问的时候是没有 window 等 BOM 的，所以需要用 typeof 来判断。**这也是SSR中常常遇到的问题，当有对 BOM的调用时，需要进行判空，否则在服务器端执行的时候将会报错。**

```
// ./src/pages/Demo/store/demoReducer.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getDemoData = createAsyncThunk(
  "demo/getData",
  async (initData: string) => {
    const res = await axios.post("http://127.0.0.1:3000/api/getDemoData", {
      content: initData,
    });
    return res.data?.data?.content;
  }
);

const demoReducer = createSlice({
  name: "demo",
  initialState:
    typeof window !== "undefined"
      ? (window as any)?.context?.state?.demo
      : {
          content: "默认数据",
        },
  // 同步reducer
  reducers: {},
  // 异步reducer
  extraReducers(build) {
    build
      .addCase(getDemoData.pending, (state, action) => {
        state.content = "pending";
      })
      .addCase(getDemoData.fulfilled, (state, action) => {
        state.content = action.payload;
      })
      .addCase(getDemoData.rejected, (state, action) => {
        state.content = "rejected";
      });
  },
});

export { demoReducer, getDemoData };
```

然后我们再重新刷新一下页面看看效果，应该就可以了：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d83e53f2ab6e4156af6b5dc4539f1dab~tplv-k3u1fbpfcp-watermark.image?)
# 小结

这一章节我们学习了 SSR 如何针对数据进行请求，在建立了一个全局的 store 后，将对应的初始化方法透传给服务端进行统一请求，最后再进行数据脱水和注水的操作，使得客户端初始化能和服务器端保持相同的 store，整个过程还是有很多细节的，到这里我们 SSR 的实现篇就结束了。

对一个成熟的 SSR 框架还会有更多的处理，类似 CSS、中间件以及注入函数的装饰器包装，不过这些和基础的原理并没有太大的关系，所以在小册中并不会涉及，感兴趣的同学可以下来了解，对整体的代码风格也是有帮助的。

设立实现篇的初衷，是希望大家可以清楚其中页面渲染到数据请求的过程中是怎么流转的，这样在后期开发中，面对路由跳转，或是请求等不同于客户端的地方时，能知道原理以及为什么产生这些区别，如果三节课学习下来有一点不太理解，大家也不用着急，可以沉下心来多看几遍，涉及的知识点的确不少，如果能完全理解这三节的原理，对大家后面实战的学习会有很大帮助。

从下一节课开始，我们将进入实战的学习，如何使用业内比较成熟的框架 Next.js 来开发一个官网项目？
