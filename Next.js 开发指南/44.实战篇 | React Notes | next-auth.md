## 前言

本篇我们来讲解 Authentication。先介绍下 Authentication 相关的名词：

**Authentication**：

> 身份验证（英语：Authentication）又称“认证”、“鉴权”，是指通过一定的手段，完成对用户身份的确认。

**Authorization**：

> 授权（英语：Authorization）是指根据用户提供的身份凭证，生成权限实体，并为之授予相应的权限。

**OAuth (Open Authorization)**：

> 开放授权（OAuth）是一个开放标准，允许用户让第三方应用访问该用户在某一网站上存储的私密的资源（如照片，视频，联系人列表），而无需将用户名和密码提供给第三方应用。
>
> OAuth 允许用户提供一个令牌，而不是用户名和密码来访问他们存放在特定服务提供者的数据。每一个令牌授权一个特定的网站（例如，视频编辑网站)在特定的时段（例如，接下来的2小时内）内访问特定的资源（例如仅仅是某一相册中的视频）。这样，OAuth让用户可以授权第三方网站访问他们存储在另外服务提供者的某些特定信息，而非所有内容。

举个例子，你自己开发了一个图片网站，自己开发登陆注册功能，用户登录后展示该用户的私有图片，这是 Authentication。你使用第三方网站认证用户身份，比如谷歌登录，让第三方网站提供用户身份认证，这是“认证”服务，也是 Authentication。

而 OAuth 是第三方网站允许你直接操作它的用户数据，比如你接入谷歌相册，你不会知道用户的谷歌账号的密码，但谷歌会给你一个 token，这个 token 决定了你能拥有的权限，比如可以读取谷歌相册里的图片，同步到自己的网站中，这属于"授权"服务（Authorization）。

在 Next.js 项目中，主流的支持 App Router 的 Authentication 解决方案有：

