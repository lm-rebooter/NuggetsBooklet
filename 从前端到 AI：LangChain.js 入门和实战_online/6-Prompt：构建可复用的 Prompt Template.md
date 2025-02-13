> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/prompt-template.ipynb

Prompt 是大模型的核心，传统方式我们一般使用字符串拼接或者模版字符串来构造 prompt，而有了 langchain 后，我们可以构建可复用的 prompt 来让我们更工程化的管理和构建 prompt，从而制作更复杂的 chat bot

## 基础 prompt
首先我们学习基础的 `PromptTemplate` 来理解 langchain 中是如何构建和管理 prompt template。  

`PromptTemplate` 是帮助我们定义一个包含变量的字符串模版，我们可以通过向该类的对象输入不同的变量值来生成模版渲染的结果。 这可以方便的让我们定义一组 prompt 模板，然后在运行时根据用户的输入动态地填充变量从而生成 prompt。

### 无变量 template
我们先从最基础的无变量 template 来逐步上手和理解

```js
import { PromptTemplate } from "@langchain/core/prompts";

const greetingPrompt = new PromptTemplate({
  inputVariables: [],
  template: "hello world",
});
const formattedGreetingPrompt = await greetingPrompt.format();

console.log(formattedGreetingPrompt);
```

`PromptTemplate` 就是最基础的 template，我们不传入任何变量（`inputVariables: []`），这跟硬编码一个字符串没任何区别。 调用 prompt template 的方式就是 `format`，因为我们没有任何变量，也就没有任何参数。

没有变量的 prompt template 使用的很少，这里主要以此帮助大家理解 template 的概念。

### 含变量的 template


```js
const personalizedGreetingPrompt = new PromptTemplate({
  inputVariables: ["name"],
  template: "hello，{name}",
});
const formattedPersonalizedGreeting = await personalizedGreetingPrompt.format({
  name: "Kai",
});

console.log(formattedPersonalizedGreeting);
// hello，Kai
```

其 API 比较容易理解，使用 `{}` 来包裹住变量，然后在 `inputVariables` 声明用到的变量名称。因为有了变量，所以在调用 `format()` 就需要传入对应的变量。  

同样的多变量的 template 也是类似的

```js
const multiVariableGreetingPrompt = new PromptTemplate({
  inputVariables: ["timeOfDay", "name"],
  template: "good {timeOfDay}, {name}",
});
const formattedMultiVariableGreeting = await multiVariableGreetingPrompt.format({
  timeOfDay: "morning",
  name: "Kai",
});

console.log(formattedMultiVariableGreeting);
// good morning, Kai
```

唯一需要注意的就是，如果你的 prompt 需要 `{}`，可以这么转义`{{}}`

```js
const multiVariableGreetingPrompt = new PromptTemplate({
  inputVariables: ["timeOfDay", "name"],
  template: "good {timeOfDay}, {name} {{test}}",
});
const formattedMultiVariableGreeting = await multiVariableGreetingPrompt.format({
  timeOfDay: "morning",
  name: "Kai",
});

console.log(formattedMultiVariableGreeting);
// good morning, Kai {test}
```

这么创建 template 有点繁琐， langchain 也提供了简便的创建方式

```js
const autoInferTemplate = PromptTemplate.fromTemplate("good {timeOfDay}, {name}");
console.log(autoInferTemplate.inputVariables);
// ['timeOfDay', 'name']

const formattedAutoInferTemplate = await autoInferTemplate.format({
  timeOfDay: "morning",
  name: "Kai",
});
console.log(formattedAutoInferTemplate)
// good morning, Kai
```

这样创建 prompt 的时候，会自动从字符串中推测出需要输入的变量。  

### 使用部分参数创建 template
我们并不需要一次性把所有变量都输入进去，在工程中，我们可能先获得某个参数，之后才能获得另一个参数。这里类似于函数式编程的概念，我们给 需要两个参数的 prompt template 传递一个参数后，就会生成需要一个参数的 prompt template。  

```js
const initialPrompt = new PromptTemplate({
  template: "这是一个{type}，它是{item}。",
  inputVariables: ["type", "item"],
});


const partialedPrompt = await initialPrompt.partial({
  type: "工具",
});

const formattedPrompt = await partialedPrompt.format({
  item: "锤子",
});

console.log(formattedPrompt);
// 这是一个工具，它是锤子。

const formattedPrompt2 = await partialedPrompt.format({
  item: "改锥",
});

console.log(formattedPrompt2)
// 这是一个工具，它是改锥。
```

### 使用动态填充参数

当我们需要，一个 prompt template 被 `format` 时，实时地动态生成参数时，我们可以使用函数来对 template 部分参数进行指定。


