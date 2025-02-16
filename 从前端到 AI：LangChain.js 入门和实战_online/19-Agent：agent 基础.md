> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/agent.ipynb

这一章我们开始正式接触 Agent 这个非常火的概念，我们不会从非常学术的角度去探讨，而是从工程和实际出发，去讨论它的可用性、实用性、什么时候可以用、什么时候不要用等信息。  

我们先聊 Agent 是什么？ 事实上并没有特别严谨的定义，目前对 Agents 领域还处于探索的状态。就目前的理解，Agents 是一个自主的决策和执行过程，其核心是将 llm 作为推理引擎，根据 llm 对任务和环境的理解，并根据提供的各种工具，自主决策一系列的行动。  

就 Agents 执行中的过程中，一般是：
- 首先根据用户提供的问题进行思考，列出解决该问题需要执行的第一个任务 / 一系列任务
- 根据现有的工具集找到合适的工具，传递合适的参数，执行工具
- 观察工具输出的结果
- 根据工具输出的结果和现有环境信息，决策下一个任务的工具和参数
- 如果 llm 认为问题已经解决，输出答案

上面是常见的单体 Agent 的执行流程，其在运行和调用工具的过程中，会有 memory 模块去记录当前的环境信息和之前工具的运行信息，并作为下一步决策的依据。  

而目前另一个最近流行的理念是，多代理系统（MAS, Multi-Agent Systems），也就是一个通过多个有固定角色 Agents 构成的系统，并且，每个 Agents 有独立的 memory 系统，对应自己角色的标准任务处理流程，独立进行决策和执行。  
在整体协作上，一般会定义完整的结构化的操作规程（SOP）来优化各代理间的协作和通信，各个 Agents 遵守定义好的标准流程执行自己的任务，并根据需要跟其他的 Agents 进行沟通。  

一般多 Agents 系统是模拟人类真实的协作模式，例如我们以模拟软件公司工作流程的系统为例，系统内会包含 产品经理、架构师、项目经理、工程师和质量保证工程师等多个 agents，对应人类世界中不同的角色。具体流程：
- 流程起源自 产品经理 agents，会对用户提出的需求进行分析，生成非常详细的产品需求文档（PRD），包含用户故事、需求汇总、产品目标等
- 架构师会将这些需求转换成系统设计的具体元素，例如拆分成代码文件列表、每个文件的实现任务、数据结构、软件架构、接口定义
- 项目经理会负责任务的分配，根据每个任务的特点分配到对应的工程师 Agents，例如前端、后端等角色
- 工程师一般会分配到一个模块化的任务，有详细的接口定义和任务描述，方便 agents 生成代码
- 质量保证工程师，也就是我们常说的测试工程师，会根据工程师的任务去创造测试样例
- 更复杂的系统会引入反馈机制，例如工程师开发时遇到问题可以获取之前 Agents 之间相关的的通信记录和设计文档进行修复。测试工程师也可以通过执行测试样例对开发工程师的任务进行检测和反馈。  

就目前如 AutoGPT、babyAGI、AutoGPT、metaGPT 等 Agents 这些比较 trending 的项目来看，llm agents 已经具有非常强大的自主协作能力，可以通过 agents 自己的思考和多 agents 的协同完成非常多复杂的任务。  

