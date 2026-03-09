## 前言

本篇我们从零开始，手写一个 React Server Component 实现。为了帮助大家理解 React Server Component 的出现背景，我们会从最原始的页面实现方式开始讲起，跟随着 React 的发展历史不断完善代码，最终实现 React Server Component。

现在就让我们开始吧。

## 步骤 1：实现一个博客页面

首先创建项目，运行以下命令，完成项目初始化：

```javascript
mkdir react-rsc && cd react-rsc

npm init

npm i tsx --save-dev

npm i express escape-html react react-dom --save
```

注：在[《源码篇 | 手写 React SSR》](https://juejin.cn/book/7307859898316881957/section/7309116396511133705)，我们通过 webpack 和自定义配置实现了 JSX 语法的编译。本篇为了更加方便，我们将直接使用 [tsx](https://www.npmjs.com/package/tsx) 进行处理，虽然文件会命名为 `.ts`或 `.tsx`，但我们并不会使用 TypeScript 语法，只是借助其对 JSX 语法的编译功能。

新建文件 `index.ts`，代码如下：

```javascript
import express from "express";
import { readFile } from "fs/promises";
import escapeHtml from 'escape-html'

const app = express();

app.get("/:route(*)", async (req, res) => {
  const html = await htmlGenerator();
  res.setHeader("Content-Type", "text/html");
  res.end(html);
});

async function htmlGenerator() {
  const author = "YaYu";
  const postContent = await readFile("./posts/hello.txt", "utf8");

  return `<html>
  <head>
    <title>My blog</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="p-5">
    <nav class="flex items-center justify-center gap-10 text-blue-600">
      <a href="/">Home</a>
    </nav>
    <article class="h-40 mt-5 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
      ${escapeHtml(postContent)}
    </article>
    <footer class="h-20 mt-5 flex-1 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
      (c) ${escapeHtml(author)}, ${new Date().getFullYear()}
    </footer>
  </body>
</html>`;
}

app.listen(3000, (err) => {
  if (err) return console.error(err);
  return console.log(`Server is listening on 3000`);
});

```

博客的具体内容我们会读取 `/posts/hello.txt`文件，所以新建 `/posts/hello.txt`，随便写入一些内容，比如：

```javascript
<h1>Hello World!</h1>
```

修改 `package.json`文件中的脚本命令，添加代码如下：

```javascript
{
  "scripts": {
    "start": "tsx watch ./index.ts"
  }
}

```

运行 `npm start`，此时效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71245cefb55944b59b265f25d4adfc61~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1526\&h=1156\&s=79378\&e=png\&b=6689db)

> 1. 功能实现：React RSC 实现
> 2. 源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/react-rsc-1>
> 3. 下载代码：`git clone -b react-rsc-1 git@github.com:mqyqingfeng/next-app-demo.git`

效果上，我们实现的是一个博客页面的简化版，顶部是导航栏，底部是页脚，中间是具体的文章内容。

技术实现上，我们使用 express 起了一个服务器，在读取了 txt 文件的内容后，通过模板字符串的形式，直接返回了页面 HTML 内容。

值得注意的是，当我们读取完 txt 的内容后，使用了 escape-html 对内容进行了转义。这是一种常见的内容安全处理。麻烦的地方在于，所有写入内容的地方，都需要自己添加逻辑处理，难道就没有更加简单、便捷、安全的使用方式呢？

## 步骤 2：发明 JSX

为了解决这个问题，React 发明了 JSX。你可以把它理解成一种特殊的模板语言。使用 JSX，你可以在 JavaScript 中直接使用 HTML 标签，比如：

```jsx
const res = <html>
  <head>
    <title>My blog</title>
  </head>
  <body>
    <nav>
      <a href="/">Home</a>
      <hr />
    </nav>
    <article>
      {postContent}
    </article>
    <footer>
      <hr />
      <p><i>(c) {author}, {new Date().getFullYear()}</i></p>
    </footer>
  </body>
</html>
```

