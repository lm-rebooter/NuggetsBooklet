欢迎各位来到**FAQ**章节，根据不少同学反馈的工程问题和在开发过程中的一些思考进行一个汇总。我相信大多数同学出现的卡点都大径相同。

不管是在小册中的评论还是交流群中探讨的一些问题，我和言佬都会仔细的观看，建议也好，吐槽也好都会进行回复并加以改正。

## 关于项目节奏

很多同学反馈说前面的内容较为零散，读完了之后感觉无从下手。针对这个问题而言，我认为是正常的，低代码平台不仅仅是一个可视化的页面编辑器，在其上层涉及的技术体系也非常的广。因此在前面的一些篇章当中尽可能的将背景、产品设计、架构思想做一个简单的概述。然后在从实际出发进行功能模块的实现。

#### 基础(占比35%)

在读者群中我也提到过大体上分为以下几个阶段：

-   了解背景：学习低代码平台相关的知识点，明确需要做的产品形态。
-   了解设计：学习低代码平台客户端与服务端工程的底层设计背景。
-   编辑器最小化闭环：基于 **@craftjs/core** 实现一个最小化的编辑器系统，给自己加一个鸡腿✍️。
-   平台化：这一步就需要脱离编辑器的思路范畴，与服务端工程结合实现一个易于管理的平台系统。能基本完成应用的**DevOps**链路。

正常来说，读完小册的内容基本上就完成了基础打磨的内容了，可以尝试挑战更有难度的进阶章节了。

#### 进阶(65%)

-   集成平台：在平台化的基础上继续做上层，将其他一些管理平台，如物料管理、应用管理、模板市场、出码等等子应用工程接入，形成一个一站式的低代码工作台。
-   SDK：由于在这之前使用了@craftjs/core实现了部分核心的模块，在这最后就是实现属于自身的核心技术模块，整体的方案设计思路相对而言偏向技术侧，对新手同学不太友好，所以将其放到了最后面，最后会来实现低代码编辑器的引擎，完成应用的升级。

> 小册目前的章节绝对不是终点，或许是新的起点。

## 工程相关

看到很多朋友都在问一些工程技术的问题，在这里也做一个整体的技术体系的链接导航，不少同学都碰到了工程运行方面的一些问题，我的建议是多看看文档。

#### 技术栈官网

