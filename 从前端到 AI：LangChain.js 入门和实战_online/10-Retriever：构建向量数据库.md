> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/vector-store.ipynb

经过前几章的学习， 我们完成了对数据的加载和切分成合适的文档块，这一节我们将学习 RAG 的精髓 Embedding，也是我认为影响 RAG 上限和想象空间最核心的地方。 

在这一章节里，我们会带着大家将之前切分后的数据集，构建出对应的 embedding 对象，然后将
所有 embedding 存储在 vector db 中，并尝试根据用户的提问对 vector db 进行检索，找到与用户提问最相关的数据集。

## Embedding！

我们首先复用之前文章的代码，将鲁迅的一本小说切分成模块，

```js
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
const loader = new TextLoader("data/kong.txt");
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });

const splitDocs = await splitter.splitDocuments(docs);
```

因为这个鲁迅小说的数据总长度为 `2250`，并且情节相对紧凑，所以我们的参数设置为
```js
    chunkSize: 100,
    chunkOverlap: 20,
```
这样切分出来的块较小，也会节约 embedding 时的花费。  

我们创建一个 embedding 模型，在使用任何跟 OpenAI 相关的工具时，一定记得导入相关 env 变量，后续也是类似的。

```js
import { load } from "dotenv";
const env = await load();

const process = {
    env
}
```

然后，我们就可以创建 openai 的 embedding 模型

```js
import { OpenAIEmbeddings } from "@langchain/openai";
const embeddings = new OpenAIEmbeddings()
```

我们以第一个切分的结果作为测试，这里我们打印出来看一下

```js
console.log(splitDocs[0])
```


```js
Document {
  pageContent: "鲁镇的酒店的格局，是和别处不同的：都是当街一个曲尺形的大柜台，柜里面预备着热水，可以随时温酒。做工的人，傍午傍晚散了工，每每花四文铜钱，买一碗酒，——这是二十多年前的事，现在每碗要涨到十文，——靠柜外",
  metadata: { source: "data/kong.txt", loc: { lines: { from: 1, to: 1 } } }
}
```

在 embedding 的时候，模型关注的就是 `pageContent`，并不会关心 metadata 的部分，

```js
const res = await embeddings.embedQuery(splitDocs[0].pageContent)
```
然后，我们看一下 embedding 的结果的样子

```js
[
     0.017519549,    0.000543212,   0.015167197,  -0.021431018, -0.0067185625,
     -0.01009323,   -0.022402046,  -0.005822754,  -0.007446834,   -0.03019763,
     -0.00932051,     0.02169087, -0.0130063165,  0.0033592812,  -0.013293522,
     0.018422196, ...
]     
```

embedding 的原理我们在前面介绍过，本质上就是用一个向量来表示这段文本，具体的详细科普可以看前面的章节。



## 创建 MemoryVectorStore

Vector store 提供提供的是存储向量和原始文档，并且提供基于向量进行相关性检索的能力。Langchain 提供了用于测试时，在内存中构建的向量数据库，并且支持多种常见的相似性度量方式。  

注意，因为 embedding 向量是需要有一定的花费的，所以仅在学习和测试时使用 `MemoryVectorStore`，而在真实项目中，搭建其他向量数据库，或者使用云数据库。所以，这部分可以先看教程，不用跟着操作，在后面使用有持久化能力的 vector store 再操作，来节约花费。  

我们创建 `MemoryVectorStore` 的实例，并传入需要 embeddings 的模型，调用添加文档的 `addDocuments` 函数，然后 langchain 的 `MemoryVectorStore` 就会自动帮我们完成对每个文档请求 embeddings 的模型，然后存入数据库的操作。

```js
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const vectorstore = new MemoryVectorStore(embeddings);
await vectorstore.addDocuments(splitDocs);
```

然后我们创建一个 `retriever`，这也是可以直接从 vector store 的实例中自动生成，这里我们传入了参数 2，代表对应每个输入，我们想要返回相似度最高的两个文本内容

```js
const retriever = vectorstore.asRetriever(2)
```

然后，我们就可以使用 `retriever` 来进行文档的提取，例如我们尝试一下

```js
const res = await retriever.invoke("茴香豆是做什么用的")
```

```js
[
  Document {
    pageContent: "有喝酒的人便都看着他笑，有的叫道，“孔乙己，你脸上又添上新伤疤了！”他不回答，对柜里说，“温两碗酒，要一碟茴香豆。”便排出九文大钱。他们又故意的高声嚷道，“你一定又偷了人家的东西了！”孔乙己睁大眼睛说",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 7, to: 7 } } }
  },
  Document {
    pageContent: "有几回，邻居孩子听得笑声，也赶热闹，围住了孔乙己。他便给他们一人一颗。孩子吃完豆，仍然不散，眼睛都望着碟子。孔乙己着了慌，伸开五指将碟子罩住，弯腰下去说道，“不多了，我已经不多了。”直起身又看一看豆",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 15, to: 15 } } }
  }
]
```

