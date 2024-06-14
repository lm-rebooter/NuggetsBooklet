## 前言

上篇我们讲了 Server Actions 的基本用法，本篇我们讲讲 Server Actions 的“标准”用法。比如哪些 API 和库是常搭配 Server Actions 使用的？写一个 Server Actions 要注意哪些地方？

我们还会介绍开发 Server Actions 时常遇到的一些问题，比如如何进行乐观更新？如何进行错误处理？如何获取 Cookies、Headers 等数据？如何重定向？等等

让我们开始吧。

## Form

我们先讲讲 Server Actions 处理表单提交时常搭配使用的一些 API。

### 1. useFormStatus

首先是 [useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus)，这是 React 的官方 hook，用于返回表单提交的状态信息。示例代码如下：

```javascript
'use client'
// app/submit-button.jsx
import { useFormStatus } from 'react-dom'
 
export function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <button type="submit" aria-disabled={pending}>
      {pending ? 'Adding' : 'Add'}
    </button>
  )
}
```

```javascript
// app/page.jsx
import { SubmitButton } from '@/app/submit-button'
 
export default async function Home() {
  return (
    <form action={...}>
      <input type="text" name="field-name" />
      <SubmitButton />
    </form>
  )
}
```

使用的时候要注意：useFormStatus 必须用在 `<form>` 下的组件内部，就像这段示例代码一样。先建立一个按钮组件，在组件内部调用 useFormStatus，然后 `<form>` 下引用该组件。不能完全写到一个组件中，像这样写就是错误的：

```javascript
function Form() {
  // 🚩 `pending` will never be true
  // useFormStatus does not track the form rendered in this component
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

### 2. useFormState

然后是 [useFormState](https://react.dev/reference/react-dom/hooks/useFormState)，这也是 React 官方 hook，根据表单 action 的结果更新状态。

用在 React 时示例代码如下：

```javascript
import { useFormState } from "react-dom";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useFormState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

用在 Next.js，结合 Server Actions 时，示例代码如下：

```javascript
'use client'

import { useFormState } from 'react-dom'

export default function Home() {

  async function createTodo(prevState, formData) {
    return prevState.concat(formData.get('todo'));
  }

  const [state, formAction] = useFormState(createTodo, [])

  return (
    <form action={formAction}>
      <input type="text" name="todo" />
      <button type="submit">Submit</button>
      <p>{state.join(',')}</p>
    </form>
  ) 
}
```

### 3. 实战体会

现在让我们结合 useFormStatus 和 useFormState，讲解使用 Server Actions 如何处理 form 提交。涉及的目录和文件如下：

```javascript
app                 
└─ form3           
   ├─ actions.js   
   ├─ form.js      
   └─ page.js            
```

其中 `app/form3/page.js` 代码如下：

```javascript
import { findToDos } from './actions';
import AddToDoForm from './form';

export default async function Page() {
  const todos = await findToDos();
  return (
    <>
      <AddToDoForm />
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
    </>
  )
}
```

`app/form3/form.js`，代码如下：

```javascript
'use client'
 
import { useFormState, useFormStatus } from 'react-dom'
import { createToDo } from './actions';

const initialState = {
  message: '',
}
 
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" aria-disabled={pending}>
      {pending ? 'Adding' : 'Add'}
    </button>
  )
}

export default function AddToDoForm() {
  const [state, formAction] = useFormState(createToDo, initialState)
 
  return (
    <form action={formAction}>
      <input type="text" name="todo" />
      <SubmitButton />
      <p aria-live="polite" className="sr-only">
        {state?.message}
      </p>
    </form>
  )
}
```

`app/form3/actions.js`，代码如下：

```javascript
'use server'

import { revalidatePath } from "next/cache";

const sleep = ms => new Promise(r => setTimeout(r, ms));

let data = ['阅读', '写作', '冥想']
 
export async function findToDos() {
  return data
}

export async function createToDo(prevState, formData) {
  await sleep(500)
  const todo = formData.get('todo')
  data.push(todo)
  revalidatePath("/form3");
  return {
    message: `add ${todo} success!`
  }
}
```

交互效果如下：

![actions-6.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9b1592d85124e03a2cd6d927ea6686b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=847\&h=558\&s=81417\&e=gif\&f=37\&b=fefefe)
注意：当使用 useFormState 的时候，对应 Server Action 函数的参数，第一个参数是 prevState，第二个参数是 formData。当使用 useFormStatus 的时候，要写在 form 下的单独的组件中。使用的时候，注意这两点就行。

值得一提的是：

```javascript
<p aria-live="polite" className="sr-only">
  {state?.message}
</p>
```

