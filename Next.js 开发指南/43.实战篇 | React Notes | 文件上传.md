## 前言

本篇我们来实现文件上传功能。

为此我们实现这样一个需求：点击添加按钮，上传本地的 `.md`文件，读取文件内容，新建一条笔记。效果如下：

![ReactNotes-上传文件 3.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3726dd4d9cf74407afc7b5f9d61facf7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074\&h=782\&s=306987\&e=gif\&f=25\&b=f3f5f9)

## 温故而知新

我们先回忆下文件上传功能，通常是用 `<input type="file">`，示例代码如下：

```html
<form method="post" enctype="multipart/form-data">
  <div>
    <label for="file">选择要上传的文件</label>
    <input type="file" id="file" name="file" multiple accept="image/*,.pdf" />
  </div>
  <div>
    <button>提交</button>
  </div>
</form>

```

其中 `<input type="file" >` 如果有附加属性 `multiple`，表示允许用户选择多个文件。如果有附加属性 `accept`表示支持的文件类型，这个例子中表示的是支持图片格式和 pdf 文件。

其中 `<form>` 添加了属性 `enctype` 用于指明提交表单的内容类型，可选的值有 3 个：

1.  `application/x-www-form-urlencoded`：所有字符在发送前都会被编码。空格会转换为“+”符号，特殊字符会转换为 ASCII 十六进制值，适用于普通的表单数据
2.  `multipart/form-data`：不对字符编码。如果表单中有上传文件，使用这个
3.  `text/plain`：发送数据时完全不进行任何编码。用的很少

因为 `<input type="file">` 默认的样式无法改变，通常会使用 `label` 标签关联，隐藏 input 标签：

```jsx
<form method="post" enctype="multipart/form-data">
  <div>
    <label for="file">Import .md File</label>
    <input type="file" id="file" name="file" multiple style={{ position : "absolute", clip: "rect(0 0 0 0)" }} />
  </div>
  <div>
    <button>提交</button>
  </div>
</form>
```

## 第一种方式：API 接口

现在让我们开始写吧！简单起见，我们的代码使用 `day5-2`分支的代码，也就是没有实现国际化之前的项目。

第一种实现方式是使用 API 接口，在客户端提交文件的时候，调用后端的接口进行处理。

实现提交文件功能，你需要监听 `<input type="file">` 的 `onChange` 事件或者是 `<button>` 的 `onClick` 事件，又或者是 `<form>` 的 `onSubmit` 事件，无论哪种，反正你需要写成客户端组件。

上传文件的入口，我们就写在笔记列表的下方：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36e1ca785bcc42c7b77c25128feeff52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1974\&h=1300\&s=173634\&e=png\&b=f5f6f9)

新建 `components/SidebarImport.js`，代码如下：

```javascript
'use client'

import React, { Suspense } from 'react'

export default function SidebarImport() {
  return (
    <form method="post" enctype="multipart/form-data">
      <div style={{ textAlign: "center" }}>
        <label for="file" style={{ cursor: 'pointer' }}>Import .md File</label>
        <input type="file" id="file" name="file" multiple style={{ position : "absolute", clip: "rect(0 0 0 0)" }} />
      </div>
    </form>
  )
}

```

在 `components/Sidebar.js`中导入该组件：

```javascript
// ...
import SidebarImport from '@/components/SidebarImport';

export default function Sidebar() {
	// ...
  return (
    <>
      <section className="col sidebar">
      	// ...
        <nav>
          <Suspense fallback={<NoteListSkeleton />}>
            <SidebarNoteList />
          </Suspense>
        </nav>
        <SidebarImport />
      </section>
    </>
  )
}

```

此时点击 `Import .md File` 已经能够正常调起文件选择框：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1eb8aaa777864d03b59c6671a6400937~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1850\&h=1308\&s=427217\&e=png\&b=1f2123)

现在让我们来完善效果吧！

修改 `components/SidebarImport.js`，代码如下：

