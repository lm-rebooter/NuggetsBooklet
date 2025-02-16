上传文件是常见的需求，我们经常用 antd 的 Upload 组件来实现。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/746b6ac1557d4267b7cfa3a7261fbc3b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=928&s=2441256&e=gif&f=41&b=fdfdfd)

它有一个上传按钮，下面是上传的文件列表的状态：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5b7d2277e2b4fe5a7ce8c1a4259c6b0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=822&h=336&s=21406&e=png&b=ffffff)

并且，还支持拖拽上传：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/070905c621c049b6ac54811653a279df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=928&s=431788&e=gif&f=36&b=fcfcfc)

这节我们就来实现下这个 Upload 组件。

```
npx create-vite
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86e8efb4fcd241aa89efaf18fcee4a93~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=842&h=426&s=51270&e=png&b=010101)

用 create-vite 创建个 react 项目。

去掉 index.css 和 StrictMode

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae8d8d3146d5458796075e9de7c72a52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=990&h=412&s=77226&e=png&b=1f1f1f)

然后把开发服务跑起来：

```
npm install
npm run dev
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f741b6c6f3e34a6ba31256ad50b5b16a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=802&h=274&s=36744&e=png&b=181818)

访问下试试：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6792c7f34394ed8a18a969a8e74671b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=970&s=105155&e=png&b=ffffff)

然后我们先用下 antd 的 Upload 组件：

```
npm i --save antd
```
改下 App.tsx

```javascript
import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';

const props: UploadProps = {
  name: 'file',
  action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
  headers: {},
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const App: React.FC = () => (
  <Upload {...props}>
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </Upload>
);

export default App;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4c8d9e597764907b759909b51db5f33~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=928&s=815491&e=gif&f=35&b=fefefe)

现在接口是 mock 的，这样不过瘾，我们用 express 起个服务来接收下文件。

根目录下新建 server.js

```javascript
import express from 'express';
import multer from 'multer';
import cors from 'cors';

const app = express()
app.use(cors());

const upload = multer({ 
    dest: 'uploads/'
})

app.post('/upload', upload.single('file'), function (req, res, next) {
  console.log('req.file', req.file);
  console.log('req.body', req.body);

  res.end(JSON.stringify({
    message: 'success'
  }));
})

app.listen(3333);
```

用 express 跑服务，然后用 cors 处理跨域请求，用 multer 来接收文件。

指定 dest 为 uploads 目录。

安装依赖，然后用 node 跑一下：

```
npm i --save express cors multer

node ./server.js
```
这里 node 能直接跑 es module 的代码是因为 package.json 里指定了 type 为 module：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d46dcfa28124c70b01e508ee4848e06~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1446&h=172&s=45904&e=png&b=202020)

也就是说默认所有 js 都是 es module 的。

然后改下上传路径：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d6a5fd6a34c462681d7969b8791fa56~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1130&h=728&s=166401&e=png&b=1f1f1f)

试一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52d2897f0ccb47caaab6397e53d0f171~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=928&s=849617&e=gif&f=27&b=fefefe)

上传成功，服务端也接收到了文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a06d7e3d706f4519b5e2525bf4ae7e3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1558&h=916&s=226879&e=png&b=1a1a1a)

只不过现在的文件名没有带后缀名，我们可以自定义一下：

```javascript
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express()
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            fs.mkdirSync(path.join(process.cwd(), 'uploads'));
        }catch(e) {}
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname
        cb(null, uniqueSuffix)
    }
});
const upload = multer({ 
    dest: 'uploads/',
    storage
})

app.post('/upload', upload.single('file'), function (req, res, next) {
  console.log('req.file', req.file);
  console.log('req.body', req.body);

  res.end(JSON.stringify({
    message: 'success'
  }));
})

app.listen(3333);
```
自定义 storage，指定文件存储的目录以及文件名。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e157d8873da4f059a6316adaf00145f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=826&s=155293&e=png&b=1f1f1f)

重新跑下服务，然后再次上传：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52d2897f0ccb47caaab6397e53d0f171~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=928&s=849617&e=gif&f=27&b=fefefe)

现在，文件保存的路径就改了

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4698888714649219cf6c902aa0c4260~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1978&h=1132&s=330305&e=png&b=1b1b1b)

上传的图片也能正常打开：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/047d81cce83340609704bc587cef4692~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1892&h=1010&s=722163&e=png&b=1d1d1d)

接口搞定之后，我们自己来实现下这个 Upload 组件。

新建 Upload/index.tsx

```javascript
import { FC, useRef, ChangeEvent, PropsWithChildren } from 'react'
import axios from 'axios'

