还记得小时候，我们常常被老师告诫要“好好反思”吗？没想到，这个在我们成长过程中如此重要的概念，如今竟然成为了人工智能(AI)世界里的一个重要设计模式！是的，你没听错，AI 也需要`反思`。

最近，AI 界的`网红教授`吴恩达提出了四种 AI Agent 设计模式，其中就包括我们今天要聊的主角 —— **Reflection（反思）模式**。这个模式不仅让 AI 变得更`聪明`，还让它的表现更加出色。想象一下，如果你的 AI 助手能够像人类一样，不断审视自己的回答，并加以改进，那会是多么令人兴奋的事情啊！

今天，就让我们一起来探索这个神奇的 Reflection 模式，看看它是如何在 Coze 工作流中发挥作用的。相信我，即使你不是技术专家，也一定能从中获得启发，说不定还能激发你在生活中的一些新想法呢！

## Reflection 模式是什么？

首先，让我们用一个简单的类比来理解 Reflection 模式。假设你正在准备一场重要的演讲。你可能会先写出一份演讲稿，然后对着镜子练习几遍。在这个过程中，你会发现一些不流畅的地方，或者有些表达可能不够准确。于是，你会不断修改和完善，直到你对整个演讲满意为止。

这就是 **Reflection 模式的核心思想 —— 自我审视和持续改进**。

你可能会问，为什么 AI 需要`反思`呢？难道它不是已经很聪明了吗？

确实，现代 AI 系统已经非常强大。但是，就像人类一样，AI 也会犯错。有时候，它可能会给出不准确或不恰当的回答。更重要的是，AI 的输出可能缺乏连贯性，或者无法很好地适应特定的上下文。

Reflection 模式正是为了解决这些问题而生的。通过让 AI `反思`自己的输出，我们可以：

1. **提高准确性**： AI 可以检查自己的回答是否有误，并进行修正。
2. **增强连贯性**： 让 AI 的回答更加有逻辑，前后一致。
3. **改善上下文适应性**： 使 AI 的输出更好地符合特定场景的需求。
4. **持续学习和改进**： AI 可以从每次的`反思`中学习，不断提升自己的能力。

## 案例分析： AI 编程中的 Reflection 模式应用

吴恩达教授在他的演讲中特别强调了 Reflection 模式在编程领域的应用，这为我们提供了一个绝佳的案例来理解这个模式的强大之处。

首先，我们要求 AI 编写一段特定功能的代码。比如，我们可能会说：`请写一个计算斐波那契数列的 Python 函数。`

AI 可能会生成如下初始代码：

```python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)
```

这时，Reflection 模式开始发挥作用。AI 会给自己一个额外的指令，类似于：

```txt
检查此段代码的正确性，告诉我如何修改。考虑以下几点：

1. 代码是否能正确实现斐波那契数列的计算？
2. 有没有潜在的性能问题？
3. 代码的可读性如何？
4. 是否需要添加错误处理？
```

基于自我审视的结果，AI 可能会发现初始代码虽然正确，但在处理 n 的数值大时，效率会较低。于是，它可能会给出如下改进建议：

“初始代码正确实现了斐波那契数列的计算，但对于大的 n 值，递归方法可能会导致栈溢出。我们可以使用动态规划来优化性能。此外，我们应该添加输入验证来提高代码的健壮性。以下是优化后的代码：”

```python
def fibonacci(n):
    if not isinstance(n， int) or n < 0:
        raise ValueError(`n must be a non-negative integer`)
    if n <= 1:
        return n
    a， b = 0， 1
    for _ in range(2， n + 1):
        a， b = b， a + b
    return b
```

通过这种方式，AI 不仅能够生成代码，还能自我审视和改进，从而提高代码的质量和性能。

吴恩达教授还提到了一种有趣的变体 —— **多智能体 Reflection 模式**。在这种模式下，我们可以使用两个 AI 智能体：一个负责编写代码，另一个负责调试和提供改进建议。

例如：

