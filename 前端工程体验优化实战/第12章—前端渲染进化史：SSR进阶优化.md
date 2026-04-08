## 4. Node.js服务端渲染进阶优化：


### 1. 服务端静态站点生成 Static Site Generation (SSG)

SSR架构的应用中或多或少会有一些内容长期不变的**纯静态**页面，例如博客文章页、活动页和规则条例页等等。

对于这些千人一面的静态页面，每次用户的请求时都消耗服务端资源进行SSR渲染，生成**重复**的HTML字符串，显然是一种对计算资源的浪费，因此就有了服务端静态站点生成 （Static Site Generation SSG）这项优化技术。

SSG允许开发者指定部分页面，在项目打包编译时，就提前生成静态页面HTML文件，随服务端应用部署后，直接将HTML文件作为响应返回给用户。

从而避免执行服务端渲染，减少运行开销，节省服务器硬件资源，减少金钱开销。

  


在SSR的基础上实现SSG并不复杂，下面我们在上文SSR示例项目的基础上，继续演示如何为其实现SSG，将这一博客项目的指定文章页通过SSG处理成静态页面。

> 完整示例请参考《feat: SSR to SSG》：https://github.com/JuniorTour/fe-optimization-demo/pull/5

#### 1. 生成静态页面 staticGenerator

首先，我们需要编写核心的生成静态页面逻辑，原理是利用`renderToString`API 和Node.js的文件读写能力`fs`模块，将单次渲染的结果，保存为独立HTML文件，供后续用户响应复用：

``` js
// server\staticGenerator.tsx
import { renderToString } from 'react-dom/server';
import { App } from '../src/app/ui/app/app';
import { history } from '../src/shared/router';
import { staticPages } from './staticPagesConfig';
import { getIndexHTMLTemplate, saveToFile, urlToFileName } from './utils';

async function staticGenerator({ url, getStaticData }) {
  // eslint-disable-next-line no-console
  console.log(`staticGenerator start for ${url}`);

  history.push(url);
  // 参考 Next.js 的 getStaticProps：https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation
  await getStaticData({ url });
  // eslint-disable-next-line no-console
  console.log(`staticGenerator getStaticData finish for ${url}`);

  const markup = renderToString(<App />);

  const fileName = urlToFileName(url);
  saveToFile(
    fileName,
    getIndexHTMLTemplate().replace(
      '<div id="root"></div>',
      `<div id="root">${markup}</div>`,
    ),
  );
  // eslint-disable-next-line no-console
  console.log(`staticGenerator finish for ${fileName}`);
}

// staticGenerator('article/example', async () => {
//   // 取回异步数据，供渲染DOM
// });
```

这段代码中，我们声明了`staticGenerator`函数，接收一个对象作为参数，从中获取2个属性：

-   `url`：需要生成静态页面的URL，例如某一篇文章`article/If-we-quantify-the-alarm...`。
-   `getStaticData`：为静态页面获取异步数据，例如文章页的文章内容，以便完整渲染DOM。

  


另外，为了独立运行SSG的逻辑，我们也要为其配置独立的Webpack配置和`package.json`脚本命令，有了上文中SSR的基础，我们的配置并不复杂，代码如下：

``` js
// webpack\server-static-generation.config.js
const { merge } = require('webpack-merge');
const path = require('path');
const serverConfig = require('./server.config');

module.exports = merge(serverConfig, {
  entry: path.resolve(__dirname, '../server/staticGenerator.tsx'),
  output: {
    filename: 'staticGenerator.js',
  },
});
```

``` json
"scripts": {
    "build-ssg": "cross-env NODE_ENV=production BUILD_SERVER=true webpack --config ./webpack/server-static-generation.config.js",
    "run-ssg": "node ./dist/staticGenerator.js",
    "build-run-ssg": "npm run build-ssg && npm run run-ssg",
}    
```

  


#### 2. 处理服务端客户端状态同步问题

SSG 的一大难点就是如何处理好服务端客户端数据同步问题。

