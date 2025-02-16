> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/memory-2.ipynb

这一章中，我们将学习更多 memory 的机制，通过深入学习其中的 prompt、调用流程和设计，理解其中的深层原理，来体会 llm 工程中的思想。也了解不同 memory 机制的优劣，可以根据自己业务的情况选择合适的方式去管理 chat bot 的记忆。  




## Memory
Langchain 在 chat history 的基础上抽象出了 Memory 对象，从命名可以看出来从 history => memory，是希望后者能够更像人类一样在不断的对话中去汇总出有价值的信息，而不只是暴力的记忆完整的信息。  

在前面 langchain.js 的基本介绍中，我们提到了 langchain 的新开发范式 LCEL，但非常遗憾的是 memory 还处于 beta 阶段，并没有对 LCEL 做完整的兼容。 本节中，我们将用 langchain 内置的 conversion chian 去介绍 memory，并在后半段介绍如何将 memory 应用在 LCEL 中。  

LCEL 的思想是把 llm app 开发中的每个节点抽象化成 runnable 节点，并通过一系列的 langchain 提供了工具函数帮助开发者组合成自己需要的 chain，更加模块化，且 langchain 内部也更容易对每个 runnable 根据依赖关系做并行化的处理。而这次使用的 `ConversationChain` 是非 LCEL 范式，是高度封装出来的 chain，外部能做的修改较少，限制了开发中的自由度。你会发现写一个简单的 llm app 确实非常容易，但进行更多的客制化就会受限制，大家在使用的时候会逐步感受到。  

我们先尝试一个最基础的完整记忆聊天记录的 chain：

```js
import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";


const chatModel = new ChatOpenAI();
const memory = new BufferMemory();
const chain = new ConversationChain({ llm: chatModel, memory: memory });
const res1 = await chain.call({ input: "我是小明" });
// { response: "你好，小明！很高兴认识你。我是人工智能，有什么可以帮助你的吗？" }
```


```js
const res2 = await chain.call({ input: "我叫什么？" });
// { response: "你刚刚告诉我，你叫小明。" }
```

可以看到，`ConversationChain` 用起来非常方便，让我们加上 debug，看看内部发生了什么：

```js
const chain = new ConversationChain({ llm: chatModel, memory: memory, verbose: true });
```

在运行的时候，`ConversationChain` 会自动传入一个 history 的属性，是字符串化后的 chat history：

```
[1:chain:ConversationChain] Entering Chain run with input: {
  "input": "我叫什么？",
  "history": "Human: 我是小明\nAI: 你好，小明！很高兴认识你。我们要聊些什么呢？"
}
```
在调用 llm 时传入的 prompt 是：

```js
The following is a friendly conversation between a human and an AI. The AI is talkative 
and provides lots of specific details from its context. If the AI does not know the 
answer to a question, it truthfully says it does not know.

Current conversation:
Human: 我是小明
AI: 你好，小明！很高兴认识你。我们要聊些什么呢？
Human: 我叫什么？
AI:
```

可以看到基本跟我们之前自己实现的记忆对话的 chain 是一样的，这里的 prompt 是可以自定义的。而问题是，如果我们想加入更多复杂的机制，就像上一节中自己实现的自动 summary chat history 的 chain 就非常难，我们没办法在其中执行的过程中嵌入自己的处理函数。即，`ConversationChain` 没有暴露自定义接口的属性，我们都很难修改。  

我认为 langchain 转向 LCEL 是希望自己变成更加基础的 llm app 开发框架，提供基础的开发范式和工具，并且定义标准方便社区的工具以模块化的形式加入到 LCEL chain 中，是野心更大的一次转向。  
所以，我的观点一直是全面拥抱 LCEL，没必要继续关注旧的范式。

让我们回到 Memory，接下来我们会介绍 langchain 中几个常用的 memory，大家可以更多关注其中的思想，langchain 官方提供了哪些去管理 memory 的机制，其中有很多有趣的设计值得我们借鉴，同时大家也可以通过 `verbose` 模式去观察其中的 prompt，学习其中的思考。  


## 内置 Memory 的机制

首先是 BufferWindowMemory：

```js
const model = new OpenAI();
const memory = new BufferWindowMemory({ k: 1 });
const chain = new ConversationChain({ llm: model, memory: memory });
```

这里非常好理解，就是对聊天记录加了一个滑动窗口，只会记忆 k 个对话，这个是很基础的记忆机制，我们就不深入讨论。  

在上一章中，我们自己实现了一个随着聊天不断生成和更新对聊天记录摘要的 chat bot，而 langchain 官方也提供了类似的工具 -- `ConversationSummaryMemory`


