> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/tree/main/node/rag

这一章，我们将继续我们 RAG chat bot 的实现，在之前的版本中并没有记忆功能，只是获取向量库中的资料 + 根据返回的资料回答用户问题。  

这一章讲是 RAG 模块的最终章，这里我们会将 RAG 再往更好的完成度推进，加入 llm 改写和 chat history，成为更成熟的 llm 应用。 

## llm 改写提问

这是 Retriver 阶段更深入的优化，因为 chat bot 面对的是普通用户的长对话，用户会自然的通过代词去指代前面的内容，例如：
```
Human: 这个故事的主角是谁？
AI: 主角是小明
Human: 介绍他的故事
```

在正常的 rag 逻辑中，我们会使用 “介绍他的故事” 去检索向量数据库，但这句话只有 “他” 并没有检索的关键词 “小明”，就很难检索到正确的资料。  

所以，为了提高检索的质量，我们需要对用户的提问进行改写，让他成为一个独立的问题，包含检索的所有关键词，例如上面的例子我们就可以改写成 “介绍小明的故事”，这样检索时就能获得数据库中相关的文档，从而获得高质量的回答。  

那应该用什么改写呢？答案依旧是 -- LLM。  
所以，又回到了我们前面提到的问题，当做 LLM app 遇到问题时，我们通常会尝试加入更多的 LLM 来解决问题。让我们来看代码应该怎么处理。

我们先定义 prompt ：

```js
 const rephraseChainPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "给定以下对话和一个后续问题，请将后续问题重述为一个独立的问题。请注意，重述的问题应该包含足够的信息，使得没有看过对话历史的人也能理解。",
    ],
    new MessagesPlaceholder("history"),
    ["human", "将以下问题重述为一个独立的问题：\n{question}"],
  ]);
```
这里，我们通过 system prompt 去给 llm 确定任务，根据聊天记录去把对话重新描述成一个独立的问题，并强调重述问题的目标。  

然后，我们据此构成一个 chain：

```js
 const rephraseChain = RunnableSequence.from([
    rephraseChainPrompt,
    new ChatOpenAI({
      temperature: 0.2,
    }),
    new StringOutputParser(),
  ]);
```
这里，我们将 model 的 temperature 定义的较低，越低 llm 会越忠于事实，减少自己的自由发挥。  

然后，让我们简单测试一下效果：


```js
  const historyMessages = [new HumanMessage("你好，我叫小明"), new AIMessage("你好小明")];
  
  const question = "你觉得我的名字怎么样？";
  const standaloneQuestion = await rephraseChain.invoke({ history: historyMessages, question });

  console.log(standaloneQuestion);
  // 你认为小明这个名字怎么样？
```

可以看到，我们这里使用了 “我的名字” 这个代词，在 llm 的重述下，将这个替换成了 “小明”。这个处理除了可以解决代词的问题，也能解决一些自然语言灵活性带来的问题，保证进行 retriver 时的问题是高质量的。  

当然，这个技巧也可以根据我们业务的需要，跟前面 Retriver 技术中的其他技巧结合，来综合提高返回文档的质量。


## 构建完整的 RAG chain

这里，我们就可以把前面章节涉及的知识点全部串联起来，构造一个完整的 rag chain，大家可以通过这个例子感受到 LCEL 抽象和模块化带来的优势，我们非常容易的拆分和组合各种 Runnable 对象。  

注意，这里我们使用了 Faiss 作为我们本地的数据库，因为其中使用了 .node 相关的依赖，所以代码需要运行在 Node 环境，不能使用 Deno。

我们首先准备一个独立的脚本去对给定的小说文本就是切割，并保存在本地的数据库文件中，这段代码的细节前面都讲解过了，所以我们直接贴代码：

```js
  const baseDir = __dirname;

  const loader = new TextLoader(path.join(baseDir, "../../data/qiu.txt"));
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);

  await vectorStore.save(path.join(baseDir, "../../db/qiu"));
```

这部分代码执行后，会将数据文件进行加载、切割、存储到向量数据库的文件中，之后我们就再起一个新的脚本，来写我们的 rag chain，并将 `rephraseChain` 部分的粘贴进去。  

然后，我们构建根据重写后的独立问题去读取数据库的中相关文档的 chain:


```js
async function loadVectorStore() {
  const directory = path.join(__dirname, "../../db/qiu");
  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await FaissStore.load(directory, embeddings);

  return vectorStore;
}
```

```js
  const vectorStore = await loadVectorStore();
  const retriever = vectorStore.asRetriever(2);

  const convertDocsToString = (documents: Document[]): string => {
    return documents.map((document) => document.pageContent).join("\n");
  };
  const contextRetrieverChain = RunnableSequence.from([
    (input) => input.standalone_question,
    retriever,
    convertDocsToString,
  ]);
```