其中变量使用 `{}`进行包裹。这种语法，无论是 JavaScript 还是 HTML 其实都不能直接识别，所以使用 JSX 语法还需要搭配编译器（比如 Babel）使用，Babel 会将代码编译成如下形式：

```javascript
import { jsx } from "react/jsx-runtime";

const res = jsx("html", {
  children: [
    jsx("head", {
      children: jsx("title", {
        children: "My blog"
      })
    }), 
  jsx("body", {
    children: [...]
  })]
});
```

之所以编译成这种函数执行的形式，是因为我们还需要在函数运行的时候读取外边的变量（就比如上图中的 postContent 和 author）。最终该函数会返回一个描述 HTML 的 JSON 对象（为了方便，我们就简称为 JSX 对象了），类似于如下这种形式：

```javascript
// Slightly simplified
{
  $$typeof: Symbol.for("react.element"), // Tells React it's a JSX element (e.g. <html>)
  type: 'html',
  props: {
    children: [
      {
        $$typeof: Symbol.for("react.element"),
        type: 'head',
        props: {
          children: {
            $$typeof: Symbol.for("react.element"),
            type: 'title',
            props: { children: 'My blog' }
          }
        }
      },
      {
        $$typeof: Symbol.for("react.element"),
        type: 'body',
        props: {
          children: [
            {
              $$typeof: Symbol.for("react.element"),
              type: 'nav',
              props: {
                children: [{
                  $$typeof: Symbol.for("react.element"),
                  type: 'a',
                  props: { href: '/', children: 'Home' }
                }, {
                  $$typeof: Symbol.for("react.element"),
                  type: 'hr',
                  props: null
                }]
              }
            },
            {
              $$typeof: Symbol.for("react.element"),
              type: 'article',
              props: {
                children: postContent
              }
            },
            {
              $$typeof: Symbol.for("react.element"),
              type: 'footer',
              props: {
                /* ...And so on... */
              }              
            }
          ]
        }
      }
    ]
  }
}
```

所以我们写代码的时候，写的是：

```javascript
const res = <html>...</html>
```

到 JavaScript 具体执行的时候，其实是一个对象：

```javascript
const res = {
  $$typeof: Symbol.for("react.element"),
  type: 'html',
  props: {
    children: [ ... ]
  }
}
```

但有了描述 HTML 的 JSX 对象还不够，我们还需要一个 render 函数，将 JSX 对象渲染为具体的 HTML，返回给客户端的应该是这个具体的 HTML。

我们修改 `index.ts`，代码如下：

```javascript
import express from "express";
import { htmlGenerator } from "./generator";
const app = express();

app.get("/:route(*)", async (req, res) => {
  const html = await htmlGenerator();
  res.setHeader("Content-Type", "text/html");
  res.end(html);
});

app.listen(3000, (err) => {
  if (err) return console.error(err);
  return console.log(`Server is listening on 3000`);
});
```

新建 `generator.tsx`，代码如下：

```javascript
import { readFile } from "fs/promises";
import React from 'react';
import { renderJSXToHTML } from './utils'

export async function htmlGenerator() {
  const author = "YaYu";
  const postContent = await readFile("./posts/hello.txt", "utf8");

  let jsx = <html>
  <head>
    <title>My blog</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body className="p-5">
    <nav className="flex items-center justify-center gap-10 text-blue-600">
      <a href="/">Home</a>
    </nav>
    <article className="h-40 mt-5 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
      { postContent }
    </article>
    <footer className="h-20 mt-5 flex-1 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
      (c) { author }, {new Date().getFullYear()}
    </footer>
  </body>
</html>

  return renderJSXToHTML(jsx);
}
```

这里我们直接使用了 JSX 语法，tsx 会帮助我们进行编译，我们就不需要引入 Webpack 和 Babel 来处理了。

新建 `utils.ts`，代码如下：

