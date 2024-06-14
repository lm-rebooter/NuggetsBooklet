## 前言

本篇我们讲解 `next.config.js` 剩下的 31 个配置项。

## 1. assetPrefix

assetPrefix 用于设置资源前缀，举个例子：

```javascript
// next.config.js
const isProd = process.env.NODE_ENV === 'production'
 
module.exports = {
  // Use the CDN in production and localhost for development.
  assetPrefix: isProd ? 'https://cdn.mydomain.com' : undefined,
}
```

Next.js 会自动为从 `/_next`路径（`.next/static/`文件夹）加载的 JavaScript 和 CSS 文件添加资源前缀。以这个例子为例，当请求 JS 代码片段的时候，原本地址是：

    /_next/static/chunks/4b9b41aaa062cbbfeff4add70f256968c51ece5d.4d708494b3aed70c04f0.js

会变成：

    https://cdn.mydomain.com/_next/static/chunks/4b9b41aaa062cbbfeff4add70f256968c51ece5d.4d708494b3aed70c04f0.js

注意：虽然这里请求的路径是在 `/_next`下，但实际文件在 `.next/` 下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7909926b75be482794f1ef581f49490a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1652\&h=194\&s=91172\&e=png\&a=1\&b=1e2022)

让我们在开发环境中测试一下这个配置，原本请求的地址是：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6055de0f0211497cbddcdf245c836cc8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1988\&h=350\&s=120792\&e=png\&b=2a2a2a)

配置后会变成：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/632ded0ea9d645609a1179425ed2afbb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2020\&h=278\&s=94793\&e=png\&b=303030)

注意：

1.  你应该上传到 CDN 的只有 `.next/static/`的内容，不要上传 `.next/` 剩余的部分，这会导致你暴露服务端代码和其他配置。
2.  `assetPrefix`不会影响 `public` 文件夹下的文件。对于 `public` 下的资源，你需要自己处理前缀。

## 2. basePath

`basePath` 用于设置应用的路径前缀。举个例子：

```javascript
// next.config.js
module.exports = {
  basePath: '/docs',
}
```

修改 `app/page.js`的代码为：

```javascript
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Link href="/about">About Page</Link>
    </>
  )
}
```

使用 `basePath` 后，直接访问 `/`会导致 404 错误：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5e0c817eaa3482d90a35b5bac3b659c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=954\&h=370\&s=36505\&e=png\&b=000000)

你应该访问 `/docs`：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfc1763307904f718a7c8fe700bc2c68~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=768\&h=246\&s=25063\&e=png\&b=ffffff)
如果你不希望访问 `/` 导致 404 错误，那你可以来个重写或者重定向：

```javascript
// next.config.js
module.exports = {
  basePath: '/docs',
  async redirects() {
    return [
        {
            source: '/',
            destination: '/docs',
            basePath: false,
            permanent: false
        }
    ]
  }
}
```

当你使用 `next/link` 和 `next/router` （App Router 下使用 `next/navigation`）链接到其他页面时，`basePath` 就会自动应用。举个例子，`/about` 会自动变成 `/docs/about`：

```javascript
export default function HomePage() {
  return (
    <>
      <Link href="/about">About Page</Link>
    </>
  )
}
```

输出的 HTML 为：

```html
<a href="/docs/about">About Page</a>
```

当你使用 `next/image`组件的时候，你应该在 `src` 前添加 `basePath`（如果你使用静态导入就正常处理即可）：

```javascript
import Image from 'next/image'
 
function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/docs/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}
 
export default Home
```

在这个例子中，图片放在 `/public`目录下，正常使用 `/me.png` 即可访问，设置 `basePath` 为 `/docs` 后，应该改为使用 `/docs/me.png`。

## 3. compress

Next.js 提供 gzip 压缩来压缩渲染的内容和静态文件。如果你想禁用压缩功能：

```javascript
// next.config.js
module.exports = {
  compress: false,
}
```

## 4. devIndicators

当你编辑代码，Next.js 正在编译应用的时候，页面右下角会有一个编译指示器。

![FVWEU.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9013933fbed34b7f8d155aac131d2e58~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=406\&h=256\&s=17318\&e=gif\&f=13\&b=ffffff)

