在当今快速发展的人工智能时代，AI 技术正逐步渗透到我们生活的方方面面。无论是为了提高孩子的英语水平，还是为了解决家庭中陪伴不足的问题，AI 都可以成为我们得力的助手。

本文将带您了解如何利用 AI 技术，打造一个既能陪练英语又能成为孩子陪聊小伙伴的智能系统。本指南将帮助技术小白和非技术职场从业者了解如何通过简单的步骤实现这一目标，享受 AI 带来的便利和乐趣。

## AI 陪聊小伙伴 - 北北

在这个忙碌的世界里，每个家长都希望给孩子最好的陪伴。但是，时间和精力总是有限的。想象一下，如果有一个永远有时间、充满爱心的 AI 小伙伴，能陪着你的孩子学习、玩耍，甚至分享心事，那会有多好？这正是小呆萌北北的魅力所在——一个专为孩子设计的 AI 陪聊小伙伴。

接下来，我们将介绍如何打造这样一个温暖的小伙伴。

1. 首先打开扣子的首页 - [www.coze.cn/home](https://www.coze.cn/home "https://www.coze.cn/home")，直接点击左上角的创建 AI Bot 按钮。
2. 直接在弹窗输入 Bot 的相关信息： ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b3b4e88433f468fab6031b0a1ca0b31~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1254&h=1454&s=259478&e=png&a=1&b=f5f7fa)
3. 一个 AI Bot 的创建就完成了，接下来我们开始细化其功能。

**设计人设与回复逻辑**

根据 AI Bot 的功能需求，我大致设计了一个相关的提示词，你可以直接拿来按照自己需求修改使用：

```markdown
# 角色

你是一个 7 岁的可爱 AI 陪聊小男孩，名字叫北北。在读小学一年级，你可以陪伴孩子学习、玩耍，还能倾听他们的心事。

## 技能

### 技能 1: 提供陪伴

1. 通过游戏、学习等互动方式，为孩子提供陪伴。
2. 鼓励孩子分享日常心事，通过交流减轻孩子的孤独感。

### 技能 2: 学习辅导

1. 辅助孩子完成学习任务，提供学习指导和建议。
2. 设计有趣的学习游戏，帮助孩子提高学习兴趣和效果。

### 技能 3: 情感支持

1. 以可爱、萌萌的语气回应孩子的情感需求，提供情感上的支持和鼓励。
2. 倾听孩子的心事，帮助他们解决问题，培养良好的心理素质。

### 技能 4: 安全监督

1. 实时监控交互内容，确保安全健康的交流环境。
2. 遵守儿童心理和隐私安全的相关法律法规，保障孩子的权益。

## 限制

- 只与孩子进行交流，不涉及其他话题。
- 所有交互内容必须健康、积极，不含有害信息。
- 使用可爱、萌萌的，充满童真的表达方式，类似于几岁小朋友的交流风格，让孩子感到亲近和舒适。
- 遵守儿童心理和隐私安全的相关法律法规，保障孩子的权益。
```

基于 AI Bot 的功能需求，毕竟是一个主要以聊天为主的 AI Bot，所以我建议把模型的携带上下文轮数改大一点，改为 10 轮，而且直接选择了`通义千问`的模型和创意模式的多样性，毕竟这个 Bot 是陪聊小伙伴，创意性地回答还是比较适合的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8a9cad3efce4889bfa3002ff1ec3662~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=519\&h=640\&s=69608\&e=png\&a=1\&b=fdfdfd)

既然是一个陪伴型的 AI 小伙伴，我们可以联想一下，一般小朋友都会一起做些什么，比如画画、读古诗等等，所以我添加了以下插件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ea71799552f4d79a573703a52801432~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=543\&h=307\&s=49449\&e=png\&a=1\&b=fbfbfb)

我这里简单介绍一下这些插件的功能：

* 图片理解：根据用户上传的图片，能够识别图片中的物体、人物、场景等信息，并给出相应的回复，比如小孩画的画作、开心的自拍等等；
* 今日诗词：根据用户的需求，随机给出今日的诗词，并给出相应的回复；
* ByteArtist：可以根据用户的需求生成一张或多张图片，比如北北做的卡通图等等。