```javascript
'use client'

import React, { Suspense } from 'react'
import { useRouter } from 'next/navigation'

export default function SidebarImport() {
  const router = useRouter()

  const onChange = async (e) => {
    const fileInput = e.target;

    if (!fileInput.files || fileInput.files.length === 0) {
      console.warn("files list is empty");
      return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("something went wrong");
        return;
      }

      const data = await response.json();
      router.push(`/note/${data.uid}`)

    } catch (error) {
      console.error("something went wrong");
    }

    // 重置 file input
    e.target.type = "text";
    e.target.type = "file";
  };


  return (
    <div style={{ textAlign: "center" }}>
      <label htmlFor="file" style={{ cursor: 'pointer' }}>Import .md File</label>
      <input type="file" id="file" name="file" style={{ position : "absolute", clip: "rect(0 0 0 0)" }} onChange={ onChange } accept=".md" />
    </div>
  )
}
```

在这段代码中，我们并没有用到 `<form>` 标签，而是直接直接监听了 `<input type="file">` 的 `onChange` 事件。当触发 onChange 事件的时候，我们构建了一个 [FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData) 对象，将 [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 对象添加进去。然后调用 `/api/upload`接口，将 formData 作为请求体传入。当数据成功返回时，跳转到生成的笔记地址。

这里的跳转我们用的是 [useRouter](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-58)。 [redirect](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-44) 只能用在服务端组件、路由处理程序、Server Actions。客户端手动跳转使用 [useRouter](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-58)。

新建 `app/api/upload/route.js`，代码如下：

```javascript
import { stat, mkdir, writeFile } from 'fs/promises'
import { join } from "path";
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache';
import mime from "mime";
import dayjs from 'dayjs';
import { addNote } from '@/lib/redis';

export async function POST(request) {

  // 获取 formData
  const formData = await request.formData()
  const file = formData.get('file')

  // 空值判断
  if (!file) {
    return NextResponse.json(
      { error: "File is required." },
      { status: 400 }
    );
  }

  // 写入文件
  const buffer = Buffer.from(await file.arrayBuffer());
  const relativeUploadDir = `/uploads/${dayjs().format("YY-MM-DD")}`;
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(e)
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  }

  try {
    // 写入文件
    const uniqueSuffix = `${Math.random().toString(36).slice(-6)}`;
    const filename = file.name.replace(/\.[^/.]+$/, "")
    const uniqueFilename = `${filename}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
    await writeFile(`${uploadDir}/${uniqueFilename}`, buffer);

    // 调用接口，写入数据库
    const res = await addNote(JSON.stringify({
      title: filename,
      content: buffer.toString('utf-8')
    }))

    // 清除缓存
    revalidatePath('/', 'layout')

    return NextResponse.json({ fileUrl: `${relativeUploadDir}/${uniqueFilename}`, uid: res });
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
```

在这段代码中，我们使用了 [mime](https://www.npmjs.com/package/mime) 这个库，用于获取 MIME 类型信息。所谓 MIME (Multipurpose Internet Mail Extensions) 是描述消息内容类型的标准，用来表示文档、文件或字节流的性质和格式，也就是我们常见的 `text/plain`、`image/jpeg`等。在这里我们是用它获取文件扩展名。别忘了安装这个库：

```javascript
npm i mime
```

我们通过 `await request.formData()`获取了提交的 `formData`。获取其中的 `File` 对象后，我们主要做了两件事情，一是将文件写入到 `public` 目录下，二是根据文件信息创建了笔记。最终接口返回文件地址和笔记 id。

为了方便写入，我们将其转为 Buffer 形式：`Buffer.from(await file.arrayBuffer())`，并通过 `writeFile` 写入文件。为了防止文件重复，我们根据日期创建文件夹，并生成了随机字符添加到文件名中。

然后我们通过 `buffer.toString('utf-8')` 获取了文件内容，调用之前 `redis.js` 导出的 `addNote` 方法添加笔记内容，然后清除数据缓存，返回了文件地址和笔记 ID。

现在应该可以正常运行了：

![ReactNotes-上传文件 1.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83f3265e77f84784a192540006524336~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074\&h=782\&s=290182\&e=gif\&f=36\&b=f3f5f9)

虽然文件上传成功了，`public` 目录下也可以查看到这个文件，笔记也创建了，但是观察左侧的笔记列表，你会发现虽然页面跳转到对应的笔记，但是左侧的笔记列表并没有更新！

这是因为虽然我们在接口中使用了 `revalidatePath`，但是它并不能影响客户端本身的[路由缓存](https://juejin.cn/book/7307859898316881957/section/7309077169735958565#heading-18)。GitHub 上也有[讨论](https://github.com/vercel/next.js/discussions/54075)。还记得怎么清除路由缓存吗？

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dd688c7cc7c4672ad6893214f1cc348~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1552\&h=492\&s=134034\&e=png\&b=fffefe)

这里并不是在 Server Action 中，所以只能使用第二种方式，所以我们在 `router.push`后再加一句：

```javascript
router.push(`/note/${data.uid}`)
router.refresh()
```

当然也可以配合 `useTransition`使用：

```javascript
'use client'

import { useTransition } from 'react'

export default function SidebarImport() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition();

  const onChange = async (e) => {
      // ...
      startTransition(() => router.push(`/note/${data.uid}`));
      startTransition(() => router.refresh());
    	// ...
  };

  return (
    	// ...
  )
}
```

现在就左侧的列表就可以正常更新了：

![ReactNotes-上传文件 2.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa508ea7fb8e498da6f55612de2e6efb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074\&h=782\&s=340040\&e=gif\&f=28\&b=f3f5f9)

查看 `/api/upload` 接口的返回：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45dbe571ab7847c5ba193e829eb4e45d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1672\&h=702\&s=152298\&e=png\&b=282828)

因为我们将文件放在了 `public`下，所以直接访问 `http://localhost:3000/uploads/24-01-03/occaecati-4s2adp.md`即可查看文件内容：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3e6a3da9dcc488eaf44592073ff4b80~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1492\&h=510\&s=81079\&e=png\&b=181818)