就提取出跟茴香豆相关的内容。 因为在提取的时候，是根据相似度进行度量的，所以如果用户提问的特别简洁，并没有相应的关键词，就会出现提取的信息错误的问题，例如：


```js
const res = await retriever.invoke("下酒菜一般是什么？")


[
  Document {
    pageContent: "顾客，多是短衣帮，大抵没有这样阔绰。只有穿长衫的，才踱进店面隔壁的房子里，要酒要菜，慢慢地坐喝。",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 1, to: 1 } } }
  },
  Document {
    pageContent: "有喝酒的人便都看着他笑，有的叫道，“孔乙己，你脸上又添上新伤疤了！”他不回答，对柜里说，“温两碗酒，要一碟茴香豆。”便排出九文大钱。他们又故意的高声嚷道，“你一定又偷了人家的东西了！”孔乙己睁大眼睛说",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 7, to: 7 } } }
  }
]
```

这里第一个数据源是跟下酒菜有关的，但我们这个问题想要的答案明显是从第二个文档信息中才能得到的。所以为了提高回答质量，返回更多的数据源是有价值的。  

但如果涉及到多层语意理解才能构建出联系的情况就比较难说了，例如：

```js
const res = await retriever.invoke("孔乙己用什么谋生？")

[
  Document {
    pageContent: "孔乙己是这样的使人快活，可是没有他，别人也便这么过。",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 17, to: 17 } } }
  },
  Document {
    pageContent: "孔乙己喝过半碗酒，涨红的脸色渐渐复了原，旁人便又问道，“孔乙己，你当真认识字么？”孔乙己看着问他的人，显出不屑置辩的神气。他们便接着说道，“你怎的连半个秀才也捞不到呢？”孔乙己立刻显出颓唐不安模样，",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 11, to: 11 } } }
  }
]
```
这种情况只依靠相似度的对比就很难查找到正确的数据源，需要多层语意的转换才能找到合适数据源，这种情况也有解决方式，我们会在后续的优化章节展开介绍。


## 构建本地 vector store

> 本节对应源代码：  
> https://github.com/RealKai42/langchainjs-juejin/blob/main/node/prepare-kong-faiss.ts 
> https://github.com/RealKai42/langchainjs-juejin/blob/main/node/load-kong-faiss.ts

