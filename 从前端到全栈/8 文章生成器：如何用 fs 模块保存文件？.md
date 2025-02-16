这一节课我们要做两件事情，一是**实现文章生成的模块**，二是**使用 fs 模块将生成的文章保存成文件**。

我们把生成文章模块命名为`generator.js`，它导出 API —— `generate`函数，这个函数根据传入的 title（文章主题）和语料库以及配置信息来生成文章内容。它的函数签名如下：

```js
export function generate(title, {corpus, min = 6000, max = 10000}) {
  ...
}
```

参数 corpus 是语料库 JSON 文件，即我们上一节课从`corpus/data.json`文件中读取的内容，min 是文章最少字数，max 是文章最多字数，默认值设为 6000 和 10000。

## 生成句子

接下来我们要定义句子生成的规则。先来回顾一下我们的 corpus 的结构：

```json
{
  "title": [
    "一天掉多少根头发",
    "中午吃什么",
    ...
  ],
  "famous":[
    "爱迪生{{said}}，天才是百分之一的勤奋加百分之九十九的汗水。{{conclude}}",
    "查尔斯·史{{said}}，一个人几乎可以在任何他怀有无限热忱的事情上成功。{{conclude}}",
    "培根说过，深窥自己的心，而后发觉一切的奇迹在你自己。{{conclude}}",
    ...
  ],
  "bosh_before": [
    "既然如此，",
    "那么，",
    "我认为，",
    ...
  ],
  "bosh":[
    "{{title}}的发生，到底需要如何做到，不{{title}}的发生，又会如何产生。 ",
    "而这些并不是完全重要，更加重要的问题是，",
    "{{title}}，到底应该如何实现。 ",
    ...
  ],
  "conclude":[
    "这不禁令我深思。 ",
    "带着这句话，我们还要更加慎重的审视这个问题: ",
    "这启发了我。",
    ...
  ],
  "said":[
    "曾经说过",
    "在不经意间这样说过",
    "说过一句著名的话",
    ...
  ]
}
```

文章中的句子有两种类型，名人名言定义在 corpus 对象的`famous`字段中；废话定义在corpus对象的`bosh`字段中。剩下的几个字段`bosh_before`、`said`和`conclude`是用来修饰和替换`famous`以及`bosh`里面的内容的。

现在，我们利用上一节课实现的随机模块的 API，将句子中的内容从 famous、bosh 以及其他字段的数组中随机取出一条：

```js
const pickFamous = createRandomPicker(corpus.famous);
const pickBosh = createRandomPicker(corpus.bosh);

pickFamous(); // 随机取出一条名人名言

pickBosh(); // 随机取出一条废话
```

语料库中名人名言和废话的内容都是模板，形式类似于下面这样：

```js
"歌德曾经{{said}}，流水在碰到底处时才会释放活力。{{conclude}}" // 名人名言

"{{title}}的发生，到底需要如何做到，不{{title}}的发生，又会如何产生。 " // 废话
```

因此，我们要将占位符`{{said}}`用`corpus.said`中随机取的内容替换，将占位符`{{conclude}}`用`corpus.conclude`中随机取的替换，将`{{title}}`用传入的title字符串替换。

我们可以实现一个替换句子的通用方法：

```js
function sentence(pick, replacer) {
  let ret = pick(); // 返回一个句子文本
  for(const key in replacer) { // replacer是一个对象，存放替换占位符的规则
    // 如果 replacer[key] 是一个 pick 函数，那么执行它随机取一条替换占位符，否则将它直接替换占位符
    ret = ret.replace(new RegExp(`{{${key}}}`, 'g'),
      typeof replacer[key] === 'function' ? replacer[key]() : replacer[key]);
  }
  return ret;
}
```

sentence 函数接受两个参数：`pick`和`replacer`。`pick`表示随机获取数组内容（比如 famous、bosh 等）的函数。`replacer`是一个存放替换占位符的对象，如果 `replacer[key]` 是一个 pick 函数，那么执行它随机取一条替换占位符，否则将它直接替换占位符。

然后，我们就可以随便生成句子了：

