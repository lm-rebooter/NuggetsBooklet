经过上一章对 embedding 和 retriever 的学习后，大家已经掌握了这两个在 RAG 中非常重要环节的基础使用。 对于 embedding 来说，直接用最流行的 embedding 和 vector store 对大部分应用都是足够的。而对应用侧有比较大优化空间的就是 retriever，例如我们之前的例子，如果用户提问的关键词缺少，或者恰好跟原文中的关键词不一致，就容易导致 retriever 返回的文档质量不高，影响最终 llm 的输出效果。   

所以，本章中，我们会介绍一些常见的优化方式，来提高返回文档与用户提问的相关性和质量。  

跟前面的章节一样，本章因为 deno 和 faiss-node 兼容性的限制，我们只能使用 **nodejs** 去实现本章中的代码，所以大家在执行代码时要多检查一下，避免造成多余的费用。 deno 已经意识到对 node binding 支持性问题，估计也会逐步去解决，毕竟 jupyter notebook 确实非常好用。或者 nodejs 官方能不能提供一个 jupyter 的 kernel 支持，make js great again 🐶  


## MultiQueryRetriever

> 本节对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/node/multiQueryRetriever.ts

`MultiQueryRetriever` 思路，或者说其他解决 llm 缺陷的思路基本都是一致的：加入更多 llm。而 `MultiQueryRetriever` 是其中比较简单的一种解决方案，它使用 LLM 去将用户的输入改写成多个不同写法，从不同的角度来表达同一个意思，来克服因为关键词或者细微措词导致检索效果差的问题。  

我们首先导入存储在文件里的 faiss vector store
```js
const directory = "../db/kongyiji";
const embeddings = new OpenAIEmbeddings();
const vectorstore = await FaissStore.load(directory, embeddings);
```

然后创建一个 `MultiQueryRetriever`

```js
  const model = new ChatOpenAI();
  const retriever = MultiQueryRetriever.fromLLM({
    llm: model,
    retriever: vectorstore.asRetriever(3),
    queryCount: 3,
    verbose: true,
  });
```

这里几个参数非常重要  
- llm，也就是传入的 llm 模型，因为这个 retriever 需要使用 llm 进行改写，所以需要传入模型。注意，这里，以及几乎所有需要传入模型的地方，都不局限于 openAI 的模型。
- retriever，vector store 的 retriever，因为 MultiQueryRetriever 将会使用这个 retriever 去获取向量数据库里的数据。这里我们创建 `vectorstore.asRetriever(3)`意味着每次会检索三条数据，对每个 query
- queryCount，默认值是 3，也就意味着会对每条输入，都会用 llm 改写生成三条不同写法和措词，但表示同样意义的 query
- verbose，这个是几乎所有 langchain 函数都内置参数，设置为 true 会打印出 chain 内部的详细执行过程方便 debug  


然我们废话少说，赶紧运行一下试试  

```js
const res = await retriever.invoke("茴香豆是做什么用的");
```

运行后，langchain 会非常详细的打印整个 chain 的执行过程，因为比较复杂，我就不粘贴在这了，只会提取其中比较核心的执行逻辑进行解析。 但我建议大家在自己的电脑上运行一下试试，感受一下其整个过程，因为 langchain 内置的 prompt 和逻辑都非常巧妙。  


首先，`MultiQueryRetriever` 会用 LLM 生成三个 query，其中 prompt 是

```
You are an AI language model assistant. Your task is
to generate 3 different versions of the given user
question to retrieve relevant documents from a vector database.
By generating multiple perspectives on the user question,
your goal is to help the user overcome some of the limitations
of distance-based similarity search.

Provide these alternative questions separated by newlines between XML tags. For example:

<questions>
Question 1
Question 2
Question 3
</questions>

Original question: 茴香豆是做什么用的
```

其中核心的 prompt 是告诉 llm 去从检索算法（distance-based similarity search）的角度去生成用户提问的三个角度。

输出的结果是

```js
[
  "茴香豆的应用或用途是什么？",
  "茴香豆通常被用来做什么？",
  "可以用茴香豆来制作什么？"
]
```
因为用户的原始输入是 `茴香豆是做什么用的`，这是一个非常模糊和有歧义性的问题，作为写这个问题的用户，他可能了解想要的答案是 “茴香豆是下酒用的”，但因为自然语言的特点，这是有歧义的的。 `MultiQueryRetriever` 的意义就是，找出这句话所有可能的意义，然后用这些可能的意义去检索，避免因为歧义导致检索错误。  

然后，`MultiQueryRetriever` 会 **对每一个 query 调用 vector store 的 retriever**，也就是，按照我们上面的参数，会生成 3 * 3 共九个文档结果。 然后咱其中去重，并返回。

简单总结下，`MultiQueryRetriever` 是在 RAG 中 retriever 的前期就引入 llm 对语意的理解能力，来解决纯粹的相似度搜索并不理解语意导致的问题。  
这可能是最简单的 retriever 优化方式，在后面的优化中，你会对 “解决 llm 缺陷的方式就是引入更多 llm” 有更深的理解。  