具体来说，我们想要实现对博客文章页进行SGG处理，那就需要我们能在服务端获取到文章页所需的各类数据，以便渲染出包括文章页内容文字在内的完整DOM。

通常的解决方案是，配合前端应用的状态管理工具，在服务端加载所需数据，供`renderToString`时获取并渲染。

对于我们的示例项目来说，我们只需要在服务端`renderToString`运行前，调用前端更新状态用的`getArticleFx`方法，提前获取到文章页所需的文章内容数据即可。

我们通过`staticGenerator()`接受的`getStaticData`方法来实现这一逻辑，在指定的SSG页面配置`staticPages`中，我们将`getStaticData`赋值为调用`await getArticleFx()`的异步函数。

``` js
// server\staticPagesConfig.ts
import { getArticleFx } from '../src/pages/article/model/store';

export const staticPagesURL = [
  '/article/If-we-quantify-the-alarm-we-can-get-to-the-FTP-pixel-through-the-online-SSL-interface!-120863',
  '/article/You-cant-transmit-the-firewall-without-copying-the-1080p-SDD-interface!-120863',
];

async function articlPageGetStaticData({ url }) {
  await getArticleFx(url.split('article/')?.[1]);
}

export const staticPages = [
  {
    url: staticPagesURL[0],
    getStaticData: articlPageGetStaticData,
  },
  {
    url: staticPagesURL[1],
    getStaticData: articlPageGetStaticData,
  },
];
```

这样，当我们执行`npm run build-run-ssg`，服务端运行`staticGenerator({ url, getStaticData })`时，就能在`renderToString`执行渲染前，加载好文章页所需文章内容数据，最终渲染得到的DOM中，就会包含我们想要的文章内容DOM：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a1709137f4e40f1a91fa60027603fe3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=1030&s=345457&e=png&b=1c1c1c)

  


#### 3. 改造SSR逻辑跳过SSG页面渲染

最后，对于已经生成了静态HTML的页面，我们还要改造SSR逻辑，对这些页面跳过执行`renderToString`的逻辑，直接读取本地文件系统中的静态HTML，作为HTTP响应，返回给用户的请求。

``` js
// server\renderer.tsx
export async function serverRenderer(req, res) {
  const context: StaticRouterContext = {};

  const reqUrl = req.url;
  if (staticPagesURL.includes(reqUrl)) {
    // eslint-disable-next-line no-console
    console.log(`SSG run for: (${reqUrl})`);

    res.send(
      getDistHTMLContent(`./${StaticPagesFolderName}/${urlToFileName(reqUrl)}`),
    );

    return;
  }

  history.push(reqUrl);

  const markup = renderToString(<App />);
  // ...
}
```

通过这样的改造，每一次用户请求文章页时，服务器就不再需要重复执行`renderToString()`，可以节省服务器SSR运行耗时，减少服务器负担，从而节省服务器硬件资源，解决SSR的部分痛点。

