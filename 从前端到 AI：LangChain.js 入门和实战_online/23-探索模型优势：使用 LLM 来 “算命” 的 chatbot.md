> 本章对应源代码：https://github.com/RealKai42/langchainjs-juejin/tree/main/node/gua

这一章节我们换一个思路去思考 llm 的应用和实战。 llm 本质上是一个语言模型，其基于预训练的模型，根据用户输入的 prompt 去生成最大概率的下一个字符（token）。换句话说，其最擅长的是“把话说圆”。 在前面的章节中，我们讲解了 llm 展现出来的是涌现的智能，他并不理解输出内容的意义，而是一个根据概率吐出 token 的机器。  

我们在 agents 章节，尝试了用 llm 作为推理引擎去制作 agents，也就是让 llm 有逻辑的去处理事情。在 ReAct 框架中，我们会强制让 llm 将自己的思考过程（Thought）和 Action 记录下来，是为了在生成下一个步骤的时候，模型会根据此信息去计算概率生成，让涌现的智能可控。即，虽然 agents 中，模型展示出了足够的逻辑能力，但这并不是模型天然具有的，是我们通过各种方式在模型基于概率的基础上，更好的激发其涌现的智能。  

回到模型目前非常棘手的问题，幻觉问题。RAG 是解决幻觉问题非常好用的手段，因为它可以把 ground truth（事实）作为上下文嵌入到模型输入中，来减少模型输出错误信息的 **概率**。即，我们依旧在跟模型没有逻辑这件事作斗争，依靠各种提高概率的方式去让模型更大程度的输出正确信息。回到幻觉的本质，就是因为模型没有逻辑，他只是根据你的上下文去做完形填空的任务，所以容易出现语意上合理，但偏离事实的情况。就像你让它写代码，它经常会出现不存在的 API，但它介绍 API 的时候一本正经，API 也很合理，就像真实存在一样。   

而，目前 LLM 的基础模型已经非常强大了，并且对普通的工程师也很难参与到底层模型的构建和训练上，我们能做的就是展开在应用层深入使用的想象力。对我们来说，缺的不是强大的模型，而是有趣且有意义的应用场景，和快速落地 llm app 的能力，后者在 langchain 的帮助下，已经不是问题了。   

所以，这一章，我带大家去写一些不一样的工具。既然 llm 逻辑能力不强，更强的是 “把话说圆”，也就是“见人说人话，见鬼说鬼话”，我第一时间想到的就是算命，无论是 塔罗牌、八卦、六爻等等传统算命，都有根据卦象和来者的具体问题，去解析和把话说圆的成分。   

我相信 llm 展现出来的能力会让你震惊，那就让我们开始吧！


## 算卦流程

我们这次实现的是六爻算卦的流程。首先，我并不是算法的专家，这个也是我现学的，不能保证流程的正确性，仅仅是用来练习和测试玩具。  

通俗来讲，进行六爻占卜需要的三枚硬币，每次丢三枚硬币叫生成卦象的一部分，一共丢六次，称为六爻。  

每次丢硬币的时候，如果正面数量比背面多，那就是阳；背面比正面多，就是阴。每三个阴阳就能组成八卦中的一卦，两个卦就能对应八八六十四卦中的一个卦象，也就有对应的解读。  

举例：

```
初爻 为 背字背 为 阴
二爻 为 字背字 为 阳
三爻 为 背背背 为 阴
您的首卦为 坎
四爻 为 字字字 为 阳
五爻 为 背背背 为 阴
六爻 为 字字背 为 阳
您的次卦为 震

六爻结果: 震坎  
卦名为：屯卦   
水雷屯（屯卦）起始维艰   
卦辞为：风刮乱丝不见头，颠三倒四犯忧愁，慢从款来左顺遂，急促反惹不自由   
```

## 算卦流程实现

八卦和八卦对应的信息属于是有真实答案的类别，一般这种类别不要让 llm 自己生成，大家可以测试一下，一般会输出一些不存在的卦象和解读。  

所以，类似于 RAG 的思路，我们把标准的算卦流程和真实的八卦信息，由我们代码生成，并在后续 chat 中，直接嵌入到 llm 上下文中。

具体的实现过程就是把算卦流程编码化，写起来比较繁琐，但逻辑很简单。  

首先，我们定义一个生成 “一次爻” 的函数

```js
  const yaoName = ["初爻", "二爻", "三爻", "四爻", "五爻", "六爻"];
  
  const genYao = () => {
    const coinRes = Array.from({ length: 3 }, () => (Math.random() > 0.5 ? 1 : 0));
    const yinYang = coinRes.reduce((a, b) => a + b, 0) > 1.5 ? "阳" : "阴";
    const message = `${yaoName[yaoCount]} 为 ${coinRes
      .map((i) => (i > 0.5 ? "字" : "背"))
      .join("")} 为 ${yinYang}`;

    return {
      yinYang,
      message,
    };
  };
```