import './index.scss';

export interface UploadProps extends PropsWithChildren{
  action: string;
  headers?: Record<string, any>;
  name?: string;
  data?: Record<string, any>;
  withCredentials?: boolean;
  accept?: string;
  multiple?: boolean;
}

export const Upload: FC<UploadProps> = (props) => {
  const {
    action,
    name,
    headers,
    data,
    withCredentials,
    accept,
    multiple,
    children,
  } = props

  const fileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInput.current) {
        fileInput.current.click()
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if(!files) {
        return
    }
    uploadFiles(files)
    if (fileInput.current) {
        fileInput.current.value = ''
    }
  }

  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files)
    postFiles.forEach(file => {
        post(file)
    })
  }

  const post = (file: File) => {
    const formData = new FormData()

    formData.append(name || 'file', file);
    if (data) {
        Object.keys(data).forEach(key => {
            formData.append(key, data[key])
        })
    } 

    axios.post(action, formData, {
        headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
        },
        withCredentials
    })
  }

  return (
    <div className="upload-component">
        <div 
            className="upload-input"
            onClick={handleClick}
        >
            {children}
            <input
                className="upload-file-input"
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
                accept={accept}
                multiple={multiple}
            />
        </div>
    </div>
  )
}

export default Upload;
```
还有 Upload/index.scss
```css
.upload-input {
    display: inline-block;
}
.upload-file-input {
    display: none;
}
```
这些参数都很容易理解：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04f663f0872846f983548882ecbd0c5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880&h=346&s=63592&e=png&b=1f1f1f)

action 是上传的 url

headers 是携带的请求头

data 是携带的数据

name 是文件的表单字段名

accept 是 input 接受的文件格式

multiple 是 input 可以多选

然后渲染 children 外加一个隐藏的 file input

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7f13db1a3e048d49dd3732db1d4df3b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=790&h=658&s=83358&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a28ef715bcc74d5e934090a77f7627d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=548&h=256&s=35566&e=png&b=202020)

onChange 的时候，拿到所有 files 依次上传，之后把 file input 置空：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fb61cd1ace848498b30eccddcdb5480~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=624&s=90378&e=png&b=1f1f1f)

用 axios 来发送 post 请求，携带 FormData 数据，包含 file 和其它 data 字段：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90fe72ea89694eddadb75a7dc19e29db~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=786&h=684&s=88472&e=png&b=1f1f1f)

再就是点击其它区域也触发 file input 的点击：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d427f526d10e43ff823ad23e4905ac17~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=546&h=208&s=23800&e=png&b=1f1f1f)

安装用到的 axios 包：

```
npm install --save axios
```

改下 App.tsx

```javascript
import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Upload, { UploadProps } from './Upload'

const props: UploadProps = {
  name: 'file',
  action: 'http://localhost:3333/upload'
};

const App: React.FC = () => (
  <Upload {...props}>
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </Upload>
);