智能体 A（编码者）：生成初始代码。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28523d304f9f4170ae3b9121224b2870~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1080&h=598&s=223766&e=png&b=fafdfa) 智能体 B（调试者）：检查代码，提供改进建议。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e24b335b2d16434086b612c5f9ea7e1e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1080&h=599&s=265473&e=png&b=f9fdf9) 智能体 A：根据建议修改代码。 智能体 B：再次检查，如此往复。

这种方法的优势在于，它模拟了现实世界中程序员之间的代码审查过程，可能会带来更多样化和全面的改进建议。

## Coze 工作流实战：AI 反思提升翻译质量

也在最近，吴恩达教授也开源了一个基于 AI 原理的翻译项目，项目地址是 [github.com/andrewyng/t…](https://github.com/andrewyng/translation-agent "https://github.com/andrewyng/translation-agent") 。这个项目虽然是纯代码实现，但是其背后的设计原理非常值得我们借鉴。**最关键的是，通过该项目所采用的反思优化机制，可以显著提升 AI 翻译的质量，效果非常惊艳！**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8512f1ed3cb413b9de067ee45697676~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=2350&h=1568&s=584966&e=png&a=1&b=ffffff)

接下来，就让我们一起来剖析一下，如何在 Coze 上复刻吴恩达的 AI 翻译项目，打造一个高质量的翻译助手。

首先，我们来了解一下吴恩达这个 AI 翻译项目的核心流程和原理。整个流程可以分为三个步骤：

1. **初始翻译**
2. **识别可优化点**
3. **对初始结果进行优化**

先说**初始翻译**，这一步其实就是用现有的 AI 翻译模型，对源语言文本进行一次翻译，得到一个初始的目标语言文本。这个结果一般来说质量已经不错了，但是其实还有不少的提升空间。

接下来是**识别可优化点**，这一步至关重要！通过 AI 模型分析初始翻译结果，找出其中值得改进的地方，比如用词不当、语序不自然、语义不够准确等等。找出这些“短板”，为下一步优化打下基础。

最后一步，**对初始结果进行优化**。我们再次调用 AI 模型，针对前一步识别出的可优化点，对初始翻译进行修修补补，润色打磨，让翻译变得更加流畅、准确、地道！

当然，除了这个反思优化的核心机制，吴恩达的项目还引入了一些其他创新点，比如**分块处理**和**语言习惯指定**。

**分块处理**就是将长文本拆分成若干个小块，分别进行翻译和优化，这样不仅可以提高处理效率，更重要的是可以让模型在局部文本上进行更精细的优化，翻译质量可以进一步提升。

而**语言习惯指定**，则是让模型根据目标语言的国别和地区，生成更符合当地语言习惯的翻译，比如对于英语翻译，可以指定是美式英语还是英式英语。这种对目标语言文化习惯的考虑，可以让翻译结果更加贴合目标读者，减少文化隔阂，是一个很贴心的设计。

### 复刻步骤

首先，我们在 Coze 上新建一个工作流，逐步导入吴恩达项目的核心流程。整个工作流分为若干个节点，每个节点完成一个特定的任务。通过将这些节点组合起来，就形成了一个完整的翻译流程。

我们先来看看导入后的整体工作流，以及它的测试效果。我们可以看到，工作流被分为了初始翻译、反思优化、结果输出几个主要部分，每一部分都对应了若干个节点。当我们运行测试的时候，可以清晰地看到每个节点的执行过程和结果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ccbfc6b5f0a483a83e0a2714b44346f~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=4452&h=2100&s=985144&e=png&a=1&b=f2f3f5)

给大家展示一下测试的效果，我们输入一段英文，让工作流自动翻译成中文。这样一对比，**优化后的翻译感觉就好多了，语句通顺了很多，用词也更加准确贴切，整体的翻译质量有了不少的提升。**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1764a593de64452da83373f3975b4bad~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1590&h=1628&s=360909&e=png&a=1&b=ffffff)

接下来，我就对每个节点的配置做一个核心讲解，让大家学会如何根据自己的需求来定制翻译流程。

