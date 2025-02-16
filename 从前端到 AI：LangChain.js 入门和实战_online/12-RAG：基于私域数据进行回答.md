> 本节对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/rag.ipynb

经过了前述的学习后，我们已经掌握了构建一个基于私域数据回答问题的 RAG bot 的所有碎片：

- 我们掌握了如何使用 `Prompt Template` 来构建可复用的 prompt 模板
- 我们掌握了使用如何根据私域数据的类型来对数据进行分块（splitter） 
- 我们掌握了构建私域数据的 vector db
- 我们掌握了根据相似性去查询 vector db 中最相关的上下文

我们现在终于可以连点成线，把所有的知识组合在一起，来做一个 RAG bot。本章，我们选择一本小说作为我们的私域数据集，做一个可以根据用户的问题查找原著中相关性最高的片段，并基于该片段进行回答的 bot。考虑到大家阅读小册时可能是隔几天读几章，所以我们也会在这个完整的实战中穿插一些对过去知识的回顾。   

作为 demo，我这里使用了 《球状闪电》，其原文长度不长，方便大家测试的时候节省 token，并且情节丰富，可以方便提问出有深度的问题来

我们先看最终的效果

提问：

```ts
const answer = await retrievalChain.invoke({
    question: "原文中，谁提出了宏原子的假设？并详细介绍给我宏原子假设的理论"
});
```

回答：

```ts
原文中，丁仪提出了宏原子的假设。宏原子假设是指宏物质由宏电子和与之相邻的宏原子核组成，通过观测宏电子在空间中的运动轨迹，并借助数学模型，可以精确定位宏电子对应的原子核的准确位置。宏原子核的外形被描述为一根无限细的弦，长度在一到两米之间，不同的原子种类具有不同的长度。它们与宏电子的间距在三百至六百公里之间，而且宏原子核的外形在视觉上更清晰，移动慢而有规律，便于跟踪
```

提问：

```ts
const answer = await retrievalChain.invoke({
   question: "原文中，量子玫瑰相关的是什么故事"
});
```

回答：

```
原文中，量子玫瑰相关的是作者在亲眼目睹球状闪电后，向妻子描述蓝色的玫瑰，妻子无法看到并开始质疑其存在，而后孩子也提到了看不见的蓝色玫瑰。之后，妻子闻到了玫瑰花香，虽然一度消失，但作者坚称蓝色玫瑰的存在。最后，作者希望在生命的尽头能再次看到量子玫瑰。
```
活动好筋骨，让我们 Rock & Roll ！

  


## 加载和切割原始数据

这里我们收集球状闪电的原文数据，我这里使用的是 txt 格式的数据。

注意，因为版权原因，此数据集只能用于本地测试，如果要对外服务需要得到版权相关的授权才可以。在我们提供大模型相关服务时，经常会涉及到文字和数据源版权问题，需要大家格外注意，当然为了学习的本地测试是没问题的。

我们首先，使用 langchain提供的 `TextLoader` 工具函数来加载txt中的数据。 这里就体现使用 langchain 框架的优势了，对于常用的各种数据源格式，我们不需要花时间去实现琐碎的加载文件、处理各种特殊情况的代码，几行代码就能完成我们需求。

```ts
import { TextLoader } from "langchain/document_loaders/fs/text";
  
const loader = new TextLoader("data/qiu.txt");
const docs = await loader.load();
```

  


我们看一下加载出来的数据结构

```ts
[
  Document {
    pageContent: "三体前传：球状闪电 作者：刘慈欣\r\n" +
      "\r\n" +
      "内容简介：\r\n" +
      "　　没有《球状闪电》，就没有后来的《三体》！\r\n" +
      "　　《三体》前传！\r\n" +
      "　　亚洲首位雨果奖得主刘慈欣的三大长篇之一！（《三体》《球状闪电》《超新星纪..."
    metadata: { source: "data/qiu.txt" }
  }
]
```

  


可以看到，加载出来是一个非常巨大的Document 对象，这显然超出大部分 LLM 的上下文限制，所以我们需要对原文进行切分

```ts
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
});

```

我们看一下切分后结果的数据格式