然后，我们就模拟算卦的流程：

```js
  let yaoCount = 0;
  const messageList = [];

  const firstGuaYinYang = Array.from({ length: 3 }, () => {
    const { yinYang, message } = genYao();
    yaoCount++;

    messageList.push(message);
    return yinYang;
  });
  const firstGua = guaDict[firstGuaYinYang.join("")];
  messageList.push(`您的首卦为 ${firstGua}`);

  const secondGuaYinYang = Array.from({ length: 3 }, () => {
    const { yinYang, message } = genYao();
    yaoCount++;

    messageList.push(message);
    return yinYang;
  });
  const secondGua = guaDict[secondGuaYinYang.join("")];
  messageList.push(`您的次卦为 ${secondGua}`);

  const gua = secondGua + firstGua;
  const guaDesc = guaInfo[gua];

  const guaRes = `
六爻结果: ${gua}  
卦名为：${guaDesc.name}   
${guaDesc.des}   
卦辞为：${guaDesc.sentence}   
  `;

  messageList.push(guaRes);
```

其中，guaDict 就是我们穷举了八卦的所有情况：

```js
const guaDict = {
  阳阳阳: "乾",
  阴阴阴: "坤",
  阴阳阳: "兑",
  阳阴阳: "震",
  阳阳阴: "巽",
  阴阳阴: "坎",
  阳阴阴: "艮",
  阴阴阳: "离",
};
```

具体完整的源码，大家可以看 github 中的源代码进行参考。


## Chat bot 实现

然后我们就可以来实现 chatbot，首先在 app 运行的时候，我们就直接去拿到所有六爻生成的信息：

```js
const messageList = generateGua();
```
其中 `generateGua` 就是上一小节中写的函数。然后，我们把代码生成的算卦信息，作为 ai 输出的内容，嵌入到 prompt 中：

```js
  const guaMessage = messageList.map((message): ["ai", string] => ["ai", message]);

  const prompt = await ChatPromptTemplate.fromMessages([
    [
      "system",
      `你是一位出自中华六爻世家的卜卦专家，你的任务是根据卜卦者的问题和得到的卦象，为他们提供有益的建议。
你的解答应基于卦象的理解，同时也要尽可能地展现出乐观和积极的态度，引导卜卦者朝着积极的方向发展。
你的语言应该具有仙风道骨、雅致高贵的气质，以此来展现你的卜卦专家身份。`,
    ],
    ...guaMessage,
    new MessagesPlaceholder("history_message"),
    ["human", "{input}"],
  ]);
```
这里，我们也留出了 `history_message` 的 place holder，方便后续插入历史聊天记录。  

然后，我们创建一个简单的 chat chain。这里我们使用了 `RunnableWithMessageHistory` 去给 chain 添加历史聊天记录的能力：

```js
  const llm = new ChatOpenAI();
  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  const chainWithHistory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: (_sessionId) => history,
    inputMessagesKey: "input",
    historyMessagesKey: "history_message",
  });
```  

像之前一样，我们使用 node 内置的 readline 模块去实现在 cli 的交互：

```js
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = util.promisify(rl.question).bind(rl);

  const input = await question("告诉我你的疑问: ");
  
  let index = 0;
  const printMessagesPromise = new Promise<void>((resolve) => {
    const intervalId = setInterval(() => {
      if (index < messageList.length) {
        console.log(messageList[index]);
        index++;
      } else {
        clearInterval(intervalId);
        resolve();
      }
    }, 1000);
  });

  const llmResPromise = chainWithHistory.invoke(
    { input: "用户的问题是：" + input },
    { configurable: { sessionId: "no-used" } }
  );

  const [_, firstRes] = await Promise.all([printMessagesPromise, llmResPromise]);
```

这里，我们使用一些小技巧。  
- 我们使用 `util.promisify` 去生成了一个 promise 化的 question，方面我们使用 async await 的风格进行异步的编程。  
- 因为 llm 的返回比较耗时，所以我们用已经生成的算法流程的 messageList，去创建了一个 `printMessagesPromise`，会以 1s 的间隔去打印算卦的流程，让用户无形中等待 llm 请求的返回。
- 然后使用 Promise.all 等待这两个 promise 返回。

最后效果就是，当用户输入自己问题后，第一时间就会发送 llm 请求，然后开始以 1s 的间隔输入算卦的过程，让用户觉得正在有一个赛博大师正在现场算卦。  