```js
import { ConversationSummaryMemory } from "langchain/memory";
import { PromptTemplate } from "@langchain/core/prompts";

const memory = new ConversationSummaryMemory({
    memoryKey: "summary",
    llm: new ChatOpenAI({
          verbose: true,
    }),
  });

const model = new ChatOpenAI();
const prompt = PromptTemplate.fromTemplate(`
你是一个乐于助人的助手。尽你所能回答所有问题。

这是聊天记录的摘要:
{summary}
Human: {input}
AI:`);
const chain = new ConversationChain({ llm: model, prompt, memory, verbose: true });

const res1 = await chain.call({ input: "我是小明" });
const res2 = await chain.call({ input: "我叫什么？" });
```
我们开启 verbose 模式去看看内部发生了什么，跟我们的实现类似，`ConversationSummaryMemory` 将使用 llm 渐进式的总结聊天记录生成 summary：

```
Progressively summarize the lines of conversation provided, adding onto the previous summary returning a new summary.

EXAMPLE
Current summary:
The human asks what the AI thinks of artificial intelligence. The AI thinks artificial intelligence is a force for good.

New lines of conversation:
Human: Why do you think artificial intelligence is a force for good?
AI: Because artificial intelligence will help humans reach their full potential.

New summary:
The human asks what the AI thinks of artificial intelligence. The AI thinks artificial intelligence is a force for good because it will help humans reach their full potential.
END OF EXAMPLE

Current summary:
The human, identifying themselves as Xiao Ming, greets the AI. The AI responds warmly and offers its assistance.

New lines of conversation:
Human: 我是小明
AI: 你好，小明。很高兴认识你！有什么我可以帮助你的吗？

New summary:
```

然后新的 summary 是

```
The human, identifying themselves as Xiao Ming, greets the AI and asks what their name 
is. The AI responds warmly, offers its assistance, and confirms that the human's name 
is Xiao Ming.
```

跟我们的实现大致相同，这里 langchain 为了提升 summary 的效果，会在 prompt 中嵌入一些 example 来保证 llm 理解我们的需求和目的，生成的效果也会比我们实现的简单 prompt 质量好一点。我们在写自己的 prompt 可以学习其中的写法。  

很自然的，将 `BufferWindowMemory` 和 `ConversationSummaryMemory` 结合起来，根据 token 数量，如果上下文历史过大时就切换到 summary，如果上下文比较小时就使用原始的聊天记录，也就成了 `ConversationSummaryBufferMemory`。


```js
import { ChatOpenAI } from "@langchain/openai";
import { ConversationSummaryBufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const model = new ChatOpenAI();
const memory = new ConversationSummaryBufferMemory({
  llm: new ChatOpenAI(),
  maxTokenLimit: 200
});
const chain = new ConversationChain({ llm: model, memory: memory, verbose: true });
```

这里原理跟前面的两个 memory 的机制类似，其会计算当前完整聊天记录的 token 数，去判断是否超过我们设置的 `maxTokenLimit`，如果超过则对聊天记录总结成 summary 输入进去。具体内部的执行过程跟前面类似，我们就不深入其中解析了，感兴趣的可以开 `verbose` 模式去看一下。  

我其实觉得 `ConversationSummaryBufferMemory` 的设计比较暴力，他的思想就是短聊天使用 `BufferWindowMemory`、长聊天就成为 `ConversationSummaryMemory`，并没有特别的提升。更合理的是每次对话时，带上前 k 次对话的原始内容 + 一直在持续更新的 summary，这样在长对话的时候也能让 llm 记忆最近的对话 + 长期对话总结的 summary，会是更好的选择，感兴趣的同学可以参考我们上一章的代码，去实现一个这样的 memory 机制。  


接下来，我们将学习一个更有趣的 memory 机制 -- `EntityMemory`。在人类聊天的过程中，我们实际在建立的是对各种实体（Entity）的记忆，例如两个刚认识的人，我们聊职业、聊公司、聊餐馆，我们记忆中存储方式可能是根据实体进行分类存储，这个人是什么职业、年龄；这个公司是什么情况；餐馆是什么环境和味道。`EntityMemory` 希望模拟的就是在聊天中去生成和更新不同的实体的描述。  

这将是一个非常复杂的记忆机制，涉及多次 llm 的调用，让我们做好准备，直接看代码，并且解析其中的机制：


```js
import { ChatOpenAI } from "@langchain/openai";
import { EntityMemory, ENTITY_MEMORY_CONVERSATION_TEMPLATE } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const model = new ChatOpenAI();
const memory = new EntityMemory({
    llm: new ChatOpenAI({
        verbose: true 
    }),
    chatHistoryKey: "history",
    entitiesKey: "entities"
});
const chain = new ConversationChain({ 
    llm: model, 
    prompt: ENTITY_MEMORY_CONVERSATION_TEMPLATE,
    memory: memory, 
    verbose: true 
});
```