这个指示器只会在开发模式下展示，生产环境中不会展示。如果你想更改它的位置，就比如它跟页面的其他元素位置发生冲突了：

```javascript
module.exports = {
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
}
```

默认值是 `bottom-right`，其他值还有` bottom-left`、`top-right`、`top-left`。

如果你想禁用它：

```javascript
module.exports = {
  devIndicators: {
    buildActivity: false,
  },
}
```

## 5. distDir

`distDir` 用于自定义构建目录，默认是 `.next`：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11046c79e6a24fb49cfb437a3140ec4f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1652\&h=194\&s=91172\&e=png\&a=1\&b=1e2022)

举个例子：

```javascript
module.exports = {
  distDir: 'build',
}
```

现在如果你运行 `next build`，Next.js 会使用 `build` 文件夹而不是 `.next`文件夹。注意：`distDir` 不能离开你的项目目录，举个例子，`../build`就是一个无效目录。

## 6. env

Next.js 9.4 后使用新的方式添加环境变量，新的方式更加直观方便、功能强大，具体内容参考[《
配置篇 | 环境变量、路径别名与 src 目录》](https://juejin.cn/book/7307859898316881957/section/7309078454316564507)。

添加一个环境变量到 JavaScript bundle 中，举个例子：

```javascript
module.exports = {
  env: {
    customKey: 'my-value',
  },
}
```

现在你可以在代码中通过 `process.env.customKey` 获取：

```javascript
function Page() {
  return <h1>The value of customKey is: {process.env.customKey}</h1>
}
 
export default Page
```

Next.js 会在构建的时候，将 `process.env.customKey`替换为 `my-value`（因为 webpack [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) 的特性，不支持通过解构赋值）。举个例子：

```javascript
return <h1>The value of customKey is: {process.env.customKey}</h1>
```

相当于：

```javascript
return <h1>The value of customKey is: {'my-value'}</h1>
```

最终的结果是：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21b4438a2a8d40ba8726edc48ea45635~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1514\&h=288\&s=41470\&e=png\&b=ffffff)

## 7. eslint

如果项目中检测到 ESLint，Next.js 会在出现错误的时候，让生产构建（`next build`）失败。

如果你希望即使有错误，也要构建生产代码，可以禁止内置的 ESLint：

```javascript
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
}
```

## 8. generateBuildId

Next.js 会在 `next build` 的时候生成一个 ID，用于标示应用正在使用的版本。应该使用相同的构建并启动多个容器（Docker）。

如果你要为环境的每个阶段进行重建，你需要在不同的容器间生成一致的构建 ID（比如测试、开发、预生产、生产等不同的阶段对应不同的容器，但最好使用相同的构建 ID），使用 `next.config.js` 的 `generateBuildId`：

```javascript
module.exports = {
  generateBuildId: async () => {
    // This could be anything, using the latest git hash
    return process.env.GIT_HASH
  },
}
```

## 9. generateEtags

