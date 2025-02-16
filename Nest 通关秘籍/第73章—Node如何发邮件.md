### 本资源由 itjc8.com 收集整理
﻿除了微信外，邮件也是我们常用的通讯方式。

那你平时都是怎么收发邮件的呢？

大多数人会回答，就用邮箱客户端啊，比如 qq 邮箱的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-1.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-2.png)

但是这样体验并不好，比如写邮件的时候：

我有个漂亮的 html 页面，想直接把它作为邮件内容。

或者我想用 markdown 来写邮件。

但是它只支持富文本编辑器：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-3.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-4.png)

开启后可以在设置里看到：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-5.png)

然后在帮助中心页面搜索授权码：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-6.png)

按照指引生成一个授权码：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-7.png)

这个是 qq 邮箱特有的一个第三方登录密码：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-8.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-9.png)

可以看到邮件发送成功了。

我们在邮箱里看看：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-10.png)

确实收到了这个邮件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-11.png)

这样我们就用 node 发送了第一个邮件！

而且邮件是支持 html + css 的，比如把我之前写的一个 [3 只小鸟的 button 的 html](https://juejin.cn/post/7167355169934409758) 拿过来：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-12.png)

放到一个文件里，然后发邮件的时候读取这个文件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-13.png)

然后再跑下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-14.png)

收到的邮件也渲染出了这个 html，并且 css 动画也是正常的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-15.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-16.png)

search 的参数我们写了两个：

['SEEN'] 是查询已读的邮件。

['SINCE', '某个日期'] 是查询从这个日期以来的邮件。

当然，还有更多的搜索条件，可以看 [imap 包的文档](https://www.npmjs.com/package/imap)。

我们跑下试试：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-17.png)

可以看到打印了搜索出的符合条件的邮件的 id，然后我们来处理下这些 id：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-18.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-19.png)

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

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-20.png)

日期也确实都是 7 月 10 日的。

我邮箱里有这样一个邮件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-21.png)

可以看到，附件也下载到了 files 目录下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-22.png)

我们把 html 的内容保存到本地文件里：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-23.png)

```javascript
const filePath = path.join(__dirname, 'mails', info.theme + '.html');
fs.writeFileSync(filePath, info.html || info.text)
```
以邮件主题为文件名。

当然，要现在本地创建 mails 这个目录，然后跑一下：

邮件内容和附件内容都保存了下来：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-24.png)

在邮箱里可以看到也是这些邮件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-25.png)

我们打开这些 html 看看，起一个 http-server：

```
npx http-server .
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-26.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第73章-27.png)

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