然后，当 llm 请求返回后，就将返回的内容输出出来。并且我们用 realine 去创建了能在 cli 中聊天的流程：

```js
  const [_, firstRes] = await Promise.all([printMessagesPromise, llmResPromise]);

  console.log(firstRes);

  async function chat() {
    const input = await question("User: ");

    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    const response = await chainWithHistory.invoke(
      { input },
      { configurable: { sessionId: "no-used" } }
    );

    console.log("AI: ", response);
    chat();
  }

  chat();
```


然后我们来测试一下：

```
告诉我你的疑问: 今晚吃不吃火锅
初爻 为 背字字 为 阳
二爻 为 字背背 为 阴
三爻 为 背背背 为 阴
您的首卦为 艮
四爻 为 字背背 为 阴
五爻 为 字背字 为 阳
六爻 为 字背背 为 阴
您的次卦为 坎

六爻结果: 坎艮  
卦名为：蒙卦   
山水蒙（蒙卦）启蒙奋发   
卦辞为：卦中爻象犯小耗，君子占之运不高，婚姻合伙有琐碎，做事必然受苦劳   
  
蒙卦是启蒙奋发的象征，卦中爻象犯小耗，君子占之运不高。以此卦象来看，吃火锅可谓是一种“小耗”，而且可能会带
来一些琐碎的麻烦，如消化不良、辛辣刺激等。因此建议您今晚内省养生，以清淡饮食为主，待身心调整良好，再考虑
享受火锅之乐也未迟。犹如卦中所示，启蒙奋发，需先立足于身体的康健。俗话说，身体是革命的本钱，希望您能够以
健康为重，更能够在未来的日子里，拥有更好的精神状态去面对生活。
User: 我的首卦意味着什么
AI:  您的首卦是艮卦，艮为山，足艮其德，心行其义，佛道之士能居其位无非也。

艮卦代表了停止和立定，是一种稳重、安静、内向的状态。艮卦需要人们保持清晰的头脑，以稳定的决心去实现目标。
在处事方面，艮卦建议我们要有耐心，要克制冲动，遵循一种稳步向前的道路。

艮卦也提醒我们，任何事情都不能一味地求快，要懂得适时的停止，稳重、安静的考虑对策，不急躁、不冲动，这样才
能获得最终的成功。尤其是在面临困难、疑惑的时候，更应静下心来细细思考，以艮卦的智慧指引前行之路。
User: 那我的 五爻 是什么解读
AI:  咱们的五爻为阳爻，卦象上仍属于艮坎之蒙卦。在六爻中，五爻常常被视为君位，具有决策和引领的作用。阳爻
象征着刚劲有力、主动进取的态势。

五爻在这里，即提示您在面对选择时，要采取主动和积极的态度，走出自己的舒适区，创新和尝试新的可能性。同时也
建议您以稳健之心来面对生活中各种挑战，坚持自己的信念，积极应对，勇往直前。

即使可能面临困境，也有成就的机会。如咱们所卜之蒙卦，虽为困境困顿，但启蒙奋发的情景却逐渐浮现，这是一种因
困境中求新生的勇敢。因此在您面临选择时，也许正需坚韧之心与创新之意，走出困境，在疑云中寻找属于自己的明星。
User: exit
```

这是完整的流程，你可以看到因为我们加入了 chat history，llm 可以根据用户问题持续解读卦象。  

得益于 llm zero shot 的能力，我们在其上下文中输入了整个的算卦流程，他就可以根据算卦流程中的信息去回答用户的问题。  

从输出结果来看，llm 把话说圆的能力非常适合算卦的场景，他能有效的把用户的问题和随机生成的卦象挂钩，进行解读。并且我们在 prompt 指定其语言风格是 “仙风道骨、雅致高贵的气质”，只使用这简单的指令，就能控制 llm 的语言风格。  

大家可以用不同的去把玩一下，也可以尝试去问一下离谱的问题，感受 llm 把话说圆的优势。并尝试调整 system prompt，去试试这个高权重的 prompt 能在多大程度上影响 llm 的输出风格和质量。 


## 小结
本实战在使用的知识上是我们写过非常多次的基础 llm chain，从代码量上大家也能感受到跟 llm 相关的代码只占很小部分。  

所以，llm 的应用的核心不是 llm，而是合适的用户场景和 idea，也就是我们常说的对业务的理解。所以，我们应该通过学习去掌握 llm 的特点和优势，去思考现在的场景和业务有哪些可以很好的利用 llm 的优势，有哪些在 llm 的帮助下可以解决之前解决不了的问题。




