```javascript
import escapeHtml from 'escape-html'

export function renderJSXToHTML(jsx) {
  if (typeof jsx === "string" || typeof jsx === "number") {
    return escapeHtml(jsx);
  } else if (jsx == null || typeof jsx === "boolean") {
    return "";
  } else if (Array.isArray(jsx)) {
    return jsx.map((child) => renderJSXToHTML(child)).join("");
  } else if (typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      let html = "<" + jsx.type;
      for (const propName in jsx.props) {
        if (jsx.props.hasOwnProperty(propName) && propName !== "children") {
          html += " ";
          html += propName;
          html += "=";
          html += `"${escapeHtml(jsx.props[propName])}"`;
        }
      }
      html += ">";
      html += renderJSXToHTML(jsx.props.children);
      html += "</" + jsx.type + ">";
      html = html.replace(/className/g, "class")
      return html;
    } else throw new Error("Cannot render an object.");
  } else throw new Error("Not implemented.");
}
```

renderJSXToHTML 的代码并不复杂，简单的来说，就是不断判断 jsx 对象节点的类型，递归处理，最终拼接得到一个 HTML 字符串。

运行 `npm start`，此时效果不变：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a7720bcef104226ac5a9602c63ee52e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1526\&h=1156\&s=79378\&e=png\&b=6689db)

> 1. 功能实现：React RSC 实现
> 2. 源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/react-rsc-2>
> 3. 下载代码：`git clone -b react-rsc-2 git@github.com:mqyqingfeng/next-app-demo.git`

## 步骤 3：发明组件

这里我们写的是一篇博客页面，但其实每个博客页面内容都是相似的，有着相同的顶部导航和页脚，为了代码能够复用，React 引入了组件的概念，将重复的内容抽离成一个组件，用到的地方直接引入使用即可。

我们来实现一下，新建 `components.tsx`，代码如下：

```javascript
import React from 'react';

export function BlogPostPage({ postContent, author }) {
  return (
    <html>
    <head>
      <title>My blog</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body className="p-5">
      <nav className="flex items-center justify-center gap-10 text-blue-600">
        <a href="/">Home</a>
      </nav>
      <article className="h-40 mt-5 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
        { postContent }
      </article>
      <Footer author={author} />
    </body>
  </html>
  );
}

export function Footer({ author }) {
  return (
    <footer className="h-20 mt-5 flex-1 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
      (c) { author }, {new Date().getFullYear()}
    </footer>
  );
}
```

这里我们将页脚抽离成 Footer 组件，然后在 BlogPostPage 组件中引入使用。

修改 `generator.tsx`，代码如下：

```javascript
import { readFile } from "fs/promises";
import React from 'react';
import { renderJSXToHTML } from './utils'
import { BlogPostPage } from './components'

export async function htmlGenerator() {
  const author = "YaYu";
  const postContent = await readFile("./posts/hello.txt", "utf8");
  return renderJSXToHTML(<BlogPostPage postContent={postContent} author={author}/>);
}
```

此时页面会空白，查看其 HTML 如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe6eadec72734b39a3d3047457437599~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2614\&h=698\&s=229146\&e=png\&b=faf9f8)

这是因为我们的 renderJSXToHTML 函数目前还只能识别普通的 HTML 标签，对于像 `<BlogPostPage>` 这样的组件类型并不能处理。

我们在写组件的时候，写的是一个函数，函数执行后才返回具体的 JSX 对象。所以我们在 render 的时候，需要判断节点是否是函数，如果是函数，就执行函数，渲染函数返回的 JSX 对象。

修改 `utils.js`中的 renderJSXToHTML 函数，完整代码如下：