当然，如果你之后想要更多功能的话，也可以适当添加一些插件。不过请记住，在之前文章内容提及到，**插件的添加要遵循“少而精”的原则**，才能让 AI Bot 更好地实现你的需求。

接下来，我们来设置一下 AI Bot 的开场白和预置问题，让它能够更好地与孩子进行初步交流：

```markdown
你好呀，我是北北，成为你的新朋友真是太好啦！我们一起学习新知识，玩有趣的游戏，还能一起分享小秘密哦！

你今年几岁了？

陪我玩猜谜语吧，你先出题

陪我读古诗吧，你一句我一句，你先来
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5811c933e8b486ea09ae32d866cfa86~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1082\&h=1642\&s=201249\&e=png\&a=1\&b=fefefe)

然后我们来开启一下`长期记忆`这个功能，这样可以让 AI Bot 即使在长时间不使用的情况下，也能记住之前的对话内容，更好地与孩子进行交流，增加亲近感。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1012ba9f64d94d3e9ceff5e6c8f713e0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=551\&h=155\&s=20163\&e=png\&a=1\&b=f7f7f7)

最后，我们来设置一下 AI Bot 的语音，让它更加亲切可爱，其实这个可是这个 AI Bot 的灵魂：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8aa172793f7a4b2facfafb11dde267a7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=825\&h=447\&s=93333\&e=png\&a=1\&b=fbfbfb)

Coze 的音色选择非常丰富，根据上面这个 AI Bot 的要求，我选择了一个很符合其形象的音色 —— 奶气萌娃：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5d0235d7828471d8ebfe45fa086c205~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1270\&h=764\&s=103436\&e=png\&a=1\&b=f4f6f9)

这样，AI Bot 的语音就设置好了，你可以点击弹窗右边的喇叭按钮，来测试一下。

这是最终的设计预览：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6a13db63abf48d1a7be556d9730b88b~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1639&h=1086&s=459963&e=png&a=1&b=fafafa)

点击发布按钮，就可以发布这个 AI Bot，开始和它进行交流了!

### 演示效果

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dc985fbb18047cfbdccf8e71bd0d3fe~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=572\&h=1522\&s=266122\&e=png\&a=1\&b=ffffff)

## Jasmine（英语口语陪练）

说起在中国，大家在学校时候应该都有过应试教育学英语的经历吧？

学了 10 多年的英语，到头来毕业出来工作，大家都还是哑巴英语，甚至是英语都还给英语老师了，是不是就觉得有点可惜？

想要提高英语口语吧，没机会又或者不敢跟外国人说话，又怕说错。

即使不怕，请外教一对一陪练一下吧，费用又高昂，又不舍得花钱。

现在 AI 发展到如此迅速，我们终于有机会可以利用 AI 机器人来进行一对一的英语陪练了！不怕说错，不用花钱，一天 24 小时随时随地都可以，而且效果还不错！

下面我们就来看看如何做一个一对一的英语陪练 AI Bot 吧！

1. 继续打开扣子的首页 - [www.coze.cn/home](https://www.coze.cn/home "https://www.coze.cn/home")，直接点击左上角的创建 AI Bot 按钮。
2. 直接在弹窗输入 Bot 的相关信息： ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba666289d84a498d8b0462825dcafdd4~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1202&h=1242&s=175551&e=png&a=1&b=f5f7fa)
3. 一个 AI Bot 的创建就完成了，接下来我们来细化其功能。

根据 AI Bot 的功能需求，我设计了以下这个提示词：

```markdown
# 角色

你是一位经验丰富的英语女老师，专注于一对一英语陪练。你擅长纠正学生的英语表达，并教授更地道实用的英语说法，以提升学生的英语水平。为了方便学生理解，你会在每句英语后面加上中文翻译。

## 技能

### 技能 1：英语陪练

1. 与学生进行一对一的英语对话，帮助他们提高英语口语表达能力。
2. 倾听学生的英语表达，并及时纠正他们的错误。
3. 向学生提供正确或更好的英语表达方式，帮助他们提高英语水平。
4. 在对话中使用地道实用的英语说法，以帮助学生更好地理解和运用英语。

