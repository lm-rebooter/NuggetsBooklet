在现代软件开发和应用中，JSON 和 Markdown 是两个非常重要的工具。它们不仅在数据传输和文本处理方面发挥着关键作用，而且在诸如 Coze 平台等应用中也有广泛的应用。

本文将详细介绍 JSON 和 Markdown 的概念、用法，并结合 Coze 平台的功能进行举例说明，希望能够帮助技术小白全面理解这两个工具的重要性和应用场景。

## JSON：JavaScript 对象表示法

**JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，易于人阅读和编写，同时也便于机器解析和生成**。尽管它源于 JavaScript 语言，但如今已被广泛用于各种编程语言中。JSON 使用了一种完全独立于编程语言的文本格式，但它使用了类似于 JavaScript 语言的约定。

JSON 的数据格式由两种结构组成。

1. **对象**：用花括号 `{}` 包裹，包含键值对。例如：

   ```json
   {
     "name": "John",
     "age": 30,
     "city": "New York"
   }
   ```

   在这个例子中，`name`、`age` 和 `city` 是键，每个键对应一个值。

2. **数组**：用方括号 `[]` 包裹，包含一组值。例如：

   ```json
   ["Apple", "Banana", "Cherry"]
   ```

   在这个例子中，数组包含三个字符串值：`Apple`、`Banana` 和 `Cherry`。

JSON 支持以下几种数据类型：

* **字符串**：用双引号括起来的文本。例如 `"Hello, world!"`。
* **数字**：整数或浮点数。例如 `42` 或 `3.14`。
* **对象**：键值对的集合，用花括号括起来。例如 `{"key": "value"}`。
* **数组**：值的有序集合，用方括号括起来。例如 `["value1", "value2"]`。
* **布尔值**：`true` 或 `false`。
* **空值**：`null`。

JSON 被广泛用于 web 开发和数据传输。它的主要优点包括：

* **轻量级**：相比 XML，JSON 更加简洁，数据量更小。
* **易于解析**：大多数编程语言都提供了用于处理 JSON 的库和方法，使其解析和生成都非常方便。
* **可读性强**：JSON 的结构简单明了，容易阅读和理解。

假设我们有一个简单的用户信息表单，用户输入姓名、年龄和城市后提交。这些数据可以被转换为 JSON 格式，发送到服务器进行处理。例如：

```json
{
  "name": "Alice",
  "age": 25,
  "city": "Los Angeles"
}
```

服务器接收到这个 JSON 对象后，可以解析并处理这些数据，完成用户信息的存储或更新。

### JSON 在 Coze 平台中的应用

在 Coze 平台中，JSON 被广泛用于插件参数设置和数据传输。比如，当我们在 Coze 平台上创建一个 Bot，并为其添加插件时，需要配置插件的输入输出参数。这些参数通常以 JSON 格式表示，确保数据的结构和内容能够被正确解析和处理。

**例子 1：设置插件参数**

在 Coze 平台上，假设我们添加了一个墨迹天气的查询插件，大模型会根据我们的提问配置对应的查询参数。具体的交互就是使用 JSON 格式来设置这些参数，以下是这个插件的详细输入参数信息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33e818bafc934d3d9a6dfeb47ae19350~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1542&h=212&s=52595&e=png&a=1&b=e8e8e8)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25c9c3e7ca1d490ab21c0f3d64f39e0e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1710&h=1516&s=246694&e=png&a=1&b=f5f7fa)

假设当用户提问`请问今天的北京天气如何？`，大模型就会根据用户的提问，理解后决定使用这个天气插件，然后提取出两个关键词：`北京`、`今天`。然后转换成输入参数能识别的 JSON 结果，如下：

```json
{
  "city": "Beijing",
  "start_time": "20240505"
}
```

这个 JSON 对象包含两个键值对：`city` 指定查询的城市地点，`start_time` 指定查询开始时间。

你可以留意到，上图中的输入参数的`必填`项都是非必填的，这样的设计是为了让用户更加自由地选择是否填写这些参数，用户只需按需填写即可。当然如果输入参数是一个必填项，那么用户就必须填写这个参数，不过这也是大模型帮你去填写，不用我们操心，我们只要知道这个原理就好了。

**例子 2：Bing 搜索**

假设我们要创建一个工作流，用于调用 Bing 搜索插件来获取指定搜索结果。我们先看看，对应这个插件需要什么输入参数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99d9198e96a04b25a7d1123b5308aca4~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=3576&h=1336&s=368195&e=png&a=1&b=f1f2f4)