```javascript
import escapeHtml from 'escape-html'

export function renderJSXToHTML(jsx) {
  if (typeof jsx === "string" || typeof jsx === "number") {
    return escapeHtml(jsx);
  } else if (jsx == null || typeof jsx === "boolean") {
    return "";
  } else if (Array.isArray(jsx)) {
    return jsx.map((child) => renderJSXToHTML(child)).join("");
  } else if (typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      // 普通 HTML 标签
      if (typeof jsx.type === "string") {
        let html = "<" + jsx.type;
        for (const propName in jsx.props) {
          if (jsx.props.hasOwnProperty(propName) && propName !== "children") {
            html += " ";
            html += propName;
            html += "=";
            html += `"${escapeHtml(jsx.props[propName])}"`;
          }
        }
        html += ">";
        html += renderJSXToHTML(jsx.props.children);
        html += "</" + jsx.type + ">";
        html = html.replace(/className/g, "class")
        return html;
      }
      // 组件类型如 <BlogPostPage> 
      else if (typeof jsx.type === "function") {
        const Component = jsx.type;
        const props = jsx.props;
        const returnedJsx = Component(props);
        return renderJSXToHTML(returnedJsx); 
      } else throw new Error("Not implemented.");
    } else throw new Error("Cannot render an object.");
  } else throw new Error("Not implemented.");
}
```

运行 `npm start`，此时效果不变：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79a9cb20bc954dfb9bf2294966768a4d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1526\&h=1156\&s=79378\&e=png\&b=6689db)

JSX 和组件不就是 React 的基础吗？从某种角度来讲，我们已经手写了一个 React 雏形。

> 1. 功能实现：React RSC 实现
> 2. 源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/react-rsc-3>
> 3. 下载代码：`git clone -b react-rsc-3 git@github.com:mqyqingfeng/next-app-demo.git`

## 步骤 4：添加路由

现在我们实现了一个博客内容页面，但我想实现的效果是，当访问 `/` 的时候，展示博客文章列表，访问 `/hello` 的时候，才展示 hello.txt 这篇文章的具体内容。

我们再添加一篇文章，新建 `/posts/earth.txt`，内容随意，比如：

```javascript
<h1>Hello Earth!</h1>
```

修改 `components.tsx`代码如下：

```jsx
import React from 'react';

export function Layout({ children }) {
  const author = "YaYu";
  return (
    <html>
    <head>
      <title>My blog</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body className="p-5">
      <nav className="flex items-center justify-center gap-10 text-blue-600">
        <a href="/">Home</a>
      </nav>
      <main>{children}</main>
      <Footer author={author} />
    </body>
  </html>
  );
}

export function IndexPage({ slugs, contents }) {
  return (
    <section>
      <h1>Blog List:</h1>
      <div>
        {slugs.map((slug, index) => (
          <section key={slug} className="mt-4">
            <a className="text-blue-600" href={"/" + slug}>{slug}</a>
            <article className="h-40 mt-5 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">{contents[index]}</article>
          </section>
        ))}
      </div>
    </section>
  );
}

export function PostPage({ slug, content }) {
  return (
    <section>
      <a className="text-blue-600" href={"/" + slug}>{slug}</a>
      <article className="h-40 mt-5 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">{content}</article>
    </section>
  );
}

export function Footer({ author }) {
  return (
    <footer className="h-20 mt-5 flex-1 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
      (c) { author }, {new Date().getFullYear()}
    </footer>
  );
}
```

这里我们新建了 4 个组件，其中 Layout 负责基础的 HTML 样式，包含顶部的导航栏和页脚，Footer 负责页脚。IndexPage 负责首页的文章样式，PostPage 负责具体文章页面的样式。

当访问 `/` 的时候，应该导航至 `IndexPage`，当访问 `/xxx` 的时候，应该导航至 `PostPage`，这个功能就叫做路由（Router），不过现在我们先用一个 matchRouter 函数实现。

修改 `index.ts`，代码如下：

```javascript
import express from "express";
import { htmlGenerator } from "./generator";
const app = express();

app.get("/:route(*)", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const html = await htmlGenerator(url);
  res.setHeader("Content-Type", "text/html");
  res.end(html);
});

app.listen(3000, (err) => {
  if (err) return console.error(err);
  return console.log(`Server is listening on 3000`);
});
```

我们获取了当前的页面地址，并将其传入 htmlGenerator 函数。

修改 `generator.tsx`，代码如下：