`aria-live`表示这是一个 ARIA 标签，用于礼貌通知用户发生了变更。`"sr-only"`表示这是一个只用于 screen reader 的内容。因为我们并没有设置 sr-only 的样式，所以在页面中显露了出来，按理说要加一个如下的样式：

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

简单的来说，这段内容在屏幕上并不应该显示出来。返回这个信息是用于通知不能像正常人看到屏幕内容、需要借助屏幕阅读器工具的人，任务创建成功。

## Server Actions

接下来讲讲写 Server Actions 有哪些注意要点。简单来说，要注意：

1.  获取提交的数据
2.  进行数据校验和错误处理
3.  重新验证数据
4.  错误处理

### 1. 获取数据

如果使用 form action 这种最基本的形式，Server Action 函数第一个参数就是 formData：

```javascript
export default function Page() {
  async function createInvoice(formData) {
    'use server'
 
    const rawFormData = {
      customerId: formData.get('customerId')
    }
 
    // mutate data
    // revalidate cache
  }
 
  return <form action={createInvoice}>...</form>
}
```

如果使用 form action + useFormState 这种形式，Server Actions 函数第一个参数是 prevState，第二个参数是 formData：

```javascript
'use client'

import { useFormState } from 'react-dom'

export default function Home() {

  async function createTodo(prevState, formData) {
    return prevState.concat(formData.get('todo'));
  }

  const [state, formAction] = useFormState(createTodo, [])

  return (
    <form action={formAction}>
      <input type="text" name="todo" />
      <button type="submit">Submit</button>
      <p>{state.join(',')}</p>
    </form>
  ) 
}
```

如果是直接调用，那看调用的时候是怎么传入的，比如上篇举的事件调用的例子：

```javascript
'use client'

import { createToDoDirectly } from './actions';

export default function Button({children}) {
  return <button onClick={async () => {
    const data = await createToDoDirectly('运动')
    alert(JSON.stringify(data))
  }}>{children}</button>
}
```

```javascript
'use server'

export async function createToDoDirectly(value) {
  const form = new FormData()
  form.append("todo", value);
  return createToDo(form)
}
```

### 2. 表单验证

Next.js 推荐基本的表单验证使用 HTML 元素自带的验证如 `required`、`type="email"`等。