```js
const getCurrentDateStr = () => {
  return new Date().toLocaleDateString();
};

const promptWithDate = new PromptTemplate({
  template: "今天是{date}，{activity}。",
  inputVariables: ["date", "activity"],
});

const partialedPromptWithDate = await promptWithDate.partial({
  date: getCurrentDateStr,
});

const formattedPromptWithDate = await partialedPromptWithDate.format({
  activity: "我们去爬山",
});

console.log(formattedPromptWithDate);
// 输出: 今天是2023/7/13，我们去爬山。
```

注意，函数 `getCurrentDateStr` 是在 `format` 被调用的时候实时运行的，也就是可以在被渲染成字符串时获取到最新的外部信息。 目前这里不支持传入参数，如果需要参数，可以用 js 的闭包进行参数的传递。  
假设我们有一个根据时间段（morning, afternoon, evening）返回不同问候语，并且需要带上当前时间的需求

```js
const getCurrentDateStr = () => {
  return new Date().toLocaleDateString();
};

function generateGreeting(timeOfDay) {
  return () => {
    const date = getCurrentDateStr()
    switch (timeOfDay) {
      case 'morning':
        return date + ' 早上好';
      case 'afternoon':
        return date + ' 下午好';
      case 'evening':
        return date + ' 晚上好';
      default:
        return date + ' 你好';
    }
  };
}

const prompt = new PromptTemplate({
  template: "{greeting}!",
  inputVariables: ["greeting"],
});

const currentTimeOfDay = 'afternoon';
const partialPrompt = await prompt.partial({
  greeting: generateGreeting(currentTimeOfDay),
});

const formattedPrompt = await partialPrompt.format();

console.log(formattedPrompt);
// 输出: 3/21/2024 下午好!
```

得益于 js 的灵活性，我们是可以实现官方 API 不支持的玩法。  


## chat prompt
基础的 prompt template 算是开胃菜，因为 chat API 是目前跟 llm 交互的主流形式，`ChatPromptTemplate` 是最常用的工具。

在跟各种聊天模型交互的时候，在构建聊天信息时，不仅仅包含了像上文中的文本内容，也需要与每条消息关联的角色信息。 例如这条信息是由 人类、AI、还是给 chatbot 指定的 system 信息，这种结构化的消息输入有助于模型更好地理解对话的上下文和流程，从而生成更准确、更自然的回应。  

为了方便地构建和处理这种结构化的聊天消息，LangChain 提供了几种与聊天相关的提示模板类，如 `ChatPromptTemplate`、`SystemMessagePromptTemplate`、`AIMessagePromptTemplate` 和 `HumanMessagePromptTemplate`。

其中后面三个分别对应了一段 ChatMessage 不同的角色。在 OpenAI 的定义中，每一条消息都需要跟一个 role 关联，标识消息的发送者。角色的概念对 LLM 理解和构建整个对话流程非常重要，相同的内容由不同的 role 发送出来的意义是不同的。
- `system` 角色的消息通常用于设置对话的上下文或指定模型采取特定的行为模式。这些消息不会直接显示在对话中，但它们对模型的行为有指导作用。 可以理解成模型的元信息，权重非常高，在这里有效的构建 prompt 能取得非常好的效果。
- `user` 角色代表真实用户在对话中的发言。这些消息通常是问题、指令或者评论，反映了用户的意图和需求。
- `assistant` 角色的消息代表AI模型的回复。这些消息是模型根据system的指示和user的输入生成的。

我们以一个基础的翻译 chatbot 来讲解这几个常见 chat template，我们先构建一个 system message 来给 llm 指定核心的准则

```js
import { SystemMessagePromptTemplate } from "@langchain/core/prompts";

const translateInstructionTemplate = SystemMessagePromptTemplate.fromTemplate(`你是一个专
业的翻译员，你的任务是将文本从{source_lang}翻译成{target_lang}。`);

```

然后构建一个用户输入的信息

```js
import { HumanMessagePromptTemplate } from "@langchain/core/prompts";

const userQuestionTemplate = HumanMessagePromptTemplate.fromTemplate("请翻译这句话：{text}")
```

然后将这两个信息组合起来，形成一个对话信息

```js
import { ChatPromptTemplate } from "@langchain/core/prompts";

const chatPrompt = ChatPromptTemplate.fromMessages([
  translateInstructionTemplate,
  userQuestionTemplate,
]);
```

然后我们就可以用一个 `fromMessages` 来格式化整个对话信息

```js
const formattedChatPrompt = await chatPrompt.formatMessages({
  source_lang: "中文",
  target_lang: "法语",
  text: "你好，世界",
});

console.log(formattedChatPrompt)
```

