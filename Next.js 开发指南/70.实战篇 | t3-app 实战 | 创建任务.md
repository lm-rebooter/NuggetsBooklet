## 前言

本篇我们接着上篇，实现清单中任务的创建和完成。

## 1. 功能：创建任务

### 1.1. 数据库 Schema 定义

我们首先定义任务相关的数据库字段，修改 `prisma/schema.prisma`，完整代码如下：

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

        tasks Task[]
    }

    model Task {
        id        Int       @id @default(autoincrement())
        content   String
        userId    String
        done      Boolean   @default(false)
        expiresAt DateTime?
        createdAt DateTime  @default(now())

        ListId Int
        list   List @relation(fields: [ListId], references: [id], onDelete: Cascade)
    }

因为修改了 Schema，所以运行以下命令同步数据库：

```bash
npx prisma migrate dev
```

### 1.2. 表单与前端数据校验

修改 `src/components/CheckListFooter.tsx`，添加代码如下：

```diff
"use client";
// ...
+ import CreateTaskModal from "@/components/CreateTaskModal";
// ...
export default function CheckListFooter({ checkList }: Props) {

  // ...
  return (
    <>
      <Separator />
      <footer className="flex h-[60px] w-full items-center justify-between text-sm text-white">
        <p>创建于 {createdAt.toLocaleDateString("zh-CN")}</p>
        <div>
-          <Button size={"icon"} variant={"ghost"}>
-            <CirclePlus />
-          </Button>
+          <CreateTaskModal checkList={checkList} />
          // ...
        </div>
      </footer>
    </>
  );
}
```

在这段代码中，我们将创建任务表单的代码放到  `<CreateTaskModal>` 组件中。

新建 `src/components/CreateTaskModal.tsx`，代码如下：

```tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, CirclePlus } from "lucide-react";

import { type List } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import {
  createTaskZodSchema,
  type createTaskZodSchemaType,
} from "@/schema/createTask";
import { zodResolver } from "@hookform/resolvers/zod";

import { ListMap } from "@/lib/const";
import { cn } from "@/lib/utils";

interface Props {
  checkList: List;
}

export default function CreateTaskModal({ checkList }: Props) {
  const { id, name, color } = checkList;

  const [open, setOpen] = useState(false);

  const form = useForm<createTaskZodSchemaType>({
    resolver: zodResolver(createTaskZodSchema),
    defaultValues: {
      content: "",
      todoId: id,
    },
  });

  const onOpenChange = (open: boolean) => {
    form.reset();
    setOpen(open);
  };

  const onSubmit = async (data: createTaskZodSchemaType) => {
    try {
      console.log(data);
      toast({
        title: "操作成功",
        description: "任务已经添加！",
      });
      onOpenChange(false);
    } catch (e) {
      toast({
        title: "操作失败",
        description: "任务创建失败，请稍后重试",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <CirclePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加任务</DialogTitle>
          <DialogDescription>任务将添加到 「{name}」 清单</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              className="flex flex-col space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>任务内容：</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>截止日期：</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {field.value &&
                              dayjs(field.value).format("YYYY/MM/DD")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            disabled={form.formState.isSubmitting}
            className={cn(
              "w-full text-white dark:text-white",
              ListMap.get(color),
            )}
            onClick={form.handleSubmit(onSubmit)}
          >
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

这段代码跟上节创建清单很像，我们使用 React Hook Form 和 Zod 做前端数据校验，当提交的数据通过校验的时候，使用 `toast()`提示信息。

因为需要处理时间，安装 `dayjs`：

```javascript
npm i dayjs 
```

进行数据校验需要先定义 Zod Schema，新建 `src/schema/createTask.ts`，代码如下：

```javascript
import { z } from "zod";

export const createTaskZodSchema = z.object({
  todoId: z.number().nonnegative(),
  content: z.string().min(1, {
    message: "请填写任务内容",
  }),
  expiresAt: z.date().optional(),
});

export type createTaskZodSchemaType = z.infer<typeof createTaskZodSchema>;
```

此时浏览器效果如下：

![t3-15.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40f8de8fd51b49e49c20c4eb4978db60~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1023\&h=641\&s=246755\&e=gif\&f=48\&b=2b2b2b)

此时我们已经完成了前台界面的展示，接下来实现具体的服务端逻辑。

### 1.3. 添加服务端逻辑

新建 `src/actions/task.ts`，代码如下：

```tsx
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  createTaskZodSchema,
  type createTaskZodSchemaType,
} from "@/schema/createTask";

export async function createTask(data: createTaskZodSchemaType) {
  const user = await currentUser();

  if (!user) {
    throw new Error("用户未登录，请先登录");
  }

  const result = createTaskZodSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: result.error.flatten().fieldErrors,
    };
  }

  const { content, expiresAt, todoId } = data;

  await prisma.task.create({
    data: {
      userId: user.id,
      content,
      expiresAt,
      list: {
        connect: {
          id: todoId,
        },
      },
    },
  });

  revalidatePath("/");
}
```

修改 `src/components/CreateTaskModal.tsx`，添加代码如下：

```diff
+ import { createTask } from "@/actions/task";

  const onSubmit = async (data: createTaskZodSchemaType) => {
    try {
-      console.log(data);
+      await createTask(data);
      toast({
        title: "操作成功",
        description: "任务已经添加！",
      });
      onOpenChange(false);
    } catch (e) {
      toast({
        title: "操作失败",
        description: "任务创建失败，请稍后重试",
        variant: "destructive",
      });
    }
  };
