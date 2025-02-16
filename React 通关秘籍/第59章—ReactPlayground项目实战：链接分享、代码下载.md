这节我们继续完善 playground 的功能。

代码写完后我们希望能通过链接分享出去，别人访问链接就可以看到这段代码。

vue playground 是有这个功能的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6f3b3bad89946f2915c5686caa1350e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2314&h=1104&s=343797&e=gif&f=31&b=fefefe)

点击分享按钮，链接会复制到剪贴板。

然后在新的浏览器窗口打开，可以看到分享的代码：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/031ec8579ad3450b9ea81c10e6f902c2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2616&h=844&s=201838&e=png&b=212121)

我们也来实现下。

大家想一下，我们要分享或者说保存的是哪部分数据呢？

其实就是 context 里的 files。

files 包含所有文件的信息，编辑、编译、预览都是围绕 files 来的。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0084dc99bda4a8d957ba287127e4536~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2866&h=1214&s=213857&e=png&b=1d1d1d)

而 files 是一个对象，我们只需要 JSON.stringify 一下，就变为字符串了。

我们把它放到 url 后面，然后初始化的时候读取出来 JSON.parse 一下，作为 files 的初始数据不就行了？

在 Context.Provider 里设置下 JSON.stringify(files) 到 location.hash

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1198883870744dabd1b091b0d325635~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1326&h=1082&s=199560&e=png&b=1f1f1f)

```javascript
useEffect(() => {
    const hash = JSON.stringify(files)
    window.location.hash = encodeURIComponent(hash)
}, [files])
```
当 files 内容变化的时候，会同步修改。

这里还要对字符串 encodeURIComponent 下，把 url 里不支持的字符做下转换：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8cc3b2256b640e19d802ee526482f2c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2278&h=936&s=188883&e=png&b=fffefe)

可以看到，确实会把 files 内容保存到 hash。

那把这个 url 分享出去之后，初始化的时候用 hash 中的 files 就好了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06372c1996714ee7930f5de38b93cf39~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1582&h=1108&s=260866&e=png&b=1f1f1f)

```javascript
const getFilesFromUrl = () => {
  let files: Files | undefined
  try {
      const hash = decodeURIComponent(window.location.hash.slice(1))
      files = JSON.parse(hash)
  } catch (error) {
    console.error(error)
  }
  return files
}
```
对 hash decodeURIComponent 一下，然后 JSON.parse 作为 files 的内容。

试下效果：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d612ce4570444c494702e600ce5bffd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2684&h=1124&s=229885&e=png&b=ffffff)

我在 chrome 里改了一下代码内容，新建了一个 Aaa.tsx 组件。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eae2d255a79b429d86679111998fcdcf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1060&h=644&s=76283&e=png&b=fefefd)

在别的浏览器打开这个链接试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ae0ddf0d5514404b9cda86db1b9f518~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2586&h=1508&s=813385&e=gif&f=65&b=e3dddb)

可以看到，App.tsx、Aaa.tsx 组件都是我们改动的内容。

这样分享 url 功能就完成了。

当然，直接把文件内容放到 hash 上不大好，太长了，我们要压缩下。

用 [fflate](https://www.npmjs.com/package/fflate) 这个包：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a5fde269f3b471a97720d5f9dbc9859~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2176&h=1140&s=359307&e=png&b=fefefe)

安装下：

```
npm install --save fflate
```
在 utils.ts 添加两个方法

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fb58f8008f24d0c912867f44036a9ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1318&h=892&s=205051&e=png&b=1f1f1f)
```javascript
import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate"

export function compress(data: string): string {
    const buffer = strToU8(data)
    const zipped = zlibSync(buffer, { level: 9 })
    const str = strFromU8(zipped, true)
    return btoa(str)
}

export function uncompress(base64: string): string {
    const binary = atob(base64)

    const buffer = strToU8(binary, true)
    const unzipped = unzlibSync(buffer)
    return strFromU8(unzipped)
}
```