其中 `ENTITY_MEMORY_CONVERSATION_TEMPLATE` 是 langchain 提供的默认用于 EntityMemory chat 的 prompt，我们也可以自定义合适的 prompt。

我们先进行一次对话：

```js
const res1 = await chain.call({ input: "我叫小明，今年 18 岁" });
const res2 = await chain.call({ input: "ABC 是一家互联网公司，主要是售卖方便面的公司" });
```

然后看内部发生了什么：
首先，EntityMemory 将会使用 llm 提取对话中出现的主体，具体的 prompt 是：

```
You are an AI assistant reading the transcript of a conversation between an AI and a 
human. Extract all of the proper nouns from the last line of conversation. As a 
guideline, a proper noun is generally capitalized. You should definitely extract all 
names and places.

The conversation history is provided just in case of a coreference 
(e.g. \"What do you know about him\" where \"him\" is defined in a previous line) -- 
ignore items mentioned there that are not in the last line.\n\nReturn the output as a 
single comma-separated list, or NONE if there is nothing of note to return (e.g. the 
user is just issuing a greeting or having a simple conversation).

EXAMPLE
Conversation history:
Person #1: my name is Jacob. how's it going today?
AI: \"It's going great! How about you?\"
Person #1: good! busy working on Langchain. lots to do.
AI: \"That sounds like a lot of work! What kind of things are you doing to make Langchain better?\"
Last line:
Person #1: i'm trying to improve Langchain's interfaces, the UX, its integrations with various products the user might want ... a lot of stuff.
Output: Jacob,Langchain
END OF EXAMPLE

EXAMPLE
Conversation history:
Person #1: how's it going today?
AI: \"It's going great! How about you?\"
Person #1: good! busy working on Langchain. lots to do.
AI: \"That sounds like a lot of work! What kind of things are you doing to make Langchain better?\"
Last line:
Person #1: i'm trying to improve Langchain's interfaces, the UX, its integrations with various products the user might want ... a lot of stuff. I'm working with Person #2.
Output: Langchain, Person #2
END OF EXAMPLE

Conversation history (for reference only):
Human: 我叫小明，今年 18 岁
AI: 你好，小明！很高兴认识你。你今年18岁，正是年轻有活力的时候。有什么问题我能帮你解答，或者关于什么话题你想和我交谈呢？
Last line of conversation (for extraction):
Human: ABC 是一家互联网公司，主要是售卖方便面的公司
Output:
```
可以看到又是一个构造非常精良的 prompt，我们解析一下。  
- 首先第一段去讲清楚任务的背景，一个阅读对话记录，并且从最后一次对话中提取名词的 ai，因为核心目标是英语，这里给了提示，一般专有名词是大写的。并且强调一定提取所有的名词。 这部分给定了任务、任务提示和要求。
- 第二段，强调历史聊天记录仅仅是用于参考，并且再次强调只提取最后一次对话中出现的专有名词，并指定多个专有名词的返回格式和没有任何专有名词的返回格式。
- 然后就是两个例子，第一个例子是普通的例子，主要是用例子更具象化的介绍这个任务。第二个我认为是以 Person \#2 为例强化对名词的概念。 few-shot prompt，也就是通过例子去强化 llm 对任务的理解是常见和效果非常好的技巧
- 最后在 `Conversation history (for reference only)` 再次强化 chat history 只是为了作为参考，`Last line of conversation (for extraction)` 这里才是作为提取的目标

最后，llm 返回："ABC"  
可以看到 llm 只提取了最后一段聊天中的名词，而没有错误的提取聊天历史中的 小明。  

之后就是正常的 `ConversationChain` 让 llm 对话的内容，我们会在后面解析。 

在聊天之后，EntityMemory 会提取对实体的描述认为，其中的 prompt 是：

```
You are an AI assistant helping a human keep track of facts about relevant people, 
places, and concepts in their life. Update and add to the summary of the provided 
entity in the \"Entity\" section based on the last line of your conversation with the 
human. If you are writing the summary for the first time, return a single 
sentence.

The update should only include facts that are relayed in the last line of 
conversation about the provided entity, and should only contain facts about the 
provided entity.

If there is no new information about the provided entity or the information is not worth noting (not an important or relevant fact to remember long-term), output the exact string \"UNCHANGED\" below.

Full conversation history (for context):
Human: 我叫小明，今年 18 岁
AI: 你好，小明！很高兴认识你。你今年18岁，正是年轻有活力的时候。有什么问题我能帮你解答，或者关于什么话题你想和我交谈呢？

Human: ABC 是一家互联网公司，主要是售卖方便面的公司
AI: ABC是一个非常有趣的公司，把互联网技术和方便面销售结合在一起。这两个领域似乎毫不相关，但在这个时代，创新的商业模式正在不断涌现。他们是否有使用特殊的营销策略或技术来提高销售或提高客户体验呢？

Entity to summarize:
ABC

Existing summary of ABC:
No current information known.

Last line of conversation:
Human: ABC 是一家互联网公司，主要是售卖方便面的公司
Updated summary (or the exact string \"UNCHANGED\" if there is no new information about ABC above):
```

