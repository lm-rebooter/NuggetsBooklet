> 仓库：https://github.com/czm1290433700/nextjs-demo

上一节课，我们介绍了怎么初始化一个 Nextjs 服务器端渲染项目，这一节我们将来学习怎么在 Nextjs 项目中实现完整的页面链路。在开始这章的学习前，我们先来回忆一下 SSR 实现静态页面渲染的一个过程。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef12a3de12cf48698ebfb73ae8c8f847~tplv-k3u1fbpfcp-watermark.image?)

主体上可以分为模板页面渲染、路由匹配和 header 修改三个模块，模板页面渲染是页面渲染的主要部分，包含了静态模板的生成和页面数据的注入，最后形成服务器端返回给我们的 HTML文本。

在 Nextjs 中也是按照这几个模块来实现的，在这些基础上它提供了不少开箱即用的能力，我们不再需要自己实现相关的方法。所以这小节我们仍从模板页面渲染、路由匹配和 header修改三个模块来展开对 Nextjs 实战的学习。

这一节的代码量会比较多，大家可以对着教程自己手写看看，不一定要完全复制，更重要的是理解思路和过程。

# 模板页面渲染

1.  ## 通用 layout

Nextjs 模板页面的写法和 React 的用法是相同的，这里不过多赘述。我们的web应用的路由页面之间通常会有共同的页面元素，比如页首、页尾，对于这种页面，我们通常会定义对应的组件在入口文件中引用，这样所有的页面就都可以有相同的页面组件了，而不在需要在每个页面中去单独调用

在写页面之前，给大家推荐一个在业务开发中很好用的类名库 classnames，它可以用函数式的方式来处理一些相对复杂的类场景，后续会有大量应用。

```
npm install classnames --save
```

我们先定义一下页首的组件：

```
// ./components/navbar/index.tsx
import { FC } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import logoLight from "@/public/logo_light.png";

export interface INavBarProps {}

export const NavBar: FC<INavBarProps> = ({}) => {
  return (
    <div className={styles.navBar}>
      <a href="http://localhost:3000/">
        <Image src={logoLight} alt="Demo" width={70} height={20} />
      </a>
    </div>
  );
};
```

```
// ./components/navbar/styles.module.scss
.navBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: hsla(0,0%,100%,.5);
    backdrop-filter: blur(8px);
    width: 100%;
    height: 64px;
    position: sticky;
    top: 0;
    left: 0;
    padding: 20px 32px;
    z-index: 100;
}
```

其中我们引用了 next/image 内置的 Image 标签，相比平常的 img 标签，Nextjs 会根据导入的图像来确认宽高，从而规避累积布局移位 (CLS) 的问题，可以在布局阶段提前进行相关区域预留位置，而不是加载中再进行移位。

同样我们再定义一下页尾的组件：

