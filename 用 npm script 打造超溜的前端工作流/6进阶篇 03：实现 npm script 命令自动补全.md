# 2.3 实现命令行自动补全

当 npm script 里面积累的命令越来越多时，重度命令行用户肯定会好奇，能不能实现类似 bash、zsh 里面的命令自动补全？答案是肯定的，下面来逐一介绍。

## 使用 npm run 直接列出

前面章节有过介绍，不带任何参数运行 npm run 能列出 scripts 对象中定义的所有命令，再结合管道操作符、less 命令（这里的 less 不是 css 领域的 less，而是 linux 里面的工具），即使 scripts 子命令很多我们也能移动自如。

比如，我们在项目中执行：`npm run | less`，得到如下结果，注意截图左下方的红框，按空格能翻页：

![](https://user-gold-cdn.xitu.io/2017/12/3/1601bcdae64f00ea?w=1094&h=715&f=png&s=101307)

在这个结果里面，我们可以进行类似于 Vim 中的搜索，先按 `/` 进入搜索模式，然后输入 `markdown`，搜索结果如下图：

![](https://user-gold-cdn.xitu.io/2017/12/3/1601bcdd6b736441?w=1100&h=399&f=png&s=59941)

## 把 npm completion 集成到 shell 中

npm 自身提供了自动完成工具 [completion](https://docs.npmjs.com/cli/completion)，将其集成到 [bash](https://www.gnu.org/software/bash) 或者 [zsh](https://github.com/robbyrussell/oh-my-zsh) 里也非常容易（顺便说一句，早期我是 bash 的忠实用户，两年前切换到 zsh，就再也没回头）。

官方文档里面的集成方法如下：

```bash
npm completion >> ~/.bashrc
npm completion >> ~/.zshrc
```

> **TIP#10**：如果你好奇上面的命令究竟做了什么，尝试直接运行 `npm completion`，就能看到它其实在你的配置文件中追加了一大坨 shell。上面命令中的 `>>` 意思是把前面命令的输出追加到后面的文件中。

如果你也有代码洁癖，为了保持 .zshrc 或者 .bashrc 文件的整洁，可以用下面的方法：

第 1 步，把 npm completion 产生的那坨命令放在单独的文件中：

```bash
npm completion >> ~/.npm-completion.bash
```

第 2 步，在 .bashrc 或者 .zshrc 中引入这个文件：

```bash
echo "[ -f ~/.npm-completion.bash ] && source ~/.npm-completion.bash;" >> ~/.bashrc
echo "[ -f ~/.npm-completion.bash ] && source ~/.npm-completion.bash;" >> ~/.zshrc
```

> **TIP#11**：执行完上面的命令一定要记得 `source ~/.zshrc` 或者 `source ~/.bashrc`，来让自动完成生效。

接下来我们就可以尽情享受自动完成带来的便利了，尝试在命令行中输入 npm run，**然后键入空格（空格很重要）**，然后键入 tab 键，发现命令行有什么反应了么？在列出备选项之后，继续按 tab，就能在不同的选项之间切换，找到自己想要的，直接回车就能完成命令补全。多练习几次，你的手指和大脑就能熟练掌握这个过程。

在我们的项目目录里面键入 `npm run cov` 再键入 tab 键，命令行又有什么反应？

需要单独说明的是，npm completion 能实现的自动完成不仅仅是 scripts 里面的子自命令，npm 的子命令也是可以的，可以依次输入 `npm`、空格、tab，看看命令行的反应。

## 更高级的自动完成

人类对于效率的追求是永无止境的，工程师更是如此，npm 命令补全到目前为止显然还不够高效，能不能补全 package.json 里面的依赖名称？能不能在补全 npm script 的时候列出这个命令是干啥的？

有人已经帮我们解决了这个痛点，还写成了 zsh 插件（bash 的同学无福消受了）：[zsh-better-npm-completion](https://github.com/lukechilds/zsh-better-npm-completion)，它有以下几个让人无法拒绝的便利：

### 1. 在 npm install 时自动根据历史安装过的包给出补全建议

![](https://user-gold-cdn.xitu.io/2017/12/3/1601bce81ef5dac6?w=1267&h=249&f=png&s=65352)

### 2. 在 npm uninstall 时候根据 package.json 里面的声明给出补全建议

![](https://user-gold-cdn.xitu.io/2017/12/3/1601bcec1c11549f?w=1263&h=114&f=png&s=26712)

### 3. 在 npm run 时补全建议中列出命令细节

![](https://user-gold-cdn.xitu.io/2017/12/3/1601bcf08dc06346?w=1256&h=331&f=png&s=78999)
![](https://user-gold-cdn.xitu.io/2017/12/3/1601bcf1e3a37f16?w=1263&h=222&f=png&s=49982)

看到这里，是不是心痒痒？具体的安装方法参照官方 [README.md](https://github.com/lukechilds/zsh-better-npm-completion) 文件就好，我就不在这里啰嗦了。

> **TIP#12**：如果你要使用 zsh-better-npm-completion 插件，需要把 .bashrc、.zshrc 文件里面 npm completion 部分的配置删掉，避免冲突。

------------------------------------------------
**好了，本小节没有代码，读到这里，你动手做了几个？**

------------------------------------------------

## 20171206 增补：如何实现 yarn 的命令自动补全？

已经有人帮我们做好了 [yarn-completions](https://github.com/mklabs/yarn-completions)，能实现类似于 zsh-better-npm-completion 的命令补全，参照官方 README.md 安装即可。