在这个例子中，我们并没有用到这个 URL，如果在实际的开发中，你可以用这个 URL 展示缩略图等。

## 第二种方式：Server Actions

接下来我们用 Server Actions 重新实现这个需求，关于文件上传，官方也提供了[示例代码 server-actions-upload](https://github.com/vercel/next.js/tree/canary/examples/server-actions-upload) 可供参考。

一般使用 Server Actions 会用在 `<form>` 标签的 `action` 属性上，但这次我们是监听 `<input type="file">` 的 `onChange` 事件，所以我们就直接在 `onChange` 事件中调用 Server Actions，对应要使用客户端组件。

在 `components/Sidebar.js`中导入 `<SidebarImport>` 组件：

```javascript
// ...
import SidebarImport from '@/components/SidebarImport';

export default function Sidebar() {
	// ...
  return (
    <>
      <section className="col sidebar">
      	// ...
        <nav>
          <Suspense fallback={<NoteListSkeleton />}>
            <SidebarNoteList />
          </Suspense>
        </nav>
        <SidebarImport />
      </section>
    </>
  )
}

```

新建 `components/SidebarImport.js`，代码如下：

```javascript
'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { importNote } from '@/actions'

export default function SidebarImport() {
  const router = useRouter()

  const onChange = async (e) => {
    const fileInput = e.target;

    if (!fileInput.files || fileInput.files.length === 0) {
      console.warn("files list is empty");
      return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await importNote(formData);
      router.push(`/note/${data.uid}`)

    } catch (error) {
      console.error("something went wrong");
    }

    // 重置 file input
    e.target.type = "text";
    e.target.type = "file";
  };


  return (
    <div style={{ textAlign: "center" }}>
      <label htmlFor="file" style={{ cursor: 'pointer' }}>Import .md File</label>
      <input type="file" id="file" name="file" style={{ position : "absolute", clip: "rect(0 0 0 0)" }} onChange={ onChange } accept=".md" />
    </div>
  )
}
```

为方便导入，更新 `jsconfig.json`：

```javascript
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/actions": ["app/actions.js"],
      "@/*": ["/*"]
    }
  }
}
```

在 `app/actions.js`添加 `importNote`方法：

```javascript
'use server'

// ...
import { stat, mkdir, writeFile } from 'fs/promises'
import { join } from "path";
import mime from "mime";
import dayjs from 'dayjs';

// ...
export async function importNote(formData) {
  const file = formData.get('file')

  // 空值判断
  if (!file) {
    return { error: "File is required." };
  }

  // 写入文件
  const buffer = Buffer.from(await file.arrayBuffer());
  const relativeUploadDir = `/uploads/${dayjs().format("YY-MM-DD")}`;
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(e)
      return { error: "Something went wrong." }
    }
  }

  try {
    // 写入文件
    const uniqueSuffix = `${Math.random().toString(36).slice(-6)}`;
    const filename = file.name.replace(/\.[^/.]+$/, "")
    const uniqueFilename = `${filename}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
    await writeFile(`${uploadDir}/${uniqueFilename}`, buffer);

    // 调用接口，写入数据库
    const res = await addNote(JSON.stringify({
      title: filename,
      content: buffer.toString('utf-8')
    }))

    // 清除缓存
    revalidatePath('/', 'layout')

    return { fileUrl: `${relativeUploadDir}/${uniqueFilename}`, uid: res }
  } catch (e) {
    console.error(e)
    return { error: "Something went wrong." }
  }
}
```

此时页面跟第一种方式一样正常运行：

![ReactNotes-上传文件 3.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2a108c3c0ed4dfaa47ba39ebc87aa8a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074\&h=782\&s=306987\&e=gif\&f=25\&b=f3f5f9)

因为在  Server Actions 中调用 revalidatePath 会清除路由缓存，所以我们也不需要再调用 `router.refresh()`。

在这个例子中，我们是在 onChange 事件中调用的 Server Action，使用这种方式对应会丢失渐进式增强，也就是说如果禁用 JS，就无法正常提交了。

如果有提交按钮，写法上会略有改变，我们试着写一下：

修改 `components/SidebarImport.js`：

```jsx
'use client'

import { useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { importNote } from '@/actions'

function Submit() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Submitting' : 'Submit'}</button>
}

export default function SidebarImport() {
  const router = useRouter()
  const formRef = useRef(null)

  async function upload(formData) {

    const file = formData.get('file');
    if (!file) {
      console.warn("files list is empty");
      return;
    }

    try {
      const data = await importNote(formData);
      router.push(`/note/${data.uid}`)

    } catch (error) {
      console.error("something went wrong");
    }

    // 重置 file input
    formRef.current?.reset()
  };


  return (
    <form style={{ textAlign: "center" }} action={upload} ref={formRef}>
      <label htmlFor="file" style={{ cursor: 'pointer' }}>Import .md File</label>
      <input type="file" id="file" name="file" accept=".md" />
      <div><Submit /></div>
    </form>
  )
}
```

`actions.js`中的代码不用改，效果如下：

![ReactNotes-上传文件 4.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6f8c62bcd414d4893a41f2a404b613a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074\&h=782\&s=322492\&e=gif\&f=45\&b=f3f5f9)

## 总结

那么今天的内容就结束了，本篇主要是围绕上传文件功能，帮助大家熟悉如何处理表单中的文件数据以及如何写接口（route.js）和 Server Actions（actions.js）。在实际的开发中，上传文件往往会更复杂，比如缩略图、文件队列、进度条、大文件上传等，但也脱离不了这两种最基本的开发方式。

本篇的代码我已经上传到[代码仓库](https://github.com/mqyqingfeng/next-react-notes-demo/tree/main)的 Day 7 分支：

*   第一种方式 在 [day7](https://github.com/mqyqingfeng/next-react-notes-demo/tree/day7) 分支
*   第二种方式 在 [day7-1](https://github.com/mqyqingfeng/next-react-notes-demo/tree/day7-1) 分支
*   第二种方式带提交按钮 在 [day7-2](https://github.com/mqyqingfeng/next-react-notes-demo/tree/day7-2) 分支

直接使用的时候不要忘记在本地开启 Redis。

## 参考链接

1.  [\<input type=“file”\> - HTML（超文本标记语言） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input/file#accept)
2.  [HTMLFormElement: enctype property - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/enctype)
3.  <https://developer.mozilla.org/zh-CN/docs/Web/API/File>
4.  [Building a File Uploader from scratch with Next.js app directory](https://codersteps.com/articles/building-a-file-uploader-from-scratch-with-next-js-app-directory)
5.  [How to upload a file in Next.js 13+ App Directory with No libraries](https://ethanmick.com/how-to-upload-a-file-in-next-js-13-app-directory/)
6.  [Next.js V13: revalidate not triggering after router.push](https://stackoverflow.com/questions/76395110/next-js-v13-revalidate-not-triggering-after-router-push)
7.  <https://github.com/vercel/next.js/discussions/54075>
