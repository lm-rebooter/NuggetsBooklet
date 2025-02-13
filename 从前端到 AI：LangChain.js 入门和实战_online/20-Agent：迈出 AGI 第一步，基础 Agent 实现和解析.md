> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/node/agent-react-rmb.ts

这一章我们正式开始学习和使用 agents，我们会通过几个例子去解析 agents 内部的运行流程，去分析 llm 是如何思考、分析、调用工具、观察结果以及做出最终决定。  

通过这些例子，你会更加理解，我们整个小册一直在说的理念：将 llm 作为推理引擎。具体来说，我们应该通过 RAG、web 等等方式去获取解决问题的充足信息，然后将 llm 作为自然语言的理解和推理引擎据此给出答案，Agents 就是自动去做这个过程。  


## Lang Smith
Agents 内部可能会有复杂和多轮的各种 llm 和 chain 的调用，在之前我们是使用 verbose 模式，通过命令行打印出详细的调用情况来观察其原理。而在 agents 里就比较困难，其在 cli 中打印出来的内容很容易超出默认的显示上限，可以尝试：

```js
ts-node xxx.ts > tool-call.txt 
```

将所有的 stdout 定向输出到一个 txt 中，如果需要定向 stderr 就需要：

```js
ts-node xxx.ts > output.txt 2>error.txt
```

即使一个只使用一次 tool 的 agent 也能打出近 3k 行输出，所以使用 verbose 模式就很难进行分析。  

我们接下来介绍 langchain 官方推出的分析工具 -- lang smith。可视化的追踪和分析 agents/llm-app 的内部处理流程是 langchain 官方和社区都看好的路线，用起来也很方便。  

