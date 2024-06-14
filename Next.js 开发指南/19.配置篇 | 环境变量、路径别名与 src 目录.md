## 前言

本篇介绍**环境变量**、**路径别名**、**src 目录**三大块内容，主要是介绍环境变量的使用。Next.js 提供了更为强大便捷的环境变量使用方式，让我们来看看吧。

## 1. 环境变量

### 1.1 概念介绍

所谓环境变量（environment variables），引用[百度百科的解释](https://baike.baidu.com/item/%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F/1730949)：

> 环境变量一般是指在操作系统中用来指定操作系统运行环境的一些参数，如：临时文件夹位置和系统文件夹位置等。
>
> 环境变量是在操作系统中一个具有特定名字的对象，它包含了一个或者多个应用程序所将使用到的信息。例如 Windows 和 DOS 操作系统中的 path 环境变量，当要求系统运行一个程序而没有告诉它程序所在的完整路径时，系统除了在当前目录下面寻找此程序外，还应到 path 中指定的路径去找。用户通过设置环境变量，来更好的运行进程。

简单的来说，如果我们把操作系统想象成一门语言，就比如 JavaScript，各种程序对应的就是声明的各种函数，而环境变量对应的就是 JavaScript 中的全局变量。各个函数（各个程序）都可以使用这些变量。

#### 相关命令

我们常见的 `PATH` 只是其中一个环境变量。以 MacOS 系统为例的话（以下命令都是在 MacOS，Windows 中会有差别），我们可以在命令行中输入 `printenv` 查看所有环境变量：

```bash
printenv
```

输出结果如下：

![还有很多，就不一一描述了](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc1710b7fbfd4cfe89e208529c99d649~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=782\&h=250\&s=43040\&e=png\&b=0a0a0a "还有很多，就不一一描述了")

可以看出，环境变量的命名一般是全部大写。

如果要查看某个特定环境变量，可以使用 `printenv`，也可以使用 `echo`：

```bash
// 方式 1
printenv PATH

// 方式 2
echo $PATH
```

如果你要添加或者修改某个环境变量，可以使用 `export`命令：

```bash
// 1. 设置
export YAYUCUSTOM=yayu
// 2. 打印
echo $YAYUCUSTOM
```

不过使用这种方式，效果是临时的，只会在本次登录生效，关掉命令行再重启就失效了，不过有的时候，这也够了。比如我们在 `package.json` 中看到这样的配置：

```javascript
"scripts": {
    "dev": "export NODE_ENV=development && node index.js",
    "prod": "export NODE_ENV=production && node index.js"
}
```

`index.js`中就可以通过 `process.env.NODE_ENV` 获取到设置的 `NODE_ENV` 的值：

```javascript
// 打印的结果根据设置的值不同而不同
console.log(process.env.NODE_ENV)
```

那如何长久的修改某个环境变量呢？这个就稍微有点复杂了，有很多文件都可以修改环境变量，根据系统以及系统版本的不同会有所不同。以 mac 的 bash 为例的话，文件的顺序为：

```javascript
/etc/profile
/etc/paths 
/etc/paths.d/
~/.bash_profile 
~/.bash_login
~/.profile
~/.bashrc
```

其中，以 `/etc`开头的目录是系统级别的环境变量定义，其他则是用户级别的环境变量定义。一般来说，使用 `bash` 建议修改 `~/.bash_profile`，使用 `zsh` 建议修改 `~/.zshrc`。

Mac 使用 `zsh` 或 `bash` 作为登录 Shell 和交互式 Shell 的命令行解释器。从 macOS Catalina 开始，Mac 使用 `zsh` 作为默认登录 Shell 和交互式 Shell。`bash` 是 macOS Mojave 及更早版本中的默认 Shell。

使用 `bash`：

```bash
// 1. 修改文件
vim ~/.bash_profile
// 2. 添加内容
export YAYU_CUSOTM=yayu
// 3. 使用 wq 命令退出保存后执行使其生效
source  ~/.bash_profile
// 4. 查看生效
echo $YAYU_CUSOTM
```

使用 `zsh`：

```bash
// 1. 修改文件
vim  ~/.zshrc
// 2. 添加内容
export YAYU_CUSOTM=yayu
// 3. 使用 :wq 命令退出保存后执行使其生效
source  ~/.zshrc
// 4. 查看生效
echo $YAYU_CUSOTM
```

如果你遇到设置完后，当时有效，重启终端后就会失效，可能是你使用的 shell 有问题，查看当前使用的 Shell：

```bash
echo $SHELL
```

切换成 `zsh` 或 `bash` （执行命令后重启终端）：

```bash
// 切换成 zsh
chsh -s /bin/zsh
// 切换成 bash
chsh -s /bin/bash
```

#### process.env

Nodejs 提供了 `process.env` API 返回包含用户环境的对象，简单的来说，这是 Nodejs 提供的在 node 中获取环境变量的方法。此对象示例如下所示：

```javascript
{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
```

### 1.2 Next.js 实现

在 Next.js 中添加环境变量会更加方便，因为 Next.js 内置了对环境变量的支持，使用环境变量有两种方式：

1.  通过 `.env.local` 加载环境变量
2.  通过 `NEXT_PUBLIC_`前缀在浏览器中获取环境变量

#### .env.local 加载环境变量

Next.js 支持从 `.env.local`中加载环境变量到 `process.env`。现在我们在项目根目录下建立一个 `.env.local`文件（注意是根目录，不是 `/src`目录）

```javascript
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

现在我们就可以服务端组件或者路由处理程序中通过 `process.env`获取到该值：

```javascript
// app/page.js
export default function Page() {
  console.log(process.env.DB_HOST)
  return <h1>Hello World!</h1>
}
```

```javascript
// app/api/route.js
export async function GET() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

使用起来就是这么方便。Next.js 也支持多行变量，示例代码如下：

```javascript
# .env.local
 
# 直接换行
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
Kh9NV...
...
-----END DSA PRIVATE KEY-----"
 
# 也可以使用 `\n`
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nKh9NV...\n-----END DSA PRIVATE KEY-----\n"
```

Nxt.js 也支持使用 `$`引用其他变量，举个例子：

```javascript
TWITTER_USER=nextjs
TWITTER_URL=https://twitter.com/$TWITTER_USER
```

在这个例子中，`process.env.TWITTER_URL` 的值为 `https://twitter.com/nextjs`。

如果你本来就要用带 `$`的值，使用 `\$`这种方式进行转义即可。

#### 浏览器中获取环境变量

前面我们讲到，`process.env` 是 Nodejs 提供的用于获取用户环境变量对象的 API。也就是说，正常在 `.env.local` 中设置的变量，是无法在浏览器端获取的。

为了让浏览器也可以获取环境变量中的值，Next.js 可以在构建的时候，将值内联到客户端的 js bundle 中，替换掉所有硬编码使用 `process.env.[variable]`的地方。不过为了告诉 Next.js 哪些值是可以让浏览器访问的，你需要在变量前添加 `NEXT_PUBLIC_`前缀，比如：

```bash
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

现在我们再通过 `process.env.NEXT_PUBLIC_ANALYTICS_ID` 获取：

```javascript
'use client';
// app/page.js
export default function Page() {
  return <h1 onClick={() => {
    console.log(process.env.NEXT_PUBLIC_ANALYTICS_ID)
  }}>Hello World!</h1>
}
```

如果没有 `NEXT_PUBLIC_`前缀，正常点击的时候获取的值会是 `undefined` ，添加 `NEXT_PUBLIC_`前缀后即可获取到正确的值。不过你要记得这里的原理，其实是在构建的时候，将所有 `NEXT_PUBLIC_`前缀的值做了替换，也就是在代码中，点击事件的代码就已经变成了：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3754960b8c1b4627b52b863003af5d47~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=640\&h=252\&s=38114\&e=png\&b=282828)

此外要注意，动态查找的值不会被内联，比如：

```javascript
// 使用了变量，不会被内联，不会生效
const varName = 'NEXT_PUBLIC_ANALYTICS_ID'
setupAnalyticsService(process.env[varName])
 
// 使用了变量，不会被内联，不会生效
const env = process.env
setupAnalyticsService(env.NEXT_PUBLIC_ANALYTICS_ID)
```

#### 默认环境变量

通常一个 `.env.local`文件就够用了，但有的时候，你也许会希望在 `development`（`next dev`）或 `production`（`next start`）环境中添加一些默认值。

Next.js 支持在 `.env`（所有环境）、`.env.development`（开发环境）、`.env.production`（生产环境）中设置默认的值。

`.env.local`会覆盖这些默认值。

注意：`.env`、`.env.development`、`.env.production` 用来设置默认的值，所有这些文件可以放到仓库中，但 `.env*.local`应该添加到 `.gitignore`，因为可能涉及到一些机密的信息。

此外，如果环境变量 NODE\_ENV 未设置，当执行 `next dev`的时候，Next.js 会自动给 `NODE_DEV`赋值 `development`，其他命令则会赋值 `production`。也就是说，当执行 `next dev`或者其他命令的时候，获取`process.env.NODE_ENV`是有值的，这是 Next.js 自动赋值的，为了帮助开发者区分开发环境。

#### 测试环境变量

除了 `development`环境和 `production`环境，还有第三个选项，那就是 `test`环境。这是当使用测试工具如 `jest`或 `cypress`时，出于测试目的而设置特定的环境变量。

用法跟开发环境、生产环境类似，建立一个 `.env.test`文件用于测试环境，但是跟开发环境、生产环境不同的是，测试环境不会加载 `.env.local`中的值，这是为了让每个人都产生相同的测试结果。这些默认值会在 `NODE_DEV`设置成 `test`的时候用到。

#### 环境变量加载顺序

环境变量的查找也是有顺序的，一旦找到，就会终止查找，不会再往下查找，这个顺序是：

1.  `process.env`
2.  `.env.$(NODE_ENV).local`
3.  `.env.local` (当 `NODE_ENV` 是 `test` 的时候不会查找)
4.  `.env.$(NODE_ENV)`
5.  `.env`

举个例子，如果你在 `.env.development.local` 和 `.env`中设置了 `NODE_ENV` 为 `development`，按照这个顺序，最终会使用 `.env.development.local`中的值。

## 2. 绝对地址导入和模块路径别名

Next.js 的 `tsconfig.json`和`jsconfig.json`文件支持设置 `"paths"`和 `"baseUrl"`选项。

这些配置会帮助你更方便的导入模块，举个例子：

```javascript
// before
import { Button } from '../../../components/button'
 
// after
import { Button } from '@/components/button'
```

### 2.1. 绝对地址导入

`baseUrl`配置项可以让你从项目根目录中直接导入。使用示例如下：

```javascript
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

我们声明 `baseUrl`为 `"."`，也就是项目根目录。现在我们在根目录下的 `components`文件夹下新建一个组件：

```javascript
// components/button.js
export default function Button() {
  return <button>Click me</button>
}
```

现在我们导入该组件，不需要再使用相对地址，当嵌套多层引入组件时候就会很方便：

```javascript
// app/page.js
import Button from '/components/button'
 
export default function HomePage() {
  return (
    <>
      <h1>Hello World</h1>
      <Button />
    </>
  )
}
```

### 2.2. 模块别名

除了配置 `baseUrl` 路径之外，你也可以设置 `"paths"` 选项实现路径别名。举个例子：

```javascript
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}
```

在这个例子中，我们设置了一个路径映射，`@/components/*` 到 `"components/*`。

```javascript
// components/button.js
export default function Button() {
  return <button>Click me</button>
}
```

现在我们不需要使用相对地址，使用设置的路径别名即可：

```javascript
// app/page.js
import Button from '@/components/button'
 
export default function HomePage() {
  return (
    <>
      <h1>Hello World</h1>
      <Button />
    </>
  )
}
```

那 `baseUrl`和 `paths:`是什么关系呢？事实上，`paths` 中的地址是相对于 `baseUrl` 的，举个例子：

```javascript
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src/",
    "paths": {
      "@/styles/*": ["styles/*"],
      "@/components/*": ["components/*"]
    }
  }
}
```

```javascript
// pages/index.js
import Button from '@/components/button'
import '@/styles/styles.css'
import Helper from 'utils/helper'
 
export default function HomePage() {
  return (
    <Helper>
      <h1>Hello World</h1>
      <Button />
    </Helper>
  )
}
```

`@/components/button`最终的地址其实是 `src/components/button`，其他地址同理。

## 3. src 目录

至今我们都是把代码放在根目录下的`app` 或 `pages` 目录下，但 Next.js 也支持 `src` 目录，将代码放在  `src` 目录下有助于实现应用程序代码和项目配置文件（多在项目根目录）分离。

使用 `src` 目录，将 `app` 下或者 `pages` 下的文件移动到 `src/app` 或 `src/pages` 即可：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ec8ac3a6b964518bf7a4919305f9b38~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=687\&s=330812\&e=png\&b=161616)

调整的时候注意：

*   `/public`目录继续放在项目根目录
*   `package.json`、`next.config.js`、`tsconfig.json` 等配置文件继续放在项目根目录
*   `.env.*` 文件继续放在项目根目录
*   如果 `app` 或者 `pages` 在根目录下存在，`src/app` 或 `src/pages` 会被忽略。
*   如果你正在使用 `src`，你可能还需要移动其他应用文件夹，如 `/components` 或 `/lib`
*   如果你正在使用中间件，确保它放在 `src` 目录下
*   如果你正在使用 Tailwind CSS，别忘了修改 `tailwind.config.js` 中的 `content` 配置项：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}',
  ],
  // ...
}
```

## 参考链接

1.  [在 Mac 上将 zsh 用作默认 Shell](https://support.apple.com/zh-cn/HT208050)
2.  [Configuring: Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
3.  [Configuring: Absolute Imports and Module Path Aliases](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases)
