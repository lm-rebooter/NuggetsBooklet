前面的 5 个章节，我们已经把一个项目的完整生命周期走了一遍，从需求分析开始，到项目的复盘，我们已经经历了一个完整项目的开发流程。

不对不对，并不完整，你见过开发中不用提交代码的程序员吗？没有版本控制的代码安全感何在？程序员直接删库跑路怎么办？

这肯定是不行的，所以我们要学习版本控制，那么，本章我们就开始来学这些东西。让你的代码不再随着电脑走，而是随着心情走，说白了就是放在云端，你可以随时随地拉取。

好，我们就开始正题。

## 版本控制工具

自太古以来，版本控制工具有两个，一个叫做`SVN`，一个叫做`Git`，日久天长，`Git`把`SVN`干死了，所以现在我们见到的大多数版本控制都是`Git`，`SVN`已经少生优生幸福一生了。

版本控制工具是用来干啥的呢？

就是用来控制版本的。

比方说，我写了一首诗：辣条真好吃，夹馍更好吃。

然后呢，我觉得不太好，想改改，但是又不能肯定能改得更好，所以想先保存下来，那咋弄呢？

嗯，简单，我就把这首诗拍个照片保存下来，然后重新写，万一写得不好就把这照片拿出来直接在上面改就行。

这就叫做版本控制：**每次有改动，就拍个照片存起来，将来有一天想反悔，就可以找到旧照片，在旧照片上面改就行了**。

`Git`的工作原理就跟这个类似，只不过我们叫照片，`Git`叫快照，嗯，反正差不多。


## Git 的工作原理

要了解`Git`的工作原理，我们首先来了解下仓库的概念。

对于`Git`来说，我们可以将我们的工作空间分为四个区域。

*   工作区：我们的代码存放的区域，比如你在`c:/workspace/helloworld`目录下写代码，那么这个目录就是工作区。
*   暂存区：当你在工作区执行了`git add`之后，被`add`的文件就在暂存区了。
*   本地仓库区：当你执行了`git commit`之后，被`commit`的文件就在本地仓库区了。
*   远程仓库区：当你执行了`git push`之后，被`push`的文件就在远程仓库区了。

> 其实，我们实际只有本地和远端两个区域，也就是只有工作区和远程仓库区两个区域，而暂存区和本地仓库区，是我们虚拟出来的。

举个例子：我要给玉皇大帝写封信。

首先，我肯定用信纸写信，那么，我正在写的那个信纸，就是工作区；等我写完后，我就放在信封里，信封就是暂存区；等我都写完了，我就装进信封放在信箱里，这个信箱，就是本地仓库区；然后等邮递员把信取走送到邮局，这个邮局，就是远程仓库区。

现在，我们打开编辑器，新建一个项目叫做`helloworld`，它存放在`c/workspace/helloworld`，然后我们在这个目录下执行命令： `git init`，这个目录下就多了一个隐藏文件夹`.git`，这个目录就变成了一个 git 目录，也就可以在这里面进行 git 对应的操作了。

好，现在我们新建一个文件`test.java`，然后执行`git status`（查看当前 git 的状态），就会看到如下提示：

    on branch master

    No commits yet

    Untracked files:
            (use "git add <file>..." to include in what will be committed)
    hello.java

    nothing added to commit but untracked files present (use "git add" to track)

*   第一行的意思是：你当前在`master`分支。
*   第二行的意思是：当前没有提交。
*   接下来的三行的意思是：`hello.java`没有被跟踪，可以使用`git add`来添加，添加后的文件就会被跟踪，也就是会被版本控制。
*   最后一行的意思是：没有文件被添加，但是存在没有被跟踪的文件，可以使用`git add`来跟踪。

当我们初始化一个`git`目录时，会默认创建一个叫做`master`的分支（分支的概念我们下一章节再说）。我们可以这么理解：分支就是一个文件夹，我们在某个分支上开发，就等于代码放在一个文件夹下。

那么，什么是跟踪呢？

