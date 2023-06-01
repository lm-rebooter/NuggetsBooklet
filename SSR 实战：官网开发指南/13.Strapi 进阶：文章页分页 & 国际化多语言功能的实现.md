> 本节课程涉及 CMS 和 Demo 两个仓库地址
>
> CMS 仓库地址：https://github.com/czm1290433700/nextjs-cms
>
> Demo 仓库地址： https://github.com/czm1290433700/nextjs-demo
>
> 本节课代码内容较多，同学们可以根据学习和理解的情况，拆分成多个模块来学习。

上一节课我们学习了怎么对官网项目进行多媒体适配，我们通过 CSS media，注入设备信息以及服务器端请求获取三种方式实现了不同场景下的多媒体适配。因为 SSR 的特殊性，我们需要针对不同的场景选用合适的适配方法，来达到更理想的效果。

这节课我将来给大家介绍官网中最常见的两个需求，一个是文章页分页，另一个是国际化多语言。

官网作为一个品牌形象的载体，肯定需要大量的文章或是信息，来进行文化价值观的传输，文章的内容一多，我们自然需要为它实现对应的分页。至于国际化多语言，我们的官网不一定是给一个国家的人看的，可能公司或是团队的业务是针对多个地区的，语言不应该成为价值观传输的阻碍，所以如果是多地区业务线的公司，实现多语言也是很必要的，那么这两个功能我们应该怎么去实现呢？

在[08 | 数据可视化：基于 Strapi 实现后台数据的灵活配置](https://juejin.cn/book/7137945369635192836/section/7141544709205262368) 我们通过配置 Strapi 实现了 layout 部分的数据注入，使用了它的 find 接口进行 cdn 层的数据灵活配置，这节课我们将来重新认识我们的老朋友 Strapi，使用它来实现官网常见的文章页分页和国际化多语言的功能。

## 文章页分页

### 样式的实现

我们之前在首页有配置一个静态的六个文章块，不过没有分页，所以我们首先来实现一下静态样式，分页的组件我们可以使用 semi-design 来实现，这是字节跳动抖音前端技术团队推出的一款样式组件库，设计上和易用性上都经过各种大型项目的考验，我们平时业务开发主要也是用它，还是很推荐大家使用的，我们先来装一下依赖。

```
npm install @douyinfe/semi-ui --save
```

然后我们给首页文章块下面加一个分页。

```
// ./pages/index.tsx;
import { Pagination } from "@douyinfe/semi-ui";
// ...
<div className={styles.paginationArea}>
    <Pagination total={articles?.total} pageSize={6} />
</div>
// ...
```

这时候我们发现控制台会有一个编译报错。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50fd9b329735407498d2af8e90b7c86b~tplv-k3u1fbpfcp-watermark.image?)

这个报错的原因是因为 Nextjs 希望我们可以自主导入依赖中的样式，而不是随着依赖直接导入样式，避免稀里糊涂对全局样式造成影响，Semi 的依赖默认是在入口文件统一导入的，针对这种情况，Semi 提供了 semi-next 插件来对入口文件样式进行去除，然后我们再自行导入就可。

```
npm i @douyinfe/semi-next
```

安装好 semi-next 后，我们到 nextjs 的配置文件，用 semi-next 包裹一层配置文件，进行默认导入样式的去除。

```
// ./next.config.js
const path = require("path");

const semi = require("@douyinfe/semi-next").default({});

module.exports = semi({
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    return config;
  },
  images: {
    domains: ["127.0.0.1"],
  },
});
```

接下来，我们在全局样式中手动导入 Semi 的样式，发现报错就没有了。

```
// ./pages/global.scss
@import "~@douyinfe/semi-ui/dist/css/semi.min.css";
```

现在我们可以打开 http://127.0.0.1:3000 来看一下分页的效果。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80b41330318242aa913633133f812dc8~tplv-k3u1fbpfcp-watermark.image?)

