> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/output-parser.ipynb

OutParser 的价值我们可以用一个例子快速说明，我们简单调用一个 LLM 请求

```js
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatOpenAI();

await model.invoke([
    new HumanMessage("Tell me a joke")
])
```

这个输出的结果是
```js
AIMessage {
  lc_serializable: true,
  lc_kwargs: {
    content: "Why don't scientists trust atoms?\n\nBecause they make up everything!",
    additional_kwargs: { function_call: undefined, tool_calls: undefined },
    response_metadata: {}
  },
  lc_namespace: [ "langchain_core", "messages" ],
  content: "Why don't scientists trust atoms?\n\nBecause they make up everything!",
  name: undefined,
  additional_kwargs: { function_call: undefined, tool_calls: undefined },
  response_metadata: {
    tokenUsage: { completionTokens: 13, promptTokens: 11, totalTokens: 24 },
    finish_reason: "stop"
  }
}
```

这显然是人类不可读的，我们没办法把这样的对象去发送给用户。虽然这个结果是代码可以处理的，但我们每次都要写这样的 `dirty` 代码去提取其中我们需要的 `content` 或者未来需要的其他属性会很繁琐。而且未来可能会使用多种模型来替代 OpenAI 的模型，我们每次都适配不同的模型的 API 输出去提取需要的内容，也会很麻烦。  

所以这就是 OutputParser 的意义之一，langchain 封装了一系列的解析大模型 API 返回结果的工具让我们方便的使用。当然，并不限于解析大模型的输出结果，也能通过 Parser 去指定 LLM 返回的格式，让我们逐步来学习。

## String Output Parser

我们接着上面的例子，如果我们只需要大模型的文本输出，就可以通过 `StringOutputParser` 获取其中的文本内容


```js
import { StringOutputParser } from "@langchain/core/output_parsers";

const parser = new StringOutputParser();
const model = new ChatOpenAI();

const chain = model.pipe(parser)

await chain.invoke([
    new HumanMessage("Tell me a joke")
])
```

这是最简单的 Parser，提出 API 返回的文本数据（也就是 content ）部分。对比我们直接自己解析，langchain 内部会有错误处理和 stream 等支持。  

通过这个简单 api，方便大家理解 output parser 的其中一个意义 -- 解析大模型的输出

## StructuredOutputParser

Output Parser 的另一个意义就是引导模型以你需要的格式进行输出，部分 Parser 会内置一些预先设计好的 prompt 对模型进行引导。 听起来不太好理解，我们少废话，直接看 code 更容易理解。  

我们构建一个回答问题，并且会提供对应的证据和可信度评分

```js
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "用户问题的答案",
  evidence: "你回答用户问题所依据的答案",
  confidence: "问题答案的可信度评分，格式是百分数",
});
```
定义这个 praser 的时候，我们需要指定我们需要的 Json 输出的 key 和对应的描述。注意这里的描述要写完整，包括你的要求的格式（比如我们这里写的格式是百分数），越清晰 LLM 越能返回给你需要的数值。

在使用这个 parser 之前，我们先看看 magic 是如何发生的，langchain 植入了什么样的 prompt，我们打印出来看看，也学习一下其中 prompt 的写法

```js
console.log(parser.getFormatInstructions())
```


````
You must format your output as a JSON value that adheres to a given "JSON Schema" instance.

"JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.

For example, the example "JSON Schema" instance {{"properties": {{"foo": 
{{"description": "a list of test words", "type": "array", "items": {{"type": 
"string"}}}}}}, "required": ["foo"]}}}}

would match an object with one required property, "foo". The "type" property specifies 
"foo" must be an "array", and the "description" property semantically describes it as 
"a list of test words". The items within "foo" must be strings.
Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example 
"JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-
formatted.

Your output will be parsed and type-checked according to the provided schema instance, 
so make sure all fields in your output match the schema exactly and there are no 
trailing commas!

Here is the JSON Schema instance your output must adhere to. Include the enclosing 
markdown codeblock:
```json
{"type":"object","properties":{"answer":{"type":"string","description":"用户问题的答
案"},"evidence":{"type":"string","description":"你回答用户问题所依据的答案"},"confidence":
{"type":"string","description":"问题答案的可信度评分，格式是百分数"}},"required":
["answer","evidence","confidence"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"}
```
````

让我们逐段分析这个指令  

先告诉 LLM 输出的类型

```
You must format your output as a JSON value that adheres to a given "JSON Schema" instance.
```

然后，使用 few-shot （一种 prompt 技巧），也就是用示例告诉 LLM 什么是 JSON Schema，什么情况会被解析成功，什么情况不会被解析成功


