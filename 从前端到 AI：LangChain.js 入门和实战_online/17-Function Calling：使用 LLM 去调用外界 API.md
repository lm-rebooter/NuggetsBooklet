
> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/blob/main/tool-lesson.ipynb

在新的一章的开始，让我们了解构建一切 AI Agent 的基础 -- 「Function calling 」。

Function calling 本质上就是给 LLM 了解和调用外界函数的能力，LLM 会根据他的理解，在合适的时间返回对函数的调用和参数，然后根据函数调用的结果进行回答。例如，你在构建一个旅游计划的 chatbot，用户给出问题 “规划一个 2.11 日北京的旅游行程，帮我选择最合适天气的衣服”，LLM 就会判断需要调用获取 2.11 实时天气的 API 来获取北京在 2.11 的天气，并根据返回的结果来回答问题。

本节中，我们先把 langchain 放一放，先使用 OpenAI 官方 API 去尝试理解和使用 function calling API。
注意，后续 OpenAI 将 function calling 更名成了 tools，但目前很多资料依旧叫 function calling， 我感觉这个名称也更贴合这个 API 的本意，但我们还是尽量紧跟最新的标准，后续都会以 tools 称呼这个 API。

Tools 基本使用
获取天气是非常经典的使用案例，这个需要实时获取外部 API 的结果，LLM 无法独立回答。这里我们使用 OpenAI 官方库，首先引入并初始化
```ts
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: env["API_KEY"],
});
```

然后我们创建一个假的获取天气的函数
```ts
function getCurrentWeather({ location, unit="fahrenheit"}){
   const  weather_info = {
        "location": location,
        "temperature": "72",
        "unit": unit,
        "forecast": ["sunny", "windy"],
    }
    return JSON.stringify(weather_info);
}
```


然后我们创建这个函数的描述信息
```ts
const tools = [
    {
      type: "function",
      function: {
        name: "getCurrentWeather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
    }
]
```
这里是 OpenAI 官方 API 指定的格式，我们逐步解析这里的定义，
- `type: "function"` 目前只支持值为 function, 必须指定
- `function` 是对具体函数的描述
- `name` 是函数名, 需要跟函数的名称一致, 方便我们后续实现对函数名的调用
- `descirption` 函数的描述, 你可以理解成对 LLM 决定什么是否调用该函数的唯一信息, 这部分清晰的表达函数的效果
- `parameters` 函数的参数, OpenAI 使用的是通用的 JSON Schema 去描述函数的各个参数, 在我们这里使用了数组作为参数的输入, 其中有两个 key
	  - `location` 一个 string 值表示位置
	  - `unit` 表示请求的单位
- `required` 通过这个 key 告知 LLM 该参数是必须的

然后我们就可以尝试调用 LLM 的 tools 功能
```ts
 const messages = [
    {
        "role": "user",
        "content": "北京的天气怎么样"
    }
]

const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    tools
  });
  console.log(result.choices[0]);
```
可以看到, 我们 `getCurrentWeather` 定义是根据官方文档中的示例使用英语进行的描述, 但我们依旧可以使用中文或其他语言跟 LLM 进行沟通, 因为 LLM 其涌现的智能具有跨语言的理解能力, 那我们看一下他的返回值
```ts
{
  content_filter_results: {},
  finish_reason: "tool_calls",
  index: 0,
  message: {
    content: null,
    role: "assistant",
    tool_calls: [
      {
        function: {
          arguments: '{\n  "location": "Beijing",\n  "unit": "celsius"\n}',
          name: "getCurrentWeather"
        },
        id: "xxxxx",
        type: "function"
      }
    ]
  }
}
```
这里跟之前的返回值不一样, content 是空的, 也就意味着大模型并没有返回文本信息, 而是在 tool_calls 中生命了需要调用的函数内容, 参数 location 是 beijing, 而且有趣的是 它给定了另一个参数 unit 指定为摄氏度

如果我们用同样的代码, 使用英语进行提问
```ts
 const messages = [
    {
        "role": "user",
        // "content": "北京的天气怎么样"
        "content": "What's the weather like in Beijing?"

    }
]

const result = await openai.chat.completions.create({
    // model: 'gpt-3.5-turbo',
    messages,
    tools
  });
```
得到的结果就是 
```ts
{
  content_filter_results: {},
  finish_reason: "tool_calls",
  index: 0,
  message: {
    content: null,
    role: "assistant",
    tool_calls: [
      {
        function: {
          arguments: '{\n"location": "Beijing"\n}',
          name: "getCurrentWeather"
        },
        id: "xxxx",
        type: "function"
      }
    ]
  }
}
```

也就是, 你用中文提问他就会给第二个参数, 并指定是摄氏度, 而用英语则不会. 这也体现了 LLM 基于大量数据训练出来的涌现的智能, 在这种细节上也会有所体现. 当然我们不应该依赖于此, 可以当做对 LLM 一个有趣的观察, 因为其是一个黑盒, 有时候一些有趣的细节让我们会心一笑.