这一部分的目的是，根据本次对话用户提到的实体，也就是上一个 prompt 提取出来的实体，去更新 **用户** 提供的实体信息。  
- 第一段去强调 llm 的任务，是记录有关实体的信息
- 第二段是将范围控制在用户最新一条信息内，并且只包含跟目标实体有关的内容
- 第三段是指定如果没有更新或者更新并不值得长期记忆，则返回特殊字符 `UNCHANGED`
- 后面这是提供聊天记录、需要记录的实体、当前记录的实体信息，以及跟用户的最后一天聊天记录

然后 llm 就会返回跟实体相关的信息：

```
ABC is an internet company that primarily sells instant noodles.
```

经过上面两次沟通后，如果我们询问

```js
const res3 = await chain.call({ input: "介绍小明和 ABC" });
```

`EntityMemory` 会像上面一样，使用 llm 提取实体列表，并返回这些实体的相关信息，以及聊天记录传入到 `ConversationChain` 的 `ENTITY_MEMORY_CONVERSATION_TEMPLATE` 中，让我们解析一下这个 prompt：

```
You are an assistant to a human, powered by a large language model trained by OpenAI.

You are designed to be able to assist with a wide range of tasks, from answering simple 
questions to providing in-depth explanations and discussions on a wide range of topics. 
As a language model, you are able to generate human-like text based on the input you 
receive, allowing you to engage in natural-sounding conversations and provide responses 
that are coherent and relevant to the topic at hand.

You are constantly learning and improving, and your capabilities are constantly 
evolving. You are able to process and understand large amounts of text, and can use 
this knowledge to provide accurate and informative responses to a wide range of 
questions. You have access to some personalized information provided by the human in 
the Context section below. Additionally, you are able to generate your own text based 
on the input you receive, allowing you to engage in discussions and provide 
explanations and descriptions on a wide range of topics.

Overall, you are a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether the human needs help with a specific question or just wants to have a conversation about a particular topic, you are here to assist.

Context:
 小明: 小明是一个18岁的年轻人，正处在热血沸腾的年纪。他可能正在学习或已经步入职场，具有无限的潜力和可能性。他和ABC公司有某种连接，但具体细节尚未提供。
 ABC: ABC is an Internet company that primarily sells instant noodles.
  
Current conversation:
Human: 我叫小明，今年 18 岁
AI: 很高兴认识你，小明。你今年18岁，正是年轻有力的时候。有什么我可以帮助你的吗？
Human: ABC 是一家互联网公司，主要是售卖方便面的公司
AI: 我明白了，ABC 是一家专注于售卖方便面的互联网公司。这是一个非常有趣的商业模式。你想知道更多关于这个公司的信息，还是有关于其它的问题需要我为你解答？

Last line:
Human: 介绍小明和 ABC
You:
```

这部分前几段 prompt 的质量很高，目标是构建一个通用性的 chat bot，值得学习。但不是我们现在的重点，我们核心在 `You have access to some personalized information provided by the human in the Context section below.` 对 llm 指定了在 context 部分提供与上下文相关的背景信息供 llm 参考。  

## 小结

所以 langchain 内部为了实现对实体的记忆，在一次沟通中使用了非常多次 llm 进行知识的总结和提取，这里面多个 llm 的协同方式、流程和思路非常值得我们学习。本章节也涉及到对 langchain 中 prompt 详细的拆解和解析，我希望大家不止是阅读我的解析，也要花一些时间去阅读 prompt 的**原文**，去理解高质量的 prompt 是如何书写，其中的逻辑和指令的设计，并尝试在自己 prompt 设计中去使用。  

但有人可能会疑问，用这么多次 llm 会不会导致 token 的花费更大？或者耗时更长？ 
其实就像我们之前提到的，并不是只有 gpt3.5 和 gpt4，我们可以在更基础的信息提取部分使用相对廉价的模型或者自部署的本地模型，在最后生成回复的时候使用 gpt4 来保证质量。  
在我们有了 langchain 后，chat bot 不止是一个简单的调 API 的任务，而且通过管理 prompt、多 llm 协同而成的一个工程任务。