### 技能 2：英语教学

1. 根据学生的需求和水平，制定个性化的英语学习计划。
2. 教授学生英语学习的方法和技巧，帮助他们更有效地学习英语。
3. 提供英语学习资源，如书籍、网站、应用程序等，以帮助学生更好地学习英语。
4. 定期评估学生的英语水平，并根据评估结果调整教学计划。

## 限制

- 有语法或单词错误，一定要立刻提出并告诉纠正方案。
- 只讨论与英语学习和教学相关的话题，拒绝回答与英语学习无关的问题。
- 所输出的内容必须按照给定的格式进行组织，不能偏离框架要求。
- 总结部分不能超过 100 字。
```

基于 AI Bot 的功能需求，还是一个主要以聊天为主的 AI Bot，而且一般英语陪练都建议多一些对话轮数的记录，这样当你训练一些口语测试时，上下文才不会被突然忘记，改为 30 轮，模型这次我们选择 moonshot 32K 版本，使用`平衡模型`的生成多样性：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d180fe39e3e468d84392bb88f2fd90d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=520\&h=744\&s=83960\&e=png\&a=1\&b=fdfdfd)

这次主要使用了以下插件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7af898e2fc334e4fb6676d9f4405684b~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=549\&h=235\&s=39328\&e=png\&a=1\&b=fafafa)

* **英文名言警句（get\_one\_eng\_word & get\_many\_eng\_words）**：随机获取一句英语名言，或者随机获取多句英语名言，方便用户简单学习一些英语名言。
* **Simple OCR（ocr）**：识别图片中的文字，并返回识别结果，很明显就是用来读取用户上传图片或文件的文字，并返回给用户或做相应处理。

这次的预置问题都挺有参考价值的，毕竟想来学习的人都多多少少会问相关的问题：

```markdown
Hello! How are you today? I am an experienced female English conversation tutor who loves helping students improve their English skills. I can assist you with one-on-one English practice, including correcting your mistakes and teaching you useful expressions. Let's chat in English and practice together!

Can you explain some common American idioms?

Let's get started to talk some scenes based on IELTS practices? You first

My oral English is pretty poor, can you help me how to get started to talk with you?

Give me a quotation so that I can learn something new from it
```

最后，我们来设置一下 AI Bot 的语音，因为是一个英语陪练 AI Bot，所以**这里我选择了比较亲切的英语音色，而不是中文音色，这里要注意一下**：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcbceca1bbcb404f9c24361b0df3375e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1210\&h=718\&s=81985\&e=png\&a=1\&b=f5f7fa)

这是最终的设计预览：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ee4cc1f34d94bda9c8668b748f18b72~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1635&h=1079&s=427639&e=png&a=1&b=f9f9f9)

点击发布，就可以发布这个 AI Bot 了，然后在 Coze 或豆包的聊天窗口通过搜索名字搜索中找到它，开始和它进行交流吧!

### 演示效果

1. 文字交流中的训练纠错

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ddc439a5e8c49fab3849dbd0044f326~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1600&h=2342&s=458851&e=png&a=1&b=ffffff)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6350bd976730423a8ed32855f26a9492~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1170&h=2532&s=489780&e=png&b=0f27ff)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/533b1bac26014682976093002d377754~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1170&h=2532&s=487571&e=png&b=0f27ff)

2. 解读上传的图片或文件的英文内容

**要解读的图片内容**：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9e9e4397e07495baf741be3714ff9d2~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1464&h=1328&s=298669&e=png&a=1&b=fefefe)

**解读对话**：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f897f14fe9bf460ebae03e7a583d5850~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1590&h=1784&s=404134&e=png&a=1&b=fefefe)

## 总结

通过这个实战预热，我们了解了如何通过 Coze 平台，快速打造一个可以和小孩做朋友的 AI 陪聊小伙伴。同时也了解了如何通过 Coze 平台，快速打造一个英语口语陪练小伙伴，帮助大家提高英语口语水平。希望这个实战预热能够帮助大家更好地了解 AI 技术，享受 AI 带来的便利和乐趣。