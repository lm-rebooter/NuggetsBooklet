不知道大家有没有场景会需要 GIF 压缩，我是经常会用到。

因为公众号的图片最大支持 10M，但是我录制出来的 GIF 经常超过 10M。

比如这样一个图片：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/534f62e9f98a4d89ab5074b33e355b03~tplv-k3u1fbpfcp-watermark.image?)

在编辑器上传会提示超过 10 M 了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6488ca24bfc548f2a9d12be840328983~tplv-k3u1fbpfcp-watermark.image?)

这时候就需要 GIF 压缩，不然文章发不了。

于是我在百度搜素 GIF 压缩，就找到了一个工具：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a77546139604ab99b174650a17d3c89~tplv-k3u1fbpfcp-watermark.image?)

它确实能解决我的问题：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9f0958bf3004e5f929067bc8930bbf9~tplv-k3u1fbpfcp-watermark.image?)

但是要花钱：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abfb01d8086a400f923bdf9b5ca94ce5~tplv-k3u1fbpfcp-watermark.image?)

一年 148 呢，对一个小工具来说还是挺贵的。

但没办法，这对我是刚需，总不能不发文章了吧。

于是去年年底我就开了一年的会员：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecb82df4b2464e58ac0003323c68bd4d~tplv-k3u1fbpfcp-watermark.image?)

但最近发现有 npm 包可以做这个，没必要买这种网站的会员。。。

当时我的心情是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56098a7eaefc43488e4917f3e5d6fd5a~tplv-k3u1fbpfcp-watermark.image?)

这个 npm 包就是 sharp，它是用来处理各种图片的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbb3d4cb491247b9a341561383cdded4~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/006b0a681c464318849f695afefd71be~tplv-k3u1fbpfcp-watermark.image?)

它可以用来调整图片的大小，对图片做旋转、颜色调整、合成图片等。

这些功能我用不到，我就关心它的 gif 压缩功能。

看了下文档，大概这样用：

```javascript
const sharp = require('sharp');

sharp('1.image.gif', {
    animated: true,
    limitInputPixels: false
}).gif({
    colours: 10
}).toFile('2.image.gif')
```
我们先试试看：

node 执行这个文件，可以看到产生了 2.image.gif，只有 2.7 M

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/969d2190fe7b4b1282d6d2ed4d77e9d8~tplv-k3u1fbpfcp-watermark.image?)

要知道之前的 1.image.gif 可是有 21M 啊：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba702430da5a414bba766f271a3ddf82~tplv-k3u1fbpfcp-watermark.image?)

然后打开它看看：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/558424b82d2d4f1b8211f6ce34139e6a~tplv-k3u1fbpfcp-watermark.image?)

没啥问题。

回过头来，我们再来看看这段代码：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26b6de2e70e2465c95e205c55773edfd~tplv-k3u1fbpfcp-watermark.image?)

animated 设为 true 是读取所有的帧，不然默认只会读取 gif 的第一帧。

limitInputPixels 设为 false 是不限制大小，默认太大的图片是会报错的。

然后是输出参数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe371950ef354b7eb302e86e00540b51~tplv-k3u1fbpfcp-watermark.image?)

colours 是颜色的数量，默认是 256。

一般色彩不丰富的图片，可以把 colours 设置的小一点。

当把 colours 设置为 2，图片就变成这样了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/035a108ea6e941728632fc5f42002ab1~tplv-k3u1fbpfcp-watermark.image?)

图片也更小了一些：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf5e6418996f435c8c237e97de3cb87f~tplv-k3u1fbpfcp-watermark.image?)

具体怎么设置压缩级别和颜色数量，还是看需求。

总之，我们完全可以用 sharp 来自己做 gif 压缩，没必要买这种工具网站的会员。。。

不过体验上还是网页更好一点，我们也来写个这种网页：

用 create-react-app 创建个项目：

```
npx create-react-app gif-compression-frontend
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab409f4fc3724b30ad962140239eab2d~tplv-k3u1fbpfcp-watermark.image?)

进入项目目录，安装 antd：

```
npm install --save antd
```
修改下 App.js

```javascript
import { DatePicker } from 'antd';

function App() {
  return (
    <div>
      <DatePicker/>
    </div>
  );
}

