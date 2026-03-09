## 前言

我们在[《实战篇 | React Notes | 国际化》](https://juejin.cn/book/7307859898316881957/section/7309112133474582578)介绍过，Next.js 项目实现国际化，目前有三个主流的技术选型：

1.  [next-i18next](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fi18next%2Fnext-i18next)
2.  [next-intl](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Famannn%2Fnext-intl)
3.  [next-translate](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Faralroca%2Fnext-translate)

本篇我们聊聊搭配这些技术选型使用的、做本地化管理的平台 —— Crowdin。

## Crowdin

Crowdin 是一个翻译和本地化管理平台，简单的来说，你可以在这个平台上传翻译文件、翻译校对、下载翻译文件等等，同时支持团队协作、提供质量保证工具、与多个工具集成等以完善翻译流程。

> 注：当然这类本地化翻译平台其实还蛮多的，这是一个关于本地化工具的[榜单](https://www.g2.com/categories/software-localization-tools)。

Crowdin 算是比较主流的工具。之所以讲解这个平台：

1.  Next-js-Boilerplate 用的就是 Crowdin，且配置代码已经写好，可直接使用

> 注：当然之所以使用 Crowdin ，很有可能 Crowdin 是项目 Sponsor 的缘故

2.  Node.js 的新官网便是用的 Crowdin 实现本地化翻译，参考[《Diving into the Node.js Website Redesign》](https://nodejs.org/en/blog/announcements/diving-into-the-nodejs-website-redesign)

### 1. 创建项目

打开 [https://crowdin.com](https://crowdin.com/profile)，注册账号后进入创建项目页面：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f17fecac7e34b85a21fd49735ad0e73~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3742\&h=1264\&s=523376\&e=png\&b=fefefe)

先不着急创建项目，这类平台往往都可以设置中文界面。

点击右上角的头像，进入 `Settings`，找到 `Language & Region`：

![截屏2024-06-13 17.54.43.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4708adcc6b24a7fbc7a20a3510d734a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3740\&h=988\&s=213614\&e=png\&b=ffffff)

选择“简体中文”，便会跳转到中文界面：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ef2172e85b849b5b192e8b13f2c7410~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3750\&h=944\&s=362489\&e=png\&b=ffffff)

点击“创建项目”，创建一个测试项目：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbabdb9393be4ea49ce72b2bf6da482d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3304\&h=2122\&s=459204\&e=png\&b=ffffff)

这里源语言选择了英语，因为作为示例展示，我们想把原本 Next-js-Boilerplate 中的英文（en.json）自动翻译为中文（zh.json）。

如果自己的项目原本是中文，想要翻译成其他语言做国际化，那源语言就选择中文。

### 2. AI 翻译设置

平台可以手动上传待翻译的文件，也可以与工具集成，集成后比如可以直接在 VSCode 上传文件。

我们先演示下如何手动上传一个翻译文件，熟悉下整个翻译流程。

找到 Next-js-Boilerplate 中的 `src/locales/en.json`文件，在 「原文」页面上传：

![截屏2024-06-13 18.21.32.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46b3fed919094b25964edcdd788374ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2910\&h=1548\&s=336388\&e=png\&b=ffffff)

上传文件后，可以在「主页」看到一条目标是简体中文的翻译任务：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a81c2473e3b5483182223c61f89c24f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3980\&h=1512\&s=403943\&e=png\&b=ffffff)

这样一条翻译任务，目前进度为 0%，你需要先翻译，后校对（批准），才算是完成这条翻译任务（进度 100%）。

CrowdIn 中的机器翻译和 AI 翻译都需要借助对应平台的 API 密钥，比如使用谷歌翻译就需要用到谷歌翻译 API 的密钥。

这里我们选择 AI，然后自备一个 GPT3.5 的 Token，开启 OpenAI  提供商：

![截屏2024-06-13 18.28.12.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31baa50f58a046eb90174daab4982cce~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3966\&h=952\&s=219702\&e=png\&b=fefefe)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e3c802a241048f1a5af53d54bfb3ca1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3964\&h=1644\&s=327287\&e=png\&b=ffffff)

添加提示词：

![7.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ba3c9f684784b06ba6505621257c1ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1981\&h=766\&s=670447\&e=gif\&f=121\&b=fefefe)

> 注：如果是 GPT 3.5，注意不要勾选 ScreenShots

### 3. 翻译校对

回到项目界面，使用 AI 进行预翻译：

![8.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99da2160f0244970a80731bcf9b00a40~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2042\&h=924\&s=437773\&e=gif\&f=78\&b=fdfdfd)

预翻译成功后会出现提示界面：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f6f28c1bb5f4a1ea5297174262155b0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4086\&h=1698\&s=593786\&e=png\&b=969696)

此时翻译任务的状态也发生了变化：

