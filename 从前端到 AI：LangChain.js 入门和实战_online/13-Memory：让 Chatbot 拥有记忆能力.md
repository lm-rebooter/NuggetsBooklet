> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/memory.ipynb

前面的章节我们涉及到了 prompt、embedding、retriever 等在 llm 应用开发中经常需要到概念，在本章我们补上另一个部分 --- Memory。一个 llm 如何在 chat 中记忆沟通的上下文。  

我们当然可以暴力地把所有的沟通上下文都传递给 llm，但受限于 llm 的上下文窗口，很容易触及到 llm 的上下文窗口，也会花费大量的 token 。 且，用户后续发送的信息可能与前面聊天讨论的话题完全无关，将这些无关的聊天记录塞到 llm 上下文中将可能影响 llm 关注点的错误等一系列问题。  

所以，Memory 是一个复杂的概念，而不仅仅是记录完整的聊天记录，那让我们开始对其的学习吧！


## ChatMessageHistory

我们可以认为 chat history 是一组 Message 子类对象组成的列表，Message 的子类可能是 HumanMessage、AIMessages，而 Memory 是构建在 chat history 之上的概念。这个听起来有点抽象，更详细一点就是，用户跟 llm 的所有聊天记录都会完整的存储在 chat history 中，其会负责将这些原始数据存储在内存中或者对接的其他数据库中。在大多数情况下，我们并不会把完整的 chat history 嵌入到 llm 上下文中，而且提取聊天记录的摘要或者只返回最近几条聊天记录，这些处理逻辑就是在 Memory 中完成的。  

一句话总结就是，chat history 复杂忠实的记录聊天历史，Memory 负责在聊天历史之上整一些花活。  

我们对 Memory 的理解，将从理解 chat history 开始，我们首先创建一个 history 对象：

```js
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const history = new ChatMessageHistory();
```

向 history 中存储两个 Message 信息

```js
await history.addMessage(new HumanMessage("hi"));
await history.addMessage(new AIMessage("What can I do for you?"));
```

然后，我们获取所有历史记录试一试

```js
const messages = await history.getMessages();

console.log(messages);
```


```js
[
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: { content: "hi", additional_kwargs: {}, response_metadata: {} },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "hi",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "What can I do for you?",
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "What can I do for you?",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  }
]
```

其实，这就是 chat history 所有的内容了，所有 chat history 都继承自 `BaseListChatMessageHistory`，其类型定义很简单：

```js
export abstract class BaseChatMessageHistory extends Serializable {
  public abstract getMessages(): Promise<BaseMessage[]>;

  public abstract addMessage(message: BaseMessage): Promise<void>;

  public abstract addUserMessage(message: string): Promise<void>;

  public abstract addAIChatMessage(message: string): Promise<void>;

  public abstract clear(): Promise<void>;
}
```

任何实现了 `BaseChatMessageHistory` 抽象类的都可以作为 Memory 的底层 chat history。因为`ChatMessageHistory` 是存储在内存里的，后面我们会实现一个自己的基于文件存储的 chat history，并且复用 Memory 的能力。 


## 手动维护 chat history

在学习 Memory 之前，我们先思考一下，什么聊天记录。我们回到 llm 的本质，是一个根据上下文产出回答的模型，那聊天记录是一种特殊的上下文，让 llm 理解之前的沟通内容，方便理解用户意图。例如前面我说了我叫 Kai，那后面我再问 llm “我叫什么”，llm 应该从聊天记录这个特殊的上下文中回答出来。因为 llm 是无状态的，它并不会存储我们的聊天历史，每次都是根据上下文生成回答，聊天记录就是我们自己存储，并且作为传递给 llm 的上下文的一部分。  

如果对 llm 不熟悉的同学听起来有点模糊，没事，我们逐步来理解。首先最基础的方式就是我们把 llm 和 用户所有聊天记录原封不动传递给 llm，让我们来试一下。  

我们首先构造一个简单的 chat chain

```js
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const chatModel = new ChatOpenAI();
const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a helpful assistant. Answer all questions to the best of your ability.
    You are talkative and provides lots of specific details from its context. 
    If the you does not know the answer to a question, it truthfully says you do not know.`],
    new MessagesPlaceholder("history_message"),
]);