export default App;
```
然后把开发服务跑起来：

```
npm run start
```
浏览器访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3a83edc815544e28ec8795f8352b9b2~tplv-k3u1fbpfcp-watermark.image?)

antd 引入成功了。

然后我们来写下上传文件的 UI：

```javascript
import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

const props = {
  name: 'file',
  action: 'http://localhost:3005',
  onChange(info) {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  }
};

const App = () => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">点击或拖拽文件到这个区域来上传</p>
  </Dragger>
);

export default App;
```
大概是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd025c87d4eb44db962c184e6a7d2da0~tplv-k3u1fbpfcp-watermark.image?)

antd 会 post 方式请求 action 对应的接口，带上上传的文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e619fef32305427f988e5c2f95a90d43~tplv-k3u1fbpfcp-watermark.image?)

我们再用 nest 写个后端服务接收下：

```
nest new gif-compression-backend
```
创建个 nest 项目：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd29629beee140a7832279cf86d9d409~tplv-k3u1fbpfcp-watermark.image?)

修改 main.ts，启用跨域支持，并修改启动端口为 3005

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a0938ccf5e241659acbfda47b9b9e7b~tplv-k3u1fbpfcp-watermark.image?)

把它跑起来：

```
npm run start:dev
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fafdf617a144d24abc95c2aca3fbf94~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问 http://localhost:3005 可以看到 hello world，说明 nest 服务跑成功了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e57f1de80ce843d19453c223eb3bd111~tplv-k3u1fbpfcp-watermark.image?)

然后我们来添加下文章上传的接口：

安装需要的 ts 类型的包：

```
npm install -D @types/multer
```

在 AppController 里添加这样一个路由：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d728bcdb0f0486bb6453b89a2c8b914~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@Post('upload')
@UseInterceptors(FileInterceptor('file', {
  dest: 'uploads'
}))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  console.log('file', file);
}
```
这段代码是提取 file 参数的内容，保存到 dest 目录下，然后把文件对象传入该方法。

然后我们改下前端代码的上传接口：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1956716d40b84b81b8fc46d74717b753~tplv-k3u1fbpfcp-watermark.image?)

测试下上传：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85560f4437134a878f38d6c5870d4896~tplv-k3u1fbpfcp-watermark.image?)

提示文件上传成功了，然后在服务端控制台也打印了文件信息，并且在 uploads 目录下可以看到这个文件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd39a9a51a554bbea2148e7fe52468cc~tplv-k3u1fbpfcp-watermark.image?)

这些文件在浏览器打开，可以看到就是上传的 gif：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/530b9987a7d9417792668927fc61fd4e~tplv-k3u1fbpfcp-watermark.image?)

然后我们把文件路径返回就好了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0eea12b4a6584b7bb887b7aa5496daa1~tplv-k3u1fbpfcp-watermark.image?)

现在上传文件成功之后就可以拿到这个文件在服务端的路径了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7179b1164b514fcd8c5f192d410ba3c0~tplv-k3u1fbpfcp-watermark.image?)

然后我们再实现下压缩，在 AppController 增加一个接口：

```javascript
@Get('compression')
compression(@Query('path') filePath: string, @Query('color', ParseIntPipe) color:number) {
    console.log(filePath, color);

    if(!existsSync(filePath)) {
      throw new BadRequestException('文件不存在');
    }
    return 'success';
}
```

接收 path、color 的 query 参数，分别是文件路径、颜色数量的意思。

其中 color  要使用 ParseIntPipe 转成 int 类型。

测试下：

访问 http://localhost:3005/compression?path=uploads/xxx&color=10

提示文件不存在：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/260fce890e1749a19d65ccdf676dc953~tplv-k3u1fbpfcp-watermark.image?)

服务端接收到了传过来的参数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28ee09d44a1f4d148cbaeb529788e28b~tplv-k3u1fbpfcp-watermark.image?)

然后换一个真实存在的路径，返回 success：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8d438617d364fd1857dced1be249a26~tplv-k3u1fbpfcp-watermark.image?)

说明服务端找到了这个路径的文件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87e16f47a1ed4d7b92a0afbd6c2bf26b~tplv-k3u1fbpfcp-watermark.image?)

接下来安装 sharp 来实现压缩：

```
npm install --save sharp
```

修改下 compression 方法：

调用 sharp 来压缩 gif 图片，并注入 response 对象来返回文件下载响应：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afb256bd73dc479c8978477a4dbe607f~tplv-k3u1fbpfcp-watermark.image?)

```javascript
@Get('compression')
async compression(
    @Query('path') filePath: string,
    @Query('color', ParseIntPipe) color:number,
    @Res() res: Response
) {

    if(!existsSync(filePath)) {
      throw new BadRequestException('文件不存在');
    }

    const data = await sharp(filePath, {
        animated: true,
        limitInputPixels: false
    }).gif({
        compressionLevel: level,
        colours: color
    }).toBuffer();

    res.set('Content-Disposition', `attachment; filename="dest.gif"`);

    res.send(data);
}
```
测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a3d7046afee4724b453590ed269928e~tplv-k3u1fbpfcp-watermark.image?)

访问这个接口，带上文件路径和压缩的参数，会返回压缩后的文件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96ede0c962514ba086287a3cfde2d17b~tplv-k3u1fbpfcp-watermark.image?)

然后我们在前端页面上加一个表单来填参数，然后访问这个接口压缩文件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d394163b762486cbdebc2ae5dc4f4fa~tplv-k3u1fbpfcp-watermark.image?)

代码如下：
```javascript
import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Form, Input, Button } from 'antd';

