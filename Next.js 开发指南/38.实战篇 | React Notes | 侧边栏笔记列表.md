## 前言

本篇我们来实现 React Notes 的左侧侧边栏部分。

## SidebarNoteList

现在我们接着完善笔记列表，毕竟笔记列表这里还要实现展开和收回功能：

![展开收回.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf9b75b9b8df4e9784fa1107e527d0d1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144\&h=638\&s=90321\&e=gif\&f=18\&b=fefefe)

修改 `components/SidebarNoteList.js`代码：

```jsx
import SidebarNoteItem from '@/components/SidebarNoteItem';

export default async function NoteList({ notes }) {

  const arr = Object.entries(notes);

  if (arr.length == 0) {
    return <div className="notes-empty">
      {'No notes created yet!'}
    </div>
  }

  return <ul className="notes-list">
    {arr.map(([noteId, note]) => {
    return <li key={noteId}>
      <SidebarNoteItem noteId={noteId} note={JSON.parse(note)} />
    </li>
  })}
  </ul>
}
```

这里我们将具体的每条笔记抽离成单独的 `SidebarNoteItem` 组件，`components/SidebarNoteItem.js`代码如下：

```jsx
import dayjs from 'dayjs';
import SidebarNoteItemContent from '@/components/SidebarNoteItemContent';

export default function SidebarNoteItem({ noteId, note}) {

  const { title, content = '', updateTime } = note;
  return (
    <SidebarNoteItemContent
      id={noteId}
      title={note.title}
      expandedChildren={
        <p className="sidebar-note-excerpt">
          {content.substring(0, 20) || <i>(No content)</i>}
        </p>
      }>
      <header className="sidebar-note-header">
        <strong>{title}</strong>
        <small>{dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}</small>
      </header>
    </SidebarNoteItemContent>
  );
}
```

这里我们又抽离了一个 `SidebarNoteItemContent` 组件，用来实现展开和收回功能，我们将笔记的标题和时间的 JSX 作为 children 传递给了 `SidebarNoteItemContent`，`components/SidebarNoteItemContent.js`代码如下：

```jsx
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation'

export default function SidebarNoteContent({
  id,
  title,
  children,
  expandedChildren,
}) {
  const router = useRouter()
  const pathname = usePathname()
  const selectedId = pathname?.split('/')[1] || null

  const [isPending] = useTransition()
  const [isExpanded, setIsExpanded] = useState(false)
  const isActive = id === selectedId

  // Animate after title is edited.
  const itemRef = useRef(null);
  const prevTitleRef = useRef(title);

  useEffect(() => {
    if (title !== prevTitleRef.current) {
      prevTitleRef.current = title;
      itemRef.current.classList.add('flash');
    }
  }, [title]);

  return (
    <div
      ref={itemRef}
      onAnimationEnd={() => {
        itemRef.current.classList.remove('flash');
      }}
      className={[
        'sidebar-note-list-item',
        isExpanded ? 'note-expanded' : '',
      ].join(' ')}>
      {children}
      <button
        className="sidebar-note-open"
        style={{
          backgroundColor: isPending
            ? 'var(--gray-80)'
            : isActive
              ? 'var(--tertiary-blue)'
              : '',
          border: isActive
            ? '1px solid var(--primary-border)'
            : '1px solid transparent',
        }}
        onClick={() => {
          const sidebarToggle = document.getElementById('sidebar-toggle')
          if (sidebarToggle) {
            sidebarToggle.checked = true
          }
          router.push(`/note/${id}`)
        }}>
        Open note for preview
      </button>
      <button
        className="sidebar-note-toggle-expand"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}>
        {isExpanded ? (
          <img
            src="/chevron-down.svg"
            width="10px"
            height="10px"
            alt="Collapse"
          />
        ) : (
          <img src="/chevron-up.svg" width="10px" height="10px" alt="Expand" />
        )}
      </button>
      {isExpanded && expandedChildren}
    </div>
  );
}
```

这里 `SidebarNoteItemContent` 具体的实现其实并不重要，你只要知道这是一个客户端组件就行了。在这个客户端组件里我们用了 `useState` 来控制展开和收回的状态，然后添加了一些动画效果，仅此而已。如果步骤正确的话，此时的页面效果为：

![展开收回2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a50bf13df5640608bef62a9583fb01e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=996\&h=565\&s=76691\&e=gif\&f=30\&b=f3f5f9)

我们成功的实现了组件的展开和收回功能！

## 服务端组件和客户端组件