1. 首先是`开始`节点，在这里我们需要选择翻译的源语言和目标语言，比如英语到中文。我们还可以设置一些其他参数，比如翻译的语言特色等，这个参数会影响翻译的效果和效率，不过我将其作为可选选项，建议根据实际情况进行调整。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d951d3a3c66444a285d561dd4f3d07f7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1768&h=1020&s=174512&e=png&a=1&b=fbfbfb)

2. 接下来是初步的翻译`大模型`节点，这里我们需要选择一个大模型，来对源语言文本进行初始翻译，这样才好对比并且以此作为进一步的反思优化。Coze 平台提供了多种 AI 大模型选择，这里我直接选了`MiniMax`，然后提示词我们就直接参考吴恩达教授的相关内容即可。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f64c0b8de8254d1f9dfb5d35273db5c9~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1576&h=1766&s=267336&e=png&a=1&b=fbfbfb)

提示词：

```txt
This is an {{source_lang}} to {{target_lang}} translation, please provide the {{target_lang}} translation for this text.
Do not provide any explanations or text apart from the translation.
{{source_lang}}: {{source_text}}

{{target_lang}}:
```

3. 接下来就是`选择器`节点，因为我们需要判断用户填写的要求中有没有需要特别的语言翻译特色或者口音，如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e415503edd3e4043921b1f29a23c74f5~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=2142&h=2768&s=788914&e=png&a=1&b=f1f2f4)

4. 然后就是核心的反思优化的`大模型`节点，这里我们需要配置反思优化的提示词，告诉模型应该如何去思考和优化翻译结果，并将这些建议都提出来。提示词的设计非常关键，直接决定了反思优化的效果。我们可以继续参考项目给出的示例提示词，也可以根据自己的经验和需求进行改进。这里我就先参考示例提示词进行填写，具体分为两个提示词，如下：

没有语言翻译特色的反思优化的提示词：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8518f83496b14e6181afbb2afae6cf49~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1388&h=2494&s=463947&e=png&a=1&b=fcfcfc)

```txt
Your task is to carefully read a source text and a translation from {{source_lang}} to {{target_lang}}, and then give constructive criticism and helpful suggestions to improve the translation.The source text and initial translation, delimited by XML tags <SOURCE_TEXT></SOURCE_TEXT> and <TRANSLATION></TRANSLATION>, are as follows:


<SOURCE_TEXT>
{{source_text}}
</SOURCE_TEXT>


<TRANSLATION>
{{translation_1}}
</TRANSLATION>


When writing suggestions, pay attention to whether there are ways to improve the translation's
(i) accuracy (by correcting errors of addition, mistranslation, omission, or untranslated text);
(ii) fluency (by applying {{target_lang}} grammar, spelling and punctuation rules, and ensuring there are no unnecessary repetitions);
(iii) style (by ensuring the translations reflect the style of the source text and takes into account any cultural context);
(iv) terminology (by ensuring terminology use is consistent and reflects the source text domain; and by only ensuring you use equivalent idioms {{target_lang}}).


Write a list of specific, helpful and constructive suggestions for improving the translation.
Each suggestion should address one specific part of the translation.
Output only the suggestions and nothing else.
```

有语言翻译特色的反思优化的提示词：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92a389df943b482793423f15baa5ea69~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1394&h=2644&s=498117&e=png&a=1&b=fcfcfc)