但就我个人看法，很多 agents 是非常偏前沿和探索，甚至是玩具的状态，目前有以下几个问题：
- 首先是安全问题。 对于复杂的环境感知和任务，我们需要给 agents 构造有读写能力的 tool，例如数据库的写入 tool，而目前的 llm 的稳定性并不强，有概率构造出具有安全性隐患的操作。 并且纯粹由 llm 编写的代码的质量是很玄学的，也可能有隐含的漏洞和 bug。不过就这一点上，我会任务在编码任务上，llm 的质量不会低于人类，或者说人类和 llm 容易犯错的地方是不同的。
- 复杂任务处理的效果差。目前高质量的 agent 需要定义非常良好的 prompt 和抽象清晰的执行流程，这些都需要大量的时间和有经验的专家调试，并且也很难覆盖所有场景，在这上面需要花费的精力并不小。当遇到新的环境和新的任务时，也能无法适应。
- llm 不确定性，可能会在任务分配和执行的过程中，出现难以理解的 bug，例如 autoGPT 等经常出现与语意上的死循环，agents 内部反复进行相似的对话和任务，而不会推进到下一步任务。甚至更离谱的两个 llm 互相连续疯狂道歉的场景，因为 llm 设计目标还是跟人类沟通。这些 llm 沟通上的 bug，很难通过传统的编码进行修复和避免，而从 prompt 上进行预防又比较难，如果在 prompt 涉及太多边缘场景的避免，会导致 prompt 过长，影响 llm 对任务的感知。
- 价格和时间，这是最关键的因素，以 autoGPT 为例，执行 50 个步骤就大概需要 15 美元左右，相当于 100 多人民币。并且考虑到 llm 的调用时间，完整运行 autoGPT 也得等待比较久，结果的质量也不一定有保证。   

综合来说，无论是单 agents 还是多 agents 系统，都是以 llm 作为推理引擎，通过各种 tool 来提供感知环境和改变环境的能力，经过 llm 多次迭代和沟通来生成高质量的结果，但距离以合理的成本和延迟应用在实战中，还有不少的工作要做。 就我看来，agents 需要人类对各种工作抽象出极高层级的抽象思想作为 prompt 输入给 llm，例如一个产品经理 agent，我们输入的不应该是详尽的产品经理工作手册，而是产品经理底层的思想和理念，把工作手册作为 RAG tool 提供给 agent，类似于 元 prompt/元思想的概念。  

回到工程中，如果是面向业务和实战，应该以实用性和可控性为主，以合理的成本获得合格的结果，而不是以非常高的成本和延迟获得一个稍好的结果，这也是本章和本课程的思想。  

在大概介绍了 agents 的现状后，让我们开始尝试在 langchain 中去使用 agents，我们会从实用性出发，去介绍一些目前达到可用水平的 agents. 


## RunnableBranch

如果你跟着小册运行和把玩过前面的一些例子，你会发现 llm 很多时候稳定性是玄学的，这些不稳定性在工程化的时候是一个挑战。所以，agent 的第一课就是，在可以不使用 agent 的情况下就尽量不使用 agent，在生产级别，我们还是希望尽可能保证确定性。  

但我们可以借鉴 agent 其中的一些思想，把任务进行分类，路由到擅长不同任务的 chain 中，然后对 chain 的结果进行处理、格式化等操作，这就是 `RunnableBranch` 的应用。  

我们想象一个场景，我们需要设计一个对话机器人，目标是来自多个领域的用户，同时我们拥有多个领域的高质量向量数据库，那我们应该是构建一个从多个数据库检索知识的 RAG 还是构建多个 RAG？  

答案一定是构建多个 RAG，针对每个领域去设计 prompt 和 RAG 策略，并且从单一数据库检索信息能有效数据源之间的互相污染，例如 LLM 这个缩写在计算机领域可以检索出大模型相关信息，从法学数据库检索出来的是法学硕士，将这两个放在 llm 的上下文中就会污染输出的质量。  

所以，从架构设计上，我们需要一个入口 llm，根据用户的提问进行分类，然后路由到不同的专业 chain，chain 内部的实现对外界透明，然后根据 chain 的返回值，进行一定处理（可选），然后输出结果给用户。  

我们来简单实现一下，首先定义分类用户提问 llm 节点：

