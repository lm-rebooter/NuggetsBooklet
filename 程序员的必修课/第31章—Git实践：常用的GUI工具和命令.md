上一章，我们讲了`git`的工作流程和原理，本章我们就回到使用的层面，来看看日常工作中，该怎么使用`git`进行实操。

其实，就使用来说，我们可以把`git`的操作分为两类。

一类是用`GUI`工具的，这种看起来比较直观，比较简单，但是缺点就是耗内存，需要单独安装软件，有些场景下使用起来不是很方便。

另一类就是使用命令行的，这个刚用起来比较费劲，让人有想骂娘的冲动，但是时间久了就会觉得真香，而且不需要安装额外的软件，熟了之后你就会发现真方便。

本章我们就一起来看看这两类用法。


## SourceTree

GUI 工具中，最好用的应该就是`SourceTree`了，大家可以去[官网](https://www.sourcetreeapp.com/)下载对应的版本，这里就不废话了，我们直接下载完成安装即可。

我们安装完启动，就会看到如下画面：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da12714d6f5e4fc2abc3db2a38bf351d~tplv-k3u1fbpfcp-watermark.image?)

我们直接点击“新建” -> “添加已经存在的本地仓库”，然后选择我们上一章的`helloworld`项目目录即可，然后就会发现我们的项目已经列出来了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90f27bec1c9242ff905bc2b3717f7155~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a9044cd19294a4f81c3558ed6bb07d8~tplv-k3u1fbpfcp-watermark.image?)

然后我们打开我们的项目，随便修改一个文件，比如，修改我们的`.gitignore`文件，添加一行`/nm`，然后就会发现`sourcetree`中项目的目录右边有个 1，如下所示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58d151a7977a4083a64b27ba5c7618a4~tplv-k3u1fbpfcp-watermark.image?)

这就表示我们的项目有一个改动等待提交。

我们双击打开，如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d99ff3668ac34916a64d8bc71a3d5438~tplv-k3u1fbpfcp-watermark.image?)

其中最左边列出了我们项目的分支，上面是本地分支，可以看到当前只有一个`master`分支，并且有个小圆圈，这表示当前所在的分支就是`master`，下面有“远端”，表示远程的分支。中间列出了`.gitignore`文件，并且被打勾，表示已经暂存，右边列出了文件的改动，`-`表示删除了一行，`+`表示添加了一行。

现在，我们选中`.gitignore`文件，点击右键，选择“重置”，如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7d1e80c928a47c08af185ebcde860e7~tplv-k3u1fbpfcp-watermark.image?)

就会发现文件不提示了，其实，重置的意思就等于放弃修改，也就是把文件还原到上次提交后的状态。

这不是我们想要的，我们希望修改保留，但是不放在暂存区，怎么做呢？我们只需要取消文件前的打勾即可，如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f42798e1b4d49688ba967faa8f9fd66~tplv-k3u1fbpfcp-watermark.image?)

这就是取消暂存，等价于执行了`git rm --cached`命令，如果我们想要提交呢？

我们先勾选文件，让它变为暂存文件，然后在下方输入框中输入提交信息，点击右下方的“提交”即可提交，等价于执行了`git commit`；如果你同时勾选了下面的“**立即推送变更到 origin/master**”，则文件在提交的同时也会推送，等价于同时执行了`git push`。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/739953c1df384f45a943b37ba0bf9b61~tplv-k3u1fbpfcp-watermark.image?)

如下图：

*   1 代表提交信息。
*   2 代表提交。
*   3 代表同时推送到远程仓库。

好，我们执行完提交之后，再来看看历史记录，我们点击左侧的“历史”，就能在右边看到历史的提交记录，如下图：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e673430b87ce4ce9bd48b843dfadf08b~tplv-k3u1fbpfcp-watermark.image?)

我们选择任意的一个提交，下方就会列出提交的具体内容，如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/581dfedf1c2f4c8a954262c7a90d98af~tplv-k3u1fbpfcp-watermark.image?)

这样很方便以后的查找，当然，有些想偷偷摸摸干坏事的人，这里就要小心了，你的每一行代码都会记录在案，作为呈堂供词，千万别再胡写八写了。

有人说，提交我知道了，下载代码怎么弄呢？

我们关闭我们的仓库，回到`sourcetree`的首页，然后选择“新建” -> “从URL克隆”，这就会从你输入的地址下载代码，等价于我们上一章执行的`git clone`命令。

那么，要拉取变动的内容呢？

我们就可以选择左边的“远端” -> “拉取`origin/master`到`master`”：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1324f2d893d74a898154e5ab9991fcb8~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

这也就等价于执行了`git pull`指令。

好，到这里，你应该知道了`sourcetree`的每一个操作跟对应的指令的关系了。

其实说白了，`sourcetree`就是把指令实现的功能，用图形表示出来，提供一个可视化的操作方式，使用起来更直观、更方便而已。