export default App;
```

这里内层的 Button、Icon 还是用 antd 的，只是把 Upload 组件换成我们自己实现的。

然后测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0137009bd9b247128e2ab56b17c36e23~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=928&s=688278&e=gif&f=26&b=fefefe)

虽然界面还没加啥反馈，但请求已经发送成功了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cbcdc5f84664e06be68f9b874a5eb20~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=458&s=89874&e=png&b=ffffff)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87df5cb2ffaa403da97454bb8afd9a48~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1702&h=340&s=49164&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50a7a285355d43e2898091d4c147bf75~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1464&h=364&s=44459&e=png&b=ffffff)

服务端也接受到了这个文件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f45d7c21deb04437bc684e70437415c9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1974&h=496&s=140667&e=png&b=191919)

上传功能没问题，然后我们添加几个上传过程中的回调函数：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be490c71631f42f5a15706ed9f69f1bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=738&s=170290&e=png&b=1f1f1f)

beforeUpload 是上传之前的回调，如果返回 false 就不上传，也可以返回 promise，比如在服务端校验的时候，等 resolve 之后才会上传

antd 的 [Upload 组件](https://ant-design.antgroup.com/components/upload-cn#components-upload-demo-avatar)就是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eace3ad1758948caab3605335875dd92~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=998&h=508&s=66558&e=png&b=fefefe)

onProgress 是进度更新时的回调，可以拿到进度。

onSuccess 和 onError 是上传成功、失败时的回调。

onChange 是上传状态改变时的回调。

这几个回调分别在上传前、进度更新、成功、失败时调用：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81cb9db659c74a46ae21e7e9495c618c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=926&h=630&s=101658&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddba2afa13cb4afdad871d1e1cec67b7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1112&h=774&s=123383&e=png&b=1f1f1f)

```javascript
import { FC, useRef, ChangeEvent, PropsWithChildren } from 'react'
import axios from 'axios'

import './index.scss';

export interface UploadProps extends PropsWithChildren{
  action: string;
  headers?: Record<string, any>;
  name?: string;
  data?: Record<string, any>;
  withCredentials?: boolean;
  accept?: string;
  multiple?: boolean;
  beforeUpload? : (file: File) => boolean | Promise<File>;
  onProgress?: (percentage: number, file: File) => void;
  onSuccess?: (data: any, file: File) => void;
  onError?: (err: any, file: File) => void;
  onChange?: (file: File) => void;
}

export const Upload: FC<UploadProps> = (props) => {
  const {
    action,
    name,
    headers,
    data,
    withCredentials,
    accept,
    multiple,
    children,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
  } = props

  const fileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInput.current) {
        fileInput.current.click()
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if(!files) {
        return
    }
    uploadFiles(files)
    if (fileInput.current) {
        fileInput.current.value = ''
    }
  }

  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files)
    postFiles.forEach(file => {
        if (!beforeUpload) {
            post(file)
        } else {
            const result = beforeUpload(file)
            if (result && result instanceof Promise) {
                result.then(processedFile => {
                    post(processedFile)
                })
            } else if (result !== false) {
                post(file)
            }
        }
    })
  }

  const post = (file: File) => {
    const formData = new FormData()

    formData.append(name || 'file', file);
    if (data) {
        Object.keys(data).forEach(key => {
            formData.append(key, data[key])
        })
    } 

    axios.post(action, formData, {
        headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
        },
        withCredentials,
        onUploadProgress: (e) => {
            let percentage = Math.round((e.loaded * 100) / e.total!) || 0;
            if (percentage < 100) {
                if (onProgress) {
                    onProgress(percentage, file)
                }
            }
        }
    }).then(resp => {
        onSuccess?.(resp.data, file)
        onChange?.(file)
    }).catch(err => {
        onError?.(err, file)
        onChange?.(file)
    })
  }

  return (
    <div className="upload-component">
        <div 
            className="upload-input"
            onClick={handleClick}
        >
            {children}
            <input
                className="upload-file-input"
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
                accept={accept}
                multiple={multiple}
            />
        </div>
    </div>
  )
}

export default Upload;
```
在 App.tsx 里传入对应参数：

```javascript
import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Upload, { UploadProps } from './Upload'

const props: UploadProps = {
  name: 'file',
  action: 'http://localhost:3333/upload',
  beforeUpload(file) {
    if(file.name.includes('1.image')) {
      return false;
    }
    return true;
  },
  onSuccess(ret) {
    console.log('onSuccess', ret);
  },
  onError(err) {
    console.log('onError', err);
  },
  onProgress(percentage, file) {
    console.log('onProgress', percentage);
  },
  onChange(file) {
    console.log('onChange', file);
  }
};

const App: React.FC = () => (
  <Upload {...props}>
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </Upload>
);