现在让我们回顾下此时的侧边栏组件结构情况：

我们声明了一个 `Sidebar` 组件用于实现侧边栏，其中有一个子组件 `SidebarNoteList` 用于实现侧边栏的笔记列表部分，针对每一条笔记，我们抽离了一个 `SidebarNoteItem` 组件来实现，在 `SidebarNoteItem` 中，我们又抽离了一个名为 `SidebarNoteItemContent` 的客户端组件用于实现展开和收回功能，然后我们在 `SidebarNoteItem` 这个服务端组件中将笔记的标题和时间这段 JSX 作为 `children` 传递给 `SidebarNoteItemContent`。

这个时候你可能会有个疑问：为什么要这样做呢？为什么不直接把 `SidebarNoteItem` 声明为客户端组件，然后直接在这个组件里全部实现呢？还要用传递 `children` 这么复杂的方式？

### 使用指南

倒不着急回答这个问题。因为这段功能的实现涉及到我们开发 Next.js 项目常用的服务端组件和客户端组件导入，所以先让我们回顾下[相关的使用知识](https://juejin.cn/book/7307859898316881957/section/7309076661532622885#heading-31)（这很重要，开发的时候要谨记）：

1.  **服务端组件可以导入客户端组件，但客户端组件并不能导入服务端组件**
2.  **从服务端组件到客户端组件传递的数据需要可序列化**，以刚才的例子为例：

```javascript
// components/SidebarNoteItem.js

export default function SidebarNoteItem({ noteId, note}) {
	// ...
  return (
    <SidebarNoteItemContent
      id={noteId}
      title={note.title}
			fun={() => {}}
      expandedChildren={
        <p className="sidebar-note-excerpt">
          {content.substring(0, 20) || <i>(No content)</i>}
        </p>
      }>
      <header className="sidebar-note-header">
        <strong>{title}</strong>
        <small>{dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}</small>
      </header>
    </SidebarNoteItemContent>
  );
}
```

所谓可序列化，简单的理解就是 JSON.stringify() 这段数据不会出现错误，如果我们在这里传递一个函数 `fun={() => {}}`，就会出现错误提示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d143c66943f4e53a00efd1dd9d99be9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1908\&h=254\&s=56269\&e=png\&b=ffffff)

但 JSX 对象是可以正常传递的，正如这个例子中展示的那样。

3.  **但你可以将服务端组件以 props 的形式传给客户端组件**，其实刚才的实现里就展现了两种传递服务端组件的形式：

```jsx
// components/SidebarNoteItem.js

export default function SidebarNoteItem({ noteId, note}) {

  const { title, content = '', updateTime } = note;
  return (
    <SidebarNoteItemContent
      id={noteId}
      title={note.title}
      // 第一种方式
      expandedChildren={
        <p className="sidebar-note-excerpt">
          {content.substring(0, 20) || <i>(No content)</i>}
        </p>
      }>
      // 第二种方式
      <header className="sidebar-note-header">
        <strong>{title}</strong>
        <small>{dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}</small>
      </header>
    </SidebarNoteItemContent>
  );
}
```

### 服务端组件特性

现在让我们重新审视一下 SidebarNoteItem 的代码：

```jsx
// components/SidebarNoteItem.js
import dayjs from 'dayjs';

import SidebarNoteItemContent from '@/components/SidebarNoteItemContent';

export default function SidebarNoteItem({ noteId, note}) {

  const { title, content = '', updateTime } = note;
  return (
    <SidebarNoteItemContent
      id={noteId}
      title={note.title}
      expandedChildren={
        <p className="sidebar-note-excerpt">
          {content.substring(0, 20) || <i>(No content)</i>}
        </p>
      }>
      <header className="sidebar-note-header">
        <strong>{title}</strong>
        <small>{dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}</small>
      </header>
    </SidebarNoteItemContent>
  );
}
```

考验你是否认真学习了之前的知识到了！

在这段代码中，`SidebarNoteItem` 是一个服务端组件，在这个组件中我们引入了 dayjs 这个库，然而我们却是在 `SidebarNoteItemContent` 这个客户端组件中使用的 dayjs。请问最终客户端的 bundle 中是否会打包 dayjs 这个库？

关于这个结果，反正效果我们都实现了，直接去查看一下就知道了：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69f96864c4734380b94668a814caf502~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2458\&h=1040\&s=261833\&e=png\&b=f5f6f9)

所以答案是不会。**在服务端组件中使用 JSX 作为传递给客户端组件的 prop，JSX 会先进行服务端组件渲染，再发送到客户端组件中**。也就是说，发送给客户端组件的并不是：