> 很多著名的静态站点生成工具，都是基于类似的代码逻辑实现的，例如：
>
> -   [docusaurus 的 renderStaticApp()](https://github.com/facebook/docusaurus/blob/791da2e4a1a53aa6309887059e3f112fcb35bec4/packages/docusaurus/src/client/serverRenderer.tsx#L12)
> -   [Next.js 的 SSG](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation)：我们实现的`getStaticData`就类似其`getStaticProps`API。

  


但是，SSG也有其痛点：

-   首先，SSG只适用于**完全静态的页面**，如果页面中一小部分需要在SSR时动态变化，SSG就难以实现。
-   其次，对于有大量 SSG 页面的前端项目，每个页面都需要等待异步数据加载完成，并执行`renderToString`渲染，会导致项目的完整构建耗时相当漫长，开发体验较差。

  


### 2. 增量静态页面再生 ISR Incremental Static Regeneration

为了进一步解决SSG的这些痛点，**增量静态页面再生(ISR，Incremental Static Regeneration)** 技术应运而生。

ISR通过将单次`renderToString()`渲染的结果**缓存**，并设置缓存有效期，来实现既减少重复渲染，节省服务端资源，又避免构建耗时太长的需求。

简单来说，ISR的逻辑用这9行伪代码就可以说清：

``` js
function ISRRender(context) {
    let ret
    const hasCache = validateCache(context)
    if (hasCache) {
        ret = getCache(context)
    } else {
        ret = doRender(context)
    }
    return ret
}
```

  


ISR可以应用于内容更新的实时性不强，能接受一定时间更新延迟的**非静态页面** **。** 例如商品详情页、用户信息页、热门榜单页等，这些页面：

-   一定时间内，内容不会更新，处于相对静止状态，服务端渲染的结果可以被缓存下来复用。
-   但也需要定时地更新内容，例如商品销量增加、热榜内容变化、用户信息修改时，那么服务端渲染就要再次执行，从而渲染出最新的页面DOM。

  


下面我们继续基于示例项目，演示实现ISR的主要流程和核心原理。

> 完整代码示例《feat: SSR to ISR》：https://github.com/JuniorTour/fe-optimization-demo/pull/6

#### 1. LRU缓存

首先我们要基于LRU缓存实现一套高效的缓存系统，用于读写SSR的渲染结果。

> 注：LRU缓存（Least Recently Used Cache）是一种致力于提高缓存命中率、并节省读写缓存成本的缓存算法策略。

示例代码：

``` js
// server\IncrementalStaticRegeneration\cache.ts
import { log } from 'console';
import LRUCache from 'lru-cache';

interface Cache<CacheVal> {
  lruCache: LRUCache<string, CacheVal>;
}

class Cache<CacheVal> implements Cache<CacheVal> {
  constructor({ max }: { max: number }) {
    this.lruCache = new LRUCache({
      noDisposeOnSet: true, // 只在超过 max 时，触发 dispose
      max,
      dispose: (key: string) => {
        log(`ISR cache ${key} dispose`);
      },
    });
  }

  remove(key: string) {
    this.lruCache.del(key);
  }

  // maxAge unit: ms
  set(path: string, data: CacheVal, maxAge?: number) {
    if (!data) return;

    this.lruCache.set(path, data, maxAge);
  }

  get(path: string) {
    if (!path) return null;

    return this.lruCache.get(path);
  }

  size() {
    return this.lruCache.length;
  }
}

export default Cache;
```

使用上述代码，我们以面向对象的模式，实现了一个`Cache`类，封装了开源库`lru-cache`的读（`get`）写（`set`）逻辑，并利用其自带的`maxAge`参数来实现ISR对服务端渲染结果定期更新的需求。

> 注：`lru-cache`默认将缓存数据保存在内存中，用占据内存空间换取节省CPU运行时间。
>
> 如果担心内存占用太多，我们可以自行修改缓存读写实现逻辑，替换LRU的保存在内存中的形式。
>
> 例如，基于Node.js的`fs`模块，改为缓存到本地文件系统中。

#### 2. 封装带缓存的ISR渲染器类

其次，为了方便地使用上述缓存类，我们继续封装一个ISR渲染器类，为SSR渲染接入提供方便的配置和方法，核心代码逻辑如下：

``` js
import Cache from './cache';

/**
 * 静态再生渲染器
 * 支持将「doRender()」参数的返回结果缓存到内存中，
 * 并指定缓存有效时长（revalidate）和缓存的key（staticPath）。
 *
 * 可用于缓存指定路由的 SSR 渲染结果，以节省服务端资源。
 *
 * RFC：TODO
 * 使用文档：TODO
 */
class IncrementalStaticRegenerationRender<CacheVal = string> {
  cache;

  doRender: DoRender<CacheVal>;

  normalizeRenderResult?: NormalizeRenderResult<CacheVal>;

  renderName: string;

  constructor({
    max,
    doRender,
    normalizeRenderResult,
    renderName,
  }: {
    max: number;
    doRender: DoRender<CacheVal>;
    normalizeRenderResult?: NormalizeRenderResult<CacheVal>;
    renderName: string;
  }) {
    this.cache = new Cache<CacheVal>({ max });
    this.doRender = doRender;
    if (normalizeRenderResult) {
      this.normalizeRenderResult = normalizeRenderResult;
    }
    this.renderName = renderName || 'Unknown';
  }

  saveCache(
    data: RenderData<CacheVal>,
    staticPath: string,
    renderResult: CacheVal,
    revalidate: number,
  ) {
    // 使用 staticPath 作为缓存的 key
    this.cache.set(staticPath, renderResult, revalidate);
  }

  // eslint-disable-next-line class-methods-use-this
  getOptions(
    data: RenderData<CacheVal>,
    path: string,
    pathConfig: PathConfig<CacheVal> | undefined,
  ) {
    const revalidate = pathConfig?.revalidate || 0;
    const getStaticPath = pathConfig?.getStaticPath || (() => path);
    const staticPath = getStaticPath(path, data);

    return {
      staticPath,
      revalidate,
    };
  }

  cacheSize(): number {
    return this.cache.size();
  }

  removeCache(key: string) {
    this.cache.remove(key);
  }

  render(data: RenderData<CacheVal>): CacheVal {
    const { revalidate, staticPath } = this.getOptions(
      data,
      data.path,
      data.pathConfig,
    );

    const routeIsStatic = Boolean(revalidate);
    const cache = routeIsStatic ? this.cache.get(staticPath) : null;
    const hasCache = Boolean(cache);
    // eslint-disable-next-line no-param-reassign
    data.routeIsStatic = routeIsStatic; // 用于 normalizeRenderResult 内部判断

    let res = cache || this.doRender(data);

    if (routeIsStatic && !hasCache) {
      this.saveCache(data, staticPath, res, revalidate);
    }

    if (typeof this.normalizeRenderResult === 'function') {
      // eslint-disable-next-line no-param-reassign
      data.res = res;
      res = this.normalizeRenderResult(data);
    }

    return res;
  }
}

export default IncrementalStaticRegenerationRender;
```

在这段代码中，我们把`LRU`缓存类声明成了ISR渲染器类的属性`this.cache = new Cache<CacheVal>({ max });`，并通过提供`render(data: RenderData<CacheVal>): CacheVal` 供SSR运行时调用，获取带有缓存的渲染结果。

这个类的核心逻辑是：

-   `const cache = routeIsStatic ? this.cache.get(staticPath) : null;`
-   `let res = cache || this.doRender(data);`

这2行代码，其判断SSR渲染的目标，是否已经有缓存，如果有，则直接读取返回缓存。如果没有，再执行渲染逻辑（`doRender`）。


#### 3. ISR引入SSR

最后，我们改造已有的SSR逻辑，引入ISR渲染器，并提供需要开启ISR的路由配置。

``` js
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouterContext } from 'react-router';
import { log } from 'console';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { App } from '../src/app/ui/app/app';
import { history } from '../src/shared/router';
import { DIST } from '../webpack/constants';
import IncrementalStaticRegenerationRender, {
  PathConfig,
} from './IncrementalStaticRegeneration/renderer';

function doRender({ ctx }) {
  log(`doRender run`);
  let markup = '';
  try {
    markup = renderToString(<App />);
  } catch (err) {
    console.error('renderToString', err, ctx.url);
  }

  return {
    // 如有需要，可以自由添加其他数据用于缓存，例如 react-helmet 的渲染结果
    markup,
  };
}

export const appRenderer = new IncrementalStaticRegenerationRender({
  // 如果「缓存数量超过最大值删除次数」：https://gf.in.zhihu.com/d/VyQnbK1nz/jing-tai-ye-mian-zai-sheng-isr?orgId=1&var-app=heifetz-errorpage&var-RouteName=NotFoundErrorPage&from=now-15d&to=now&viewPanel=19
  // 其中的 dispose.start.count 指标触发数量较高，就该考虑加大「缓存最大数量：max」了
  max: 100 * 1000,
  doRender,
  renderName: 'AppRender',
});

const PathConfigs: PathConfig<{ markup: string }>[] = [
  {
    matchPath(path) {
      return /article/(.*)/.test(path);
    },
    // 对于文章页，我们期望每 10 秒，更新一次缓存，也即更新一次服务端渲染的结果：
    revalidate: 10 * 1000, // 10 seconds
    getStaticPath(path /* , renderData: RenderData<string> */) {
      // 对于每一个文章页，都以其path作为缓存的 key
      return path;
    },
  },
  {
    matchPath(path) {
      return /^/login$/.test(path);
    },
    // 对于登录页，我们期望每 180 秒，更新一次缓存，也即更新一次服务端渲染的结果：
    revalidate: 180 * 1000, // 180 seconds
    getStaticPath() {
      // 对于登录页，将固定值 'login' 作为缓存的 key
      return 'login';
    },
  },
  // // 热门榜单页示例
  // {
  //   matchPath(path) {
  //     return /hot/.test(path);
  //   },
  //   // 对于热门榜单页，我们期望每 1 秒，更新一次缓存，也即更新一次服务端渲染的结果：
  //   revalidate: 1 * 1000, // 1 seconds
  //   getStaticPath() {
  //     return 'hot';
  //   },
  // },
];

function getPathConfig(path) {
  return PathConfigs.find((config) => config.matchPath(path));
}

function getISRRenderResult({ path, ctx }) {
  const { markup } = appRenderer.render({
    path,
    ctx,
    pathConfig: getPathConfig(path),
  });

  return markup;
}

export function serverRenderer(req, res) {
  const context: StaticRouterContext = {};

  const reqUrl = req.url;
  history.push(reqUrl);
  log(`reqUrl=${reqUrl}`);

  const markup = getISRRenderResult({
    path: reqUrl,
    ctx: {
      history,
      redirect(statusCode, url) {
        return res.redirect(statusCode, url);
      },
    },
  });
 
  // res.send(...)
}
```

在对SSR的改造中，我们把调用`renderToString(<App />)`的逻辑封装成了独立的方法`doRender({ ctx })`。

并把这一方法作为了声明ISR渲染器的参数，得到了`appRenderer`这个ISR渲染器实例：

``` js
export const appRenderer = new IncrementalStaticRegenerationRender({
  // 如果「缓存数量超过最大值删除次数」：https://gf.in.zhihu.com/d/VyQnbK1nz/jing-tai-ye-mian-zai-sheng-isr?orgId=1&var-app=heifetz-errorpage&var-RouteName=NotFoundErrorPage&from=now-15d&to=now&viewPanel=19
  // 其中的 dispose.start.count 指标触发数量较高，就该考虑加大「缓存最大数量：max」了
  max: 100 * 1000,
  doRender,
  renderName: 'AppRender',
});
```

SSR服务器运行时，我们改为使用`appRenderer.render()`方法来获取渲染结果，当用户重复请求我们通过`PathConfigs`指定的有缓存页面时，`appRenderer.render()`方法会直接从内存中读取缓存，而不是再次重复执行`doRender()`。

例如下面这段代码就是，我们在`PathConfigs`中对一个页面声明了开启ISR的配置：

``` js
  {
    matchPath(path) {
      return /article/(.*)/.test(path);
    },
    // 对于文章页，我们期望每 10 秒，更新一次缓存，也即更新一次服务端渲染的结果：
    revalidate: 10 * 1000, // 10 seconds
    getStaticPath(path /* , renderData: RenderData<string> */) {
      // 对于每一个文章页，都以其path作为缓存的 key
      return path;
    },
  },
```

这段配置通过`matchPath`方法，判断用户请求页面的URL是否需要被ISR缓存，并通过`revalidate`属性指定缓存时长为10秒钟，即每10秒钟，通过再次执行`doRender()`更新一次缓存。

并且，每个文章页的缓存用各自的URL作为key保存，每一篇文章都有各自的缓存，就避免了缓存重复或覆盖。

> ISR的配置还可以通过前端路由的属性配置，可以使用`react-router`自带的`match()`方法实现，例如：
>
> ``` js
> // 404页面：固定 key cache
> <Route
>   revalidateTime={10 * 1000}
>   getStaticPath={() => 'NotFoundPage'}
>   key='/404'
>   name='NotFoundErrorPage'
>   path='/404'
>   component={NotFoundPage}
> />
> ```

基于以上代码逻辑，ISR在服务器**运行时**对SSR结果进行缓存，既避免了SSG项目构建时较长的打包编译耗时，又通过缓存避免重复执行`renderToString`，节省了服务器计算资源。

  


## 5. 验证量化和评估

<!---->

### 1. 验证

<!---->

#### 1. 确认功能逻辑正常

前端项目应用SSR、SSG、ISR等优化后，底层渲染方式有颠覆性的变化，所以验证要做的第一件事就是确保原有的功能逻辑正常，尤其是以下3方面：

-   前端路由：例如`react-router`、`vue-router`等前端路由库的跳转、重定向功能是否正常。
-   前端状态管理：例如`redux`、`vuex`、`pinia`等前端状态管理库保存的登录状态是否在服务端和客户端保持一致。
-   依赖前端组件生命周期的业务逻辑：例如`react`框架的`useEffect()`、`useLayoutEffect()`等基于组件渲染生命周期执行的逻辑。

  


#### 2. 对比优化前后FCP、LCP值

本地环境的FCP变化可能不明显，因为静态资源加载的网络耗时在本地无法体现，导致SSR首屏内容不依赖JS执行，从而较快渲染的特性无法发挥。

但是部署到生产环境后，SSR优化前后，FCP、LCP指标的差异将非常显著，为了便于准确评估对比优化前后的状态，我们选择使用指标的值，作为统计指标。

另外，也可以通过在本地环境，给静态资源加载加上统一的延迟时间，来模拟生产环境CDN加载的状态。在此基础上进行10次以上的测量，统计FCP、LCP的值，预计能观察显著的变化。

  


笔者基于上述验证方式，在本地环境，测量了示例项目首页的数据，观察到了显著的优化效果，FCP值减少了72%：

| 对比项 / FCP值 | 优化前（**CSR**）（单位：秒） | 优化后（**SSR**） | 差异             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| 平均值        | 3.94 | 1.08 | -2.86s (-72%) |
| 最大值        | 4.11 | 1.14 | -2.97s (-72%) |
| 最小值        | 3.78 | 1.07 | -2.71s (-71%) |
| 数据来源       | ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16b7fec80c2b41c7956d0164d4fccd8c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=848&h=317&s=46211&e=png&b=171a1f) | ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa3f47b8d38d457f80c652e2122294c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=844&h=311&s=47026&e=png&b=181b20) | |