就是一个这样的结构

```json
[
  SystemMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "你是一个专业的翻译员，你的任务是将文本从中文翻译成法语。",
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "你是一个专业的翻译员，你的任务是将文本从中文翻译成法语。",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  },
  HumanMessage {
    lc_serializable: true,
    lc_kwargs: {
      content: "请翻译这句话：你好，世界",
      additional_kwargs: {},
      response_metadata: {}
    },
    lc_namespace: [ "langchain_core", "messages" ],
    content: "请翻译这句话：你好，世界",
    name: undefined,
    additional_kwargs: {},
    response_metadata: {}
  }
]
```

构建了一个数组，每一个元素都是一个 Message。 同样的 chatPrompt 也有简便写法的语法糖

```js
const systemTemplate = "你是一个专业的翻译员，你的任务是将文本从{source_lang}翻译成{target_lang}。";
const humanTemplate = "请翻译这句话：{text}";

const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["human", humanTemplate],
]);
```


然后我们就可以快速组装起一个简单的 chain 来测试一下

```js
import { load } from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";

const env = await load();
const process = {
    env
}

const chatModel = new ChatOpenAI();
const outputPraser = new StringOutputParser();

const chain = chatPrompt.pipe(chatModel).pipe(outputPraser);

await chain.invoke({
  source_lang: "中文",
  target_lang: "法语",
  text: "你好，世界",
})
// "Bonjour, le monde"
```

## 组合多个 Prompt

在实际工程中，我们可能会根据多个变量，根据多个外界环境去构造一个很复杂的 prompt，这里就是`PipelinePromptTemplate` 的应用场景。 我可以用将多个独立的 template 构建成一个完整且复杂的 prompt，这样可以提高独立 prompt 的复用性，进一步增强模块化带来的优势。  

在 `PipelinePromptTemplate` 有两个核心的概念：
- `pipelinePrompts`，一组 object，每个 object 表示 `prompt` 运行后赋值给 `name` 变量 
- `finalPrompt`，表示最终输出的 prompt  

我们还是少废话，直接看代码

```js
import {
  PromptTemplate,
  PipelinePromptTemplate,
} from "@langchain/core/prompts";

const getCurrentDateStr = () => {
  return new Date().toLocaleDateString();
};

const fullPrompt = PromptTemplate.fromTemplate(`
你是一个智能管家，今天是 {date}，你的主人的信息是{info}, 
根据上下文，完成主人的需求
{task}`);

const datePrompt = PromptTemplate.fromTemplate("{date}，现在是 {period}")
const periodPrompt = await datePrompt.partial({
    date: getCurrentDateStr
})

const infoPrompt =  PromptTemplate.fromTemplate("姓名是 {name}, 性别是 {gender}");

const taskPrompt = PromptTemplate.fromTemplate(`
我想吃 {period} 的 {food}。 
再重复一遍我的信息 {info}`);

const composedPrompt = new PipelinePromptTemplate({
  pipelinePrompts: [
    {
      name: "date",
      prompt: periodPrompt,
    },
    {
      name: "info",
      prompt: infoPrompt,
    },
    {
      name: "task",
      prompt: taskPrompt,
    },
  ],
  finalPrompt: fullPrompt,
});

const formattedPrompt = await composedPrompt.format({
    period: "早上",
    name: "张三",
    gender: "male",
    food: "lemon"
});

console.log(formattedPrompt)
```

输出
```
你是一个智能管家，今天是 3/21/2024，现在是 早上，你的主人的信息是姓名是 张三, 性别是 male, 
根据上下文，完成主人的需求

我想吃 早上 的 lemon。 
再重复一遍我的信息 姓名是 张三, 性别是 male
```

这里有几个需要注意的地方
- 一个变量可以多次复用，例如外界输入的 `period` 在 `periodPrompt` 和 `taskPrompt` 都被使用了
- `pipelinePrompts` 中的变量可以被引用，例如我们在 `taskPrompt` 使用了 `infoPrompt` 的运行结果
- 支持动态自定义和 partial。例子中我们也涉及到了这两种特殊的 template  
- langchain 会自动分析 pipeline 之间的依赖关系，尽可能的进行并行化来提高运行速度

有了 `pipelinePrompts` 我们可以极大程度的复用和管理我们的 prompt template，从而让 llm app 的开发更加工程化。


## 小结
prompt 是 llm app 最核心的价值，并且会经常修改。所以通过我们本节课介绍的各种 prompt template，我们可以更灵活的使用、管理和组装多种 prompt template！打造出最合适当前场景和对话的 prompt，从而更好地激发 llm 的能力。








