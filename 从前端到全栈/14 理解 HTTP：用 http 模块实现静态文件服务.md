在了解了如何使用 http 模块实现了一个简单的 HTTP 服务之后，这一节课，我们将实现一个比较实用的静态文件 HTTP 服务。

所谓的静态文件 HTTP 服务，就是当浏览器建立 HTTP 请求的时候，根据 URL 地址返回对应的文件。

比如浏览器访问 http://localhost:8080/index.html， 那就返回 www 子目录下的 index.html 文件；而浏览器访问 http://localhost:8080/assets/js/app.js 那就返回 www 子目录下的`./assets/js/app.js`文件。

## 读取资源文件并返回

根据需求，静态文件服务器主要包含 3 个内容：

1. 解析请求路径
2. 读取请求的文件
3. 返回文件内容

我们先来看一下完整的代码：

```js
// http-static.js

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  let filePath = path.resolve(__dirname, path.join('www', url.fileURLToPath(`file:///${req.url}`))); // 解析请求的路径

  if(fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const isDir = stats.isDirectory();
    if(isDir) {
      filePath = path.join(filePath, 'index.html');
    }
    if(!isDir || fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath); // 读取文件内容
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); 
      return res.end(content); // 返回文件内容
    }
  }
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.end('<h1>Not Found</h1>');
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(8080, () => {
  console.log('opened server on', server.address());
});
```

如上代码所示：

第一步：我们通过`url.fileURLToPath`方法将`req.url`解析成文件路径。然后我们用`path.join`将相对路径`www`和文件路径拼起来，最后通过`path.resolve(__dirname, 相对路径)`得到文件的绝对路径`filePath`。

第二步，根据`filePath`，我们使用`fs.exitsSync`判断文件是否存在。这时的`filePath`有两种情况，一种情况直接是文件，例如我们访问`http://localhost:8080/index.html`，这样的话这里的`filePath`对应到的直接是文件。另一种情况是我们省略文件，访问`http://localhost:8080/`。按照 HTTP 服务的 URL 约定，这时候相当于访问了这个路径下的`index.html`文件。

所以我们要判断当前的`filePath`究竟是文件还是目录，如果是目录，我们还要再 join 一次，变成 index.html 文件。

```js
const stats = fs.statSync(filePath);
const isDir = stats.isDirectory();
if(isDir) {
  filePath = path.join(filePath, 'index.html');
}
```

判断是路径还是文件，我们可以使用 fs 模块的 statSync 方法来判断，这个方法返回一个 stats 对象，这个对象上有文件的状态信息。如果是目录，我们再加上`index.html`，然后再判断一次。

最后，我们通过`fs.readFileSync(filePath);`读取文件内容，通过`res.end`方法将返回内容，这样我们就实现了静态资源服务的基本内容。

但是，这个版本存在一些问题。

## 理解 MIME 类型

这个版本最大的问题是它只支持 HTML 格式。HTTP 服务可不止处理 HTML 文件，还可以处理各种文件，如图片、CSS、JS、视频、音频等等。

我们修改一下 www/index.html 文件，在这个网页中添加一张图片：

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Index</title>
</head>
<body>
  <h1>君喻教育</h1>
  <img src="assets/image/logo.png">
</body>
</html>
```

然后启动我们的静态文件服务，访问`http://localhost:8080/index.html`。

我们发现网页上的图片加载失败了。