```js
const classifySchema = z.object({
    type: z.enum(["科普", "编程", "一般问题"]).describe("用户提问的分类")
})

const model = new ChatOpenAI({
    temperature: 0 
})

const modelWithTools = model.bind({
    tools: [
        {
            type: "function",
            function: {
                name: "classifyQuestion",
                description: "对用户的提问进行分类",
                parameters: zodToJsonSchema(classifySchema),
            }
        }
    ],
    tool_choice: {
        type: "function",
        function: {
           name: "classifyQuestion"
        }
    }
})

const prompt = ChatPromptTemplate.fromMessages([
    ["system", `仔细思考，你有充足的时间进行严谨的思考，然后对用户的问题进行分类，
    当你无法分类到特定分类时，可以分类到 "一般问题"`],
    ["human", "{input}"]
])

const classifyChain = RunnableSequence.from([
    prompt,
    modelWithTools,
    new JsonOutputToolsParser(),
    (input) => {
        const type = input[0]?.args?.type
        return type ? type : "一般问题"
    }
])
```

因为我们希望构建面向工业使用、稳定的 llm，所以这里做了多层兜底：
- `classifySchema` 中我们将 `type` 指定为必选
- 在 prompt 中，我们添加了 “当你无法分类到特定分类时，可以分类到 "一般问题"”
- 在输出时，我们也用函数确保 type 如果没有定义，那就是为 “一般问题”
- 更进一步，也可以在这个函数中进行检测，判断 type 是否是我们目标的几个分类之一，如果不是则返回 “一般问题”

当前，得益于 OpenAI tools 的强大，这里出错的可能性并不高。我们在这里只是演示，如何通过 prompt、scheme、编码来给 llm app 更多保底，提高使用的鲁棒性。  

然后我们测试一下这个 chain：

```js
await classifyChain.invoke({
    "input": "鲸鱼是哺乳动物么？"
})
```
输出 `科普`  

然后我们简单构造三个对应的专家 chain，这里只是简化的构造，在实际中可以根据不同的数据库和特点去构建对应的复杂 chain：

```js
import { StringOutputParser } from "@langchain/core/output_parsers";

const answeringModel = new ChatOpenAI({
    temperature: 0.7,
})

const sciencePrompt = PromptTemplate.fromTemplate(
  `作为一位科普专家，你需要解答以下问题，尽可能提供详细、准确和易于理解的答案：

问题：{input}
答案：`
)
    
const programmingPrompt = PromptTemplate.fromTemplate(
  `作为一位编程专家，你需要解答以下编程相关的问题，尽可能提供详细、准确和实用的答案：

问题：{input}
答案：`
)

const generalPrompt = PromptTemplate.fromTemplate(
  `请回答以下一般性问题，尽可能提供全面和有深度的答案：

问题：{input}
答案：`
)


const scienceChain = RunnableSequence.from([
    sciencePrompt,
    answeringModel,
    new StringOutputParser(),
    {
        output: input => input,
        role: () => "科普专家"
    }
    
])

const programmingChain = RunnableSequence.from([
    programmingPrompt,
    answeringModel,
    new StringOutputParser(),
    {
        output: input => input,
        role: () => "编程大师"
    }
    
])

const generalChain = RunnableSequence.from([
    generalPrompt,
    answeringModel,
    new StringOutputParser(),
    {
        output: input => input,
        role: () => "通识专家"
    }
    
])
```

这里我们返回了对应的 `role`，是为了演示返回复杂数据结构，方便后面处理流程进行其他操作。   

然后，我们构建 `RunnableBranch` 来根据用户的输入进行路由

```js
const branch = RunnableBranch.from([
  [
    (input => input.type.includes("科普")),
    scienceChain,
  ],
  [
    (input => input.type.includes("编程")),
    programmingChain,
  ],
  generalChain
]);
```
`RunnableBranch` 用起来非常方便，传入的是二维数组，每个数组的第一个参数是该分支的条件。它通过向每个条件传递调用它的输入来选择哪个分支，当数组中的第一个参数返回 `True` 时，就会返回对应的 Runnable 对象。如果没有传入条件，这就是默认执行这个 Runnable。  

`RunnableBranch` 只会选择一个 Runnable 对象，如果有多个返回为 True，只会选择第一个。  

