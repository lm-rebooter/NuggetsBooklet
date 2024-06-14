## 前言

本篇我们来实现深色模式。它也被叫做暗黑模式、黑夜模式等等。这里我们选用的是苹果官方文档的翻译：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42e0a67dbaec435d9b2efd47a3531122~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2104\&h=616\&s=266452\&e=png\&b=fdfdfd)

## 1. 深色模式

“深色模式”本质上是一套采用深色背景、浅色文案的配色方案。其实很早就有。现在越来越流行，是因为苹果在 2018 年提出了这一概念。

先是 2018 年的 macOS Mojave 率先支持了深色外观，然后 2019 年 IOS 13 正式支持深色外观。这些都是系统级别的支持，可以将整个系统的界面切换为深色模式。由此深色模式开始进入人们的视野，成为设计师、前端工程师的学习内容……

使用深色模式也确实有一些好处：

1.  保护视力。毕竟晚上的时候，浅色有些刺眼。
2.  增加沉浸感。阅读浏览类 App 或是内容创作型 App（比如代码编辑器）往往会使用深色模式，它们会借助黑底白字的高对比度特性让用户视线保持集中。所以切换深色模式后，可以增加沉浸感，提升使用欲望。
3.  省电。根据谷歌的官方数据，采用 OLED 屏幕的手机在「深色模式」下，耗电可下降达63%。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea2428b4d4df4a5a8a7eaca04607e892~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3024\&h=1516\&s=396568\&e=png\&b=111111)

## 2. 如何适配？

如果我们开发页面，该如何支持深色模式呢？

### 2.1. CSS 媒体查询

CSS 提供了 [prefers-color-scheme](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme) 媒体查询特性，用于检测用户是否有将系统的主题色设置为浅色或者深色。

比如 Next.js 脚手架默认创建项目的 `app/globals.css`中，就有这样一段代码：

```javascript
:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}
```

这就是一段根据系统的主题色调整网页基础样式的代码。此时页面会根据系统的外观模式进行调整，效果如下：

![1.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fcc5d4d12534980a1a3ab7665b24fcb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=923\&h=630\&s=471100\&e=gif\&f=40\&b=ececee)

注：浏览器设置里也有设置模式的地方：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e3c585429d14ad591703e9b78978256~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1848\&h=444\&s=81383\&e=png\&b=26272a)

但这里设置的是浏览器的外观，不会影响具体页面的外观模式。

### 2.2. JS 查询

CSS 查询会自动跟随系统设置，但如果你要自定义外观模式，就比如很多博客页面右上角都有个外观模式按钮，点击可以切换到 light / dark 模式，这种就需要依赖 JS 了。

Web API 提供了 [Window.matchMedia()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/matchMedia) 方法，它会返回一个新的 MediaQueryList 对象，表示指定的媒体查询字符串解析后的结果。返回的 MediaQueryList 可被用于判定 Document 是否匹配媒体查询，或者监控一个 document 来判定它匹配了或者停止匹配了此媒体查询。

#### 判断浏览器是否支持深色模式

```javascript
if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
  console.log('🎉 Dark mode is supported');
}
```

其实支持率还蛮好的：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58867d0f23414c83b94d4368abb91e66~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3430\&h=1442\&s=524605\&e=png\&b=f0e8d8)

#### 监听深色模式变化

```javascript
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

darkModeMediaQuery.addEventListener('change', (e) => {
  const darkModeOn = e.matches;
  console.log(`Dark mode is ${darkModeOn ? '🌒 on' : '☀️ off'}.`);
});
```

#### 自定义 React hook

如果使用 React，可以自定义一个 hook，新建 `app/theme.js`，代码如下：

```javascript
import { useEffect, useState } from "react"

function useTheme() {
 
  const [theme, setTheme] = useState('light')

  useEffect(() => {

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(darkModeMediaQuery.matches ? 'dark' : 'light')
    const listener = (event) => {
      setTheme(event.matches ? 'dark' : 'light');
    };

    darkModeMediaQuery.addEventListener('change', listener);
    return () => {
      darkModeMediaQuery.removeEventListener('change', listener);
    };
    
  }, [])
  
  return {
    theme,
    isDarkMode: theme === "dark",
    isLightMode: theme === "light",
  }
}

export default useTheme
```

修改 `app/page.js`，代码如下：

```javascript
'use client'

import Image from "next/image";
import useTheme from "./theme";

export default function Home() {
  
  const {theme} = useTheme()

  return (
    <div>Hello World! {theme}</div>
  );
}

```

浏览器效果如下：

![3.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93460b20b16b4038b4d32308b28e8e84~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1153\&h=558\&s=281990\&e=gif\&f=23\&b=e4e9ec)