在 [LangSmith](https://docs.smith.langchain.com/) 上注册，获取 API key，然后在运行时设置环境变量，设置方式取决于你的运行环境：

```js
LANGCHAIN_TRACING_V2=true  
LANGCHAIN_API_KEY=<your-api-key>
```

如果是在 nodejs 中，可以使用我们前面使用过的 `dotenv/config` 加载 .env 文件，病在其中设置环境变量。  

本章的代码都是在 nodejs 环境中运行的。

## ReAct 框架

ReAct 框架是非常流行的 agent 框架，其结合了推理（reasoning）和行动（acting），其流程大概是让 llm 推理完成任务需要的步骤，然后根据环境和提供的工具进行调用，观察工具的结果，推理下一步任务。 就这样 推理-调用-观察 交错调用，直到模型认为完成推理，输出结果。  

ReAct 的意义是在于，这个框架将 llm 的推理能力、调用工具能力、观察能力结合在一起，让 llm 能适应更多的任务和动态的环境，并且强化了推理和行动的协同作用。因为 agents 在执行过程中，会把思考和推理过程记录下来，所以具有很好的透明度和可解释性，提高了用户对输出结果的可信度。  

在大概了解了背景后，让我们直接在代码里试一下，我们先定义提供给 agents 的工具集，也就是在推理过程中 agents 能够使用工具，这决定了其能够解决问题的范围和类型，我们这里提供了网络搜索能力和计算能力，其中 `SerpAPI` 是在前面 loader 章节我们使用过的，大家也可以使用 SearchAPI、TavilySearch 等其他流行的网络搜索工具。 

```js
  const tools = [new SerpAPI(process.env.SERP_KEY), new Calculator()];
```

然后我们从 langchain hub 拉取 reAct 的 prompt，前者是由 langchain 提供的用于共享、管理和使用 prompt 的站点：

```
  const prompt = await pull<PromptTemplate>("hwchase17/react");
```
我们可以在 https://smith.langchain.com/hub/hwchase17/react 去查看其中的 prompt，这也是 reAct 框架的精华：

```
Answer the following questions as best you can. 

You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought:{agent_scratchpad}
```

我们来逐步解析这个 prompt：
- 首先第一部分定义了任务，因为这是一个通用领域的 agents，所以内容是 尽可能的回答用户的问题，这也是给模型设定了一个明确的出发点。
- 然后确定了模型有哪些工具可以用，如果我们使用 langchain 的内置工具（tool），langchain 已经给每个工具提供了完整的描述。后面我们也会去创建自己的工具
- 然后就是 reAct 的核心部分，定义了固定的格式和思考的路线，这部分也是记录了 llm 整个的思考过程，也会作为 prompt 在每次调用 llm 时传入，让其知道之前的思考流程和信息
    - Question：定义用户的问题，也是整个推理的最终目标，也是模型推理的起点
    - Thought：引导模型进行思考，考虑下一步采取的行动，构建解决问题的策略和步骤，也就是推理阶段。这部分也会记录在 prompt 中，方便我们去理解 llm 推理和思考的过程
    - Action：定义模型需要采取的行动，这里需要是 tools 中提供的 tool，这就是模型需要采取的行动
    - Action Input：调用工具的参数，参数是连接用户的问题、模型的思考和实际行动的关键环节
    - Observation：是 Action 的调用结果，给模型提供反馈，帮助模型根据前一 Action 的行动结果，决定后续的推理和行动步骤
    - Final Answer：上面的步骤会重复多次，直到模型认为现有的推理、思考和观察已经能够得出答案，就根据信息总结出最终答案  

其实，这里就是通过定义思考和推理的格式和步骤，去引导 llm 以固定的步骤去进行推理和思考。   

然后，我们将其他代码补充上：

```js
  const llm = new ChatOpenAI({
    temperature: 0,
  });

  const agent = await createReactAgent({
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
```

这里我们提问 `我有 17 美元，现在相当于多少人民币？`，这是一个需要网络搜索 + 计算的问题，目的是测试 agents 多次推理的效果。 然后我们打开 langSmith 去观察其中的流程：

首先，第一次 llm 调用，其 prompt 是，其中我使用 “...” 省略了一部分重复内容：

```
Answer the following questions as best you can. You have access to the following tools:

search: a search engine. useful for when you need to answer questions about current events. input should be a search query.
calculator: Useful for getting the result of a math expression. The input to this tool should be a valid mathematical expression that could be executed by a simple calculator.

Use the following format:
...
Final Answer: the final answer to the original input question

Begin!

Question: 我有 17 美元，现在相当于多少人民币？
Thought:
```

这里，传入了提供给大模型的两个工具 -- search 和 calculator，只要我们使用的是 langchain 的内置工具，这些描述和实现都是预制好的。  

在思考部分，就是提供了用户的原始问题，然后引导大模型进行思考，模型输出：

```js
我需要知道当前的美元对人民币的汇率。
Action: search
Action Input: current USD to CNY exchange rate
```
这部分会直接添加到 prompt 的 agent_scratchpad 变量中，所以模型的第一个思考就是 `我需要知道当前的美元对人民币的汇率`，这是模型认为解决问题他所欠缺的信息，然后调用 search 进行查询。  

这部分就会由 langchain 的 agentExecutor 进行处理，parse 出来对工具调用的部分成为格式化的输出：

```js
{
  "tool": "search",
  "toolInput": "current USD to CNY exchange rate",
  "log": "我需要知道当前的美元对人民币的汇率。\nAction: search\nAction Input: current USD to CNY exchange rate"
}
```
这里的 log 部分是记录了模型的原始输出，方便后续进行 debug。 tool 是 parse 出来的工具名称，toolInput 是工具是输入。  

然后，调用对应的 SerpAPI 工具进行查询，其返回结果是 `7.24 Chinese Yuan`。  


将输出的结果处理后，parse 成 reAct agent_scratchpad 需要的格式，然后传递给 llm 做下一步的思考和推理，其 prompt 是，同样使用 ... 省略了重复部分，下同：

```
Answer the following questions as best you can.
...

Begin!

Question: 我有 17 美元，现在相当于多少人民币？
Thought:我需要知道当前的美元对人民币的汇率。
Action: search
Action Input: current USD to CNY exchange rate

Observation: 7.24 Chinese Yuan
Thought: 
```

这里就是将 SerpAPI 的结果作为对 Action 行动的 Observation 传入，然后引导模型进行下一步的思考，模型输出：

```
现在我知道了当前的美元对人民币的汇率，我可以通过计算得到17美元相当于多少人民币。
Action: calculator
Action Input: 17 * 7.24
```

这里模型根据最新的观察（Observation），推理出目前的已知信息（Thought），并决策下一步的行动。并由 langchain 根据对 calculator 的调用，运行对应的函数，并将返回的输入放到 prompt 中。然后进行下一次 llm 的调用：  

```
Answer the following questions as best you can. 

...

Begin!

Question: 我有 17 美元，现在相当于多少人民币？
Thought:我需要知道当前的美元对人民币的汇率。
Action: search
Action Input: current USD to CNY exchange rate

Observation: 7.24 Chinese Yuan
Thought: 现在我知道了当前的美元对人民币的汇率，我可以通过计算得到17美元相当于多少人民币。
Action: calculator
Action Input: 17 * 7.24


Observation: 123.08
Thought: 
```
模型输出：

```
我现在知道17美元相当于123.08人民币。
Final Answer: 123.08人民币
```

最终，agentExecutor 读取到 Final Answer，获取到这是 agent 执行的最终结果，然后 agent 执行完成，输出结果。  

我不清楚大家目前的感受，在我第一次尝试和把玩 reAct 框架时，我认为这就是 AGI 的第一步，我们可以通过非常简洁的 prompt 去引导模型自主的进行思考、推理、调用人类现有的工具，然后循环这些步骤最终得出结论。假以时日，随着基础模型的发展，我们也更加了解模型的运转模式，进一步去优化整个的流程和提供的工具，来进一步激发模型的能力。  

但就目前 reAct 框架还是有一些问题：
- 复杂性和开销  
最终结果的正确性依赖于每一步的精准操作，而每一步的操作是我们很难控制的。从 prompt 来看，其实只定义了基本的思考方式，后续都是 llm 根据自己理解进行推理。
- 对外部数据源准确性的依赖  
 reAct 假设外部信息源都是真实而确定的，并不会引导模型对外部数据源进行辩证的思考，所以如果数据源出现问题，推理结果就会出问题。
- 错误传播和幻觉问题   
推理初期的错误会在后续推理中放大，特别是外部数据源有噪声或者数据不完整时。在缺乏足够量数据支持时，模型在推理和调用阶段可能会出现幻觉。
- 速度问题   
reAct 会让模型 “慢下来” 一步步的去思考来得出结论，所以即使是简单的问题也会涉及到多次 llm 调用，很难应用在实时的 chat 场景中。  

就实际使用中，还有一个明显的问题是：对基础模型的能力要求比较高。 reAct 依赖模型返回正确格式的回复，但又没有像 langchain 其他内置工具（如各种 output parser）用基于 few-shot learning 的复杂 prompt 去保证模型输出的格式，导致 llm 很容易返回格式错误的结果。  
例如在上述问题中，如果使用 gpt3.5，其遵从指令（follow instruction）的能力是弱于 gpt4，就很容易在中间过程中返回不符合格式要求的回复，导致推理中断。  


总的来说，我认为 reAct 是非常创新的 agents 框架，启发了很多后续框架的思考。在当前这个时间，reAct 并不是 agents 的最优选择，但这是学习 agents 原理和思想，了解如何将 llm 作为推理引擎非常好的开始。因为 agents 的能力范围很受 tools 的影响，大家可以 [tools](https://api.js.langchain.com/classes/langchain_community_tools_calculator.Calculator.html) 去找到更多内置的 tools，然后问更多问题并通过 langSmith 去观察和感受 llm 的思考和推理过程，我相信你会对上一章 agents 的介绍又更多深入的思考，也更理解我的思考和对 agents 的看法，即 agents 距离工程上的实用还有一点的距离，但这确实是 AGI 的曙光。


## 小结
这一节我们学习了对复杂 langchain 解析的工具 langSmith 的配置，这个特别是在 agents 的场景非常有用，但日常简单的 chain 使用 verbose 模式就完全足够了。  

然后，我们以一个例子去分析了非常流行的 agents 框架 reAct 的使用，分析其思考模式和推理过程，希望大家在课后去尝试一些各种类型和领域的问题，观察 llm 的推理能力。  

在下一章节，我们将学习新的实现 agents 方式，也会学到如何更深入的定制和影响 agents。