## Document Compressor

> 本节对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/node/LLMChainExtractor.ts

Retriever 的另一个问题是，如果我们设置 k（每次检索返回的文档数）较小，因为自然语言的特殊性，可能相似度排名较高的并不是答案，就像搜索引擎依靠的也是相似性的度量，但排名最高的并不一定是最高质量的答案。而如果我们设置的 k 过大，就会导致大量的文档内容，可能会撑爆 llm 上下文窗口。


通过我们观察 Document 中的内容，我们会发现，因为自然语言和原始文本的特点，切割后的 document 并不全是有参考价值的内容，有很多跟用户提问无关的内容，那我们如何提取出这部分有价值的数据作为 retriever 返回的文档，这样把核心价值提取出来，而不是有太多的废话占用了 llm 宝贵的上下文。  

让我们来尝试一下，为了更清楚观察 chain 内部发生的事情，我们采用另一种 debug 的方式，通过设置环境变量，让整个执行过程中所有 langchain 组件都打印其中的过程。

```js
process.env.LANGCHAIN_VERBOSE = "true";
```

我们像上面例子一样加载 vector store，这里就不重复了，直接创建一个从 Document 中提取核心内容的 compressor：
```js
  const model = new ChatOpenAI();
  const compressor = LLMChainExtractor.fromLLM(model);
```

其具体原理，我们会在后面解析。

然后我们创建一个 `ContextualCompressionRetriever`，也就是会自动对上下文进行压缩的 Retriever：
```js
  const retriever = new ContextualCompressionRetriever({
    baseCompressor: compressor,
    baseRetriever: vectorstore.asRetriever(2),
  });
```

这里核心是两个参数：
- baseCompressor，也就是在压缩上下文时会调用 chain，这里接收任何符合 Runnable interface 的对象，也就是你可以自己实现一个 chain 作为 compressor
- baseRetriever，在检索数据时用到的 retriever


然后调用尝试一下，因为环境变量 `LANGCHAIN_VERBOSE` 为 `"true"`，会打印出大量的中间执行过程，依旧，我们这里挑其中核心的运行逻辑进行分析：

```js
const res = await retriever.invoke("茴香豆是做什么用的");
```

首先，会调用传入的 `baseRetriever` 根据 query 进行检索，因为我们传入的 retriever 设置了 k=2，所以会返回两个 Document 对象，我把其中 `pageContent` 放在这里：

```js
[
    "有喝酒的人便都看着他笑，有的叫道，“孔乙己，你脸上又添上新伤疤了！”他不回答，对柜里说，“温两碗酒，要一碟茴香豆。”便排出九文大钱。他们又故意的高声嚷道，“你一定又偷了人家的东西了！”孔乙己睁大眼睛说",
    "有几回，邻居孩子听得笑声，也赶热闹，围住了孔乙己。他便给他们一人一颗。孩子吃完豆，仍然不散，眼睛都望着碟子。孔乙己着了慌，伸开五指将碟子罩住，弯腰下去说道，“不多了，我已经不多了。”直起身又看一看豆"
]
```

然后，会调用传入的 `baseCompressor` 根据用户的问题和 Document 对象的内容，进行核心信息的提取，这里我们打印出提取内容用到的 prompt，再次感受一下 langchain prompt 的质量，也是学习一下他们的写法和思路。  


```
Given the following question and context, extract any part of the context *AS IS* that 
is relevant to answer the question. If none of the context is relevant return 
NO_OUTPUT.

Remember, *DO NOT* edit the extracted parts of the context.

> Question: 茴香豆是做什么用的
> Context:
>>>
有喝酒的人便都看着他笑，有的叫道，“孔乙己，你脸上又添上新伤疤了！”他不回答，对柜里说，“温两碗酒，要一碟
茴香豆。”便排出九文大钱。他们又故意的高声嚷道，“你一定又偷了人家的东西了！”孔乙己睁大眼睛说
>>>
Extracted relevant parts:
```

其中的核心 prompt，就是根据用户提问从文档中提取出最相关的部分，并且强调不要让 LLM 去改动提取出来的部分，来避免 LLM 发挥自己的幻想改动原文。  

然后我们看最终返回的结果
```js
[
  Document {
    pageContent: '对柜里说，“温两碗酒，要一碟茴香豆。”',
    metadata: { source: '../data/kong.txt', loc: [Object] }
  }
]
```

是只有一条的，我们去溯源其中的执行过程，发现对于第二条数据，LLM 返回的是 `NO_OUTPUT`，也就是 LLM 认为这里并没有跟上下文相关的信息。 

经过 `ContextualCompressionRetriever` 的处理，减少了最终输出的文档的内容长度，给上下文留下了更大的空间。  

## ScoreThresholdRetriever