LCP 值也有38%以上显著的减少：
 
| 对比项 / FCP值 | 优化前（**CSR**）（单位：秒） | 优化后（**SSR**） | 差异               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| 平均值        | 6.34 | 2.85 | -3.39s (-55.0%) |
| 最大值        | 8.23 | 5.03 | -3.2s (-38.9%)  |
| 最小值        | 5.21 | 1.07 | -4.14s (-79.5%) |
| 数据来源       | ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfb3542ed230451090e4c31a2c76617c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=842&h=311&s=44750&e=png&b=181b20) | ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1696fb167a7e4d4aa75fbd761ff1ee7d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=841&h=304&s=49229&e=png&b=181b20) |                  |

当然这些数据来自于本地环境的单台设备，不足以代表生产环境中海量真实用户的体验，想要准确评估优化效果，还需要从生产环境中收集更多数据，并配合其他量化措施。

  


### 2. 量化

<!---->

#### 1. FCP和LCP的评分指标

本节介绍到SSR相关优化，因为直接将渲染后的HTML作为响应返回用户，所以会使页面的初始化渲染显著变快，进而对FCP和LCP指标产生明显的优化效果。

我们可以继续使用第2节《前端优化数据量化必备神器-用户体验数据收集与可视化》建立的`web-vitals`堆**叠百分比图**作为量化指标。

  


