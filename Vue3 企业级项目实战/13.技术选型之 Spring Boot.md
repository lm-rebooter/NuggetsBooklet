## 认识 Spring Boot

#### 越来越流行的 Spring Boot

Spring Boot 是近几年来 Java 社区最有影响力的项目之一，也是下一代企业级应用开发的首选技术，Spring Boot 拥有良好的技术基因，它是伴随着 Spring4 而产生的技术框架，在继承了 Spirng 框架所有优点的同时也为开发者带来了巨大的便利，与普通的 Spring 项目相比，Spring Boot 可以让项目的配置更简化、编码更简化、部署更方便，为开发者提供了开箱即用的良好体验，进一步提升了开发者的开发效率。

Spring Boot 自面世以来得到的关注度越来越高，如下图所示（数据来源于百度指数），自 2016 年至 2020 年底，对于 Spring Boot 技术栈的关注度逐年增长，通过这些数据会看到得到更加明确地感受到。

![image-20201224162955589](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07507ed953d74ff5ba19c7b06e6b2c41~tplv-k3u1fbpfcp-zoom-1.image)

Spring Boot 以其优雅简单的启动配置和便利的开发模式深受好评，开源社区也空前的活跃，截至 2020 年 12 月 24 日， Spring Boot 项目在 GitHub 网站上已经有 5.2 万 个 Star 数和 3.2 万个 Fork 数，并且数量仍在高速增长，各种基于 Spring Boot 的项目也如雨后春笋一般出现在开发者的面前，足见其受欢迎程度。

![image-20201224161444250](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80e694474a6644a6bed56c32d0fed9e5~tplv-k3u1fbpfcp-zoom-1.image)

通过各技术论坛关于 Spring Boot 技术的讨论也能看出国内对于 Spring Boot 的技术热情越来越高，相信也有很多的国内技术团队使用 Spring Boot 技术进行企业项目开发。笔者是 2016 年开始接触并学习 Spring Boot 技术，在当时完成第一个项目后，立即被这种简洁的开发方式的方式震撼到了，之后就开始慢慢地将其运用到实际的项目开发中。

#### Java 开发者必备的技术栈

回想一下在五六年前找 Java 开发工程师工作时的情景，只要掌握 JSP 和 Servlet 并且做过一些简单的项目，就可以获得很多个面试机会，如果面试过程中表现良好，拿到一份 offer 其实并不难。

大家注意一些时间点，以上这些情况在现如今的大环境下是几乎不可能存在的，Java 求职者会要求有一定的项目经验，多半是 SSM 三大框架或者 Spring Boot 为基础技术栈做的项目，如果简历中没有足够的项目经验，这次简历的投递极大的可能会杳无音信。这也使得 Spring Boot 技术栈成为 Java 开发者所必备的技能，目前招聘市场上的大部分 Java 开发招聘需求都会将 Spring Boot 列为重要的技能点。不止是招聘市场的需求方，供给侧也有了改变，近三年的求职者简历上也出现了一种现象，求职者基本会将 Spring Boot 作为主要的技能点，不管是应届毕业生或者是有经验的 Java 开发者，都会有意识地将 Spring Boot 技术栈及相关项目经验写入个人简历中。

不仅仅是招聘市场在招聘市场火热，Java 技术社区和 Spring 官方团队也对 Spring Boot 有非常大的资源倾斜，Spring 官方更是极力推崇 Spring Boot，在章节内容中笔者也会向大家介绍 Spring 官方对于 Spring Boot 的重视。

学习和掌握 Spring Boot 有着非常好的前景，也因此笔者会在开篇中说：

> Spring Boot 已经成为每一位 Java 开发者在技术道路上打怪升级所必要的技能包。

![图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84c75ff5c331418bbd5a0e9ddb163c20~tplv-k3u1fbpfcp-zoom-1.image)

## 为什么选择 Spring Boot ？

#### Spring Boot 的理念

关于 Spring Boot 框架的理念，可以通过 Spring 官网窥知一二，如下图所示：

![图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce54766f7f54457888add07ecd83d133~tplv-k3u1fbpfcp-zoom-1.image)

在该页面中，官方毫不吝啬对于 Spring Boot 的赞美之词，也极力推荐开发者使用 Spring Boot 来升级 Java 项目的代码。

同时，也引用了 NETFLIX 高级开发工程师的话：

> I'm very proud to say,as of early 2019,we've moved our platform almost entirely over to Spring Boot.

其中的含义不言自明，官方也在不断地暗示，甚至是明示开发者们使用 Spring Boot 去开发，以及使用 Spring Boot “升级”的项目代码进而达到优化 Java 项目之目的。这已经是改版后的 Spring 官网，与之前的话术略微有一些收敛，在 2017 - 2018 年的官网中，官方对于 Spring Boot 的描述如下：

