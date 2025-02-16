> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/splitter.ipynb

受限于常见 llm 的上下文大小，例如 gpt3.5t 是 16k、gpt4t 是 128k，我们并不能把完整的数据整个塞到对话的上下文中。并且，即使数据源接近于 llm 的上下文窗口大小，llm 在读取数据时很容易出现分神，或者忽略其中部分细节的问题。所以，我们需要对加载进来的数据切分，切分成比较小的块，然后根据对话的内容，将最关联的数据塞到 llm 的上下文中，来强化 llm 输出的专注性和质量。  

对于分割来说，我们的目的就是将文本切分成多个文档块，每个文档块的内部语义相关，并且与其他块具有独立性，能够独立的表达和阐述某个信息。这其中有非常多复杂性，对于 RAG 来说，语意切分的质量决定了对话时 llm 获取信息的质量，也就决定了生成答案的质量。 

而从宏观角度来看 `TextSplitter` 他的工作方式非常的好理解
1. 首先是根据预设的分块逻辑，将内容切分成多个块，并且每个块是表达独立的语意。对于一般文本，你可以理解成切分到句子这一级，因为切分到词已经失去了语意性。
2. 开始将这些块进行组装，一直到用户预设的块大小限制。
3. 在组装完一个块后，会根据相同的逻辑去组装另一个块。并且在组装时，会根据用户设定的块之间的重叠大小，来给文档块添加与上下文档块的重叠部分。 例如第一个块是 AABBCC,那么第二个块就是 CCDDEE，第三个块就是  EEFFGG。

重叠部分是因为，理想情况下我们是希望能够切分成语意相关并且完全独立的文档块，但受限于自然语言的特殊性，这点很难做到，所以为了减少切分时造成语意的中断，我们会人为的给切分块加入跟前后文档块重叠的部分，来减少语意中断的影响。  

在理解切分的逻辑后，当你需要根据你的数据类型进行切分时，就可以根据以下几个维度去思考应该使用什么样的切分器：
1. 目标文档类型是什么？
2. 如何衡量切分后文档块的大小?

从先有的 langchain 提供的切分能力来看，我认为最重要的第一点，也就是根据文档类型选择需要的切分工具。langchain 目前提供的切分工具有：

| 名称 | 说明 |
| --- | --- |
| Recursive | 根据给定的切分字符（例如 `\n\n`、`\n`等），递归的切分 |
| HTML | 根据 html 特定字符进行切分 |
| Markdown | 根据 md 的特定字符进行切分 |
| Code | 根据不同编程语言的特定字符进行切分 |
| Token | 根据文本块的 token 数据进行切分 |
| Character | 根据用户给定的字符进行切割 |


## RecursiveCharacterTextSplitter  


`RecursiveCharacterTextSplitter`，这是最常用的切分工具，他根据内置的一些字符对原始文本进行递归的切分，来保持相关的文本片段相邻，保持切分结果内部的语意相关性。  

默认的分隔符列表是 `["\n\n", "\n", " ", ""]`，你可以认为它切割的逻辑就是，先把把原文切分成段落，然后切分成句子、单词，然后根据我们定义的每个 chunk 的大小，尽可能放在一起，来保证语意的连贯性和相关性。

最影响切分质量的就是两个参数：
1. `chunkSize` 其定义了切分结果中每个块的大小，这决定了 LLM 在每个块中能够获取的上下文。需要根据数据源的内容类型来制定，如果太大一个块中可能包含多个信息，容易导致 LLM 分神，并且这个结果会作为对话的上下文输入给 LLM，导致 token 增加从而增加成本。如果过小，则可能一个块中无法包含完整的信息，影响输出的质量。
2. `chunkOverlap` 定义了，块和块之间重叠部分的大小，因为在自然语言中内容是连续性的，分块时一定的重叠可以让文本不会在奇怪的地方被切割，并让内容保留一定的上下文。较大的 `chunkOverlap` 可以确保文本不会被奇怪地分割，但可能会导致重复提取信息，而较小的 `chunkOverlap` 可以减少重复提取信息的可能性，但可能会导致文本在奇怪的地方切割。

我们使用这来切分一下《孔乙己》这个短篇小说


