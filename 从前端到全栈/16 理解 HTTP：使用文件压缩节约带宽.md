上一节课，我们介绍了 HTTP 服务的缓存策略，能够将请求的内容通过浏览器缓存起来。一般来说，Web 应用开发者通常会将资源文件包括静态的 HTML、图片、JS、CSS 以及视频音频等多媒体资源尽可能地缓存起来，这样能大大减少带宽消耗，节约成本，也能让浏览器打开网页的速度有显著提升。因此，缓存策略是重要的 Web 服务优化手段。

而这一节课，我们将介绍另一个重要的 Web 服务优化手段：文件压缩。浏览器除了支持原始的 HTTP 协议文本外，还支持以压缩的方式发送的内容。

HTTP 协议规定，客户端支持的编码格式由`Accept-Encoding`指定。下图是最新的 Chrome 浏览器下访问网页的请求头中的`Accept-Encoding`字段，有三个值，表示支持三种格式，分别是 gzip、deflate 和 br。

![](https://p0.ssl.qhimg.com/t01b860ee03ef5e7ee6.jpg)

gzip、deflate 和 br 是三种不同的压缩算法，其中 gzip 和 deflate 是同一种格式（gzip）的两种不同算法实现，而 br 则是使用 Brotli 算法的压缩格式。Node.js 的内置模块 zlib 对这三种算法都能支持。

zlib 库是 Node 内置的强大的压缩/解压库，用它来压缩或解压数据都很方便。因为 Node.js 基于 v8，而 v8 也是 Chrome 浏览器的 JS 引擎，所以我们只需要在服务器对数据进行压缩即可，解压会由浏览器自动完成。当然，其它浏览器也会自动解压文件，只是算法不同而已。

我们修改一下上一节课的 HTTP 服务器：

```js
... 
// http-compression.js

const zlib = require('zlib');

const server = http.createServer((req, res) => {
  let filePath = path.resolve(__dirname, path.join('www', url.fileURLToPath(`file:///${req.url}`)));

  if(fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if(stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if(fs.existsSync(filePath)) {
      const {ext} = path.parse(filePath);
      const stats = fs.statSync(filePath);
      const timeStamp = req.headers['if-modified-since'];
      let status = 200;
      if(timeStamp && Number(timeStamp) === stats.mtimeMs) {
        status = 304;
      }
      res.writeHead(status, {
        'Content-Type': mime.getType(ext),
        'Cache-Control': 'max-age=86400', // 缓存一天
        'Last-Modified': stats.mtimeMs,
        'Content-Encoding': 'deflate', // 告诉浏览器该文件是用deflate算法压缩的
      });
      if(status === 200) {
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(zlib.createDeflate()).pipe(res);
      } else {
        res.end();
      }
    }
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>Not Found</h1>');
  }
});
```

这段代码显示了给资源文件添加压缩是非常简单的。zlib 提供了`createDeflate()`、`createGZip()`以及`createBrotliCompress()`等方法，这些方法返回流对象，所以只需要用 pipe 方法 将这个对象和 fileStream 以及 res 连接起来即可：

```js
fileStream.pipe(zlib.createDeflate()).pipe(res);
```

这样，我们请求的时候，返回的内容就是经过压缩的了。不过我们还要记得设置一个`Content-Encoding`响应头，告诉浏览器这个数据内容是经过压缩的。`Content-Encoding`响应头的值是对应的压缩算法名，那么浏览器就会调用相应的解压算法来对资源进行解压了。

为了对比明显一些，我在 index.html 中加入了一个比较大的脚本库`spritejs`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Index</title>
</head>
<body>
  <h1>君喻教育2</h1>
  <img src="assets/image/logo.png">
  <script src="assets/js/spritejs.js"></script>
</body>
</html>
```

这个`spritejs.js`文件内容有 1.3MB，但是我们启用了 deflate 压缩之后，传输的内容就只有 247KB 了。

![](https://p0.ssl.qhimg.com/t011787cb97fc4d4d4b.jpg)

一般来说，我们对 HTML、JS、CSS 这样的资源文件启用压缩，而图片、音频、视频等格式因为通常已经经过了压缩，再启用压缩意义不大，还可能还会适得其反，所以我们可以根据 MIME type 判断一下，只对 text、appliaction 类型启用压缩：

```js
...

const mimeType = mime.getType(ext);
const responseHeaders = {
  'Content-Type': mimeType,
  'Cache-Control': 'max-age=86400', // 缓存一天
  'Last-Modified': stats.mtimeMs,
};
const compress = /^(text|application)\//.test(mimeType);
if(compress) {
  responseHeaders['Content-Encoding'] = 'deflate';
}
res.writeHead(status, responseHeaders);

...
```

如上面代码所示，我们通过正则表达式`/^(text|application)\//`判断 mimeType 的主类型是否是 text 或 application，只对这两种类型启用压缩。

上面的例子我们只实现了 deflate 一种压缩算法，因为我们的网页除了运行在浏览器外，还可以在不同的客户端运行，不同的客户端所支持的压缩算法不同，所以，我们需要根据客户端的`Accept-Encoding`请求头字段实现多种压缩算法。

```js
...

const mimeType = mime.getType(ext);
const responseHeaders = {
  'Content-Type': mimeType,
  'Cache-Control': 'max-age=86400', // 缓存一天
  'Last-Modified': stats.mtimeMs,
};
const acceptEncoding = req.headers['accept-encoding'];
const compress = acceptEncoding && /^(text|application)\//.test(mimeType);
if(compress) {
  // 返回客户端支持的一种压缩方式
  acceptEncoding.split(/\s*,\s*/).some((encoding) => {
    if(encoding === 'gzip') {
      responseHeaders['Content-Encoding'] = 'gzip';
      return true;
    }
    if(encoding === 'deflate') {
      responseHeaders['Content-Encoding'] = 'deflate';
      return true;
    }
    if(encoding === 'br') {
      responseHeaders['Content-Encoding'] = 'br';
      return true;
    }
    return false;
  });
}
const compressionEncoding = responseHeaders['Content-Encoding']; // 获取选中的压缩方式
res.writeHead(status, responseHeaders);
if(status === 200) {
  const fileStream = fs.createReadStream(filePath);
  if(compress && compressionEncoding) {
    let comp;
    
    // 使用指定的压缩方式压缩文件
    if(compressionEncoding === 'gzip') {
      comp = zlib.createGzip();
    } else if(compressionEncoding === 'deflate') {
      comp = zlib.createDeflate();
    } else {
      comp = zlib.createBrotliCompress();
    }
    fileStream.pipe(comp).pipe(res);
  } else {
    fileStream.pipe(res);
  }
} else {
  res.end();
}
...
```

如上代码所示，根据客户端请求头中的`req.headers['accept-encoding']`信息，通过数组的 some 方法，判断客户端是否支持 gzip、deflate、或者 br 中的一种压缩算法。如果结果为 true，我们就是用对应的压缩算法压缩我们的文件。

## 总结

这一节课我们学习了如何用 zlib 模块提供的压缩算法对 HTTP 内容进行压缩。

浏览器支持 gzip、deflate 和 br 这三种压缩算法，使用它们压缩文件，能够大大节省传输带宽，提升请求的响应速度，减少页面访问的延迟。