![截屏2024-06-13 18.42.13.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b97e7ea74bdc4d56826a9b40bb6f6fcb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4086\&h=1552\&s=438793\&e=png\&b=ffffff)

点击“校对”，就会进入 Crowdin 的翻译编辑器界面：

![截屏2024-06-13 18.46.15.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e34cc632c82f473f8024e8bb6805a535~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4088\&h=2088\&s=774555\&e=png\&b=ffffff)

可以看到编辑器会列出翻译的原文和翻译后的文案，右侧还提供了建议翻译。

修改完毕后，我们勾选所有的条目，点击对号，表示校对完成。

校对完成后，这个翻译任务就算完成。回到项目界面，下载翻译完成的文件：

![截屏2024-06-13 18.51.35.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d7fdbd31bfe436ca2f47dc36ffb92e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4082\&h=1610\&s=385705\&e=png\&b=ffffff)

打开翻译文件：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ca25388ef524ddc90c87e4beb09d1d2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2934\&h=1520\&s=409515\&e=png\&b=1e1e1e)

我们把文件更名为 `zh.json`即可放入 Next-js-Boilerplate 使用。

就这样我们实现了一个翻译文件的翻译、校对工作，相信大家也对 CrowdIn 的使用流程有了一个大致的了解。

### 4. 与 VSCode 集成

Crowdin 实现了与 500+ 应用程序和工具集成，我们演示下如何与 VSCode 进行集成，即通过 VSCode 编辑器实现文件上传和下载。

点击项目页面的「集成」，点击「浏览集成」，搜索 「VSCode」，点击搜索结果：

![截屏2024-06-13 19.08.51.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c5d16171056482d8eab29fc85056047~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3536\&h=1584\&s=319204\&e=png\&b=989898)

此时会跳转到具体的 VSCode 插件介绍页面：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e77a17a944340738a227a3c7e9cf8a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4050\&h=1428\&s=503263\&e=png\&b=ffffff)

注：这只是介绍下如何查找与 CrowdIn 集成的工具和安装方法。其实这个 Crowdin VSCode 插件可以直接在 VScode 插件面板搜索安装：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/468f331fb22b4aa3a4ef8049e09766b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1874\&h=442\&s=78385\&e=png\&b=232323)

Crowdin 会自动搜索工作区的 Crowdin 配置文件（crowdin.yml），并将内容显示在单独的 Crowdin 面板：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96c28e00fd904426ac1e48bac4a84fc5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2658\&h=1370\&s=370538\&e=png\&b=202020)

当然刚安装的时候，因为配置没有完成，所以面板里不会显示任何内容。我们还需要进行一些认证和配置。

打开 VSCode 编辑器，Command + Shift + P 打开命令面板：

1.  输入 `Crowdin: Sign In` 登录 Crowdin 账户（注意登录时需要邮箱认证过的账号）
2.  输入 `Crowdin: Select Project` 选择 Crowdin 项目

打开 Next-js-Boilerplate 项目代码，打开 `crowdin.yml`文件，注释掉 `base_url`这一行（这是企业版会用到的）：

```yaml
# "base_url": "https://api.crowdin.com"
```

此时 Crowdin 面板应该已经能正常显示出需要翻译的文件：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95b503c80ba5403c99569dc92fdef854~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2658\&h=1370\&s=370538\&e=png\&b=202020)

Crowdin 面板具体分为 3 块内容，UPLOAD 负责上传待翻译文件，DOWNLOAD 负责下载翻译后的文件，PROGRESS 负责追踪翻译进度。

为了防止混淆，我们在平台上删除掉之前上传的 en.json 文件，并删除本地的 zh.json 文件，在这里再重新翻译一遍。

首先是在 UPLOAD 区上传待翻译文件：

![截屏2024-06-14 00.02.29.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5d065a2f3d9437e8409114b6dfa3d8d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2940\&h=862\&s=221003\&e=png\&b=212121)

上传完毕后，就可以在平台查看到上传的文件：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89498854b56a453ea66ce8583809c0df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3406\&h=976\&s=164183\&e=png\&b=fefefe)

然后按照之前的流程，使用 AI 翻译并批准完成，将翻译的进度推进到 100%。

最后在 DOWNLOAD 区下载翻译后的文件：

![截屏2024-06-14 00.04.38.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed123d388aa1498494160dd162e4285f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2778\&h=1232\&s=285458\&e=png\&b=202020)

Crowdin 会下载翻译后的文件，并自动生成一个新的名为 `zh.json`的文件：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e51b50355b894c45a5466726d4de77d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2004\&h=506\&s=101658\&e=png\&b=1e1e1e)

当然之所以会如此实现，其实是因为我们的 `crowdin.yml` 配置文件中指定了翻译文件的位置和命名方式。

通过与 VSCode 集成，待翻译文件的上传和翻译文件的下载都可以直接在编辑器中完成，确实便捷了一些。

## Next-js-Boilerplate