#### 2. 自定义服务端渲染耗时指标

我们还可以用之前章节介绍过的Performance API的`performance.measure()`方法，建立自定义指标，统计Node.js执行SSR的耗时，量化SSG、ISR优化的效果。

首先我们声明3个辅助函数，分别创建开始`markStart()`、结束`markEnd()`、测量结果`measureSSRRenderDuration()`3类性能记录，并且在`reportGauge()`中复用我们的收集数据的HTTP接口，用来在服务端上报数据到Grafana。

完整代码示例如下：

``` js
import fetch from 'node-fetch';

const SSRRenderMark = 'SSRRenderMarks';
const SSRRenderMarks = {
  start: `${SSRRenderMark}_start`,
  end: `${SSRRenderMark}_end`,
};

function reportGauge(name, help, labels, value) {
  fetch('http://localhost:4001/gauge-metric', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      help,
      labels,
      value,
    }),
  });
}

export function markStart(detail) {
  performance.mark(SSRRenderMarks.start, { detail });
}
export function markEnd(detail?) {
  performance.mark(SSRRenderMarks.end, { detail });
}

const SSRRenderDurationName = 'ssr-render-duration';
export function measureSSRRenderDuration() {
  const ret = performance.measure(SSRRenderDurationName, {
    start: SSRRenderMarks.start,
    end: SSRRenderMarks.end,
  });

  // 还可以通过 getEntriesByName 获取请求URL reqUrl
  // performance.getEntriesByName(SSRRenderMarks.start)?.[0].detail.reqUrl

  reportGauge(SSRRenderDurationName, `SSR render time cost`, {}, ret.duration);
}
```