```html
<header className="sidebar-note-header">
  <strong>{title}</strong>
  <small>{dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}</small>
</header>
```

而是编译后的如：

```html
<header class="sidebar-note-header">
  <strong>ea molestias</strong>
  <small>2023-12-13 05:19:48</small>
</header>
```

其实这里我们也完全可以把 header 抽离成一个 `SidebarNoteItemHeader` 服务端组件，这样效果会更明显：

新建 `/components/SidebarNoteItemHeader.js`，代码如下：

```javascript
import dayjs from 'dayjs';

export default function SidebarNoteItemHeader({title, updateTime}) {
  return (
      <header className="sidebar-note-header">
          <strong>{title}</strong>
          <small>{dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}</small>
      </header>
  );
}
```

修改 `SidebarNoteItem.js`文件代码为：

```jsx
import SidebarNoteItemContent from '@/components/SidebarNoteItemContent';
import SidebarNoteItemHeader from '@/components/SidebarNoteItemHeader';

export default function SidebarNoteItem({ noteId, note}) {

  const { title, content = '', updateTime } = note;
  return (
    <SidebarNoteItemContent
      id={noteId}
      title={note.title}
      expandedChildren={
        <p className="sidebar-note-excerpt">
          {content.substring(0, 20) || <i>(No content)</i>}
        </p>
      }>
        <SidebarNoteItemHeader title={title} updateTime={updateTime} />
    </SidebarNoteItemContent>
  );
}
```

现在我们查看下开发者工具中的的 Source 选项：

![截屏2023-12-15 下午8.45.30.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6ffc4d5d0e140af8d20beddbaa9c904~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3098\&h=1174\&s=265892\&e=png\&b=f5f6f9)

你会发现 `components` 下并没有我们刚建立的 `SidebarNoteItemHeader` 组件，只有一个客户端组件 `SidebarNoteItemContent`，node\_modules 下也没有 dayjs（如果你把 `SidebarNoteItemHeader` 声明为客户端组件就有了）。

最后让我们查看下 localhost 这个文件的 HTML：

![截屏2023-12-15 下午4.06.39.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86f0f6b6a691489ab2c29574bf3aab0b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3458\&h=1668\&s=659769\&e=png\&b=2a2a2a)

传给客户端组件的 JSX 这些内容也会直接渲染到 HTML 中，当然这里跟客户端组件还是服务端组件无关，是客户端组件也会预渲染，只是提一下而已。

### 最佳实践：客户端组件下移