> Spring Boot BUILD ANYTHING

翻译过来就是 **用 Spring Boot 构造一切！**

彼时的官网如下图所示：

![图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/349e7e7258e14006a8061636c5ad03e1~tplv-k3u1fbpfcp-zoom-1.image)

Spring Boot 位于 Spring 三个重量级产品的第一位，可以看出 Spring 官方也非常重视 Spring Boot 的发展并将其放置于一个很高的位置。

> Spring Boot is designed to get you up and running as quickly as possible, with minimal upfront configuration of Spring. Spring Boot takes an opinionated view of building production ready applications.

Spring Boot 目的在于用最少的 Spring 预先配置，让开发者们尽快的构建和运行应用，旨在创建产品级的 Spring 应用和服务。

#### Spring Boot 可以简化开发

> “当你终于把 Spring 的 XML 配置文件调试完成的时候，我已经用 Spring Boot 开发好 N 个功能了。”

这可不是一句玩笑话，相信熟悉 Spring 开发项目的朋友都深有体会，不管是 Spring 框架的初学者亦或者是具有经验的开发者，都会多多少少对 Spring 项目的配置文件感到头痛，尤其是项目日渐庞大之际，纷繁复杂的 XML 配置文件绝对会让开发者们痛苦一段时间。一个项目开发完成后，这种痛苦会消除，但是一旦接手新项目，又会使用 CV 大法去复制粘贴一些十分雷同的 XML 配置文件，周而复始地进行这种枯燥死板的过程让人不胜其烦，阅读到这里的读者可以回想一下是否也遭遇过这种无奈的事情。

Spring Boot 的横空出世解决了这种略显尴尬的问题， Spring Boot 通过其框架中大量的自动化配置等方式来简化原 Spring 项目开发过程中编码人员的配置步骤，大部分模块的设置以及类的装载都由 Spring Boot 预先做好，从而使得开发人员不用再复制来又复制去地进行 XML 配置，极大地提升了开发人员的工作效率，使得其可以更加注重业务实现而不是繁杂的配置工作，也因此使得开发者可以快速地构建应用，这也是为什么总会看到有人会说 “你在配置 XML 的时候我已经开发 N 个功能” 的原因。

框架的封装和抽象程度更加完善，也使得代码的复用性更高、项目的可维护性提高、开发和学习成本更低，加快开发进度并最终成为行业内的一套开发标准。从这个角度来说，越简洁的开发模式就越能减轻开发人员的负担并提升开发效率，行业内普遍都认可并接受的框架也会越来越流行，并最终会成为一套大家都认可的开发标准，Spring Boot 也正在逐渐改变原有的开发模式，成为行业内认可的开发标准，接下来笔者将列举 Spring Boot 框架几个重要的特性，以及这些特性给开发过程带来了哪些提升。

#### Spring Boot 的其它特性

- 继承了 Spring 的优点

Spring Boot 框架来自于 Spring 大家族，因此 Spring 所有具备的功能和 Spring 框架的优点以及带给开发人员的便利， Spring Boot 框架同样能够提供并且做了大量的封装和优化，使得 Spring Boot 相较于 Spring 框架更容易上手和学习；简单来说，相对于 Spring 来说，完成同样的功能和效果，用户需要操作和编码的工作更少了。

- 可以快速创建独立运行的 Spring 项目，简化开发

Spring Boot 简化了基于 Spring 的应用开发，通过少量的代码就能快速构建一个个独立的、产品级别的 Spring 应用。

官方的 Spring Initializr 方案是一个创建新的 Spring Boot 项目不错的选择，并根据自身业务需求选择和加载可能使用到的依赖，使用官方的初始化方案创建 Spring Boot 项目能够确保获得经过测试和验证的依赖项，这些依赖项适用于自动配置，能够大大简化项目创建流程，同时，IDEA 和 STS 编辑器也支持这种直接初始化 Spring Boot 项目的方式，一分钟之内就可以完成一个项目的初始化工作，是不是被惊艳到了？

- 习惯优于配置

Spring Boot 遵循习惯优于配置的原则，使用 Spring Boot 后开发者只需要很少的配置甚至零配置即可完成项目开发，因为大多数情况使用 Spring Boot 默认配置即可。

- 大量的自动配置，简化开发

自动进行 Spring 框架的配置，节省程序员大量的时间和精力，能够让程序员专注在业务逻辑代码的编写上，由于自动配置，大量原先需要在 Spring 配置文件中配置项不用去做，但是 Spring Boot 也有自己的配置方式，简洁灵活。

- starters 自动依赖与版本控制