```
// ./components/footer/index.tsx
import { FC } from "react";
import Image from "next/image";
import publicLogo from "@/public/public_logo.png";
import styles from "./styles.module.scss";
import cName from "classnames";

interface ILink {
  label: string;
  link?: string;
}

interface ILinkList {
  title: string;
  list: ILink[];
}

interface IQRCode {
  image: string;
  text: string;
}

export interface IFooterProps {
  title: string;
  linkList: ILinkList[];
  qrCode: IQRCode;
  copyRight: string;
  siteNumber: string; // 站点备案号
  publicNumber: string; // 公安备案号
}

export const Footer: FC<IFooterProps> = ({
  title,
  linkList,
  qrCode,
  copyRight,
  siteNumber,
  publicNumber,
}) => {
  return (
    <div className={styles.footer}>
      <div className={styles.topArea}>
        <h1 className={styles.footerTitle}>{title}</h1>
        <div className={styles.linkListArea}>
          {linkList?.map((item, index) => {
            return (
              <div className={styles.linkArea} key={`linkArea${index}`}>
                <span className={styles.title}>{item.title}</span>
                <div className={styles.links}>
                  {item.list?.map((_item, _index) => {
                    return (
                      <div
                        className={cName({
                          [styles.link]: _item.link,
                          [styles.disabled]: !_item.link,
                        })}
                        onClick={(): void => {
                          _item.link &&
                            window.open(
                              _item.link,
                              "blank",
                              "noopener=yes,noreferrer=yes"
                            );
                        }}
                        key={`link${_index}`}
                      >
                        {_item.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.bottomArea}>
        <div className={styles.codeArea}>
          <div>
            <Image
              src={qrCode?.image}
              alt={qrCode?.text}
              width={56}
              height={56}
            ></Image>
          </div>
          <div className={styles.text}>{qrCode?.text}</div>
        </div>
        <div className={styles.numArea}>
          <span>{copyRight}</span>
          <span>{siteNumber}</span>
          <div className={styles.publicLogo}>
            <div className={styles.logo}>
              <Image
                src={publicLogo}
                alt={publicNumber}
                width={20}
                height={20}
              ></Image>
            </div>
            <span>{publicNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

```
// ./components/footer/styles.module.scss
.footer {
  padding: 70px 145px;
  background-color: #f4f5f5;
  .topArea {
    display: flex;
    justify-content: space-between;

    .footerTitle {
      font-weight: 500;
      font-size: 36px;
      line-height: 36px;
      color: #333333;
      margin: 0;
    }

    .linkListArea {
      display: flex;
      .linkArea {
        display: flex;
        flex-direction: column;
        margin-left: 160px;
        .title {
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          color: #333333;
          margin-bottom: 40px;
        }

        .links {
          display: flex;
          flex-direction: column;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;

          .link {
            color: #333333;
            cursor: pointer;
            margin-bottom: 24px;
          }

          .disabled {
            color: #666;
            cursor: not-allowed;
            margin-bottom: 24px;
          }
        }
      }
    }
  }

  .bottomArea {
    display: flex;
    justify-content: space-between;
    .codeArea {
      display: flex;
      flex-direction: column;
      .text {
        color: #666;
      }
    }
    .numArea {
      color: #666;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;

      span {
        margin-bottom: 12px;
      }

      .publicLogo {
        display: flex;

        .logo {
          margin-right: 4px;
        }
      }
    }
  }
}
```

页首和页尾需要的图片资源我们统一放在 public 中，这里就不贴了，同学们可以到 Github仓库中拷贝下来，放到自己仓库中。定义好组件，我们将它拼接成我们需要的布局（layout)组件，并将中间的 body 通过 children 透传进来。

```
// ./components/layout/index.tsx
import { FC } from "react";
import { IFooterProps, Footer } from "../footer/index";
import { INavBarProps, NavBar } from "../navbar/index";
import styles from "./styles.module.scss";

export interface ILayoutProps {
  navbarData: INavBarProps;
  footerData: IFooterProps;
}

export const Layout: FC<ILayoutProps & { children: JSX.Element }> = ({
  navbarData,
  footerData,
  children,
}) => {
  return (
    <div className={styles.layout}>
      <NavBar {...navbarData} />
      <main className={styles.main}>{children}</main>
      <Footer {...footerData} />
    </div>
  );
};
```

```
// ./components/layout/styles.module.scss
.layout {
  .main {
    min-height: calc(100vh - 560px);
  }
}
```

定义好 layout，我们只需要把 layout 塞进入口文件就可以， Nextjs 的入口文件是 pages下的 _app.tsx，如下定义：

```
// .pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout, ILayoutProps } from "@/components/layout";