const chain = prompt.pipe(chatModel);
```

其中 `MessagesPlaceholder` 就是创建一个名为 `history_message` 的插槽，chain 中对应的参数将会替换这部分。  

然后，我们创建一个 chat history，然后向其中添加一条历史记录，并请求 ai 回答

```js
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const history = new ChatMessageHistory();
await history.addMessage(new HumanMessage("hi, my name is Kai"));

const res1 = await chain.invoke({
    history_message: await history.getMessages()
})
```

这时，res1 就是 llm 回复的第一条消息，其是一个 `AIMessage` 类的一个实例，打印出来是这样的 

```js
AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: "Hello, Kai! It's wonderful to meet you! How can I assist you today? Whether you have questions, need"... 281 more characters,
    additional_kwargs: { function_call: undefined, tool_calls: undefined },
    response_metadata: {}
  },
  lc_namespace: [ "langchain_core", "messages" ],
  content: "Hello, Kai! It's wonderful to meet you! How can I assist you today? Whether you have questions, need"... 281 more characters,
  name: undefined,
  additional_kwargs: { function_call: undefined, tool_calls: undefined },
  response_metadata: {
    tokenUsage: { completionTokens: 86, promptTokens: 71, totalTokens: 157 },
    finish_reason: "stop"
  }
}
```

这是 llm 返回的消息，所以也应该添加到 chat history 中，让我们添加进去，并且添加一条人类的新提问：

```js
await history.addMessage(res1)
await history.addMessage(new HumanMessage("What is my name?"));
```
然后再请求 llm 回复：

```js
const res2 = await chain.invoke({
    history_message: await history.getMessages()
})
```
返回的又是 `AIMessage` 类的一个实例，其中 content 是 

```
Your name is Kai. You just introduced yourself to me with that name....
```

这就是手动去维护 chat history，在工程上我们一般不会这么做，这里是为了大家更细节的了解 chat history 的原理。本质上 chat history 就是一个管理 Message 对象数组的一个对象，提供一系列工具方便外界调用。

## 自动维护 chat history

在了解手动维护的方式后，自动维护 chat history 也非常简单，就是由 `RunnableWithMessageHistory` 给任意 chain 包裹一层，就能添加聊天记录管理的能力：

```js
const chatModel = new ChatOpenAI();
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant. Answer all questions to the best of your ability."],
    new MessagesPlaceholder("history_message"),
    ["human","{input}"]
]);

const history = new ChatMessageHistory();
const chain = prompt.pipe(chatModel)

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: (_sessionId) => history,
  inputMessagesKey: "input",
  historyMessagesKey: "history_message",
});
```
`RunnableWithMessageHistory` 有几个参数：
- runnable 就是需要被包裹的 chain，可以是任意 chain
- getMessageHistory 接收一个函数，函数需要根据传入的 `_sessionId`，去获取对应的 ChatMessageHistory 对象，这里我们没有 session 管理，所以就返回默认的对象
- inputMessagesKey 用户传入的信息 key 的名称，因为 RunnableWithMessageHistory 要自动记录用户和 llm 发送的信息，所以需要在这里声明用户以什么 key 传入信息
- historyMessagesKey，聊天记录在 prompt 中的 key，因为要自动的把聊天记录注入到 prompt 中。
- outputMessagesKey，因为我们的 chain 只有一个输出就省略了，如果有多个输出需要指定哪个是 llm 的回复，也就是需要存储的信息。  

然后，我们就可以直接调用这个 chain，其中历史记录会自动保存，这里我们除了正常 invoke 传入的参数外，还需要指定当前对话的 sessionId

```js
const res1 = await chainWithHistory.invoke({
    input: "hi, my name is Kai"
},{
    configurable: { sessionId: "none" }
})
```
`res1` 的 content 为

```
Hello, Kai! How can I assist you today?
```
然后我们再次提问：

```js
const res2 = await chainWithHistory.invoke({
    input: "我的名字叫什么？"
},{
    configurable: { sessionId: "none" }
})
```
`res2` 的 content 为
```
你的名字叫Kai。
```

可以看到我们的 chain 自动有了记忆能力，然后大家可以自己打印一下 history 中记录的 Message 数据：

```js
await history.getMessages()
```
其中就是四条 Message 信息，所以 `RunnableWithMessageHistory` 就是帮助我们自动将用户和 llm 的消息存储在 history 中，省去了我们手动操作的繁琐。  

## 自动生成 chat history 摘要

前面 `RunnableWithMessageHistory` 是将历史记录完整的传递到 llm 中，我们可以对 llm 的历史记录进行更多操作，例如只传递最近的 k 条历史记录等。  

这一节中，我们将实现一个自动对当前聊天历史记录进行总结，然后让 llm 根据总结的信息回复用户的 chain，首先实现一个总结 chain。  
这个 chain 接受两个参数：
- summary，上一次总结的信息
- new_lines，用户和 llm 新的回复

返回值是一个纯文本的信息，是根据历史的 summary 信息和用户新的对话生成的新 summary，有了前面章节的知识，这个实现起来非常容易：

```js
const summaryModel = new ChatOpenAI();
const summaryPrompt = ChatPromptTemplate.fromTemplate(`
Progressively summarize the lines of conversation provided, adding onto the previous summary returning a new summary

Current summary:
{summary}

New lines of conversation:
{new_lines}

New summary:
`); 

