# 为什么选择 npm script？

可能在你翻开这个页面的同时，心里在嘀咕，为什么要选择 npm script？我用着 grunt、gulp 不是挺好的么？

如果你在心里这么问自己，我会很欣慰，因为理性的选择都应该从为什么开始。在小册介绍中我提到的重量级构建工具所带来的问题，已有前人总结的非常不错，吐血推荐大家阅读原文：[Why I left gulp and grunt for npm scripts](https://medium.freecodecamp.org/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8)，中译版也有，可以自己去搜。

说说我自己的亲身经历，在前东家接手维护过使用了 39 个 gulp 插件的项目，因为项目起步较早，部分插件所依赖的基础工具版本都比较老，当这些插件所依赖的基础工具升级之后，gulp 插件本身并没有更新的那么快，我不得不 fork 原仓库去维护内部的版本，而当 gulp 发布了新版本之后，升级插件更是一场艰苦的持久战。

冷静思考下来，上面这种复杂性其实并没有必要，在软件工程里面有个重要的原则，就是简单性，越是简单的东西越是可靠，从概率论的角度，任何系统环节越多稳定性越差。

npm script 相比 grunt、gulp 之类的构建工具简单很多，因为它消除了这些构建工具所带来的抽象层，并带给我们更大的自由度。随着社区的发展，各种基础工具你都可以信手拈来，只要你会使用 [npmjs.com](https://www.npmjs.com) 去搜索，或者去 [libraries.io](https://libraries.io) 上搜索。

废话不多说，我再补充 3 组数据，相信看完这 3 组数据，你就知道该做出什么选择了。

## Google Trends

第 1 组数据来自 [Google Trends](https://trends.google.com/trends/explore?date=all&q=npm,gulp,webpack,grunt)，如果你想了解任何事物的长期发展趋势，Google Trends 是个非常不错的工具。

![](https://user-gold-cdn.xitu.io/2017/11/21/15fdc0ba908221c0?w=557&h=370&f=png&s=35659)

图中是 Google 上的 grunt、gulp、webpack、npm 等 4 种工具的搜索量呈现的趋势，npm 无疑是非常值得前端工程师关注的，而真正让他`强大到无所不能（夸张说法）`的 npm script 是不是应该熟练掌握？

## Stack Overflow Trends

第 2 组数据来自 [Stack Overflow Trends](https://insights.stackoverflow.com/trends?tags=npm%2Cgulp%2Cgruntjs%2Cwebpack)，就是那个遇到任何技术问题都可以去找答案的问答社区。

![](https://user-gold-cdn.xitu.io/2017/11/21/15fdc0bd4641dacd?w=932&h=516&f=png&s=80289)

图中是 4 种工具逐月问题数在全部问题总数中的占比，虽然整体比例比较小，但是从趋势来看，webpack、npm 依然是值得的关注的技术。

## The State of JS Survey 2016

第 3 组数据来自 [The State of JS Survey 2016](https://stateofjs.com/2016/buildtools) 年度调查的结果，虽然 npm script 在 javascript 开发者中接受度没有排到前四名（webpack、grunt、gulp、browserify），但是在其他项中名列前茅，个人也比较好奇今年的实际表现（统计结果还没出来）。

![](https://user-gold-cdn.xitu.io/2017/11/21/15fdc0bfa0c19847?w=556&h=340&f=png&s=44744)

好，关于为什么该拥抱 npm script 就说到这里，期待接下来你能跟我一起去探索 npm script 的方方面面，把它学会用好，添加到自己的武器库里。