因为我们有做主题化，所以 Semi 的样式不能直接在我们页面中用。我们需要针对分页组件覆盖一下主题化的样式，样式覆盖是通过 global 样式去做，通常组件库的样式都会采用普通类的方式，而不是模块化样式，我们都可以在页面中通过 global 去全局覆盖对应类下的样式，达到组件样式自定义。这一块的样式，之前我们是直接复用了脚手架初始化的样式，层级上也比较乱，我们顺便一起梳理一下。

```
@mixin initStatus {
  transform: translate3d(0, 2.5rem, 0);
  opacity: 0;
}

@mixin finalStatus {
  -webkit-transform: none;
  transform: none;
  opacity: 1;
}

.container {
  padding: 0 2rem;
  color: var(--primary-color);

  .main {
    min-height: 100vh;
    padding: 4rem 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title a {
      color: var(--link-color);
      text-decoration: none;
    }

    .title a:hover,
    .title a:focus,
    .title a:active {
      text-decoration: underline;
    }

    .title {
      margin: 0;
      line-height: 1.15;
      font-size: 4rem;
    }

    .title,
    .description {
      text-align: center;
    }

    .description {
      margin: 4rem 0;
      line-height: 1.5;
      font-size: 1.5rem;
    }

    .grid {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      max-width: 50rem;
      transition: 2s;
      .card {
        margin: 1rem;
        padding: 1.5rem;
        text-align: left;
        color: inherit;
        text-decoration: none;
        border: 0.0625rem solid var(--footer-background-color);
        border-radius: 0.625rem;
        transition: color 0.15s ease, border-color 0.15s ease;
        max-width: 18.75rem;
        cursor: pointer;
      }

      .card:hover,
      .card:focus,
      .card:active {
        color: var(--link-color);
        border-color: var(--link-color);
      }

      .card h2 {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
      }

      .card p {
        margin: 0;
        font-size: 1.25rem;
        line-height: 1.5;
      }
    }

    .paginationArea {
      width: 43.125rem;
      display: flex;
      justify-content: flex-end;
      padding: 20px 0;

      :global {
        .semi-page-item {
          color: var(--primary-color);
          opacity: 0.7;
        }

        .semi-page-item:hover {
          background-color: var(--semi-page-hover-background-color);
        }

        .semi-page-item-active {
          color: var(--semi-page-active-color);
          background-color: var(--semi-page-active-background-color);
        }

        .semi-page-item-active:hover {
          color: var(--semi-page-active-color);
          background-color: var(--semi-page-active-background-color);
        }
      }
    }
  }

  .withAnimation {
    .title {
      animation: fadeInDown1 1s;
    }

    .description {
      animation: fadeInDown2 1s;
    }

    .card:nth-of-type(1) {
      animation: fadeInDown3 1s;
    }

    .card:nth-of-type(2) {
      animation: fadeInDown4 1s;
    }

    .card:nth-of-type(3) {
      animation: fadeInDown5 1s;
    }

    .card:nth-of-type(4) {
      animation: fadeInDown6 1s;
    }

    .card:nth-of-type(5) {
      animation: fadeInDown7 1s;
    }

    .card:nth-of-type(6) {
      animation: fadeInDown8 1s;
    }
  }

  @keyframes fadeInDown1 {
    0% {
      @include initStatus;
    }

    11% {
      @include initStatus;
    }

    100% {
      @include finalStatus;
    }
  }

  @keyframes fadeInDown2 {
    0% {
      @include initStatus;
    }

    22% {
      @include initStatus;
    }

    100% {
      @include finalStatus;
    }
  }

  @keyframes fadeInDown3 {
    0% {
      @include initStatus;
    }

    33% {
      @include initStatus;
    }

    100% {
      @include finalStatus;
    }
  }

  @keyframes fadeInDown4 {
    0% {
      @include initStatus;
    }

    44% {
      @include initStatus;
    }

    100% {
      @include finalStatus;
    }
  }

  @keyframes fadeInDown5 {
    0% {
      @include initStatus;
    }

    55% {
      @include initStatus;
    }

    100% {
      @include finalStatus;
    }
  }

  @keyframes fadeInDown6 {
    0% {
      @include initStatus;
    }

    66% {
      @include initStatus;
    }

    100% {
      @include finalStatus;
    }
  }

  @keyframes fadeInDown7 {
    0% {
      @include initStatus;
    }

    77% {
      @include initStatus;
    }

    100% {
      @include finalStatus;
    }
  }

  @keyframes fadeInDown8 {
    0% {
      @include initStatus;
    }

    88% {
      @include initStatus;
    }

    100% {
      @include finalStatus;
    }
  }
}
```