const MyApp = (data: AppProps & ILayoutProps) => {
  const { Component, pageProps, navbarData, footerData } = data;

  return (
    <Layout navbarData={navbarData} footerData={footerData}>
      <Component {...pageProps} />
    </Layout>
  );
};
export default MyApp;
```

这样就已经可以了，我们可以启动项目看看效果：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4ecb0c3e3d0421e970ae97a20563594~tplv-k3u1fbpfcp-watermark.image?)
可以看到，已经有固定的页首和页尾了，不过因为还没注入数据的关系，所以很多地方都是空的，下面我们将对应的数据按定义的类型注入进来。

2.  ## 数据注入

大家应该还记得，在[《架构实现（三）：如何支持 SSR对数据的请求》](https://juejin.cn/book/7137945369635192836/section/7141320046864777228)中，我们定义了 getInitProps 来进行数据的请求和服务器端的注入，同样在 Nextjs 中也提供了相关的函数来实现数据注入，分别是 getStaticProps、getServerSideProps 和 getInitialProps，这里我们讲一下它们的区别。

-   getStaticProps： getStaticProps 多用于静态页面的渲染，它只会在生产中执行，而不会在运行的时候再次调用，这意味着它只能用于不常编辑的部分，每次调整都需要重新构建部署，官网信息的时效性比较敏感，所以后面章节我们只会有少部分应用到 getStaticProps，但这并不意味着它没用，在一些特殊的场景下会有奇效，后面章节会具体介绍。

<!---->

-   getServerSideProps：getServerSideProps 只会执行在服务器端，不会在客户端执行。**因为这个特性，所以客户端的脚本打包会较小，相关数据不会有在客户端暴露的问题，相对更隐蔽安全，不过逻辑集中在服务器端处理，会加重服务器的负担，服务器成本也会更高。** 我们使用服务器端渲染的初衷，还是将处理的数据直接包含在 HTML 文本中，提高 SEO，至于客户端的逻辑我们并不需要都放在服务器端执行，所以我们不使用它来作为服务器端注入方式。

<!---->

-   getInitialProps：这个方法和我们当时自己实现的很相似，初始化的时候，**如果是服务器端路由，那么数据的注入会在服务器端执行，对** **SEO** **友好，在实际的页面操作中，相关的逻辑会在** **客户端** **执行，从而减轻了服务器端的负担。** 所以综合成本来考虑，我们后期的数据注入主要会采用 getInitialProps 来进行。

不过这里需要注意的一点是，数据的注入都是针对页面的，也就是 pages 目录下的，对组件进行数据注入是不支持的，所以我们应在页面中注入对应数据后再透传给页面组件，现在我们还没学习怎么创建 API 层，所以我们直接返回静态数据就好。

不过这里需要注意一点，因为 _app.tsx 是所有页面的入口页面，所以别的页面的参数也需要透传下来，而不能直接覆盖，我们可以用内置的 App 对象来获取对应组件本身的 pageProps，不要直接覆盖了，对于非入口页面的普通页面，我们直接加上业务逻辑就可以：

```
// ./pages/_app.tsx
import "../styles/globals.css";
import type { AppProps, AppContext } from "next/app";
import App from "next/app";
import { Layout, ILayoutProps } from "@/components/layout";
import code from "@/public/code.png";