*   [NextAuth.js](https://next-auth.js.org/configuration/nextjs#in-app-router)
*   [Clerk](https://clerk.com/docs/quickstarts/nextjs)
*   [Auth0](https://github.com/auth0/nextjs-auth0#app-router)
*   [Stytch](https://stytch.com/docs/example-apps/frontend/nextjs)
*   [Kinde](https://kinde.com/docs/developer-tools/nextjs-sdk/)

这是它们的 [npm trends](https://npmtrends.com/@auth0/nextjs-auth0-vs-@clerk/nextjs-vs-@stytch/nextjs-vs-next-auth)：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57141fc0f0fd4fcb96325eae28aa6e8e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2692\&h=1778\&s=388064\&e=png\&b=fefefe)

可以看出 `next-auth` 目前是最多人的选择。

可能会有一些同学提到 [Supabase](https://supabase.com/)，Supabase 是一个开源的后端即服务（BaaS）平台，它提供了数据库、身份验证、实时数据和文件存储等功能。它可以搭配 NextAuth.js、Clerk 等使用。

## 需求

我们来实现这样一个需求：

接入 GitHub 第三方登录。页面顶部出现登录和退出登录选项，点击登录的时候，跳转 GitHub 授权登录，登录完成后显示用户名和退出登录选项，点击退出登录即退出登录。效果图如下：

![ReactNotes-Auth5.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75dd5fd116814ad18bdd3484bd9bd29c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=897\&h=747\&s=214715\&e=gif\&f=56\&b=f3f5f9)

## next-auth

借助 `next-auth`，其实代码一点也不复杂，让我们来实现吧！

### 1. GitHub 申请 OAuth 应用

在 GitHub 申请 [OAuth 应用](https://github.com/settings/applications/new)：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4658f547cd0a4ef09dddd04967d5e346~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1092\&h=804\&s=125059\&e=png\&b=0e1116)

因为目前在本地开发，所以 Homepage URL 填写 `http://localhost:3000`。`Authorization callback URL`填写 `http://localhost:3000/api/auth/callback/github`，具体它的处理逻辑会由 `next-auth` 来实现。

新建后，点击 `Generate a new client secret`按钮，生成 `Client secret`，注意生成的时候， `Client secret`只能看到一次，所以需要及时保存下来，刷新了页面就查不到了。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98706b6cc0fe4df68de97a68286dddae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1582\&h=610\&s=94006\&e=png\&b=0e1116)

### 2. 设置环境变量

获取到 GitHub Client ID 和 GitHub secrets 后，为了防止信息泄露，将其放入到环境变量中。详细信息参考 《[配置篇 | 环境变量、路径别名与 src 目录》](https://juejin.cn/book/7307859898316881957/section/7309078454316564507)。

现在我们在**项目根目录**下建立一个 `.env` 文件：

```javascript
AUTH_GITHUB_ID=aac6f92981918fc75c31
AUTH_GITHUB_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
AUTH_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

注意这里的环境变量名，在 `next-auth` v4 中可以自定义，v5 改为自动推断的方式，所以约定就是使用这些名字，具体参考 [next-auth v5 文档](https://authjs.dev/reference/nextjs#environment-variable-inferrence)。

其中 `AUTH_SECRET` 是一个随机字符串，用于加密 tokens 和邮件验证哈希值，保证安全性。你可以执行：`openssl rand -base64 32` 或者打开 <https://generate-secret.vercel.app/32> 获取一个随机值。

### 3. 添加 API 路由

安装 `next-auth`：

```bash
npm install next-auth@beta
```

注意这里安装的是 `next-auth@beta`，也就是目前正在处于 beta 阶段的 `next-auth`v5，我写的时候用的具体版本是 `5.0.0-beta.4`。

根目录下新建 `auth.js`，代码如下：

```javascript
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
export const { handlers, auth, signIn, signOut } = NextAuth({ providers: [ GitHub ] })
```

为了方便导入，修改 `jsconfig.json`：

```javascript
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/actions": ["app/actions.js"],
      "@/*": ["/*"],
      "auth": ["./auth"]
    }
  }
}
```

新建 `/app/api/auth/[...nextauth]/route.js`，代码如下：

```javascript
import { handlers } from "auth"
export const { GET, POST } = handlers
```

### 4. 服务端组件获取  session

在 `app/layout.js`中引入一个 `<Header>` 组件：

```javascript
import './style.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default async function RootLayout({
  children
}) {

  return (
    <html lang="en">
      <body>
        <div className="container">
          <Header />
          <div className="main">
            <Sidebar />
            <section className="col note-viewer">{children}</section>
          </div>
        </div>
      </body>
    </html>
  )
}
```

新建 `components/Header.js`，代码如下：

```jsx
import { signIn, signOut, auth } from "auth"

function SignIn({
  provider,
  ...props
}) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn(provider)
      }}
    >
      <button {...props}>Sign In</button>
    </form>
  )
}

function SignOut(props) {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button {...props}>
        Sign Out
      </button>
    </form>
  )
}