对于更高阶的服务端数据验证，可以使用 [zod](https://zod.dev/) 这样的 schema 验证库来验证表单数据的结构：

```javascript
'use server'
 
import { z } from 'zod'
 
const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
})
 
export default async function createsUser(formData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })
 
  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  // Mutate data
}
```

### 3. 重新验证数据

Server Action 修改数据后，一定要注意重新验证数据，否则数据不会及时更新。

使用 revalidatePath：

```javascript
'use server'
 
import { revalidatePath } from 'next/cache'
 
export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }
 
  revalidatePath('/posts')
}
```

使用 revalidateTag：

```javascript
'use server'
 
import { revalidateTag } from 'next/cache'
 
export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }
 
  revalidateTag('posts')
}
```

### 4. 错误处理

一种是返回错误信息。举个例子，当一个条目创建失败，返回错误信息：

```javascript
'use server'
// app/actions.js
export async function createTodo(prevState, formData) {
  try {
    await createItem(formData.get('todo'))
    return revalidatePath('/')
  } catch (e) {
    return { message: 'Failed to create' }
  }
}
```

在客户端组件中，读取这个值并显示错误信息：

```javascript
'use client'
// app/add-form.jsx
import { useFormState, useFormStatus } from 'react-dom'
import { createTodo } from '@/app/actions'
 
const initialState = {
  message: null,
}
 
function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <button type="submit" aria-disabled={pending}>
      Add
    </button>
  )
}
 
export function AddForm() {
  const [state, formAction] = useFormState(createTodo, initialState)
 
  return (
    <form action={formAction}>
      <label htmlFor="todo">Enter Task</label>
      <input type="text" id="todo" name="todo" required />
      <SubmitButton />
      <p aria-live="polite" className="sr-only">
        {state?.message}
      </p>
    </form>
  )
}
```

一种是抛出错误，会由最近的 error.js 捕获：

```javascript
'use client'
// error.js
export default function Error() {
  return (
    <h2>error</h2>
  )
}
```

```javascript
// page.js
import { useFormState } from 'react-dom'

function AddForm() {
  async function serverActionWithError() {
    'use server';   
    throw new Error(`This is error is in the Server Action`);
  }

  return (
    <form action={serverActionWithError}>
      <button type="submit">Submit</button>
    </form>
  ) 
}

export default AddForm
```

这样当 Server Action 发生错误的时候，就会展示错误 UI。

## 乐观更新

### 1. useOptimistic

所谓乐观更新，举个例子，当用户点击一个点赞按钮的时候，传统的做法是等待接口返回成功时再更新 UI。乐观更新是先更新 UI，同时发送数据请求，至于数据请求后的错误处理，则根据自己的需要自定义实现。

React 提供了 [useOptimistic](https://react.dev/reference/react/useOptimistic) hook，这也是官方 hook，基本用法如下：

```javascript
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // merge and return new state
      // with optimistic value
    }
  );
}
```

结合 Server Actions 使用的示例代码如下：

```javascript
'use client'
 
import { useOptimistic } from 'react'
import { send } from './actions'
 
export function Thread({ messages }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { message: newMessage }]
  )
 
  return (
    <div>
      {optimisticMessages.map((m) => (
        <div>{m.message}</div>
      ))}
      <form
        action={async (formData) => {
          const message = formData.get('message')
          addOptimisticMessage(message)
          await send(message)
        }}
      >
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

### 2. 实战体会

为了加深对乐观更新的理解，我们来写一个例子。项目目录和文件如下：

```javascript
app                 
└─ form4           
   ├─ actions.js   
   ├─ form.js      
   └─ page.js            
```

其中 `app/form4/page.js` 代码如下：

```javascript
import { findToDos } from './actions';
import Form from './form';

export default async function Page() {
  const todos = await findToDos();
  return (
    <Form todos={todos} />
  )
}
```

`app/form4/form.js`，代码如下：

```javascript
'use client'

import { useOptimistic } from 'react'
import { useFormState } from 'react-dom'
import { createToDo } from './actions';

export default function Form({ todos }) {
  const [state, sendFormAction] = useFormState(createToDo, { message: '' })

  const [optimistiToDos, addOptimisticTodo] = useOptimistic(
    todos.map((i) => ({text: i})),
    (state, newTodo) => [
      ...state,
      {
        text: newTodo,
        sending: true
      }
    ]
  );

  async function formAction(formData) {
    addOptimisticTodo(formData.get("todo"));
    await sendFormAction(formData);
  }

  console.log(optimistiToDos)

  return (
    <>
      <form action={formAction}>
        <input type="text" name="todo" />
        <button type="submit"> Add </button>
        <p aria-live="polite" className="sr-only">
          {state?.message}
        </p>
      </form>
      <ul>
        {optimistiToDos.map(({text, sending}, i) => <li key={i}>{text}{!!sending && <small> (Sending...)</small>}</li>)}
      </ul>
    </>
  )
}
```

`app/form4/actions.js`，代码如下：

```javascript
'use server'

import { revalidatePath } from "next/cache";

const sleep = ms => new Promise(r => setTimeout(r, ms));

let data = ['阅读', '写作', '冥想']
 
export async function findToDos() {
  return data
}

export async function createToDo(prevState, formData) {
  await sleep(2500)
  const todo = formData.get('todo')
  data.push(todo)
  revalidatePath("/form4");
  return {
    message: `add ${todo} success!`
  }
}
```

交互效果如下：

![actions-7.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a786cb80a2ea4a4eb0e4a9060ccf7d4d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1124\&h=529\&s=247810\&e=gif\&f=65\&b=fefefe)

注：乐观更新是一种面向未来的 UI 更新方式。如何在接口错误的时候撤回数据？如果接口实在是太慢了，乐观更新的时候，用户要离开该怎么办？

关于这些更细节的实现问题，欢迎参考 [《Next.js v14 实现乐观更新，面向未来的 UI 更新方式，你可以不去做，但你不应该不了解》](https://juejin.cn/post/7347957960884355113)

## 常见问题

### 1. 如何处理 Cookies ?

```javascript
'use server'
 
import { cookies } from 'next/headers'
 
export async function exampleAction() {
  // Get cookie
  const value = cookies().get('name')?.value
 
  // Set cookie
  cookies().set('name', 'Delba')
 
  // Delete cookie
  cookies().delete('name')
}
```

### 2. 如何重定向？

```javascript
'use server'
 
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
 
export async function createPost(id) {
  try {
    // ...
  } catch (error) {
    // ...
  }
 
  revalidateTag('posts') // Update cached posts
  redirect(`/post/${id}`) // Navigate to the new post page
}
```

## 参考链接

1.  [Data Fetching: Fetching, Caching, and Revalidating](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
2.  [Data Fetching: Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns)
3.  [Data Fetching: Forms and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations)
4.  [Functions: Server Actions](https://nextjs.org/docs/app/api-reference/functions/server-actions)
5.  <https://makerkit.dev/blog/tutorials/nextjs-server-actions>