因为对数据生成 embedding 需要一定的花费，所以我们希望把 embedding 的结果持久化，这样可以在应用中持续复用。因为 js 并不是一个面向后端和机器学习相关的语言，所以原生的 vector store 并不多，大多数还是以支持 python 为主。目前也有像 [lanceDB](https://lancedb.com/) 原生支持 js 的，但毕竟是少数。  

就工程而言，应该是不同的语言和框架去做自己擅长的事，js 是一个面向应用和用户的语言，而并不擅长去做数据库相关的处理。 所以在实际工程中，js 是对接的是由其他语言管理的向量数据库，或者直接对接云数据库，来将复杂度隔离，让 js 侧更多关注在应用和业务相关逻辑上。 

所以，这一节，我们将使用由 facebook 开源的 [faiss](https://github.com/facebookresearch/faiss) 向量数据库，目前有 27.7k star，是向量数据库中非常流行的开源解决方案。选择这个的原因是其可以将向量数据库导出成文件，并且提供了 python 和 nodejs 的处理方式。   

在开发时，我们既可以用 js 进行 embedding 和持久化存储，并后续使用 js 读取已经持久化的向量数据库进行使用。也可以使用 python 进行 embedding 并持久化存储成文件，然后使用 js 进行读取和使用。如果未来对可靠性需求变大，也可以非常容易地将其数据库内容导出到其他数据库或者云数据库。这给我们足够的灵活性。  

目前 Deno 和 faiss-node 有一些兼容性问题，所以我们暂时切换到正常的 node 来实现这部分。虽然 Deno 是希望实现跟 node 的兼容性，但在一些小的细节上还是会有坑，不过我们只是借助 Deno 提供的 Jupyter NoteBook kernel 来实现学习时节约时间和 token 花费的目的，遇到 Deno 的坑直接切回 nodejs 就行。其实这两者大部分 API 是通用的，只要修改一下加载环境变量部分的代码就行。  

在工程落地时，我也建议是先用 Jupyter NoteBook 去做测试和开发，落地时还是用更加成熟的 nodejs。所以下面的代码是在 nodejs 中运行，具体的 package.json 等配置可以见源代码。  

创建一个正常的 nodejs 项目，然后安装依赖

```
yarn add dotenv faiss-node langchain 
```


```js
const run = async () => {
  const loader = new TextLoader("../data/kong.txt");
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);

  const directory = "../db/kongyiji";
  await vectorStore.save(directory);
};

run();
```

在这段代码中，前半部分就是正常的加载和切割数据，就跟我们前几节课讲的一样。 后半部分因为有 langchain 的模块化，跟 `MemoryVectorStore` 是几乎一致，同样的我们也可以用几乎类似的 interface 去切换到其他的 vector store。  

然后，我们使用

```js
  await vectorStore.save(directory);
```

去将构建好的 vector store 存储在文件系统中去方便未来复用。  


然后，我们就可以写另一个脚本去加载存储好的 vector store

```js
  const directory = "../db/kongyiji";
  const embeddings = new OpenAIEmbeddings();
  const vectorstore = await FaissStore.load(directory, embeddings);
```

然后就像我们使用 `MemoryVectorStore` 一样，去创建一个 `Retriever` 实例，去获取根据相似度返回的文档

```js
const retriever = vectorstore.asRetriever(2);
const res = await retriever.invoke("茴香豆是做什么用的");
```

```js
[
  {
    pageContent: '有喝酒的人便都看着他笑，有的叫道，“孔乙己，你脸上又添上新伤疤了！”他不回答，对柜里说，“温两碗酒，要一碟茴香豆。”便排出九文大钱。他们又故意的高声嚷道，“你一定又偷了人家的东西了！”孔乙己睁大眼睛说',
    metadata: { source: '../data/kong.txt', loc: [Object] }
  },
  {
    pageContent: '有几回，邻居孩子听得笑声，也赶热闹，围住了孔乙己。他便给他们一人一颗。孩子吃完豆，仍然不散，眼睛都望着碟子。孔乙己着了慌，伸开五指将碟子罩住，弯腰下去说道，“不多了，我已经不多了。”直起身又看一看豆',
    metadata: { source: '../data/kong.txt', loc: [Object] }
  }
]
```

结果跟我们使用 `MemoryVectorStore` 创建的 vector store 的返回值是一样的。  


## 小结

Vector store 是 RAG 和 LLM App 非常核心的内容，所以希望大家能够跟着写一下代码、配一下环境跟着玩一下，在构建好的 vector store 上用 retriever 用不同的方式去提问一下，根据结果感受一下 vector store 相似性搜索的原理。  

我相信购买这节课的大多数前端或者应用侧的程序员，我们并不需要了解 llm 特别深层次的原理，但要对 embedding 和 相似性搜索有定性的感受，大概理解他的原理和应用效果。  

例如，最近比较火的 prompt engineering 听起来很像玄学，有一些写 prompt 的方式就是能够激发 llm 产出更高质量的结果，有一些则不能。通过跟 retriever 进行交互，你可以试试不同的提问方式返回的结果的质量，你会发现合适的关键词和关键字就能够让 retriever 提取出跟你提问相关性最高的内容，虽然 llm 跟 retriever 的逻辑并不相同，但跟 llm 交互的定性原理是差不多的，你需要在 prompt 中使用合适的关键词，让 llm 能够“召回” 到跟你提问最相关的资料，例如这两句的效果：  
“帮我实现一个 react 的 右键菜单”  
和  
“帮我用 react18、hooks、typescript 实现一个 右键菜单”  

llm 能够返回的质量是完全不一样的，这就是 prompt engineering 的底层逻辑，通过重要的关键词激发 llm 找到对应的知识，这些定性的感受都可以从你把玩 retriever 中获得一些理解。所以说，看各种分享的文章不如直接深入到底层去玩玩试试。你也可以换成私人文档、代码文档等数据源，试试 retriever 的效果。  

回到 vector store 的选择上，现在海量的各种号称最强的向量数据库让大家挑花了眼，这里我建议，不要陷入过早优化的陷阱，发展的问题可以随着发展来解决。 你看到上面我们用的 `MemoryVectorStore` 和 Faiss 对同样的结果是完全一样的，对于小规模应用，不同的向量数据库效果大差不差，即使之后遇到问题，也非常容易将数据迁移到另一个向量数据库。所以没必要在这纠结太多，哪个火、哪个方便，直接用哪个就行。  

js 确实不是面向数据库这种场景非常合适的语言，所以也不用过分纠结要不用 python 去做向量数据库的构建。但大家看了我们构建向量数据库的代码是非常简单的，先用 js + faiss 即可，当你遇到 js 解决不了的问题，你的理解其实也达到了足够的地步再切换到 python 即可，langchain 的 js/py 的 API 是非常相似的，切换起来非常容易。 

至于什么时候用本地的 faiss，什么时候用云向量数据库，我的建议跟上面类似，发展前期不要把自己暴露在太大的复杂度面前，先用本地的 faiss，当其性能或者维护成本过大时，再进行迁移。  

总之，我对学习 llm app 的思路就是，应用优先、先跑起来是最重要的。因为 llm 对大多数应用侧程序员是不熟悉的，遇到难以理解的概念没必要太深究，随着学习你会慢慢理解，也会慢慢探索不同选型之间的异同。