-   **UmiJS**: [https://umijs.org](https://umijs.org/)
-   **Turbo**: <https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks>
-   **Pnpm**: [https://pnpm.js.org/]()
-   **Craftjs**:  <https://craft.js.org/docs/overview>

#### 工程地址

-   **仓库地址**：[https://github.com/Ignition-Space](https://github.com/Ignition-Space/Ignition-web)

<!---->

-   -   **客户端**：<https://github.com/Ignition-Space/Ignition-web>
    -   **服务端**：<https://github.com/Ignition-Space/ignition>

#### 客户端上车指南：

```
# 拉取项目代码
git clone https://github.com/Ignition-Space/Ignition-web.git

# 进入工程
cd ./Ignition-web

# 安装依赖, 必须使用pnpm
pnpm install

# 构建编辑器依赖
pnpm run build:editor

# 启动编辑器
cd ./apps/editor && pnpm run start

# 当控制台出现如下界面，代表着安装成功

> @lgnition-web/editor@1.0.0 start /Users/wangly19/Desktop/开源项目/低代码/Ignition-web/apps/editor
> max dev

info  - Umi v4.0.64
info  - Preparing...
        ╔════════════════════════════════════════════════════╗
        ║ App listening at:                                  ║
        ║  >   Local: http://localhost:5101                  ║
ready - ║  > Network: http://192.168.1.103:5101              ║
        ║                                                    ║
        ║ Now you can open browser with the above addresses↑ ║
        ╚════════════════════════════════════════════════════╝
event - [Webpack] Compiled in 7375 ms (5433 modules)
```

## QA（新手踩坑必看）

#### Q：turbo run start --filter @lgnition-web/editor 是什么意思呀@FT搁浅

A：这是一段执行命令，效果与在/apps/editor目录下执行pnpm run start的效果差不多。相当于是在工程主目录下运行子包的一种方式，具体可以查看turborepo相关的API。

#### Q：vue用户不能用craft.js怎么搞？一篇文章直接把核心用插件代替了，这不是啥也没学到吗？@Cccccl

A：craft只是简化新手入坑的一种方式，小册的内容是低代码平台，并不是低代码编辑器，哪怕是跳过编辑器的部分依旧有很多的知识面可以吸收。

#### Q：文章更新和github代码对照在一起很迷茫，项目代码里使用了umi，但文章还没看到介绍。@**盛宽Kris**

A：umi只是一个工程cli，你可以使用cra或者是nextjs，根据自身的喜好调整的，具体的一些介绍、实践可以参考官方的文档，对于开发而言，我认为文档是一些技术学习的源头。【[点击直达](https://umijs.org/)】

#### Q: 用vite创建的core项目命令是在packages目录下执行的吗，还是在根目录，core项目的package.json是手动处理的吗，我看咱们代码里面core项目的package.json的dependencies和devDependencies都移动到根目录的package.json中了@漂流同志

A: 可以在当前目录下执行，也可以在跟目录通过--filter来执行某个包，也可以执行全部包。依赖的话看是否是公共依赖，公共依赖会安装在根目录的package下，这样做的目的是可以多个工程复用一个依赖链接，比如像react、typescript、eslint这些依赖，就可以安装在全局当中

#### Q: --workspace-root may only be used inside a workspace@SHINE

A: 可以使用pnpm安装依赖，避免出现其他工具，比如yarn发生workspace找不到的问题。

#### Q:看的我 有点不知道怎么下手 写代码呀， 还是文章中的都是伪代码？

A: 真实代码，目前规划为主，先了解背景、架构思路，后面代码出来后不至于无从下手。文章的内容并不能说细致到代码行级内容，跳脱还是很正常的。

### Q: 列表组件怎么动态添加元素（就是列），for和if的嵌套会造成性能问题
在设计中，我是将其拆分为Table组件和Column两个不同的组件，用户将Column组件放入到Table中即可，具体的插槽回在Column中去设计，比如自定义标题 & 自定义字段行内容等等，需要注意的是由于Table是一个不固定行的操作，因此需要先fork穿入进来的组件然后在渲染，只需要用同一个元素即可。

### Q: 组件咋通信啊，比如点击按钮组件，弹出一个提示框，按钮组件怎么获取到提示框对象

举个例子，在gloablScope中或着组件内部声明一个状态，然后通过动态逻辑执行的方式更新对应的值，当值发生变化后弹窗绑定的open自然就改变，从而完成一个状态驱动的响应

### Q: 我用eval和functor给组件动态增加方法，安全有点问题，不知道咋解决，而且多了好像性能也有问题，会卡没找到解决办法

目前已经实现了iframe的沙箱，在沙箱内部操作不会影响到主容器。页面卡是因为{...props}的传递和cloneDeepWith的问题，后续我会做，将属性的克隆力度变化的更细。

### Q：远程发布组件咋肥事啊，有那么点没搞懂，让用户可以自己自定义组件然后发布大家都可以使用吗，小册解释的清楚你就说下细看哪里吧，我有点点云里雾里

远程发布组件其实就是将你的物料发布到线上，通过CDN等在线地址进行访问，在低代码平台物料管理模块去维护物料的版本更迭和环境的产生，避免直接更新导致的线上故障。甚至于可以支持在线的代码构建和发布，类似于SFC Playground的模式。

### Q：我给每个组件加动画效果，然后用gsap（就是tween那个）做时间轴，拼字串，这个页面开始来动态执行代码，然后炸了，有啥优化办法木

同上面那个Q，因为当时是写Demo就直接伸拷贝了，把prototype，__proto__也给玩进去了，所以会爆炸，后面transform结构会更细，这个在next版本调整中会体现。


#### 待补充，欢迎各位同学评论