```
For example, the example "JSON Schema" instance {{"properties": {{"foo": 
{{"description": "a list of test words", "type": "array", "items": {{"type": 
"string"}}}}}}, "required": ["foo"]}}}} would match an object with one required 
property, "foo". The "type" property specifies "foo" must be an "array", and the 
"description" property semantically describes it as "a list of test words". The items 
within "foo" must be strings. Thus, the object {{"foo": ["bar", "baz"]}} is a well-
formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": 
["bar", "baz"]}}}} is not well-formatted.
```

然后，再次强调类型的重要性，输出必须遵循给定的JSON Schema实例，确保所有字段严格匹配Schema中的定义，没有额外的属性，也没有遗漏的必需属性。  
并强调需要注意细节，比如不要在JSON对象中添加多余的逗号，这可能会导致解析失败。  
这些 prompt 质量非常高，把在该任务中大模型容易出现的问题都进行了强调，可以有效的保证输出的质量。

```
Your output will be parsed and type-checked according to the provided schema instance, 
so make sure all fields in your output match the schema exactly and there are no 
trailing commas!
```

最后才是给出，我们指定的 JSON 格式和对应的描述

```
Here is the JSON Schema instance your output must adhere to. Include the enclosing 
markdown codeblock: ```json {"type":"object","properties":{"answer":
{"type":"string","description":"用户问题的答案"},"evidence":
{"type":"string","description":"你回答用户问题所依据的答案"},"confidence":
{"type":"string","description":"问题答案的可信度评分，格式是百分数"}},"required":
["answer","evidence","confidence"],"additionalProperties":false,"$schema":"http://json-
schema.org/draft-07/schema#"} ```
```


通过这样一系列的 prompt，就能保证大模型以指定的格式输出，我们完成 Chain 的其他部分看看效果


```js
const prompt = PromptTemplate.fromTemplate("尽可能的回答用的问题 \n{instructions} \n{question}")
const model = new ChatOpenAI();

const chain = prompt.pipe(model).pipe(parser)
const res = await chain.invoke({
    question: "蒙娜丽莎的作者是谁？是什么时候绘制的",
    instructions: parser.getFormatInstructions()
})
                               
console.log(res)
```

输出是

```json
{
  answer: "蒙娜丽莎的作者是列奥纳多·达·芬奇，它是在16世纪初（约1503年到1506年）绘制的。",
  evidence: "根据艺术历史，蒙娜丽莎是意大利艺术家列奥纳多·达·芬奇的作品，它是在16世纪初创作的。",
  confidence: "100%"
}
```

这样，我们就完成了，强制大模型按照我们需求和格式进行输出的 output parser。经过这个 demo 相信你也会理解，parser 不止是对大模型的输出进行处理，也有引导大模型按照给定格式输出的能力，并且内置了一些错误处理的能力，更容易在生产环境进行部署。



## List Output Parser

`StructuredOutputParser` 是比较复杂也非常强大的 parser，学习过这个后，我们学一个类似但更简单的 parser 来加深，outputParser 是如何引导和解析大模型的输出的。


```js
import { CommaSeparatedListOutputParser } from "@langchain/core/output_parsers";

const parser = new CommaSeparatedListOutputParser();

console.log(parser.getFormatInstructions())
```

因为输出的格式更简单，所以这里引导性的 prompt 也更容易理解
```
Your response should be a list of comma separated values, eg: `foo, bar, baz`
```

然后我们把整条 chain 实现出来


```js
const model = new ChatOpenAI();
const prompt = PromptTemplate.fromTemplate("列出3个 {country} 的著名的互联网公司.\n{instructions}")
    
const chain = prompt.pipe(model).pipe(parser)

const response = await chain.invoke({
    country: "America",
    instructions: parser.getFormatInstructions(),
});
```


```
[ "Facebook", "Google", "Amazon" ]
```


经历过 `StructuredOutputParser` 和 `CommaSeparatedListOutputParser`，两个具备引导性的 prompt，相信你对 output parser 理解也更加深入了。其他的 output parser 也是类似的功能，可以根据自己场景需要 LLM 输出什么样的内容进行选用。

## Auto Fix Parser

让我们更进一步，把 LLM 进一步引入到 output parser 中，对于部分对输出质量要求更高的场景，如果出现了输出不符合要求的情况，我们希望的不是让 LLM 反复输出（可能每次都是错的），因为 LLM 并没有意识到自己的错误。所以我们需要把报错的信息返回给 LLM，让他理解错在哪里，应该怎么修改。  

首先，我们需要使用 zod，一个用来验证 js/ts 中类型是否正确的库。先使用 zod 定义一个我们需要的类型，这里我们指定了评分需要是一个数字，并且是 [0, 100] 的数字

```js
import { z } from "zod";

const schema = z.object({
  answer:  z.string().describe("用户问题的答案"),
  confidence: z.number().min(0).max(100).describe("问题答案的可信度评分，满分 100")
});
```

然后我们先使用正常的方式，使用 zod 来创建一个 `StructuredOutputParser`

```js
const parser = StructuredOutputParser.fromZodSchema(schema);
const prompt = PromptTemplate.fromTemplate("尽可能的回答用的问题 \n{instructions} \n{question}")
const model = new ChatOpenAI();

const chain = prompt.pipe(model).pipe(parser)
const res = await chain.invoke({
    question: "蒙娜丽莎的作者是谁？是什么时候绘制的",
    instructions: parser.getFormatInstructions()
})
                               
console.log(res)
```

然后我们得到了一个正确的输出

```json
{
  answer: "蒙娜丽莎的作者是达芬奇，大约在16世纪初期（1503年至1506年之间）开始绘制。",
  confidence: 100
}
```

然后，我们尝试构造一个可以根据 zod 定义以及错误的输出，来自动修复的 parser

```js
const fixParser = OutputFixingParser.fromLLM(model, parser);
```

然后，我们让它来修复一个类型出错的输出

```js
const wrongOutput = {
  "answer": "蒙娜丽莎的作者是达芬奇，大约在16世纪初期（1503年至1506年之间）开始绘制。",
  "sources": "90%" 
};

const fixParser = OutputFixingParser.fromLLM(model, parser);
const output = await fixParser.parse(JSON.stringify(wrongOutput));

```

```json
{ answer: "蒙娜丽莎的作者是达芬奇，大约在16世纪初期（1503年至1506年之间）开始绘制。", confidence: 90 }
```

然后，我们定义一个，数值超出限制的错误

```js
const wrongOutput = {
  "answer": "蒙娜丽莎的作者是达芬奇，大约在16世纪初期（1503年至1506年之间）开始绘制。",
  "sources": "-1" 
};

const fixParser = OutputFixingParser.fromLLM(model, parser);
const output = await fixParser.parse(JSON.stringify(wrongOutput));

output
```


```json
{ answer: "蒙娜丽莎的作者是达芬奇，大约在16世纪初期（1503年至1506年之间）开始绘制。", confidence: 90 }
```

可以看到，`OutputFixingParser` 在两次都修复成了 90，这显然是不符合事实的，让我们看一下其内置的 prompt 

```js
console.log(fixParser.getFormatInstructions())
```


````
You must format your output as a JSON value that adheres to a given "JSON Schema" instance.

"JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.

For example, the example "JSON Schema" instance {{"properties": {{"foo": 
{{"description": "a list of test words", "type": "array", "items": {{"type": 
"string"}}}}}}, "required": ["foo"]}}}}
would match an object with one required property, "foo". The "type" property specifies
"foo" must be an "array", and the "description" property semantically describes it as 
"a list of test words". The items within "foo" must be strings.
Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example 
"JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-
formatted.

Your output will be parsed and type-checked according to the provided schema instance, 
so make sure all fields in your output match the schema exactly and there are no 
trailing commas!

Here is the JSON Schema instance your output must adhere to. Include the enclosing 
markdown codeblock:
```json
{"type":"object","properties":{"answer":{"type":"string","description":"用户问题的答
案"},"confidence":{"type":"number","minimum":0,"maximum":100,"description":"问题答案的可信
度评分，满分 100"}},"required":["answer","confidence"],"additionalProperties":false,"$schema":"http://json-
schema.org/draft-07/schema#"}
```
````

可以看到，这是一个纯粹的 JSON 格式处理，并不会在意其中的语意和用户的问题，所以需要在合适的时机用合适的方式去修复。 当然这个工具不止是对 LLM 格式化输出的修复，也可以修复任何场景下的 JSON 问题。 

当然，可能会有朋友问，如果我把用户的问题也给 `fixParser`，这样不就得到一个正确的答案和正确的格式了么？ 在我们的 demo 中当然是可以的，但实际工程中，引导 llm 返回数据的 prompt 可能非常巨大，非常消耗 token，我们使用 `fixParser` 就是用较少的成本去修复这个输出，来节约重复调用的成本。所以把原文也给 `fixParser` 的话，就达不到成本节约的目的了。  

在进一步节约成本的背景下，我们是可以用对 GPT4 的错误输出用 GPT3.5 的 fixer 来修复，甚至是用一些开源模型来进行修复，因为在这个场景下，并不需要模型具有太高的质量，通过多模型的协同来降低成本。



## 小结

这一节，我们由浅入深的学习了 output parser 这个工具，其不止能够很好的格式化大模型的输出也能根据我们的需求引导大模型输出我们想要的格式。