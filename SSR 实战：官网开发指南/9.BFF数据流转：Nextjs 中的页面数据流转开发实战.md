> 本节课程涉及 CMS 和 Demo 两个仓库地址
>
> CMS 仓库地址：https://github.com/czm1290433700/nextjs-cms
>
> Demo 仓库地址： https://github.com/czm1290433700/nextjs-demo



上一节课我们对需要的 layout 数据进行相关的可视化配置，通过访问 http://localhost:1337/api/layouts?populate=deep 可以拿到我们需要的数据。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/543876adb1bc49e2afac0437eae0789b~tplv-k3u1fbpfcp-watermark.image?)

不过这样的数据是有一些乱的，有几个可以优化的点：

-   请求参数`populate=deep`是每次请求都需要带上的，我们需要所有深度的数据；

<!---->

-   我们需要的是 data 中的数据，layout 只有一个，不需要分页相关的部分（meta）；

<!---->

-   针对每个结构体，Strapi 为它们套上了 attributes 和 id，这个是不利于我们调用的，因为没有覆盖对应 ts 类型，会增加很多不必要的调试成本；

<!---->

-   每个结构体都加上了 createdAt、 publishedAt、updatedAt 三个字段，实际上针对这个需求，我们是不需要这些字段的，随着接口层级的增加，过多不被使用的字段会增加我们接口的复杂度和可维护性

# CMS 接口优化

现在，根据上面说的几个问题，我们来优化一下我们定义的 CMS 接口，下面的内容基于https://github.com/czm1290433700/nextjs-cms 仓库，同学们可以对着仓库一步步来实践。

1.  ## 自定义返回 & 移除非必要属性

同学们应该还记得，上一节课我们在介绍项目结构的时候，有提到 src/api/* 的目录下，存放着我们结构体接口的定义，其中 controllers 存放着接口的控制器，每当客户端请求路由时，操作都会执行业务逻辑代码并发回响应，我们可以在其中重写 api 的相关方法（find、findOne、 update 等）。

以 layout 为例，我们首先为 layout 接口加上默认的`populate=deep`参数，这样我们每次请求的时候就不用再加了。

```
// ./src/api/layout/controllers/layout.js
"use strict";

/**
 *  layout controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::layout.layout", ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: "deep",
    };
    const { data } = await super.find(ctx);
    return data;
  },
}));
```

这时候我们再尝试直接访问 http://localhost:1337/api/layouts，可以看到已经不需要加 populate 参数就可以拿到联表的数据了。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46338106abb74480838ba34f68e23585~tplv-k3u1fbpfcp-watermark.image?)

然后咱们针对上面提到的 attributes、id 和时间相关的字段定义两个深度遍历的函数来对应去除。

```
// ./src/utils/index.js
/**
 * 移除对象中自动创建的时间字段
 * @param obj
 * @returns
 */
const removeTime = (obj) => {
  const { createdAt, publishedAt, updatedAt, ...params } = obj || {};
  Object.getOwnPropertyNames(params).forEach((item) => {
    if (typeof params[item] === "object") {
      if (Array.isArray(params[item])) {
        params[item] = params[item].map((item) => {
          return removeTime(item);
        });
      } else {
        params[item] = removeTime(params[item]);
      }
    }
  });
  return params;
};

/**
 * 移除属性和id
 * @param {*} obj
 * @returns
 */
const removeAttrsAndId = (obj) => {
  const { attributes, id, ...params } = obj || {};
  const newObj = { ...attributes, ...params };
  Object.getOwnPropertyNames(newObj).forEach((item) => {
    if (typeof newObj[item] === "object") {
      if (Array.isArray(newObj[item])) {
        newObj[item] = newObj[item].map((item) => {
          return removeAttrsAndId(item);
        });
      } else {
        newObj[item] = removeAttrsAndId(newObj[item]);
      }
    }
  });
  return newObj;
};

module.exports = {
  removeTime,
  removeAttrsAndId,
};
```

然后我们对 layout 的 find 函数返回的数据调用进行处理。

```
// ./src/api/layout/controllers/layout.js
"use strict";
const { removeTime, removeAttrsAndId } = require("../../../utils/index.js");

