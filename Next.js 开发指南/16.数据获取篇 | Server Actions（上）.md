## 前言

**Server Actions 是指在服务端执行的异步函数，它们可以在服务端和客户端组件中使用，以处理 Next.js 应用中的数据提交和更改。**

注：如果大家看英文文档，“数据更改”更专业的说法叫做 Data Mutations，中文译为“数据突变”。简单来说，数据查询（Data Queries）指读取数据，数据突变（Data Mutations）指更改数据。突变可以是新增、更新、删除字段或对象。“数据突变”初听可能有些奇怪，习惯就好。

## 基本用法

定义一个 Server Action 需要使用 React 的 ["use server"](https://react.dev/reference/react/use-server) 指令。按指令的定义位置分为两种用法：

1.  将 "use server" 放到一个 async 函数的顶部表示该函数为 Server Action（函数级别）
2.  将 "use server" 放到一个单独文件的顶部表示该文件导出的所有函数都是 Server Actions（模块级别）

**Server Actions 可以在服务端组件使用，也可以在客户端组件使用。**

当在服务端组件中使用的时候，两种级别都可以使用：

```javascript
// app/page.jsx
export default function Page() {
  // Server Action
  async function create() {
    'use server'
 
    // ...
  }
 
  return (
    // ...
  )
}
```

而在客户端组件中使用的时候，只支持模块级别。需要先创建一个文件（文件名无约定，很多开发者常命名为 "actions"），在顶部添加 "use server" 指令：

```javascript
'use server'

// app/actions.js
export async function create() {
  // ...
}
```

当需要使用的时候，导入该文件：

```javascript
import { create } from '@/app/actions'
 
export function Button() {
  return (
    // ...
  )
}
```

也可以将 Server Action 作为 props 传给客户端组件：

```javascript
<ClientComponent updateItem={updateItem} />
```

```javascript
'use client'
 
export default function ClientComponent({ updateItem }) {
  return <form action={updateItem}>{/* ... */}</form>
}
```

## 使用场景

在 Pages Router 下，如果要进行前后端交互，需要先定义一个接口，然后前端调用接口完整前后端交互。而在 App Router 下，这种操作都可以简化为 Server Actions。

也就是说，如果你要实现一个功能，按照传统前后端分离的架构，需要自己先写一个接口，用于前后端交互，那就都可以尝试使用 Server Actions，除非你就是需要写接口方便外部调用。

**而在具体使用上，虽然 Server Actions 常与 `<form>` 一起使用，但其实还可以在事件处理程序、useEffect、三方库、其他表单元素（如 `<button>`）中调用。**

## 实战体会

了解了基本用法，还是让我们在实战中具体体会吧！

我们的目标是写一个简单的 ToDoList：

![actions-1.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6aac0ba6aab452eab1ea2bddbed0a97~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=918\&h=711\&s=72795\&e=gif\&f=26\&b=f5f5f5)

写之前我们先用传统的 Pages Router 来实现一遍，通过对比来感受传统的使用 API 开发和使用 Server Actions 开发之间的区别。

### Pages Router  - API

实现一个 ToDoList，我们需要先创建一个 `/api/todo`接口。新建 `app/api/todos/route.js`，代码如下：

```javascript
import { NextResponse } from 'next/server'

const data = ['阅读', '写作', '冥想']
 
export async function GET() {
  return NextResponse.json({ data })
}

export async function POST(request) {
  const formData = await request.formData()
  const todo = formData.get('todo')
  data.push(todo)
  return NextResponse.json({ data })
}
```

此时访问 `/api/todos`，效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bae3ba7e1e4d4a289b9f0deee7d4df47~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1840\&h=250\&s=42777\&e=png\&b=fefefe)
现在我们开始写页面，在项目根目录新建 `pages`目录（用了 src，就放到 src 下），新建 `pages/form.js`，代码如下：

```javascript
import { useEffect, useState } from "react"

export default function Page() {

  const [todos, setTodos] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await (await fetch('/api/todos')).json()
      setTodos(data)
    }
    fetchData()
  }, [])

  async function onSubmit(event) {
    event.preventDefault()
    const response = await fetch('/api/todos', {
      method: 'POST',
      body: new FormData(event.currentTarget),
    })

    const {data} = await response.json()
    setTodos(data)
  }
  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" name="todo" />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
    </>
  )
}
```

代码很简单，页面加载的时候 GET 请求 `/api/todos` 渲染待办事项，表单提交的时候 POST 请求 `/api/todos`修改数据，然后渲染最新的待办事项。交互效果如下：

![actions-2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98a2e2e47a1d4627999d34701d2df82b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=918\&h=689\&s=98362\&e=gif\&f=51\&b=fefefe)

### App Router - Server Actions

那么用 Server Actions 该怎么实现呢？

新建 `app/form2/page.js`，代码如下：

```javascript
import { findToDos, createToDo } from './actions';

export default async function Page() {
  const todos = await findToDos();
  return (
    <>
      <form action={createToDo}>
        <input type="text" name="todo" />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
    </>
  )
}
```

新建 `app/form2/actions.js`，代码如下：

```javascript
'use server'

import { revalidatePath } from "next/cache";

const data = ['阅读', '写作', '冥想']
 
export async function findToDos() {
  return data
}

export async function createToDo(formData) {
  const todo = formData.get('todo')
  data.push(todo)
  revalidatePath("/form2");
  return data
}
```

交互效果如下（其实效果跟 Pages Router 下相同）：

![actions-3.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66da4e1806d84a9fac84b2771e78dcd5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=918\&h=689\&s=67987\&e=gif\&f=34\&b=fefefe)

## Server Actions