export default App;
```
包含 1.image 的文件返回 false，其余的返回 true

跑一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdde701a0bbf4fc097319ab282780cf7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1822&h=1278&s=2926008&e=gif&f=43&b=fdfdfd)

网速快的时候没有上传进度，改下网络设置：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/897510e517c74578a190980b46bd40f1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1502&h=832&s=178945&e=png&b=fcfbfb)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ae2e0a7821944e6b1fb3e9b74e50e02~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1822&h=1278&s=1670178&e=gif&f=55&b=fefefe)

几个回调函数都没问题。

接下来我们添加下面的文件列表：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5b7d2277e2b4fe5a7ce8c1a4259c6b0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=822&h=336&s=21406&e=png&b=ffffff)

新建 Upload/UploadList.tsx

```javascript
import { FC } from 'react'
import { Progress } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, FileOutlined, LoadingOutlined } from '@ant-design/icons';

export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: 'ready' | 'uploading' | 'success' | 'error';
  percent?: number;
  raw?: File;
  response?: any;
  error?: any;
}

interface UploadListProps {
  fileList: UploadFile[];
  onRemove: (file: UploadFile) => void;
}

export const UploadList: FC<UploadListProps> = (props) => {
  const {
    fileList,
    onRemove,
  } = props;

  return (
    <ul className="upload-list">
      {
        fileList.map(item => {
            return (
                <li className={`upload-list-item upload-list-item-${item.status}`} key={item.uid}>
                    <span className='file-name'>
                        {
                            (item.status === 'uploading' || item.status === 'ready') && 
                                <LoadingOutlined />
                        }
                        {
                            item.status === 'success' && 
                                <CheckOutlined />
                        }
                        {
                            item.status === 'error' && 
                                <CloseOutlined />
                        }
                        {item.name}
                    </span>
                    <span className="file-actions">
                        <DeleteOutlined onClick={() => { onRemove(item)}}/>
                    </span>
                        {
                            item.status === 'uploading' && 
                                <Progress percent={item.percent || 0}/>
                        }
                </li>
            )
        })
      }
    </ul>
  )
}

export default UploadList;
```
这个组件传入 UploadFile 的数组和 onRemove 回调作为参数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/885e9e5abe9e434a9991e5700139d24b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=980&s=167882&e=png&b=1f1f1f)

UploadFile 里除了文件信息外，还有 status、response、error

上传状态 status 有 ready、uploading、success、error 四种。

然后把 UploadFile 数组渲染出来：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9efdd33343a14886a465ac1c93a9b009~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1436&h=1182&s=180222&e=png&b=1f1f1f)

显示文件名、进度、删除按钮等。

点击删除的时候调用 onRemove 回调。

然后在 index.scss 里添加对应的样式：

```css
.upload-input {
    display: inline-block;
}
.upload-file-input {
    display: none;
}

.upload-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
}
.upload-list-item {
    margin-top: 5px;

    font-size: 14px;
    line-height: 2em;
    font-weight: bold;

    box-sizing: border-box;
    min-width: 200px;

    position: relative;

    &-success {
        color: blue;
    }
    
    &-error {
        color: red;
    }

    .file-name {
        .anticon {
            margin-right: 10px;
        }
    }

    .file-actions {
        display: none;

        position: absolute;
        right: 7px;
        top: 0;

        cursor: pointer;
    }

    &:hover {
        .file-actions {
            display: block;
        }
    }
}
```
在 Upload/index.tsx 里引入试试：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0ea14a138cc407c9043829f6773a06c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=1296&s=177502&e=png&b=1f1f1f)

用 mock 的数据渲染 UploadList

```javascript
const fileList: UploadFile[] = [
    {
        uid: '11',
        size: 111,
        name: 'xxxx',
        status: 'uploading',
        percent: 50
    },
    {
        uid: '22',
        size: 111,
        name: 'yyy',
        status: 'success',
        percent: 50
    },
    {
        uid: '33',
        size: 111,
        name: 'zzz',
        status: 'error',
        percent: 50
    },
];

