我们这一节介绍如何最方便的获得 OpenAI 的服务，其中会介绍除 OpenAI 官方 API 外几种常见获取 llm 服务的方式，以及如何在 langchain 中使用。  

如果你能获得稳定的官方 API，那可以跳过本章的大部分内容。


## Azure OpenAI
Azure OpenAI 的优势是跟 OpenAI 同源，并且国内付款比较容易。  

正常注册 microsoft 账号，并注册登录 azure [link](https://azure.microsoft.com/en-us/)。这里注册 azure 的时候，需要手机号验证码，国内正常 +86 手机即可。还需要一张信用卡，在不开启付费业务的情况下不会有支出。

我为了这个教程新注册了一个 azure 账号，会送 200 刀的的额度帮助大家上手，这个额度是有期限的。具体大家注册时候的活动不确定，但看起来是个长期的活动。  

进入 azure 首页后，搜索 OpenAI：

![CleanShot 2024-04-23 at 22.11.05@2x.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f881f0a7227c4847abfbfc4a84bb1c5a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1202&h=454&s=77147&e=png&b=fcfcfc)

然后我们创建一个 Azure OpenAI 的服务：

![CleanShot 2024-04-23 at 22.12.10@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5fa50e691e044992b4878db2e0ab3930~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=652&s=104740&e=png&b=fdfdfd)

目前 OpenAI 的业务需要申请才能使用，第一次打开这个界面会提醒填写表单进行申请：

![CleanShot 2024-04-23 at 22.13.36@2x.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8124116b1994f2da2788163a03ddef4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1504&h=1016&s=185497&e=png&b=ffffff)

按照表单内容填写公司相关的信息即可，邮箱一定使用公司的邮箱，使用个人邮箱会被直接拒绝，一般需要等待几天即可。  
我们假设大家已经通过申请。

第一个 tab 基本信息，就按照其说明正常填写，这里需要注意两个点：
- 名称。这也会成为之后我们 openai 服务的 endpoint 的前缀
- 区域。因为每个区域的 GPU 数量是不一样的，所以提供的模型和算力限制都不一样，再考虑上延迟，一般选择日本区域比较好。一个账号可以在多个区域有服务，所以如果日本的 GPU 资源紧张，可以试试加拿大/澳大利亚等区域。每个区域新模型上线的节奏也不同，比如最新的 Vision 版本可能只有部分区域有，大家可以根据需要查询官方文档。

网络和 Tags 这两个 Tab 大家按需填写就行，一版不用做修改，然后创建资源即可。   


等待部署完成后，打开部署的服务，左上角打码部分就是你部署的名称，然后我们点击 模型部署 => 管理部署，跳转到 Azure OpenAI Studio 去管理模型。

![CleanShot 2024-04-23 at 22.24.17@2x.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c69977c1d21042b6aaf65661cfe1031e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1140&h=976&s=109139&e=png&b=fefefe)



Azure OpenAI 与 OpenAI API 有些不同，在 Azure 中，你需要先创建一个模型的部署，然后才能在 API 中使用部署名称去调用对应的部署，我们先创建一个 gpt4 的模型：

![CleanShot 2024-04-23 at 22.27.06@2x.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52dfe76c5a1a4b838b9bfe91c9a50654~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=904&h=1182&s=103310&e=png&b=fefefe)


![CleanShot 2024-04-23 at 22.27.50@2x.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86d904ca39304e6a835c823dabfcbd5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1386&h=1814&s=207639&e=png&b=fefefe)


这里模型的版本根据你服务部署所在的区域有关，并且不同模型的 API 定价不同，你可以根据需要去创建特定的模型版本。

![CleanShot 2024-04-23 at 22.28.00@2x.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db196cac00da4047938701637190f364~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=378&h=522&s=44110&e=png&b=fefefe)


创建之后，你就可以在聊天界面去测试这个部署：

![CleanShot 2024-04-23 at 22.30.10@2x.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ed8a6e8a0b547b5a716249ca2c01c1b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3206&h=2116&s=463724&e=png&b=fefefe)


这个界面已提供了非常丰富的参数和 prompt 功能，可以直接用来调试模型的参数和 prompt。 


然后，我们看如何在 langchain 中通过设置环境变量使用 azure openAI，首先创建一个 `.env` 文件，**注意，一定要把 .env 文件加到 .gitignore 中，一定不能将此文件上传至任何公开平台**。

然后，设置其中的几个属性：

```env
AZURE_OPENAI_API_KEY=abc
AZURE_OPENAI_API_VERSION=abc
AZURE_OPENAI_API_DEPLOYMENT_NAME=abc
AZURE_OPENAI_API_INSTANCE_NAME=abc
AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME=abc
```

- AZURE_OPENAI_API_KEY 是你部署的服务的 Key，可以在下图中的 密钥和终结点中找到。
- AZURE_OPENAI_API_VERSION 是使用的 API 版本，目前最新的稳定版是 `2024-02-01`，本小册大多使用的是 `2023-07-01-preview`，建议学习小册时可以继续使用 `2023-07-01-preview`。
- AZURE_OPENAI_API_DEPLOYMENT_NAME 是你部署的模型实例的名称，我们上面刚创建了一个 gpt4 的实例叫做 gpt-4。
- AZURE_OPENAI_API_INSTANCE_NAME 是你部署服务的名称，也就是下面截图左上角打码部分的名称。
- AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME 是你用于 embedding 的模型实例名称。创建步骤跟创建 gpt4 模型的部署一致。

![CleanShot 2024-04-24 at 16.53.36@2x.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b28b531e36f4f04a7b4b53ff13a3436~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=716&h=1236&s=150902&e=png&b=fdfdfd)


把这些环境变量设置好后，langchain 运行时会自动读取，所以我们创建 OpenAI 的服务时就可以直接：

```js
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";

const chatModel = new ChatOpenAI();
const embeddings = new OpenAIEmbeddings()
```

## 第三方 OpenAI 服务

另一种，就是经过中转的第三方 OpenAI 服务，这类平台比较多，我们不做推荐，只讲解一下如何在 langchain 中使用。  

首先是在 `.env` 声明 key：

```js
OPENAI_API_KEY=abc
```

然后在创建 ChatOpenAI 时，指定 baseUrl：

```js
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";


const chatModel = new ChatOpenAI({
    configuration: {
        baseURL: "xxx",
    }
});

await chatModel.invoke([
    new HumanMessage("Tell me a joke")
])
```



## 本地大模型

如果你是 win 平台，显卡显存大于 6G，mac 平台 M 系芯片 + 16G 内存基本就足够运行 7B 大小的模型。虽然推理速度较慢，但可以应付一些本地的测试。  

在 mac 平台下，我推荐用 [ollma](https://ollama.com/)，使用起来非常简单，下载好模型后，点开这个 app 后，就会自动在 http://localhost:11434 host 一个 llm 的服务。  
如果是 win 平台，可以尝试一下 [LM Studio](https://lmstudio.ai/)，其提供的模型更多，可玩性也更强一些。

目前我本地使用的还是 llama2，最新的已经到了 llama3，大家可以在这 [github](https://github.com/ollama/ollama) 找到目前支持的模型，llama 和 Mistral 家族的模型效果都很棒。 

然后，我们就可以在 langchian 中使用这些本地模型：

```js
import { Ollama } from "@langchain/community/llms/ollama";

const ollama = new Ollama({
  baseUrl: "http://localhost:11434", 
  model: "llama2", 
});


const res = await ollama.invoke("讲个笑话")
```

如果你使用的是 deno，需要在 deno.json 中加入这一行依赖别名：  

```json
{
    "imports":{
        ...
        "@langchain/community/": "npm:/@langchain/community/",
        ...
  
    }
}
```

大家可以直接用 ollama 来代替小册中出现的 llm 模型，当然其效果肯定不如 gpt3.5 和 gpt4 强。但如果你不容易获得 openAI 的 API，使用本地模型进行学习和测试，也是一个省钱和方便的方案。





## 加载环境变量

首先是在 nodejs 中，我们使用 `dotenv/config` 这个第三方库：

```
yarn add dotenv/config
```

然后，在需要使用环境变量的 js 文件中：

```js
import "dotenv/config";
```
即可，`.env` 中的环境变量就会被注入到 `process.env` 中。  


在 Deno 中稍有不同，因为 langchain 是为 nodejs 设计，所以读取环境变量时会默认从 `process.env` 中进行读取，所以我一般会这样 hack 一下：

```js
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
const env = await load();

const process = {
    env
}
```

即，从 .env 文件加载出来所有的环境变量后，再自己创建一个全局的 `process.env` 方便 langchain 进行读取。 



## 小结
本节介绍了如果没办法使用 OpenAI 官方的 API 有哪些合适的方式去获取 OpneAI 的服务，并在 Langchain 中使用。  

一般是推荐大家尝试 Azure OpenAI，其定价和模型跟 OpenAI 一致，且方便国内用户付款，缺点可能是需要进行申请才能使用。 在本地进行简单测试，或者简单任务可以使用 llama3，其效果已经非常不错了。 如果要是用第三方提供的 OpenAI API 服务，就需要注意价格和风险。  

然后，再次强调，一定保护好自己的 token 和 .env 文件，不能上传到任何公开渠道！





















