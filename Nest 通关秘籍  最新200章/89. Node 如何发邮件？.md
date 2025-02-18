除了微信外，邮件也是我们常用的通讯方式。

那你平时都是怎么收发邮件的呢？

大多数人会回答，就用邮箱客户端啊，比如 qq 邮箱的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b92c0eae252a47a8a22512126f4fe0e3~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf6ac87027e24e3b9a55f63346be519e~tplv-k3u1fbpfcp-watermark.image?)

但是这样体验并不好，比如写邮件的时候：

我有个漂亮的 html 页面，想直接把它作为邮件内容。

或者我想用 markdown 来写邮件。

但是它只支持富文本编辑器：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01086b793a8b4063ac6a5930140f952a~tplv-k3u1fbpfcp-watermark.image?)

再比如收邮件的时候，我想把一些重要邮件的内容保存下来，附件啥的都下载到本地。

但是邮件多了的话，一个个手动搞太麻烦了。

有没有什么更好的方式呢？

当然是有的，作为一个专业的 Node 程序员，自然要用代码的方式来收发邮件了！

邮件有专门的协议：

**发邮件用 SMTP 协议。**

**收邮件用 POP3 协议、或者 IMAP 协议。**

并且在 node 里也有对应的包，发邮件用 nodemailer 包，收邮件用 imap 包。

我们来试试：

首先，要开启 smtp、imap 等服务，这里以 qq 邮箱举例（其他邮箱也类似）：

在邮箱帮助中心 https://service.mail.qq.com/ 可以搜到如何开启 smtp、imap 等服务：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0224a90307f8434dbbfa14bd294b39e9~tplv-k3u1fbpfcp-watermark.image?)

开启后可以在设置里看到：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9000e01314fc470b87a406fb254d003b~tplv-k3u1fbpfcp-watermark.image?)

然后在帮助中心页面搜索授权码：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45036a9ade4f47339c0e4c3bf7a12840~tplv-k3u1fbpfcp-watermark.image?)

按照指引生成一个授权码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48886d0d39564171ac029998ef538cba~tplv-k3u1fbpfcp-watermark.image?)

这个是 qq 邮箱特有的一个第三方登录密码：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22911ac0100b4f2a9f0e829b67a1e57e~tplv-k3u1fbpfcp-watermark.image?)

然后就可以开始写代码了：

```javascript
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 587,
    secure: false,
    auth: {
        user: 'xxxxx@qq.com',
        pass: '你的授权码'
    },
});

async function main() {
  const info = await transporter.sendMail({
    from: '"guang" <xxxx@qq.com>',
    to: "xxxx@xx.com",
    subject: "Hello 111", 
    text: "xxxxx"
  });

  console.log("邮件发送成功：", info.messageId);
}

main().catch(console.error);
```
安装 nodemailer 包，然后执行上面的代码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1de52723b3e745b1aae9ccc95899d04b~tplv-k3u1fbpfcp-watermark.image?)

可以看到邮件发送成功了。

我们在邮箱里看看：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2811274a2652417fbfff8148640c0e4c~tplv-k3u1fbpfcp-watermark.image?)

确实收到了这个邮件：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f8c9963490a4a78b6a6c26530e3c7f6~tplv-k3u1fbpfcp-watermark.image?)

这样我们就用 node 发送了第一个邮件！

而且邮件是支持 html + css 的，比如把我之前写的一个 [3 只小鸟的 button 的 html](https://juejin.cn/post/7167355169934409758) 拿过来：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cfe464929c448648c2dae4a5d6eb788~tplv-k3u1fbpfcp-watermark.image?)

放到一个文件里，然后发邮件的时候读取这个文件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98d204cc417b4ff9808fc7d15cf90002~tplv-k3u1fbpfcp-watermark.image?)

然后再跑下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16aa6adb898148649ea359e17a5b6fc9~tplv-k3u1fbpfcp-watermark.image?)

收到的邮件也渲染出了这个 html，并且 css 动画也是正常的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88eeaf82f5bc42f889e2fd7fcddd5984~tplv-k3u1fbpfcp-watermark.image?)

那是不是可以加一些 js 呢？