```ts
console.log(splitDocs[4])

Document {
  pageContent: "“是啊，理想主义者和玩世不恭的人都觉得对方很可怜，可他们实际都很幸运。”妈妈若有所思地说。\r\n" +
    "　　平时成天忙碌的爸爸妈妈这时都变成了哲学家，倒好像这是他们在过生日。\r\n" +
    "　　“妈，别动！”我说着，从妈妈"... 330 more characters,
  metadata: { source: "data/qiu.txt", loc: { lines: { from: 35, to: 42 } } }
}
```
可以看到，pageContent 是切分后的文本结果，在 metadata 中存储了关于切分的原始信息，方便后续处理

这里我们使用 `RecursiveCharacterTextSplitter`，这是最常用的切分工具，他根据内置的一些字符对原始文本进行递归的切分，来保持相关的文本片段相邻，保持切分结果内部的语意相关性。

Langchain 内置了适用于不同场景的切分工具函数，一般来说，在初期可以直接使用 `RecursiveCharacterTextSplitter`，这是比较通用的切分函数，可以在完整实现所有 Chain 之后，再去看切分函数是否影响了最终的质量，来决定是调整切分的参数，还是选择其他切分工具。  


我们看一下切割的结果

```ts
console.log(splitDocs[4].pageContent)

"

“是啊，理想主义者和玩世不恭的人都觉得对方很可怜，可他们实际都很幸运。”妈妈若有所思地说。
　　平时成天忙碌的爸爸妈妈这时都变成了哲学家，倒好像这是他们在过生日。
　　“妈，别动！”我说着，从妈妈看上去乌黑浓密的头发中拔出一根白头发，只白了一半，另一半还是黑的。
　　爸爸拿着那根头发对着灯看了看，闪电中，它像灯丝似的发出光来。“据我所知，这是你妈妈有生以来长出的第一根白发，至少是第一次发现。”
　　“干什么吗你？！拔一根要长七根的！”妈妈把头发甩开，恼怒地说。
　　“唉，这就是人生了。”爸爸说，他指着蛋糕上的蜡烛，“想想你拿着这么一根小蜡烛，放到戈壁滩上去点燃它，也许当时没风，真让你点着了，然后你离开，远远地你看着那火苗有什么感觉？孩子，这就是生命和人生，脆弱而飘忽不定，经不起一丝微风。”
　　我们三个都默默无语地看着那一簇小火苗，看着它们在从窗外射入的冰冷的青色电光中颤抖，像是看着我们精心培育的一窝小生命。
　　窗外又一阵剧烈闪电。
"
```

```ts
console.log(splitDocs[5].pageContent)

"
我们三个都默默无语地看着那一簇小火苗，看着它们在从窗外射入的冰冷的青色电光中颤抖，像是看着我们精心培育的一窝小生命。
　　窗外又一阵剧烈闪电。
　　这时它来了，是穿墙进来的，它从墙上那幅希腊众神狂欢的油画旁出现，仿佛是来自画中的一个幽灵。它有篮球大小，发着朦胧的红光。它在我们的头顶上轻盈地飘动着，身后拖着一条发出暗红色光芒的尾迹，它的飞行路线变幻不定，那尾迹在我们上方划出了一条令人迷惑的复杂曲线。它在飘动时发出一种啸叫，那啸叫低沉中透着尖利，让人想到在太古的荒原上，一个鬼魂在吹着埙。
　　妈妈惊恐地用双手抓住爸爸，我恨她这个动作恨了一辈子，如果她没那样做，我以后可能至少还有一个亲人。
　　它继续飘着，仿佛在寻找着什么，终于它找到了。它悬停在爸爸头顶上半米处，啸叫声变得低沉，断断续续，仿佛是冷笑。
　　这时我可以看到它的内部，那半透明的红色辉光似乎有无限深，从那不见底的光雾的深渊中，不断地有大群蓝色的小星星飞出来，像是太空中一个以超光速飞行的灵魂所看到的星空。
"
```

可以看到，切分结果基本每个块内部都是在讲大概一个事情，块之间也有一定的重合来让 LLM 能够理解上下文。