```javascript
import { readFile, readdir } from "fs/promises";
import React from 'react';
import { renderJSXToHTML } from './utils'
import { Layout, IndexPage, PostPage } from './components'

export async function htmlGenerator(url) {
  const content = await readFile("./posts/hello.txt", "utf8");
  const page = await matchRoute(url);
  return renderJSXToHTML(<Layout>{page}</Layout>);
}

async function matchRoute(url) {
  if (url.pathname === "/") {
    const files = await readdir("./posts");
    const slugs = files.map((file) => file.slice(0, file.lastIndexOf(".")));
    const contents = await Promise.all(
      slugs.map((slug) =>
        readFile("./posts/" + slug + ".txt", "utf8")
      )
    );
    return <IndexPage slugs={slugs} contents={contents} />;
  } else {
    const slug = url.pathname.slice(1);
    const content = await readFile("./posts/" + slug + ".txt", "utf8");
    return <PostPage slug={slug} content={content} />;
  }
}
```

我们写了一个 matchRoute 函数，根据 URL 返回不同的组件（IndexPage 或 PostPage），然后将组件作为 children 传入 Layout 组件中，得到最终的 JSX 对象。

此时交互效果如下：

![react-rsc.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a961ac78c384c759e4acc49bf7a3bf6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=687\&h=1018\&s=157055\&e=gif\&f=53\&b=626be8)

> 1. 功能实现：React RSC 实现
> 2. 源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/react-rsc-4>
> 3. 下载代码：`git clone -b react-rsc-4 git@github.com:mqyqingfeng/next-app-demo.git`

## 步骤 5：异步组件与 Router

其实目前的组件抽象还是有点问题的，IndexPage 和 PostPage 的文章样式（图中紫色部分）其实是重复的，我们应该抽离一个 Post 组件，然后 IndexPage 和 PostPage 引用 Post 组件。

不仅如此，现在我们在 matchRoute 这个函数中实现了路由匹配和获取数据（readdir、readFile），但其实没有必要，因为反正都是在服务端运行，获取数据完全可以放在具体的 Post 组件中运行，这样我们就可以将获取数据的代码从 matchRoute 中分离出来，让 matchRoute 如它的函数名一样，专注于路由匹配，而非掺杂数据获取的代码。

直接说似乎有点抽象，让我们写代码吧。

修改 `components.tsx`，完整代码如下：

```jsx
import React from 'react';
import { readFile, readdir } from "fs/promises";

export function Layout({ children }) {
  const author = "YaYu";
  return (
    <html>
    <head>
      <title>My blog</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body className="p-5">
      <nav className="flex items-center justify-center gap-10 text-blue-600">
        <a href="/">Home</a>
      </nav>
      <main>{children}</main>
      <Footer author={author} />
    </body>
  </html>
  );
}

export async function IndexPage() {
  const files = await readdir("./posts");
  const slugs = files.map((file) =>
    file.slice(0, file.lastIndexOf("."))
  );

  return (
    <section>
      <h1>Blog List:</h1>
      <div>
        {slugs.map((slug, index) => <Post key={index} slug={slug} />)}
      </div>
    </section>
  );
}

export function PostPage({ slug }) {
  return <Post slug={slug} />;
}

async function Post({ slug }) {
  let content = await readFile("./posts/" + slug + ".txt", "utf8");
  return (
    <section>
      <a className="text-blue-600" href={"/" + slug}>{slug}</a>
      <article className="h-40 mt-5 flex-1 rounded-xl bg-indigo-500 text-white flex items-center justify-center">{content}</article>
    </section>
  )
}

export function Footer({ author }) {
  return (
    <footer className="h-20 mt-5 flex-1 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
      (c) { author }, {new Date().getFullYear()}
    </footer>
  );
}
```

在这段代码中，我们抽离了一个 Post 组件，并将数据读取放在了 IndexPage 和 Post 组件中实现。因此我们的 matchRouter 函数得以简化，我们将函数替换为 Router 组件，修改 `generator.tsx`，代码如下：