这里需要三个输入参数，其实类比到大模型将我们的自然语言转换成对应的 JSON 数据请求，如下：

```json
{
  "count": 5,
  "query": "今天有什么最新的 AI 新闻？"
}
```

这里的`query`则是假设用户开始提问的自然语言，然后大模型将其转换成对应的 JSON 数据请求，然后发送给 Bing 搜索插件，然后插件返回对应的搜索结果。以下是具体演示结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64b1e663c96e43918d7194a3d22ec9c7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1280&h=628&s=64010&e=png&a=1&b=f6f6f9)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6519e2eb21ca49f3920543930ca196df~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=3228&h=2196&s=769973&e=png&a=1&b=f0f2f4)

但我看到的输入或输出数据结果不是 JSON 格式啊？没事，这只是平台优化了输出的样式给我们用户看而已，你可以点击下图中输入或者输出隔壁的`复制`图标，然后粘贴到你的编辑器中，你会看到对应的 JSON 数据格式，如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b07515557b75476592a9c96b1dd3783c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=2124&h=996&s=383548&e=png&a=1&b=f1f1f4)

输入：

```json
{
  "count": "5",
  "query": "今天有什么最新的 AI 新闻？"
}
```

输出（因篇幅有限，省略了其中一些数据结果）：

```json
{
  "code": 0,
  "data": {
    "webPages": {
      "value": [
        {
          "datePublished": "",
          "displayUrl": "https://ai-bot.cn/daily-ai-news",
          "snippet": "AI工具集每日更新AI行业的最新资讯、新闻、热点、融资、产品动态，让你随时了解人工智能领域的最新趋势、更新突破和热门大事件。 AI应用集 AI写作工具",
          "url": "https://ai-bot.cn/daily-ai-news/",
          "cachedPageUrl": "http://cncc.bingj.com/cache.aspx?q=%E4%BB%8A%E5%A4%A9%E6%9C%89%E4%BB%80%E4%B9%88%E6%9C%80%E6%96%B0%E7%9A%84+AI+%E6%96%B0%E9%97%BB%EF%BC%9F&d=4611304940784490&mkt=zh-CN&setlang=zh-CN&w=dyVq2wP2UdUw-tiNoGDwjxVidIq-DNyI",
          "datePublishedDisplayText": "",
          "id": "https://api.bing.microsoft.com/api/v7/#WebPages.0",
          "language": "zh_chs",
          "primaryImageOfPage": {
            "height": 0,
            "imageId": "",
            "thumbnailUrl": "",
            "width": 0
          },
          "thumbnailUrl": "",
          "dateLastCrawled": "2024-06-09T17:22:00Z",
          "name": "每日AI快讯、热点、动态、融资、产品发布 | AI工具集",
          "isFamilyFriendly": true,
          "isNavigational": true
        }
      ],
      "webSearchUrl": "https://www.bing.com/search?q=%E4%BB%8A%E5%A4%A9%E6%9C%89%E4%BB%80%E4%B9%88%E6%9C%80%E6%96%B0%E7%9A%84+AI+%E6%96%B0%E9%97%BB%EF%BC%9F",
      "totalEstimatedMatches": 11600000,
      "someResultsRemoved": true
    },
    "_type": "SearchResponse",
    "images": {
      "id": "",
      "readLink": "",
      "webSearchUrl": "",
      "isFamilyFriendly": false
    },
    "queryContext": {
      "originalQuery": "今天有什么最新的 AI 新闻？"
    },
    "rankingResponse": {
      "mainline": {
        "items": [
          {
            "answerType": "News",
            "value": {
              "id": "https://api.bing.microsoft.com/api/v7/#News"
            }
          }
        ]
      }
    },
    "videos": {
      "value": [
        {
          "contentUrl": "https://www.bilibili.com/bangumi/play/ep289483",
          "datePublished": "2024-04-02T16:00:00.0000000",
          "hostPageDisplayUrl": "https://www.bilibili.com/bangumi/play/ep289483",
          "width": 1656,
          "creator": {
            "name": "央视网"
          },
          "description": "央视网最有意思的原创短视频栏目，专注于解释热点，分享知识，阐述流行，把严肃新闻、晦涩知识和热搜话题一一“解剖”，让知识流动起来，回应年轻人的好奇心。任何事情，用正常的方式讲都很“无聊”，来“比划”一下？",
          "duration": "PT5M19S",
          "name": "比划：第108集 今天你看新闻了吗？",
          "embedHtml": "",
          "hostPageUrl": "https://www.bilibili.com/bangumi/play/ep289483",
          "publisher": [
            {
              "name": "bilibili"
            }
          ],
          "viewCount": 0,
          "encodingFormat": "mp4",
          "height": 1035,
          "thumbnail": {
            "height": 100,
            "width": 160
          },
          "thumbnailUrl": "https://tse2-mm.cn.bing.net/th?id=OVP.OnK_Ket-fsNMpXE4TszL6wIIFF&pid=Api",
          "webSearchUrl": "https://www.bing.com/videos/search?q=%E4%BB%8A%E5%A4%A9%E6%9C%89%E4%BB%80%E4%B9%88%E6%9C%80%E6%96%B0%E7%9A%84%20AI%20%E6%96%B0%E9%97%BB%EF%BC%9F&view=detail&mid=A9B1B240C84114F4EBCFA9B1B240C84114F4EBCF",
          "allowMobileEmbed": false,
          "allowHttpsEmbed": false,
          "isSuperfresh": false
        }
      ],
      "webSearchUrl": "https://www.bing.com/videos/search?q=%E4%BB%8A%E5%A4%A9%E6%9C%89%E4%BB%80%E4%B9%88%E6%9C%80%E6%96%B0%E7%9A%84+AI+%E6%96%B0%E9%97%BB%EF%BC%9F",
      "id": "https://api.bing.microsoft.com/api/v7/#Videos",
      "readLink": "https://api.bing.microsoft.com/api/v7/videos/search?q=%E4%BB%8A%E5%A4%A9%E6%9C%89%E4%BB%80%E4%B9%88%E6%9C%80%E6%96%B0%E7%9A%84+AI+%E6%96%B0%E9%97%BB%EF%BC%9F",
      "scenario": "List",
      "isFamilyFriendly": true
    }
  },
  "log_id": "202406101456135DFC496359DA858A1FB2",
  "msg": "success",
  "response_for_model": "["每日AI快讯、热点、动态、融资、产品发布 | AI工具集\
AI工具集每日更新AI行业的最新资讯、新闻、热点、融资、产品动态，让你随时了解人工智能领域的最新趋势、更新突破和热门大事件。 AI应用集 AI写作工具\
link:https://ai-bot.cn/daily-ai-news/","澎湃新闻 - 推理性能提升30倍！英伟达发布史上最强AI芯片 ...\
在两个小时的演讲中，黄仁勋围绕五大板块，介绍了英伟达的最新研发进展：新的产业发展、Blackwell平台、创新软件NIMs、AI平台NEMO和AI工坊（AI foundry）服务，以及仿真平台Omniverse和适用于自主移动机器人的Isaac Robotics平台。\
link:https://www.thepaper.cn/newsDetail_forward_26730539\
datePublished:2024-03-19T08:00:00.0000000","阿里、腾讯、百度发布 AI 最新进展；谷歌下一代大模型 ...\
AI 圈今天都发生了什么？. 速览：. 阿里达摩院发布癌症通用模型，可辅助诊断八种主流癌症. 抖音、火山引擎、中国电影资料馆将利用“AI + 人工”修复经典香港电影. 腾讯云智能推出基于大模型的文案创作工具. 阿里大文娱 CTO 郑勇：妙鸭相机将并入新 ...\
link:https://new.qq.com/rain/a/20230817A076GL00\
datePublished:2023-08-17T08:00:00.0000000","李飞飞、吴恩达开年对话：AI 寒冬、2024新突破、智能体 ...\
李飞飞、吴恩达畅谈 2024 AI 趋势。. 在人工智能发展史上，2023 已经成为非常值得纪念的一年。. 在这一年，OpenAI 引领的 AI 大模型浪潮席卷了整个科技领域，把实用的 AI 工具送到了每个人手里。. 但与此同时，人工智能的发展也引起了广泛的讨论和争议，尤其在 ...\
link:https://www.thepaper.cn/newsDetail_forward_26097944\
datePublished:2024-01-23T08:00:00.0000000","人工智能_人工智能最新资讯_CNMO\
百川智能发布Baichuan 4及首款 AI 智能助手“百小应”. 2024-05-22. 【CNMO科技消息】5月22日，百川智能发布最新一代基座大模型Baichuan4，并推出成立之后的首款AI助手“百小应”。. Baichuan4相较Baichuan3在各项能力上均有极大提升，其中通用能力提升超过10%，数学和代码 ...\
link:https://ai.cnmo.com/\
datePublished:2024-05-27T08:00:00.0000000"]"
}
```