![](https://p4.ssl.qhimg.com/t0118fb5b4b4aa49de8.jpg)

我们通过浏览器的开发者工具查看 HTTP 请求，问题出现在服务器对图片请求的响应上：

![](https://p0.ssl.qhimg.com/t0124a78d4a52d96617.jpg)

浏览器的请求头中，Accept 字段值是`image/webp,image/apng,image/*,*/*;q=0.8`，而我们的响应头中，返回的`Content-Type`却是`text/html`，这样浏览器当然无法识别图片格式了。

实际上，**浏览器可以处理多种格式的媒体文件，遵循的标准叫做 MIME**。

MIME 全称是 Multipurpose Internet Mail Extensions，即“多用途互联网邮件扩展”。为什么这里会和“邮件”扯上关系，这里有些历史原因。在 1992 年，工程师们扩展电子邮件的格式，让电子邮件从传统的只能处理 ASCII 字符变为能够处理多种媒体格式。后来，浏览器处理媒体文件也遵循了这一标准，采用 MIME 类型来表示媒体文件，这一标准定义在 [IETF RFC 6838](https://tools.ietf.org/html/rfc6838) 中。

MIME 标准以`type/subtype`，即主类型/子类型，来表示一个文件的格式。MIME 类型对大小写不敏感，通常都写成小写形式。

HTTP 请求常见的主类型如下：

| 类型 | 描述 | 典型示例 |
| --- | --- | --- |
| text | 表明文件是普通文本，理论上是人类可读 | text/plain, text/html, text/css, text/javascript |
| image | 表明是某种图像。不包括视频，但是动态图（比如动态 gif）也使用image类型 | image/gif, image/png, image/jpeg, image/bmp, image/webp, image/x-icon |
| audio | 表明是某种音频文件 | audio/midi, audio/mpeg, audio/webm, audio/ogg, audio/wav |
| video | 表明是某种视频文件 | video/webm, video/ogg |
| application | 表明是某种二进制数据 | application/octet-stream, application/pkcs12, application/vnd.mspowerpoint, application/xhtml+xml, application/xml,  application/pdf |

浏览器的请求头中的 Accept 字段包含该请求期望的 MIME type，可以有多个，以逗号分隔。

所以，`Accept: image/webp,image/apng,image/*,*/*;q=0.8`表示浏览器期望的格式依次是`image/webp`、`image/apng`、`image/*`、`*/*`。 MIME 类型支持通配符`*`，最后的`q=0.8`表示相对品质因子，也就是说客户端“期望”是这个类型的权重，这个值给服务器参考，如果有多个可能返回的类型带有品质因子，服务器优先返回品质因子大的类型。

如果要实现规范的 MIME 类型协商，服务器就要根据收到的 HTTP 请求的 Accept 字段来选择返回的内容，但这是一个比较复杂的过程。一般的静态 HTTP 服务，有一个简单而普遍的做法，是根据 URL 的文件扩展名来决定文件类型。

因为我们的请求 URL 的路径是`assets/image/logo.png`，扩展名是`png`，所以我们响应报文中的`Content-type`就应该是`image/png`。

```js
...省略其他代码

if(fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath);
  const {ext} = path.parse(filePath);
  if(ext === '.png') {
    res.writeHead(200, {'Content-Type': 'image/png'});
  } else {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  }
  return res.end(content);
}

...
```

我们只要增加一个判断，通过`path.parse(filePath)`得到文件扩展名，如果这个扩展名是`.png`，那么给响应的`Content-Type`设置为`image/png`即可。

这么做确实能够解决问题，现在图片的内容已经能够正常展现出来了：

![](https://p3.ssl.qhimg.com/t0178700f186debc72b.jpg)

但是这么做不通用，如果请求其他的文件类型，难道我们需要不断的增加 if 条件判断吗？这显然不合适。

我们可以使用专门处理 MIME 类型的第三方库 mime 来转换对应的 MIME 类型。

首先，安装第三方 mime 包：

```bash
$ npm i mime --save
```

然后我们再修改服务器代码：

```js
...
const mime = require('mime'); // 引入mime包

const server = http.createServer((req, res) => {
  let filePath = path.resolve(__dirname, path.join('www', url.fileURLToPath(`file:///${req.url}`)));

  if(fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if(stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if(fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      const {ext} = path.parse(filePath);
      res.writeHead(200, {'Content-Type': mime.getType(ext)});
      return res.end(content);
    }
  }
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.end('<h1>Not Found</h1>');
});
```

可以看到，我们直接使用`mime.getType(ext)`就能处理所有文件类型了。

到此，我们虽然实现了一个简单的静态资源 HTTP 服务器，能够处理各种浏览器能够识别的媒体文件。但是，这个 http 服务器是采用 fs.readFileSync 来读取文件，又是通过 res.end 发送给客户端的，这种方式需要等待文件全部读取结束后，才发送给客户端。所以，这种方式只适用与小文件，如果处理大文件，比如大的图片或者音频视频文件等，这么操作会有两类问题。其一是会需要很长时间的读文件操作，造成 I/O 瓶颈，使得客户端需要等待良久才能得到响应。其二是要把大量数据读入内存，然后返回，也造成很大的内存开销。这显然是不合适的。

要解决这个问题，更好的方式是使用流式处理。

## stream 模块

在 Node.js 中，stream 模块定义了可读写的流。

**所谓可读写的流，形象地表示就如同水流，源（Source）对象中的数据内容会像水流一样流向目的(Dest)对象。**

![](https://p1.ssl.qhimg.com/t01313250f2f2ecc394.png)

在 Node.js 中，文件、 HTTP 请求和响应都是流式对象，它们继承了 Stream 对象，还有像我们前面接触过的 stdin 和 stdout 其实也是流式对象。

流式对象有很多用途，在后续课程中我们有机会继续讨论。在静态 HTTP 服务器上，我们直接可以用最简单的用法，将文件内容以文件流的形式读取，然后将文件流和响应流（即 res 对象），通过 pipe 方法连接起来。

如下代码所示：

```js
const server = http.createServer((req, res) => {
  let filePath = path.resolve(__dirname, path.join('www', url.fileURLToPath(`file:///${req.url}`)));

  if(fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if(stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if(fs.existsSync(filePath)) {
      const {ext} = path.parse(filePath);
      res.writeHead(200, {'Content-Type': mime.getType(ext)});
      const fileStream = fs.createReadStream(filePath); // 以流的方式读取文件内容
      fileStream.pipe(res); // pipe 方法可以将两个流连接起来，这样数据就会从上游流向下游
    }
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>Not Found</h1>');
  }
});
```

这段代码中，我们的文件内容通过`fs.createReadStream`以流的方式读取，然后通过`pipe`方法输送到`res`即响应流对象中。这里，Response 对象内部会处理从 fileStream 收到的数据，把接收的数据不断地发送给客户端浏览器，而不是像前面的实现方式那样要等待整个文件的内容完全读出来再发送。这样就可以避免文件内容太大时，内存的消耗以及文件 I/O 导致的阻塞了。

整个处理过程如下：

![](https://p0.ssl.qhimg.com/t016efe0b3d92bb9fbd.jpg)

如上图所以，res 对象可以一边从流中读取数据一边将数据返回到客户端，大大减少了用户的等待时间。

> 关于 Stream 的使用，在掘金上有一篇比较深入的文章[《想学 Node.js，stream 先有必要搞清楚》](https://juejin.cn/post/6844903891083984910)，推荐大家有时间阅读一下。

## 总结

这一节课，我们实现了静态文件服务器，一共有 3 个步骤：

1. 将 URL 路径转换成文件路径，然后判断请求的文件是否存在。如果存在，准备读取文件。

2. 根据文件的扩展名，判断文件的 MIME 类型。根据 MIME 类型设置`Content-Type`响应头。MIME 类型的判断可以使用第三方模块`mime`。

3. 将文件内容返回给客户端浏览器，有两个办法。

- 一个办法是用我们以前学习过的`fs.readFileSync`将文件内容读出，用`res.end`返回给客户端。但是这个办法处理大文件可能会导致文件 I/O 的阻塞。
- 另一个办法是使用流式接口，通过`fs.createReadStream`创建文件流，然后用`.pipe`方法将文件流和 res 响应流连接起来，让文件内容的数据就从文件流流向 res 响应流，从而使得 res 对象可以一边获取文件流，一边将内容返回给客户端，避免了大文件 I/O 阻塞。