### 1. 与 GitHub Actions 集成

Next-js-Boilerplate 的实现则更加便捷一些，它结合了 GitHub Actions，当你将代码提交到 GitHub 的时候，GitHub Actions 会自动同步 Crowdin 的本地化文件，同时创建一个新分支用于合并。

具体是什么效果呢？比如你已经在 Crowdin 平台完成了 `en.json` 的中文翻译，你不需要下载翻译后的文件，只需要正常提交 `en.json`文件：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44f71d85ea7048489bb86ab99ba2227c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2466\&h=754\&s=130671\&e=png\&b=0f1217)

GitHub Actions 会自动创建一个分支，将翻译后的文件写入代码并提交，你只需要处理分支合并就行：

![截屏2024-06-14 01.47.46.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97102d21c71e4c85bcb0b7ccc9a04668~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3458\&h=1162\&s=240390\&e=png\&b=0e1116)

### 2. 配置代码解析

实现这段功能的代码在 `.github/workflows/crowdin.yml`文件：

```yaml
name: Crowdin Action

on:
  push:
    branches: [ main ] # Run on push to the main branch
  schedule:
    - cron: "0 5 * * *" # Run every day at 5am
  workflow_dispatch: # Run manually

jobs:
  synchronize-with-crowdin:
    name: Synchronize with Crowdin
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: crowdin action
        uses: crowdin/github-action@v1
        with:
          upload_sources: true
          upload_translations: true
          download_translations: true
          localization_branch_name: l10n_crowdin_translations
          create_pull_request: true
          pull_request_title: 'New Crowdin Translations'
          pull_request_body: 'New Crowdin translations by [Crowdin GH Action](https://github.com/crowdin/github-action)'
          pull_request_base_branch_name: 'main'
          commit_message: 'chore: new Crowdin translations by GitHub Action'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          CROWDIN_PROJECT_ID: ${{ secrets.CROWDIN_PROJECT_ID }}
          CROWDIN_PERSONAL_TOKEN: ${{ secrets.CROWDIN_PERSONAL_TOKEN }}

```

这段代码并不复杂，主要是各种声明：

1.  `branches: [ main ]`表示推送到 main 分支的时候才运行此 Actions
2.  `uses: crowdin/github-action@v1`表示使用 Crowdin 提供的 [actions 代码](https://github.com/crowdin/github-action/tree/v1/)进行处理，简单来说，就是核心功能已经实现好了，你还需要配置一些变量。
3.  `upload_sources: true`表示上传待翻译文件
4.  `download_translations: true`表示下载翻译文件
5.  `localization_branch_name`表示要创建的分支名
6.  `commit_message`表示下载翻译后的文件并提交代码，提交的 commit\_message
7.  `pull_request_title`表示 PR 的 title
8.  `pull_request_base_branch_name: 'main'`表示基于 main 分支创建 PR

> 当然还有其他配置声明，参考 <https://github.com/crowdin/github-action/tree/v1/>

### 3. 配置方法

为了能够让这个 Action 生效，首先你要获得 `CROWDIN_PROJECT_ID` 和 `CROWDIN_PERSONAL_TOKEN` 的值。

> 注：GITHUB\_TOKEN 不需要，GitHub 会自动生成

`CROWDIN_PROJECT_ID` 的值在项目主页即可查到：

![截屏2024-06-14 11.28.15.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42e26e1ecf2a47f48a02e093bdf5acbc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3816\&h=1062\&s=225358\&e=png\&b=ffffff)

`CROWDIN_PERSONAL_TOKEN` 则需要到个人设置里生成：

![截屏2024-06-14 11.29.48.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/797131e06a9548199d00513130f0cb5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2664\&h=1516\&s=320508\&e=png\&b=ffffff)

然后因为涉及到 PR 的创建，所以需要添加 Actions 的权限：

![截屏2024-06-14 11.32.30.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60b53b97693f4f88948efc10b1aaaee8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3164\&h=2302\&s=722483\&e=png\&b=ffffff)

最后添加 GitHub Secrets：

![截屏2024-06-14 11.34.47.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1026d76b2204d6d92facf6a2b2dcc8b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3182\&h=1910\&s=555070\&e=png\&b=ffffff)

### 4. 运行效果

此时再将代码提交到 main 分支，GitHub 会自动运行 Crowdin Actions，同步 Crowdin 数据，并创建新的本地化分支：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/442e52546b8e4f23a5879e78dedf64e2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4180\&h=1140\&s=388344\&e=png\&b=ffffff)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/912cec09b5064a5293712378040a848d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3594\&h=644\&s=170196\&e=png\&b=ffffff)

## 总结

Crowdin 是一个不错的本地化管理平台，同时支持多人协作，所以也很适合中大型团队使用。

Crowdin 的中文知识库地址：<https://support.crowdin.com/zh/translation-process-overview/>