> 本节对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/node/ScoreThresholdRetriever.ts

我们前面讲了，如何在 retriever 添加更多 llm 来增强 retriver 的质量。但让我们回到最初的问题，最初的代码看一下：

```js
const retriever = vectorstore.asRetriever(2);
```

这里为什么是 2，也就是 k 根据什么依旧被设置为 2？  

事实上，这个非常难设置的，例如我们依旧以《孔乙己》这篇文章为例，如果我们问 “茴香豆是做什么用的”，原文中相关的情节可能就 2～3 个，那么 k=2 是非常合理的，找到 2～3 个情节中跟茴香豆最相关的给 LLM 作为参考就行。  
但如果，我们问的是 “孔乙己平时都在做什么？”，那 2～3 个答案显然并不能提供足够的参考给 LLM，这里就需要我们定义另一种决定返回参考文档数量的方式，而不仅仅是暴力的定义数量。  

在这种情况下，我们可以使用 `ScoreThresholdRetriever`，我们依旧省略了加载 vector store 部分的代码：

```js
const retriever = ScoreThresholdRetriever.fromVectorStore(vectorstore, {
    minSimilarityScore: 0.4,
    maxK: 5,
    kIncrement: 1,
});
```
注意，就像上一章我们说的，《孔乙己》这个 vector store 是为了教学，我们的 chunkSize/chunkOverlap 设置的都比较小，所以这也影响 `ScoreThresholdRetriever` 参数的设置。

- minSimilarityScore， 定义了最小的相似度阈值，也就是文档向量和 query 向量相似度达到多少，我们就认为是可以被返回的。这个要根据你的文档类型设置，一般是 0.8 左右，可以避免返回大量的文档导致消耗过多的 token 。
- maxK，一次最多返回多少条数据，这个主要是为了避免返回太多的文档造成 token 过度的消耗。
- kIncrement，定义了算法的布厂，你可以理解成 for 循环中的 i+k 中的 k。其逻辑是每次多获取 kIncrement 个文档，然后看这 kIncrement 个文档的相似度是否满足要求，满足则返回。

再次提醒，因为我们 vector store 是为了教学设置的，其中参数的设定并不具有参考价值，需要根据工程中的文档类型找到合适的值。  

让我们来试一试：

```js
  const res = await retriever.invoke("茴香豆是做什么用的");
```

这里我们放出全部的结果，可以看到因为我们设置的 `minSimilarityScore` 较低，所以返回的了最大值（`maxK` 为 5）的数据，后面的内容跟提问基本没有关系了。

```js
[
  {
    pageContent: '有喝酒的人便都看着他笑，有的叫道，“孔乙己，你脸上又添上新伤疤了！”他不回答，对柜里说，“温两碗酒，要一碟茴香豆。”便排出九文大钱。他们又故意的高声嚷道，“你一定又偷了人家的东西了！”孔乙己睁大眼睛说',
    metadata: { source: '../data/kong.txt', loc: [Object] }
  },
  {
    pageContent: '有几回，邻居孩子听得笑声，也赶热闹，围住了孔乙己。他便给他们一人一颗。孩子吃完豆，仍然不散，眼睛都望着碟子。孔乙己着了慌，伸开五指将碟子罩住，弯腰下去说道，“不多了，我已经不多了。”直起身又看一看豆',
    metadata: { source: '../data/kong.txt', loc: [Object] }
  },
  {
    pageContent: '年前的事，现在每碗要涨到十文，——靠柜外站着，热热的喝了休息；倘肯多花一文，便可以买一碟盐煮笋，或者茴香豆，做下酒物了，如果出到十几文，那就能买一样荤菜，但这些顾客，多是短衣帮，大抵没有这样阔绰。只有',
    metadata: { source: '../data/kong.txt', loc: [Object] }
  },
  {
    pageContent: '不多了，我已经不多了。”直起身又看一看豆，自己摇头说，“不多不多！多乎哉？不多也。”于是这一群孩子都在笑声里走散了。',
    metadata: { source: '../data/kong.txt', loc: [Object] }
  },
  {
    pageContent: '音虽然极低，却很耳熟。看时又全没有人。站起来向外一望，那孔乙己便在柜台下对了门槛坐着。他脸上黑而且瘦，已经不成样子；穿一件破夹袄，盘着两腿，下面垫一个蒲包，用草绳在肩上挂住；见了我，又说道，“温一碗酒',
    metadata: { source: '../data/kong.txt', loc: [Object] }
  }
]
```

## 小结

Retriever 在 RAG 中非常重要，也有足够的优化空间，我们介绍几种常见的优化方式来提高 retriever 的质量。其中引入 llm 进行优化的效果是最好的，但花费和耗时都比较久。当然我们可以扩展思路，在这个场景下，其实对 llm 的能力要求并不高，我们可以使用更廉价甚至是本地 llm 能力来提高速度节约花费。得益于 langchain 的模块化和自由度，这都是十分容易做到的。  



