### 本资源由 itjc8.com 收集整理
﻿Nest 的文件上传是基于 Express 的中间件 multer 实现的，所以在学习 Nest 文件上传之前，我们先学习下 multer 包的使用。

新建目录，npm init -y 创建 package.json

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-1.png)

然后安装 express 和 multer 还有 cors 包：

    npm install express multer cors

这个 cors 包是处理跨域 header 的。

然后创建 index.js，输入如下内容：

```javascript
const express = require('express')
const multer  = require('multer')
const cors = require('cors');

const app = express()
app.use(cors());

const upload = multer({ dest: 'uploads/' })

app.post('/aaa', upload.single('aaa'), function (req, res, next) {
  console.log('req.file', req.file);
  console.log('req.body', req.body);
})

app.listen(3333);
```

app.use 使用中间件 cors 来处理跨域。

用 multer 处理文件上传，指定保存目录为 uploads/。

然后新建这样一个 index.html：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
</head>
<body>
    <input id="fileInput" type="file"/>
    <script>
        const fileInput = document.querySelector('#fileInput');

        async function formData() {
            const data = new FormData();
            data.set('name','光');
            data.set('age', 20);
            data.set('aaa', fileInput.files[0]);

            const res = await axios.post('http://localhost:3333/aaa', data);
            console.log(res);
        }

        fileInput.onchange = formData;
    </script>
</body>
</html>
```

通过 FormData + axios 上传文件，指定内容的传输格式 content-type 为 multipart/form-data。

（这里 axios 会自动根据内容指定 content-type，不需要手动指定）

然后用 node 把 server 跑起来，并且用 http-server 把静态服务跑起来：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-2.png)

浏览器访问下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-3.png)

这时候在 devtools 可以看到 aaa 请求的 body 是多个 boundary 分隔的格式：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-4.png)

而分隔符是在 Content-Type 指定的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-5.png)

这就是 form-data 的传输格式。

然后去服务端看看：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-6.png)

req.file 可以拿到文件字段，其余非文件字段在 req.body。

并且服务端多了 uploads 目录，下面就保存着我们上传的文件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-7.png)

单文件上传我们会了，那多文件上传呢？

再添加一个路由处理多文件的上传：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-8.png)

bbb 路由通过 array 方法来取上传的文件，并且指定最大数量的限制。

上传的文件通过 req.files 来取。

然后前端这样传：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/axios@0.24.0/dist/axios.min.js"></script>
</head>
<body>
    <input id="fileInput" type="file" multiple/>
    <script>
        const fileInput = document.querySelector('#fileInput');

        async function formData2() {
            const data = new FormData();
            data.set('name','光');
            data.set('age', 20);
            [...fileInput.files].forEach(item => {
                data.append('bbb', item)
            })

            const res = await axios.post('http://localhost:3333/bbb', data);
            console.log(res);
        }

        fileInput.onchange = formData2;
    </script>
</body>
</html>
```

input 标签添加 multiple 属性允许多选。

onchange 的时候取出每个 file，通过 append 方法添加到 bbb 字段。

（这里fileInput.files 是一个伪数组，要转成数组才能用 forEach 方法）

这样 bbb 实际上就保存着上传的多个文件了。

我们传下试试：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-9.png)

node 服务的 req.files 接收到了多个文件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-10.png)

并且 uploads 目录下也多了俩文件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-11.png)

这就是多文件上传。

那如果传了超过 2 个文件呢？

会报错。

我们添加一个错误处理中间件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-12.png)

在 express 里，约定有 4 个参数的中间件为错误处理中间件。

一旦某个中间件出了错，express 就会向后找错误处理中间件来调用，如果没有，那就用默认错误处理中间件，返回 500 响应。

我们多传几个文件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-13.png)

可以看到服务端打印了报错：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-14.png)

这样我们只要返回对应的响应就好了：