我们在 [《渲染篇 | 服务端组件和客户端组件》](https://juejin.cn/book/7307859898316881957/section/7309076661532622885#heading-29)中讲到 **“尽可能将客户端组件在组件树中下移”**，这里就是一个很好的例子。我们本可以直接把 `SidebarNoteItem` 声明为客户端组件，然后直接在这个组件里全部实现，但是却抽离了一个名为 `SidebarNoteItemContent` 的客户端组件用于实现展开和收回功能。

`SidebarNoteItemContent` 的内容原本是 `SidebarNoteList` 的子组件，现在却是 `SidebarNoteItem` 的子组件。虽然在组件树中的位置下移了，但我们却因此避免了 dayjs 这个库被打包到客户端 bundle 中。在开发的时候，应该尽可能缩减客户端组件的范围。

## EditButton

`New` 和 `Edit` 按钮考虑到复用，我们单独抽离成一个 `EditButton`组件：

```javascript
// components/EditButton.js
import Link from 'next/link'

export default function EditButton({noteId, children}) {
  const isDraft = noteId == null;
  return (
    <Link href={`/note/edit/${noteId || ''}`} className="link--unstyled">
      <button
        className={[
          'edit-button',
          isDraft ? 'edit-button--solid' : 'edit-button--outline',
        ].join(' ')}
        role="menuitem">
        {children}
      </button>
    </Link>
  );
}
```

Sidebar 组件引入一下：

```javascript
// ...
import EditButton from '@/components/EditButton';

export default async function Sidebar() {
  const notes = await getAllNotes()
  return (
    <>
      	// ...
        <section className="sidebar-menu" role="menubar">
          <EditButton noteId={null}>New</EditButton>
        </section>
        <nav>
          <SidebarNoteList notes={notes} />
        </nav>
      </section>
    </>
  )
}

```

## Suspense

原 Demo 中当笔记列表加载的时候是有骨架图的效果的：

![suspense2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b9181f28f944267a85356b7c39fd02c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1031\&h=642\&s=65695\&e=gif\&f=20\&b=f4f6f9)

这说明肯定用了 `Suspense`。因为我们现在将笔记列表数据的获取放在了顶层，所以直接为 `SidebarNoteList` 添加 `Suspense` 是没有效果的，我们需要将数据获取改为在 `SidebarNoteList` 组件内部。

修改`Sidebar.js` 代码如下：

```jsx
import React, { Suspense } from 'react'
import Link from 'next/link'

import SidebarNoteList from '@/components/SidebarNoteList';
import EditButton from '@/components/EditButton';
import NoteListSkeleton from '@/components/NoteListSkeleton';

// // 移除数据请求部分，为 SidebarNoteList 添加 Suspense 以及 fallback UI NoteListSkeleton
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
          <EditButton noteId={null}>New</EditButton>
        </section>
        <nav>
          <Suspense fallback={<NoteListSkeleton />}>
            <SidebarNoteList />
          </Suspense>
        </nav>
      </section>
    </>
  )
}
```

添加 `/components/NoteListSkeleton.js`，代码如下：

```jsx
export default function NoteListSkeleton() {
  return (
    <div>
      <ul className="notes-list skeleton-container">
        <li className="v-stack">
          <div
            className="sidebar-note-list-item skeleton"
            style={{height: '5em'}}
          />
        </li>
        <li className="v-stack">
          <div
            className="sidebar-note-list-item skeleton"
            style={{height: '5em'}}
          />
        </li>
        <li className="v-stack">
          <div
            className="sidebar-note-list-item skeleton"
            style={{height: '5em'}}
          />
        </li>
      </ul>
    </div>
  );
}
```

`/components/SidebarNoteList.js`代码如下，为了让效果更加明显，我们添加了一个 sleep 函数：

```javascript
import SidebarNoteItem from '@/components/SidebarNoteItem';
import { getAllNotes } from '@/lib/redis';

export default async function NoteList() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(10000);
  const notes = await getAllNotes()

  const arr = Object.entries(notes);

  if (arr.length == 0) {
    return <div className="notes-empty">
      {'No notes created yet!'}
    </div>
  }

  return <ul className="notes-list">
    {arr.map(([noteId, note]) => {
      return <li key={noteId}>
        <SidebarNoteItem noteId={noteId} note={JSON.parse(note)} />
      </li>
    })}
  </ul>
}
```

此时页面效果如下：

![suspense3.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/585e8f43135e4cc3afa39336aba2ccba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1031\&h=642\&s=80276\&e=gif\&f=36\&b=f3f5f9)

我们成功实现了骨架图效果！

那么问题来了，`SidebarNoteList` 用 `Suspense` 和不用 `Suspense`，具体有什么改变呢？比如，使用 `Suspense` 会带来新的请求吗？

我们可以自己测试一下，**答案是不会。** 之前是那 10 个请求，使用后还是那 10 个请求。

那么使用 `Suspense` 和不使用 `Suspense`，到底有什么差别呢？其实我们看下用和不用的效果就知道了。

我们把 sleep 的时间设置为 5s。这是不使用 Suspense 的效果，我们从掘金页面输入地址 `http://localhost:3000/`：

![use suspense.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9865b4976c54f31b5567b6f12493454~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1031\&h=642\&s=171424\&e=gif\&f=21\&b=fdfdfd)

输入地址后，我们等待了大概 5s 后，页面突然完全展现。

这是使用 Suspense 的效果，我们还是从掘金页面输入地址 `http://localhost:3000/`：

![use suspense2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbd8d4e509114b15808f8964ecbbcf96~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1031\&h=642\&s=269392\&e=gif\&f=52\&b=fdfdfd)

输入地址后，我们立刻就跳转到了页面，笔记列表部分等待了 5s 后，开始展现。除此之外，使用 Suspense，数据加载不会阻塞页面，也就是说在笔记列表还在加载的时候，用户依然可以与页面其他部分进行交互，比如点击 New 按钮新建笔记。

那么问题又来了，页面请求数没有变化，也没有新的请求，这些又都是服务端组件，数据请求都在服务端，到底谁等待了那 5s 呢，然后把数据返回的呢？

答案在于 `localhost` 这个 HTML 页面，查看网络请求，刚开始页面加载的时候，localhost 的 Time 为 126ms：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fa17b32219a4193aa7fdccf62691b21~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2788\&h=1244\&s=450882\&e=png\&b=292929)