const MyApp = (data: AppProps & ILayoutProps) => {
  const { Component, pageProps, navbarData, footerData } = data;

  return (
    <div>
      <Layout navbarData={navbarData} footerData={footerData}>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const pageProps = await App.getInitialProps(context);

  return {
    ...pageProps,
    navbarData: {},
    footerData: {
      title: "Demo",
      linkList: [
        {
          title: "技术栈",
          list: [
            {
              label: "react",
            },
            {
              label: "typescript",
            },
            {
              label: "ssr",
            },
            {
              label: "nodejs",
            },
          ],
        },
        {
          title: "了解更多",
          list: [
            {
              label: "掘金",
              link: "https://juejin.cn/user/2714061017452557",
            },
            {
              label: "知乎",
              link: "https://www.zhihu.com/people/zmAboutFront",
            },
            {
              label: "csdn",
            },
          ],
        },
        {
          title: "联系我",
          list: [{ label: "微信" }, { label: "QQ" }],
        },
      ],
      qrCode: {
        image: code,
        text: "祯民讲前端微信公众号",
      },
      copyRight: "Copyright © 2022 xxx. 保留所有权利",
      siteNumber: "粤ICP备XXXXXXXX号-X",
      publicNumber: "粤公网安备 xxxxxxxxxxxxxx号",
    },
  };
};

export default MyApp;
```

然后我们再刷新页面试试，可以看到一个简易的有 layout 的首页就创建好了。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5c4de7fa94440c59ce0b16d25ab18bb~tplv-k3u1fbpfcp-watermark.image?)
# 路由匹配

Nextjs 的路由不同于我们一般使用的路由，它没有对应的文件去配置对应的路由，而是通过文件系统自动检索对应的路由，会根据相对 pages 的目录路径来生成对应的路由，比如：

```
// ./pages/home/index.tsx => /home
// ./pages/demo/[id].tsx => /demo/:id
```

这里我们创建一个 article 目录来试验一下对应的文件路由，针对文章路由，我们需要给它加一个 articleId 参数来区分不同文章：

```
// ./pages/article/[articleId].tsx
import type { NextPage } from "next";

interface IProps {
  articleId: number;
}

const Article: NextPage<IProps> = ({ articleId }) => {
  return (
    <div>
      <h1>文章{articleId}</h1>
    </div>
  );
};

Article.getInitialProps = (context) => {
  const { articleId } = context.query;
  return {
    articleId: Number(articleId),
  };
};

export default Article;
```

我们在注入的时候获取当前的 articleId 来用于页面显示，我们可以刷新一下页面，然后打开 http://localhost:3000/article/1 试试：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d86672e390a47f098a213b664132649~tplv-k3u1fbpfcp-watermark.image?)

可以看到已经可以了，这里我们可以顺便把首页默认的 index.tsx 简单改造一下，把链接指到我们定义的文章路由。

这里有个小细节需要提醒一下，大家应该还记得之前[04 | 架构实现（二）：如何实现 SSR 的静态页面渲染？](https://juejin.cn/book/7137945369635192836/section/7141320046537605131) 我们有提到服务器端渲染的路由包含客户端路由和服务器端路由，如果采用 router hook 跳转将采用客户端路由，如果需要使用服务器端渲染，需要使用 a 标签或是 window.open 等原生方式，这里我们采用服务器端路由进行跳转，提高 SEO 的检索效果。

```
// ./pages/index.tsx
import type { NextPage } from "next";
import styles from "./index.module.scss";

interface IProps {
  title: string;
  description: string;
  list: {
    label: string;
    info: string;
    link: string;
  }[];
}

const Home: NextPage<IProps> = ({ title, description, list }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>{title}</h1>

        <p className={styles.description}>{description}</p>

        <div className={styles.grid}>
          {list?.map((item, index) => {
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
        </div>
      </main>
    </div>
  );
};

Home.getInitialProps = (context) => {
  return {
    title: "Hello SSR!",
    description: "A Demo for 《深入浅出SSR官网开发指南》",
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
  };
};

export default Home;
```

```
// ./pages/index.module.scss
.container {
  padding: 0 2rem;
}

.main {
  min-height: 100vh;
  padding: 4rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.footer {
  display: flex;
  flex: 1;
  padding: 2rem 0;
  border-top: 1px solid #eaeaea;
  justify-content: center;
  align-items: center;
}

.footer a {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.title a {
  color: #0070f3;
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

.code {
  background: #fafafa;
  border-radius: 5px;
  padding: 0.75rem;
  font-size: 1.1rem;
  font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
    Bitstream Vera Sans Mono, Courier New, monospace;
}

.grid {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 800px;
}

.card {
  margin: 1rem;
  padding: 1.5rem;
  text-align: left;
  color: inherit;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
  max-width: 300px;
  cursor: pointer;
}

.card:hover,
.card:focus,
.card:active {
  color: #0070f3;
  border-color: #0070f3;
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

.logo {
  height: 1em;
  margin-left: 0.5rem;
}
```

这里我们使用 `window.open`打开一个新页面来指向上文我们创建的文章页，`noopener=yes,noreferrer=yes`是为了跳转的安全性，这个可以隐藏我们跳转的 window.opener 与 Document.referrer，在跨站点跳转中，我们通常加这个参数来保证跳转信息的不泄露，现在我们就可以重新访问 http://localhost:3000/ 看看效果。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb5114901d1e42c2b13ed0e1ddaf3aea~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6707f7485ea6456da0b6ce5d8db66b9f~tplv-k3u1fbpfcp-watermark.image?)

我们官网的首页大致就已经搭建好了，点击其中的文章模块就可以跳到对应的文章页。

# header 修改

之前在[04 | 架构实现（二）：如何实现 SSR 的静态页面渲染？](https://juejin.cn/book/7137945369635192836/section/7141320046537605131)我们通过 react-helmet 来实现对模板页面 header 的修改，现在我们不再需要通过这种方式了，Nextjs 提供了开箱即用的能力，我们只需要直接用 next/head 暴露出来的标签来修改 header 就可以了，这里我们在 _app.tsx 加一个默认的 title。

```
// ./pages/_app.tsx
import "../styles/globals.css";
import type { AppProps, AppContext } from "next/app";
import App from "next/app";
import { Layout, ILayoutProps } from "@/components/layout";
import code from "@/public/code.png";
import Head from "next/head";

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

  return {
    ...pageProps,
    navbarData: {},
    footerData: {
      title: "Demo",
      linkList: [
        {
          title: "技术栈",
          list: [
            {
              label: "react",
            },
            {
              label: "typescript",
            },
            {
              label: "ssr",
            },
            {
              label: "nodejs",
            },
          ],
        },
        {
          title: "了解更多",
          list: [
            {
              label: "掘金",
              link: "https://juejin.cn/user/2714061017452557",
            },
            {
              label: "知乎",
              link: "https://www.zhihu.com/people/zmAboutFront",
            },
            {
              label: "csdn",
            },
          ],
        },
        {
          title: "联系我",
          list: [{ label: "微信" }, { label: "QQ" }],
        },
      ],
      qrCode: {
        image: code,
        text: "祯民讲前端微信公众号",
      },
      copyRight: "Copyright © 2022 xxx. 保留所有权利",
      siteNumber: "粤ICP备XXXXXXXX号-X",
      publicNumber: "粤公网安备 xxxxxxxxxxxxxx号",
    },
  };
};

export default MyApp;
```

我们再刷新试试，可以看到默认的 title 已经加上了。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3db3b21088924f19806c4d69f9fb2290~tplv-k3u1fbpfcp-watermark.image?)
# 小结

这一章节我们学习了 Nextjs 中的完整页面链路，Nextjs 提供的各种开箱即用的能力，可以帮助我们快速高效地完成静态页面中的模板页面渲染、路由匹配和 header 修改， 我们不再需要像之前一样定义复杂的函数去同构实现了。

同时这节还涉及很多页面的 dom 逻辑和样式，像顶部栏的磨砂效果，算是一个小彩蛋吧～感兴趣的同学可以下来自己对着代码研究一下是怎么实现的。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fd188b22242448a97f1a234cd73a20c~tplv-k3u1fbpfcp-watermark.image?)
目前我们页面相关的数据用的还是固定常量，官网的数据具有实时性，可灵活配置的特点。后面我们肯定要考虑使用接口来替代对应的常量，来实现官网数据的灵活配置。

针对这个需求，难道我们要实现一个复杂的后台系统吗？联表成本肯定很高。那针对不同类型的数据表单应该如何进行对应的灵活配置呢？下一节我们就这些问题来一一解决。