通过这种方式，我们可以确保每个步骤的数据输入和输出都是结构化的，便于调试和维护。

## Markdown：轻量级标记语言

Markdown 是一种轻量级标记语言，旨在使文本内容易于编写和阅读，同时可以转换为结构化的格式（如 HTML）。它由 John Gruber 于 2004 年创建，最初目的是让写作 Web 内容变得更简单。Markdown 的语法非常简洁，只需要使用简单的标记符号，就可以实现文本的格式化。

Markdown 使用特定的符号和字符来表示不同的格式，例如标题、列表、链接、图片等。以下是一些常用的 Markdown 语法及对应的图示效果：

1. **标题**：使用 `#` 符号表示标题，数量表示标题级别。例如：

   ```markdown
   # 一级标题

   ## 二级标题

   ### 三级标题
   ```

   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce2a2c95e9874cb3b713f482f52a829c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=636&h=646&s=39087&e=png&a=1&b=ffffff)

2. **列表**：

   * 无序列表使用 `-` 或 `*` 符号。例如：
     ```markdown
     - 项目一
     - 项目二
     - 项目三
     ```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b1b08394b454612b46552eed4bc7578~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=364&h=358&s=17765&e=png&a=1&b=ffffff)
   * 有序列表使用数字加句点。例如：
     ```markdown
     1. 第一项
     2. 第二项
     3. 第三项
     ```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe69182d6c2d4e1e8385dee16de352cf~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=360&h=324&s=20557&e=png&a=1&b=fefefe)

