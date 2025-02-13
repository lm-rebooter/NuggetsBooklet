> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/memory-3.ipynb

这一章，让我们走的更深一点，首先我们会讲解目前处于 beta 阶段的 memory 如何跟 LCEL 开发范式结合，让大家更方便的复用 langchain 内置的 memory。  

同时，这一章我们将学习如何持久化 chat history，langchain 提供了跟各种数据库和云数据库的集成方案，但因为真实业务中的种种限制，我们需要自己实现跟业务数据库契合的持久化方案，我们会带大家写一个简单的 customized chat history，给大家参考。

## 在 LCEL 中集成 memory

如果我们想在 LCEL 中集成 memory，我们先看 `BaseMemory` 的接口定义，在源码中的定义文件在：[memory.ts](https://github.com/langchain-ai/langchainjs/blob/main/langchain-core/src/memory.ts)

```ts
export abstract class BaseMemory {
  abstract get memoryKeys(): string[];

  /**
   * Abstract method that should take an object of input values and return a
   * Promise that resolves with an object of memory variables. The
   * implementation of this method should load the memory variables from the
   * provided input values.
   * @param values An object of input values.
   * @returns Promise that resolves with an object of memory variables.
   */
  abstract loadMemoryVariables(values: InputValues): Promise<MemoryVariables>;

  /**
   * Abstract method that should take two objects, one of input values and
   * one of output values, and return a Promise that resolves when the
   * context has been saved. The implementation of this method should save
   * the context based on the provided input and output values.
   * @param inputValues An object of input values.
   * @param outputValues An object of output values.
   * @returns Promise that resolves when the context has been saved.
   */
  abstract saveContext(
    inputValues: InputValues,
    outputValues: OutputValues
  ): Promise<void>;
}
```
可以看到其核心就是就是两个方法，并且有非常详细的注释：
- `loadMemoryVariables`，返回当前记忆的内容，如果有些记忆是依赖于输入的，例如 `EntityMemory`，就需要传入一些输入，让 memory 返回对应输入的记忆。 在 `EntityMemory` 的场景下，就是 memory 需要根据传入的信息提取输入中的实体，并且返回实体中相关的记忆
- `saveContext`，就是将对话存入到 memory 中，也就是需要传入用户的输入 `inputValues`，和模型的输出 `OutputValues`

`BaseMemory` 是所有 memory 都需要继承的接口，也就是我们参考这个接口去在 LCEL 中引入 memory，就能保证引入的方式对所有 memory 有效。  

如果大家对 `ConversationChain` 是如何使用 memory 的，可以参考:
- langchain/src/chains/conversation.ts
- langchain/src/chains/llm_chain.ts
- langchain/src/chains/base.ts

这里我们就不展开讲解了，我们直接看如何在 LCEL 中使用 memory，我们这里以 `BufferMemory` 举例，其他的 memory 也是类似的机制：

```js
const chatModel = new ChatOpenAI({
    verbose:true
});
const memory = new BufferMemory();

const TEMPLATE = `
你是一个乐于助人的 ai 助手。尽你所能回答所有问题。

这是跟人类沟通的聊天历史:
{history}

据此回答人类的问题:
{input}
`
const prompt = ChatPromptTemplate.fromTemplate(TEMPLATE);
```

这里我们创建了基础 chatModal、memory 和 prompt，然后：

```js
let tempInput = ""

const chain =  RunnableSequence.from([
    {
        input: new RunnablePassthrough(),
        memoryObject: async (input) => {
            const history = await memory.loadMemoryVariables({
                input
            })
            tempInput = input
            return history
        }
    },
    RunnablePassthrough.assign({
        history: (input) => input.memoryObject.history
    }),
    prompt,
    chatModel,
    new StringOutputParser(),
    new RunnablePassthrough({
        func: async (output) => {
            await memory.saveContext({
                input: tempInput
            }, {
                output
            })
        }
    }),
]);
```

这里我们使用 `tempInput` 去临时存储用户的 input 输入，这是因为在 LCEL 整个链条中， prompt 之后的中间值是单独的 PromptValue、chatModel 之后就是单纯的 AIMessage，很难在这一部分将用户初始的 input 传递到后面，所以我们还是用临时变量去进行存储比较方便。  

在 chain 中的第一个对象，我们首先是使用 `new RunnablePassthrough()` 对 input 进行透传，然后创建一个函数（函数也是 Runnable 对象），以用户的 input 作为输入，使用 `loadMemoryVariables` 去加载出 memory 中的数据，并将用户的输入保存到 `tempInput`。  

这里加载出来的 history 对象是一个 object，其中是 memory 根据用户这次 input 返回的数据，如果是 `BufferMemory`，则里面只有只有一个 `history` key。其他的 memory 就要根据不同的类型，返回的数据也是不一样的，例如 `EntityMemory` 就会有 `history` 和 `entities` 两个 key。  

所以，在 chain 的第二个节点，我们就 `RunnablePassthrough.assign()` 提取出来 `memoryObject` 中的 `history` 值。 assign 会在上一个节点输入的基础上，再添加新的数据。 这样后面的 prompt 就接收到了 history 和 input 两个输入值。  

`prompt`、`chatModel`、`new StringOutputParser()` 就是基础的使用 prompt 激发 llm 输出内容，然后使用 `StringOutputParser` 去提取出纯文本的内容。  

最后一个节点，我们使用 `RunnablePassthrough` 去执行一个函数，将用户的输入和输出使用 `saveContext` 存储到 memory 中。  

至此，我们通过查看 langchain 源代码中 `BaseMemory` 的定义，去理解 memory 应该如何存储和读取数据，并通过对 LCEL 中 RunnablePassthrough 的灵活使用，去将 memory 融合到 LCEL 中。  

LCEL 编程范式是一种链式的编程范式，可能刚上手跟我们传统的编程有些区别，但自己多写一些 LCEL chain，感受一下节点之间传递的内容，就能逐渐学会其中的思想。  

如果是在学习 LCEL 中，可以使用下面这个技巧去打印 chain 中间传递的内容，去慢慢理解数据是在 chain 中是如何流动的。
```js
[
...
prompt,
new RunnablePassthrough({
    func: (input) => console.log(input)
}),
chatModel,
...
]
```


## 实现自定义的 chat history

Memory 的底层是 chat history，所有的 memory 都支持在创建的时候传入任意的 chathistory，如果我们没有传入，则 memory 会自己创建一个存储在内存的 chat history。  
我们再回忆一下，chat history 是原封不动的记录用户和 llm 的聊天记录，memory 是基于内部的 chat history 进行一些处理形成的记忆，所以任何 memory 内部都会有一个记录所有 history 的 chat history。  

langchain 内部提供跟很多数据库集成的 chat history，例如常见的 MongoDB、Redis 都有，但在真实业务中我们有时候很难随意选择后端的数据库，大多数需要存储在现有的基建中，而这些基建 langchain 并没有提供对应的集成，或者集成有一些小问题跟现有基建集成在一起。  

所以这一节中，我们会带大家实现一个基础的 customized chat history，并把文件存储在本地的 json 文件中。既可以让大家在测试和开发的时候将多次聊天存储在本地，也可以作为范例让大家学习如何集成到自己当前的数据库中。  

我们先看 BaseListChatMessageHistory 的源码：[code](https://github.com/langchain-ai/langchainjs/blob/d26233d89148c123540ed93af63ab3fb1f0ac1ac/langchain-core/src/chat_history.ts)  


```ts
export declare abstract class BaseListChatMessageHistory extends Serializable {
    /** Returns a list of messages stored in the store. */
    abstract getMessages(): Promise<BaseMessage[]>;
    /**
     * Add a message object to the store.
     */
    abstract addMessage(message: BaseMessage): Promise<void>;
    /**
     * This is a convenience method for adding a human message string to the store.
     * Please note that this is a convenience method. Code should favor the
     * bulk addMessages interface instead to save on round-trips to the underlying
     * persistence layer.
     * This method may be deprecated in a future release.
     */
    addUserMessage(message: string): Promise<void>;
    /** @deprecated Use addAIMessage instead */
    addAIChatMessage(message: string): Promise<void>;
    /**
     * This is a convenience method for adding an AI message string to the store.
     * Please note that this is a convenience method. Code should favor the bulk
     * addMessages interface instead to save on round-trips to the underlying
     * persistence layer.
     * This method may be deprecated in a future release.
     */
    addAIMessage(message: string): Promise<void>;
    /**
     * Add a list of messages.
     *
     * Implementations should override this method to handle bulk addition of messages
     * in an efficient manner to avoid unnecessary round-trips to the underlying store.
     *
     * @param messages - A list of BaseMessage objects to store.
     */
    addMessages(messages: BaseMessage[]): Promise<void>;
    /**
     * Remove all messages from the store.
     */
    clear(): Promise<void>;
}
```

可以看到，addUserMessage、addAIChatMessage、addAIMessage 都是将要 deprecated 的函数，真正我们需要实现的就是：
- getMessages：获取存储在 history 中所有聊天记录
- addMessage：添加单条 message
- addMessages：添加 message 数组
- clear：清空聊天记录 

是比较好理解的结构，让我们看完整的代码：

```ts
import { BaseListChatMessageHistory } from "@langchain/core/chat_history";
import {
  BaseMessage,
  StoredMessage,
  mapChatMessagesToStoredMessages,
  mapStoredMessagesToChatMessages,
} from "@langchain/core/messages";
import fs from "node:fs";
import path from "node:path";

export interface JSONChatHistoryInput {
  sessionId: string;
  dir: string;
}

export class JSONChatHistory extends BaseListChatMessageHistory {
  lc_namespace = ["langchain", "stores", "message"];

  sessionId: string;
  dir: string;

  constructor(fields: JSONChatHistoryInput) {
    super(fields);
    this.sessionId = fields.sessionId;
    this.dir = fields.dir;
  }

  async getMessages(): Promise<BaseMessage[]> {
    const filePath = path.join(this.dir, `${this.sessionId}.json`);
    try {
      if (!fs.existsSync(filePath)) {
        this.saveMessagesToFile([]);
        return [];
      }

      const data = fs.readFileSync(filePath, { encoding: "utf-8" });
      const storedMessages = JSON.parse(data) as StoredMessage[];
      return mapStoredMessagesToChatMessages(storedMessages);
    } catch (error) {
      console.error(`Failed to read chat history from ${filePath}`, error);
      return [];
    }
  }

  async addMessage(message: BaseMessage): Promise<void> {
    const messages = await this.getMessages();
    messages.push(message);
    await this.saveMessagesToFile(messages);
  }

  async addMessages(messages: BaseMessage[]): Promise<void> {
    const existingMessages = await this.getMessages();
    const allMessages = existingMessages.concat(messages);
    await this.saveMessagesToFile(allMessages);
  }

  async clear(): Promise<void> {
    const filePath = path.join(this.dir, `${this.sessionId}.json`);
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(`Failed to clear chat history from ${filePath}`, error);
    }
  }

  private async saveMessagesToFile(messages: BaseMessage[]): Promise<void> {
    const filePath = path.join(this.dir, `${this.sessionId}.json`);
    const serializedMessages = mapChatMessagesToStoredMessages(messages);
    try {
      fs.writeFileSync(filePath, JSON.stringify(serializedMessages, null, 2), {
        encoding: "utf-8",
      });
    } catch (error) {
      console.error(`Failed to save chat history to ${filePath}`, error);
    }
  }
}

```

然后我们开始逐步解析其中大家可能会有疑惑的点：

```js
export interface JSONChatHistoryInput { 
    sessionId: string; 
    dir: string; 
}
```
这里 sessionId 是区别于不同对话的 id，在工程中一般使用 uuid，dir 是存储聊天记录 json 文件的目录。

`lc_namespace = ["langchain", "stores", "message"];`  
是因为 `BaseListChatMessageHistory` 继承了 `Serializable`，声明 lc_namespace 是方便 langchain 在序列化和反序列化时，找到 json 中对象对应的内置类，例如当我们把 message 序列化，再反序列化后，打印出来依旧是对应 langchain 内部的类的实例化对象，依靠的就是这个。  

我们先看 `saveMessagesToFile` 部分，这部分原理很简单，就是使用 `mapChatMessagesToStoredMessages` 去对 messages 进行序列化，然后用写文件到 json 文件中。  


`getMessages` 从对应的文件中读取 json 内容，然后使用 `mapStoredMessagesToChatMessages` 序列化成对应的 message 对象。  

addMessage、addMessages、clear 都是比较正常的业务逻辑。  

让我们测试一下

```js
import { JSONChatHistory } from "./JSONChatHistory/index.ts"
import { AIMessage, HumanMessage } from "@langchain/core/messages";

const history = new JSONChatHistory({
    dir: "chat_data",
    sessionId: "test"
})


await history.addMessages([
  new HumanMessage("Hi, 我叫小明"),
  new AIMessage("你好"),
]);

const messages = await history.getMessages();
console.log(messages)
```

输出：

```js
[
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "Hi, 我叫小明",
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "Hi, 我叫小明",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: { content: "你好", additional_kwargs: {}, response_metadata: {} },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "你好",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  }
]
```

可以看到，因为我们正确的设置了 `lc_namespace`，序列化和反序列化可以很正确的处理 langchain 中的对象，例如 `HumanMessage` 和 `AIMessage`。


让我们看看如何应用在 memory 中，这里为了方便，我们依旧使用 `ConversationChain`：

```js
import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";


const chatModel = new ChatOpenAI();
const memory = new BufferMemory({
    chatHistory: history
});
const chain = new ConversationChain({ llm: chatModel, memory: memory });
const res1 = await chain.call({ input: "我叫什么？" });
```

返回：
```
{ response: "你叫小明。" }
```

然后我们看一下 chat history 中存储的 message：

```js
const messages = await history.getMessages()
```

```js
[
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "Hi, 我叫小明",
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "Hi, 我叫小明",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: { content: "你好", additional_kwargs: {}, response_metadata: {} },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "你好",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: { content: "我叫什么？", additional_kwargs: {}, response_metadata: {} },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "我叫什么？",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  },
  AIMessage {
    lc_serializable: true,
    lc_kwargs: { content: "你叫小明。", additional_kwargs: {}, response_metadata: {} },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "你叫小明。",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  }
]
```

然后我们打开对应的 test.json，其中内容是：

```json
[
  {
    "type": "human",
    "data": {
      "content": "Hi, 我叫小明",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  },
  {
    "type": "ai",
    "data": {
      "content": "你好",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  },
  {
    "type": "human",
    "data": {
      "content": "我叫什么？",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  },
  {
    "type": "ai",
    "data": {
      "content": "你叫小明。",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  }
]
```

至此，我们通过自定义 chat history 实现把历史记录存储到本地文件和从本地文件中读取到 chat history中，并且将自定义的 chat history 作为 memory 内置使用的 chatHistory 成功将 memory 接入了我们的存储中。  

可以看到，得益于 langchain 良好的抽象和模块化，我们可以非常容易根据我们的需求接入到 langchain 现有的基建中。

## 小结

这一小节的干货比较多，我们希望不是重复的造轮子，而是尽可能利用 langchain 的现有基建，从而把我们更多的精力放在更加重要的业务逻辑中。  

在本章，我们通过使用 LCEL 中灵活利用 `RunnablePassthrough`，让 LCEL 也能使用到丰富的 memory 基建，我们不需要重复的去在 LCEL 中造 `EntityMemory` 这种基建。  

然后通过把聊天记录存储在 json 文件中的 `JSONChatHistory` 讲解了如何实现自定义的 chat history，并接入到现有的 memory 中。虽然 langchain 提供了跟各种数据库的集成工具，但因为业务的特殊性，我们需要使用自己定义存储方式，借鉴 `JSONChatHistory` 的思路，你可以非常方便的把用户的聊天记录存储到任意数据库中，更丝滑的集成到业务现有的基建中。