```javascript
app.post('/bbb', upload.array('bbb', 2), function (req, res, next) {
    console.log('req.files', req.files);
    console.log('req.body', req.body);
}, function(err, req, res, next) {
    if(err instanceof MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).end('Too many files uploaded');
    }
})
```

这样再次上传超过 2 个文件，就会收到服务端的 400 的响应，提示文件上传过多：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-15.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-16.png)

更复杂一点的情况，如果多个字段都会上传文件，而且限制也都不同呢？

那可以这样处理：

```javascript
app.post('/ccc', upload.fields([
    { name: 'aaa', maxCount: 3 },
    { name: 'bbb', maxCount: 2 }
]), function (req, res, next) {
    console.log('req.files', req.files);
    console.log('req.body', req.body);
})
```

通过 fields 方法指定每个字段的名字和最大数量，然后接收到请求后通过 req.files\['xxx'] 来取对应的文件信息。

其他非文件字段，同样是通过 req.body 来取。

前端写下对应的代码：

```javascript
async function formData3() {
    const data = new FormData();
    data.set('name','光');
    data.set('age', 20);
    data.append('aaa', fileInput.files[0]);
    data.append('aaa', fileInput.files[1]);
    data.append('bbb', fileInput.files[2]);
    data.append('bbb', fileInput.files[3]);

    const res = await axios.post('http://localhost:3333/ccc', data);
    console.log(res);
}
```

这里本来要写两个 file input 分别上传 aaa、bbb 的文件，这里为了测试方便简化了下。

浏览器里再次上传：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-17.png)

服务端收到了 aaa 和 bbb 的文件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-18.png)

此外，如果我们并不知道有哪些字段是 file 呢？

这时候可以用 any 来接收：

```javascript
app.post('/ddd', upload.any(), function(req, res, next) {
    console.log('req.files', req.files);
    console.log('req.body', req.body);
});
```

改下前端代码，这次设置 aaa、bbb、ccc、ddd 4 个 file 字段：

```javascript
async function formData4() {
    const data = new FormData();
    data.set('name','光');
    data.set('age', 20);
    data.set('aaa', fileInput.files[0]);
    data.set('bbb', fileInput.files[1]);
    data.set('ccc', fileInput.files[2]);
    data.set('ddd', fileInput.files[3]);

    const res = await axios.post('http://localhost:3333/ddd', data);
    console.log(res);
}
```

再次上传 4 个文件，可以看到服务端接收到了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-19.png)

只不过这时候不是 key、value 的形式了，需要自己遍历数组来查找。

还有一个问题，如何修改保存的文件名呢？

之前是通过 dest 指定了保存的目录：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-20.png)

现在这样写：

```javascript
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            fs.mkdirSync(path.join(process.cwd(), 'my-uploads'));
        }catch(e) {}
        cb(null, path.join(process.cwd(), 'my-uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});
```

自己指定怎么存储，multer.distkStorage 是磁盘存储，通过 destination、filename 的参数分别指定保存的目录和文件名。

这里要先创建下用到的目录，然后再返回它的路径。

file 对象就是之前打印的那种：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-21.png)

我们用时间戳 Date.now() 加上Math.random() 乘以 10 的 9 次方，然后取整，之后加上原来的文件名。

测试下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-22.png)

然后浏览器再次上传：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-23.png)

就可以看到目录和文件名都修改了：
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第23章-24.png)

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/multer-test)。

## 总结

express 的 multer 包是用来处理 multipart/form-data 格式的文件上传请求的。

通过 single 方法处理单个字段的单个文件，array 方法处理单个字段的多个文件，fields 方法处理多个字段的文件，any 处理任意数量字段的文件，分别用 req.file 和 req.files 来取解析出的文件。

其余非文件字段不会处理，还是通过 req.body 来取。

类似文件数量过多等错误，会抛出对应的 error 对象，在错误处理中间件里处理并返回对应的响应就好了。

Nest 的文件上传就是通过 multer 包实现的，下节我们来学下 Nest 里怎么使用 multer。
