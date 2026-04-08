## 前言

登录与注册，一个说简单也简单，说复杂也复杂的功能。

往简单的说，注册的时候搞两个输入框，将数据写入数据库，登录的时候校验一下数据是否正确即可。

往复杂的说，除了登录注册，还有账号注销、忘记密码、密码重置、邮箱验证、更新个人资料、更新密码、删除账号等功能，此外，数据的安全性如何保证？Magic Links、Multi-Factor Auth (MFA)、社交媒体登录 (Google, Facebook, Twitter, GitHub, Apple, and more) 是否要支持？是不是还要做个后台统计用户登录数据？想一想都是工作量。

所以虽然可以自己从头做，但有现成的还是用现成的吧。

所幸关于登录注册的技术方案，并不像评论系统那么多，推荐 3 个主流的技术选型：

1.  [**Clerk**](https://clerk.com/)

> The most comprehensive User Management Platform

Clerk 提供了一个开发人员友好的身份验证和用户管理解决方案，帮助开发者轻松构建和管理用户身份验证、用户账户和权限管理功能。它提供了安全的身份验证、社交登录集成、角色和权限管理等功能。

2.  [**Supabase**](https://supabase.com/)

> Supabase is an open source Firebase alternative.

> Start your project with a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, Storage, and Vector embeddings.

简单来说，Supabase 是 Firebase 的开源替代品，属于 BaaS（后端即服务）产品。所谓 BaaS，开发者只需要开发和维护前端代码，由 BaaS 服务商提供了开发应用所需要的后端服务，如用户身份验证、数据库管理、推送通知（针对移动应用程序），以及云存储和托管等。

此外，Supabase 建立在 Postgres 之上。Postgres 是一个免费的开源数据库，被认为是世界上最稳定、最先进的数据库之一。

所以用户身份验证只是 Supabase 提供的功能之一。

如果要比较 Clerk 和 Supabse 的话，Clerk 更专注于身份验证和用户管理，对应功能更加丰富。Supabase 实现的功能更多，身份验证只是其中之一。

实际使用的时候，两者也可以一起使用。Clerk 和 Supabse 各自提供了接入对方的文档：

1.  [Clerk：Integrate Supabase with Clerk](https://clerk.com/docs/integrations/databases/supabase)
2.  [Supabase：Integrate Clerk](https://supabase.com/partners/integrations/clerk)

注意：这两个平台都提供了免费版，但免费版毕竟有一些限制，比如 Clerk 会限制 10000 月活跃用户等，Supabse 会限制 50000 月活跃用户，数据库大小为 500 MB 等等。

3.  [**Next-Auth**](https://next-auth.js.org/getting-started/introduction)

我们在[《实战篇 | React Notes | next-auth》](https://juejin.cn/book/7307859898316881957/section/7317925907765657638)介绍的便是 Next-Auth，Next-auth 不是平台，是一个开源库，可以帮助我们快速实现登录注册等功能。

总的来说，如果要快速接入登录注册功能，最好还是使用平台，也就是 Clerk 和 Supabse，其中 Clerk 提供的功能更为丰富，但免费版月活限制用户数更少。

本篇我们对 Clerk 的使用进行讲解。

## Clerk

### 1. Clerk 注册并创建应用

打开 <https://clerk.com/> 注册一个账号，首次登录后会进入创建应用界面：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91000aed3a344c5098eafd1e09107741~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3414\&h=2088\&s=525729\&e=png\&b=ffffff)

输入应用的名字，左边选择支持的登录方式，右边为预览登录界面 UI，样式会根据左边的选择有所不同。

创建应用后，会跳转到 Get started 页面，指导用户如何接入 Clerk：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46bada6c507f4faa9886936f3fabb4d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3878\&h=2090\&s=687809\&e=png\&b=ffffff)

### 2. 接入 Clerk

为了演示如何[接入 Clerk](https://clerk.com/docs/quickstarts/nextjs)，我们使用官方脚手架创建一个新项目：

```bash
npx create-next-app@latest
```

项目安装依赖项：

```bash
npm install @clerk/nextjs
```

添加本地环境变量：

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxx
```

新建 `middleware.js`，代码如下：

```javascript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

修改 `app/layout.jsx`，代码如下：

```jsx
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
export default function RootLayout({
  children,
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
```

解释下这段代码中用到的组件：

所有 Clerk hooks 和组件都必须是 `<ClerkProvider>` 的子组件，所以我们用 `<ClerkProvider>` 将整个页面代码包裹，该组件会存储 session 和用户上下文数据。

`<SignedIn>`下的子组件仅在登录状态时显示。`<SignedOut>`下的子组件仅在非登录状态时显示。

`<SignInButton>` 是一个链接至登录页面的无样式组件。`<UserButton>`是一个 Clerk 提供的自带样式的组件，用于展示用户头像。

此时我们就实现了 Clerk 的接入，并已经实现了账号的登录、注册、账号管理、注销等功能。

打开 <http://localhost:3000/>，浏览器效果如下：

![4.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ea058d2522d491a8feacf7dc87617e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1353\&h=976\&s=866418\&e=gif\&f=146\&b=fdfdfd)

### 3. 添加中文

从上图可以发现，虽然 Clerk 实现了登录注册的功能，但有一个问题，那就是界面都是英文，如何改成中文界面呢？Clerk 也考虑到了这一点，并提供了[本地化方法](https://clerk.com/docs/components/customization/localization)。

安装依赖项：

```bash
npm install @clerk/localizations
```

修改 `app/layout.js`，代码如下：

```jsx
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import { zhCN } from "@clerk/localizations";

export default function RootLayout({
  children,
}) {
  return (
    <ClerkProvider localization={zhCN}>
      <html lang="zh-CN">
        <body>
          <SignedOut>
            <SignInButton mode="modal">
              登录
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton showName={true} />
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
```

此时浏览器效果如下：

![5.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d6b22f41eec4b2396ee8e8a8b18be3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1353\&h=976\&s=801725\&e=gif\&f=132\&b=fdfdfd)

注意：这里`<SignInButton>` 的 `mode` 设置为了 `"modal"` 才让登录界面的本地化生效。如果不设置为 modal 则会直接跳转到登录界面，此时本地化不会生效。如果让跳转登录界面也实现本地化的话，可以参考接下来讲到的 Next-js-Boilerplate 的实现方式。

### 4. 后台界面

Clerk 提供了后台界面，可以查看登录用户数据以及进行登录相关的设置：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28698b3eea6b44249a1f4240451feec0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3872\&h=2124\&s=622794\&e=png\&b=ffffff)

当然，Clerk 实现的功能远不止如此，你可以完全自定义登录界面、使用内置的组件自定义开发、构架自己的登录流程等等，Clerk 都提供了详细的文档：<https://clerk.com/docs>

## Next-js-Boilerplate

既然我们已经知道了 Next.js 项目如何接入 Clerk，那回到我们之前讲到的 Next-js-Boilerplate 模板。

### 1. 基础设置

在这个模板中使用 Clerk，最基础的就是设置 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 和 `CLERK_SECRET_KEY`。

> 从安全的角度来讲，应该将 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 放到 `.env`文件中，`CLERK_SECRET_KEY` 放到 `.env.local`文件中，并且 Git 不提交 `.env.local`

### 2. 登录路由

但与之前简易接入 Clerk 的方式不同，在 Next-js-Boilerplate 中，当用户点击 Sign In 的时候，跳转的并不是 Clerk 的登录页面，而是 <http://localhost:3000/sign-in>，这是因为在 `.env`中，我们通过 `CLERK_SIGN_IN_URL` 环境变量重新设置了登录的跳转地址：

```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
```

查看 `/sign-in`路由对应的文件代码，打开 `src/app/[locale]/(auth)/(center)/sign-in/[[...sign-in]]/page.tsx`：

```tsx
import { SignIn } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';

// ...

const SignInPage = (props: { params: { locale: string } }) => (
  <SignIn path={getI18nPath('/sign-in', props.params.locale)} />
);

export default SignInPage;

```

在这个页面路由中，我们使用了 Clerk 提供的 `<SignIn>` 组件来渲染登录界面，其中 `path` 属性用来设置组件挂载的路径。

### 3. 中文设置

如果我们的 Next-js-Boilerplate 要实现默认中文登录界面的效果，该如何实现呢？

首先，修改 `src/utils/AppConfig.ts`，完整代码如下：

```typescript
import type { LocalePrefix } from 'node_modules/next-intl/dist/types/src/shared/types';

const localePrefix: LocalePrefix = 'as-needed';

export const AppConfig = {
  name: 'Nextjs Starter',
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix,
};
```

然后修改 `src/app/[locale]/(auth)/layout.tsx`，完整代码如下：

```tsx
import { enUS, zhCN } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let clerkLocale = zhCN;
  let signInUrl = '/sign-in';
  let signUpUrl = '/sign-up';
  let dashboardUrl = '/dashboard';

  if (props.params.locale === 'en') {
    clerkLocale = enUS;
  }

  if (props.params.locale !== 'zh') {
    signInUrl = `/${props.params.locale}${signInUrl}`;
    signUpUrl = `/${props.params.locale}${signUpUrl}`;
    dashboardUrl = `/${props.params.locale}${dashboardUrl}`;
  }

  return (
    <ClerkProvider
      localization={clerkLocale}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={dashboardUrl}
      signUpFallbackRedirectUrl={dashboardUrl}
      >
      {props.children}
    </ClerkProvider>
  );
}
```

最后，添加翻译文件，新建 `src/locales/zh.json`，代码如下：

```javascript
{
  "RootLayout": {
    "home_link": "主页",
    "about_link": "关于",
    "guestbook_link": "Guestbook",
    "portfolio_link": "Portfolio",
    "sign_in_link": "登录",
    "sign_up_link": "注册"
  },
  // ...
```

当然在这里我们只翻译了登录相关的文字，其他内容的翻译我们会在下篇借助 CrowdIn 来实现。

此时浏览器效果如下：

![6.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75584a3120d84ef8a41bef6f18795d56~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1357\&h=814\&s=291796\&e=gif\&f=74\&b=fefefe)

## 总结

登录注册所代表的鉴权功能，主流技术选型有 3 个：Clerk、Supabase 和 Next-Auth。其不同之处在于 Clerk 专注于用户管理，Supabse 是 BaaS 产品，鉴权是其中一个功能。Next-Auth 是一个开源库，需要自己实现数据库等。

总的来说，为了快速接入，会优先选择接入 Clerk 和 Supabase，这两个平台自带数据库实现，但免费版都有一些限制。但两者也不冲突，Clerk 和 Supabse 可以一起使用。

本篇我们在本地化的时候，只翻译了很小一部分内容，下一篇我们会借助 CrowdIn 平台实现所有内容的自动翻译。
