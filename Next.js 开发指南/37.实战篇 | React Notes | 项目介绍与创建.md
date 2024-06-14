## 前言

欢迎来到实战篇！基础篇的目标是带大家复习基础知识，以及用作使用手册，方便大家在以后的项目开发中查询 API 用法，属于这本小册的“赠送面积”。从本篇起就进入小册的正式内容了。

我们的第一个实战项目是 **React Notes**，因为 Next.js v14 基于 React Server Component 构建的 App Router，而 React Server Component 的起源是 2020 年 12 月 21 日 React 官方发布的关于 React Server Components 的[介绍文章](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html)。

这篇文章同时配上了由 Dan Abramov 和 Lauren Tan 两位 React 团队的工程师分享的长约 1h 的[演讲](https://www.youtube.com/watch?time_continue=15\&v=TQQPAU21ZUw\&embeds_referring_euri=https%3A%2F%2Flegacy.reactjs.org%2F\&source_ve_path=MzY4NDIsMzY4NDIsMzY4NDIsMzY4NDIsMzY4NDIsMzY4NDIsMzY4NDIsMjg2NjY\&feature=emb_logo)和 [Demo](https://github.com/reactjs/server-components-demo)，详细的介绍了 React Server Components 的出现背景和使用方式（这是这个 Demo 的一个[线上工程](https://stackblitz.com/edit/react-server-components-demo-u57n2t?file=README.md)，你可以在这个地址上调试学习）。

当时这个 [Demo](https://github.com/reactjs/server-components-demo) 就是 **React Notes**，实战篇的第一个项目从这个“起源 Demo”开始讲起，既是一种追溯致敬，也是为了帮助大家在实战中体会 React Server Component 的特性和优势，毕竟当时 React 的工程师写了这个 Demo 用于新特性的展示，自然是要覆盖它的各种用法和特性。

这个 Demo 中的 Server 是自己写的，数据库用的是 PostgreSQL，如果要本地预览原本的 Demo 效果，参照 Demo 的介绍，本地安装 PostgreSQL，创建数据库，连接数据库，再运行项目即可成功开启。这里具体的实现步骤就不多讲了，反正我们的实战篇会用 Next.js 重新实现这个项目。

## 需求文档

先让我介绍下 React Notes 的项目效果，正如它的名字表明的那样，这是一个笔记系统，可以增删改查笔记，笔记支持 markdown 格式。

首页效果如下，界面分为两列，左侧是笔记列表，右侧是笔记内容：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/081f4269b85447a0ae044465ea9fa2f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3076\&h=1570\&s=258799\&e=png\&b=f4f6f9)

点击左边的 `New` 按钮，可以增加一个 Note，增加后，左侧笔记列表也会同时更新：

![React Notes 增加.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3411f724c4eb4d1997311f245723df14~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1191\&h=720\&s=108873\&e=gif\&f=42\&b=f4f6f9)

在编辑的时候，也可以删除一个 Note，删除后左侧笔记列表也会同时更新：

![React Notes 删除.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dad06db2883947c288dc871c769db98b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1209\&h=892\&s=166272\&e=gif\&f=32\&b=fefefe)

可以对现有的 Note 进行修改：

![React Notes 修改.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/769756f0159a465097938e39a0eac2de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1209\&h=892\&s=113504\&e=gif\&f=44\&b=fefefe)

还可以在左侧用搜索框查找一个 Note：

![React Notes 查找.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2111a45e641438daab0ae9d3394dc90~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1209\&h=892\&s=324795\&e=gif\&f=91\&b=f6f8fa)

看起来效果是不是平平无奇？但是注意一点，在这个例子中，我们先在左侧笔记列表中展开了一个笔记，然后又新建了一个笔记，在新建后，左侧笔记列表刷新，但展开的笔记依然保持了之前的状态。

## 技术文档

现在我们要用 Next.js 实现这个项目，该怎么实现呢？

首先是技术选型，Next.js 的 App Router 自然是要用的，TypeScript 为了减少代码展示量就不使用了，ESLint 要使用，用于校验代码，Tailwind CSS 不需要，因为重写样式浪费时间，我们直接导入原 Demo 的样式文件即可。

后端数据库选择什么都可以，不过考虑到初期大家对 Next.js 尤其是 App Router 的使用不太习惯，再加上数据库的安装和使用也需要额外学习，我们先集中学习如何写好 Next.js 项目，数据方面先使用模拟数据来实现。

那么新的问题来了，怎么写模拟数据呢？第一种方式是在代码里直接写入数据。第二种方式是使用比如 faskMock 这样的工具生成静态接口。但是我们毕竟要做增删改查，无论是直接写数据还是静态接口都难以实现真的对数据源进行修改，所以最后我想了下，干脆用 [Redis](https://redis.io/) 做好了，作为经典的 NoSQL 数据库，使用起来也很方便。等 Next.js 部分完成学习之后，我们再替换为其他数据库。（其实我还试了用[维格表](https://developers.vika.cn/api/introduction)做数据库，但维格表接口有每秒最多 2 次的限制，于是就放弃了）

其次是路由分析，原 Demo 中都是在 `localhost:4000`下实现的，各种操作并不会产生路由变化，但既然我们用了 Next.js，不妨改成使用路由的方式，想了下，应该有这样几个路由：

1.  首页肯定是 `/`，点击左上角的 React Note Logo 会导航至首页 `/`
2.  点击左侧笔记列表中的一项，导航至 `/note/xxxx`路由，渲染具体笔记内容
3.  当点击 `NEW` 按钮的时候导航到 `/note/edit`路由上，点击 `Done`导航至刚创建的 `/note/xxxx`路由
4.  导航至 `/note/xxxx`后，点击 `EDIT` 按钮，进入 `/note/edit/xxxx` 路由，点击 `Done`导航至刚修改的 `/note/xxxx`路由，点击 `DELETE` 导航至首页 `/`
5.  当在左侧搜索框输入字符的时候，对应路由添加 `?q=searchText` 参数

对应到 Next.js 的项目目录，至少要有这些文件：

```javascript
next-react-notes                 
├─ app                                     
│  ├─ note                       
│  │  ├─ [id]                         
│  │  │  └─ page.js              
│  │  └─ edit                    
│  │     ├─ [id]                 
│  │     │  └─ page.js              
│  │     └─ page.js                        
│  ├─ layout.js                  
│  └─ page.js                                
```

考虑到左侧笔记列表出现在所有的路由中，我们将左侧的内容包括搜索栏和笔记列表，统一放在根布局 `layout.js` 中。

再者是组件划分，示意图如下：

![截屏2023-12-14 下午4.08.38.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0ce14cd1fd74018ac9e956d1da4864f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2450\&h=1740\&s=147434\&e=png\&b=ffffff)

左侧是 `<Sidebar>` 组件，子组件中有：

1.  `<SidebarSearchField>` 组件负责搜索框
2.  `<EditButton>` 组件负责添加按钮
3.  `<SidebarNoteList>` 组件负责笔记列表
    1.  再拆分为具体的 `<SidebarNoteItem>` 组件负责每一条具体的笔记内容

右侧是 `<Note>` 组件，子组件有：

1.  `<EditButton>` 组件负责编辑按钮
2.  `<NoteEditor>` 组件负责笔记的编辑界面
3.  `<NotePreview>` 组件负责笔记的预览界面

对项目有了大致的了解和规划，剩下的就让我们在项目里具体完善吧，现在开始动手吧。

## 开始项目

### 1. 创建项目

使用 `create-next-app`脚手架[创建项目](https://juejin.cn/book/7307859898316881957/section/7307280276332544027#heading-1)，运行：

```bash
npx create-next-app@latest
```

相关选择如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb2ac654862f445fb9146ce39caba318~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1150\&h=328\&s=618397\&e=png\&b=0b141d)

运行 `npm run dev`，打开 `localhost: 3000`开启项目：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60cd55caf07d46ab9832700283dd1f3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2034\&h=1490\&s=294221\&e=png\&b=000000)

### 2. 配置路径别名

为了让代码文件职责清晰，我们将组件统一放在根目录下的 `components`目录下，工具库放在根目录下的 `lib`目录下，为了方便引入，我们配置一下[路径别名](https://juejin.cn/book/7307859898316881957/section/7309078454316564507#heading-13)，修改 `jsconfig.json`：

```javascript
{
  "compilerOptions": {
    "paths": {
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"]
    }
  }
}
```

### 3. 修改根布局和根页面

修改 `app/page.js`：

```javascript
// app/page.js
export default async function Page() {
  return (
    <div className="note--empty-state">
      <span className="note-text--empty-state">
        Click a note on the left to view something! 🥺
      </span>
    </div>
  )
}

```

修改 `app/layout.js`：

```javascript
import './style.css'
import Sidebar from '@/components/Sidebar'

export default async function RootLayout({
  children
}) {

  return (
    <html lang="en">
      <body>
        <div className="container">
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

在 `/components`下新建一个名为 `Sidebar.js` 的文件，代码为：

```javascript
import React from 'react'
import Link from 'next/link'

export default async function Sidebar() {
  return (
    <>
      <section className="col sidebar">
        <Link href={'/'} className="link--unstyled">
          <section className="sidebar-header">
            <img
              className="logo"
              src="/logo.svg"
              width="22px"
              height="20px"
              alt=""
              role="presentation"
            />
            <strong>React Notes</strong>
          </section>
        </Link>
        <section className="sidebar-menu" role="menubar">
            {/* SideSearchField */}
        </section>
        <nav>
          {/* SidebarNoteList */}
        </nav>
      </section>
    </>
  )
}
```

### 4. 引入所需样式和图片文件

在根布局里我们引用了 `style.css`，`style.css`里声明了所有的样式，但这个文件不需要我们自己写，因为[原 Demo](https://github.com/reactjs/server-components-demo/tree/main) 里就已经将所有的样式写到了一个 [style.css](https://github.com/reactjs/server-components-demo/blob/main/public/style.css) 文件，我们只需要将这个文件拷贝到 `app`目录下即可。

这个项目里还会用到一些图片，我们将原 Demo 里 [public 目录](https://github.com/reactjs/server-components-demo/tree/main/public)下的 5 张 SVG 图片：`checkmark.svg`、`chevron-down.svg`、`chevron-up.svg`、`cross.svg`、`logo.svg` 拷贝到 `public`目录下。

### 5. 第一步完成！

如果步骤正确的话，此时再访问 `http://localhost:3000/`应该效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6752f40eba614c99a75c1e0e67cff120~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1736\&h=1132\&s=100291\&e=png\&b=f6f7fa)

是不是有原 Demo 的样子了？

## 数据请求

现在我们来处理数据的问题，正如之前所说，为了方便起见，我们使用 Redis 做数据库。简单介绍一下 Redis，它是一个高性能的 key-value  数据库，是现在最受欢迎的 NoSQL 数据库之一，常用于缓存、计数器、消息队列系统、排行榜等场景。

使用 Redis 很简单，一共分为三步：

### 1. 安装 Redis

macOS 安装 redis 很简单，按照[官网安装说明](https://redis.io/docs/install/install-redis/install-redis-on-mac-os/)，使用 Homebrew 安装即可：

```bash
brew install redis
```

Windows 安装略微复杂一点，因为我手边没有 Windows 电脑，就不提供安装方法了，教程很多。

### 2. 启动 Redis

运行以下命令，如果出现下图界面即表示运行成功：

```bash
redis-server
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd716fcce111422697241f8463989a52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2022\&h=1094\&s=3147360\&e=png\&b=03080d)

### 3. 项目引入 Redis

在项目里使用 redis 的时候，我们借助 [ioredis](https://github.com/redis/ioredis) 这个库，安装 ioredis：

```bash
npm install ioredis
```

在根目录下新建一个 `lib`文件夹，在 `lib`下新建一个名为 `redis.js`的文件，代码如下：

```javascript
import Redis from 'ioredis'

const redis = new Redis()

const initialData = {
  "1702459181837": '{"title":"sunt aut","content":"quia et suscipit suscipit recusandae","updateTime":"2023-12-13T09:19:48.837Z"}',
  "1702459182837": '{"title":"qui est","content":"est rerum tempore vitae sequi sint","updateTime":"2023-12-13T09:19:48.837Z"}',
  "1702459188837": '{"title":"ea molestias","content":"et iusto sed quo iure","updateTime":"2023-12-13T09:19:48.837Z"}'
}

export async function getAllNotes() {
  const data = await redis.hgetall("notes");
  if (Object.keys(data).length == 0) {
    await redis.hset("notes", initialData);
  }
  return await redis.hgetall("notes")
}

export async function addNote(data) {
  const uuid = Date.now().toString();
  await redis.hset("notes", [uuid], data);
  return uuid
}

export async function updateNote(uuid, data) {
  await redis.hset("notes", [uuid], data);
}

export async function getNote(uuid) {
  return JSON.parse(await redis.hget("notes", uuid));
}

export async function delNote(uuid) {
  return redis.hdel("notes", uuid)
}

export default redis
```

这块代码并不复杂，我们导出了 5 个函数，表示 5 个用于前后端交互的接口，分别是：

1.  获取所有笔记的 getAllNotes，这里我们做了一个特殊处理，如果为空，就插入 3 条事先定义的笔记数据
2.  添加笔记的 addNote
3.  更新笔记的 updateNote
4.  获取笔记的 updateNote
5.  删除笔记的 delNote

其中我们使用了 ioredis 的 hash 结构（ioredis 提供了相关[写法示例](https://github.com/redis/ioredis/blob/main/examples/hash.js)和 [API 说明](https://redis.github.io/ioredis/classes/Redis.html)）。也就是说，我们在 redis 服务器中存储的数据大概长这样：

```javascript
{
  "1702459181837": '{"title":"sunt aut","content":"quia et suscipit suscipit recusandae","updateTime":"2023-12-13T09:19:48.837Z"}',
  "1702459182837": '{"title":"qui est","content":"est rerum tempore vitae sequi sint","updateTime":"2023-12-13T09:19:48.837Z"}',
  "1702459188837": '{"title":"ea molestias","content":"et iusto sed quo iure","updateTime":"2023-12-13T09:19:48.837Z"}'
}
```

使用 macOS 的同学可以再下载一个 [Medis](https://getmedis.com/)，用于查看 Redis 中的数据（当然此时 Redis 还没有写入这些数据）：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8aae8a72646348fdb715e742f1e3cf1e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2680\&h=1644\&s=638727\&e=png\&a=1\&b=252729)

其中，key 值用的是创建笔记时的时间戳，value 值是具体的笔记数据，分为 3 个字段，分别是 `title`、`content`、`updateTime`。

## Sidebar 组件

现在让我们用此数据接口来写左侧的笔记列表吧！

### 1. 笔记列表

修改 `components/Sidebar.js`：

```jsx
import React from 'react'
import Link from 'next/link'
import { getAllNotes } from '@/lib/redis';
import SidebarNoteList from '@/components/SidebarNoteList';

export default async function Sidebar() {
  const notes = await getAllNotes()
  return (
    <>
      <section className="col sidebar">
        <Link href={'/'} className="link--unstyled">
          <section className="sidebar-header">
            <img
              className="logo"
              src="/logo.svg"
              width="22px"
              height="20px"
              alt=""
              role="presentation"
              />
            <strong>React Notes</strong>
          </section>
        </Link>
        <section className="sidebar-menu" role="menubar">
          {/* SideSearchField */}
        </section>
        <nav>
          <SidebarNoteList notes={notes} />
        </nav>
      </section>
    </>
  )
}
```

在代码中，我们将笔记列表抽成了单独的 `components/SidebarNoteList.js`组件，代码如下：

```jsx
export default async function NoteList({ notes }) {

  const arr = Object.entries(notes);

  if (arr.length == 0) {
    return <div className="notes-empty">
      {'No notes created yet!'}
    </div>
  }

  return <ul className="notes-list">
    {arr.map(([noteId, note]) => {
    const { title, updateTime } = JSON.parse(note);
    return <li key={noteId}>
      <header className="sidebar-note-header">
        <strong>{title}</strong>
        <small>{updateTime}</small>
      </header>
    </li>
  })}
  </ul>
}
```

如果步骤正确的话，此时再访问 `http://localhost:3000/`应该效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9907e43c6f14b308a31d1ebddd11b66~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1746\&h=990\&s=139551\&e=png\&b=f6f7fa)

我们已经成功的获取了 Redis 数据库中的数据，然后服务端渲染到了页面上。

现在在 Medis 中应该已经可以查看到写入的数据：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bd5a4a1c4d14aeea990ca4c239c6226~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2680\&h=1644\&s=638727\&e=png\&a=1\&b=252729)

现在你在 Medis 中修改下数据，`http://localhost:3000/`刷新后也会展示出来。

### 2. 时间处理库

现在你会发现，左侧笔记列表中的时间展示非常“难看”，为此我们需要一个将时间格式化的库，这里我们选择大家经常会用到的 [Day.js](https://dayjs.gitee.io/zh-CN/)，安装一下：

```bash
npm install dayjs
```

修改 `SidebarNoteList.js`：

```javascript
import dayjs from 'dayjs';

export default async function NoteList({ notes }) {

  const arr = Object.entries(notes);

  if (arr.length == 0) {
    return <div className="notes-empty">
      {'No notes created yet!'}
    </div>
  }

  return <ul className="notes-list">
    {arr.map(([noteId, note]) => {
      const { title, updateTime } = JSON.parse(note);
      return <li key={noteId}>
        <header className="sidebar-note-header">
          <strong>{title}</strong>
          <small>{dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}</small>
        </header>
      </li>
    })}
  </ul>
}
```

时间效果展示如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/387c82dde3384009a47671aa2918ff38~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1740\&h=922\&s=126371\&e=png\&b=f6f7fa)

是不是好看多了？但其实效果并不重要，重要的是我们引用了 `day.js` 这个库。我们引入 `day.js` 的 SidebarNoteList 组件使用的是服务端渲染，这意味着 `day.js` 的代码并不会被打包到客户端的 bundle 中。我们查看开发者工具中的源代码：

![截屏2023-12-14 下午10.56.02.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b8254999ba64c4bad1ff63ef2c0c621~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2492\&h=1010\&s=207391\&e=png\&b=f6f7fa)

你会发现 node\_modules 并没有 day.js，但如果你现在在 SidebarNoteList 组件的顶部添加 `'use client'`，声明为客户端组件，你会发现立刻就多了 day.js：

![截屏2023-12-14 下午10.59.07.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/037b4091549a45bd9457361eced21579~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2494\&h=990\&s=210227\&e=png\&b=f6f7fa)

### 3. 最佳实践：多用服务端组件

这就是使用 React Server Compoent 的好处之一，服务端组件的代码不会打包到客户端的 bundle 中：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/588f2f2a57b545f3a247ffcd27a6aa81~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1500\&h=573\&s=216155\&e=png\&b=1b1c24)

## 总结

那么今天的内容就结束了，本篇我们大致知道了要做的项目内容，并新建了 Next.js 项目，学会了用 Redis 做个简易的数据库，最后通过引入时间处理库，了解了使用 React Server Component 的一个优势。

本篇的代码我已经上传到[代码仓库](https://github.com/mqyqingfeng/next-react-notes-demo/tree/main)的 Day1 分支：<https://github.com/mqyqingfeng/next-react-notes-demo/tree/day1>，直接使用的时候不要忘记在本地开启 Redis。

## 参考链接

1.  <https://github.com/reactjs/server-components-demo>
2.  <https://www.youtube.com/watch?v=TQQPAU21ZUw&t=15s&ab_channel=MetaOpenSource>
3.  <https://redis.io/docs/install/install-redis/install-redis-on-mac-os/>