3. **加粗和斜体**：

   * 加粗使用双星号 `**` 或双下划线 `__` 括起来。例如：`**加粗文本**` 或 `__加粗文本__`。
   * 斜体使用单星号 `*` 或单下划线 `_` 括起来。例如：`*斜体文本*` 或 `_斜体文本_`。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eac0b9bebd194287b1f62736f2f7191a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=346&h=246&s=19038&e=png&a=1&b=fefefe)

4. **链接**：使用方括号加圆括号表示。例如：

   ```markdown
   [链接文字](https://www.example.com)
   ```

   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66ce437bca4d4169b5a436e1d68ff2d3~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=450&h=214&s=21965&e=png&a=1&b=fffefe)

5. **图片**：使用感叹号加方括号和圆括号表示。例如：

   ```markdown
   ![图片描述](https://www.example.com/image.jpg)
   ```

   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c30c98bc342549beb6b723110e85e10e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1244&h=1222&s=667519&e=png&a=1&b=fcfcfe)

Markdown 被广泛用于编写文档、博客文章、README 文件等。它的主要优点包括：

* **易读易写**：相比 HTML，Markdown 的语法更加简洁明了，更易于阅读和编写。
* **可转换性强**：Markdown 可以很容易地转换为 HTML 或其他格式，适用于各种文本编辑和发布场景。
* **兼容性好**：许多平台和工具都支持 Markdown，用户可以在不同环境中无缝使用。

假设我们需要编写一篇关于 Markdown 的教程，可以使用以下 Markdown 语法来创建结构化的文档：

```markdown
# Markdown 教程

## 什么是 Markdown？

Markdown 是一种轻量级标记语言，旨在使文本内容易于编写和阅读，同时可以转换为结构化的格式（如 HTML）。

## 基本语法

### 标题

使用 `#` 符号表示标题，数量表示标题级别。

### 列表

- 无序列表使用 `-` 或 `*` 符号。
- 有序列表使用数字加句点。

### 加粗和斜体

- **加粗** 使用双星号 `**` 或双下划线 `__` 括起来。
- _斜体_ 使用单星号 `*` 或单下划线 `_` 括起来。

### 链接和图片

- 链接使用方括号加圆括号表示。
- 图片使用感叹号加方括号和圆括号表示。
```

这是文档的预览效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/386c7d47beb148d78915ef28cf71e289~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1762&h=1530&s=218145&e=png&a=1&b=fefefe)

### Markdown 在 Coze 平台中的应用

在 Coze 平台上，Markdown 被广泛用于撰写和格式化文本内容。**用户可以使用 Markdown 来编写或定义 Bot 的回复内容、说明文档、开场白甚至是人设与回复逻辑等**。

**例子 1：编写 Bot 的开场白**

假设我们在 Coze 平台上创建了一个 FAQ Bot，用于回答用户的常见问题。我们可以使用 Markdown 来编写开场白，使其更加清晰和结构化。例如：

```markdown
# 你好，我是 FAQ Bot！