const { Dragger } = Upload;

const App = () => {
  const [form] = Form.useForm();
  const [filePath, setFilePath] = useState('');
  const [fileName, setFileName] = useState('');

  const compress = async (values) => {
    console.log(values);
    console.log(filePath);
  };

  const props = {
    name: 'file',
    action: 'http://localhost:3005/upload',
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        setFilePath(info.file.response);
        setFileName(info.file.name);
        message.success(`${info.file.name} 文件上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    }
  };

  return <div>
    <Form style={{width: 500, margin: '50px auto'}}form={form} onFinish={compress}>
      <Form.Item
        label="颜色数量"
        name="color"
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到这个区域来上传</p>
        </Dragger>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">压缩</Button>
      </Form.Item>
    </Form>
  </div>
}

export default App;
```

用 filePath 的 state 来保存上传后的文件路径，用 fileName 保存文件名。

在点击登录的时候打印下表单的值和 filePath。

我们试试看：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1faf57685f884ac0a38e4ccf9db97bce~tplv-k3u1fbpfcp-watermark.image?)

3 个参数都拿到了，然后调用下压缩接口。

安装 axios：

```
npm install --save axios
```

修改下 compress 方法：

```javascript
const compress = async (values) => {
    const res = await axios.get('http://localhost:3005/compression', {
      params: {
        color: values.color || 256,
        level: values.level || 9,
        path: filePath
      },
      responseType: 'arraybuffer'
    });

    const blob = new Blob([res.data], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); 
    link.href = url; 
    link.download = fileName;
    link.click(); 

    message.success('压缩成功');
};
```
访问 comporession 接口，传入参数，指定返回数据的类型为 arraybuffer。

然后用 URL.createObjectURL 创建 blob 的 url，设置为 a 标签的 src，指定 download 属性的值也就是文件名，然后触发点击。

这样，就能把返回的 arraybuffer 作为文件下载了。

我们试试看：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ddffc405b3d48808f43b0e7512a5c1d~tplv-k3u1fbpfcp-watermark.image?)

整个流程都跑通了！

我们试下刚开始那个 21M 的文件，压缩之后下载的是 2.7M。

和用这个网站压缩的差不多：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b2acf5de1f34d89bfade7eb3da7516a~tplv-k3u1fbpfcp-watermark.image?)

更重要的是不用每年 138 的会员费。

案例代码在小册仓库：

前端代码：https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/gif-compression-frontend

后端代码：https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/gif-compression-backend

## 总结

压缩 gif 图片是我的刚需，之前都是买某网站的 138 的年度会员，直到我发现了 sharp 这个包。

它是用来处理各种图片的，调整大小、旋转等等，我们只用它的 gif 压缩的功能。

然后我们也做了一个网站，前端 react + antd，后端 nest + sharp。

后端提供一个 /upload 接口用于上传文件，返回文件路径。

又提供了一个 /compression 接口用来压缩 gif，返回压缩后的文件。

整个流程如下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03dc4ab868a04400a8f7e0aa1a8cccf5~tplv-k3u1fbpfcp-watermark.image?)

其实最好再做一步: 把这个应用通过 dockerfile 来 build 成 docker 镜像，随时用，随时跑。

再需要压缩图片的时候，不用花钱买会员了，直接用自己的压缩工具就好了。