Next.js 默认会为每个页面生成 [etags](https://en.wikipedia.org/wiki/HTTP_ETag)，如果你希望禁用 HTML 页面生成 etags，使用 `next.config.js` 的 `generateEtags`：

```javascript
module.exports = {
  generateEtags: false
}
```

## 10. httpAgentOptions

在 Nodejs 18 之前，Next.js 会自动使用 [undici](https://github.com/nodejs/undici) 作为 `fetch()` 的 polyfill，并且默认开启 HTTP [Keep-Alive](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Keep-Alive)。

如果禁用服务端所有 fetch() 请求的 HTTP Keep-Alive ，使用 `next.config.js` 的 `httpAgentOptions` 配置：

```javascript
module.exports = {
  httpAgentOptions: {
    keepAlive: false,
  },
}
```

## 11. images

如果你想要使用云提供商优化图片而不使用 Next.js 内置的图像优化 API，那可以在 `next.config.js` 中进行如下配置：

```javascript
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my/image/loader.js',
  },
}
```

`loaderFile` 必须指向一个相对于应用根目录的地址，这个文件必须导出一个返回字符串的默认函数，例如：

```javascript
export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

就比如你想要使用 Cloudflare，参考 Cloudflare 的 [url-format](https://developers.cloudflare.com/images/url-format) 文档：

```javascript
// Docs: https://developers.cloudflare.com/images/url-format
export default function cloudflareLoader({ src, width, quality }) {
  const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto']
  return `https://example.com/cdn-cgi/image/${params.join(',')}/${src}`
}
```

此为全局修改，如果你只想更改部分图片，那你可以使用 `loader` prop：

```javascript
'use client'
 
import Image from 'next/image'
 
const imageLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
 
export default function Page() {
  return (
    <Image
      loader={imageLoader}
      src="me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

## 12. incrementalCacheHandlerPath

用于自定义 Next.js 的缓存处理程序，举个例子：

```javascript
module.exports = {
  experimental: {
    incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
  },
}
```

自定义的缓存示例代码为：

```javascript
// cache-handler.js
const cache = new Map()
 
module.exports = class CacheHandler {
  constructor(options) {
    this.options = options
    this.cache = {}
  }
 
  async get(key) {
    return cache.get(key)
  }
 
  async set(key, data) {
    cache.set(key, {
      value: data,
      lastModified: Date.now(),
    })
  }
}
```

完整的 API 参考 <https://nextjs.org/docs/app/api-reference/next-config-js/incrementalCacheHandlerPath>

## 13. logging

当在开发模式运行 Next.js ，你可以配置日志等级以及控制台是否记录完整 URL。目前，logging 只应用于使用 fetch API 的数据获取，还不能用于 Next.js 其他日志。

```javascript
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

## 14. mdxRs

使用新的 Rust 编译器编译 MDX 文件，和 `@next/mdx` 一起使用：

```javascript
const withMDX = require('@next/mdx')()
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    mdxRs: true,
  },
}
 
module.exports = withMDX(nextConfig)
```

## 15. onDemandEntries

onDemandEntries 用于控制开发模式下服务端如何处理内存中构建的页面：

```javascript
module.exports = {
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
}
```

## 16. optimizePackageImports

有些包可以导出成百上千个模块，这会导致开发和生产中的性能问题。

添加一个包到 `experimental.optimizePackageImports` 后，Next.js 只会加载实际用到的模块：

```javascript
module.exports = {
  experimental: {
    optimizePackageImports: ['package-name'],
  },
}
```

`@mui/icons-material`, `@mui/material`, `date-fns`, `lodash`, `lodash-es`, `react-bootstrap`, `@headlessui/react`, `@heroicons/react`以及 `lucide-react` ，这些库默认已经优化。

## 17. output

在构建的时候，Next.js 会自动追踪每个页面和它的依赖项，以确定部署一个生产版本所需要的所有文件。

这个功能会帮你大幅减少部署的大小。之前使用 Docker 部署的时候，你需要安装 `dependencies` 中的所有文件才能运行 `run start`。从 Next.js 12 起，你可以追踪 `.next/` 目录中的输出文件以实现只包含必要的文件。

之所以能够实现，是因为在 `next build` 的时候，Next.js 会使用 `@vercel/nft` 静态分析 `import`、`require` 和` fs` 使用情况来确定页面加载的所有文件。

Next.js 的生产服务器也会在 `.next/next-server.js.nft.json`中追踪所有它所需要的文件和输出。这个文件就可以被用来在每次追踪的时候，读取文件列表，然后将文件拷贝到部署位置上。

现在让我们在 `next.config.js` 中开启：

```javascript
module.exports = {
  output: 'standalone',
}
```

Next.js 会自动在 `.next`中创建一个 `standalone` 文件夹，然后拷贝 `node_modules` 中生产部署会用到的所有必需文件。靠着这个文件夹，都不需要再次安装 `node_modules` 即可实现部署。

## 18. pageExtension

默认情况下，Next.js 接受 `.tsx`、`.ts`、`.js`、`.jsx`作为拓展名的文件。 pageExtension 用于接受其他的扩展名比如 markdown （`.md`、`.mdx`）

```javascript
const withMDX = require('@next/mdx')()
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    mdxRs: true,
  },
}
 
module.exports = withMDX(nextConfig)
```

## 19. 局部渲染

局部渲染是一个实验性的功能，目前在 `next@canary` 中可用：

```bash
npm install next@canary
```

开启局部渲染：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
  },
}
 
module.exports = nextConfig
```

注意：局部渲染目前不能用于客户端导航。

## 20. poweredByHeader