然后我们来看看调整后的效果，还是很理想的。


![f53793d2-8fb2-4518-91b1-082808742bd7.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6bf4dceec7b45da972792a84fd7718e~tplv-k3u1fbpfcp-watermark.image?)

接下来我们对之前的文章页也写一些简单的样式，再提供一下标题、作者、描述这些字段，代码这边就不讲解了，都是一些基础的样式代码，同学们可以下来自己看一看，效果是这样的。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a80a7f0c8b549f8844c57182311f177~tplv-k3u1fbpfcp-watermark.image?)

### 接口层的实现

样式咱们已经搞定了，接下来我们来为文章页分页定义一下接口。我们需要参照 [08 | 数据可视化：基于 Strapi 实现后台数据的灵活配置](https://juejin.cn/book/7137945369635192836/section/7141544709205262368) 和 [09 | BFF数据流转：Nextjs中的页面数据流转开发实战](https://juejin.cn/book/7137945369635192836/section/7141544003933061132)的做法， 把它配置到 Strapi 上，现在首页和文章页的数据结构是这样的。

```
// ./pages/index.tsx
{
    title: "Hello SSR!",
    description: "A Demo for 《SSR 实战：官网开发指南》",
    articles: {
      list: [
        {
          label: "文章1",
          info: "A test for article1",
          link: "http://localhost:3000/article/1",
        },
        {
          label: "文章2",
          info: "A test for article2",
          link: "http://localhost:3000/article/2",
        },
        {
          label: "文章3",
          info: "A test for article3",
          link: "http://localhost:3000/article/3",
        },
        {
          label: "文章4",
          info: "A test for article4",
          link: "http://localhost:3000/article/4",
        },
        {
          label: "文章5",
          info: "A test for article5",
          link: "http://localhost:3000/article/5",
        },
        {
          label: "文章6",
          info: "A test for article6",
          link: "http://localhost:3000/article/6",
        },
      ],
      total: 12,
    },
  }
  // ./pages/article/[articleId].tsx
  {
    title: `文章${articleId}`,
    author: "zhenmin",
    description: `a description for 文章${articleId}`,
    createTime: "2022/8/16",
    content: "文章内容",
  }
```

针对这个数据结构，我们设计三个结构体，ArticleInfo、ArticleIntroduction和 Home，其中 Home 就是首页那两个基础文案，ArticleIntroduction 是文章相关的简介，link 我们指向 ArticleInfo 对应元素的 id 即可。

这里文章内容我们单独放在 ArticleInfo，之所以这么做，是因为考虑到文章内容往往很多，如果放在 ArticleIntroduction 中进行分页，cdn 拉取的时间随着文章的增多，可能会越来越长。

首先我们来配置一下对应的结构体，启动一下 CMS 的项目，为了便于讲解，大家可以直接打开教学仓库的 master 分支查看，我有为大家保存缓存，所以拉取最新代码打开是可以直接看到我们的配置的。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1376d1051664c34932d9e8017a7060e~tplv-k3u1fbpfcp-watermark.image?)

其中大部分配置大家直接看就好了，在[08 | 数据可视化：基于 Strapi 实现后台数据的灵活配置](https://juejin.cn/book/7137945369635192836/section/7141544709205262368) 我们大多有介绍，值得一提的是， ArticleInfo 中的 content 使用的是富文本，可以配置标题、加粗、图片等，并返回对应的 markdown 文本，非常适合文章页的数据源，有了结构体，接下来我们要做的就是对对应的结构体配置数据，我们切换到 Content Manager 目录下。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8016289effa40599d385ebc08856bba~tplv-k3u1fbpfcp-watermark.image?)

我们已经有配置一些数据，其中富文本区域的配置我们需要着重关注一下，大家可以打开第一篇文章，《时政新闻眼...》，这篇文章是我到新闻上随便找的一篇，其中包含了文本、标题和图片，我们看看它的配置是咋样的。


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2982bd7315d24ed289b47966c1bd505b~tplv-k3u1fbpfcp-watermark.image?)