const summaryChain = RunnableSequence.from([
    summaryPrompt,
    summaryModel,
    new StringOutputParser(),
])
```

这个 chain 都是比较基础的知识，传入两个变量构建 prompt，然后将 prompt 传递给 chat model，最后传递给 `StringOutputParser` 生成一个纯文本的返回值。  

让我们尝试调用一下：

```js
const newSummary = await summaryChain.invoke({
    "",
    new_lines: "I'm 18"
})

// The speaker has revealed that they are 18 years old.
```

然后，我们传入这次的 summary，再次传递一些新信息：

```js
await summaryChain.invoke({
    summary: newSummary,
    new_lines: "I'm male"
})

// The speaker has revealed that they are an 18-year-old male.
```

如此这般，我们就实现了一个渐进式总结历史聊天记录的 chat bot，然后我们以此为基础构建一个 chat bot，其会自动将聊天记录进行 summary，并且传递给 llm 作为上下文。

我们先创建一个基础的 prompt 模板，和用于存储聊天记录的 `ChatMessageHistory`，当然这里只是用于临时存储聊天记录信息，并不会完整的传递给 llm 上下文中。并且创建一个 summary 字符串，用来存储用户之前聊天记录的总结信息。  
```js
const chatModel = new ChatOpenAI();
const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a helpful assistant. Answer all questions to the best of your ability.

    Here is the chat history summary:
    {history_summary}
    `],
    ["human","{input}"]
]);
let summary = ""
const history = new ChatMessageHistory();
```

然后，让我们实现完整的 chain：

```js
const chatChain = RunnableSequence.from([
    {
        input: new RunnablePassthrough({
             func: (input) => history.addUserMessage(input)
        })
    },
    RunnablePassthrough.assign({
        history_summary: () => summary
    }),
    chatPrompt,
    chatModel,
    new StringOutputParser(),
    new RunnablePassthrough({
        func: async (input) => {
            history.addAIChatMessage(input)
            const messages = await history.getMessages()
            const new_lines = getBufferString(messages)
            const newSummary = await summaryChain.invoke({
                summary,
                new_lines
            })
            history.clear()
            summary = newSummary      
        }
    })
])
```

这个 chain 稍微复杂一些，首先涉及到了 `RunnableMap` 这个概念，其是并行的执行多个 runnable 对象，然后返回结果对象的一个工具函数。例如我们可以
```js
import { RunnableMap } from "@langchain/core/runnables"

const mapChain = RunnableMap.from({
    a: () => "a",
    b: () => "b"
})

const res = await mapChain.invoke()
// { a: "a", b: "b" }
```
其中，函数也是一种 runnable 对象，这两个函数是并行执行的。如果这两个函数换成任意 runnable 对象，例如两个 chain 也就是会并行执行这两个 chain，并且返回相应的结果。  

在 RunnableSequence 的数组中，如果有 object 类型的值，则自动会被转换成 `RunnableMap`，也就是我们 chain 中第一个 object 对象本质上是新建了一个 `RunnableMap`。  


里面另一个新的知识点就是，`RunnablePassthrough` 这个新的概念，你可以理解是 runnable chain 中的特殊节点。有多种使用方式，后续在 chain 中我们也会多次使用。

