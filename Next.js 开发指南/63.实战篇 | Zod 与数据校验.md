## 前言

前面讲的 Clerk、Crowdin、Storybook 都可以不学，但 Zod 几乎是开发 Next.js 项目的必学内容，因为大部分的全栈项目都会有数据校验的场景。而 Next.js [官方文档](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-validation-and-error-handling)推荐的正是 [Zod](https://zod.dev/)。

目前 Zod GitHub 31.5k Star，Npm 周均下载量 784W，几乎是前端做数据校验的第一选择。

本篇带大家快速上手 Zod。

## Zod 介绍

### 1. 基础介绍

Zod 是一个 **TypeScript 优先（TypeScript-first）**的**模式声明（schema declaration**）和**验证库（validation library）**。

第一次听到这个介绍可能会“不明觉厉”，但其实很简单，举个简单的例子：

```javascript
import { z } from "zod";

// 模式声明
const schema = z.string();

// 数据校验
schema.parse("tuna"); // => "tuna"
schema.parse(12); // => throws ZodError
```

这就是一个基本的模式声明和数据验证的例子。那什么是 TypeScript 优先呢？

简单来说，就是和 TypeScript 搭配使用，效果更佳。Zod 的目的在于消除重复的类型声明。使用 Zod，你只需声明一次验证器（validator），Zod 就会自动推断出静态 TypeScript 类型。细看 Zod 的 API，你会发现 Zod 与 TypeScript 的类型系统几乎是一对一的映射。

```typescript
import { z } from "zod";

// 模式声明
const User = z.object({
  username: z.string(),
});

// 数据校验
User.parse({ username: "Ludwig" });

// 提取推断类型
type User = z.infer<typeof User>;
// { username: string }
```

注意：但这并不是说使用 Zod 就一定要使用 TypeScript，Zod 也可用于纯 JavaScript。

### 2. 运行时校验

那你可能就好奇了，不都是数据校验，我都有 TypeScript 了，用 Zod 干嘛？

简单来说，TypeScript 是静态类型检查，但 Zod 不仅能在编译时提供类型检查，还能在运行时进行数据校验。这样就可以从源头上防止数据不合法而导致的错误，提高应用的稳定性。

举个例子，我们调用接口，获取返回的数据并进行处理：

```javascript
export async function GET() {
  const res = await fetch("/api/product");
  const data = await res.json();

  const showPrice = data.price.toFixed(2);
  return Response.json({ showPrice });
}

```

在这段代码中，data 肯定会被推断为 any，因为 data 是运行时返回的数据，TypeScript 并不知道：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/995c4ad41b7a456f93a3ab60702ee5d4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1578\&h=430\&s=107232\&e=png\&b=1e1e1e)

我们当然可以补全类型声明：

```typescript
type Product = {
  price: number;
};

export async function GET() {
  const res = await fetch("/api/product");
  const data = await res.json() as Product;

  const showPrice = data.price.toFixed(2);
  return Response.json({ showPrice });
}
```

现在 price 字段声明了数字类型，如果我们使用了字符串的方法, TypeScript 就会报错。

但问题在于，即便我们不使用，但接口的返回数据类型突然改了呢？比如本来是 Number 类型，后端改为了 String 类型？因为 String 类型没有 toFixed 方法，那这段代码运行的时候就会报错。

为了防止运行时产生问题，我们还需要做判断，比如：

```typescript
type Product = {
  price: number;
};

export async function GET() {
  const res = await fetch("/api/product");
  const data = await res.json() as Product;

  if (data && data.price && typeof data.price == 'number') {
    const showPrice = data.price.toFixed(2);
    return Response.json({ showPrice });
  } else {
    return Response.json({ success: false });
  }
}
```

如果涉及的字段众多，每个字段都写一段校验，代码很快就会变得臃肿难以维护。

而 Zod 正好可以解决这一问题，使用 Zod 后，代码改为：

```javascript
import { z } from 'zod';

const schema = z.object({
    price: z.number()
});

export async function GET() {
  const res = await fetch("/api/product");
  const data = await res.json();

  const parsedData = schema.safeParse(data)
  
  if (parsedData.success) {
    const showPrice = parsedData.data.price.toFixed(2);
    return Response.json({ showPrice });
  } else {
    return Response.json({ success: false });
  }
}

```

整体代码更加简洁优雅，而且你也不需要再写类型声明：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/100aa0e4055142aa92fc9aa1d83ff7dd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1824\&h=588\&s=153334\&e=png\&b=1f1f1f)

先对接口返回的数据进行校验，通过后再进行后续操作，从源头上防止数据不合法而导致的错误，提高应用的稳定性，而且还能帮助 TypeScript 进行推断，使用起来非常方便。

### 3. 如何学习 Zod

那具体如何学习 Zod 呢？就我个人看法，学习 Zod 的最好方法就是看 Zod 的官方文档：

1.  英文：<https://zod.dev/>
2.  中文：<https://zod.dev/README_ZH>

内容并不算多， 20 分钟就可以看个大概。首要目的是了解 Zod 有哪些功能，具体要用的时候边查文档边学习。