这里的 atob、btoa 是二进制的 ASC 码和 base64 的字符串的转换：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f4ea10d30874dd5a8e0f66d2f8ddd98~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1614&h=1146&s=183006&e=png&b=fdfdfd)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdd8ca164ae54b068f212b4ec6f1b0cb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1682&h=1170&s=200892&e=png&b=fdfdfd)

compress 方法里，我们先调用 fflate 包的 strToU8 把字符串转为字节数组，然后 zlibSync 压缩，之后 strFromU8 转为字符串。

最后用 btoa 把这个 base64 编码的字符串转为 asc 码。

uncompress 方法正好反过来。

我们调用下试试效果：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d19c8a2916a403398232f6ceda60bc2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1376&h=718&s=144946&e=png&b=1f1f1f)

```javascript
useEffect(() => {
    const hash = compress(JSON.stringify(files))
    window.location.hash = hash
}, [files])
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e6665b5ae48491e8d99c9112531c0c1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1484&h=812&s=201455&e=png&b=1f1f1f)

```javascript
const getFilesFromUrl = () => {
  let files: Files | undefined
  try {
      const hash = uncompress(window.location.hash.slice(1))
      files = JSON.parse(hash)
  } catch (error) {
    console.error(error)
  }
  return files
}
```
现在，代码内容会压缩后以 asc 码字符串的方式保存在 url 里：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b39a77d2658d410fb34a412a1b92b37a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2708&h=1154&s=240694&e=png&b=ffffff)

在另一个窗口里打开这个 url：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c26802ad92a4663a0d5f1dca696fa26~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2686&h=1132&s=231811&e=png&b=fefefe)

内容同样能恢复。

这样，代码分享功能就完成了。

在 Header 里加个按钮：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d240b6e6c17b451f9dbaafc85dda037d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1240&h=1100&s=238679&e=png&b=1f1f1f)

```javascript
<ShareAltOutlined 
  style={{marginLeft: '10px'}}
  onClick={() => {
    copy(window.location.href);
    message.success('分享链接已复制。')
  }}
/>
```
这里用到了 copy-to-clipboard 包，安装下：

```
npm install --save copy-to-clipboard
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/437fbf2f2cb04bb49caf69f36d62f846~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2858&h=1264&s=367145&e=gif&f=40&b=fdfdfd)

点击分享按钮，会把 url 复制到剪贴板，可以直接粘贴。

然后我们再来实现下代码下载功能：

我们需要在浏览器里把多个文件打成 zip 包，这需要用到 jszip：

```
npm install --save jszip
```
然后触发代码下载，我们用 file-saver：

```
npm install --save file-saver
npm install --save-dev @types/file-saver 
```
在 utils.ts 加一个 downloadFiles 方法：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d363bb2e5b354da7a0586636ff18c08b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1358&h=1098&s=246991&e=png&b=1f1f1f)

```javascript
export async function downloadFiles(files: Files) {
    const zip = new JSZip()

    Object.keys(files).forEach((name) => {
        zip.file(name, files[name].value)
    })

    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, `code${Math.random().toString().slice(2, 8)}.zip`)
}
```

然后在 Header 加一个按钮：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29833e2b417c410b80bf67274711f9be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1318&h=1034&s=195597&e=png&b=1f1f1f)

```javascript
<DownloadOutlined 
  style={{marginLeft: '10px'}}
  onClick={async () => {
    await downloadFiles(files);
    message.success('下载完成')
  }}
/>
```
试一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d57925587ae4a188fd01d4963abffc6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2852&h=1310&s=2529535&e=gif&f=68&b=fefefe)

下载成功！

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/react-playground-project)，可以切换到这个 commit 查看：

```
git reset --hard ea67b94f512f023779077dfedca02e87c6d59b4f
```

## 总结

这节我们实现了链接分享、代码下载功能。

链接分享原理就是把 files 信息 JSON.stringify 之后保存到 location.hash。

然后初始化的时候从 location.hash 读取出来 JSON.parse 之后设置到 files。

不过最好是做下压缩，我们用 fflate 这个包来对字符串进行压缩，然后用 btoa 转为 asc 码字符串。

代码下载则是基于 jszip 和 file saver 包实现的。

这样，playground 里写的代码内容就可以通过 url 分享出去，并且可以下载了。