默认情况下，Next.js 会添加 `x-powered-by`标头，如果要禁用此功能：

```javascript
module.exports = {
  poweredByHeader: false,
}
```

## 21. productionBrowserSourceMaps

SourceMap 默认在开发环境中开启，在生产构建的时候会禁用以防止源码泄漏，但如果你非要开启：

```javascript
module.exports = {
  productionBrowserSourceMaps: true,
}
```

## 22. reactStrictMode

从 Next.js 13.4 起，严格模式在 App Router 下默认为 `true`，所以这个配置仅用于 Pages Router。不过你依然可以设置 `reactStrictMode: false` 来禁用严格模式。

React 的严格模式是一个为了突出应用中潜在问题的功能，在开发模式中使用会有助于识别不安全的生命周期、过期的 API 用法以及其他功能。使用严格模式，在 `next.config.js` 中配置：

```javascript
module.exports = {
  reactStrictMode: true,
}
```

如果不希望整个应用都使用严格模式，只针对某些页面使用的话，那可以用 `<React.StrictMode>`。

## 23. serverComponentsExternalPackages

Next.js 会自动打包服务端组件和路由处理程序中的依赖项。如果某一个依赖项使用了 Nodejs 特定的功能，那你可以选择从 Bundle 中去除该依赖项，然后使用原生的 Nodejs `require`。

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@acme/ui'],
  },
}
 
module.exports = nextConfig
```

## 24. trailingSlash

默认情况下，Next.js 会将带尾部斜杠的 URL 重定向到没有尾部斜杠的地址.举个例子，`/about/`会重定向到 `/about`。你也可以进行相反的配置，将没有尾部斜杠的地址重定向到带尾部斜杠的地址：

```javascript
module.exports = {
  trailingSlash: true,
}
```

现在，`/about`重定到 `/about/`。

## 25. transpilePackages

Next.js 可以自动编译和打包来自本地的包（如 monorepos）或者外部依赖（node\_modules）。以前是通过使用 [next-transpile-modules](https://www.npmjs.com/package/next-transpile-modules) 这个包，有了这个选项就可以直接使用了：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@acme/ui', 'lodash-es'],
}
 
module.exports = nextConfig
```

## 26. turbo

这些功能是实验性的，只有当使用 `next --turbo` 的时候才会开启。

目前，Turbopack 支持 webpack loader API 的子集，允许你在 Turbopack 中使用一些 webpack loader 转换代码。举个例子：

```javascript
module.exports = {
  experimental: {
    turbo: {
      rules: {
        // Option format
        '*.md': [
          {
            loader: '@mdx-js/loader',
            options: {
              format: 'md',
            },
          },
        ],
        // Option-less format
        '*.mdx': ['@mdx-js/loader'],
      },
    },
  },
}
```

现在，你可以在应用中使用：

```javascript
import MyDoc from './my-doc.mdx'
 
export default function Home() {
  return <MyDoc />
}
```

类似于 webpack 的 resolve.alias，Turbopack 也可以配置别名：

```javascript
module.exports = {
  experimental: {
    turbo: {
      resolveAlias: {
        underscore: 'lodash',
        mocha: { browser: 'mocha/browser-entry.js' },
      },
    },
  },
}
```

在这个例子中，使用 `import underscore from 'underscore'`其实会导入 lodash。

Turbopack 也支持条件别名，目前只支持 browser 这个条件。在这个例子中，当 Turbopack 以浏览器环境为目标的时候，导入 mocha 模块相当于导入 mocha/browser-entry.js。

## 27. typedRouters

对静态类型链接的实验性支持，此功能需要在 App Router 下以及开启使用 TypeScript：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
}
 