Spring Boot 通过一些 starter 的定义减少开发人员在依赖管理上所花费的时间，在整合各项功能的时候不需要去自行搜索和查找所需依赖并且在 Maven 的 pom 文件中进行定义。 starter 可以简单的理解为“场景启动器”，在不同的场景和功能中引入不同的 starter， 如果需要开发 Web 项目，在 pom 文件中导入 spring-boot-starter-web ， Web 项目开发中所需的依赖都已经维护在 spring-boot-starter-web 中，无需再去导入 servlet 、springmvc 等所需要的 jar 包，项目中如果需要使用 jdbc，在 pom 文件中导入 spring-boot-starter-jdbc 即可，还有其他企业开发中的各种场景，Spring Boot 都已经准备好，如果没有对应的 starter 也可以自行定义。

starter 节选如下：

![Spring Boot-starter-*](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a079a97787864ab3900e1ecd2b13288c~tplv-k3u1fbpfcp-zoom-1.image)

详细内容可以参考：[Spring Boot-starter-\*](https://docs.spring.io/spring-boot/docs/2.3.7.RELEASE/reference/htmlsingle/#using-boot-starter)

能够如此方便的进行依赖管理是因为 Spring Boot 在场景启动器的设计中提供了 starter POM，这些 pom 文件的存在导致使用 Spring Boot 开发项目可以非常方便的进行包管理，所需依赖以及依赖 jar 包的关系和版本都由 starter 自行维护，很大程度上减少了自己维护依赖版本所造成的 jar 包冲突或者依赖的版本冲突。

- 使用嵌入式的 Servlet 容器

内嵌 Servlet 容器，Spring Boot 直接嵌入 Tomcat 、 Jetty 或者 Undertow 作为 Servlet 容器 ，降低了对环境的要求，在开发和部署时都无需安装 Tomcat 或者 Jetty 等 Web 容器，调试方便，开发完成后可以将项目打包为 Jar 包，并使用命令行直接启动项目，减去部署环节打包并发布到 Servlet 容器中的过程。

使用嵌入式的 Servlet 容器使得开发调试环节和部署环节的工作量有所减少，同时开发者也可以通过 Spring Boot 配置文件修改内置 Servlet 容器的配置，简单又灵活。

- 对主流框架无配置集成 使用场景全覆盖

Spring Boot 集成的技术栈丰富，各互联网公司使用的技术框架大多可以无配置集成，其他的也可以通过自定义 spring-boot-starter 进行快速集成，这也代表着 Spring Boot 的应用场景非常广泛，包括常见的 Web 应用、SOA 以及目前十分火热的微服务等应用。

在 Web 应用中，Spring Boot 提供了 spring-boot-starter-web 来为 Web 开发予以支持，spring-boot-starter-web 为开发者们提供了嵌入的 Tomcat 以及 SpringMVC 的依赖， 可以快速构建 MVC 模式的 Web 工程；在 SOA 及微服务中，用 Spring Boot 可以包装每个服务， Spring Cloud 即是一套基于 Spring Boot 实现分布式系统的工具，适用于构建微服务；Spring Boot 提供了 spring-boot-starter-websocket 可以快速实现消息推送，也可以整合流行的 RPC 框架，提供 RPC 服务接口，只要简单地加入对应的 starter 组件即可。

从以上各个特性中可以看出， Spring Boot 正在试图改善目前 Spring 项目开发过程中冗余复杂的弊端：

- 大量的自动配置和 Spring Boot 注解的设计使得开发者在极少的配置甚至零配置的情况下即可完成项目的构建；
- 自动配置与 springboot-starter 机制让开发者在极少的配置和仅仅引入对应的 starter 即可完成项目的构建和相应功能的开发，也使得开发者更加关注于业务逻辑，简化了开发流程；
- 使用嵌入式的 Servlet 容器使得开发者不用过度的关注于 Servlet 容器，快速部署简化部署流程；
- 引入 spring-boot-start-actuator 依赖并进行相应的设置即可获取 Spring Boot 进程的运行期性能参数，让运维人员也体验到 Spring Boot 的魅力。

相信随着不断的深化和学习，读者朋友们都能够慢慢了解和使用 Spring Boot ，它的这些优点和特性也会越来越清晰地构建在脑海中。

**Spring Boot 框架在开源社区和实际的行业大环境下都处于越来越火热的状态，无论是大中小公司，都在渐渐使用和推广这个技术， Spring Boot 逐渐成为大家普遍需要掌握的开发框架。不管是框架的成熟度，还是技术社区以及 Spring 官方的态度上，Spring Boot 无疑是当前 Java 平台最赤手可热的开发框架。对当前企业开发中的主流框架无配置集成，以及使用 Spring Boot 开发所带来的便利性，都使得它在企业开发中扮演着无比重要的角色，更加可以肯定的是，它在 Java 求职者的简历中也成为了不可缺少的技能点。**