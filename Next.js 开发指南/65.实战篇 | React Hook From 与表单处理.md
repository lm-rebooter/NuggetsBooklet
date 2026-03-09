## 前言

React Hook Form （40.1k Star）是一个老牌的用于 React 应用程序的表单验证和状态管理库。它提供了一组钩子，可以轻松创建和管理表单，而无需编写大量样板代码。

之所以讲 React Hook Form，是因为 **Shadcn UI + React Hook Form + Zod** 是 Next.js 项目处理表单提交常见的一套“组合拳”。

为了循序渐进掌握这套组合拳，我们先从传统的表单实现开始讲起。

## 传统表单

运行：

```javascript
npx create-next-app@latest
```

至少要选择 Tailwind CSS。项目创建后，运行 `npm run dev`进入开发模式。

新建 `app/form1/page.js`，代码如下：

```jsx
"use client";

import { useState } from "react";

export default function FormWithoutReactHookForm() {
  // 处理输入框字段
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // 处理提交中状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 处理错误
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    //  1. 阻止默认行为
    e.preventDefault();

    // 2. 处理提交中状态
    setIsSubmitting(true);

    // 3. 前端校验
    if (password !== confirmPassword) {
      setErrors(["两次密码不一致"]);
      setIsSubmitting(false);
      return;
    }

    // 4. 模拟提交数据
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 5. 重置表单
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-2 p-4">
      {errors.length > 0 && (
        <ul>
          {errors.map((error) => (
            <li
              key={error}
              className="bg-red-100 text-red-500 px-4 py-2 rounded"
            >
              {error}
            </li>
          ))}
        </ul>
      )}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        placeholder="Email"
        className="px-4 py-2 rounded shadow-sm ring-1 ring-inset ring-gray-300"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded shadow-sm ring-1 ring-inset ring-gray-300"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded shadow-sm ring-1 ring-inset ring-gray-300"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-indigo-600 disabled:bg-gray-500 py-2 rounded text-white"
      >
        注册
      </button>
    </form>
  );
}
```

浏览器效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10fd9736cff242d3822b48774023376d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1684\&h=892\&s=81336\&e=png\&b=fdfafa)

这样的代码想必大家都写过，其实有很多“问题”：

我们需要声明多个状态用于将输入框改为受控组件，需要手动处理提交态，在出现错误的时候，还要再修改提交态，需要手动处理错误和展示错误信息，每次表单提交都要先阻止默认行为，再进行前端校验，再提交数据，最后重置表单……再看每个 input 元素，都要设置 value 和 onChange……

这就是最一开始说的“样板代码”，每次写表单都要重复写这些代码。

## React Hook Form

React Hook Form 可以有效的解决样板代码问题，我们使用 React Hook Form 再写一版。

新建 `app/form2/page.js`，代码如下：

```jsx
"use client";

import { useForm } from "react-hook-form";

export default function FormWithReactHookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const onSubmit = async (data) => {
    // 1. 模拟提交数据
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 2. 重置表单
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 p-4">
      <input
        {...register("email", {
          required: "请填写 Email",
        })}
        type="email"
        placeholder="邮箱"
        className="px-4 py-2 rounded shadow-sm ring-1 ring-inset ring-gray-300"
        />
      {errors.email && (
      <p className="text-red-500">{`${errors.email.message}`}</p>
    )}

      <input
        {...register("password", {
          required: "请填写密码",
          minLength: {
            value: 5,
            message: "密码最少设置 5 个字符",
          },
        })}
        type="password"
        placeholder="密码"
        className="px-4 py-2 rounded shadow-sm ring-1 ring-inset ring-gray-300"
        />
      {errors.password && (
      <p className="text-red-500">{`${errors.password.message}`}</p>
    )}

      <input
        {...register("confirmPassword", {
          required: "请填写确认密码",
          validate: (value) =>
            value === getValues("password") || "密码必须一致",
        })}
        type="password"
        placeholder="确认密码"
        className="px-4 py-2 rounded shadow-sm ring-1 ring-inset ring-gray-300"
        />
      {errors.confirmPassword && (
      <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
    )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-indigo-600 disabled:bg-gray-500 py-2 rounded text-white"
        >
        注册
      </button>
    </form>
  );
}
```

虽然代码的总行数没有减少多少，但组件无须声明多个状态、表单处理的代码也精简了不少。此时浏览器效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/634e30260a654f089894d977344e0ce9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1686\&h=952\&s=97614\&e=png\&b=fefefe)

回看这段代码，其实最核心的是这段：

```javascript
const { register, handleSubmit, formState: { errors, isSubmitting }, reset, getValues } = useForm();
```