export default async function Header() {
  const session = await auth()
  return (
    <header style={{ display: "flex", "justifyContent": "space-around" }}>
      {
        session?.user
          ? <span style={{ display: "flex", "alignItems": "center" }}>{session?.user.name}<SignOut /></span>
          : <SignIn />
      }
    </header>
  )
}
```

现在 GitHub 登陆授权就已经实现了，效果如下：

![ReactNotes-Auth5.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9ef79b76ef14b6ba0dff114a12fe6ec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=897\&h=747\&s=214715\&e=gif\&f=56\&b=f3f5f9)

如果登陆的时候报如下错误：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a441d6ccd4ea45ab94df9b8dd8b6d7e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1612\&h=352\&s=84714\&e=png\&b=1e1e1e)

可能是因为网络原因，把代理设置为全局模式试试。

### 5. 原理解析

你可能会惊讶，三方登录这么简单的吗？其实还是稍微有点复杂的，只是 `next-auth` 都替你做好了而已。

当你创建了 `/app/api/auth/[...nextauth]/route.js`时，以下这些路由就都由 next-auth 创建并处理了：

*   GET/api/auth/signin
*   POST/api/auth/signin/:provider
*   GET/POST/api/auth/callback/:provider
*   GET/api/auth/signout
*   POST/api/auth/signout
*   GET/api/auth/session
*   GET/api/auth/csrf
*   GET/api/auth/providers

这些路由有的处理登录，有的是处理退出登录，有的是处理三方登录回调……有的路由你可以直接在浏览器中访问：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ff1b6f7b42b404cb391850db269824f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2416\&h=242\&s=76788\&e=png\&b=1e1e1e)

当用户点击 `SignIn` 按钮的时候，跳转到 `locahost:3000/api/auth/signin`：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/298fbeb5aaa44295820ef7403ceffe98~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1872\&h=1162\&s=101823\&e=png\&b=ededed)

这个页面根据你提供的 providers 选项而生成，在这里我们只配置了 GitHub 登陆，所以显得有点简陋。但如果配置齐全的话，效果可以如下（当然具体样式也支持自定义，详细请参考文档）：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e519913905244a26b1d5de45d8dc5920~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=429\&h=430\&s=23873\&e=png\&b=fefefe)

这里我们以 GitHub 的 OAuth 为例，当我们点击 `Sign in with Github`，查看对应的元素：

![截屏2024-01-04 下午8.49.35.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dafefb97f0e142358dac5a6aa9a43d51~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2626\&h=956\&s=308067\&e=png\&b=2a2a2a)

你会发现这是一个表单提交，提交地址为 `http://localhost:3000/api/auth/signin/github`，请求方法为 POST，`next-auth` 会根据 `auth.js` 提供的选项计算 GitHub 登陆所需的值如 `client_id`（AUTH\_GITHUB\_ID）、scopes（权限范围） 等，然后拼接跳转到 `https://github.com/login`，也就是我们登录 GitHub 的页面：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecc4c9b8071a4a548edb93f9aa1495c1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2392\&h=1434\&s=188991\&e=png\&b=0f1217)

此时的地址为：

```jsx
https://github.com/login?client_id=aac6f92981918fc75c31&return_to=%2Flogin%2Foauth%2Fauthorize%3Fclient_id%3Daac6f92981918fc75c31%26code_challenge%3DVTZmNV47SyxgplMwziDvW0kgxNwV3WsJPnlr6yf7TDI%26code_challenge_method%3DS256%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A3000%252Fapi%252Fauth%252Fcallback%252Fgithub%26response_type%3Dcode%26scope%3Dread%253Auser%2Buser%253Aemail
```

我们解码一下：

```javascript
https://github.com/login?
client_id=aac6f92981918fc75c31
&return_to=/login/oauth/authorize?client_id=aac6f92981918fc75c31
&code_challenge=VTZmNV47SyxgplMwziDvW0kgxNwV3WsJPnlr6yf7TDI
&code_challenge_method=S256
&redirect_uri=http://localhost:3000/api/auth/callback/github&response_type=code&scope=read:user user:email
```

当我们填写密码登录后，会跳转到`github.com/login/oauth/authorize`上：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6cb208958b44531950914b9bdc30100~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2412\&h=476\&s=99347\&e=png\&b=fefefe)

当我们在 GitHub 完成授权后，GitHub 会重定向到我们之前在 OAuth App 中设置的`Authorization callback URL`也就是 `http://localhost:3000/api/auth/callback/github`，其中网址参数中会包含临时 code。临时 code 会在 10 分钟后过期。

在 `http://localhost:3000/api/auth/callback/github`这个路由下，next-auth 会获取临时 code，POST 请求 `https://github.com/login/oauth/access_token`获取 `access_token`，用此 token 可以获取用户信息，next-auth 会生成 session token 并且存储 session。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ef6eca8fc22484792e8d3a4852f8267~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3036\&h=1298\&s=440895\&e=png\&b=fefefe)

这一切本来需要由开发者自己开发，但借助 `next-auth`，几乎不用写多少代码就全部实现了。

### 6. 客户端组件获取  session

现在让我们回归到 `next-auth` 的具体用法，如果是客户端组件需要获取 session 数据，该怎么实现呢？