想多了，邮件里可以包含任何 html+ css，但是不支持 js。

不过基于 html + css，我们就已经可以实现各种炫酷的邮件了。

就像前面说的 markdown 格式来写邮件，这个加一个 markdown 转 html 的包，然后作为邮件的 html 内容发送就好了。

也就是说，通过代码的方式，我们可以做出更炫酷的邮件来。

发邮件我们会了，那如何通过 node 来收邮件呢？

收邮件是用 pop3 或者 imap 协议，需要换一个包。

```javascript
const Imap = require('imap');

const imap = new Imap({
    user: 'xxx@qq.com',
    password: '你的授权码',
    host: 'imap.qq.com',
    port: 993,
    tls: true
});

imap.once('ready', () => {
    imap.openBox('INBOX', true, (err) => {
        imap.search([['SEEN'], ['SINCE', new Date('2023-07-10 19:00:00').toLocaleString()]], (err, results) => {
            if (!err) {
                console.log(results);
            } else {
                throw err;
            }
        });
    });
});

imap.connect();
```
安装 imap 的包，然后填入 qq 邮箱的 imap 服务器的域名、端口，填入用户名和授权码，就可以连接了。

这里的 imap 服务器的信息也是在帮助中心里搜索：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea3ac2f7d42045fc89be427d743ba163~tplv-k3u1fbpfcp-watermark.image?)

search 的参数我们写了两个：

['SEEN'] 是查询已读的邮件。

['SINCE', '某个日期'] 是查询从这个日期以来的邮件。

当然，还有更多的搜索条件，可以看 [imap 包的文档](https://www.npmjs.com/package/imap)。

我们跑下试试：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19eb0a88b68f4d8c834e036f8ea57bac~tplv-k3u1fbpfcp-watermark.image?)

可以看到打印了搜索出的符合条件的邮件的 id，然后我们来处理下这些 id：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00ae4bdbd1d3420e99090cad776606b6~tplv-k3u1fbpfcp-watermark.image?)

```javascript
const { MailParser } =require('mailparser');
const fs = require('fs');
const path = require('path');

function handleResults(results) {
    imap.fetch(results, { 
        bodies: '',
    }).on('message', (msg) => {
        const mailparser = new MailParser();

        msg.on('body', (stream) => {

            

        });
    });
}

```
这里用 imap.fetch 来请求这些 id 的内容，bodies 为 '' 是查询 header + body 的意思：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e3f9dde7ec14b6daa10976e81c2ad00~tplv-k3u1fbpfcp-watermark.image?)

然后处理下 body 的内容，把结果保存到 info 对象里。

这里解析邮件内容要使用 mailparser 这个包：

```javascript
const { MailParser } =require('mailparser');
const fs = require('fs');
const path = require('path');
const Imap = require('imap');


function handleResults(results) {
    imap.fetch(results, { 
        bodies: '',
    }).on('message', (msg) => {
        const mailparser = new MailParser();

        msg.on('body', (stream) => {

            const info = {};
            stream.pipe(mailparser);

            mailparser.on("headers", (headers) => {
                info.theme = headers.get('subject');
                info.form = headers.get('from').value[0].address;
                info.mailName = headers.get('from').value[0].name;
                info.to = headers.get('to').value[0].address;
                info.datatime = headers.get('date').toLocaleString();
            });

            mailparser.on("data", (data) => {
                if (data.type === 'text') {
                    info.html = data.html;
                    info.text = data.text;
                    console.log(info);
                }
                if (data.type === 'attachment') {
                    const filePath = path.join(__dirname, 'files', data.filename);
                    const ws = fs.createWriteStream(filePath);
                    data.content.pipe(ws);
                }
            });
        });
    });
}
```

这部分还是容易看懂的，就是把 headers 的信息提取出来，把邮件 body 的信息提取出来，放到 info
对象里，打印。

如果有附件，就写到 files 目录下。

我们在本地创建个 files 目录，然后跑一下。

可以看到，我们前面发的那两个邮件都取到了。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0b1c3627ab64a0eab41dc9a336c0315~tplv-k3u1fbpfcp-watermark.image?)

日期也确实都是 7 月 10 日的。

