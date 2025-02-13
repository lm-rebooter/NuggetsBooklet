> 本章对应源代码：  
> https://github.com/RealKai42/langchainjs-juejin/blob/main/node/agent-tool.ts  
> https://github.com/RealKai42/langchainjs-juejin/blob/main/node/agent-tool-customized.ts

这一章我将学习新的 agents 的实现方式，并去实现自定义的 tool 接入到 agents 中，来实现对 agents 更加深入的定制和使用。  


## OpenAI tools Agents

就目前来说，满足稳定和使用的 agents 其实是直接使用 openAI 的 tools 功能。 Agents 所做的事情就是自我规划任务、调用外部函数和输出答案。而 openAI 的 tools 功能恰好如此，提供了 tools 接口，并且由 llm 去决定何时以及如何调用 tools，并根据 tools 的运行结果生成给用户的输出。  

由于 openAI 对 gpt3.5t 和 gpt4 针对 tools 进行了微调，其能够针对 tools 场景稳定地生成合法的调用参数。不会出现 reAct 中使用低性能的 llm 导致的 parse 报错而运行出错的问题。  

我们依旧使用 SerpAPI 和 Calculator 作为 llm 的工具，然后拉去相应的 prompt：

```js
  const tools = [new SerpAPI(process.env.SERP_KEY), new Calculator()];

  const prompt = await pull<ChatPromptTemplate>("hwchase17/openai-tools-agent");
```