实际上，因为任何函数也是一个 RunnableBranch 对象，所以我们可以不使用 `RunnableBranch`，而是直接使用函数来实现路由，这样我们会有更大的自由度，例如我们用函数实现一个等价路由功能：

```js
const route = ({ type }) => {
    if(type.includes("科普")){
        return scienceChain
    }else if(type.includes("编程")){
        return programmingChain
    }

    return generalChain
}
```

所以，充分利用好 LCEL 中可以用函数作为 runnable 的特点，可以扩大 LCEL chain 的自由度。  

让我们把这些组合成一个完整的 chain：

```js
const outputTemplate = PromptTemplate.fromTemplate(
`感谢您的提问，这是来自 {role} 的专业回答：

{output}
`)


const finalChain = RunnableSequence.from([
    {
        type: classifyChain,
        input: input => input.input
    },
    branch,
    (input) => outputTemplate.format(input),
])
```
在这里，我们简单的利用 prompt 模版简单渲染了一下不同 chain 返回的 role 数据，在工程中可以根据需求对返回值进行更复杂的处理。  

我们测试一下：

```js
const res = await finalChain.invoke({
    "input": "鲸鱼是哺乳动物么？"
})

console.log(res)
```

输出：

```
感谢您的提问，这是来自 科普专家 的专业回答：

是的，鲸鱼是哺乳动物。虽然它们生活在水中，但它们具有哺乳动物的特征：它们有毛发（虽然只有一点点），它们生育
活胎，而不是像鱼那样产卵，它们会哺乳给它们的幼崽，而且它们需要呼吸氧气。鲸鱼和海豚都属于一种叫做鲸目的哺
乳动物类群。
```

这里，我们通过借鉴 agents 对任务进行分配、组合、输出的处理流程，但使用更加具有确定性的 route 方案实现，来达成质量、稳定性和效果都很好的 chat bot。  

事实上，这套方案具有更大的想象力，例如知识回答任务：
- 我们可以使用 RunnableMap 去执行多个查询，从网络、数据库、其他 agents 查询
- 通过一个总结 llm 进行汇总，然后根据汇总后的信息去判断该问题的难度/类型，甚至是是否缓存中是否有类似的问题
- 使用 route 去决定后续的处理方式
    - 如果是复杂问题，使用 gpt4 based llm 去处理；
    - 简单问题 3.5 或者开源模型；
    - 缓存问题，从缓存库中使用向量相似度对比找到类似问题，然后使用 llm 根据当前问题进行改写

当然这只是一个例子，实际中可以根据业务特点去设计完整的流程，也就是 llm app 的架构。  

相对 agents 是通过 prompt 去固定处理某类任务的标准化流程，我们的方案是使用代码来确定处理流程，并且在里面引入一些兜底的路径，例如如果某个路径报错/处理时间过长，可以路由到使用简单的 llm 进行基础的回答等处理措施。这种方式相对 agents，有更加稳定和确定性的优点，但也丧失了 agents 自主解决问题的通用性和创造性，具体选择哪个可以根据自己的业务特点。  

## 小结
本章概念和实战都比较多，我们先介绍了 agents 研究的现状和主要思路，讨论了其现存的缺陷和适用的场景。  

实战方面，我们借鉴 agents 的思想，去介绍了如何确定性的去构建可以一定程度替代 agents 的 chain。注意，我们并不是说这个方式就是 agents，或者说跟 agents 等价，只是说 agents 的不确定性和内部沟通花费的 tokens 在工程上都很难接受，但我们可以通过另一种确定性的方式来完成一些任务。但实际上这种方式跟 agents 确实关系不大，只是复杂 llm app 的一种。  

Agents 的核心在于自主性，事实上我们也可以将一些任务给 agents，观察它处理、拆分和执行任务的流程，然后加入人类和思考和优化，把这个流程去设计成确定性的 chain，并应用在实际业务中。



