```javascript
import { readFile, readdir } from "fs/promises";
import React from 'react';
import { renderJSXToHTML } from './utils'
import { Layout, IndexPage, PostPage } from './components'

export async function htmlGenerator(url) {
  return renderJSXToHTML(<Router url={url} />);
}

function Router({ url }) {
  let page;
  if (url.pathname === "/") {
    page = <IndexPage />;
  } else {
    const slug = url.pathname.slice(1);
    page = <PostPage slug={slug} />;
  }
  return <Layout>{page}</Layout>;
}
```

此时页面渲染失败，是因为我们的组件函数使用了 async，所以渲染的时候，也要对应进行处理，修改 `utils.ts`，代码如下：

```javascript
import escapeHtml from 'escape-html'

export async function renderJSXToHTML(jsx) {
  if (typeof jsx === "string" || typeof jsx === "number") {
    return escapeHtml(jsx);
  } else if (jsx == null || typeof jsx === "boolean") {
    return "";
  } else if (Array.isArray(jsx)) {
    // 这里添加了 await 和 Promise.all
    const childHtmls = await Promise.all(
      jsx.map((child) => renderJSXToHTML(child))
    );
    return childHtmls.join("");
  } else if (typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "string") {
        let html = "<" + jsx.type;
        for (const propName in jsx.props) {
          if (jsx.props.hasOwnProperty(propName) && propName !== "children") {
            html += " ";
            html += propName;
            html += "=";
            html += `"${escapeHtml(jsx.props[propName])}"`;
          }
        }
        html += ">";
        // 这里添加了 await
        html += await renderJSXToHTML(jsx.props.children);
        html += "</" + jsx.type + ">";
        html = html.replace(/className/g, "class")
        return html;
      }
      else if (typeof jsx.type === "function") {
        const Component = jsx.type;
        const props = jsx.props;
        // 这里添加了 await
        const returnedJsx = await Component(props);
        return renderJSXToHTML(returnedJsx); 
      } else throw new Error("Not implemented.");
    } else throw new Error("Cannot render an object.");
  } else throw new Error("Not implemented.");
}
```

此时页面正常渲染：

![react-rsc.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccfbef805f1b4416a2b1b83a2a1d492d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=687\&h=1018\&s=157055\&e=gif\&f=53\&b=626be8)

> 1. 功能实现：React RSC 实现
> 2. 源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/react-rsc-5>
> 3. 下载代码：`git clone -b react-rsc-5 git@github.com:mqyqingfeng/next-app-demo.git`

回过头来看我们的 Router 组件：

```javascript
function Router({ url }) {
  let page;
  if (url.pathname === "/") {
    page = <IndexPage />;
  } else {
    const slug = url.pathname.slice(1);
    page = <PostPage slug={slug} />;
  }
  return <Layout>{page}</Layout>;
}
```

它接收当前 URL，然后返回对应的组件。用过 React-Router 的同学可能知道，React-Rouer 有一个 StaticRouter，用于处理 node 环境下的路由，基本用法如下：

```javascript
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import http from "http";

function requestHandler(req, res) {
  let html = ReactDOMServer.renderToString(
    <StaticRouter location={req.url}>
      {/* The rest of your app goes here */}
    </StaticRouter>
  );

  res.write(html);
  res.end();
}

http.createServer(requestHandler).listen(3000);
```

你可以发现非常相似，也是接收当前 URL，返回对应的组件。从某种角度来说，我们实现了一个 React-Router 的雏形。

## 总结

本篇我们从最原始的页面开发方式开始，讲述了 React 和 React-Router 的起源背景，手写了 React 和 React-Router 最基础的实现方式。因为这个例子的所有代码都运行在服务端，所以这其实也是 React SSR 的基础实现，甚至比 [《源码篇 | 手写 React SSR》](https://juejin.cn/book/7307859898316881957/section/7309116396511133705) 实现的还要基础，就比如我们手写的 renderJSXToHTML 对应的其实就是 root.render 函数。

不过至此，其实还没有涉及到任何 RSC 相关的内容，因为我们的进度相当于在追溯 React 的发展历史，目前才刚发展到 React SSR，下个阶段才开始进入 React Server Components 呢，快开始进入下一篇吧！