/**
 *  layout controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::layout.layout", ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: "deep",
    };
    const { data } = await super.find(ctx);
    return removeAttrsAndId(removeTime(data[0]));
  },
}));
```

再访问 http://localhost:1337/api/layouts 试试，可以看到已经精简很多了，只包含了我们需要的元信息。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/debbd36bccb7402b9676856bdfcbcf23~tplv-k3u1fbpfcp-watermark.image?)

2.  ## 接口增加跨域限制

Strapi 的接口默认不做跨域限制的，这样所有的域名都可以调用我们的接口，安全性是存在问题的，我们可以在掘金下调用试试。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cb280e7f1ab40aa822bb67e6af48692~tplv-k3u1fbpfcp-watermark.image?)

没有跨域的报错，我们预期允许访问的域名只有 http://localhost:3000 和 http://localhost:1337。我们上节课有提到 config 中有相关的中间件配置，我们可以在 config/middlewares.js 中加上跨域的限制。

```
// ./config/middlewares.js
module.exports = [
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      headers: "*",
      origin: ["http://localhost:3000", "http://localhost:1337"],
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
```

然后我们再到掘金中试一下，发现已经会有跨域的警告了。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa3a093725c44638ab7e7a50c8a6cd80~tplv-k3u1fbpfcp-watermark.image?)

# BFF 接口定义

CMS 接口配置好了以后还不能直接在页面中调用，我们需要配置一层 BFF 层，即服务于前端的数据层。因为我们通常配置的数据是站在结构体的角度的，并不一定可以由前端调用，往往还需要复杂的数据处理，为了提高数据层的复用程度，我们增加 BFF 层，将 CMS 接口包一层，进行相关处理后，前端页面只调用我们定义的 BFF 层接口，不直接与 CMS 配置的接口产生交互。

在定义接口前，我们得先来了解一下 Nextjs 接口的路由是怎么配置的?

与静态页面类似，Nextjs 接口也采用文件约定式路由的方式进行配置，可以分为预定义路由、动态路由和全捕获路由，如下面的例子：

```
// ./pages/api/home/test.js => api/home/test 预定义路由
// ./pages/api/home/[testId].js => api/home/test, api/home/1, api/home/23 动态路由
// ./pages/api/home/[...testId].js => api/home/test, api/home/test/12 全捕获路由
```

如果一个相同的路由，比如`api/home/test`，按照优先级来匹配三者，会按照预定义路由 > 动态路由 > 全捕获路由的顺序来匹配。

这也很好理解，因为三者匹配的精准度是逐渐下降的，如果说预定义路由是精准匹配，后两者只是模糊匹配，虽然也满足匹配场景，但是只是作为兜底，优先会以预定义路由为准。

知道了 Api 路由的原理，下面来开发我们的 BFF 层，首先定义一个接口层 `./pages/api/layout.ts`， 因为后续我们会经常用到本地域名 和 CMS 域名，所以我们拿一个变量来存储它们，后续根据环境区分也很方便。

```
// ./utils/index.ts
export const LOCALDOMAIN = "http://127.0.0.1:3000";
export const CMSDOMAIN = "http://127.0.0.1:1337";
```

```
// ./pages/api/layout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { ILayoutProps } from "../../components/layout";
import { CMSDOMAIN } from "@/utils";
import { isEmpty } from "lodash";

const getLayoutData = (
  req: NextApiRequest,
  res: NextApiResponse<ILayoutProps>
) => {
  axios.get(`${CMSDOMAIN}/api/layouts`).then((result) => {
    const {
      copy_right,
      link_lists,
      public_number,
      qr_code,
      qr_code_image,
      site_number,
      title,
    } = result.data || {};

    res.status(200).json({
      navbarData: {},
      footerData: {
        title,
        linkList: link_lists?.data?.map((item: any) => {
          return {
            title: item.title,
            list: item?.links?.data?.map((_item: any) => {
              return {
                label: _item.label,
                link: isEmpty(_item.link) ? "" : _item.link,
              };
            }),
          };
        }),
        qrCode: {
          image: `${CMSDOMAIN}${qr_code_image.data.url}`,
          text: qr_code,
        },
        copyRight: copy_right,
        siteNumber: site_number,
        publicNumber: public_number,
      },
    });
  });
};

export default getLayoutData;
```

这部分代码有两个需要稍微提一下的地方：

-   NextApiResponse 类型是 Nextjs 提供的 response 类型，它提供了一个泛型，来作为整个接口和后续请求的返回，我们可以把需要的数据类型作为泛型传进去，保证整体代码有 ts 的 lint。

<!---->

-   这里我们返回数据用的是 json，针对数据的响应，Nextjs 有提供下面的响应 Api， 大家可以根据自己的需求选用不同的响应 Api。

    -  > -   `res.status(code)`- 设置状态码的功能。`code`必须是有效的HTTP 状态码。
        >
        > <!---->
        >
        > -   `res.json(body)`- 发送 JSON 响应。`body`必须是可序列化的对象。
        >
        > <!---->
        >
        > -   `res.send(body)`- 发送 HTTP 响应。`body`可以是 a `string`，an`object`或 a`Buffer`。
        >
        > <!---->
        >
        > -   `res.redirect([status,] path)`- 重定向到指定的路径或 URL。`status`必须是有效的HTTP 状态码。如果未指定，`status`默认为“307”“临时重定向”。
        >
        > <!---->
        >
        > -   `res.revalidate(urlPath)`-使用.按需重新验证页面`getStaticProps`。`urlPath`必须是一个`string`。

到这里我们 BFF 接口就定义好了，我们改造一下 layout 部分的数据注入，换用接口数据。

```
// ./pages/_app.tsx
import "../styles/globals.css";
import type { AppProps, AppContext } from "next/app";
import App from "next/app";
import { Layout, ILayoutProps } from "@/components/layout";
import Head from "next/head";
import axios from "axios";
import { LOCALDOMAIN } from "@/utils";

const MyApp = (data: AppProps & ILayoutProps) => {
  const { Component, pageProps, navbarData, footerData } = data;

  return (
    <div>
      <Head>
        <title>A Demo for 《深入浅出SSR官网开发指南》</title>
        <meta
          name="description"
          content="A Demo for 《深入浅出SSR官网开发指南》"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout navbarData={navbarData} footerData={footerData}>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const pageProps = await App.getInitialProps(context);
  const { data = {} } = await axios.get(`${LOCALDOMAIN}/api/layout`);

  return {
    ...pageProps,
    ...data,
  };
};

export default MyApp;
```

启动一下页面访问 http://localhost:3000 看一下效果，可以看到已经可以了。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/146162b5192e46d8821953f4e8317ab8~tplv-k3u1fbpfcp-watermark.image?)

# 中间件小彩蛋

使用过 Express 的同学应该知道中间件的概念，Express 是基于路由和中间件的框架，通过链式调用的方式来对接口进行一些统一的处理，不过 Nextjs 中没有这样的概念，因为约定式路由的关系， Nextjs 中更多是模块的调用思想，针对接口的请求类型只是一个判断搞定。

```
export default (req, res) => {
  if (req.method === 'GET') {
    // do something for the get scene
  } else if (req.method === 'POST') {
    // do something for the post scene
  }
}
```

对于相关中间件的调用，也只需要引入模块执行即可， 例如下面 Nextjs 官网调用跨域中间件的例子：

```
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

async function handler(req, res) {
  // Run the middlewareawait runMiddleware(req, res, cors)
  // Rest of the API logic
  res.json({ message: "Hello Everyone!" });
}

export default handler;
```

我个人也是更推荐这种写法的，模块化的写法使得代码结构更为清晰，复用性上也更舒服，符合平常客户端的开发方式，不过习惯 Express 开发模式的同学也可以按照下面的方式来适配一下对应的能力，开源社区有开发提供了 next-connect 的依赖来补全这部分的能力，我们先来安装一下依赖。

```
npm install next-connect -save
```

然后上面的 layout 接口按照下面改造一下即可。

```
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { ILayoutProps } from "../../components/layout";
import { CMSDOMAIN } from "@/utils";
import { isEmpty } from "lodash";
import nextConnect from "next-connect";

const getLayoutData = nextConnect()
  // .use(any middleware)
  .get((req: NextApiRequest, res: NextApiResponse<ILayoutProps>) => {
    axios.get(`${CMSDOMAIN}/api/layouts`).then((result) => {
      const {
        copy_right,
        link_lists,
        public_number,
        qr_code,
        qr_code_image,
        site_number,
        title,
      } = result.data || {};

      res.status(200).json({
        navbarData: {},
        footerData: {
          title,
          linkList: link_lists?.data?.map((item: any) => {
            return {
              title: item.title,
              list: item?.links?.data?.map((_item: any) => {
                return {
                  label: _item.label,
                  link: isEmpty(_item.link) ? "" : _item.link,
                };
              }),
            };
          }),
          qrCode: {
            image: `${CMSDOMAIN}${qr_code_image.data.url}`,
            text: qr_code,
          },
          copyRight: copy_right,
          siteNumber: site_number,
          publicNumber: public_number,
        },
      });
    });
  });

export default getLayoutData;
```

需要引入中间件，只需要类似 Express 的方式就行了，用 use 来链式调用即可。我更推荐 Nextjs 官网模块调用的写法，相对是更为清晰的，大家可以按照自己的开发习惯自行选用。

# 小结

这两节课我们学习怎么通过 Strapi 搭建一个符合我们自己业务场景的 CMS，并定义了对应的 find 接口用于后续的查询，然后自定义移除了一些不必要的属性，便于接口交互。然后我们定义了自己的 BFF 层，用于我们官网页面数据的注入，整个数据链路我们都已经走完了，后面遇到类似的数据流转，大家也可以举一反三进行开发。

值得一提的是，Strapi 的能力还远不及此，它包含 Api 鉴权，审批配置等更多的能力可以帮助我们进行官网的规范维护，同时它提供了很多 openApi 来支持相关不同的业务场景，是一个非常优秀值得尝试的开源项目。感兴趣和有更多需求的同学可以阅读 [Strapi 官方文档](https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html) 做更多的尝试~

到这节课我们实战篇的内容就全部完成了，学到这里，大家应该对官网项目的静态页面到数据流转都有了较深刻的了解了。从下一节课开始，我们将就一些常见的官网需求展开，就 case 来讲解这些需求场景我们应该怎么去开发实现。