跟踪指的就是：这个文件要不要进行版本控制。如果不进行跟踪，就是不进行版本控制，那么，后面你对这个文件的所有改动，git 都不进行记忆，可以理解为：拍照片时把你抹掉，不记录你的历史状态。那么，就无法把你还原到之前的状态。

所以，我们可以执行`git add hello.java`来跟踪这个文件，然后再执行`git status`，就会看到如下提示：

    On branch master

    No commits yet

    Changes to be committed:
            (use "git rm --cached <file>..." to unstage)
            new file:   hello.java

前两行我们不废话了，我们只看后三行。

它的意思是：改动等待被提交，可以使用`git rm --cached`撤销暂存，新文件`hello.java`。

用人话说就是：有个新文件被暂存了，也就是可以提交了，可以使用`git rm --cached`撤销暂存。

如果我们执行`git rm --cached hello.java`撤销暂存会怎么样子呢？

嗯，它就会变成未跟踪状态，也就是我们刚新建文件之后的状态。好，我们直接执行`git commit -m "添加文件"`来将这个文件提交一下，发现如下信息:

    [master (root-commit) 837dd77] 添加文件
    1 file changed, 0 insertions(+), 0 deletions(-)
    create mode 100644 hello.java

它的意思就是：`master`分支的代码已经被提交，提交的 id 是`837dd77`，提交的信息是"添加文件"，1 个文件改动，0 个插入，0 个删除。

然后，我们再执行`git status`来看下：

    On branch master
    nothing to commit, working tree clean

意思很简单：当前位于`master`分支，没有需要提交的，工作区很干净。

那么，一次提交就完成了。

等等，你这些操作好像都是本地操作，并没有涉及到网络啊，既然有远端仓库，肯定要涉及到网络啊。

没错，我们来创建一个远程仓库，这里我们使用 [Gitee](https://gitee.com/)，我们在`Gitee`中选择新建仓库：

<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afd4ddeb5c7f405f8f1a459532e7d742~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

然后输入仓库名`HelloWorld`，点击“创建”，就会自动生成一个远程仓库，并提示如下页面：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1135dcde811548968a47128b4037265f~tplv-k3u1fbpfcp-watermark.image?)

我们使用`git config --global user.name`和`git config --global user.email`配置下用户名和邮箱，记得邮箱要验证下。

然后，我们直接在我们的项目目录下执行: `git remote add origin xxxxx`，将 xxxxx 替换为你的远程仓库，这就等价于为本地仓库配置了一个远程仓库，远程仓库就是刚刚创建的`HelloWorld`仓库。

然后我们执行`git push -u origin master`，也就是将本地仓库的代码上传到远程仓库，发现提示如下：

    Enumerating objects: 3, done.
    Counting objects: 100% (3/3), done.
    Writing objects: 100% (3/3), 293 bytes | 293.00 KiB/s, done.
            Total 3 (delta 0), reused 0 (delta 0)
    remote: Powered by GITEE.COM [GNK-6.4]
    To https://gitee.com/xxxxxx/Helloworld.git
            * [new branch]      master -> master
    Branch 'master' set up to track remote branch 'master' from 'origin'.

这就是本地代码上传成功了。

好，我们刷新下`Gitee`的页面看看，就会发现如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9e59b69ed2e4da3add6f26b4461c6ee~tplv-k3u1fbpfcp-watermark.image?)

其中可以看到我们提交的文件、提交的信息，以及提交的时间。

好，我们点击右边的**克隆/下载**，然后选择`Https`，点击复制，如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c123c9e85b414bcbb85e4e37c0acf90b~tplv-k3u1fbpfcp-watermark.image?)

然后我们在电脑上新建一个目录，在终端打开并跳转到这个目录中，执行命令`git clone xxxx`，其中`xxx`就是我们刚刚复制的地址，直接粘贴即可，就会发现它开始下载了，如下：

    Cloning into 'Helloworld'...
    remote: Enumerating objects: 3, done.
            remote: Counting objects: 100% (3/3), done.
            remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
    Unpacking objects: 100% (3/3), done.