## 构建 vector store 和 retriever

有了切割后的数据后，我们需要将每个数据块构建成 vector，然后存出来 vector store 中，这里我们使用 OpenAI 的 text-embedding-ada-002 模型。

我们先创建一个 embedding 对象，得益于 langchain 的自由性，我们可以在这里使用任何 embedding 模型，包括一些自部署的开源 embedding 模型来节约成本。为了方便起见，我们使用 openai 提供的模型

```ts
import { OpenAIEmbeddings } from "@langchain/openai";


const embeddings = new OpenAIEmbeddings();
```

然后，我们需要创建一个存储 embedding vector 的 vector store，这里可以用多种线上数据库服务，或者自己的数据库。因为每次对数据进行 embedding 都需要花费一定的价格，所以最好是将 embedding 的结果永久存储在数据库中，方便在服务中使用，可以参考前面章节的使用 Faiss 向量数据库进行存储、加载。

这里我们为了教学的简便，我们使用存储在内存中的数据库

```ts
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const vectorstore = new MemoryVectorStore(embeddings);
await vectorstore.addDocuments(splitDocs);
```

这部分代码会运行比较久，需要对数据块中每一个数据调用 embedding 模型并存储在内存的 store 中。
然后，我们就可以从 vectorstore 获取到一个 retriever 实例
```ts
const retriever = vectorstore.asRetriever(2)
```

这里我们传入参数 2，指每次获取 vector store 中最相关的两条数据。默认返回的数据是根据 similarity 进行排序的，也就是跟用户问题最相关的两条数据。一般不需要设置的特别大，要不给 LLM 的内容太多，费用会变大。

  


然后，我们就可以测试一下输入一个提问，看看获取到结果的质量

```ts
const res = await retriever.invoke("原文中，谁提出了宏原子的假设？并详细介绍给我宏原子假设的理论")
```
  
```ts
[
  Document {
    pageContent: "“她都刻了些什么？”\r\n" +
      "　　“一个数学模型，全面描述宏原子的数学模型。”\r\n" +
      "　　“哦，我们真该带个数码相机来的。”\r\n" +
      "　　“没关系，我都记在脑子里了。”\r\n" +
      "　　“怎么可能呢？那么多？”\r\n" +
      "　　“其中的"... 760 more characters,
    metadata: {
      source: "data/qiu.txt",
      loc: { lines: { from: 2197, to: 2223 } }
    }
  },
  Document {
    pageContent: "“如果人类生活在一个没有摩擦力的世界，牛顿三定律可能会在更早的时候由更普通的人来发现。当你本身已经成为一个量子态的宏粒子，理解那个世界自然比我们要容易得多。”\r\n" +
      "　　于是，基地开始了捕获宏原子核的工作"... 882 more characters,
    metadata: {
      source: "data/qiu.txt",
      loc: { lines: { from: 2222, to: 2229 } }
    }
  }
]
```

可以看到，返回值是跟宏原子理论最相关的两条数据，当然这种结构并不能直接输入给 LLM，我们需要加一个简单的后处理函数，把它处理成普通的文本

```ts
const convertDocsToString = (documents: Document[]): string => {
    return documents.map((document) =>  document.pageContent).join("\n")
}
```
这个函数，就是简单的提取出结果中的 pageContent，并拼接到一起

有了这些，我们就能构建出一个简单的获取数据库中相关上下文的 chain

```ts

const contextRetriverChain = RunnableSequence.from([
    (input) => input.question,
    retriever,
    convertDocsToString
])
```

`RunnableSequence` 在这里就是构建了一个简单的 chain，传入一个数组，并且把第一个 Runnable 对象返回的结果自动输入给后面的 Runnable 对象。  
在这里，`contextRetriverChain`，接收一个 `input` 对象作为输入，然后从中获得 question 属性，然后传递给 `retriever`，返回的 `Document` 对象输入作为参数传递给 `convertDocsToString` 然后被转换成纯文本。  

让我们尝试调用一下这个 chain
```ts
const result = await contextRetriverChain.invoke({ question: "原文中，谁提出了宏原子的假设？并详细介绍给我宏原子假设的理论"})

console.log(result)
```