return (
    <div className="upload-component">
        <div 
            className="upload-input"
            onClick={handleClick}
        >
            {children}
            <input
                className="upload-file-input"
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
                accept={accept}
                multiple={multiple}
            />
        </div>

        <UploadList
            fileList={fileList}
            onRemove={() => {}}
        />
    </div>
)
```

浏览器看一下:

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/352864d091c44da2918eb8594b22d6ef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=520&s=67420&e=gif&f=30&b=fefefe)

没啥问题。

然后把数据变成动态的：

声明一个 fileList 的 state，并封装一个更新它的方法：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a155d687b0d74545a9975e3054514f05~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1390&h=906&s=174887&e=png&b=1f1f1f)

在状态改变的时候调用更新方法来更新 fileList：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0837aae98d424d0fa488cc8f757b720e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1420&h=1072&s=213976&e=png&b=1f1f1f)

并且添加一个 onRemove 的回调：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/174517369d95429ab91e533d96269944~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1012&h=576&s=140637&e=png&b=1f1f1f)

在点击删除按钮的时候调用：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a39089bab172493093a5d3f742674134~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=938&h=324&s=48573&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee20b14750e8412eb865c890a7fd1713~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=508&h=170&s=21279&e=png&b=1f1f1f)

```javascript
import { FC, useRef, ChangeEvent, PropsWithChildren, useState } from 'react'
import axios from 'axios'

import './index.scss';
import UploadList, { UploadFile } from './UploadList';

export interface UploadProps extends PropsWithChildren{
  action: string;
  headers?: Record<string, any>;
  name?: string;
  data?: Record<string, any>;
  withCredentials?: boolean;
  accept?: string;
  multiple?: boolean;
  beforeUpload? : (file: File) => boolean | Promise<File>;
  onProgress?: (percentage: number, file: File) => void;
  onSuccess?: (data: any, file: File) => void;
  onError?: (err: any, file: File) => void;
  onChange?: (file: File) => void;
  onRemove?: (file: UploadFile) => void;
}

export const Upload: FC<UploadProps> = (props) => {
  const {
    action,
    name,
    headers,
    data,
    withCredentials,
    accept,
    multiple,
    children,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
    onRemove
  } = props

  const fileInput = useRef<HTMLInputElement>(null);

  const [ fileList, setFileList ] = useState<Array<UploadFile>>([]);

  const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
    setFileList(prevList => {
      return prevList.map(file => {
        if (file.uid === updateFile.uid) {
          return { ...file, ...updateObj }
        } else {
          return file
        }
      })
    })
  }

  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      return prevList.filter(item => item.uid !== file.uid)
    })
    if (onRemove) {
      onRemove(file)
    }
  }

  const handleClick = () => {
    if (fileInput.current) {
        fileInput.current.click()
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if(!files) {
        return
    }
    uploadFiles(files)
    if (fileInput.current) {
        fileInput.current.value = ''
    }
  }

  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files)
    postFiles.forEach(file => {
        if (!beforeUpload) {
            post(file)
        } else {
            const result = beforeUpload(file)
            if (result && result instanceof Promise) {
                result.then(processedFile => {
                    post(processedFile)
                })
            } else if (result !== false) {
                post(file)
            }
        }
    })
  }

  const post = (file: File) => {
    let uploadFile: UploadFile = {
        uid: Date.now() + 'upload-file',
        status: 'ready',
        name: file.name,
        size: file.size,
        percent: 0,
        raw: file
    }
    setFileList(prevList => {
        return [uploadFile, ...prevList]
    })

    const formData = new FormData()

    formData.append(name || 'file', file);
    if (data) {
        Object.keys(data).forEach(key => {
            formData.append(key, data[key])
        })
    } 

    axios.post(action, formData, {
        headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
        },
        withCredentials,
        onUploadProgress: (e) => {
            let percentage = Math.round((e.loaded * 100) / e.total!) || 0;
            if (percentage < 100) {
                updateFileList(uploadFile, { percent: percentage, status: 'uploading'});

                if (onProgress) {
                    onProgress(percentage, file)
                }
            }
        }
    }).then(resp => {
        updateFileList(uploadFile, {status: 'success', response: resp.data})

        onSuccess?.(resp.data, file)
        onChange?.(file)
    }).catch(err => {
        updateFileList(uploadFile, { status: 'error', error: err})

        onError?.(err, file)
        onChange?.(file)
    })
  }

  return (
    <div className="upload-component">
        <div 
            className="upload-input"
            onClick={handleClick}
        >
            {children}
            <input
                className="upload-file-input"
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
                accept={accept}
                multiple={multiple}
            />
        </div>

        <UploadList
            fileList={fileList}
            onRemove={handleRemove}
        />
    </div>
  )
}