这部分代码前面的章节都有解析，就是简单的使用 retriever 获取相关文档，然后转换成纯字符串。

然后，我们定义一个包含历史记录信息，回答用户提问的 prompt ：

```js
  const SYSTEM_TEMPLATE = `
    你是一个熟读刘慈欣的《球状闪电》的终极原着党，精通根据作品原文详细解释和回答问题，你在回答时会引用作品原文。
    并且回答时仅根据原文，尽可能回答用户问题，如果原文中没有相关内容，你可以回答“原文中没有相关内容”，

    以下是原文中跟用户回答相关的内容：
    {context}
  `;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_TEMPLATE],
    new MessagesPlaceholder("history"),
    ["human", "现在，你需要基于原文，回答以下问题：\n{standalone_question}`"],
  ]);
```

这里，我们使用 `MessagesPlaceholder` 去在 message 中给 history 去预留位置，之后会这里会被 Message 数组填充。  

然后，我定义一个 改写提问 => 根据改写后的提问获取文档 => 生成回复 的 rag chain：

```js
  const model = new ChatOpenAI();
  const ragChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      standalone_question: rephraseChain,
    }),
    RunnablePassthrough.assign({
      context: contextRetrieverChain,
    }),
    prompt,
    model,
    new StringOutputParser(),
  ]);
```

这里有些 LCEL 节点的输入输出会绕一点， rag Chain 的输入会包含 `question` 和 `history` 两个输入，前者是用户的原始问题，后者是聊天记录（由后面会定义的 chain 输入）。  

所以第一个节点，我们会在这个输入中通过 `RunnablePassthrough.assign` 去添加 `standalone_question` 这个 key。在这里，前序输入的 `question` 和 `history` 会作为参数传入给 `rephraseChain` 并通过其中的运算，将结果赋值给 `standalone_question`，然后传递给后续节点。  

所以，在第一个节点运行完毕后，传给下一个节点的数据就是：`question`、`history`、`standalone_question` 这三个 key，分别是用户的原始提问、聊天记录和重写后的历史。  

同样的原理，在第二个节点中，这三个输入会传入给 `contextRetrieverChain` 中，这个 chain 会使用 `standalone_question` 去获取到相关的文档作为结果赋值给 `context`。 所以在这个节点运行结束后，传递给下一个节点的数据就是：`question`、`history`、`standalone_question` 和 `context` 这四个 key。  

后面就是大家已经非常熟悉的，生成 prompt、llm 返回数据、`StringOutputParser` 提取数据中的文本内容。  

所以，这里我们就构建了一个基础的 rag chain。 然后我们给这个 rag chain 去增加聊天记录的功能，这里我们使用 `RunnableWithMessageHistory` 去管理 history。  

```js
  const ragChainWithHistory = new RunnableWithMessageHistory({
    runnable: ragChain,
    getMessageHistory: (sessionId) => new JSONChatHistory({ sessionId, dir: chatHistoryDir }),
    historyMessagesKey: "history",
    inputMessagesKey: "question",
  });
```

注意，这里传给 `getMessageHistory` 的函数，需要根据用户传入的 sessionId 去获取初始的 chat history，这里我们复用了前面章节实现的 `JSONChatHistory` 来在本地存储用户的聊天记录。  

让我们测试一下，

```js
  const res = await ragChainWithHistory.invoke(
    {
      question: "什么是球状闪电？",
    },
    {
      configurable: { sessionId: "test-history" },
    }
  );
```

返回：

```js
根据原文，球状闪电是一种极其罕见的现象，是一个充盈着能量的弯曲的空间，一个似有似无的空泡，一个足球大小的
电子。它被描述为一个超现实的小东西，仿佛梦之乡溢出的一粒灰尘，暗示着宇宙的博大和神秘，暗示着可能存在的与
我们现实完全不同的其他世界。球状闪电的确切性质和构成目前仍然是科学之谜，但它不是小说中所描述的那种东西，
而是一种真实存在的自然现象。
```

因为聊天记录会被持久化在文件中，并且在运行时加载，所以我们直接修改问题再次运行代码即可：


```js
  const res = await ragChain.invoke(
    {
      question: "这个现象在文中有什么故事",
    },
    {
      configurable: { sessionId: "test-history" },
    }
  );