### 2.3. 测试不同的模式

如果要测试页面的浅色/深色模式，修改系统的外观模式会有些麻烦，Chrome 提供了快速切换的方式：

![2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f81e3cdefa1a43159a1502ffe1f3f8a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1196\&h=558\&s=366613\&e=gif\&f=32\&b=fcfcfc)

其步骤为：

1.  打开浏览器开发者工具
2.  Command + Shift + P 打开命令
3.  输入 dark 或者 light 搜索命令
4.  回车确定

注：这只是用于测试，效果是暂时的，关闭开发者工具，就会退出设置的样式。

## 3. 实战应用

基础知识我们就说这么多，只是帮助大家理解深色模式的概念和实现的基本原理。

在 Next.js 项目中，实现手动切换外观模式的效果，通常还要搭配 React Context 或者状态管理库来实现。在实际开发中，为了提高效率，我们会使用 [next-themes](https://github.com/pacocoursey/next-themes) 这个包来实现。

### 3.1. next-themes

安装依赖项：

```bash
npm install next-themes @headlessui/react
```

其中 [@headlessui/react](https://github.com/tailwindlabs/headlessui) 是 UI 库，十分适合搭配 Tailwind.css。

新建 `app/theme-providers.js`，代码如下：

```jsx
'use client'

import { ThemeProvider } from 'next-themes'

export function ThemeProviders({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  )
}
```

修改 `app/layout.js`，添加代码如下：

```jsx
import siteMetadata from '@/data/siteMetadata'
import "./globals.css";
import { ThemeProviders } from './theme-providers'

export const metadata = {
  // ...
}

export default function RootLayout({ children }) {
  return (
    <html lang={siteMetadata.locale} suppressHydrationWarning>
      <body>
        <ThemeProviders>
          {children}
        </ThemeProviders>
      </body>
    </html>
  );
}
```

修改的代码有 2 点：

1.  html 使用 suppressHydrationWarning 取消水合错误警告，这是因为 next-theme 会修改 html 元素的属性。因为 suppressHydrationWarning 只作用于一层，所以不用担心它会影响整个应用的水合错误警告。
2.  使用 ThemeProviders 组件包裹 children

此时页面并不有什么特殊效果，因为这步相当于在顶层使用了 React Context，储存了一个用于表示当前主题的值，默认是 `"light"`。

此时因为我们设置了 `attribute="class"`，当切换主题的时候，它会对应生成 `class="dark"`这种属性：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36e097ed44e84d79a5507beaf299116d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1202\&h=126\&s=34834\&e=png\&b=2e2e2e)

此外，我们还可以看到生成了 `style="color-scheme: dark;"`属性，详细介绍参考 [MDN color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)。简单来说，操作系统会根据用户选择的颜色方案对用户界面进行调整，包括表单控件、滚动条和 CSS 系统颜色的使用值。

因为我们改用了 JS 来手动控制主题值，所以写样式效果的时候，也不能再用 @media (prefers-color-scheme: dark) 这种方式，它会根据系统的主题值而非 Context 中的主题值进行修改。

如果你要写 dark 和 light 两套主题，因为 html 添加了 `.dark` 类，所以可以这样写：

```javascript
html,
body {
  color: #000;
  background: #fff;
}

.dark {
  html, body {
    color: #fff;
    background: #000;
  }
}
```

当然因为我们项目使用了 Tailwind.css，Tailwind.css 也是支持 [Dark Mode](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually) 的。修改 `tailwind.config.js`，添加代码如下（如果你按照之前的文章写项目，此时应该已经添加了）：

```javascript
module.exports = {
  darkMode: 'class'
}
```

修改 `app/page.js`，代码如下：

```jsx
'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <h1 className="text-black dark:text-white">Hello World! {theme}</h1>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </>

  )
}

export default ThemeSwitch
```

在这段代码中，展示了如何使用 useTheme 和 Taildwind.css。

1.  使用 useTheme 需要是客户端组件，且需要判断环境，否则会导致水合错误
2.  `"text-black dark:text-white"` 展示了如何为一个元素定义不同主题下的样式

此时效果如下：

![4.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/618593f99c17417aaaf565d9d7e06ea0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1103\&h=461\&s=1064578\&e=gif\&f=53\&b=2c2c2c)

### 3.2. 项目开发

新建 `components/ThemeSwitch.js`，代码如下：

```jsx
'use client'

import { Fragment, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Menu, RadioGroup, Transition } from '@headlessui/react'

const Sun = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-6 w-6 text-gray-900 dark:text-gray-100"
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
)
const Moon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-6 w-6 text-gray-900 dark:text-gray-100"
  >
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)
const Monitor = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-gray-900 dark:text-gray-100"
  >
    <rect x="3" y="3" width="14" height="10" rx="2" ry="2"></rect>
    <line x1="7" y1="17" x2="13" y2="17"></line>
    <line x1="10" y1="13" x2="10" y2="17"></line>
  </svg>
)

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="mr-5">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button>{resolvedTheme === 'dark' ? <Moon /> : <Sun />}</Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
            <RadioGroup value={theme} onChange={setTheme}>
              <div className="p-1">
                <RadioGroup.Option value="light">
                  <Menu.Item>
                    <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm">
                      <div className="mr-2">
                        <Sun />
                      </div>
                      Light
                    </button>
                  </Menu.Item>
                </RadioGroup.Option>
                <RadioGroup.Option value="dark">
                  <Menu.Item>
                    <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm">
                      <div className="mr-2">
                        <Moon />
                      </div>
                      Dark
                    </button>
                  </Menu.Item>
                </RadioGroup.Option>
                <RadioGroup.Option value="system">
                  <Menu.Item>
                    <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm">
                      <div className="mr-2">
                        <Monitor />
                      </div>
                      System
                    </button>
                  </Menu.Item>
                </RadioGroup.Option>
              </div>
            </RadioGroup>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ThemeSwitch
```

这段代码看似很长，但实现的效果其实很简单：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dea2cfbb8a274a338e98461edf232c9a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1306\&h=542\&s=56899\&e=png\&b=fefefe)