export default Upload;
```
大功告成，我们测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9a019dd6f7f4920aef818c2ed521952~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1292&h=642&s=1172332&e=gif&f=51&b=fdfdfd)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b65b4f1f1484982982b0af641ac08ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=664&h=178&s=30256&e=png&b=181818)

文件上传状态没问题，服务端也收到了上传的文件。

至此，我们的 Upload 组件就完成了。

然后我们再加上拖拽上传的功能：

创建 Upload/Dragger.tsx

```javascript
import { FC, useState, DragEvent, PropsWithChildren } from 'react'
import classNames from 'classnames'

interface DraggerProps extends PropsWithChildren{
  onFile: (files: FileList) => void;
}

export const Dragger: FC<DraggerProps> = (props) => {

  const { onFile, children } = props

  const [ dragOver, setDragOver ] = useState(false)

  const cs = classNames('upload-dragger', {
    'is-dragover': dragOver
  })

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    setDragOver(false)
    onFile(e.dataTransfer.files)
  }
  
  const handleDrag = (e: DragEvent<HTMLElement>, over: boolean) => {
    e.preventDefault()
    setDragOver(over)
  }

  return (
    <div 
      className={cs}
      onDragOver={e => { handleDrag(e, true)}}
      onDragLeave={e => { handleDrag(e, false)}}
      onDrop={handleDrop}
    >
      {children}
    </div>
  )
}

export default Dragger;
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6654b91eebf54d178da7e7c9b28252c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=820&h=610&s=228067&e=gif&f=39&b=fafafa)

因为拖拽文件到这里的时候，会有对应的样式，所以我们要在 dragover 和 dragleave 的时候分别设置不同的 dragOver 状态值，然后更改 className

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f89752577a44e3fad8124671188f2b7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1066&h=1036&s=161738&e=png&b=1f1f1f)

然后在 drop 的时候，把文件传给 onFile 回调函数：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92efecf91ec74ebc89f9d70f65bb85c5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=932&h=692&s=133337&e=png&b=1f1f1f)

在 index.scss 里加上它的样式：

```css
.upload-dragger {
    background: #eee;
    border: 1px dashed #aaa;
    border-radius: 4px;
    cursor: pointer;
    padding: 20px;
    width: 200px;
    height: 100px;
    text-align: center;

    &.is-dragover {
      border: 2px dashed blue;
      background: rgba(blue, .3);
    }
}
```

然后在 Upload/index.tsx 引入 Dragger 组件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bb53fd009fc4d648d0d3353daf376fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=1010&s=181311&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbe4c0540626497196d003906805e1d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1210&h=500&s=103860&e=png&b=1f1f1f)

```javascript
{
    drag ? <Dragger onFile={(files) => {uploadFiles(files)}}>
            {children}
        </Dragger>
        : children
}
```
当传入 drag 参数的时候，渲染 dragger 组件，onFile 回调里调用 uploadFiles 方法来上传。

在 index.tsx 里试试：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf8289f93fe74eb5b7489753de5c9df9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1052&h=298&s=57910&e=png&b=1f1f1f)

浏览器访问下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8693884fc2a3446c8040637073f875ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1330&h=874&s=328558&e=gif&f=37&b=fcfcfc)

没啥问题。

可以改下 Upload 组件的 children：

```javascript
const App: React.FC = () => (
  <Upload {...props} drag>
    <p>
      <InboxOutlined style={{fontSize: '50px'}}/>
    </p>
    <p>点击或者拖拽文件到此处</p>
  </Upload>
);
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66ed4f7cfe6342f88810fd972562d1a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1330&h=874&s=466120&e=gif&f=41&b=fcfcfc)

这样，拖拽上传就完成了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/upload-component)

## 总结

今天我们实现了 Upload 组件。

首先用 express + multer 跑的服务端，创建 /upload 接口来接收文件。

然后在 Upload 组件里调用 axios，上传包含 file 的 FormData。

之后加上了 beforeUpload、onProgress、onSuccess、onChange 等回调函数。

最后又加上了 UploadList 来可视化展示上传文件的状态。

然后实现了 Dragger 组件，可以拖拽文件来上传。

这样，我们就实现了 Upload 组件。
