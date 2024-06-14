在之前的工程化课程中，我们实现了按需构建、版本发布、代码检查、代码格式校验、生成变更日志、单元测试以及文档设计，本课程主要讲解如何通过自动化来自动执行上述设计功能，从而提高代码集成和发布的效率。例如：

- 代码提交到功能分支后自动执行代码质量检测、单元测试和构建处理
- 代码合并到主干分支后自动执行代码质量检测、单元测试、构建处理、文档部署和版本发布

为了实现上述功能，我们需要学习和设计 CI / CD 。

## 什么是 CI / CD


CI 的全称是 Continuous Integration（持续集成），CD 可以分为 Continuous Delivery（持续交付）和 Continuous Deployment（持续部署）。很多同学可能不清楚 CI 和 CD 各自有什么区别，CI 的主要作用是对代码进行主干分支集成并保证代码的集成质量，而 CD 的作用是对代码进行预发环境或生产环境的自动部署。如下所示：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6ca21ed31d44d2abd1ebcecc4b83d01~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1512&h=837&s=263508&e=png&b=fefefe)


从上图可以发现，开发者新建分支进行功能开发后，需要频繁向主干分支进行合并操作，而 CI 的作用是在合并之前可以自动执行代码质量检测、单元测试和代码构建等动作，一旦出错则需要开发者重新提交修复代码并再次进行检测处理，从上图可以看出 CI 的好处在于：

- **实时发现错误**：开发者每次提交代码都能够自动执行检测和构建流程，一旦失败可以实时接收通知并进行代码修复，此时开发者还没忘记刚提交的变更代码，容易排查哪些变更导致了 CI 失败，因此定位错误相对容易
- **防止偏离主干**：如果不频繁进行分支合并，会导致当前开发的功能分支相对于主干越走越远，开发者经常会在提测前才想到合并代码，此时可能面临着代码冲突、构建失败、单元测试失败等，而且因为提交的代码过多增大了定位错误的范围，很难快速定位错误，从而导致集成的难度变大，有些开发者甚至为了可以准时提测采取一些临时手段，最终导致代码产生隐患
- **提高工作效率**：提交代码后的完整单元测试和构建流程交由机器自动执行，开发者不需要在本地进行长时间的验证处理，从而可以节省验证时间
- **易于代码审查**：频繁提交代码使得 Code Review 变的更加简单高效，防止大块代码的提交使得代码审查难度上升，并且提交的代码必须通过质量检测，有助于减少审查的维度


上图没有反应持续交付的流程，持续交付主要是在 CI 的基础上将产物自动推送并部署到预发环境（测试环境或者临时环境），从而使得测试人员可以在预发环境进行功能测试。持续部署则是在持续交付的基础上自动将产物部署到客户的生产环境。持续部署和持续交付的区别在于后者需要手动批准才能将产物更新到生产环境，前者则是自动将产物部署到生产环境。如下所示：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed20372a285948028c9f4ae482ece72d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1512&h=954&s=388166&e=png&b=fdfdfd)

> 温馨提示：政府、公安甚至金融行业的大型 To B 软件可能无法做到持续交付和部署，因为这些客户是私有化网络环境，对公网的访问会有严格的限制，此时需要手动将软件产物交付和部署到客户的环境中。

从上图可以发现，相对于 Web 前端而言在 CI 阶段可以执行的动作包括：

- 检测代码质量
- 执行测试（例如性能测试、单元测试或者 E2E 测试）
- 代码内容扫描（例如是否进行监控、是否进行国际化）
- NPM 包依赖扫描
- 安全性扫描
- 执行构建流程
- 集成通知（邮件、机器人、IM 消息推送等）

而 CD 阶段可以执行的动作包括：

- 配置服务并部署静态资源（Web 应用）
- 部署文档并发布版本（库包开发）
- 部署通知（邮件、机器人、IM 消息推送等）


## CI / CD 设计

在之前的工程化课程中，我们完成了 ESLint 校验、提交规范校验、单元测试、文档生成和代码构建脚本设计等，因此可以在 CI 的流程中集成上述功能，一旦发生错误则可以通过邮件的方式快速提醒开发者进行修复，如下所示：

![yuque_diagram (12).jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d82ff28bbda14be0b4a436405d51d851~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1964&h=1471&s=286444&e=png&b=fdfdfd)

> 温馨提示：在之前的课程设计中，我们会在提交代码时对**变更的代码**进行单元测试和 ESLint 校验，而 CI 集成则是对当前提交分支的**所有代码**进行完整的单元测试和校验。除此之外，本地开发者如果不想遵循 Angular 提交规范，在提交代码时可以通过 `git commit -n` 跳过 Git 钩子，而有了 CI 之后则可以在平台上进行强制检测，从而强制开发者遵循提交规范，一旦 CI 失败则可以拒绝合并代码到主干分支。

通用库的 CD 设计和应用的 CD 设计存在非常大的差异，应用的 CD 设计需要考虑将构建的应用产物部署到预发环境或生产环境，在应用部署的过程中还需要考虑 Nginx 服务、OSS 对象存储等和前端资源部署息息相关的服务，并且还需要考虑资源的版本映射以及回滚机制等流程设计。通用库的 CD 设计则相对简单，因为在设计时只需要考虑部署文档站点以及发布库包的版本即可。具体如下所示：
![yuque_diagram (33).jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/716864ff7c994cd68f9294728d82824f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1836&h=1338&s=165920&e=png&b=fdfdfd)