```

此时我们就完成了清单的创建，浏览器效果如下：

![t3-16.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3a52dad5e8e4af891931cbcd02b4ac3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880\&h=639\&s=323686\&e=gif\&f=84\&b=fefefe)

效果描述：我们可以在 prisma studio 中查看新增的数据。

## 2. 功能：展示任务

修改 `src/components/CheckLists.tsx`，完整代码如下：

```tsx
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { type Task, type List } from "@prisma/client";
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
import TaskItem from "@/components/TaskItem";

interface Props {
  checkList: List & {
    tasks: Task[];
  };
}

function CheckList({ checkList }: Props) {
  const { name, color, tasks } = checkList;

  return (
    <Card
      className={cn("w-full text-white sm:col-span-2", ListMap.get(color))}
      x-chunk="dashboard-05-chunk-0"
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 && <p>目前没有任务</p>}
        {tasks.length > 0 && (
          <div>
            {tasks.map((task) => {
              return <TaskItem key={task.id} task={task} />;
            })}
          </div>
        )}
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
    include: {
      tasks: true,
    },
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

新建 `src/components/TaskItem.tsx`，代码如下：

```tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";
import { type Task } from "@prisma/client";
import { cn } from "@/lib/utils";

function TaskItem({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={task.id.toString()}
        className="h-5 w-5 bg-white"
        checked={task.done}
        onCheckedChange={async (value) => {
          console.log(value);
        }}
        />
      <label
        htmlFor={task.id.toString()}
        className={cn(
          "flex flex-row items-center gap-2",
          task.done && "line-through",
        )}
        >
        {task.content}
        {task.expiresAt && (
          <p
            className={cn("text-xs text-white", {
              "text-red-800": Date.now() - task.expiresAt.getTime() > 0,
            })}
            >
            {dayjs(task.expiresAt).format("DD/MM/YYYY")}
          </p>
        )}
      </label>
    </div>
  );
}

export default TaskItem;
```

浏览器效果如下：

![t3-17.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0208b8af553443a589fd4fac57053bb2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880\&h=639\&s=191579\&e=gif\&f=50\&b=fefefe)

## 3. 功能：完成任务

修改 `src/actions/task.ts`，添加代码如下：

```typescript
// ...

export async function setTaskDone(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("用户未登录，请先登录");
  }

  await prisma.task.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      done: true,
    },
  });

  revalidatePath("/");
}
```

修改 `src/components/TaskItem.tsx`，添加代码如下：

```tsx
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";
import { type Task } from "@prisma/client";
import { cn } from "@/lib/utils";
import { setTaskDone } from "@/actions/task";

function TaskItem({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={task.id.toString()}
        className="h-5 w-5 bg-white"
        checked={task.done}
        onCheckedChange={async () => {
          await setTaskDone(task.id);
        }}
        />
      <label
        htmlFor={task.id.toString()}
        className={cn(
          "flex flex-row items-center gap-2",
          task.done && "line-through",
        )}
        >
        {task.content}
        {task.expiresAt && (
          <p
            className={cn("text-xs text-white", {
              "text-red-800": Date.now() - task.expiresAt.getTime() > 0,
            })}
            >
            {dayjs(task.expiresAt).format("DD/MM/YYYY")}
          </p>
        )}
      </label>
    </div>
  );
}

export default TaskItem;
```

浏览器效果如下：

![t3-18.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/435a62129996429c9f188e61d77b29f2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=877\&h=656\&s=41843\&e=gif\&f=26\&b=e14f62)

## 4. 修复：构建错误

假设项目开发完毕，准备上线。运行：

```bash
npm run build
```

你会发现会有一些 TypeScipt 错误出现。主要集中在 Shadcn UI 的组件代码中。这是 Shadcn UI 和 t3-app 代码风格不一样导致，暂时两边都没有解决。

为了避免这些错误导致构建失败，你可以：

1.  删除 `components/ui/chart.tsx` 和 `components/ui/input-otp.tsx`这两个没有用到的组件
2.  修改 `next-t3-todo/.eslintrc.cjs`，添加规则如下：

```javascript
/** @type {import("eslint").Linter.Config} */
const config = {
  // ...
  rules: {
    // ...
    "@typescript-eslint/no-empty-interface": [
      "error",
      { allowSingleExtends: true },
    ],
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
  },
};
module.exports = config;

```

此时应该可以通过 TypeScript 校验。

当然你也可以禁用某些规则、或者设置 `next.config.js` 的配置项，即使有错误也继续构建。

## 最后

就我个人感觉，当前 Next.js 最流行的技术选型就是这套了：

1. Next.js App Router + Server Actions
2. Typescript
3. Tailwind CSS
4. Prisma / Drizzle
5. Zod + Shadcn UI + React Hook Form
6. Clerk / Supabase / Next-Auth

熟悉这套技术选型可以更高效的帮助我们开发 Next.js 项目。