module.exports = nextConfig
```

## 28. typescript

如果出现 TypeScript 错误，生产构建（`next build`）会失败。如果你希望即便有错误，也要构建生产代码：

```javascript
module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
```

## 29. urlImports

URL 导入是一项实验性功能，允许你从外部服务器导入模块。

如果你要使用该功能，使用示例如下：

```javascript
module.exports = {
  experimental: {
    urlImports: ['https://example.com/assets/', 'https://cdn.skypack.dev'],
  },
}
```

在这个例子中，添加了允许的资源前缀（毕竟要保证安全）。

然后你就可以直接通过 URL 导入模块：

```javascript
import { a, b, c } from 'https://example.com/assets/some/module.js'
```

当使用 URL 导入的时候，Next.js 会创建一个 `next.lock`目录包含一个 lockfile 和获取的资源。这个目录必须要提交到 Git，不能通过 `.gitignore`忽略。

当运行 `next dev`的时候，Next.js 会下载并添加所有新发现的导入 URL 到 lockfile 中。当运行 `next build`的时候，Next.js 会只使用 lockfile 构建用于生产版本的应用。

使用 URL 导入的一些例子：

使用 skypack：

```javascript
import confetti from 'https://cdn.skypack.dev/canvas-confetti'
import { useEffect } from 'react'
 
export default () => {
  useEffect(() => {
    confetti()
  })
  return <p>Hello</p>
}
```

静态图片导入：

```javascript
import Image from 'next/image'
import logo from 'https://example.com/assets/logo.png'
 
export default () => (
  <div>
    <Image src={logo} placeholder="blur" />
  </div>
)
```

CSS 中的 URLs：

```javascript
.className {
  background: url('https://example.com/assets/hero.jpg');
}
```

导入资源：

```javascript
const logo = new URL('https://example.com/assets/file.txt', import.meta.url)
 
console.log(logo.pathname)
 
// prints "/_next/static/media/file.a9727b5d.txt"
```

## 30. 自定义 Webpack 配置

为了扩展 webpack 的用法，你需要在 next.config.js 中定义一个函数用于扩展它的配置，举个例子：

```javascript
module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config
    return config
  },
}
```

webpack 函数会被执行两次，一次在服务端，一次在客户端，你可以使用 isServer 属性来区分是客户端配置还是服务端配置。

webpack 函数的第二个参数是一个具有以下属性的对象：

*   `buildId`：`String`，构建 ID，构建的唯一标识
*   `dev`：`Boolean` 编译是否会在开发中完成
*   `isServer`：`Boolean`，如果 true 表示服务端编译，如果 false 表示客户端编译
*   `nextRuntime`：`String | undefined`，服务端编译的目标运行时，要么是 `"edge"` ，要么是 `"nodejs"`，`undefined`用于客户端编译
*   `defaultLoaders`：`Object` Next.js 内部使用的默认加载器
    *   `babel`：`Object` 默认的 `babel-loader` 配置

`defaultLoaders.babel` 示例用法：

```javascript
// 这段来自于 @next/mdx 插件源码:
// https://github.com/vercel/next.js/tree/canary/packages/next-mdx
module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.mdx/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: pluginOptions.options,
        },
      ],
    })
 
    return config
  },
}
```

## 31. webVitalsAttribution

在调试 Web Vitals 相关的问题时，如果能查明根源通常会很有帮助。比如在 CLS 中，我们可能想知道最大的布局偏移发生时偏移的第一个元素，或者 LCP 中，我们可能想要知道 LCP 对应的元素。如果该元素是图片，知道它的 URL 有助于我们进行优化。

这就需要用到 webVitalsAttribution 配置项，它会帮助我们获取更深层的信息如 [PerformanceEventTiming](https://developer.mozilla.org/docs/Web/API/PerformanceEventTiming)、[PerformanceNavigationTiming](https://developer.mozilla.org/docs/Web/API/PerformanceNavigationTiming)、[PerformanceResourceTiming](https://developer.mozilla.org/docs/Web/API/PerformanceResourceTiming)。

```javascript
experimental: {
  webVitalsAttribution: ['CLS', 'LCP']
}
```

有效的归因值都是 web-vitals 中的特定指标，在 [NextWebVitalsMetric](https://github.com/vercel/next.js/blob/442378d21dd56d6e769863eb8c2cb521a463a2e0/packages/next/shared/lib/utils.ts#L43) 中可以查看：

```javascript
export type NextWebVitalsMetric = {
  id: string
  startTime: number
  value: number
} & (
  | {
      label: 'web-vital'
      name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB' | 'INP'
    }
  | {
      label: 'custom'
      name:
        | 'Next.js-hydration'
        | 'Next.js-route-change-to-render'
        | 'Next.js-render'
    }
)
```

## 参考链接

1.  <https://nextjs.org/docs/app/api-reference/next-config-js>