当然，对于高手来说，命令是最好的、最快捷的。




## 终端命令

终端命令是装 x 耍帅必备的看家技能之一。一个程序员技术的高低，一方面取决于头发的稀少程度，另一方面就取决于终端命令的熟练程度。

不仅`Linux`有终端命令，我们的`git`也有很多终端命令，我们在这里就列出一些常见的命令，来提供给大家记忆并使用。

*   初始化命令 `git init`，将当前目录初始化为一个`git`目录。
*   克隆命令 `git clone xxxxxxx`，拉取远程仓库的代码到本地。
*   暂存命令 `git add xxx`，其中 xxx 是文件名，将对应文件添加到暂存区，如果将`xxx`换为`.`，就是将当前目录的所有文件添加到暂存区，并且 xxx 支持正则表达式。
*   撤销暂存命令 `git rm --cached xxx`，将 xxx 撤销暂存，同样可以替换为点号，同样支持正则表达式，下面的 xxx 都一样。
*   提交命令 `git commit -m "aaa"`，其中 aaa 为提交信息。
*   回退版本命令`git reset bbb`，用于将本地版本进行回退，其中 bbb 是你想要回退到的版本号，将`bbb`替换为`HEAD^`可以直接回退到上一个版本。`HEAD`后面`^`的个数表示回退的版本的个数，比如， `HEAD^^`就表示上上个版本。
*   推送命令`git push -u aaa bbb` 将本地仓库的代码推送到远端，其中 aaa 表示远程仓库，bbb 表示本地分支。其实，当我们已经提交过一次之后，我们就可以不再输入`aaa bbb`，而是直接使用`git push -u`即可。
*   拉取命令`git fetch`，拉取远程仓库的代码到本地。
*   合并命令`git merge aaa`，将当前分支的代码和 aaa 分支的代码合并，当然可能会出现冲突。
*   查看命令`git diff`，对比当前分支和合并分支的异同点。
*   拉取合并命令`git pull`，将远端仓库的代码拉取到本地并合并，等价于同时执行了`git fetch`和`git merge`。
*   查看状态命令`git status`，用得最频繁的一个命令，用来查看当前目录的状态。

接下来，我们就来看看分支命令：

*   新建分支 `git branch -xxx`，从当前分支新建一个分支 xxx。
*   切换分支 `git checkout xxx`，从当前分支切换到 xxx 分支。
*   从当前分支检出新分支：`git checkout -b xxxx`，xxx 是分支名，`b`是 branch 的简写，就表示分支，这其实就等于先新建分支，然后切换到新分支，等于同时执行了`git branch -xxx`和`git checkout xxx`这两条指令。
*   合并分支 `git merge xxx`，将当前分支和 xxx 分支合并。
*   删除分支 `git branch -d xxx`，将 xxx 分支删除。
*   查看分支 `git branch`，会列出本地的所有分支，如果加上参数`-a`，就会列出本地和远端的所有分支。如果加上参数`-v`，就会看到所有分支的最新一次的提交信息。

最后，也是我们最需要的，就是`log`命令：

*   查看提交记录 `git log`。
*   查看最近的 3 次提交 `git log -p -3`，其中`p`表示`param`，也就是参数的意思。
*   单行展示提交信息 `git log --pretty=oneline`。
*   格式化展示提交记录 `git log --pretty=format`。
*   以图表形式查看提交记录 `git log --graph`。

以上就是我们常用的命令，当然，git 有很多命令，大家在工作中都可以搜索出来，我们这里就不再废话了。



## git 分支

终于到了分支的部分了，其实，git 最重要的就是分支，如果没有分支，git 的存在也就没有什么意义了。

那么，什么是分支呢？

我们可以这么理解，我们的代码就像是向上生长的树，我们刚开始的代码就是树干，也就是`master`分支，随着时间的推移，我们开发了很多版本，就像树干生出了很多树枝，也就是`master`分支生出了很多很多的分支，这个时候，我们想要回到之前的某个版本上，我们直接切换到那个分支即可。

到这里，你应该明白了，分支就是一个个的代码版本，随着时间的推移，随着项目的发版和迭代，我们就拥有不同版本对应的不同代码，那么，每一个版本对应的代码都应该是一个分支。

我们可以在分支之间切换，也就是回到不同版本的代码上去。

好，我们就来实际操作一下。

首先打开我们上一章的`helloworld`项目，我们默认就是在`master`分支，现在，让我们从`master`分支创建一个新分支`test_branch1`出来，我们直接执行`git checkout -b test_branch1`即可，根据前面的命令，我们知道这是创建一个新分支并切换到这个分支。如果你想用`sourcetree`，你就直接点击顶部的“**分支**”。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24649643c0f54d74a64bd94ef6610537~tplv-k3u1fbpfcp-watermark.image?)