为了演示用法，我们新建一个 `/client`路由，并在 `<Header>` 组件中添加链接，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16814cd8beb04284b499ff14e6a162b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2044\&h=1372\&s=210144\&e=png\&b=f5f6f9)

修改 `components/Header.js`，代码如下：

```javascript
import { signIn, signOut } from "auth"
import { auth } from "auth"
import Link from 'next/link'

function SignIn({
  provider,
  ...props
}) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn(provider)
      }}
    >
      <button {...props}>Sign In</button>
    </form>
  )
}

function SignOut(props) {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button {...props}>
        Sign Out
      </button>
    </form>
  )
}

export default async function Header() {
  const session = await auth()
  return (
    <header style={{display: "flex", "justifyContent": "space-around"}}>
        <Link href="/client">Client Side Component</Link>
        {
          !session?.user ? <SignIn /> : <span style={{display: "flex", "alignItems": "center"}}>{session?.user.name}   <SignOut /></span>
        }
    </header>
  )
}
```

此时页面样式如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c610fa7f48264e2a85026a1790f673d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2044\&h=1372\&s=210144\&e=png\&b=f5f6f9)

新建 `app/client/page.js`，代码如下：

```javascript
import { auth } from "auth"
import ClientComponent from "@/components/ClientComponent"
import { SessionProvider } from "next-auth/react"

export default async function ClientPage() {
  const session = await auth()
  if (session?.user) {
    // 选择需要的信息传给客户端，避免敏感信息泄露
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }
  }

  return (
    <SessionProvider session={session}>
      <ClientComponent />
    </SessionProvider>
  )
}
```

新建 `components/ClientComponent.js`，代码如下：

```javascript
"use client"

import { useSession } from "next-auth/react"

export default function ClientExample() {
  const { data: session, status } = useSession()
  return (
    <div>
      {status === "loading" ? (
        <div>Loading...</div>
      ) : <pre>{JSON.stringify(session, null, 2)}</pre>}
    </div>
  )
}
```

此时效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88af6a46afa54b8bb0577458dbe65ef0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1976\&h=1324\&s=231372\&e=png\&b=f3f4f7)

### 7. 保护部分页面

如果部分页面需要登录状态才能访问该怎么办呢？比如这个笔记系统谁都可以查看，但要想编辑，就需要先登录，该怎么实现呢？

你可以使用中间件，新建 `middleware.js`，代码如下：

```javascript
export { auth as middleware } from "auth"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

核心的判断逻辑在 `auth.js`中，使用 [callbacks.authorized](https://authjs.dev/reference/nextjs#authorized) 回调函数：

```javascript
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
export const { handlers, auth, signIn, signOut } = NextAuth({ providers: [ GitHub ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname.startsWith("/note/edit")) return !!auth
      return true
    },
  }
})
```

在中间件中，我们判断路由地址，如果以 `/note/edit` 开头，就判断 auth 是否存在，如果返回 true，则正常跳转，如果返回 false，则自动会重定向到登录页面，效果如下：

![ReactNotes-Auth6.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d75ebefcccb245e2a52c33d3015ca04a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1216\&h=803\&s=354463\&e=gif\&f=55\&b=fefefe)

如果不通过中间件，也可以直接在页面或组件中进行判断。比如如果是服务端组件，可以像现在的例子中那样，通过对 `auth()`返回的 session 进行判断，根据 `session.user` 是否存在来区分登录和未登录状态。如果是在客户端组件，可以通过 `useSession()` 返回的 `status` 来判断，比如修改 `components/Header.js`代码如下：

```javascript
"use client"

import { useSession } from "next-auth/react"

export default function Page() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>
  }

  return (
    <pre>{JSON.stringify(session, null, 2)}</pre>
  )
}
```

### 8. 自定义登陆逻辑

现在我不想要三方登录，我想要自己实现登陆页面行不行，`next-auth` 也可以帮助你实现！这就是 [Credentials Provider](https://authjs.dev/guides/providers/credentials)。

为了模拟用户注册和登录，我们在 `lib/redis.js` 中新增一个 `addUser` 和 `getUser` 方法：

```javascript
export async function addUser(username, password) {
  await redis.hset("users", [username], password);
  return {
    name: username,
    username
  }
}

