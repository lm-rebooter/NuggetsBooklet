## 前言

本篇我们将实现清单的增删查功能。

那就让我们接着开始吧！

## 1. 功能：创建清单

### 实现前端校验（RHF + Zod）

表单处理使用 React Hook Form 和 Zod。安装依赖项：

```bash
npm i react-hook-form zod @hookform/resolvers
```

新建 `src/lib/const.ts`，代码如下：

```typescript
export const ListMap = new Map([
  ["rose", ["bg-rose-500", "玫瑰"]],
  ["amber", ["bg-amber-500", "琥珀"]],
  ["orange", ["bg-orange-500", "橘橙"]],
  ["green", ["bg-lime-500", "草绿"]],
  ["cyan", ["bg-sky-500", "天蓝"]],
  ["indigo", ["bg-indigo-500", "葡紫"]],
  ["pink", ["bg-pink-500", "粉粉"]],
  ["black", ["bg-black", "黑色"]],
]);
```

在这段代码中，使用 Map 建立颜色与色值、中文名的映射关系。

新建 `src/schema/createList.ts`，代码如下：

```typescript
import { z } from "zod";
import { ListMap } from "@/lib/const";

export const createListZodSchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空",
  }),
  color: z
    .string()
    .min(1, {
      message: "请选择一个颜色",
    })
    .refine((color) => [...ListMap.keys()].includes(color)),
});

export type createListZodSchemaType = z.infer<typeof createListZodSchema>;
```

修改 `src/components/CreateListModal.tsx`，完整代码如下：

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createListZodSchema,
  type createListZodSchemaType,
} from "@/schema/createList";
import { cn } from "@/lib/utils";
import { ListMap } from "@/lib/const";
import { useState } from "react";