```

返回：

```js
球状闪电在《球状闪电》这本小说中有着丰富的故事情节。小说中描述了一个年轻人因为观察到球状闪电而开始对它展
开研究的旅程。他发现球状闪电的特性和行为与以往所知的闪电形式有着明显不同，它具有弯曲的空间、充盈的能量和
神秘的存在状态。在寻求解释和了解球状闪电的过程中，他秘密调查了死去科学家的笔迹，探索了前苏联的地下科技
城，还遭遇了次世代的世界大战的种种阻碍。最终，他发现球状闪电並非只是自然现象，而是一种可以用作战争武器的
存在，成为了决定祖国存亡的终极武器。

这个故事展示了球状闪电的不寻常和神秘之处，以及对它进行研究和利用的影响和后果。球状闪电在小说中被描绘为一
种引人入胜的现象，同时也成为了战争中的重要元素，改变了整个世界的格局。
```

可以看到，经过自动改写的用户提问，让 llm 检索到正确的数据，从而生成了完整的回答。  

至此，我们就完成成了一个非常完整的 rag chain，有自动的提问改写、数据检索、聊天记录等基本的功能。借助 langchain 提供的丰富能力，百行左右就能实现一个功能丰富的 chat bot。  


## 部署成 API

就像我们前面介绍过的，LCEL 提供了从 prototype 到 production 的能力，我们前面写的 chain 不需要做任何修改就可以部署成 API，并且提供 stream 能力。  

我们这里使用 express 简单写一个部署的 API：


```js
import express from "express";
import { getRagChain } from ".";

const app = express();
const port = 8080;

app.use(express.json());

app.post("/", async (req, res) => {
  const ragChain = await getRagChain();
  const body = req.body;
  const result = await ragChain.stream(
    {
      question: body.question,
    },
    { configurable: { sessionId: body.session_id } }
  );

  res.set("Content-Type", "text/plain");
  for await (const chunk of result) {
    res.write(chunk);
  }
  res.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

然后，我们运行这个 sever，然后写一个 client 的去读取 steam api 的代码：

```js
const port = 8080;

async function fetchStream() {
  const response = await fetch(`http://localhost:${port}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      question: "什么是球状闪电",
      session_id: "test-server",
    }),
  });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    console.log(decoder.decode(value));
  }

  console.log("Stream has ended");
}

fetchStream();
```

然后，我们运行即可得到：

![CleanShot 2024-04-10 at 00.51.23@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6570b1f9fff64a9da599c45990806538~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=654&h=430&s=102555&e=png&b=2b2e35)


然后，我们的 rag chain 就被部署成了 API，可以给其他业务提供服务。


## 小结
这是 RAG 模块的最后一章，我们经历了十几章 RAG 相关的基础知识，让我们从 0 部署成功了一个 rag chain。这里我们解答一下同学们可能出现的问题。  

在这个模块中，我们学习了非常多的 Retriver、Memory 等等策略，我们在工程中到底应该使用什么？这个确实取决于业务的情况，大家可以看到最简单的 rag chain 就是没有聊天记录的维护，只有根据用户提问回答问题，使用的 llm 最少、每次消耗的 token 也少，如果是给内部文档做简单的 chat bot，我认为这就足够了，每次提问都是独立的。  

如果是做复杂的 chat bot，就要衡量成本和效果的权衡，加入完整的 chat history 就意味着对 llm 上下文压力就很大，且每次消耗的 token 就会变多。不追求质量的话，基础的 `BufferWindowMemory` 就可以，保留前两次的聊天记录，辅以使用 llm 对用户问题的重写。  

如果是更复杂 chat bot，这就需要根据业务、文档资料、聊天的类型，去选择合适的 memory 机制，可以先用 langchain 内置的 Memory 去测试效果，选中合适的策略，然后根据业务去参考实现一份，加入自己对业务的理解。  

另外一个，经常会问到的问题，就是 prompt 用英语还是中文。在 `EntityMemory` 中大家会发现，虽然人类和 llm 输出都是中文，但内部的 entities 记录都是英语的，因为 `EntityMemory` 提取实体时的 prompt 就是英语的，所以内部记录的信息也是英语的。 因为 llm 有非常好的跨语言的理解能力，基本的使用并不会有问题，但对于纯中文的业务，我建议还是根据其内置的 prompt 去翻译成中文，并根据中文的特点进行修改以取得最好的效果。  

上面常见的问题，我的建议都是根据业务和场景去选择。但我还想再强调一遍，在 poc 期间，不要纠结，就全部用 langchain 内置的工具去做，先看效果，再根据效果和 chian 中间的步骤去一点点分析 导致效果不理想的问题出在哪里，然后再去优化。 没必要在业务前期就陷入过早优化的陷阱。  

最后，感谢大家在 RAG 模块的陪伴，在一节我们将进入更加神奇的 Agent 模块，我们会体会为什么多 Agent 的协同让我们看到了 AGI 的曙光！