为了方便引入，修改 `jsconfig.json`：

```javascript
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/data/*": ["data/*"],
      "@/components/*": ["components/*"],
      "contentlayer/generated": ["./.contentlayer/generated"]
    }
  },
  // ...
}
```

我们将组件添加到根布局 `app/layout.js`中：

```jsx
import siteMetadata from '@/data/siteMetadata'
import "./globals.css";
import { ThemeProviders } from './theme-providers'
import ThemeSwitch from '@/components/ThemeSwitch';

// ...

export default function RootLayout({ children }) {
  return (
    <html lang={siteMetadata.locale} suppressHydrationWarning>
      <body>
        <ThemeProviders>
          <header className="flex justify-end">
            <ThemeSwitch />
          </header>
          {children}
        </ThemeProviders>
      </body>
    </html>
  );
}
```

这样所有页面的右上角都会有这个切换主题的按钮。

现在要做的就是为元素设置不同主题的样式。根据上节的描述有两种方式可以设置，一种是直接使用 CSS 进行设置：

```javascript
.dark {
  // ...
}
```

一种是使用 Tailwind.css，添加 `dark:`开头的类名：

```javascript
<h1 className="text-3xl font-bold dark:text-white">{post.title}</h1>
```

比较麻烦的地方在于文章页面，因为文章的内容渲染是由 MDX 生成，不能直接添加类名。

但其实 tailwindcss-typography 同样提供了 dark mode 支持，你只要在外层添加一个 `dark:prose-invert` 类名：

```javascript
<article class="prose dark:prose-invert">{{ markdown }}</article>
```

所以我们修改 `app/posts/[id]/page.js`，添加代码如下：

```jsx
// ...

const Page = ({ params }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.id)
  if (!post) notFound()
  const MDXContent = useMDXComponent(post.body.code)
  const jsonLd = post.structuredData
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      <article className="mx-auto max-w-xl py-8 prose prose-slate dark:prose-invert">
        <div className="mb-8 text-center">
          <time dateTime={post.date} className="mb-1 text-xs text-gray-600 dark:text-white">
            {dayjs(post.date).format('DD/MM/YYYY')}
          </time>
          <h1 className="text-3xl font-bold dark:text-white">{post.title}</h1>
        </div>
        <MDXContent />
      </article>
    </>
  )
}

export default Page
```

此时文章页面效果如下：

![5.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e1a5769c7d84f10a96cf4daedba8361~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1019\&h=686\&s=300406\&e=gif\&f=55\&b=fefefe)

我们成功实现了深色模式！

## 项目源码

> 1.  功能实现：博客支持深色模式
> 2.  源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/next-blog-3>
> 3.  下载代码：`git clone -b next-blog-3 git@github.com:mqyqingfeng/next-app-demo.git`

## 参考链接

1.  <https://support.apple.com/zh-cn/guide/mac-help/mchl52e1c2d2/mac>
2.  <https://juejin.cn/post/7298997940019085366>
3.  <https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme>
4.  <https://web.dev/articles/prefers-color-scheme?hl=zh-cn#reacting_on_dark_mode_changes>
5.  <https://web.dev/articles/color-scheme?hl=zh-cn>
6.  <https://www.uisdc.com/dark-mode-history>
7.  <https://juejin.cn/post/7062986403205873701>