这就表示我们已经把远程仓库的代码下载下来了，我们可以直接使用这个代码了。

好，到这里，相信你已经可以上传并下载代码到`Git`了，那么，刚刚的那些`git add`、`git commit`、`git push`操作，你是不是感觉有点乱呢？

我们这里就来梳理下。

我们上面说过，我们的工作空间分为四个区，并且任何一个新文件都在工作区，我们就来列一下执行相关指令后代码的状态和区域。

*   工作区：执行`git add`就到暂存区。
*   暂存区：执行`git rm --cached`就还原到工作区，执行`git commit`就到本地仓库区。
*   本地仓库区：执行`git reset`就还原到暂存区，执行`git push`就到远程工作区。
*   远程仓库区：执行`git clone`将整个仓库下载到本地，或者执行`git pull`将变化的部分下载到本地。

我们把流程整理如下图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c140636504d49d9bf870b89ce1f1bd7~tplv-k3u1fbpfcp-watermark.image?)

那么，这些我都懂了，但是有的代码我不想被跟踪呢？比如我的本地配置文件。

你可以不`git add`啊。

这样太麻烦了，它老是提示，烦死了。

嗯，那我们就可以使用`gitignore`文件了。



## gitignore 文件

> gitignore 文件，顾名思义，就是 git 忽视文件，让你的文件可以被 git 无视，从而不进行跟踪。

gitignore 文件的规则如下：

*   所有空行或者以 ＃ 开头的行都会被 Git 忽略。
*   可以使用标准的 glob 模式匹配。
*   匹配模式可以以（/）开头防止递归。
*   匹配模式可以以（/）结尾指定目录。
*   要忽略指定模式以外的文件或目录，可以在模式前加上惊叹号（!）取反。

我们可以直接看[官方的模版](https://github.com/github/gitignore)。

我们在`helloworld`目录下新建一个`.gitignore 文件`，然后添加如下内容：

    world.java
    /nb

这个就意味着我们的`world.java`文件会被无视，并且`/nb`目录也会被无视，然后我们在项目中创建`world.java`文件，紧接着再执行`git status`命令，发现输出如下：

    On branch master
    Your branch is up to date with 'origin/master'.

    Untracked files:
            (use "git add <file>..." to include in what will be committed)
            .gitignore

    nothing added to commit but untracked files present (use "git add" to track)

嗯，只有`.gitignore`文件提示了，`world.java`并没有被提示，然后我们再创建`nb`文件夹，发现还是这样。

我们再把`.gitignore`文件中的`world.java`删除，再执行`git status`命令，发现`world.java`文件又被提示了。

到这里，我们已经明白了`gitignore`文件的用法了，这里就不再废话了。



## 总结

本章，我们简单地介绍了`git`的工作流程，以及`git`工作区的概念，并且我们梳理了文件在不同区域之间的流转，最后，我们介绍了`gitignore`文件的使用，我们再来回顾下。

*   `git`有四个区域：工作区、暂存区、本地仓库区、远程仓库区。
*   工作区：执行`git add`就到暂存区。
*   暂存区：执行`git rm --cached`就还原到工作区，执行`git commit`就到本地仓库区。
*   本地仓库区：执行`git reset`就还原到暂存区，执行`git push`就到远程工作区。
*   远程仓库区：执行`git clone`将整个仓库下载到本地，或者执行`git pull`将变化的部分下载到本地。
*   `gitignore`可以用来对文件进行无视，从而让`git`不跟踪对应的文件。

其实，我们只需要牢牢记住一条指令——`git help`——即可，任何时候，如果你忘了该怎么操作，只要执行一下这条指令，你就知道下一次该干什么了。

最后，再给大家推荐一本免费的书籍 [Git pro](https://www.progit.cn/#_pro_git)，有空可以看看，你对`git`的认识就会大大提高。

我们下一章节就来讲一下`git`的 GUI 工具和分支的操作，我们下一章见。