export default function CreateListModal() {
  const form = useForm({
    resolver: zodResolver(createListZodSchema),
    defaultValues: {
      name: "",
      color: "",
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = async (data: createListZodSchemaType) => {
    console.log(data);
    setOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    form.reset();
    setOpen(open);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button>添加清单</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>添加清单</SheetTitle>
          <SheetDescription>
            清单是任务的集合，比如“工作”、“生活”、“副业”
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>设置清单的名称：</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：工作" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>选择清单的背景色：</FormLabel>
                  <FormControl>
                    <Select onValueChange={(color) => field.onChange(color)}>
                      <SelectTrigger
                        className={cn("w-[180px]", ListMap.get(field.value), {
                          "text-white": !!field.value,
                        })}
                      >
                        <SelectValue placeholder="颜色" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {[...ListMap.entries()].map(
                            ([color, [className, name]]) => {
                              return (
                                <SelectItem
                                  key={color}
                                  value={color}
                                  className={cn(
                                    "my-1 w-full rounded-md text-white ring-black focus:font-bold focus:text-white focus:ring-2 dark:ring-white",
                                    className,
                                    `focus:${className}`,
                                  )}
                                >
                                  {name}
                                </SelectItem>
                              );
                            },
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            创建
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

在这段代码中 ，有几点需要注意：

1.  我们使用 React Hook Form 的 useForm 和 zodResolver 完成了前端数据校验
2.  Shadcn UI 虽然提供了 `<SheetTrigger>` 和 `<SheetClose>`用于控制 Sheet 的打开和关闭，但是当用户提交数据，验证通过的时候才能关闭 Sheet，所以需要改为手动控制：

```javascript
const [open, setOpen] = useState(false);

return <Sheet open={open} onOpenChange={setOpen} />
```

> 注意：这些属性虽然在 Sheet 的[文档](https://ui.shadcn.com/docs/components/sheet)里找不到说明，但可以找到对应的 Radix 组件[文档](https://www.radix-ui.com/primitives/docs/components/dialog)链接。

此时浏览器效果如下：

![t3-8.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02ec7e44db0d45048de37b19f03b23c1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1001\&h=610\&s=230694\&e=gif\&f=53\&b=fefefe)

效果描述：当点击“添加清单”按钮的时候，右侧弹出创建清单表单。当提交的时候，触发前端校验，数据校验通过后，浏览器命令行中打印了提交的数据，清单表单关闭。

### 实现服务端逻辑（Server Actions）

新建 `src/actions/list.ts`，代码如下：

```tsx
"use server";

import {
  createListZodSchema,
  type createListZodSchemaType,
} from "@/schema/createList";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createList(data: createListZodSchemaType) {
  const user = await currentUser();

  if (!user) {
    throw new Error("用户未登录，请先登录");
  }

  const result = createListZodSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: result.error.flatten().fieldErrors,
    };
  }

  // Todo: 数据库处理
  console.log(data);

  revalidatePath("/");

  return {
    success: true,
    message: "清单创建成功",
  };
}
```

修改 `src/components/CreateListModal.tsx`，代码如下：

```tsx
"use client";

// ...
import { createList } from "@/actions/list";

export default function CreateListModal() {
  // ...

  const onSubmit = async (data: createListZodSchemaType) => {
    try {
      await createList(data);
      onOpenChange(false);
      console.log("success");
    } catch (e) {
      console.log(e);
    }
  };

  // ...

  return (
  // ...
  );
}
```

浏览器效果如下：

![t3-8.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/122b0e3183434b369de61321fac4458a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1001\&h=610\&s=281531\&e=gif\&f=59\&b=fdfdfd)

效果描述：当提交数据的时候，会触发请求，成功后，浏览器控制台打印了 success

### 添加 toast 效果（Shadcn UI）

当创建的时候，无论成功还是失败，都应该有一个消息提示，所以我们引入 Shadcn UI 的 `<Toaster>` 组件。

修改 `src/app/layout.tsx`，添加代码如下：

```tsx
// ...
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const localization = merge(zhCN, zhCNlocales);
  return (
    <ClerkProvider localization={localization}>
      <html
        lang="zh-CN"
        className={`${GeistSans.variable}`}
        suppressHydrationWarning
        >
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
            <Header />
            <div className="flex w-full flex-col items-center">{children}</div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

```

修改 `src/components/CreateListModal.tsx`，代码如下：

```tsx
"use client";

// ...
import { toast } from "@/components/ui/use-toast";

export default function CreateListModal() {
  // ...

  const onSubmit = async (data: createListZodSchemaType) => {
    try {
      await createList(data);
      onOpenChange(false);
      toast({
        title: "恭喜您",
        description: "清单创建成功！",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "哎呦",
        description: "清单创建失败",
        variant: "destructive",
      });
    }
  };

  // ...

  return (
  // ...
  );
}
```

此时浏览器效果如下：

![t3-10.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d9ae0e5970b4e3c934bfcd68d9f5cd4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1072\&h=583\&s=194100\&e=gif\&f=47\&b=fefefe)

效果描述：当创建成功的时候，会有一个 Toast 提示。

但是吧：

1.  Toast 从下面弹出，如果是从上面弹出就好了……
2.  Toast 停留的时间太久了，如果时间短点就好了……

这就要说到 Shadcn UI 的好处了，那就是可以直接改组件源码。

修改 `src/components/ui/toast.tsx` 第 19 行左右位置的样式代码，修改代码如下：

```diff
- fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:right-0 sm:flex-col md:max-w-[420px]
+ fixed top-0 left-[50%] z-[100] flex max-h-screen w-full translate-x-[-50%] flex-col-reverse p-4 sm:right-0 sm:flex-col md:max-w-[420px]
```

修改 `src/components/ui/toaster.tsx`，添加代码如下：

```tsx
// ...

export function Toaster() {
  // ...

  return (
    <ToastProvider duration={1000}>
      // ...
    </ToastProvider>
  );
}

```

此时浏览器效果如下：

![t3-11.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78171537a7fe4d30b4845f6bbc5a7ee8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1072\&h=583\&s=220477\&e=gif\&f=38\&b=fefefe)

### Prisma 与数据库操作（Prisma）

新建 `src/lib/prisma.ts`，代码如下：

```javascript
// 代码来源于官方文档：https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
```

修改 `prisma/schema.prisma`，代码如下：

    // This is your Prisma schema file,
    // learn more about it in the docs: https://pris.ly/d/prisma-schema

    generator client {
        provider = "prisma-client-js"
    }

    datasource db {
        provider = "mysql"
        url      = env("DATABASE_URL")
    }

    model List {
        id        Int      @id @default(autoincrement())
        name      String
        userId    String
        color     String
        createdAt DateTime @default(now())
        updatedAt DateTime @updatedAt
    }

因为修改了 Schema，所以运行：

```bash
npx prisma migrate dev
```

修改 `src/actions/list.ts`，完整代码如下：

```javascript
"use server";

import {
  createListZodSchema,
  type createListZodSchemaType,
} from "@/schema/createList";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createList(data: createListZodSchemaType) {
  const user = await currentUser();

  if (!user) {
    throw new Error("用户未登录，请先登录");
  }

  const result = createListZodSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: result.error.flatten().fieldErrors,
    };
  }

  await prisma.list.create({
    data: {
      userId: user.id,
      color: data.color,
      name: data.name,
    },
  });

  revalidatePath("/");

  return {
    success: true,
    message: "清单创建成功",
  };
}
```

为了检查是否真的写入数据库，运行：

```bash
npx prisma studio
```

浏览器效果如下：

![t3-12.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bca8556744954f1f8b67580225f00b6b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1072\&h=605\&s=365641\&e=gif\&f=75\&b=fefefe)

效果描述：清单创建成功后，数据库的数据也确实发生了更新

## 2. 功能：展示清单

修改 `src/app/page.tsx`，添加代码如下：

```tsx
// ...
import { CheckLists } from "@/components/CheckLists";

// ...

export default function HomePage() {
  return (
    <main className="flex w-full flex-col items-center px-4">
      <Suspense fallback={<WelcomeFallback />}>
        <Welcome />
      </Suspense>
      <Suspense fallback={<WelcomeFallback />}>
        <CheckLists />
      </Suspense>
    </main>
  );
}

```

新建 `src/components/CheckLists.tsx`，代码如下：

```tsx
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { type List } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CheckListFooter from "@/components/CheckListFooter";

import { cn } from "@/lib/utils";
import { ListMap } from "@/lib/const";

interface Props {
  checkList: List;
}

function CheckList({ checkList }: Props) {
  const { name, color } = checkList;

  return (
    <Card
      className={cn("w-full text-white sm:col-span-2", ListMap.get(color))}
      x-chunk="dashboard-05-chunk-0"
      >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>任务列表</p>
      </CardContent>
      <CardFooter className="flex-col pb-2">
        <CheckListFooter checkList={checkList} />
      </CardFooter>
    </Card>
  );
}

export async function CheckLists() {
  const user = await currentUser();
  const checkLists = await prisma.list.findMany({
    where: {
      userId: user?.id,
    },
  });

  if (checkLists.length === 0) {
    return <div className="mt-4">尚未创建清单，赶紧创建一个吧!</div>;
  }

  return (
    <>
      <div className="mt-6 flex w-full flex-col gap-4">
        {checkLists.map((checkList) => (
      <CheckList key={checkList.id} checkList={checkList} />
    ))}
      </div>
    </>
  );
}
```

新建 `src/components/CheckListFooter.tsx`，代码如下：

```tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2, CirclePlus } from "lucide-react";
import { type List } from "@prisma/client";

interface Props {
  checkList: List;
}

export default function CheckListFooter({ checkList }: Props) {
  const { createdAt } = checkList;

  const deleteCheckList = async () => {
    console.log(1);
  };

  return (
    <>
      <Separator />
      <footer className="flex h-[60px] w-full items-center justify-between text-sm text-white">
        <p>创建于 {createdAt.toLocaleDateString("zh-CN")}</p>
        <div>
          <Button size={"icon"} variant={"ghost"}>
            <CirclePlus />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
                <AlertDialogDescription>该操作无法撤回</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={deleteCheckList}>
                  确定
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </footer>
    </>
  );
}

```

浏览器效果如下：

![t3-13.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c4aa8d663d54db2975bd40eb450a48f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1291\&h=731\&s=326345\&e=gif\&f=67\&b=fefefe)

效果描述：当创建清单后，首页会刷新出新建的任务列表，点击删除按钮，会出现删除弹窗。

## 3. 功能：删除清单

修改 `src/actions/list.ts`，添加代码如下：

```typescript
export async function deleteList(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("用户未登录，请先登录");
  }

  await prisma.list.delete({
    where: {
      id: id,
      userId: user.id,
    },
  });

  revalidatePath("/");
}
```

修改 `src/components/CheckListFooter.tsx`，完整代码如下：

```tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2, CirclePlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { type List } from "@prisma/client";
import { deleteList } from "@/actions/list";

interface Props {
  checkList: List;
}

export default function CheckListFooter({ checkList }: Props) {
  const { id, createdAt } = checkList;

  const deleteCheckList = async () => {
    try {
      await deleteList(id);
      toast({
        title: "操作成功",
        description: "清单已经删除",
      });
    } catch (e) {
      toast({
        title: "操作失败",
        description: "清单删除失败，请稍后重试",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Separator />
      <footer className="flex h-[60px] w-full items-center justify-between text-sm text-white">
        <p>创建于 {createdAt.toLocaleDateString("zh-CN")}</p>
        <div>
          <Button size={"icon"} variant={"ghost"}>
            <CirclePlus />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
                <AlertDialogDescription>该操作无法撤回</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={deleteCheckList}>
                  确定
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </footer>
    </>
  );
}

```

浏览器效果如下：

![t3-13.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5ffe01f523848bcac41a084fe6b8688~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1291\&h=731\&s=326345\&e=gif\&f=67\&b=fefefe)

## 下一篇

> 1.  功能实现：t3-app 清单增删查
> 2.  源码地址：<https://github.com/mqyqingfeng/next-app-demo/tree/next-t3-todo-2>
> 3.  下载代码：`git clone -b next-t3-todo-2 git@github.com:mqyqingfeng/next-app-demo.git`

目前我们已经实现了清单的增删查，接下来我们实现清单中的具体任务的增改功能。