这个其实和我们常用的一些文本编辑器还是很像的，点击 preview mode 处可以看到效果，我们按照平时写笔记的习惯，用 markdown 语言去配置文章就可以了，这里需要注意的是，图片导入后它默认会插入相对当前域名的相对路径，我们需要手动补上域名，因为我们站点的域名未必和现在是相同的，可能会出现资源 404 的情况，这个文章我们预览一下效果看看。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0492e9d767a44d3a0919cacd4dc08e0~tplv-k3u1fbpfcp-watermark.image?)

看上去很简陋，不过没关系，只要标签相关正确就可，样式我们可以后续再定义美化。接下来我们按照之前的配置，给这些结构体开一下 find、findone 等配置，不记得的同学可以查阅[08 | 数据可视化：基于 Strapi 实现后台数据的灵活配置](https://juejin.cn/book/7137945369635192836/section/7141544709205262368g) 中 Api 权限配置及上线的模块。

配置好了，以后我们随便开一个模块看看。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56fbe1ff4dd5445f891472fb88d9b8de~tplv-k3u1fbpfcp-watermark.image?)

好像有 time 等相关数据，[08 | 数据可视化：基于 Strapi 实现后台数据的灵活配置](https://juejin.cn/book/7137945369635192836/section/7141544709205262368g)我们也有提过这个场景，我们需要参照上次，把对应用不上的数据清掉，这里我们以 home 为例。

```
"use strict";
const { removeTime, removeAttrsAndId } = require("../../../utils/index.js");

/**
 *  home controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::home.home", ({ strapi }) => ({
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


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8373f184d3b047d9be9913970efde92c~tplv-k3u1fbpfcp-watermark.image?)

然后我们对其他模块进行相同的处理，具体代码同学们可以在 CMS 仓库查看，这里就不贴出来了。

除此之外，我们还需要额外对 ArticleIntroduce 做一个分页的操作，Strapi 中针对分页的操作提供了`pagination[page]` 和 `pagination[pageSize]`两个参数，类似下面的效果。

```
/api/articles?pagination[page]=1&pagination[pageSize]=10 // 按10个/页分页，返回第一页的数据
```

这两个参数太长了，也不好记，我们定义两个我们自己的参数，pageNo, pageSize，然后咱们在它的基础上魔改一下就可以，具体代码如下：

```
"use strict";
const { removeTime, removeAttrsAndId } = require("../../../utils/index.js");

/**
 *  article-introduction controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::article-introduction.article-introduction",
  ({ strapi }) => ({
    async find(ctx) {
      const { pageNo, pageSize, ...params } = ctx.query;
      if (pageNo && pageSize) {
        ctx.query = {
          ...params,
          "pagination[page]": Number(pageNo),
          "pagination[pageSize]": Number(pageSize),
        };
      }
      const { data, meta } = await super.find(ctx);
      return { data: removeAttrsAndId(removeTime(data)), meta };
    },
  })
);
```

然后大家可以访问一下三个接口试试，应该都有符合我们预期的数据了，接下来我们开始编写我们 BFF 层的代码，三个结构体分别对应三个接口层，home 的最简单，我们透传即可。

```
// ./pages/api/home.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { CMSDOMAIN } from "@/utils";

interface IHomeProps {
  title: string;
  description: string;
}

const getHomeData = (req: NextApiRequest, res: NextApiResponse<IHomeProps>) => {
  axios.get(`${CMSDOMAIN}/api/homes`).then((result) => {
    const { title, description } = result.data || {};

    res.status(200).json({
      title,
      description,
    });
  });
};

export default getHomeData;
```

接下来是文章简介的接口，它可以接受分页的两个入参进行对应的分页。

```
// ./pages/api/articleIntro.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { CMSDOMAIN } from "@/utils";

export interface IArticleIntro {
  label: string;
  info: string;
  articleId: number;
}

interface IArticleIntroProps {
  list: Array<{ label: string; info: string; articleId: number }>;
  total: number;
}

const getArticleIntroData = (
  req: NextApiRequest,
  res: NextApiResponse<IArticleIntroProps>
) => {
  const { pageNo, pageSize } = req.body;
  axios
    .get(`${CMSDOMAIN}/api/article-introductions`, {
      params: {
        pageNo,
        pageSize,
      },
    })
    .then((result) => {
      const { data, meta } = result.data || {};

      res.status(200).json({
        list: Object.values(data),
        total: meta.pagination.total,
      });
    });
};

export default getArticleIntroData;
```

其中 list 我们为什么需要用 Object.values 包一层 data 呢，细心的同学可能已经发现了，针对没有 relation 的多个元素， Strapi 是通过 object 类型返回给我们的，所以我们需要处理一层转成我们需要的数组格式。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1239a7cb1fa420cbcec5729a10f2377~tplv-k3u1fbpfcp-watermark.image?)

最后一个接口是文章详情的接口，那个接口包含一个 id 的入参，可以支持对数据进行单查，我们直接调用 Strapi 的 findOne 接口实现就好。

```
// ./pages/api/articleInfo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { CMSDOMAIN } from "@/utils";
import { IArticleProps } from "../article/[articleId]";

const getArticleInfoData = (
  req: NextApiRequest,
  res: NextApiResponse<IArticleProps>
) => {
  const { articleId } = req.query;
  axios.get(`${CMSDOMAIN}/api/article-infos/${articleId}`).then((result) => {
    const data = result.data || {};
    res.status(200).json(data);
  });
};

export default getArticleInfoData;
```

到这里我们 BFF 层就定义好了，接下来我们改造一下首页，接入一下接口替换我们原先的静态数据。

```
// ./pages/index.tsx
// ...
Home.getInitialProps = async (context) => {
  const { data: homeData } = await axios.get(`${LOCALDOMAIN}/api/home`);
  const { data: articleData } = await axios.post(
    `${LOCALDOMAIN}/api/articleIntro`,
    {
      pageNo: 1,
      pageSize: 6,
    }
  );

  return {
    title: homeData.title,
    description: homeData.description,
    articles: {
      list: articleData.list.map((item: IArticleIntro) => {
        return {
          label: item.label,
          info: item.info,
          link: `${LOCALDOMAIN}/article/${item.articleId}`,
        };
      }),
      total: articleData.total,
    },
  };
};
```

然后我们看看效果，数据已经注入进去了，不过样式有点糟糕，我们优化一下。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0114e10bc620476dab1c6cfce0f16aa4~tplv-k3u1fbpfcp-watermark.image?)

```
// ./pages/index.module.scss
//..
.grid {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;
      max-width: 62.5rem;
      transition: 2s;
      min-height: 36.25rem;
      .card {
        margin: 1rem;
        padding: 1.5rem;
        text-align: left;
        color: inherit;
        text-decoration: none;
        border: 0.0625rem solid var(--footer-background-color);
        border-radius: 0.625rem;
        transition: color 0.15s ease, border-color 0.15s ease;
        max-width: 18.75rem;
        cursor: pointer;
        width: 18.75rem;
        height: 13.875rem;
      }
      //...
}
```


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/520fdbb9119849889e0936907674a182~tplv-k3u1fbpfcp-watermark.image?)

现在就好多了，不过这时候还没完，我们需要把客户端的分页事件绑定一下。

```
// ./pages/index.tsx
import type { NextPage } from "next";
import styles from "./index.module.scss";
import cName from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "@/stores/theme";
import { Pagination } from "@douyinfe/semi-ui";
import axios from "axios";
import { LOCALDOMAIN } from "@/utils";
import { IArticleIntro } from "./api/articleIntro";

interface IProps {
  title: string;
  description: string;
  articles: {
    list: {
      label: string;
      info: string;
      link: string;
    }[];
    total: number;
  };
}

const Home: NextPage<IProps> = ({ title, description, articles }) => {
  const [content, setContent] = useState(articles);
  const mainRef = useRef<HTMLDivElement>(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    mainRef.current?.classList.remove(styles.withAnimation);
    window.requestAnimationFrame(() => {
      mainRef.current?.classList.add(styles.withAnimation);
    });
  }, [theme]);

  return (
    <div className={styles.container}>
      <main
        className={cName([styles.main, styles.withAnimation])}
        ref={mainRef}
      >
        <h1 className={styles.title}>{title}</h1>

        <p className={styles.description}>{description}</p>

        <div className={styles.grid}>
          {content?.list?.map((item, index) => {
            return (
              <div
                key={index}
                className={styles.card}
                onClick={(): void => {
                  window.open(
                    item.link,
                    "blank",
                    "noopener=yes,noreferrer=yes"
                  );
                }}
              >
                <h2>{item.label} &rarr;</h2>
                <p>{item.info}</p>
              </div>
            );
          })}
          <div className={styles.paginationArea}>
            <Pagination
              total={content?.total}
              pageSize={6}
              onPageChange={(pageNo) => {
                axios
                  .post(`${LOCALDOMAIN}/api/articleIntro`, {
                    pageNo,
                    pageSize: 6,
                  })
                  .then(({ data }) => {
                    setContent({
                      list: data.list.map((item: IArticleIntro) => {
                        return {
                          label: item.label,
                          info: item.info,
                          link: `${LOCALDOMAIN}/article/${item.articleId}`,
                        };
                      }),
                      total: data.total,
                    });
                  });
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// ...
```

然后我们访问一下 http://127.0.0.1:3000，需要注意的是，这里不能直接访问 localhost，因为我们接口并没有设置 localhost 的域，会出现跨域的情况，我们可以参考 [09 | BFF数据流转：Nextjs中的页面数据流转开发实战](https://juejin.cn/book/7137945369635192836/section/7141544003933061132) 中间件章节的做法，引入 cros 的中间件，把 localhost 配置 origin 即可，感兴趣的同学可以下来自己尝试一下

现在我们来看一下效果，效果还是可以的


![16a40330-4789-475a-a3af-ce6bc8fcbb75.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10d3bf3125e941058216a4975e967ab6~tplv-k3u1fbpfcp-watermark.image?)

接下来我们给对应的文章页面绑定一下接口数据。

```
// ./pages/article/[articleId].tsx
Article.getInitialProps = async (context) => {
  const { articleId } = context.query;
  const { data } = await axios.get(`${LOCALDOMAIN}/api/articleInfo`, {
    params: {
      articleId,
    },
  });
  return data;
};
```

来看看效果。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d4d2a9b938649a2b22a5c34705a8b41~tplv-k3u1fbpfcp-watermark.image?)

现在已经完成数据的注入了，不过这个和我们预想的还不太一样，因为现在还是 markdown 的文本，没有显示出对应的标题，咱们需要把它换成 HTML。

Markdown 转 HTML 我们可以使用 showdown，这是一个免费的开源转换 markdown 为 HTML的库，首先我们来装一下对应的依赖。

```
npm install showdown --save
```

然后我们对页面的 content 进行一下转换。

```
// ./pages/article/[articleId].tsx
import { LOCALDOMAIN } from "@/utils";
import axios from "axios";
import type { NextPage } from "next";
import styles from "./styles.module.scss";

const showdown = require("showdown");

export interface IArticleProps {
  title: string;
  author: string;
  description: string;
  createTime: string;
  content: string;
}

const Article: NextPage<IArticleProps> = ({
  title,
  author,
  description,
  createTime,
  content,
}) => {
  const converter = new showdown.Converter();
  return (
    <div className={styles.article}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.info}>
        作者：{author} | 创建时间: {createTime}
      </div>
      <div className={styles.description}>{description}</div>
      <div>{converter.makeHtml(content)}</div>
    </div>
  );
};

Article.getInitialProps = async (context) => {
  const { articleId } = context.query;
  const { data } = await axios.get(`${LOCALDOMAIN}/api/articleInfo`, {
    params: {
      articleId,
    },
  });
  return data;
};

export default Article;
```


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54fa9a8692e44c9f9fd16e2fe0f2547e~tplv-k3u1fbpfcp-watermark.image?)

可以看到，现在已经转成我们需要的 HTML 文本了，但是新的问题来了，我们应该怎样把 HTML 文本渲染成我们需要的 dom 呢，我们可以使用 dangerouslySetInnerHTML， 之所以这个属性包含一个dangerous，原因和 eval 相似，因为它可以在客户端手动执行一段代码（Dom)，在执行为用户输入的内容时，是会有一定风险的，我们这个是来自我们自己的底层 CDN ，所以数据相关有安全保证，对于外部输入的场景，同学们在使用的时候需要衡量一下。

```
// ./pages/article/[articleId].tsx
<div dangerouslySetInnerHTML={{ __html: converter.makeHtml(content) }} />
```


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19a53cf5f8cb447ebcb6910829883781~tplv-k3u1fbpfcp-watermark.image?)

可以看到现在已经可以渲染成我们需要的元素了，不过样式太丑了，因为配置的时候富文本是可以随意配置的，这样会导致整体样式五花八门，我们需要进行一下统一的相关限制。

```
// ./pages/article/[articleId].tsx
<div
    dangerouslySetInnerHTML={{ __html: converter.makeHtml(content) }}
    className={styles.content}
  />
// ./pages/article/styles.module.scss
.content {
    margin-bottom: 5rem;
    font-size: 16px;
    line-height: 32px;

    img {
      width: 50rem;
    }
  }
  
```

这样效果就好多了，后面如果官网有文章迭代的需求，也只需要让运营同学到 Strapi 平台配置一下对应的富文本发布就好了。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3100d18f4723412b90e1bc163b484fd9~tplv-k3u1fbpfcp-watermark.image?)

### 首页和文章页的多媒体适配

在[12 | 多媒体适配: 官网的设备样式兼容方案](https://juejin.cn/book/7137945369635192836/section/7141551328555335713) ，我给同学们留了多媒体适配的作业，不知道大家做了吗，没做也没关系，现在我们改造完首页和文章页，一起来实现这部分。首先我们针对首页进行一下简单适配。

```
// ./pages/index.module.scss
@import "./media.scss";
// ...
@include media-ipad {
  .container {
    .main {
      .grid {
        width: 95%;
        margin: auto;
        justify-content: center;
      }
    }
  }
}

@include media-mobile {
  .container {
    .main {
      .title {
        font-size: 1.75rem;
        line-height: 2.4375rem;
      }
      .description {
        font-size: 0.875rem;
        line-height: 1.5rem;
        margin: 2rem 0;
      }
      .grid {
        width: 95%;
        margin: auto;
        justify-content: center;
        .card {
          height: 10rem;
          h2 {
            font-size: 1.125rem;
            line-height: 1.5625rem;
          }
          p {
            font-size: 0.75rem;
            line-height: 1.625rem;
          }
        }
      }
    }
  }
}
```

我们来看一下效果。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9db680a1bfa94d5d8a9e5b59015c1d70~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4483f9a397af460ba235785befede82c~tplv-k3u1fbpfcp-watermark.image?)

文章页咱们也适配一下。

```
// ./pages/article/styles.module.scss
@import "../media.scss";
// ...
@include media-ipad {
  .article {
    width: 80%;
    .content {
      img {
        width: 100%;
      }
    }
  }
}

@include media-mobile {
  .article {
    width: 80%;
    .title {
      font-size: 1.75rem;
      line-height: 2.4375rem;
    }
    .content {
      h2 {
        font-size: 1.125rem;
        line-height: 1.5625rem;
      }
      img {
        width: 100%;
      }
    }
  }
}
```

我们看看效果。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d3cca28252b4680b3dece2757fb9799~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/211a1730d572414abb0c1312425f2b90~tplv-k3u1fbpfcp-watermark.image?)

到这里，我们文章页分页的内容就已经全部实现了

## 国际化

分页的功能实现了，国际化的功能我们应该怎么实现呢？每个页面不同语言展示不同的文案内容，难道我们要为每种语言写一套页面吗？那开发国际化平台的同学可能已经准备提桶跑路了...

有没有什么更灵活快捷的方式吗？其实这个方法我们在前几节课就已经有所涉猎了，在讲解方法之前，我想请大家将国际化、主题化和多媒体适配的注入联系起来看看，它们有什么共同之处吗？

没错，它们都是每个页面共同的部分，每个页面都有相同的语言，主题化和多媒体适配，那我们是不是也可以针对语言来定义一套注入器（Context)，通过缓存的方式统一管理，然后进行全局的注入。

```
// ./stores/language.tsx
import React, { useState, useEffect, createContext } from "react";
import { Language } from "@/constants/enum";

interface ILanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

interface IProps {
  children: JSX.Element;
}

export const LanguageContext = createContext<ILanguageContextProps>(
  {} as ILanguageContextProps
);

export const LanguageContextProvider = ({ children }: IProps): JSX.Element => {
  const [language, setLanguage] = useState<Language>(Language.ch);

  useEffect(() => {
    const checkLanguage = (): void => {
      const item =
        (localStorage.getItem("language") as Language) || Language.ch;
      setLanguage(item);
    };
    checkLanguage();
    window.addEventListener("storage", checkLanguage);
    return (): void => {
      window.removeEventListener("storage", checkLanguage);
    };
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: (currentLanguage) => {
          setLanguage(currentLanguage);
          localStorage.setItem("language", currentLanguage);
        },
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
```

那么注入完成，我们怎么对每个文案进行多个语言的翻译呢？我们只需要在 Strapi 配置对应语言的文案即可，比如中文的 title 字段我们叫做 `titlech`，英文的 title 字段我们叫做 `titleen`，前缀相同，结尾文案与我们定义的类型相同，我们就可以在页面中直接采取 `title${language}`的方式调用了。

同时这样实现有个好处，不仅仅是单纯的对文案进行翻译，在不同的地区需要展示的文化信息是不尽相同的，以字节官网为例，中文和英文并不是单纯的机翻。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39b361f6f3184260b1e21ca32bfbd77d~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f28fa4e566c488d965f2ea45ed07137~tplv-k3u1fbpfcp-watermark.image?)

**针对不同地区的同学，需要针对他们的文化去定制化的宣传，多站在对方的角度上去思考问题，** **多元兼容** **，才是国际化的真正意义。** 这样在相互的合作中，往往才会有更多的理解和默契~

具体 Strapi 的配置和 BFF 层这边就当作一个课后小作业，这边就不实现了，思路参考上面即可。同学们可以课后自己试一试。

## 小结

这节课我们学习了文章页分页和国际化多语言的实现，使用了 Strapi 的 findOne 和分页能力，我们可以用很低的成本的进行文章的配置和分页，后续的网站维护，运营同学也只需要使用对应的富文本编辑器，就可以随时随地配置更新需要的文案到官网上。还支持有预览的能力，完全可以做到所见即所得。

同时我们还对首页和文章页进行了移动端和 ipad 端的适配，让它可以在多端进行访问！

对于国际化多语言的实现，我们用到了前几章反复使用的注入器方案，将对应的语言页面注入到每个页面，然后再结合 Strapi 的配置，我们就可以实现对不同地区的语言进行灵活配置的能力，后续如果需要新增对某个语言的支持，也只需要在 Strapi 上配置对应的文案就好了，不需要改动代码，配置能力拉满，太酷了~

平时我们需求中可能经常会用到弹窗，官网经常会有一些自定义的动画，通过样式很难去覆盖动画的，所以下一节课，我们就来学习，如何来实现一个有自定义动画效果的弹窗组件。