## 控制 LLM 调用函数的行为
这里, tools 还有一个可选的参数是 `tool_choice`, 他有几种使用方式
- `none` 表示, 禁止 LLM 使用任何函数, 也就是无论用户输入什么, LLM 都不会调用函数
- `auto` 表示, 让 LLM 自己决定是否使用函数. 也就是 LLM 的返回值可能是函数调用, 也可能正常的信息
而最后一种, 就是指定一个函数, 让 LLM 强制使用该函数, 其类型是一个 object, 有两个属性
- `type` 目前只能指定为 function
- `function`, 其值为一个对象, 有且仅有一个 key name 为函数名称
例如
```ts
{
    "type": "function", 
    "function": {
        "name": "my_function"
    }
}
```

有了这个能力, 我们就具有了更细粒度去调用 LLM 的能力, 例如我们可以禁止 LLM 去调用函数
```ts
const messages = [
    {
        "role": "user",
        "content": "北京的天气怎么样"
    }
]

const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    tools,
    tool_choice: "none"
  });
  console.log(result.choices[0]);
```
其返回值是
```ts
{
  content_filter_results: {
    hate: { filtered: false, severity: "safe" },
    self_harm: { filtered: false, severity: "safe" },
    sexual: { filtered: false, severity: "safe" },
    violence: { filtered: false, severity: "safe" }
  },
  finish_reason: "stop",
  index: 0,
  message: { content: "请问您需要获取北京当前的天气还是未来几天的天气预报？", role: "assistant" }
}
```

或者强制去调用某个函数 
```ts
const messages = [
    {
        "role": "user",
        "content": "你好"
    }
]

const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    tools,
    tool_choice: {
        type: "function",
        function: {
           name: "getCurrentWeather"
        }
    }
  });
 
 console.log(result.choices[0]);
```

```ts
{
  content_filter_results: {},
  finish_reason: "stop",
  index: 0,
  message: {
    content: null,
    role: "assistant",
    tool_calls: [
      {
        function: {
          arguments: '{\n  "location": "上海",\n  "unit": "celsius"\n}',
          name: "getCurrentWeather"
        },
        id: "call_o5QJhnax6dC9e4yqHL1kLrq0",
        type: "function"
      }
    ]
  }
}
```
可以看到, 用户并没有提供任何跟城市和天气的信息, 但因为我们强制 LLM 去调用请求天气的函数, 所以 LLM 产生了严重的幻想问题. 至于这种强制调用有什么用, 在后面数据提取和标记一章, 大家就会看到其神奇之处.

然后, 我们将 LLM 返回的调用参数, 传递给 js 中的函数中
```ts
const functions = {
    "getCurrentWeather": getCurrentWeather
  }

const functionInfo = result.choices[0].message.tool_calls[0].function
const functionName = functionInfo.name;
const functionParams = functionInfo.arguments

const functionResult = functions[functionName](functionParams);

console.log(functionResult);
```
在前面, 我们定义 getCurrentWeather 函数的时候, 将其参数设计为类似  React function component 一样的 object, 比较方便我们在这里调用对应的函数. 不需要了解每个函数的具体细节, 就可以直接把 argument object 塞入到对应的函数中就能得到结果

## 并发调用函数
在新版的 tools 中引入了并发调用函数的特性, 可以简单的理解成之前的 function calling 每次 LLM 只会返回对一个函数的调用请求, 而 tools 可以一次返回一系列的函数调用, 来获取更多信息, 并且函数之间我们可以并行的调用来节约调用外部 API 所占用的时间.  在旧的 function calling 中, 只能让 LLM 依次返回调用请求, 来串行调用. 

我们这里写一个获取当前时间的 API
```ts
function getCurrentTime({ format = "iso" } = {}) {
    let currentTime;
    switch (format) {
        case "iso":
            currentTime = new Date().toISOString();
            break;
        case "locale":
            currentTime = new Date().toLocaleString();
            break;
        default:
            currentTime = new Date().toString();
            break;
    }
    return currentTime;
}

```


并添加到 tools 定义中
```ts
const tools = [
    {
        type: "function",
        function: {
            name: "getCurrentTime",
            description: "Get the current time in a given format",
            parameters: {
                type: "object",
                properties: {
                    format: {
                        type: "string",
                        enum: ["iso", "locale", "string"],
                        description: "The format of the time, e.g. iso, locale, string",
                    },
                },
                required: ["format"],
            },
        },
    },
    {
        type: "function",
        function: {
          name: "getCurrentWeather",
          description: "Get the current weather in a given location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g. San Francisco, CA",
              },
              unit: { type: "string", enum: ["celsius", "fahrenheit"] },
            },
            required: ["location", "unit"],
          },
        },
    ]
```