加载完成后，localhost 的 Time 变成了 5s：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d53503d83c524dd980444d5e69ad3760~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2784\&h=1376\&s=509817\&e=png\&b=292929)

之所以这样，正如[《渲染篇 | Streaming 和 Edge Runtime》](https://juejin.cn/book/7307859898316881957/section/7309076865732640818)中介绍的那样，答案在于 HTML 是通过 stream 格式进行传输的，查看 HTML 文件的响应头：

![截屏2023-12-15 下午7.42.29.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/832e56f2810d4a6f9b384bf21737d8fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2788\&h=1376\&s=472366\&e=png\&b=2b2b2b)

其 `Transfer-Encoding` 标头的值为 `chunked`，表示数据将以一系列分块的形式进行发送。HTML 首先收到骨架图的 HTML 进行渲染，再收到渲染完成的笔记列表 HTML 进行渲染，查看一下 localhost HTML 文件的返回：

```html
<!DOCTYPE html>
<html lang="en">
  <head>

  </head>
  <body>
    <div class="container">
      <div class="main">
        // ...
        <nav>
          <!--$?-->
          <template id="B:0"></template>
          <!--这里是骨架图 NoteListSkeleton 的 HTML-->
          <div>
            <ul class="notes-list skeleton-container">
              <li class="v-stack">
                <div class="sidebar-note-list-item skeleton" style="height:5em"></div>
              </li>
              <li class="v-stack">
                <div class="sidebar-note-list-item skeleton" style="height:5em"></div>
              </li>
              <li class="v-stack">
                <div class="sidebar-note-list-item skeleton" style="height:5em"></div>
              </li>
            </ul>
          </div>
          <!--/$-->
        </nav>
      </div>
    </div>
    // ...
    <div hidden id="S:0">
      <!--这里是笔记列表 SidebarNoteList 的 HTML-->
      <ul class="notes-list">
        <li>
          <div class="sidebar-note-list-item ">
            <header class="sidebar-note-header">
              <strong>ea molestias</strong>
              <small>2023-12-13 05:19:48</small>
            </header>
            <button class="sidebar-note-open" style="border:1px solid transparent">Open note for preview</button>
            <button class="sidebar-note-toggle-expand">
              <img src="/chevron-up.svg" width="10px" height="10px" alt="Expand"/>
            </button>
          </div>
        </li>
        <li>
          <div class="sidebar-note-list-item ">
            <header class="sidebar-note-header">
              <strong>qui est</strong>
              <small>2023-12-13 05:19:48</small>
            </header>
            <button class="sidebar-note-open" style="border:1px solid transparent">Open note for preview</button>
            <button class="sidebar-note-toggle-expand">
              <img src="/chevron-up.svg" width="10px" height="10px" alt="Expand"/>
            </button>
          </div>
        </li>
        <li>
          <div class="sidebar-note-list-item ">
            <header class="sidebar-note-header">
              <strong>sunt aut</strong>
              <small>2023-12-13 05:19:48</small>
            </header>
            <button class="sidebar-note-open" style="border:1px solid transparent">Open note for preview</button>
            <button class="sidebar-note-toggle-expand">
              <img src="/chevron-up.svg" width="10px" height="10px" alt="Expand"/>
            </button>
          </div>
        </li>
      </ul>
    </div>
    <script>
      $RC = function(b, c, e) {
         // ... 	
      }
      $RC("B:0", "S:0")
    </script>
  </body>
</html>

```

因为代码比较多，所以做了一点精简，你会发现在这个 HTML 里，骨架图的 HTML 和笔记列表的 HTML 都返回了，所以使用 Suspense 和 Streaming 不用担心会对 SEO 造成影响。

### 最佳实践：使用 Suspense

Suspense 的效果就是允许你推迟渲染某些内容，直到满足某些条件（例如数据加载完毕）。在开发 Next.js 项目的时候，有数据加载的地方多考虑是否可以使用 `Suspense` 或者 `loading.js`带来更好的体验。

## 总结

那么今天的内容就结束了，本篇我们完善了侧边栏笔记列表的效果，了解了在 Next.js 中使用服务端组件和客户端组件的注意事项，学习到了两个最佳实践：

1.  客户端组件下移
2.  使用 Suspense

本篇的代码我已经上传到[代码仓库](https://github.com/mqyqingfeng/next-react-notes-demo/tree/main)的 Day2 分支：<https://github.com/mqyqingfeng/next-react-notes-demo/tree/day2>，直接使用的时候不要忘记在本地开启 Redis。