然后就回弹出如下一个创建新分支的提示框，直接输入`test_branch1`然后点击“**创建分支**”即可。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c8f4bd4fa9049a59e3531c0fdd778d2~tplv-k3u1fbpfcp-watermark.image?)

这样，我们就创建出了一个新分支，我们直接执行`git status`，发现打印如下:

    On branch test_branch1
    nothing to commit, working tree clean

这就意味着我们已经在`test_branch1`这个新分支上了。然后我们修改一下`hello.java`这个文件，添加一行文字`hello git`，然后提交一下。这样，我们的`test_branch1`分支上的`hello.java`就是带有`hello git`的，我们的`master`分支上的`hello.java`就是不带`hello git`的，我们可以切回到`master`分支验证一下。

那么，如果将来有一天，我想让`master`分支也跟`test_branch1`分支一样，都带有`hello git`的话，该怎么办呢？

这就要说到分支的合并了，我们直接切到`master`分支，然后执行`git merge test_branch1`，这样，就会将`test_branch1`上的提交合并到当前的`master`分支，如果我们没有针对同一个文件做修改，那么`git`会自动将所有的文件进行合并，如果我们对同一个文件做了修改，那么就会出现冲突，这个时候我们就需要手动解决下冲突了。

好，我们切换到`master`分支，在`hello.java`中添加一行文字`hello git2`，然后提交一下。

此时，我们的`master`分支是`hello git2`，我们的`test_branch1`分支是`hello git`，它们自己分别有改动，并且是针对同一个文件的，那么，现在我们让`master`分支合并一下`test_branch1`分支，我们直接执行命令:`git merge test_branch1`，或者在`sourcetree`上执行如下操作。

先选择顶部的“**合并**”：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77b5c97851b34809998b25e8c88d4f90~tplv-k3u1fbpfcp-watermark.image?)

然后在弹出框中选择“**合并已抓取**”，并选择`origin/test_branch1`分支（如果没有这个分支，就是没有 push，push 下就可以了）：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d54a892e2bd44d4194f33f36064a6f40~tplv-k3u1fbpfcp-watermark.image?)

此时，我们就会发现合并冲突，因为我们两个分支都修改了同一个文件，如下：

```
Auto-merging hello.java
CONFLICT (content): Merge conflict in hello.java
Automatic merge failed; fix conflicts and then commit the result.
```

此时，我们打开`sourcetree`，选择文件状态，就会看到文件被标记为感叹号，并且右边列出了冲突的内容：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0adbba916cb42b3bdc4b7af9b5736ca~tplv-k3u1fbpfcp-watermark.image?)

其中，感叹号表示冲突，右边的`<<<HEAD`和`=====`之间的内容表示**当前分支的改动**，而`=====`和`>>>>>`之间的内容表示**合并的分支的改动**，这里我们要手动处理下，我们把两行都保留即可，然后把`====`和`>>>`以及`<<<<`删除即可，如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb352e19c7b9443c818469de8c63e613~tplv-k3u1fbpfcp-watermark.image?)

可以看到，它告诉我们本次修改添加了一行`hello git`，我们注意到`hello.java`还是带有感叹号，这就需要我们手动把文件标记为**已解决**了，我们选中文件，右键点击，然后选择**解决冲突** -> **标记为已解决**。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e167d05f37a04adda5a362b01c6a0b28~tplv-k3u1fbpfcp-watermark.image?)


这样，我们的一次合并就完成了。

当然，如果两个分支没有修改同一个文件，那么`git`就会直接把我们的代码自动合并，也就不会有上述处理冲突的过程了。所以，我们要尽量避免**同时修改同一文件**。

怎么避免呢？那就要只添加不修改，遵循开放闭合原则，遵循 OCP 了。



## 总结

本章我们着重讲了`sourcetree`的操作，以及一些终端命令，最后，我们讲了分支的概念、分支的合并和冲突的解决方式，我们再来回顾下：

* `sourcetree`提供了一个 GUI 用来操作 git，操作直观，查看文件很方便。
* 终端命令不需要打开额外的软件，操作简便、高效、快速，但是不够直观，且不容易记忆。
* 分支代表着`git`的每个代码版本，我们可以切换不同的分支来回到历史版本。
* 分支的合并可能会出现冲突，所以我们要尽量避免修改同一个文件。

最后，在这里，我要鼓励下我们每个人多使用终端命令，或者说，我们对`git`的日常操作尽量用命令，只要合并不冲突，就尽量使用命令；当合并冲突的时候，再使用`sourcetree`等可视化工具来对比差异，从而进行修改。日久天长，锻炼的不仅仅是你的打字速度，同时也是你对`git`系统的认识。到最后你会发现，原来我们的编辑器、我们的操作系统、我们的计算机，全部都是跑在一套套的命令里面的。


这里我就不再废话了，本小册的所有技术层面的知识到这里就完事了，接下来的三个章节，我们就一起来返璞归真，大道至简，站在做人的层面来俯察下技术的真谛吧。