```txt
Your task is to carefully read a source text and a translation from {{source_lang}} to {{target_lang}}, and then give constructive criticism and helpful suggestions to improve the translation. The final style and tone of the translation should match the style of {{target_lang}} colloquially spoken in {{country}}.


The source text and initial translation, delimited by XML tags <SOURCE_TEXT></SOURCE_TEXT> and <TRANSLATION></TRANSLATION>, are as follows:


<SOURCE_TEXT>
{{source_text}}
</SOURCE_TEXT>


<TRANSLATION>
{{translation_1}}
</TRANSLATION>


When writing suggestions, pay attention to whether there are ways to improve the translation's
(i) accuracy (by correcting errors of addition, mistranslation, omission, or untranslated text);
(ii) fluency (by applying {{target_lang}} grammar, spelling and punctuation rules, and ensuring there are no unnecessary repetitions);
(iii) style (by ensuring the translations reflect the style of the source text and takes into account any cultural context);
(iv) terminology (by ensuring terminology use is consistent and reflects the source text domain; and by only ensuring you use equivalent idioms {{target_lang}});


Write a list of specific, helpful and constructive suggestions for improving the translation.
Each suggestion should address one specific part of the translation.
Output only the suggestions and nothing else.
```

5. 接下来就是结合反思优化的建议后再翻译的`大模型`节点了，这里其实就是结合上述的反思优化的建议，再结合初始翻译的结果再次进行翻译，以此获得更好的翻译结果，如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93b5f8e952e341c2858d5a02dbd5f1c1~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=1416&h=2682&s=469520&e=png&a=1&b=f6f6f6)

相关提示词：

```txt
Your task is to carefully read, then edit, a translation from {{source_lang}} to {{target_lang}}, taking into account a list of expert suggestions and constructive criticisms.


The source text, the initial translation, and the expert linguist suggestions are delimited by XML tags <SOURCE_TEXT></SOURCE_TEXT>, <TRANSLATION></TRANSLATION> and <EXPERT_SUGGESTIONS></EXPERT_SUGGESTIONS> as follows:


<SOURCE_TEXT>
{{source_text}}
</SOURCE_TEXT>


<TRANSLATION>
{{translation_1}}
</TRANSLATION>


<EXPERT_SUGGESTIONS>
{{reflection}}
</EXPERT_SUGGESTIONS>


Please take into account the expert suggestions when editing the translation. Edit the translation by ensuring:


(i) accuracy (by correcting errors of addition, mistranslation, omission, or untranslated text);
(ii) fluency (by applying {{target_lang}} grammar, spelling and punctuation rules and ensuring there are no unnecessary repetitions);
(iii) style (by ensuring the translations reflect the style of the source text);
(iv) terminology (inappropriate for context, inconsistent use), or other errors.


Output only the new translation and nothing else.
```

6. 最后我们就可以将优化过的翻译结果输出给`结束`节点了，这里我们可以选择输出的方式了，这里我选择了自定义的内容输出 + 流式传输来输出翻译后的结果，如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f5e21a8b85c4008ac6990beb8191666~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.png#?w=996&h=938&s=115798&e=png&a=1&b=fcfcfc)

讲到这里，相信大家对如何在 Coze 上复刻吴恩达的 AI 翻译项目已经有了一个比较全面的了解。虽然整个过程涉及到不少配置和调试，但是在 Coze 的帮助下，一切都变得简单易行了。

## 总结

本文探讨了 AI 领域中的 Reflection（反思）模式，并以吴恩达教授的 AI 翻译项目为例，详细介绍了如何在 Coze 平台上实现这一创新的翻译流程。主要内容包括：

1. Reflection 模式的概念及其在 AI 中的重要性，它让 AI 能够自我审视和持续改进。

2. 通过编程案例，展示了 Reflection 模式如何提高代码质量和性能。

3. 详细分析了吴恩达的 AI 翻译项目，包括初始翻译、识别可优化点、对结果进行优化等核心步骤。

4. 在 Coze 平台上复刻该项目的具体操作，包括工作流设计、各节点配置等。

5. 展示了优化前后的翻译效果对比，证明了这种方法能显著提升翻译质量。

6. 强调了提示词设计的重要性，以及如何针对不同语言特色进行定制化翻译。

这个案例不仅展示了 AI 技术在实际应用中的潜力，也为我们提供了一个思路：通过让 AI`反思`自己的输出，我们可以在各个领域获得更高质量的 AI 辅助结果。这种方法不仅适用于翻译，也可以推广到其他需要 AI 持续优化输出的场景中。