```ts
"“她都刻了些什么？”\r\n" +
  "　　“一个数学模型，全面描述宏原子的数学模型。”\r\n" +
  "　　“哦，我们真该带个数码相机来的。”\r\n" +
  "　　“没关系，我都记在脑子里了。”\r\n" +
  "　　“怎么可能呢？那么多？”\r\n" +
  "　　“其中的"... 1743 more characters
```

可以看到，我们已经能够根据用户的问题，来获取到原文中相关性比较高的上下文，并处理成纯文字形式

## 构建 Template

然后，我们就可以构建用户提问的 template，这里我们使用 ChatPromptTemplate 来构建我们的 prompt，使用简单的 prompt 技巧，并在其中定义两个变量 context 和 question

```ts
import { ChatPromptTemplate } from "@langchain/core/prompts";

const TEMPLATE = `
你是一个熟读刘慈欣的《球状闪电》的终极原著党，精通根据作品原文详细解释和回答问题，你在回答时会引用作品原文。
并且回答时仅根据原文，尽可能回答用户问题，如果原文中没有相关内容，你可以回答“原文中没有相关内容”，

以下是原文中跟用户回答相关的内容：
{context}

现在，你需要基于原文，回答以下问题：
{question}`;

const prompt = ChatPromptTemplate.fromTemplate(
    TEMPLATE
);
```

在运行时，我们只要将对应的变量传递给 prompt 就能将 prompt 中对应的变量替换成真实值。

在设计 prompt，我们使用一些简单的 prompt engineering 的技巧，比如：

- 并且回答时仅根据原文
  - 这里固定 LLM 回答的范围只能根据原文内容
- 如果原文中没有相关内容，你可以回答“原文中没有相关内容”
  - 这里来减少 LLM 回答时候的幻想问题

## 实现完整的 Chain

然后，我们就可以把上述所有内容连在一起，来实现完整的对话 Chain

首先，我们定义 LLM 模型，这里依旧是使用 OpenAI 的模型

```ts
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI();
```
得益于 langchain 的自由性，我们可以随时切换成任意模型，对于比较普通的任务，使用一些开源模型也能获得不错的效果。

然后我们将上述的内容组装成完整的 Chain，其中 StringOutputParser 会将 LLM 的输出转换成普通的文本

```ts
const ragChain = RunnableSequence.from([
    {
        context: contextRetriverChain,
        question: (input) => input.question,
    },
    prompt,
    model,
    new StringOutputParser()
])
```

然后，我们就可以来调用我们的 rag chatbot 啦！

```ts
const answer = await ragChain.invoke({
    question: "什么是球状闪电"
  });  
  console.log(answer);
```


```ts
球状闪电是一种自然现象，它是一种长时间稳定、持续发光的球形物质。根据原文描述，球状闪电以电磁辐射形式发散自己的能量，拖着尾迹在空中织出一幅发光的巨毯，并发出呼啸声变成杂乱的蜂音。球状闪电还可以在水中幽幽地亮着，像发光的鱼群
```

```ts
const answer = await ragChain.invoke({
    question: "详细描述原文中有什么跟直升机相关的场景"
  });

console.log(answer);
```

```ts
原文中描述了直升机试验的场景。在试验中，改进过的探杆防御系统被安装在一架直升机上。直升机编队起飞后，电弧在空中出现，当雷球熄灭时，探杆将自动弹出，牵引着一根直径不到半厘米的超导线接触目标位置。整个试验过程中，两架直升机成功地飞行并降落，展现出探杆防御系统的功能。
```

  


## 小结

通过将我们之前学到的知识连到一起，我们就有了基于任意私域数据库来构建 rag chatbot 的能力，这可以方便我们把 LLM 应用到任意公司内已有的数据集中，构建私域数据的对话机器人。这在应用中的想象力是无穷的，例如你可以把你自己学习笔记存储到 vector store 中，来构建专属于自己的对话机器人，基于自己学过的知识来回答问题。


当然，现在我们的 chatbot 还是没有历史对话的数据，接下来我们将学习 langchain 中的 Memory 类，让 chat bot 拥有记忆能力。