如果文档看不下去，这是一个 30 分钟学习 Zod 的 [Youtube 视频](https://www.youtube.com/watch?v=L6BE-U3oy80\&ab_channel=WebDevSimplified)。

## Next.js + Zod

具体 Zod 在 Next.js 中如何使用呢？我们先举个简单的使用示例。

### 1. 纯后端数据校验

运行 `npx create-next-app@latest`初始化项目。

修改 `app/page.js`，代码如下：

```jsx
'use client'

import { validate } from './actions';
import { useFormState } from 'react-dom'

export default function Page() {

  const [state, formAction] = useFormState(validate, {
    message: ''
  })

  return (
    <section className="p-2">
      <form action={formAction} className="mb-2">
        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
          Name:
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2"
          />
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
          Login
        </button>
      </form>
      <p aria-live="polite">
        {state?.message}
      </p>
    </section>
  );
}
```

新建 `app/actions.js`，代码如下：

```javascript
'use server'

import { z } from "zod";

const schema = z.object({
  name: z.string({
    required_error: "请输入昵称",
    invalid_type_error: "昵称必须是字符串",
  }).min(2, { message: "昵称最少需要 2 个字" }).max(10, { message: '昵称最多 10 个字'})
});

export async function validate(prevState, formData) {

  const validatedFields = schema.safeParse({
    name: formData.get('name'),
  })
 
  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.issues[0].message
    }
  }

  return {
    success: true,
    message: '设置成功'
  }
}
```

浏览器效果如下：

![17.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb50501a9d3a4d7dae8a0fd54ec5ddc7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=790\&h=389\&s=81090\&e=gif\&f=52\&b=fefefe)

### 2. 前后端数据校验

我们知道，在实际开发中，前后端数据校验都是必须的，前端校验是为了避免浪费后端资源，后端校验是因为不能相信来自客户端的数据。所以往往同样的校验，前后端都需要做一次。这就需要将 Schema 抽离出来，方便前后端使用。

新建 `app/todo/page.js`，代码如下：

```jsx
import { findTodos } from './actions';
import Form from './form';

export default async function Page() {

  const todos = await findTodos()

  return (
    <section className="p-2">
      <Form />
      <ul>
        {todos.map((todo) => {
      return <li>{todo}</li>
    })}
      </ul>
    </section>
  );
}
```

这里我们将 Form 抽离为单独的组件，是因为 Form 需要使用客户端组件，本着尽可能减少客户端组件范围的原则，所以抽离成了单独的组件。

新建 `app/todo/form.js`，代码如下：

```jsx
'use client'

import { useRef } from 'react';
import toast from 'react-hot-toast';
import { addTodo } from './actions';
import { TodoSchema } from "./types";

export default function Form() {

  const formRef = useRef(null);

  const clientAction = async (formData) => {
    const submitTodo = {
      content: formData.get('todo')
    }

    // 客户端校验
    const result = TodoSchema.safeParse(submitTodo)
    if (!result.success) {
      toast.error(result.error.issues[0].message)
      return;
    }

    // 提交给服务端
    const response = await addTodo(result.data)
    if (response?.error) {
      toast.error(response.error)
      return;
    }

    formRef.current?.reset()
  }

  return (
    <form action={clientAction} className="mb-2" ref={formRef}>
      <label htmlFor="todo" className="block text-sm font-medium leading-6 text-gray-900">
        待办事项:
      </label>
      <input
        id="todo"
        name="todo"
        type="text"
        required
        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2"
        />
      <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        添加
      </button>
    </form>
  );
}
```

这段代码并不复杂，唯独要注意一点，那就是我们提交给服务端的数据，并不是我们自己构建的 `submitTodo`，而是校验后的 `result.data`，这是不一样的。举个例子：

```javascript
// Schema 只定义了 content 字段
const TodoSchema = z.object({
  content: z.string()
})

// 校验的时候多提交了字段
const submitTodo = {
  content: formData.get('todo'),
  other: '111'
}

// 数据校验成功
const result = TodoSchema.safeParse(submitTodo)
// 但 result.data 只会包含 content 字段
console.log(result.data) // -> {content: '123'}
```

再举个例子：

```javascript
// coerce 是为了进行强制转换原始类型
const TodoSchema = z.object({
  content: z.coerce.string()
})

// 数据是数字类型
const submitTodo = {
  content: 123
}

// 数据校验成功
const result = TodoSchema.safeParse(submitTodo)
// content 字段会转为字符串类型
console.log(result.data) // -> {content: '123'}
```

简而言之，作为习惯，尽可能使用校验后的数据。

新建 `app/todo/actions.js`，代码如下：

```javascript
"use server"

import { revalidatePath } from "next/cache";
import { TodoSchema } from "./types";

const todos = [];

export async function addTodo(todo) {

  // 服务端校验
  const result = TodoSchema.safeParse(todo)
 
  if (!result.success) {
    return {
      error: result.error.issues[0].message
    }
  }

  // 模拟数据库操作
  todos.push(result.data.content)

  revalidatePath("/todos")
}

export async function findTodos() {
  return todos
}
```

新建 `app/todo/types.ts`，代码如下：

```typescript
import { z } from 'zod';

export const TodoSchema = z.object({
  content: z.string().trim().min(2, { message: '最少需要输入 2 个字符'}).max(10, { message: '最多输入 10 个字符'})
})

export type Todo = z.infer<typeof TodoSchema>
```

此时浏览器效果如下：

![18.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de12038a9f1e47d6b75893e164166a2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=790\&h=389\&s=175545\&e=gif\&f=84\&b=fefefe)
注意：当数据为空进行提交的时候，走的是浏览器本身的非空校验，当数据不为空提交的时候，才是 Zod 的数据校验。

至此我们就完成了一个前后端校验的例子，当然这个例子还可以做的更完善一点，比如：

1.  将 actions.js、type.ts 抽离到单独的文件夹下，使用 alias 地址引入
2.  使用 useFormStatus 添加按钮状态
3.  使用 useOptimistic 实现[乐观更新](https://juejin.cn/post/7347957960884355113)