很高兴见到你！我是一个专门为回答常见问题而设计的智能助手，随时准备为你提供准确、详细的解答。

## 我的技能

### 回答常见问题

1. **快速响应**：你有任何疑问，我会迅速从丰富的知识库中找到答案，确保信息准确无误。
2. **智能搜索**：如果遇到知识库中没有的问题，我会利用强大的搜索工具，为你整理出最佳的解决方案。

## 我的特点

- **专注可靠**：我只专注于回答与你的问题相关的内容，避免无关讨论。
- **信息透明**：我所有的回答都基于可靠的知识库和搜索结果，从不编造信息。
- **易于理解**：我会用清晰、简洁的语言，确保你能轻松理解我的回答。
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc8a920b29d44a6da4852a38e95a77b7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=2340&h=2264&s=615850&e=png&a=1&b=fdfdfd)

**例子 2：定义工作流的输出结果**

假设我们在 Coze 平台上创建了一个旅行规划 Bot，用于根据我指定的旅行地点来推送我相关的旅行攻略。我们可以使用 Markdown 来定义工作流的输出结果，使其更加易读和清晰（记得前提是工作流的最终输出区块需要选择`使用设定的内容直接回答`的回答模式才能生效）。例如：

```markdown
## 旅游攻略推荐

{{default_llm_output}}

## 目的地附近酒店推荐

{{hotels_info}}

## 目的地天气情况

{{weathers}}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80077998082742198ba7cd70e4986465~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1296&h=1682&s=252958&e=png&a=1&b=fcfcfc)

对了，`{{}}`括号的内容是工作流处理后的输入参数，方便我们在 Markdown 中引用，这样我们就可以在 Markdown 中引用工作流的输出结果，这里细节我会在后续的文章中详细介绍。

最后我们来看看演示结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e2a2c74a0a14b658a7254d3118ada10~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1618&h=2648&s=624704&e=png&a=1&b=f6f6f9)

你会发现，经过调用这个工作流的输出结果，它是完全按照我们指定的 Markdown 格式输出的，这样就可以更加方便地展示我们的数据结果和增加可读性了。

## 总结

JSON 和 Markdown 是现代软件开发中不可或缺的工具。通过本文的介绍，我们深入探讨了这两个工具的概念、结构、常用语法以及它们在 Coze 平台中的具体应用。通过实际案例，我们展示了如何利用 JSON 和 Markdown 来配置插件参数、处理动态数据、创建结构化的文档和帮助信息，从而提升 Bot 的开发效率和用户体验。

### JSON 的重要性

JSON 作为一种轻量级的数据交换格式，被广泛应用于客户端和服务器之间的数据传输。它的轻量级、易于解析和高度兼容性，使其成为跨平台数据交换的理想选择。在 Coze 平台中，JSON 被广泛用于配置插件参数和复杂的工作流，确保数据的结构化和一致性。

### Markdown 的重要性

Markdown 作为一种轻量级标记语言，以其简洁的语法和良好的可读性，成为编写文档和笔记的首选工具。它可以很容易地转换为 HTML、PDF 等多种格式，适用于各种发布场景。在 Coze 平台中，Markdown 被用于撰写和格式化文本内容，使用户能够轻松创建清晰、结构化的文档和帮助信息，提升用户体验和操作效率。

通过结合 Coze 平台的功能，我们看到 JSON 和 Markdown 在实际应用中的广泛应用和重要性。希望本文能帮助技术小白全面理解这两个工具，并在实际开发和使用中充分发挥它们的优势。无论是数据传输还是文本处理，这两个工具都将继续在软件开发中发挥关键作用。无论你是开发者还是普通用户，掌握 JSON 和 Markdown 都将大大提升你的工作效率和信息处理能力。

**最后，记住：**

* **JSON** 帮助我们高效地进行数据交换和配置，确保数据的准确性和一致性。
* **Markdown** 让我们能够快速编写和格式化文档，提高文本内容的可读性和发布效率。

## 延伸阅读

具体系统化的 JSON 和 Markdown 语法和用法，可以参考以下教程文档进行学习：

* [JSON 教程](https://www.runoob.com/json/json-tutorial.html "https://www.runoob.com/json/json-tutorial.html")
* [Markdown 教程](https://www.runoob.com/markdown/md-tutorial.html "https://www.runoob.com/markdown/md-tutorial.html")