我们可以在 [openai-tools-agent](https://smith.langchain.com/hub/hwchase17/openai-tools-agent) 去查看 prompt 的内容，其非常简单：

```js
[
    ["system", "You are a helpful assistant"],
    {chat_history},
    ["HUMAN", "{input}"],
    {agent_scratchpad}
]
```
其中 `chat_history` 和 `agent_scratchpad` 是 MessagePlaceHolder。因为 openAI 模型本身的强大，已经具有自主决策 tool 调用的能力，从 prompt 上并不需要提供额外的信息和规则。

然后我们补全其他代码：

```js
  const llm = new ChatOpenAI({
    temperature: 0,
  });
  const agent = await createOpenAIToolsAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });

  const result = await agentExecutor.invoke({
    input: "我有 17 美元，现在相当于多少人民币？",
  });

  console.log(result);
```
然后，使用 langSmith 去分析其中的流程：

首先，在第一个 llm 节点中，输入和输出是：

![CleanShot 2024-04-14 at 23.07.16@2x.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7523052450c42c89a45907fcb154f43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1410&h=1718&s=152932&e=png&b=ffffff)

是正常的输入用户的问题，llm 返回对 serpAPI 的调用，直接请求搜索 “17 USD to CNY”。 对比 reAct 框架，在 reAct 中，我们相当于引导 llm 去一步步进行思考，逐步获取完成任务所需要的信息，所以 llm 是先查询人民币和美元的汇率，再使用计算器进行乘法运算。  
而在 openAI 中，gpt 是直接使用 serpAPI 查询最终结果。但就单一的测试并不能说明什么，也不能说执行两次的路就是差于执行一次。  

后面就是，serpAPI 返回正常结果：
![CleanShot 2024-04-14 at 23.13.27@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4944d354408745d2bb440248e893dd0e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1412&h=874&s=77812&e=png&b=ffffff)

然后再次调用 llm 节点：

![CleanShot 2024-04-14 at 23.14.18@2x.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b58e5b55b7d43be8a623cf2a2f0ea9d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1414&h=2090&s=180240&e=png&b=ffffff)

由 llm 生成最终的结果。注意，这里 AI 对 tool 的请求和 tool 的返回是由 prompt 模板中 `agent_scratchpad` 引入的，在正常的 chat history 中并不会包含 tool 调用和返回信息。  


我们可以用另一个问题再测试下，输入 “我有 10000 人民币，可以购买多少微软股票”，然后通过 lang Smith 进行观察，第一次 llm 节点调用是：

![CleanShot 2024-04-14 at 23.18.01@2x.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/209c9950d3ad44c2ac4f3299610a78b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1410&h=1702&s=161769&e=png&b=ffffff)

是请求 serp 搜索微软当前的股价，serp 正常返回，然后第二次 llm 节点的调用是：

![CleanShot 2024-04-14 at 23.18.55@2x.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5399839066cf4ec69509c23cab8c5f78~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1410&h=2865&s=296353&e=png&b=ffffff)

是请求 calculator 计算 10000 / 421.9。   

这里有三个需要注意的点：
1. gpt作为一个 agents，是具有自主推理并根据当前的信息去连续多次调用 tool 的能力。在 reAct 框架中，是我们让 llm 先进行推理（Thought）然后决定是否需要调用 tool （Action），而在 gpt 中这些流程是在其内部发生的。
2. 这个结果显然是错误的，gpt 并没有考虑到美元的汇率问题，单纯的硬算 10000 / 421.9
3. 以及如果你在问题中强调了美元和人民币问题，gpt 是会对股价和汇率进行依次查询，而不会同时请求两个 tool 的调用，虽然在 openai 的文档中说是支持并行的调用，这可能模型目前的缺陷。


## 自定义 Tool

无论是 reAct 还是 OpenAI tools 亦或是其他的 agents 框架，我们能够提供给 agents 的 tool 都影响着 agents 应用范围和效果。 除了使用 langchain 内部提供的一系列 tools 外，我们可以自定义 tool 让 agents 去使用。  

目前由两种可以自定义的 tool，需要的参数都是工具的名称、描述和真实调用的函数，注意这里名称和描述将影响 llm 何时调用，所以一定是有语意的。 在函数的实现上，不要抛出错误，而是返回包含错误信息的字符串，llm 可以据此决定下一步行动。   
两种自定义的 tool 也有细微的区别：
- `DynamicTool`，只支持单一的字符串作为函数输入。因为向 reAct 框架，并不支持多输入的 tool
- `DynamicStructuredTool`，支持使用 zod schema 定义复杂的输入格式，适合在 openAI tools 中使用  

对于想在任意 agents 框架中使用的工具，可以使用 `DynamicTool` 创建只有一个输入的 tool，例如：

```js
  const stringReverseTool = new DynamicTool({
    name: "string-reverser",
    description: "reverses a string. input should be the string you want to reverse.",
    func: async (input: string) => input.split("").reverse().join(""),
  });
```

更常见的是，我们可以将前面做的 RAG chain 作为工具提供给 agents，让其由更大范围调用知识和信息的能力，我们先创建一个 retriever chain

```js
async function loadVectorStore() {
  const directory = path.join(__dirname, "../db/qiu");
  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await FaissStore.load(directory, embeddings);

  return vectorStore;
}
```

```js
  import { createStuffDocumentsChain } from "langchain/chains/combine_documents"; 
  import { createRetrievalChain } from "langchain/chains/retrieval";
  
  const prompt = ChatPromptTemplate.fromTemplate(`将以下问题仅基于提供的上下文进行回答：
    上下文：
    {context}

    问题：{input}`);
  const llm = new ChatOpenAI();

  const documentChain = await createStuffDocumentsChain({
    llm,
    prompt,
  });

  const vectorStore = await loadVectorStore();
  const retriever = vectorStore.asRetriever();

  const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever,
  });

  return retrievalChain;
```
这里我们利用了langchain 内置的两个创建 chain 的一直工具，`createStuffDocumentsChain` 和 `createRetrievalChain`。 前者是内置了对 Document 的处理和对 llm 的调用，后者是内置了对 retriver 的调用和将结果传入到 `combineDocsChain` 中。 其源码跟我们之前自己实现的类似，这里是为了省事直接使用内置的工具。  

然后，我们将此创建为 `DynamicTool`：

```js
  const retrieverTool = new DynamicTool({
    name: "get-qiu-answer",
    func: async (input: string) => {
      const res = await retrieverChain.invoke({ input });
      return res.answer;
    },
    description: "获取小说 《球状闪电》相关问题的答案",
  });
```

然后我们再使用 `DynamicStructuredTool` 去创建一个复杂输入的 tool：

```js
  const dateDiffTool = new DynamicStructuredTool({
    name: "date-difference-calculator",
    description: "计算两个日期之间的天数差",
    schema: z.object({
      date1: z.string().describe("第一个日期，以YYYY-MM-DD格式表示"),
      date2: z.string().describe("第二个日期，以YYYY-MM-DD格式表示"),
    }),
    func: async ({ date1, date2 }) => {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const difference = Math.abs(d2.getTime() - d1.getTime());
      const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
      return days.toString();
    },
  });
```
这里使用 zod 来定义函数输入的格式，并且 agents 在调用 tool 时，参数会经过 zod 进行校验，如果出错会直接将校验的错误信息返回给 llm，其会根据报错信息调整输入格式。   

然后，让我们尝试将这些自定义 tool 放入 agents 去试用一下，我们先用 reAct agent 去测试，因为我们更方便地观察其内部的思考和推理流程：

```js
  const tools = [retrieverTool, new Calculator()];
  // 创建 agents 的代码省略
  const res = await agents.invoke({
      input: "小说球状闪电中量子玫瑰的情节",
  });
```
整个推理和行动过程是：

```
Question: 小说球状闪电中量子玫瑰的情节
Thought:这是一个关于小说《球状闪电》的问题，我需要使用get-qiu-answer工具来获取答案。
Action: get-qiu-answer
Action Input: 量子玫瑰的情节

Observation: 量子玫瑰的情节主要是关于主人公在战后与戴琳结婚并开始新的生活。他们过上了经济复苏但艰难的生活，并在一年后有了一个孩子。他们的生活被一个美国天文学家，诺顿·帕克的来访打扰，他进一步讨论了SETI@home项目，并向主人公介绍了他主持的一项球状闪电应用项目。同时，主人公回忆起他与林云在战争中侵入SETI的分布式计算服务器的过去。

在另一个段落中，主人公谈到了他与妻子一只蓝色的玫瑰花的故事。尽管他无法看见它，但是通过花瓶中的水晶以及远处窗外的夜风，他可以感知到它的存在。他期望在人生的尽头，他再一次看到这朵蓝色的玫瑰。

然后，关于量子态的讨论出现在后来的情节中，其中主人公和其他人物讨论了关于量子化、概率云、量子态等复杂的物理概念。同时，这些讨论也涉及到了主人公和林云的过去，以及他们在战争中的经历。
Thought: 我现在知道了最后的答案。
Final Answer: 量子玫瑰的情节主要是关于主人公在战后与戴琳结婚并开始新的生活。他们过上了经济复苏但艰难的生活，并在一年后有了一个孩子。他们的生活被一个美国天文学家，诺顿·帕克的来访打扰，他进一步讨论了SETI@home项目，并向主人公介绍了他主持的一项球状闪电应用项目。同时，主人公回忆起他与林云在战争中侵入SETI的分布式计算服务器的过去。

在另一个段落中，主人公谈到了他与妻子一只蓝色的玫瑰花的故事。尽管他无法看见它，但是通过花瓶中的水晶以及远处窗外的夜风，他可以感知到它的存在。他期望在人生的尽头，他再一次看到这朵蓝色的玫瑰。

然后，关于量子态的讨论出现在后来的情节中，其中主人公和其他人物讨论了关于量子化、概率云、量子态等复杂的物理概念。同时，这些讨论也涉及到了主人公和林云的过去，以及他们在战争中的经历。
```

如果我们问其他数学问题，也能正确回答：

```js
    const res = await agents.invoke({
      input: "我有 17 个苹果，小明的苹果比我的三倍少 10 个，小明有多少个苹果？",
    });
```

```
Question: 我有 17 个苹果，小明的苹果比我的三倍少 10 个，小明有多少个苹果？
Thought:这是一个数学问题，我需要先计算出小明的苹果是我苹果的三倍，然后再减去10个。
Action: calculator
Action Input: 17*3-10

Observation: 41
Thought: 我现在知道最后的答案
Final Answer: 小明有41个苹果。
```


如果想要使用由复杂输入的 tool，例如我们前面创建的 dateDiffTool，就需要使用支持复杂输入的 agents 框架，例如 openAI tools：

```js
  const tools = [retrieverTool, dateDiffTool, new Calculator()];
  // 创建 agents 的代码省略
  const res = await agents.invoke({
      input: "今年是 2024 年，今年 5.1 和 10.1 之间有多少天？",
  });
```

其思考过程是：

![CleanShot 2024-04-15 at 13.56.13@2x.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e2664436cef4256b94bb5a3c6c54462~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1594&h=2410&s=238059&e=png&b=ffffff)

我们演示的都是较为简单的问题，对于复杂的问题 agents 会逐步推理和应用不同的 tools 来得出最终的结果。所以 tools 的种类、能力很大程度上决定了 agents 的上限，但对于 reAct 这种框架，tools 是作为 prompt 嵌入到 llm 上下文中，所以过多的 tools 会影响用于其他内容的 prompt。 同样的，openAI tools 的描述和输入的 schema 也是算在上下文中，也受窗口大小的限制。所以并不是 tools 越多越好，而是根据需求去设计。   

所以，跟 chain 一样，复杂 agents 可以同样采用路由的设计，由一个入口 agents 通过 tools 链接多个垂直领域的专业 agents，根据用户的问题进行分类，然后导向到对应的专业 agents 进行回答。  

在这种实现时，每个子 agents 通过 `DynamicTool` 进行定义，并且传入 `returnDirect: true`，这样会直接将该 tool 调用的结果作为结果返回给用户，而不是将 tool 的结果再次传给 llm 并生成输出。如果大家觉得有点绕，这里我用前面 retriever 的例子演示一下：

```js
  const retrieverChain = await getRetrieverChain();
  const retrieverTool = new DynamicTool({
    name: "get-qiu-answer",
    func: async (input: string) => {
      const res = await retrieverChain.invoke({ input });
      return res.answer;
    },
    description: "获取小说 《球状闪电》相关问题的答案",
    returnDirect: true,
  });

  const tools = [retrieverTool, new Calculator()];
  const agents = await createReactAgentWithTool(tools);

  const res = await agents.invoke({
    input: "用一句话，介绍小说球状闪电中，跟量子玫瑰有关的情节"
  });
  console.log(res);
```
![CleanShot 2024-04-15 at 17.39.25@2x.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ceb141a845634bf986cc07efb50f4a8f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2274&h=1160&s=352072&e=png&b=ffffff)

从 langSmith 的数据可以看到，当调用 `get-qiu-answer` 这个 tool 后，直接把 tool 的结果当做整个 agents 运行的最终结果返回了，而不是像前面一样再经过一次 llm 节点生成答案。所以，我们就可以利用 `returnDirect` feature，将入口的 agent 作为 route，去导向到不同领域的专业 agent，这也是多 agents 协同的一种方式。 


## 小结
这是 agents 模块的最后一章，这一模块中，我们首先学习了 function calling（tools）这个强大的能力，得益于 openAI 对模型的微调，我们可以利用这一稳定的调用，实现 tagging、extraction 等多种能力。  

我们也探索了 AGI 的第一步 -- agents。对于 agents，我们介绍了 reAct 这个非常流行也是非常基础的 agents 模式，后续很多 agents 框架都是基于此进行改进。我们也介绍了使用 openAI tools 作为能力基础的 openAI tools agents，这是非常稳定、效果非常好的方案，并且扩展性很好，支持调用复杂参数的 tool、并行调用 tool 等特性。  

在 reAct 之后，agents 作为 AGI 的曙光，涌现了无数各式各样的框架，作为模块的最后一章，我给大家一些关于 agents 的 take away：
1. 如果对 agents 机制感兴趣，去把玩一下 reAct，然后加入各种 tools、提各种问题，去观察 llm 的思考过程。也可以去尝试一下最新的 agents 框架，感受一下如何让 llm 学习人类的思考模式来解决问题。
2. 如果你的目标可以在一定程度下被描述，或者具有相对的确定性。 用 `RunnableBranch` 基于 llm 去做 route，这会让你以更可控的方式去解决问题，后续也方便优化，不要使用 agents。
3. 如果你确实需要在工程中使用 agents，使用 openAI tools agents，这是目前最稳定的方案。并通过在 AgentExecutor 中设置maxIterations 来减少极端情况对 tokens 的无限制使用。