就让我们以这个简单的 Server Actions Demo 为例来分析下 Server Actions。
### 基本原理
首先是原理，Server Actions 是怎么实现的呢？让我们看下表单对应的 HTML 元素：

![截屏2024-03-12 22.51.30.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9709525ade5d4bebbeb29a1200471320~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2742\&h=610\&s=203100\&e=png\&b=2c2c2c)

Next.js 会自动插入一个 `<input type="hidden">`，其值为 `$ACTION_ID_xxxxxxxx`，用于让服务端区分 Action（因为一个页面可能使用多个 Server Actions）。

当点击 Submit 的时候，触发表单提交，会发送一个 POST 请求到当前页面地址：

![截屏2024-03-12 22.54.44.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e25b5b096dd748b795649d40ef78a165~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2858\&h=1478\&s=431607\&e=png\&b=2b2b2b)

请求会携带表单中的值，以及 \$ACTION\_ID：

![截屏2024-03-12 22.55.57.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7354fd9c235c4dc9a92d0e50ea679b5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2854\&h=1028\&s=305594\&e=png\&b=2b2b2b)

接口返回 RSC Payload，用于渲染更新后的数据：

![截屏2024-03-12 23.05.05.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d841770d3ca4697be42a7e9f3d7c100~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3154\&h=1040\&s=396005\&e=png\&b=2c2c2c)

其中，中文在 Chrome 显示乱码了（火狐可以正常查看）。RSC Payload 中包含最新的数据（返回最新的数据是因为我们调用了 revalidatePath）：

![截屏2024-03-12 23.06.33.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de99e77ca7534f68b45a20ccd3510e38~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3456\&h=436\&s=243070\&e=png\&b=1f1f1f)

简而言之：

1.  **Server Actions 背后使用的是 POST 请求方法**，请求当前页面地址，根据 \$ACTION\_ID 区分
2.  **Server Actions 与 Next.js 的缓存和重新验证架构集成**。调用 Action 时，Next.js 可以一次性返回更新的 UI 和新数据
### 使用好处
其次我们说说使用 Server Actions 的好处：

1.  代码更简洁。你也不需要手动创建接口，而且 Server Actions 是函数，这意味着它们可以在应用程序的任意位置中复用。
2.  当结合 form 使用的时候，支持渐进式增强。也就是说，即使禁用 JavaScript，表单也可以正常提交：

![actions-4.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ca8470e248d43f49db3ae7d44295f8c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1078\&h=571\&s=105914\&e=gif\&f=43\&b=292929)

如果使用 Pages Router 下的监听事件的方式，表单就无法正常工作了。但是 Server Actions 即使禁用 JS，也可以正常工作。

使用 Server Actions 禁用和不禁用 JS 的差别是，**不禁用的时候提交表单，页面不会刷新**。禁用的时候提交表单页面会刷新（仔细看上图提交“早起”这项任务的时候，刷新按钮有变化）
### 注意要点
最后讲讲使用 Server Actions 的注意要点。

1.  **Server Actions 的参数和返回值都必须是可序列化的**，简单的说，JSON.stringfiy 这个值不出错
2.  Server Actions 会继承使用的页面或者布局的运行时和路由段配置项，包括像 maxDuration 等字段

### 支持事件

前面也说过：

> **而在具体使用上，虽然 Server Actions 常与 `<form>` 一起使用，但其实还可以在事件处理程序、useEffect、三方库、其他表单元素（如 `<button>`）中调用。**


如果是在事件处理程序中，该怎么使用呢？

我们为刚才的 ToDoList 增加一个 “添加运动” 的按钮。当点击的时候，将运动添加到 TODO 中：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80e49e5847d84e7c99af97a722592f77~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1148&h=566&s=49790&e=png&b=fefefe)

修改 `app/form2/page.js`，代码如下：

```js
import { findToDos, createToDo } from './actions';
import Button from './button';

export default async function Page() {
  const todos = await findToDos();
  return (
    <>
      <form action={createToDo}>
        <input type="text" name="todo" />
        <button type="submit">Submit</button>
      </form>
      <Button>添加运动</Button>
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
    </>
  )
}
```

新建 `app/form2/button.js`，代码如下：

```js
'use client'

import { createToDoDirectly } from './actions';

export default function Button({children}) {
  return <button onClick={async () => {
    const data = await createToDoDirectly('运动')
    alert(JSON.stringify(data))
  }}>{children}</button>
}
```

修改 `app/form2/actions.js`，添加代码：

```js
export async function createToDoDirectly(value) {
  const form = new FormData()
  form.append("todo", value);
  return createToDo(form)
}
```

交互效果如下：


![actions-5.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/561fa0b46ab241f9be6b03ec45622244~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=847&h=558&s=55228&e=gif&f=32&b=fefefe)

这里的 Server Actions 是怎么实现的呢？

其实还是发送了一个 POST 请求到当前地址：


![截屏2024-03-13 10.50.23.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99ed678d82c34f4c8e8b981110e3ea50~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2770&h=1668&s=523309&e=png&b=fefefe)

返回的依然是 RSC Payload：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d78ded7ca837448d96ac6e5cbbcd3939~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2770&h=1098&s=444743&e=png&b=fefefe)

## 总结

想必大家已经熟悉了 Server Actions 的基本用法，Server Actions 自 Next.js v14 起进入稳定阶段，以后应该会是 Next.js 开发全栈项目时获取数据的主要方式，一定要熟练掌握。

其实使用 Server Actions 还有很多细节，比如如何获取表单提交时的等待状态？服务端如何验证字段？如何进行乐观更新？如何进行错误处理？如何获取 Cookies、Headers 等数据？如何重定向？……

这些也都是开发中常遇到的问题，我们下篇继续讲 Server Actions。