```js
const {famous, bosh_before, bosh, said, conclude} = corpus;

const [pickFamous, pickBoshBefore, pickBosh, pickSaid, pickConclude] = [famous, bosh_before, bosh, said, conclude].map((item) => {
  return createRandomPicker(item);
});

sentence(pickFamous, {said: pickSaid, conclude: pickConclude}); // 生成一条名人名言

sentence(pickBosh, {title});  // 生成一条废话
```

## 生成文章

句子生成了之后，它们该如何组成段落和文章呢？我们知道，段落由句子组成，文章又由段落组成，所以可以进行如下假设：

- 规定每个段落的字数在 200~500 字之间。每个段落包含 20%的名人名言（famous），80% 的废话（bosh)。其中，废话里带前置从句（bosh_before）的废话占文章句子的 30%，不带前置从句的废话占文章句子的 50%；

- 规定文章的字数在用户设置的最小字数到最大字数之间。

按照上述的规则，我们来生成文章。

```js
const articleLength = randomInt(min, max);

while(totalLength < articleLength) {
  // 如果文章内容的字数未超过文章总字数 继续生成段落
  let section = ''; // 添加段落
  const sectionLength = randomInt(200, 500); // 将段落长度设为200到500字之间
  // 如果当前段落字数小于段落长度，或者当前段落不是以句号。和问号？结尾
  while(section.length < sectionLength || !/[。？]$/.test(section)) {
    // 取一个 0~100 的随机数
    const n = randomInt(0, 100);
    if(n < 20) { 
      添加名人名言
    } else if(n < 50) {
      添加带前置从句的废话
    } else {
      添加不带前置从句的废话
    }
  }
  // 段落结束，更新总长度
  totalLength += section.length;
  // 将段落存放到文章列表中
  article.push(section);
}
```

这里面有一个细节，因为我们语料库中有一些句子不是以句号或问号结尾，比如结论（conclude）中有这样以冒号结尾的句子：

```js
"带着这句话，我们还要更加慎重的审视这个问题： ",
```

这样的句子，放在段落末尾不合适，因此段落结束除了要判断字数大于段落字数外，还要判断当前结尾处是问号或句号，才能结束当前段落另起一段。这样我们就实现了 generate 函数，它的完整代码如下：

```js
export function generate(title, {
  corpus,
  min = 6000, // 文章最少字数
  max = 10000, // 文章最多字数
} = {}) {
  // 将文章长度设置为 min 到 max之间的随机数
  const articleLength = randomInt(min, max);

  const {famous, bosh_before, bosh, said, conclude} = corpus;
  const [pickFamous, pickBoshBefore, pickBosh, pickSaid, pickConclude] = [famous, bosh_before, bosh, said, conclude].map((item) => {
    return createRandomPicker(item);
});

const article = [];
let totalLength = 0;

while(totalLength < articleLength) {
  // 如果文章内容的字数未超过文章总字数
  let section = ''; // 添加段落
  const sectionLength = randomInt(200, 500); // 将段落长度设为200到500字之间
  // 如果当前段落字数小于段落长度，或者当前段落不是以句号。和问号？结尾
  while(section.length < sectionLength || !/[。？]$/.test(section)) {
    // 取一个 0~100 的随机数
    const n = randomInt(0, 100);
    if(n < 20) { // 如果 n 小于 20，生成一条名人名言，也就是文章中有百分之二十的句子是名人名言
      section += sentence(pickFamous, {said: pickSaid, conclude: pickConclude});
    } else if(n < 50) {
      // 如果 n 小于 50，生成一个带有前置从句的废话
      section += sentence(pickBoshBefore, {title}) + sentence(pickBosh, {title});
    } else {
      // 否则生成一个不带有前置从句的废话
      section += sentence(pickBosh, {title});
    }
  }
  // 段落结束，更新总长度
  totalLength += section.length;
  // 将段落存放到文章列表中
  article.push(section);
}

// 将文章返回，文章是段落数组形式
return article;
}
```

## 将文章输出

实现了生成文章的 generate 函数，我们就可以将它输出到控制台，同时也可以保存成文件。我们先来看一下如何将它输出到控制台。我们改写一下 index.js 文件，把它变成下面这个样子：