需要注意，在 CD 的流程设计中仍然可以进行代码校验和单元测试。因为 CI 流程中的代码校验和单元测试只是针对开发者的开发分支，而 CD 流程中的代码校验和单元测试针对的是主干分支。由于本课程的演示项目托管在 Github 上，因此采用 Github 自带的 [Github Actions](https://docs.github.com/zh/actions) 进行 CI / CD 能力设计，Github Actions 的特点如下所示：

- **紧密结合**：Actions 内置在 Github 仓库中，可以整合代码管理和版本控制的工作流
- **原生支持**：相比其它 CI / CD 工具，Actions 可以直接使用 Github 提供的[上下文](https://docs.github.com/zh/actions/learn-github-actions/contexts)和 [Webhooks](https://docs.github.com/zh/actions/using-workflows/events-that-trigger-workflows)
- **灵活配置**：使用 YAML 配置文件定义工作流程，支持自定义触发条件、任务顺序和依赖关系等
- **生态系统**：拥有丰富的 Actions 库，可以直接在工作流中复用（可以理解为 CI / CD 插件）

接下来本课程将简单介绍 Github Actions 的功能并给出上述 CI / CD 设计的实现。

## Github Actions 简介

Github Actions 是一个 CI / CD 平台，可用于自动执行构建、测试和部署流程。Github Actions 的组成如下所示：

![yuque_diagram (45).jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/965aad9ed5a84467915d5fc2333f74a1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2008&h=1372&s=264082&e=png&b=fdfdfd)

在 Github Actions 中需要了解 Workflow、Event、Runner、Job、Step、Action 等基础概念，如下所示：

- **Workflow（工作流）**：在一个仓库项目中可以设计多个不同的工作流，每一个工作流都由单独的 YAML 文件在项目的 `.github/workflows` 目录中进行定义，例如在本课程中可以设计 CI 和 CD 两个不同的工作流
- **Event（事件）**：用于触发工作流执行的特定活动，例如代码提交后触发工作流执行的 Push 事件、Pull requeset 事件、推送代码到启用了 Github Pages 对应的分支时触发执行的事件等，更多事件可以查看[触发工作流的事件](https://docs.github.com/zh/actions/using-workflows/events-that-trigger-workflows)
- **Runner（运行器）**：用于运行 Job 的服务器，包括 Ubuntu Linux、Microsoft Windows 和 MacOS 等类型，当然也可以[自定义运行器](https://docs.github.com/zh/actions/hosting-your-own-runners)
- **Job（作业）**：每一个运行器可以运行一个单独的 Job，并且 Job 之间还可以配置依赖关系，例如一个 Job 的执行需要依赖另外一个 Job 执行完成后才能执行，默认情况下 Job 之间并行执行
- **Step（步骤）**：每一个 Job 可以包含多个可执行的 Step，这些 Step 可以是 Shell 脚本命令，也可以是 Github Actions 中可复用的 Action。 Step 按顺序执行，并且可以前后互相依赖
- **Action（操作）**：在 Step 中除了可以使用 Shell 脚本还可以使用 Action 执行流程，Action 可以理解为插件，主要用于封装可复用的复杂执行流程，并且 Action 也可以使用 [Node 脚本进行设计](https://docs.github.com/zh/actions/creating-actions/creating-a-javascript-action)，设计后还可以将其发布到 [Github Marketplace](https://github.com/marketplace?type=actions) 供别人使用，例如常见的可复用 Action 包括 [actions/setup-node@v3](https://github.com/marketplace/actions/setup-node-js-environment)（安装 Node 环境）和 [actions/checkout@v4](https://github.com/marketplace/actions/checkout)（下载仓库代码到 CI 所在的服务环境）

> 温馨提示：可以查看 [awesome-actions](https://github.com/sdras/awesome-actions) 了解更多的 Action。



## 基于 Push 事件的 CI 实现

了解了 Github Action 的基础概念之后，我们可以设计本课程的 CI 实现。Github Action 默认约定在项目根目录的 `.github/workflows` 下新增 `yml` 文件来设计工作流程，因此我们可以在项目根目录的 `.github/workflows` 下新增 `ci.yml` 文件，该文件的流程设计如下所示：

``` yml
# .github/workflows/ci.yml
# 当前的 ci.yml（.yaml） 文件是一个 workflow，必须放置在项目的 .github/workflows 目录下

# name: 当前 workflow 的名称
name: ci

# Event
# 定义 Push 事件，当 demo/**、feat/** 和 fix/** 分支提交代码时触发当前工作流
# 这里只是一个分支设置示例，理论上除了 gh-pages 分支外，任何分支触发 Push 事件都应该执行 CI 流程
# 因此这里也可以反向利用 branches-ignore 排除 gh-pages 分支进行设置
on:
  push:
    branches:
      - demo/**
      - feat/**
      - fix/**
   
# Job   
# 当前 ci 只需要在一个 job 中完成
jobs:
  # job id，每一个 job 都有自己的 id，可用于 needs 进行继发执行
  # 例如以下示例中，deploy 必须依赖 test 和 build 执行完成
  # jobs:
  #   test:
  #   build:
  #     needs: test
  #   deploy:
  #     needs: [test, build]
  test:
    name: CI 执行流程
    
    # Runner
    # 在 Linux 环境中运行
    runs-on: ubuntu-latest
    
    # Step
    steps:
    
      # Step1 
      - name: 下载 Github 仓库
        # Action
        # 这里使用社区提供的通用 Action
        # checkout action: https: //github.com/actions/checkout
        uses: actions/checkout@v4
       
      # Step2  
      - name: 下载和安装 Node 环境
        # setup-node action: https://github.com/actions/setup-node
        uses: actions/setup-node@v3
        # with 是当前 action 的参数
        with:
          # 在 package.json 的 engines 中我们配置了  "node": ">=16.18.1"
          # 因此这里对安装的 Node 进行版本限定
          node-version: "16.x"

      # Step3
      # 这里执行 Shell 脚本
      - name: 安装依赖
        # 需要注意 npm ci 和 npm i 的区别
        run: npm ci
        
      # Step4
      - name: 代码校验
        run: npm run lint
       
      # Step5 
      - name: 单元测试
        run: npm test
        
      # Step6
      - name: 文档构建
        run: npm run docs:build

      # Step7
      - name: 代码构建
        run: npm run build
```

当我们在 `demo/**`、`feat/**` 和 `fix/**` 分支提交代码时会自动触发上述 CI 流程，从而可以实时对提交代码的进行代码校验、单元测试以及构建执行。


> 温馨提示：示例源码可以从 [demo/github-actions-ci](https://github.com/ziyi2/micro-framework/tree/demo/github-actions-ci) 分支获取。如果想要了解上述配置更详细的注释信息，可以查看 [README.md](https://github.com/ziyi2/micro-framework/blob/demo/github-actions-ci/README.md)。如果不清楚 `.yml` 文件格式语法，可以查看 [Learn-YAML-in-five-minutes](https://www.codeproject.com/Articles/1214409/Learn-YAML-in-five-minutes)。初次编写难免会产生格式问题，可以使用 VS Code 插件 [Github Actions](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions) 进行格式提示。

需要注意在上述 CI 的流程中我们使用了 `npm ci` 代替 `npm i` 进行依赖安装，`npm ci` 适用于持续集成的场景，在具备 `package-lock.json`（`npm-shrinkwrap.json`）以及 `node_modules` 不存在或者为空的情况下相对于 `npm i` 的执行速度更快，除此之外：

- 没有 `package-lock.json` 的情况下 `npm ci` 会退出执行并报错
- 如果 `package-lock.json` 和 `package.json` 的依赖项不匹配，`npm ci` 会退出执行并报错，而 `npm i` 则会更新依赖并更新 `package-lock.json` 
- `npm ci` 一次只能安装整个项目的依赖项，而 `npm i` 可以安装单个依赖项
- `npm ci` 会在开始安装之前删除整个 `node_modules` 目录
- `npm ci` 不会更改 `package.json` 和 `package-lock.json` 

> 温馨提示：在持续集成时我们希望依赖的安装是稳定可控的，因此推荐使用 `npm ci` 代替 `npm i` 执行依赖安装，因为它会严格按照 `package-lock.json` 中的指定版本进行安装。除此之外，如果不希望每次执行 CI 流程都需要安装相同的 NPM 依赖，那么可以查看[缓存依赖项以加快工作流程](https://docs.github.com/zh/actions/using-workflows/caching-dependencies-to-speed-up-workflows)对 `node_modules` 进行缓存处理。

对于没有接触过 CI 流程设计的同学需要注意，每次 CI 的执行流程都是在 Github 新分配的云服务器虚拟机上运行，虚拟机中默认不会提供 Node 环境，并且也不会存在当前仓库的项目，因此每一次触发 CI 的执行都需要进行如下操作：

- 下载仓库并切换到指定的分支
- 安装 Node 和 NPM
- 安装项目的 NPM 包依赖
- 使用 Shell 脚本执行项目中设计的运行命令

由于前面两步的操作在任何项目中都通用，因此我们可以通过社区已经发布的通用 Action 进行操作，而后面两步的执行步骤和开发者的项目环境息息相关，因此可以使用项目中的 Shell 脚本进行执行。设计并提交了上述 Github Actions 配置以后，Github 会因为 Push 事件自动触发 CI 工作流程，如下所示：

![GithubActionsCI.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25b83b2a08db4850b47e673f0bface8e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1148&h=850&s=6836964&e=gif&f=154&b=262c30)

> 温馨提示：上述示例的 Actions 信息可以查看 https://github.com/ziyi2/micro-framework/actions/runs/6456587090/job/17526373029 。

从上述 CI 的单元测试流程中可以发现 `actions/checkout@v4` 默认使用当前提交分支的最新 commit 执行 CI 流程，`actions/setup-node@v3` 则会按照配置安装 Node 16.x 的版本。

每一次提交代码都会自动执行上述 CI 流程，假设某个开发者通过 `git commit -n -m` 绕过本地 Git 钩子提交了带有 ESLint 错误的代码，那么 Github Actions 的 CI 流程仍然会检测出该错误，如下所示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23bc82235f3d4ebc9aeb55c30453532e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=1134&s=135245&e=jpg&b=22252a)

除此之外，可以在 Github 的项目中设置[工作流程运行通知](https://docs.github.com/zh/actions/monitoring-and-troubleshooting-workflows/notifications-for-workflow-runs)，例如在本项目中 Github Action 的 CI 流程执行失败（默认只会在失败时通知，也可以设置成[所有执行状态通知](https://github.com/settings/notifications)），会通过配置的邮箱自动通知，如下所示：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb523cf28c394b249f83141d67f05ad6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=901&s=121045&e=png&b=fefefe)

通过邮箱通知，我们不需要实时关注 Github Actions 的执行状态，从而可以通过订阅实现 CI 执行状态的感知并可以实时进行代码修复。

> 温馨提示：如果你使用钉钉进行协同工作，那么也可以在 CI 流程中设计[钉钉机器人的通知方式](https://github.com/visiky/dingtalk-release-notify)，从而提升订阅效率，防止错过邮件通知。

## 基于 Pull Request 事件的 CI 实现

在**工程设计：版本发布**中我们讲解了多人协作的发布规则设计，如下所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3326ff4b048e4aa2b045c6aad140689e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1140&h=663&s=149148&e=png&b=fefefe)

在规则中我们会进行 Pull Request 操作，因此在 CI 流程中我们可以增加 Pull Requeset 触发事件，当开启 Pull Requeset 时自动触发 CI 流程的执行，如下所示：

![yuque_diagram (46).jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92fe4464e0d14631ae70f649995e9ccb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1538&h=653&s=81193&e=png&b=ffffff)

为了实现该功能，我们只需要在工作流程中新增 Pull Request 的触发事件，如下所示：

``` yml
# .github/workflows/ci.yml
on:
  push:
    branches:
      - demo/**
      - feat/**
      - fix/**
  
  # 新增 master 分支的 Pull Request 事件
  pull_request:
    # 默认情况下在 pull_request 事件的活动类型为 `opened`、`synchronize` 或 `reopened` 时触发
    # types: [opened, reopened],
    branches:
      - master
```

> 温馨提示：更多关于 Pull Request 的活动类型可以查看[触发工作流事件/pull request](https://docs.github.com/zh/actions/using-workflows/events-that-trigger-workflows#pull_request)。

具备上述流程后，代码提交和评审人员都可以快速查看 CI 流程是否已经通过，如果 CI 流程执行失败，则可以先让开发者排查和修复 CI 流程中的错误，从而确保代码合并的稳定性：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d14cc103bafa469cab9ca0b6fbfe4380~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=1134&s=166465&e=png&b=ffffff)

> 温馨提示：在之前的课程中设计了 Pull Ruquest 的准入条件为必须 1 人以上通过 CR，上述示例由于没有指定 CR 人员导致无法进行 Merge Pull Request 操作。


如下所示，尽管 Code Review 已经通过，但是 CI 的流程失败，项目负责人可以通过判断 CI 状态来决定是否需要进行 Merge 操作：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/220cdc066541402a8b06bcff945d04e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=981&h=943&s=124396&e=png&b=ffffff)

如果希望 CI 失败可以禁用 Merge Pull Request 操作，那么可以对保护分支的规则进行如下配置：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2ae61b18176427b99597b3692c68f7c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1177&h=1042&s=197152&e=png&b=ffffff)

> 温馨提示：通过在搜索框中输入 CI 的 Job 名称来搜索对应的 Github Actions 工作流程。

此时如果 CI 失败则无法进行 Merge Pull Request 操作：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6941c047cb584bec915da836bf33dd5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1177&h=742&s=123752&e=png&b=ffffff)

当然，我们还可以额外设计一些和 Pull Reuqest 息息相关的自动化流程，例如：

- 开启、编辑或者关闭 Pull Request 的时候进行邮件或钉钉机器人的通知
- 开启 Pull Request 的时候[自动分配 Code Review 人员](https://github.com/actions-cool/pr-welcome)并通过钉钉机器人或者邮件进行提醒
- [开启 Pull Ruquest 的时候进行规范检测](https://github.com/ant-design/ant-design/blob/master/.github/workflows/pr-open-check.yml)
- [定时检测 Code Review 和 CI 的执行状态](https://github.com/ant-design/ant-design/blob/master/.github/workflows/pr-check-ci.yml)，根据状态自动执行 Merge 操作
- 测试报告覆盖率低于阈值时禁止 Merge Pull Request

> 温馨提示：如果你是一个开源库的开发者，可以设计大量的自动化流程来提高工作效率，例如参考[你好，GitHub Actions](https://ant.design/docs/blog/github-actions-workflow-cn) 和 [Ant Design 的 Github Actions 设计](https://github.com/ant-design/ant-design/tree/master/.github/workflows) 。

## 基于 Push 事件的 CD 实现

当代码通过 Pull Request 被合并到 master 分支后，可以设计一个 CD 工作流程来实现自动发布，具体如下所示：

![yuque_diagram (44).jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46d93dd386aa40af89961fc8c05e82b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1538&h=682&s=84319&e=png&b=ffffff)

> 温馨提示：注意 CD 执行流程可以根据实际场景而定，例如可以是每天定时执行，或者特定条件触发执行，例如关闭了某些 Issues。在本课程中，我们设计成合并到 master 分支后自动执行 CD 流程。

当其他的分支的代码被合并到 master 分支后可以自动执行 CD 流程实现如下功能：

- 自动执行单元测试并生成测试报告
- 自动构建文档并进行文档部署
- 自动构建代码并进行版本发布
- 自动通过钉钉机器人或者邮件进行发布结果通知

>温馨提示：示例源码可以从 [demo/github-actions-cd](https://github.com/ziyi2/micro-framework/tree/demo/github-actions-cd) 分支获取。

### 测试报告

在**工程设计：单元测试**中我们讲解了如何使用 Jest 生成测试报告，但是没有讲解如何上传测试报告。接下来我们会重点讲解如何基于 Jest 上传测试报告到 [Coveralls](https://coveralls.io/) 中，并可以通过 Github Actions 的 CD 流程自动执行。在 Coveralls 上传测试报告的好处在于：

- **实时监测代码覆盖率：** 上传测试报告可以使得所有协作的开发人员实时了解项目的代码覆盖情况，对于覆盖率较低的部分则可以设计更多的单元测试，以提高代码的质量和可靠性
- **实时发现未覆盖代码：** 上传测试报告后可以帮助团队发现没有被测试覆盖的代码部分，这些未覆盖的代码可能包含潜在的 Bug，需要设计单元测试来验证代码的完善性
- **提高代码质量：** 通过查阅测试报告可以确保项目中的每个代码路径都经过了单元测试，这有助于提高代码质量和可维护性，减少潜在的 Bug，并提高代码整体的健康度
- **提供代码质量指标：** 通过上传测试报告到 Coveralls，可以获得代码的测试覆盖率指标，有助于评估代码的质量
- **促进团队合作与沟通：** 通过共享测试报告，可以使得团队共同关注代码中的测试覆盖情况，对 Code Review 、分支合并以及 CI / CD 流程等提供有利的准入基础
 
我们可以按照 [Coveralls / Getting Started](https://docs.coveralls.io/) 进行配置：

- 第一步：关联账号，这里可以直接[使用 Github 登录 Coveralls](https://coveralls.io/sign-in)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34f63828e8b441d698b9c96efb4b1eac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1131&h=899&s=405415&e=png&b=2a3943)


- 第二步：前往 [ADD REPOS](https://coveralls.io/repos/new) 开启项目仓库的 Coveralls

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39cb3e3cb5bc48dc9928535e06d2f455~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1131&h=899&s=321421&e=png&b=f9f7f0)


- 第三步（可选）：如果没有 CI / CD，那么可以通过 [JavaScript 集成](https://docs.coveralls.io/javascript) 中的 [node-coveralls](https://github.com/nickmerwin/node-coveralls) 脚本命令手动进行报告上传

- 第四步：如果使用 Github Actions 进行 CI / CD 设计，那么可以参考 [Coveralls GitHub Action](https://github.com/marketplace/actions/coveralls-github-action) 进行工作流设计

由于本课程直接使用 Github Actions 进行 CD 设计，因此配置完上述第一步和第二步之后，我们直接进行第四步 CD 流程设计。在项目根目录的 `.github/workflows` 下新增 `cd.yml` 文件，该文件的流程设计如下所示：

``` yml
# .github/workflows/cd.yml
name: cd
on:
  # 这里暂时使用 demo 分支进行单元测试报告上传测试
  push:
    branches:
      - demo/**

jobs:
  test:
    name: CD 执行流程
    runs-on: ubuntu-latest
    steps:
      - name: 下载 Github 仓库
        uses: actions/checkout@v4

      - name: 下载和安装 Node 环境
        uses: actions/setup-node@v3
        with:
          node-version: "16.x"

      - name: 安装依赖
        run: npm ci

      - name: 代码校验
        run: npm run lint

      - name: 单元测试
        run: npm test

      # 上传测试报告
      # 具体可参考：https://github.com/marketplace/actions/coveralls-github-action
      - name: 测试报告
        uses: coverallsapp/github-action@v2

      - name: 文档构建
        run: npm run docs:build

      - name: 代码构建
        run: npm run build
```

此时上传代码后会自动触发 CD 流程，如下所示：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59cda0eea6ae49359b77a19486cdfe64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1131&h=1075&s=182529&e=png&b=23272b)

需要注意 coverallsapp/github-action 的作用是将 `npm test` 执行后生成的 `converage` 目录下的单元测试覆盖率信息上传到 Coveralls 平台，上传成功后可以在 Coveralls 平台查看：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13ae7cdedb4e4e2e8fb5d32f134f0975~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1131&h=780&s=203925&e=png&b=fcfbf6)

> 温馨提示：在下一个课程中我们会讲解如何基于测试报告在项目的 README.md 中放入实时展示测试覆盖率报告的徽章，从而可以帮助大家实时了解项目的单元测试覆盖情况。


### 部署文档

代码校验和单元测试通过以后，可以实时部署库包的使用文档。在**工程设计：文档设计**中我们使用了 Github 进行网页托管（如果已经忘记可以回到**工程设计：文档设计**的文档部署进行回顾）。具体的流程如下所示：

- 创建 [gh-pages 分支](https://github.com/ziyi2/micro-framework/tree/gh-pages)（也可以设定为其它分支）
- 将 VuePress 构建的产物放入该分支（分支的根目录需要具备 `index.html` 文件）
- 设置 Github 中 Pages 托管分支为 `gh-pages`

上传代码后 Github 会自动帮忙托管静态资源，托管成功后可以通过 https://ziyi2.github.io/micro-framework/ 进行访问。但是手动执行上述流程会非常麻烦，而且可能会导致文档的发布和 NPM 的发布不同步。例如 NPM 包已经发布最新版本，但是由于手动更新和部署文档，可能导致文档落后于已经发布的 NPM 包版本信息，尽管开发者在发布 NPM 包的同时及时修改了文档的内容，但是最终可能会因为没有及时部署文档导致使用者无法实时接收到最新的变更信息。

为此，我们可以在 CD 流程中新增文档的自动部署能力，确保 NPM 包发布的同时可以实时部署最新的文档信息。我们可以使用 [actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) 实现自动部署流程，它的主要作用是将构建后的文档变更并发布到特定的托管分支（例如本课程的 `gh-pages` 分支），具体设计如下所示：

``` yml
# .github/workflows/cd.yml
name: cd
on:
  push:
    branches:
      - demo/**

jobs:
  test:
    name: CD 执行流程
    runs-on: ubuntu-latest
    steps:
      - name: 下载 Github 仓库
        uses: actions/checkout@v4

      - name: 下载和安装 Node 环境
        uses: actions/setup-node@v3
        with:
          node-version: "16.x"

      - name: 安装依赖
        run: npm ci

      - name: 代码校验
        run: npm run lint

      - name: 单元测试
        run: npm test

      - name: 测试报告
        uses: coverallsapp/github-action@v2

      - name: 文档构建
        run: npm run docs:build

      # 部署文档
      - name: 部署文档
        uses: peaceiris/actions-gh-pages@v3
        with:
          # GTIHUB_TOKEN：https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token
          # Github 会在 workflow 中自动生成 GIHUBT_TOKEN，用于认证 workflow 的运行
          github_token: ${{ secrets.GITHUB_TOKEN }}
          # 执行 npm run docs 命令后默认会在该目录下生成静态资源
          publish_dir: ./docs/.vuepress/dist
          with:
          # 默认发布到 gh-pages 分支上，可以指定特定的发布分支
          # publish_branch: gh-pages1
          # https://github.com/peaceiris/actions-gh-pages#%EF%B8%8F-set-custom-commit-message
          # 设置上传到 gs-pages 分支的 commit 信息
          full_commit_message: ${{ github.event.head_commit.message }}

      - name: 代码构建
        run: npm run build
```

此时提交代码后会自动触发文档部署，如下所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b1476d04d3944159cbbe97e500df60f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1131&h=1141&s=173874&e=png&b=22262a)

可以详细查看 `peaceiris/actions-gh-pages@v3` 执行的步骤信息，其中重要的步骤包括：

``` bash
# 克隆 gh-pages 分支（注意 --depth=1 --single-branch 有助于加快克隆速度，因为只克隆单分支）
/usr/bin/git clone --depth=1 --single-branch --branch gh-pages ***github.com/ziyi2/micro-framework.git /home/runner/actions_github_pages_1697456454375
# 删除 gh-pages 分支内的原有静态资源内容
/usr/bin/git rm -r --ignore-unmatch *
# 拷贝当前 CD 分支所在的构建内容到 gh-pages 分支中
copy /home/runner/work/micro-framework/micro-framework/docs/.vuepress/dist to /home/runner/actions_github_pages_1697456454375
# 设置 git 信息（也可以通过 with 参数进行自定义配置）
/usr/bin/git remote rm origin
/usr/bin/git remote add origin ***github.com/ziyi2/micro-framework.git
/usr/bin/git add --all
/usr/bin/git config user.name ziyi2
/usr/bin/git config user.email ziyi2@users.noreply.github.com
# 提交说明
/usr/bin/git commit -m feat: 测试 CD 场景
# 提交代码
/usr/bin/git push origin gh-pages
```

提交成功后 Github 会自动执行内置的工作流程 [pages-build-deployment](https://github.com/ziyi2/micro-framework/actions/workflows/pages/pages-build-deployment) 对 `gh-pages` 分支的产物进行部署。此时我们修改文档信息后，通过提交代码可以自动部署并更新文档信息。


### 发布库包

上传单元测试报告和文档部署都成功后，接下来需要实现自动发布版本。在**工程设计：版本发布**中，我们设计了 [build/release.ts](https://github.com/ziyi2/micro-framework/blob/demo/github-actions-cd/build/release.ts) 脚本进行自动发布，包括：

- 发布前准备：将 `README.md` 和 `package.json` 拷贝到构建目录 `lib` 下
- 发布预检：单元测试（CD 流程中可以省略）、发布分支和文件检测、发布版本检测
- 发布版本：进入 `lib` 目录通过 `npm publish` 脚本执行发布命令

最终我们可以快速通过 `npm run release` 命令进行一键发布。在 CD 的流程设计中，我们可以设计一个完整的自动化发布流程，包括：

- 配置 CD 服务器的 NPM 登录凭证，从而使服务器具备 NPM 包的发布权限
- 自动更改 `package.json` 中的 `version` 版本，可以根据语义化的版本进行自增
- 自动执行 `npm run release` 命令进行版本发布
- 发布完成后可以打 Tag 并自动将更改了 `package.json` 的代码提交到远程仓库
- 邮件或者钉钉通知版本发布成功

需要注意，相比于自动语义化版本我们更需要确保发布流程的安全性和稳定性，因此这里不会取消 master 分支的受保护规则。同时为了防止手动设置版本错误，我们在 `release.ts` 中设计了本地需要发布版本和已经发布版本的对比判断，确保本地需要发布的版本大于远程版本。如果希望可以实现上述所有步骤的自动化，那么需要取消 master 保护分支的限制，并在 `release.ts` 中新增第 2 步和第 4 步的脚本设计，例如可以使用 [semantic-release](https://github.com/semantic-release/semantic-release) 实现自动化的语义化版本发布。

本课程由于将 master 设置为保护分支，不能通过本地将代码提交到远程仓库，因此省略了第 2 步和第 4 步的提交处理，这些步骤需要在特定的开发分支提交代码时手动更改 `package.json` 并进行代码提交和 Pull Request，因此接下来设计的流程需要确保开发者已经准备好需要发布的版本。



> 温馨提示：如果在真实的业务中存在大量相同的上述库包设计，那么我们可以将其封装成通用的 Action 形成 CD 流程复用，本课程不会具体讲解如何封装 Action。


为了实现上述流程的自动化，首先需要设置 CD 所在服务器的 NPM 发布权限。在**工程设计：版本发布**中我们讲解了 NPM 包的发布流程，首先需要在 NPM 官网进行账号注册，其次需要在本地通过 `npm login` 进行 NPM 登录认证，在登录的过程中我们还需要通过邮箱提供的 OTP code 进行二次验证（如果开启了双因素登录认证，那么会通过 NPM 提供的链接地址来获取登录认证码），如下所示：

``` bash
# 执行登录
npm login
npm WARN adduser `adduser` will be split into `login` and `register` in a future version. `adduser` will become an alias of `register`. `login` (currently an alias) will become its own command.
npm notice Log in on https://registry.npmjs.org/
# 输入账号
Username: ziyi22
# 输入密码
Password: 
# 输入邮箱
Email: (this IS public) 18768107826@163.com
npm notice Please check your email for a one-time password (OTP)
# 通过邮箱输入 OTP code 进行验证
Enter one-time password: 73326070
Logged in as ziyi22 on https://registry.npmjs.org/.
# 登录以后查看账号名
npm whoami
ziyi22
```

但是在 CD 服务器上无法自动输入账号密码，并且无法进行 OTP 二次认证，此时我们可以采用 NPM 提供的 [Token](https://docs.npmjs.com/about-access-tokens) 来进行免登认证。首先我们可以先创建 Token，通过阅读 [Creating and viewing access tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens) 我们可以先进入 Token 管理页面：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b6dd2f2a8564ae4adb7cd0412876171~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1101&h=924&s=139558&e=png&b=f9f9f9)

我们可以选择创建不同类型的 Token：

- Classic Token：经典的 Token 类型，不限制使用范围，并且还可以细分为 **Read-only**、**Automation**、**Publish** 等类型，如果需要使用 CI / CD 流程，推荐使用 **Automation**，它可以避免[双因素认证](https://docs.npmjs.com/about-two-factor-authentication)
- Granular Access Token：更细粒度控制权限的 Token，可以设置**过期时间 / IP 范围 / 可读可写 / 包范围 / 组织**等

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4224382be8b54202b3ffb8f4f0d4197f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1101&h=950&s=129830&e=png&b=f9f9f9)

由于本课程需要执行 CD 流程，因此可以创建一个 **Automation** 类型的 Classic Token：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae28bd7ab79044cf82901182d9aef9fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1101&h=950&s=113947&e=png&b=f8f6f6)

创建完成后需要及时复制并保存 Token 信息，因为刷新之后 Token 信息会被隐藏：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2296564aafbc4de9b9b766afdf423974~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1101&h=950&s=131833&e=png&b=f8f6f5)

接下来我们可以先在本地进行非登录态的 Token 认证测试，根据 [Create and check in a project-specific .npmrc file](https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow#create-and-check-in-a-project-specific-npmrc-file) 发现可以在项目的根目录创建一个 `.npmrc` 的文件，并可以结合 [Auth related configuration](https://docs.npmjs.com/cli/v9/configuring-npm/npmrc#auth-related-configuration) 在文件中配置 Token 进行登录认证：

``` bash
# 一种不是特别优雅的全局配置，MYTOKEN 是上述生成步骤生成的 Token 信息
#_authToken=MYTOKEN
# 指定 NPM 官方注册表地址的 Token 信息
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
# 也可以指定其他注册表地址的 Token 信息
# //somewhere-else.com/:_authToken=MYTOKEN
```

我们可以先在项目根目录进行非登录认证的 Token 测试，具体如下所示：

``` bash
# lib/commonjs/.npmrc 和 lib/es/.npmrc
# _authToken 后填写的是真正生成的 token 值
//registry.npmjs.org/:_authToken=npm_PC8Ty7v5yxQEnMfNOX6JoZagGAySrD4*****
registry=https://registry.npmjs.org/
always-auth=false
```

由于在之前的按需加载设计中，我们会使用 `npm run release` 自动进入产物包目录发布 CommonJS 和 ES Module 两个库包，因此我们需要在两个产物包的根目录各自放入 `.npmrc` 文件，最终在执行 `npm run release` 时会进入相应的目录执行 `npm publish`，如下所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f77a5794b3154b17847fec998600298a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1327&h=1218&s=329620&e=png&b=181818)

> 温馨提示：`.npmrc` 和需要发布库包的 `package.json` 需要在同级目录。如果想要额外定制 `.npmrc` 的路径，那么可以使用 `NPM_CONFIG_USERCONFIG` 环境变量，例如 `NPM_CONFIG_USERCONFIG=/path/to/.npmrc npm publish`。


> 温馨提示：如果发现库包发布失败，例如报错 `This package requires that publishers enable TFA and provide an OTP to publish` ，那么需要对 NPM 包进行一些认证配置，具体可以参考 [Requiring 2FA for package publishing and settings modification](https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification)。


从上述示例可以发现，尽管我们已经退出了 NPM 的登陆状态，但是我们仍然可以基于 `.npmrc` 文件的认证配置进行免登发布，这正是 CD 自动化流程中需要的免登配置信息。当然，**真正在使用 `.npmrc` 进行免登配置时切忌将 token 的明文信息上传到远程仓库**，防止别人使用该 token 进行免登发布，此时可以使用一些环境变量进行占位。例如接下来的 CD 流程中，token 不会被放入 `.npmrc` 配置文件中。我们可以根据 [Github Acions / 发布 Node.js 包](https://docs.github.com/zh/actions/publishing-packages/publishing-nodejs-packages) 进行配置，为了隐藏 Token 信息，我们可以借助于[在 GitHub Actions 中使用机密](https://docs.github.com/zh/actions/security-guides/using-secrets-in-github-actions) 来隐藏和使用 Token，首先需要在设计 CD 流程的仓库中[创建机密](https://docs.github.com/zh/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-an-organization)，例如创建名为 `NPM_TOKEN` 的存储库机密：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7cdd3b1d141404897e174853b109dba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1173&h=944&s=158763&e=png&b=fefefe)

创建完成后可以在 Github Actions 中利用该机密进行 NPM 的免登设置，如下所示：

``` yml
name: Publish Package to npmjs
on:
  release:
    types: [published]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # Setup .npmrc file to publish to npm
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          # Optional registry to set up for auth. Will set the registry in a project level .npmrc and .yarnrc file, and set up auth to read in from env.NODE_AUTH_TOKEN.
          # 请注意，需要在 `setup-node` 中将 `registry-url` 设置为 `https://registry.npmjs.org/` 才能正确配置凭据
          # 配置该参数后会创建 .npmrc 文件并读取 env.NODE_AUTH_TOKEN 环境变量进行 token 填充
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish
        # env.NODE_AUTH_TOKEN 环境变量配置成名字为 NPM_TOKEN 的存储库机密
        # 可以发现整个过程并不会将 token 展示在配置文件中，而是通过环境变量进行填充
        env: 
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

在执行 actions/setup-node 时会因为配置了 `registry-url` 参数而自动在项目中生成 `.npmrc` 文件，该文件的内容如下所示：

``` bash
# 在执行 shell 脚本时可以使用环境变量 NODE_AUTH_TOKEN 进行真正的 token 值填充
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
registry=https://registry.npmjs.org
always-auth=true
```

在执行 `npm publish` 时配置了环境变量 `NODE_AUTH_TOKEN`，该变量的值设置为 Github 仓库中名为 `NPM_TOKEN` 的存储库机密，类似于执行：

``` bash
# 执行发布命令，读取 .npmrc 文件进行环境变量填充
# 其中 secrets.NPM_TOKEN 是 Github 仓库中设置的存储库机密
# 执行该命令后会读取 .npmrc 文件并进行 NODE_AUTH_TOKEN 环境变量的填充
NODE_AUTH_TOKEN=${secrets.NPM_TOKEN} npm publish
```

这里需要额外了解 Shell 脚本的环境变量填充，例如：

``` bash
# 设置环境变量
NPM_CONFIG_USERCONFIG=/path/to/.npmrc1
# 打印环境变量
echo ${NPM_CONFIG_USERCONFIG}
# 打印信息
/path/to/.npmrc
```

上述流程在设计时不会把真正的 token 设置到 `.npmrc` 文件中，因此可以防止 token 被泄露。接下来我们可以真正对发布版本进行 CD 的流程设计，如下所示：

``` yml
name: cd
on:
  push:
    branches:
      - demo/**

jobs:
  test:
    name: CD 执行流程
    runs-on: ubuntu-latest
    steps:
      - name: 下载 Github 仓库
        uses: actions/checkout@v4

      - name: 下载和安装 Node 环境
        uses: actions/setup-node@v3
        with:
          node-version: "16.x"
          # 一定要配置该参数，否则 cat $NPM_CONFIG_USERCONFIG 时会发现没有生成 .npmrc 配置文件，从而会导致发布需要登录认证而失败
          registry-url: "https://registry.npmjs.org"

      - name: 安装依赖
        run: npm ci

      - name: 代码校验
        run: npm run lint

      - name: 单元测试
        run: npm test

      - name: 测试报告
        uses: coverallsapp/github-action@v2

      - name: 文档构建
        run: npm run docs:build

      # 如果代码构建失败，则不需要进行文档部署
      - name: 代码构建
        run: npm run build

      # 部署文档
      - name: 部署文档
        uses: peaceiris/actions-gh-pages@v3
        with:
          # GTIHUB_TOKEN：https://docs.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token
          # Github 会在 workflow 中自动生成 GIHUBT_TOKEN，用于认证 workflow 的运行
          github_token: ${{ secrets.GITHUB_TOKEN }}
          # 执行 npm run docs 命令后默认会在该目录下生成静态资源
          publish_dir: ./docs/.vuepress/dist
          # 默认发布到 gh-pages 分支上，可以指定特定的发布分支
          # publish_branch: gh-pages1
          # https://github.com/peaceiris/actions-gh-pages#%EF%B8%8F-set-custom-commit-message
          # 设置上传到 gs-pages 分支的 commit 信息
          full_commit_message: ${{ github.event.head_commit.message }}

      # 基于构建的代码进行版本发布
      # cat $NPM_CONFIG_USERCONFIG 用于查看 CD 服务器上的 .npmrc 文件的内容
      - name: 发布库包
        run: |
          cat $NPM_CONFIG_USERCONFIG
          npm run release
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

此时提交代码后可以查看 CD 流程的[执行情况](https://github.com/ziyi2/micro-framework/actions/runs/6561431471/job/17821102605)，如下所示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30f36ef1b43c4620836a7de2d9edeba2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1173&h=1340&s=251884&e=png&b=22262a)

### 打标签

代码发布完成后，我们需要基于发布的版本自动打 Tag 标签。当然打标签的流程可以在 Github Actions 中处理，也可以在 `release.ts` 脚本中处理，由于实现的逻辑非常简单，本课程选择在 `release.ts` 中进行脚本设计，具体如下所示：

``` typescript
class Release extends Base {
  constructor() {
    super();
  }

  async run() {
    this.prepare();
    await this.check();
    this.release();
    // 打标签
    this.tag();
  }

  tag() {
    // 进入项目根目录
    shell.cd(this.rootPath);
    const packageJson = this.getPackageJson();
    // 获取发布的版本信息
    const version = packageJson?.version as string;
    if (
      // 本地打标签并上传到远程
      shell.exec(`git tag ${version}`).code !== 0 ||
      shell.exec(`git push origin ${version}`).code !== 0
    ) {
      // 遇到异常时都需要通过异常退出进程，从而可以使得 Github Actions 捕获异常，展示流程状态
      process.exit(1);
    }
  }
}

void new Release().run();
```

> 温馨提示：如果希望本地执行 `npm run release` 和远程的 CD 流程完全保持一致，那么可以将之前的测试报告和部署文档都在 `release.ts` 中通过脚本进行设计实现。

设计完成后，在执行 Github Actions 发布库包的同时会自动打标签，如下所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57a492b537ea4bb1bb09839c6f4cad83~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1021&h=696&s=118516&e=png&b=23272b)


### 实现 Pull Request 合并触发

在上述 CD 流程的设计中，我们屏蔽了 `release.ts` 中的 `check` 函数，从而先在 [demo/github-actions-cd](https://github.com/ziyi2/micro-framework/tree/demo/github-actions-cd) 分支进行了 Push 事件的测试，接下来我们需要真正实现基于 Pull Ruquest 进行 Master 分支的合并操作，确保合并之后可以触发 CD 流程的执行，从而可以真正实现我们设计的发布规则。

我们可以基于 `demo/github-actions-cd` 分支向 `master` 分支开启 Pull Request，当 CI 流程通过并且开发者 CR 通过后就可以进行 Merge 操作，Merge 到 `master` 分支之后我们希望可以自动触发 CD 流程的执行。需要注意的是，在 Github Actions 的工作流程只能在分支上进行触发，由于最终是向 `master` 分支合并代码，因此当 Pull Request 被合并后，会触发 `master` 分支的 Push 事件，并不存在特定的合并事件。因此我们可以对 `cd.yml` 进行如下更改：

``` yml
# .github/workflows/cd.yml
name: cd
on:
  # 其他分支的 Pull Request 被合并到 master 分支后会触发 Push 事件
  push:
    branches:
      - master
```

[开启 Pull Request 并 Merge Master 分支](https://github.com/ziyi2/micro-framework/pull/4)后，最终实现自动[触发 CD 流程](https://github.com/ziyi2/micro-framework/actions/runs/6574837506/job/17860691546)，如下所示：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f816ea2a8e94a05af754bf46fec5769~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1307&h=944&s=131818&e=png&b=22262a)

发布成功后，我们可以通过邮件来查看版本发布的信息：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9802685aba446ca8449e4b4f8212ae9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1307&h=944&s=282574&e=png&b=fefbfb)

> 温馨提示：如果在公司内部使用钉钉或者其他协同工具，那么也可以额外设计一些脚本或者 Action 实现版本发布的 IM 消息推送，从而实现更强的通知能力。


## 小结

在本课程中我们介绍了 CI / CD 的概念以及如何在 Github Actions 中设计库包开发的 CI / CD 流程，CI 的阶段主要关注提交代码的质量和正确性，通过代码校验、单元测试、文档构建和代码构建来确保提交代码的可靠性和功能正确性。CI 阶段的目标是在每次代码提交后，可以尽早的发现和解决问题，并保持代码库的稳定性。CD 阶段则主要关注将 CI 验证的代码进行构建、打包、发布和部署，该阶段的目标是自动化将可用的库包版本发布到 NPM 仓库中，并提供开发文档和更新日志，以便开发者了解版本变化和如何使用库包进行开发。

当然，CI 和 CD 流程并不是严格区分的，有时候 CI 阶段的一些操作可能会与 CD 阶段重叠，例如本课程涉及到的代码校验、单元测试，重要的是确保整个流程的自动化，并能够持续发布可靠的库包版本。