使用时，在任意模块的对应SSR开始、结束的代码逻辑中调用即可获取渲染耗时数据，示例代码如下：

``` js
app.get('*', (req, res) => {
  // 演示 performance.mark() 方法跨模块自由调用的特性
  markSSRStart({ reqUrl: req.url });
  serverRenderer(req, res);
});

export function serverRenderer(req, res) {
  // const markup = getISRRenderResult({...
  markSSREnd();
  
  // res.send(...
  measureSSRRenderDuration();
}
```

  


### 3. 评估

<!---->

#### 1. FCP和LCP评分显著改善

通过应用SSR相关优化，我们应该能观察到`web-vitals`堆**叠百分比图**中的FCP和LCP用户体验指标显著改善，表示用户在客户端访问页面时，页面渲染内容更快，用户体验更好。

  


#### 2. 服务端渲染耗时大幅减少

另外，通过`performance.measure()`统计的服务端渲染耗时指标，通过SSG和ISR优化，预期也会有显著的优化，笔者在本地开发环境观察到服务端渲染耗时，平均减少了34%左右，优化效果显著。

| 对比项 / SSR 渲染耗时 | 优化前（**仅SSR**）（单位：秒） | 优化后（**ISR**） | 差异               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| 平均值            | 3.24 | 2.12 | -1.12s (-34.6%) |
| 最大值            | 5.05 | 4.38 | -0.67s (-13.3%) |
| 最小值            | 1.62 | 0.64 | -0.98s (-60.5%) |
| 数据来源           | ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4da585be72504e0f9fa93c9675f92792~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1456&h=314&s=55460&e=jpg&b=171a1f) | ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14a480cdedd04c8aba16cd924e5cc590~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1452&h=317&s=59756&e=jpg&b=181b20) | |

这一指标的减少，表示服务端优化后，在相同的时间内，能处理更多的用户请求，服务器的负载能力更高，相应地可以节省一部分的服务器硬件开销。

  


## 小结

这2节《前端渲染进化史》中，我们首先回顾了前端应用渲染方式的简略历史。

接下来就转向深入了解SSR的原理，并将示例的CSR项目重构成了SSR项目，讲解了其核心流程。

又进一步介绍了SSG、ISR等服务端渲染进阶优化方案及其代码实现和改造示例。