```js
import {readFileSync} from 'fs';
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';

import {generate} from './lib/generator.js';
import {createRandomPicker} from './lib/random.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadCorpus(src) {
  const path = resolve(__dirname, src);
  const data = readFileSync(path, {encoding: 'utf-8'});
  return JSON.parse(data);
}

const corpus = loadCorpus('corpus/data.json');

const pickTitle = createRandomPicker(corpus.title);
const title = pickTitle();

const article = generate(title, {corpus});
console.log(`${title}\n\n    ${article.join('\n    ')}`);
```

和第 6 节课相比，文件内容改动并不大。我们只是将读取 JSON 文件的代码封装成了一个函数`loadCorpus`，然后通过`pickTitle`随机选择一个 title，接着调用`.lib/generator.js`模块的 generator 方法拿到 article 数组，再通过字符串的 join 方法将数组里面的段落内容拼成文章，最后用`console.log`输出。

控制台输出的内容如下图：

![](https://p4.ssl.qhimg.com/t01bd42a089fb930de8.jpg)

这样我们就将内容输出到控制台了。

## 用 fs 保存文件

如果我们想要将生成的文章保存下来，我们可以继续用第 6 节课学过的 fs 模块。fs 的`writeFile/writeFileSync`正好和`readFile/readFileSync`对应。我们可以直接使用`writeFileSync`。先封装一个保存文件的函数：

```js
function saveCorpus(title, article) {
  const outputDir = resolve(__dirname, 'output');
  const outputFile = resolve(outputDir, `${title}.txt`);

  // 检查outputDir是否存在，没有则创建一个
  if(!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }

  const text = `${title}\n\n    ${article.join('\n    ')}`;
  writeFileSync(outputFile, text); // 将text写入outputFile文件中

  return outputFile;
}
```

这里我们除了使用`writeFileSync`外，还使用了`existsSync`和`mkdirSync`，其中`existsSync`判断当前文件目录下是否有 output 子目录，如果没有的话，则通过`mkdirSync`创建它。然后通过`writeFileSync`将文章内容写入对应的文件。这样我们在项目下执行 `node index.js`，就能够在 output 目录中找到生成的文章了。

## 增加文件时间戳

现在生成文章到 output 目录有一个问题，如果我们两次生成同一个主题的文章，新的文章就会将旧的文章给覆盖掉。一个比较好的解决办法是，我们在保存文件的时候，在文件名后面加上文件生成的时间。

还记得我们在前面课程中介绍过的第三方库`moment.js`吗？我们先通过 npm 安装这个模块：

```bash
$ npm install moment --save
```

然后我们将`saveCorpus`函数修改一下：

```js
function saveCorpus(title, article) {
  const outputDir = resolve(__dirname, 'output');
  const time = moment().format('|YYYY-MM-DD|HH:mm:ss');
  const outputFile = resolve(outputDir, `${title}${time}.txt`);

  if(!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }

  const text = `${title}\n\n    ${article.join('\n    ')}`;
  writeFileSync(outputFile, text);

  return outputFile;
}
```

这样我们就在文件名后面增加了时间戳，避免了覆盖相同主题的文件。下图是使用了`moment.js`后生成并保存到`output`目录中的文件。

![](https://p1.ssl.qhimg.com/t013197b9e5e4b5a004.jpg)

## 总结

这一节课，我们利用自己创建的随机模块，随机生成了文章的内容，并通过 fs 的`existsSync`、`mkdirSync`和`writeFileSync`方法将它保存成了文件。

为了避免同名的文件覆盖，我们还安装了`moment.js`库，使用了`moment().format`将日期时间格式化，作为文件名的一部分保存，避免了文件的冲突。`moment.js`是一个处理日期时间非常好用的开源库，如果你有兴趣可以访问`moment.js`的[GitHub仓库](https://github.com/moment/moment)了解更多的用法。 

现在我们可以通过 Node.js 命令生成随机的文章并输出了，但还不能自己指定标题，也不能设置最大字数和最小字数。在下一节课里，我们将通过`process`模块来实现与 Node.js 命令交互，让我们可以方便地指定文章标题、最大字数和最小字数。