export async function getUser(username, password) {
  const passwordFromDB = await redis.hget("users", username);
  if (!passwordFromDB) return 0;
  if (passwordFromDB !== password) return 1
  return {
    name: username,
    username
  } 
}
```

现在修改 `auth.js`，代码如下：

```javascript
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { addUser, getUser } from "@/lib/redis";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers:
    [CredentialsProvider({
      // 显示按钮文案 (e.g. "Sign in with...")
      name: "密码登录",
      // `credentials` 用于渲染登录页面表单
      credentials: {
        username: { label: "邮箱", type: "text", placeholder: "输入您的邮箱" },
        password: { label: "密码", type: "password", placeholder: "输入您的密码" }
      },
      // 处理从用户收到的认证信息
      async authorize(credentials, req) {
        // 默认情况下不对用户输入进行验证，确保使用 Zod 这样的库进行验证
        let user = null

        // 登陆信息验证
        user = await getUser(credentials.username, credentials.password)

        // 密码错误
        if (user === 1) return null

        // 用户注册
        if (user === 0) {
          user = await addUser(credentials.username, credentials.password)
        }

        if (!user) {
          throw new Error("User was not found and could not be created.")
        }

        return user
      }
    }), GitHub],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname.startsWith("/note/edit")) return !!auth
      return true
    },
  }
})
```

此时效果如下：

![ReactNotes-Auth7.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5fc2afefd104b938e097cbc8f102159~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1216\&h=803\&s=285245\&e=gif\&f=75\&b=f5f7fb)

`next-auth` 根据我们传入的 `credentials` 选项渲染登录页面，并且使用 `authorize` 函数处理登录逻辑。在这个例子中，如果用户不存在，就注册一个用户，如果用户名不正确，则提示错误。

注意：写这个例子的时候要删除 `middleware.js`，这是因为我们在代码中使用了 ioredis，ioredis 需要运行在 Nodejs Runtime，而 next.js 的 middleware 目前只能运行在 Edge Runtime。

### 9. 自定义登陆页面

如果项目用在国外，都是英文倒也可以接受，但如果用在国内，这种“Sign in With 密码登录”的文案可真让人想吐槽，我如果要完全自定义登陆页面呢？next-auth 提供了 [pages 选项](https://authjs.dev/guides/basics/pages)，修改 `auth.js`：

```javascript
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { addUser, getUser } from "@/lib/redis";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers:
    [// ...],
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname.startsWith("/note/edit")) return !!auth
      return true
    },
  }
})
```

新建 `app/auth/signin/page.js`，代码如下：

```javascript
'use client'

export default async function SignIn() {
  const response = await fetch('http://localhost:3000/api/auth/csrf');
  const {csrfToken} = await response.json()
  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <label>
        Username
        <input name="username" type="text" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button type="submit">Sign in</button>
    </form>
  )
}
```

此时效果如下：

![ReactNotes-Auth8.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e9a0bee9e624fcfa7063eb06e7f186c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1081\&h=822\&s=120592\&e=gif\&f=45\&b=f3f5f9)

## 总结

那么今天的内容就结束了，本篇实现了 GitHub 授权登录和自定义登陆功能。这里用的是正处于 beta 阶段的 next-auth v5，v5 目前还有一些问题没有解决，文档也略显草率。实际项目开发的时候，还是推荐使用稳定版本的 v4。此外，Clerk 和 Supabase 也都是不错的选择，推荐使用。

本篇的代码我已经上传到[代码仓库](https://github.com/mqyqingfeng/next-react-notes-demo/tree/main)的 [Day 8](https://github.com/mqyqingfeng/next-react-notes-demo/tree/day8) 分支。直接使用的时候不要忘记在本地开启 Redis。

## 参考链接

1.  [OAuth authentication | Auth.js](https://authjs.dev/getting-started/providers/oauth-tutorial)
2.  <https://docs.github.com/zh/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps>