其中：

1.  register 函数用于绑定输入框，第一个参数声明 name 字段，它的第二个参数用于自定义验证逻辑和错误信息。使用 `...register()` 相当于：

```javascript
const { onChange, onBlur, name, ref } = register('firstName'); 
        
<input 
  onChange={onChange}
  onBlur={onBlur}
  name={name}
  ref={ref}
/>
    
// 相当于
<input {...register('firstName')} />
```

2.  handleSubmit 用于在表单验证成功后，接收表单数据，它需要你手动传入一个表单处理函数作为参数：

```javascript
// 异步提交表单
const onSubmit = async () => {
  // handleSubmit 不会处理错误，所以错误需要自己处理
  try {
    // await fetch()
  } catch (e) {
    // 处理错误
  }
};


<form onSubmit={handleSubmit(onSubmit)} />
```

3.  formState 对象包含了整个表单状态的信息，我们从中获取了 errors 错误信息和 isSubmitting 提交中状态，其实还有很多其他信息字段，查看 [formstate 介绍](https://react-hook-form.com/docs/useform/formstate)
4.  reset 函数，顾名思义，用于重置整个表单状态
5.  getValues 函数，顾名思义，用于读取表单值

其实返回的对象远不止这些字段，还有监控指定输入框的 watch、手动设置错误的 setErrors、设置焦点的 setFocus、手动触发验证的 trigger 等等，具体查看[ useForm 介绍](https://react-hook-form.com/docs/useform)。

现在比较之前传统表单的实现代码，我们不需要再声明多个 useState，而是从 useForm 中获取了所有需要的函数和字段，表单处理代码也更加简洁。

## RHF + Zod

那么问题来了，React Hook Form 都这么好用了，我为什么还要用 Zod 呢？

主要的原因在于 React Hook Form 的校验只能用在客户端，实际开发中，前后端往往需要相同的验证，使用 Zod 可创建一个复用的 Schema 用于前后端验证。

为了让 React Hook Form 和 Zod 兼容，需要安装依赖项 [@hookform/resolvers](https://github.com/react-hook-form/resolvers#quickstart)：

```bash
npm install @hookform/resolvers
```

这是 React Hook Form 提供的解析器，可以让你使用各种验证库，如 [Yup](https://github.com/jquense/yup)、[Zod](https://github.com/vriad/zod)、[Joi](https://github.com/hapijs/joi)、[Vest](https://github.com/ealush/vest)、[Ajv](https://github.com/ajv-validator/ajv) 等。

新建 `app/form3/page.js`，代码如下：

```jsx
"use client";

import { signUpSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 p-4">
      <input
        {...register("email")}
        type="email"
        placeholder="邮箱"
        className="px-4 py-2 rounded shadow-sm ring-1 ring-inset ring-gray-300"
      />
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}

      <input
        {...register("password")}
        type="password"
        placeholder="密码"
        className="px-4 py-2 rounded shadow-sm ring-1 ring-inset ring-gray-300"
      />
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}

      <input
        {...register("confirmPassword")}
        type="password"
        placeholder="确认密码"
        className="px-4 py-2 rounded shadow-sm ring-1 ring-inset ring-gray-300"
      />
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}

      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded text-white"
      >
        注册
      </button>
    </form>
  );
}
```

新建 `lib/types.js`，代码如下：

```javascript
import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().min(1, { message: '请填写 Email' }).email({ message: "请填写正确的邮箱地址" }),
    password: z.string().min(1, { message: '请填写密码' }).min(5, "密码最少设置 5 个字符"),
    confirmPassword: z.string().min(1, { message: '请填写确认密码' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密码必须一致",
    path: ["confirmPassword"],
  });
```

注意：在这段代码中，我们为了实现字段非空验证，使用的是 `.min(1, {message: 'xxxx'})`，而非 Zod 原本的 `z.string({ required_error: "xxxx"}) `，这是因为当提交数据的时候，React Hook Form 提交给 Zod 的并不是 undefined，而是空字符串，所以不会触发 Zod 原本的 `required_error` 校验，使用 `min()` 算是一个“曲线救国”的做法。

此时浏览器效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07a1169324824b78a3aaf576e2aaac42~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1694\&h=1060\&s=106586\&e=png\&b=ffffff)

## RHF + Zod + Server Actions

既然创建了 Schema 是为了前后端验证复用，那我们就再写写如何结合 Server Actions 实现一个完整的前后端验证。

新建 `app/form4/page.js`，代码如下：

```jsx
"use client";

import { signUpSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUp } from '@/actions/signUp';

export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = async (data) => {
    // data = {
    //   confirmPassword: "123",
    //   email: "675261143",
    //   password: "1234"
    // }

    // 处理服务端错误
    const response = await signUp(data)

    if (!response?.success) {
      // 显示服务端错误
      const errorKeys = Object.keys(response.message)
      errorKeys.forEach((key) => {
        setError(key, {
          type: "server",
          message: response.message[key],
        });
      })
      return;
    }

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 p-4">
      <input
        {...register("email")}
        type="email"
        placeholder="邮箱"
        className="px-4 py-2 rounded shadow-sm ring-1 ring-inset ring-gray-300"
        />
      {errors.email && (
      <p className="text-red-500">{`${errors.email.message}`}</p>
    )}

      <input
        {...register("password")}
        type="password"
        placeholder="密码"
        className="px-4 py-2 rounded shadow-sm ring-1 ring-inset ring-gray-300"
        />
      {errors.password && (
      <p className="text-red-500">{`${errors.password.message}`}</p>
    )}

      <input
        {...register("confirmPassword")}
        type="password"
        placeholder="确认密码"
        className="px-4 py-2 rounded shadow-sm ring-1 ring-inset ring-gray-300"
        />
      {errors.confirmPassword && (
      <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
    )}

      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded text-white"
        >
        注册
      </button>
    </form>
  );
}
```

新建 `actions/signUp.js`，代码如下：

```javascript
"use server"

import { signUpSchema } from "@/lib/types";

export async function signUp(data) {

  // 服务端校验
  const result = signUpSchema.safeParse(data)
 
  // 返回错误信息
  if (!result.success) {
    return {
      success: false,
      message: result.error.flatten().fieldErrors
    }
  }

  // 返回成功信息
  return {
    success: true,
    message: '注册成功'
  }
}
```

此时如果提交的数据有问题（可通过 Mock 数据来实现），浏览器显示如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f03ca3581a8d4f16925cad0a4ecaab84~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1696\&h=1042\&s=120389\&e=png\&b=ffffff)

注：上图中的错误其实是后端返回的，我们使用 setError 将错误信息显示在对应的输入框底部

## RHF + Zod + Server Actions + Shadcn UI

现在我们使用 Shadcn UI 实现这个界面。

初始化 Shadcn UI，选项随意选择：

```bash
npx shadcn-ui@latest init
```

添加组件代码：

```bash
npx shadcn-ui@latest add form button input
```

新建 `form5/page.js`，代码如下：

```jsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUpSchema } from "@/lib/types";
import { signUp } from '@/actions/signUp';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function ProfileForm() {
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
  })

  const onSubmit = async (data) => {

    // 处理服务端错误
    const response = await signUp(data)

    if (!response?.success) {
      // 显示服务端错误
      const errorKeys = Object.keys(response.message)
      errorKeys.forEach((key) => {
        form.setError(key, {
          type: "server",
          message: response.message[key],
        });
      })
      return;
    }

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>输入您的邮箱：</FormLabel>
              <FormControl>
                <Input placeholder="邮箱" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>输入您的密码：</FormLabel>
              <FormControl>
                <Input placeholder="密码" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>再次输入您的密码：</FormLabel>
              <FormControl>
                <Input placeholder="确认密码" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">注册</Button>
      </form>
    </Form>
  )
}
```

在这段代码中，要注意：

1.  调用 useForm 的时候，我们传入了 defaultValues，从某种角度来说，这是必须的，如果没有传，浏览器会有报错：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1bcbf6b37b34d75958d3f08cb383482~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1642\&h=216\&s=104619\&e=png\&b=f6ebeb)

2.  稍微复杂一点的是 Form 相关的组件，初次看的时候有些奇怪，写习惯就好了…… 组件的解释查看官方提供 Shadcn UI 的官方[接入教程](https://ui.shadcn.com/docs/components/form)，这其中 `<FormField />`用于构建受控表单字段，在 `<FormControl/>`下书写具体的表单字段，`<FormMessage />`会自动读取上下文中的错误信息用于展示。

浏览器效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/132ed0af51fa4de6a946257a60836b09~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1890\&h=1538\&s=159707\&e=png\&b=ffffff)

## 最后

哪怕不使用 Shadcn UI，React Hook Form 和 Zod 也是常见的搭配，堪称表单处理的利器。

## 参考链接

1.  <https://www.youtube.com/watch?v=u6PQ5xZAv7Q&ab_channel=ByteGrad>
2.  <https://github.com/ByteGrad/react-hook-form-with-zod-and-server-side/tree/main>