```js
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { TextLoader } from "langchain/document_loaders/fs/text";

const loader = new TextLoader("data/kong.txt");
const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 64,
    chunkOverlap: 0,
  });

const splitDocs = await splitter.splitDocuments(docs);
```

现在 `splitDocs` 存储的就是切割后的文本，我们看一下效果

```js
[
  Document {
    pageContent: "鲁镇的酒店的格局，是和别处不同的：都是当街一个曲尺形的大柜台，柜里面预备着热水，可以随时温酒。做工的人，傍午傍晚散了工，每每花四",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 1, to: 1 } } }
  },
  Document {
    pageContent: "文铜钱，买一碗酒，——这是二十多年前的事，现在每碗要涨到十文，——靠柜外站着，热热的喝了休息；倘肯多花一文，便可以买一碟盐煮笋，",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 1, to: 1 } } }
  },
  Document {
    pageContent: "或者茴香豆，做下酒物了，如果出到十几文，那就能买一样荤菜，但这些顾客，多是短衣帮，大抵没有这样阔绰。只有穿长衫的，才踱进店面隔壁",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 1, to: 1 } } }
  },
  Document {
    pageContent: "的房子里，要酒要菜，慢慢地坐喝。",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 1, to: 1 } } }
  },
  Document {
    pageContent: "我从十二岁起，便在镇口的咸亨酒店里当伙计，掌柜说，我样子太傻，怕侍候不了长衫主顾，就在外面做点事罢。外面的短衣主顾，虽然容易说",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 3, to: 3 } } }
  },
  ...
  ]
```