```ts
const messages = [
    {
        "role": "user",
        "content": "请同时告诉我当前的时间, 和北京的天气"
    }
]

const result = await openai.chat.completions.create({
     model: 'gpt-3.5-turbo',
    messages,
    tools,
  });

console.log(result.choices[0]);
```

```ts
 message: {
    role: "assistant",
    content: null,
    tool_calls: [
      {
        id: "xxxx",
        type: "function",
        function: {
          name: "getCurrentWeather",
          arguments: '{\n  "location": "Beijing",\n  "unit": "celsius"\n}'
        }
      },
      {
        id: "xxx",
        type: "function",
        function: {
          name: "getCurrentTime",
          arguments: '{\n  "format": "locale"\n}'
        }
      }
    ]
  },
```


但这个 feature 目前十分不稳定, 如果没有精心设计过 prompt 非常难实现, 上面的示例是我跑了很多次才出现的结果, 甚至连官方示例中对多个城市的天气进行提问的示例, 在本地也很难复现
```ts
{ role: "user", content: "What's the weather like in San Francisco, Tokyo, and Paris?" },
```

不过就像我们说的, LLM 是一个黑盒, 也在一直进步, 可能更新版本的 LLM 已经在 tools 这个方面更加灵敏了. 就目前的情况, 我们最好假设 LLM 依旧一次只能调用一个函数, 但我们可以通过设计合适的函数参数来增强这部分能力

但, LLM 在多个函数之间的决策是非常稳定的, 例如
```ts
 { role: "user", content: "现在几点了?" },
    
 {
    id: "xxx",
    type: "function",
    function: {
      name: "getCurrentTime",
      arguments: '{\n  "format": "locale"\n}'
    }
}
```

```ts
{ role: "user", content: "北京天气如何?" },
    
  {
    id: "xxx",
    type: "function",
    function: {
      name: "getCurrentWeather",
      arguments: '{\n  "location": "北京",\n  "unit": "celsius"\n}'
    }
  }
```

## 根据函数结果进行回答
我们把上述所有内容联系在一起, 把函数运行结果输入给 LLM, 让 LLM 参考此进行回答. 
```ts
const messages = [
    { role: "user", content: "北京天气如何?" },
]

const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    tools
  });

```

然后, 提取结果中的函数内容, 并进行添加到 messages 中
```ts
messages.push(result.choices[0].message)

const functions = {
    "getCurrentWeather": getCurrentWeather
  }

const cell = result.choices[0].message.tool_calls[0]
const functionInfo = cell.function
const functionName = functionInfo.name;
const functionParams = functionInfo.arguments
const functionResult = functions[functionName](functionParams);

messages.push({
  tool_call_id: cell.id,
  role: "tool",
  name: functionName,
  content: functionResult,
}); 
```
此时, message 中的结构是
```ts
[
  { role: "user", content: "北京天气如何?" },
  {
    role: "assistant",
    content: null,
    tool_calls: [
      {
        id: "call_Kvduou0a7iW6octA20vAJFuW",
        type: "function",
        function: {
          name: "getCurrentWeather",
          arguments: '{\n  "location": "北京",\n  "unit": "celsius"\n}'
        }
      }
    ]
  },
  {
    tool_call_id: "call_Kvduou0a7iW6octA20vAJFuW",
    role: "tool",
    name: "getCurrentWeather",
    content: '{"temperature":"72","unit":"fahrenheit","forecast":["sunny","windy"]}'
  }
]
```
也就是, 一条用户的提问, 一条 LLM 对函数的调用, 一条我们调用函数的结果

然后把最新的 message 传递给 LLM
```ts
const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages,
});
console.log(response.choices[0].message);
```

得到结果
```ts
{ role: "assistant", content: "北京的天气是晴朗和有风的，温度是22度摄氏度。" }
```

至此, 我们完成了给 LLM 提供外部函数, 调用外部函数, 传递结果给 LLM, 让 LLM 根据此结果进行回答的完整闭环. 但你会发现, 我们为了把这个整个过程跑通需要写大量的代码, 而且我们这里只考虑了用户提问完后 LLM 一定会调用外界 API 的情况, 那如果没有调用 API 而是正常的对话呢? 是不是要加一个 if 判断? 

是不是感觉距离完整的 Agent 应用要写很多东西?  是的, 在没有 Langchain 的帮助下, 我们想实现一个 LLM 自助决定行动并且根据行动结果进行下一步行动的 Agent 是非常麻烦的, 所以下一节我们会学习如何在 LangChain 中使用 tools 。。


## 小结
这一章我们介绍了 OpenAI 非常强大的 tools 功能，该功能给复杂和稳定的 Agent 的使用提供了可能性。就 tools 的调用准确性和稳定性来说，openAI 依旧是第一梯队，其他 llm 在该方面做的都较差。    

大家可以参考上面的代码去把玩一下，感受一下 tools 的特性，尝试把一些现有的函数接入 tools 玩一下。