我们使用 `new RunnablePassthrough({func: (input)=> void})`，是有两个目的：
- 如果我们只写 `new RunnablePassthrough()`，那就是把用户输入的 input 再传递到下一个 runnable 节点中，不做任何操作。因为 RunnableMap 返回值是对其中每个 chain 执行，然后将返回值作为结果传递给下一个 runnable 节点，如果我们不对 input 使用 `RunnablePassthrough` 则下个节点就拿不到 input 的值
- `new RunnablePassthrough({func: (input)=> void})` 中的 func 函数是在传递 input 的过程中，执行一个函数，这个函数返回值是 void，也就是无论其内容是什么，都不会对 input 造成影响。

在第一个节点中，我们是希望将用户的输入存储到 history 中，并且将 input 原封不动的传递给下一个节点。   


`RunnablePassthrough.assign` 是在不影响传递上一节点信息的基础上，再添加一部分信息。这里就是保留上一节点传递下来的 input 值，并且添加了 history_summary 值。  

然后就是两个比较基础的生成 prompt 和传递给 llm model，并提取返回信息中的文本内容的节点。  

最后一个节点，在我们再次使用 `RunnablePassthrough` 中的 func 参数，执行几个操作：
- 将 llm 输出的信息添加到 history 中
- 获取 history 中的所有信息，存储到 messages 中
- 使用 getBufferString 函数，把 messages 转换成字符串
- 然后使用 summaryChain 获取新的总结
- 将新的总结存储到 summary 变量中
- 清空 history


让我们尝试调用一下，

```js
await chatChain.invoke("我现在饿了")
```
AI 回答：`那您可以考虑吃点东西，比如做一个小点心或者点一份外卖。记得选择营养均衡的食物哦！`


其中，getBufferString 的内容是：

```
Human: 我现在饿了
AI: 那您可以考虑吃点东西，比如做一个小点心或者点一份外卖。记得选择营养均衡的食物哦！ 
```
然后，其中 ai 记录的 summary 内容是：

```
The human states they are hungry and the AI suggests they could consider eating 
something, like making a snack or ordering takeaway. The AI also reminds them to choose 
balanced nutritious food.
```  

然后，我们继续沟通：

```js
await chatChain.invoke("我今天想吃方便面")
```
AI 回答:
```
没问题，方便面是个快速简单的选择。只是请注意，方便面通常含有比较高的钠含量和油脂，所以享用后也别忘记其他营养均衡的食物，例如蔬菜和水果，以保持良好的饮食。
```
getBufferString 的内容是：
```
Human: 我今天想吃方便面
AI: 没问题，方便面是个快速简单的选择。只是请注意，方便面通常含有比较高的钠含量和油脂，所以享用后也别忘记其他营养均衡的食物，例如蔬菜和水果，以保持良好的饮食。
```

因为我们在每次对话结束后都会清理历史聊天记录，所以这里的 getBufferString 只会有最近的两个对话。

最新的 summary 是：
```
The human shares that they want to eat instant noodles today, and the AI approves, 
calling it a quick and simple choice. However, the AI warns that instant noodles 
typically contain high levels of sodium and fats, so it urges the person to also 
remember to consume balanced nutritious food, such as vegetables and fruits, to 
maintain a healthy diet. Thus, the conversation is about the human's hunger and food 
choice for the day, with the AI providing suggestions and reminders on making balanced, 
nutritious selections.  
```

这样，随着用户对话的继续，summary 中会更新跟用户对话中重要的内容，并作为后续的对话上下文。 这样对比直接提供原始内容会更加节省 tokens，也可以在 summaryChain 的 prompt 中嵌入一些你认为重要的指令。比如，如果这是一个购物的 chat bot，就可以通过指令让 chat 在总结信息时，只关注跟购物相关的内容，忽略其他无关的闲聊，来提高 summary 的信息密度。  

就像前几章提到的，llm 的上下文信息并不是越多越好，过量的信息会让 llm 在生成时分神，不清楚内容的重点在哪。


## 小结  

本节中，我们从认识 ChatMessageHistory 这个用来管理 Message 的对象，然后学习如何手动维护聊天记录、如何自动维护聊天记录，到我们手动实现一个自动生成聊天记录 summary，让 llm 根据总结后的 summary 与用户进行对话。  
这里，我们已经从基础的 chat history 走到了 memory 的领域，前者是忠实的记录对话发生的所有聊天记录，而 memory 是构建在其之上的抽象，根据不同的需求进行更高层次的对记忆的管理。就像，手机上的聊天记录和我们脑海中的记忆一样，前者是事实 后者是我们提取出来有价值的信息。  

下一章，我们将去探索更多丰富的类型，也会尝试自己去实现一个 chat history。