因为原始数据中，一行就是一段，中间用空行分割，所有前几个 `Document` 的 meta 都是 `lines: { from: 1, to: 1 }`。  
我们可以使用 [ChunkViz](https://chunkviz.up.railway.app/) 去可视化的看一下效果。（注意，这里将 chunkSize 只是为了教学，一般不会设置的这么低）

![CleanShot 2024-03-25 at 18.35.08@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44ee74774a5c432e8b623b15235365b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1558&h=1378&s=885743&e=png&b=ffffff)


然后，我们可以尝试去设置 `chunkOverlap` 去看，文档块之间的重叠是如何设置和形成的，


```js
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 64,
    chunkOverlap: 16,
  });

const splitDocs = await splitter.splitDocuments(docs);
```

```js
[
  Document {
    pageContent: "鲁镇的酒店的格局，是和别处不同的：都是当街一个曲尺形的大柜台，柜里面预备着热水，可以随时温酒。做工的人，傍午傍晚散了工，每每花四",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 1, to: 1 } } }
  },
  Document {
    pageContent: "工的人，傍午傍晚散了工，每每花四文铜钱，买一碗酒，——这是二十多年前的事，现在每碗要涨到十文，——靠柜外站着，热热的喝了休息；倘",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 1, to: 1 } } }
  },
  Document {
    pageContent: "—靠柜外站着，热热的喝了休息；倘肯多花一文，便可以买一碟盐煮笋，或者茴香豆，做下酒物了，如果出到十几文，那就能买一样荤菜，但这些",
    metadata: { source: "data/kong.txt", loc: { lines: { from: 1, to: 1 } } }
  },
  ...
]
```

![CleanShot 2024-03-28 at 00.18.59@2x.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02fcd49dd3654a3c8a5b7f7a3b9c023e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1522&h=356&s=230094&e=png&b=ffffff)

图中墨绿色的部分就是两个文档块之间重叠的部分。  

你可以认为，`RecursiveCharacterTextSplitter` 是所有切分块的基础，也是当开始一个文本切割任务时，最推荐作为开始的工具。理解了这个切分函数的行为模式，也就是理解了切分函数的工作模式。因为这是比较通用的切分函数，可以在完整实现所有 Chain 之后，再去看切分函数是否影响了最终的质量，来决定是调整切分的参数，还是选择其他切分工具。  

切分函数最核心的两个参数是 `chunkSize` 和 `chunkOverlap`，在市面上你会看到很多教你如何设置这个思路，都是定性的讨论，有各种逻辑和思路。但就具体实践来说，先设定为默认的 1000 和 200，然后使用 ChunkViz 去检查部分结果是否符合预期，然后根据人类对语意的理解去调整到一个合适的值。然后，在整个 chain 完成后，根据最终结果的质量和生成过程中的 log 去查找是哪部分影响了最终的结果质量，再去决定是否调整这两个参数。因为自然语言的特殊性，其实是很难找到一个完美的参数值，在早期过多精力和时间消耗在这的价值不大。  

可以看到我们花了大量的篇幅去讲解 `RecursiveCharacterTextSplitter`，在大家理解了这个基石一般的切分函数后，剩下的常用切分函数就很好理解了，就是对不同目标文档进行了优化。


## Code

因为 langchain 所支持的语言是一直在变动的，可以通过这个函数查询目前支持的语言


```js
import { SupportedTextSplitterLanguages } from "langchain/text_splitter";

console.log(SupportedTextSplitterLanguages); 
```


```js
[
  "cpp",      "go",
  "java",     "js",
  "php",      "proto",
  "python",   "rst",
  "ruby",     "rust",
  "scala",    "swift",
  "markdown", "latex",
  "html",     "sol"
]
```

可以看到常见的语言都是支持的，我们以 js 为例去看看切分代码是什么效果


```js
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const js = `
function myFunction(name,job){
	console.log("Welcome " + name + ", the " + job);
}

myFunction('Harry Potter','Wizard')

function forFunction(){
	for (let i=0; i<5; i++){
        console.log("这个数字是" + i)
	}
}

forFunction()
`;

const splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
  chunkSize: 64,
  chunkOverlap: 0,
});
const jsOutput = await splitter.createDocuments([js]);
```

输出
```js
[
  Document {
    pageContent: "function myFunction(name,job){",
    metadata: { loc: { lines: { from: 2, to: 2 } } }
  },
  Document {
    pageContent: 'console.log("Welcome " + name + ", the " + job);\n}',
    metadata: { loc: { lines: { from: 3, to: 4 } } }
  },
  Document {
    pageContent: "myFunction('Harry Potter','Wizard')",
    metadata: { loc: { lines: { from: 6, to: 6 } } }
  },
  Document {
    pageContent: "function forFunction(){\n\tfor (let i=0; i<5; i++){",
    metadata: { loc: { lines: { from: 8, to: 9 } } }
  },
  Document {
    pageContent: 'console.log("这个数字是" + i)\n\t}\n}',
    metadata: { loc: { lines: { from: 10, to: 12 } } }
  },
  Document {
    pageContent: "forFunction()",
    metadata: { loc: { lines: { from: 14, to: 14 } } }
  }
]
```

从调用方式上，你也能猜到，对 js 的分割本质上就是将 js 中常见的切分代码的特定字符传给 `RecursiveCharacterTextSplitter`，然后还是根据 `Recursive` 的逻辑进行切分，跟对正常 text 切分的逻辑是一样的。


## Token
这个切分函数使用场景并不多，因为切分的时候并不是根据各种符号（例如标点）等进行切分来尝试保持语义性，就是根据 token 的数量进行切分，仅适合对 token 比较敏感的场景，或者与其他切分函数组合使用。  

具体到使用场景，用起来很方便

```js
import { TokenTextSplitter } from "langchain/text_splitter";

const text = "I stand before you today the representative of a family in grief, in a country in mourning before a world in shock.";

const splitter = new TokenTextSplitter({
  chunkSize: 10,
  chunkOverlap: 0,
});

const docs = await splitter.createDocuments([text]);
```

```js
[
  Document {
    pageContent: "I stand before you today the representative of a family",
    metadata: { loc: { lines: { from: 1, to: 1 } } }
  },
  Document {
    pageContent: " in grief, in a country in mourning before a",
    metadata: { loc: { lines: { from: 1, to: 1 } } }
  },
  Document {
    pageContent: " world in shock.",
    metadata: { loc: { lines: { from: 1, to: 1 } } }
  }
]
```
其中 `chunkSize` 和 `chunkOverlap` 的逻辑跟 `RecursiveCharacterTextSplitter` 的定义是一样的  

## 小结

本节我们介绍了切分函数这个概念，方便将较长的文档切分成长度合适、语意相关的模块，其中最重要的就是理解 `chunkSize` 和 `chunkOverlap` 这两个概念，理解其现实含义和效果，并在实战中根据情况进行调整。

