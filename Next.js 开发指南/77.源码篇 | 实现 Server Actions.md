## 前言

本篇我们会在 [《源码篇 | 实现 Streaming》](https://juejin.cn/book/7307859898316881957/section/7309115240284127283)的基础上，实现 Server Actions 功能。

如果没有实现之前的代码，可以运行：

```javascript
# 下载指定分支的代码
git clone -b react-rsc-10 git@github.com:mqyqingfeng/next-app-demo.git
# 进入目录并安装依赖项
cd next-app-demo && npm i
# 启动
npm start
```

为了演示 Server Actions 的效果，我们将以实现博客评论功能为例。

在具体技术实现上，我们将使用 `<form>` 实现评论框，评论内容储存在 JSON 文件中。此外我们会拓展 client.js 中的逻辑以拦截表单提交，防止提交数据的时候，页面重新加载。

简单来说就是，form 表单提交后，页面无刷新，评论列表立刻更新。就像我们使用 Next.js 实现的效果一样。具体效果如下：

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d64a79d94cd491f9fd2b8b597079b2c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=603\&h=961\&s=66492\&e=gif\&f=33\&b=fefefe" width="300">

## Step1：实现正常表单提交

我们先实现正常的表单提交，也就是使用 `<form>` 的 action 属性进行提交。

先添加表单和评论列表组件，修改`components.tsx`，添加如下代码：

```jsx
export function PostPage({ slug }) {
  return (
    <Suspense fallback={<p>Loading Post...</p>}>
      <Post slug={slug} />
      <CommentForm slug={slug} />
      <CommentList slug={slug} />
    </Suspense>
  );
}

async function CommentForm({ slug }) {
  return (
    <form id="form" method="POST" action="/actions/comment" className="my-6 flex max-w-md gap-x-4 mx-auto">
      <input
        name="comment"
        required
        className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
        placeholder="Enter your Comment"
        />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
        Submit
      </button>
    </form>
  )
}

async function CommentList({ slug }) {
  let comments
  try {
    const commentsData = await readFile("./comments/" + slug + ".json", "utf8")
    comments = JSON.parse(commentsData)
  } catch (err) {
    comments = []
  }

  return (
    <div>
      <h2>Comments:</h2>
      <div className='divide-y divide-gray-100'>
        {comments.map((comment, i) => {
      return (
        <div key={i} className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <div className="text-sm font-medium leading-6 text-gray-900">Floor {i+1}</div>
          <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{comment.content}</div>
        </div>
      )
    })}
      </div>
    </div>
  )
}
```

代码并不复杂，修改了 `<PostPage>`组件，新增了 `<CommentForm>` 和 `<CommentList>`组件。在 `<CommentForm>` 中，我们将表单数据提交到 `/actions/comment`，表示这是一个 Server Action，提交的数据有两个字段，其中 comment 字段表示具体评论的内容，slug 字段表示具体是哪篇文章的评论。

我们来实现下 `/actions/comment`请求处理，为了更便捷的处理表单提交数据，我们引入 body-parser，这是 Express 处理 body 非常常用的一个库。运行：

```bash
npm i body-parser
```

修改 `server/ssr.ts`，完整代码如下：

```javascript
import express from "express";
import { readFile } from "fs/promises";
import fetch from 'node-fetch';
import { renderToPipeableStream } from "react-dom/server"
import { createFromNodeStream } from "react-server-dom-webpack/client"
import bodyParser from 'body-parser';
import { serverAction }  from "../actions";

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/:route(*)", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // client.js
  if (url.pathname === "/client.js") {
    const content = await readFile("./client.js", "utf8");
    res.setHeader("Content-Type", "text/javascript");
    res.end(content);
    return;
  }

  const response = await fetch("http://127.0.0.1:3001" + url.pathname);

  if (!response.ok) {
    res.statusCode = response.status;
    res.end();
    return;
  }
  const stream = response.body;

  // 获取客户端 JSX 对象
  if (url.searchParams.has("jsx")) {
    res.set("Content-type", "text/x-component")
    stream.on("data", (data) => {
      res.write(data)
    })
    stream.on("end", (data) => {
      res.end()
    })
  }
  // 获取 HTML
  else {
    const root = await createFromNodeStream(stream, {})
    res.set("Content-type", "text/html")
    const { pipe } = renderToPipeableStream(root)
    pipe(res)
  }
});

app.post("/actions/:route(*)", async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/actions/")) {
    await serverAction(req, res)
  }
});

app.listen(3000, (err) => {
  if (err) return console.error(err);
  return console.log(`Server is listening on 3000`);
});
```

Next.js 中的 Server Actions 只支持 POST 请求，所以我们也写在 POST 请求上。如果请求以 `/actions`开头，并且是 POST 请求，我们就调用 serverAction 方法。

新建 `actions.ts`，写入具体的 serverAction 函数：

```javascript
export async function serverAction(req, res) {
  const action = req.url.slice(9)

  const module = await import("./actions/" + action + ".js")
  const actionFunction = module.default
  await actionFunction(req, res)

  res.redirect(302, "/" + req.body.slug)
}
```

我们使用 Next.js Server Actions 的时候，往往会新建一个 `actions.js`，然后在其中写入具体的逻辑处理，换句话说，具体处理的逻辑由用户定义。这里我们也是交给用户来定义，如果请求的是 `/actions/comment` 对应的处理代码就在 `/actions/comment.js`中。

新建 `actions/comment.ts`，代码如下：

```javascript
import { readFile, writeFile } from "fs/promises"

export default async function handleCommentPost(req, res) {
  const {slug, comment} = req.body

  let comments

  try {
    const commentsData = await readFile("./comments/" + slug + ".json", "utf8")
    comments = JSON.parse(commentsData)
  } catch (err) {
    if (err.code === "ENOENT") {
      comments = []
    } else {
      throw err
    }
  }

  comments.push({
    content: comment
  })
  
  const commentsFile = "./comments/" + slug + ".json"
  await writeFile(commentsFile, JSON.stringify(comments, null, 2))
}
```

处理的代码并不复杂，读取保存数据的 json 文件，然后写入新的数据。目前还没有建立 json 文件，\*\*我们先新建 \*\*`**comments**`**文件夹，防止出现读取错误**。

此时涉及到的文件目录结构如下：

```javascript
next-app-demo         
├─ actions            
│  └─ comment.ts   
├─ comments                
├─ server             
│  ├─ rsc.ts          
│  └─ ssr.ts          
├─ actions.ts          
├─ components.tsx         
```

在 `actions.ts`中，最后我们调用了 `res.redirect`返回之前的页面。

此时交互效果如下：

![react-rsc-15.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a7824f7f06149aebd57ff82ed70d811~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1396\&h=968\&s=510411\&e=gif\&f=35\&b=f9f9f9)

表单数据成功提交和渲染。其实现逻辑是，Form 表单数据提交到 `/actions/comment`，对应读取 `/actions/comment.js`文件进行处理，然后重定向回到之前的页面，页面重新加载，评论列表数据更新。

因为我们用的是 form 的 action 提交的数据，所以即使禁用 JavaScript，表单也是可以成功提交的。禁用 JavaScript 的效果如下：

![react-rsc-10.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b872250515944bc293595c09acb6fa94~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1599\&h=934\&s=154352\&e=gif\&f=48\&b=fdfdfd)

注：这里的演示，我们删除了 Suspense 组件，因为 Suspense 需要依赖 JS，在获得数据后，更新 DOM 节点。此外因为我们的 tailwind.css 是通过 `<script>`标签引入的，所以禁用 JavaScript 时，样式失效。但是表单依然可以正常提交。

## Step2: 客户端拦截表单提交

但是在 Next.js 中，使用 Server Action 提交表单，页面是不会刷新的。这是因为客户端拦截了表单提交。

修改 `client.js`，添加如下代码：

```javascript
window.addEventListener("submit", async (e) => {
  const action = e.target.action
  const actionURL = new URL(action, window.location.origin)

  if (!actionURL.pathname.startsWith("/actions/")) {
    return
  }

  e.preventDefault()

  if (e.target.method === "post") {
    const formData = new FormData(e.target)
    const body = Object.fromEntries(formData.entries())
    const response = await fetch(action, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) return
    navigate(window.location.pathname, true)
    return
  } else {
    console.error("unknown method", e.target.method)
  }
})
```

这段代码逻辑并不复杂，首先是阻止表单提交，然后是以 POST 请求调用 `/actions/comment`，具体返回的数据我们并未处理，主要是触发对应 `/actions/comment.ts`代码的执行，最后调用 navigate 函数重新渲染页面。交互效果如下：

![react-rsc-16.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9278db4806b94d18a45488c2a5b1ea72~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1276\&h=931\&s=107898\&e=gif\&f=28\&b=fcfbfc)

你会发现，很奇怪，评论并没有更新。按理说，提交的时候应该有 3 个请求产生，首先是 `/actions/comment`请求，由客户端触发，`actions.ts`代码重定向到原页面，于是触发了第 2 个 `earth` 请求，客户端同时执行了 `naviagte` 函数，触发第三个 `/earth?jsx`请求。

但是现在只有 2 个请求，没有第 3 个 `/earth?jsx`请求。这是因为我们在之前的实现中实现了客户端路由缓存，所以用了缓存中的数据。

继续修改 `client.js`，代码如下：

```javascript
async function navigate(pathname, revalidate) {
  currentPathname = pathname;
  if (!revalidate && clientJSXCache[pathname]) {
    updateRoot(clientJSXCache[pathname])
    return
  } else {
    const response = fetch(pathname + '?jsx')
    const root = await createFromFetch(response)
    clientJSXCache[pathname] = root
    startTransition(() => {
      updateRoot(root)
    })
  }
}
```

我们添加了一个 revalidate 变量，当为 true 的时候，不读取缓存，重新请求。此时页面正常运行：

![react-rsc-17.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/076c967f649d428da4f09ba67d498cf0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1276\&h=931\&s=174683\&e=gif\&f=38\&b=fcfbfc)

注：提交的时候之所以会有卡顿感，是因为我们为文章添加了 2s 延迟。

想想 [《缓存篇 | Caching（下）》](https://juejin.cn/book/7307859898316881957/section/7344650215729430565#heading-6)中，我们讲到客户端路由缓存的失效方式：

> 有两种方法可以让路由缓存失效：
>
> 1.  在 Server Action 中
>     1.  通过 revalidatePath 或 revalidateTag 重新验证数据
>     2.  使用 cookies.set 或者 cookies.delete 会使路由缓存失效，这是为了防止使用 cookie 的路由过时（如身份验证）
> 2.  调用 router.refresh 会使路由缓存失效并发起一个重新获取当前路由的请求

我们这里的实现就是一个简易的 Server Action revalidate  功能。

> 1.  功能实现：Server Action
> 2.  源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/react-rsc-11>
> 3.  下载代码：`git clone -b react-rsc-11 git@github.com:mqyqingfeng/next-app-demo.git`

## 总结

至此，我们的 Server Actions 功能就实现了，其实跟 Next.js 的实现有很大的差别。

在 Next.js 中，Server Actions 的请求是以 POST 请求提交到当前页面的 URL，提交的时候会携带 \$ACTION\_ID 以区分不同的 Server Action。同时 Next.js 会在这一次请求中返回所有需要的信息，然后更新状态，不像我们这般简单粗暴的重新请求。

但原理是类似的，希望这个简单的 Server Actions 实现对大家理解 Next.js 的实现有所帮助。