我邮箱里有这样一个邮件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de8337f6903345bfa2aba85a5f1709bb~tplv-k3u1fbpfcp-watermark.image?)

可以看到，附件也下载到了 files 目录下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4882b3059d6b484da4390e4047420cd6~tplv-k3u1fbpfcp-watermark.image?)

我们把 html 的内容保存到本地文件里：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19d2c63615d94709823359ba7d6b6716~tplv-k3u1fbpfcp-watermark.image?)

```javascript
const filePath = path.join(__dirname, 'mails', info.theme + '.html');
fs.writeFileSync(filePath, info.html || info.text)
```
以邮件主题为文件名。

当然，要现在本地创建 mails 这个目录，然后跑一下：

邮件内容和附件内容都保存了下来：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f334573062dd4f499677968c60c265fd~tplv-k3u1fbpfcp-watermark.image?)

在邮箱里可以看到也是这些邮件：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8351c9d67104b86b88944dbfab86b09~tplv-k3u1fbpfcp-watermark.image?)

我们打开这些 html 看看，起一个 http-server：

```
npx http-server .
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7e13671716e40fa871186fcb12db58e~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b2e7aec109740918a71ac4d2d309f84~tplv-k3u1fbpfcp-watermark.image?)

和在邮箱里看一模一样。

这样，我们就把邮件内容和附件都保存了下来。

你想保存一些重要邮件的时候，还需要手动一个个复制和下载附件么？

不需要，用 node 写代码保存不更方便么？

收邮件部分的代码如下：

```javascript
const { MailParser } =require('mailparser');
const fs = require('fs');
const path = require('path');
const Imap = require('imap');

const imap = new Imap({
    user: 'xx@qq.com',
    password: '你的授权码',
    host: 'imap.qq.com',
    port: 993,
    tls: true
});

imap.once('ready', () => {
    imap.openBox('INBOX', true, (err) => {
        imap.search([['SEEN'], ['SINCE', new Date('2023-07-10 19:00:00').toLocaleString()]], (err, results) => {
            if (!err) {
                handleResults(results);
            } else {
                throw err;
            }
        });
    });
});


function handleResults(results) {
    imap.fetch(results, { 
        bodies: '',
    }).on('message', (msg) => {
        const mailparser = new MailParser();

        msg.on('body', (stream) => {

            const info = {};
            stream.pipe(mailparser);
            mailparser.on("headers", (headers) => {
                info.theme = headers.get('subject');
                info.form = headers.get('from').value[0].address;
                info.mailName = headers.get('from').value[0].name;
                info.to = headers.get('to').value[0].address;
                info.datatime = headers.get('date').toLocaleString();
            });

            mailparser.on("data", (data) => {
                if (data.type === 'text') {
                    info.html = data.html;
                    info.text = data.text;

                    const filePath = path.join(__dirname, 'mails', info.theme + '.html');
                    fs.writeFileSync(filePath, info.html || info.text)

                    console.log(info);
                }
                if (data.type === 'attachment') {
                    const filePath = path.join(__dirname, 'files', data.filename);
                    const ws = fs.createWriteStream(filePath);
                    data.content.pipe(ws);
                }
            });
        });
    });
}

imap.connect();
```

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/mail-test)。

## 总结

邮件是常用的通讯方式，我们一般是通过邮箱客户端来收发邮件。

但是这样不够方便：

比如写邮件不能直接贴 html + css，不能写 markdown，收邮件不能按照规则自动下载附件、自动保存邮件内容。

这些需求我们都能通过代码来自己实现。

发邮件是基于 SMTP 协议，收邮件是基于 POP3 或 IMAP 协议。

node 分别有 nodemailer 包和 imap 包用来支持收发邮件的协议。

我们通过 nodemailer 发送了 html 的邮件，可以发送任何 html+css 的内容。

通过 imap 实现了邮件的搜索，然后用 mailparser来做了内容解析，然后把邮件内容和附件做了下载。

能够写代码来收发邮件之后，就可以做很多自动化的事情了：

比如定时自动发一些邮件，内容是从数据库查出来的，比如自动拉取邮件，根据一定的规则来保存邮件和附件内容等。

这就是 Node 里收发邮件的方式。
