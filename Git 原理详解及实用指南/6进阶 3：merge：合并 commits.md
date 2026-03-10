# 进阶 3：merge：合并 commits

前面说到，`pull` 的内部操作其实是把远程仓库取到本地后（使用的是 `fetch`），再用一次 `merge` 来把远端仓库的新 `commits` 合并到本地。这一节就说一下，`merge` 到底是什么。

## 含义和用法

`merge` 的意思是「合并」，它做的事也是合并：指定一个 `commit`，把它合并到当前的 `commit` 来。具体来讲，`merge` 做的事是：

**从目标 `commit` 和当前 `commit` （即 `HEAD` 所指向的 `commit`）分叉的位置起，把目标 `commit` 的路径上的所有 `commit` 的内容一并应用到当前 `commit`，然后自动生成一个新的 `commit`。**

例如下面这个图中：

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2a9c60eca3?w=484&h=457&f=jpeg&s=24531)

`HEAD` 指向了 `master`，所以如果这时执行：

```shell
git merge branch1
```

Git 会把 `5` 和 `6` 这两个 `commit` 的内容一并应用到 `4` 上，然后生成一个新的提交，并跳转到提交信息填写的界面：

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2aaa2dae15?w=513&h=128&f=jpeg&s=41756)

`merge` 操作会帮你自动地填写简要的提交信息。在提交信息修改完成后（或者你打算不修改默认的提交信息），就可以退出这个界面，然后这次 `merge` 就算完成了。

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2aad5a0279?w=640&h=454&f=gif&s=175263)

## 适用场景

`merge` 有什么用？最常用的场景有两处：

1. 合并分支

   当一个 `branch` 的开发已经完成，需要把内容合并回去时，用 `merge` 来进行合并。

   > 那 `branch` 又应该怎么用呢？
   >
   > 下节就说。

2. `pull` 的内部操作

   之前说过，`pull` 的实际操作其实是把远端仓库的内容用 `fetch` 取下来之后，用 `merge` 来合并。

## 特殊情况 1：冲突

`merge` 在做合并的时候，是有一定的自动合并能力的：如果一个分支改了 A 文件，另一个分支改了 B 文件，那么合并后就是既改 A 也改 B，这个动作会自动完成；如果两个分支都改了同一个文件，但一个改的是第 1 行，另一个改的是第 2 行，那么合并后就是第 1 行和第 2 行都改，也是自动完成。

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2a9d759d8e?w=660&h=402&f=gif&s=259881)

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2a9c151a4c?w=636&h=418&f=gif&s=584533)

但，如果两个分支修改了同一部分内容，`merge` 的自动算法就搞不定了。这种情况 Git 称之为：冲突（Conflict）。

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2a9c2ce4d3?w=521&h=425&f=jpeg&s=36538)

直白点说就是，你的两个分支改了相同的内容，Git 不知道应该以哪个为准。如果在 `merge` 的时候发生了这种情况，Git 就会把问题交给你来决定。具体地，它会告诉你 `merge` 失败，以及失败的原因：

```shell
git merge feature1
```

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2af3e40342?w=539&h=80&f=jpeg&s=40925)

提示信息说，在 `shopping list.txt` 中出现了 "merge conflict"，自动合并失败，要求 "fix conflicts and then commit the result"（把冲突解决掉后提交）。那么你现在需要做两件事：

1. 解决掉冲突
2. 手动 `commit` 一下

### 1. 解决冲突

解决掉冲突的方式有多个，我现在说最直接的一个。你现在再打开 `shopping list.txt` 看一下，会发现它的内容变了：

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2af5b06ef6?w=180&h=158&f=jpeg&s=21719)

可以看到，Git 虽然没有帮你完成自动 `merge`，但它对文件还是做了一些工作：它把两个分支冲突的内容放在了一起，并用符号标记出了它们的边界以及它们的出处。上面图中表示，`HEAD` 中的内容是 `移动硬盘（已买）`，而 `feature1` 中的内容则是 `移动硬盘（不买了）`。这两个改动 Git 不知道应该怎样合并，于是把它们放在一起，由你来决定。假设你决定保留 `HEAD` 的修改，那么只要删除掉 `feature1` 的修改，再把 Git 添加的那三行 `<<<` `===` `>>>` 辅助文字也删掉，保存文件退出，所谓的「解决掉冲突」就完成了。

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2affe97f50?w=146&h=79&f=jpeg&s=11799)

你也可以选择使用更方便的 `merge` 工具来解决冲突，这个你可以自己搜索一下。

### 2. 手动提交

解决完冲突以后，就可以进行第二步—— `commit` 了。

```shell
git add shopping\ list.txt # 嗯是的，这里 commit 前也需要先 add 一下
git commit
```

![](https://user-gold-cdn.xitu.io/2017/11/22/15fe4388f6a15ebe?w=420&h=186&f=jpeg&s=24027)

可以看到，被冲突中断的 `merge`，在手动 `commit` 的时候依然会自动填写提交信息。这是因为在发生冲突后，Git 仓库处于一个「merge 冲突待解决」的中间状态，在这种状态下 `commit`，Git 就会自动地帮你添加「这是一个 merge commit」的提交信息。

### 放弃解决冲突，取消 merge？

同理，由于现在 Git 仓库处于冲突待解决的中间状态，所以如果你最终决定放弃这次 `merge`，也需要执行一次 `merge --abort` 来手动取消它：

```shell
git merge --abort
```

输入这行代码，你的 Git 仓库就会回到 `merge` 前的状态。

## 特殊情况 2：HEAD 领先于目标 commit

如果 `merge` 时的目标 `commit` 和 `HEAD` 处的 `commit` 并不存在分叉，而是 `HEAD` 领先于目标 `commit`：

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2b2357b9d9?w=361&h=378&f=jpeg&s=20330)

那么 `merge` 就没必要再创建一个新的 `commit` 来进行合并操作，因为并没有什么需要合并的。在这种情况下， Git 什么也不会做，`merge` 是一个空操作。

## 特殊情况 3：HEAD 落后于 目标 commit——fast-forward

而另一种情况：如果 `HEAD` 和目标 `commit` 依然是不存在分叉，但 `HEAD` 不是领先于目标 `commit`，而是落后于目标 `commit`： 

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2b0913daf4?w=467&h=369&f=jpeg&s=20061)

那么 Git 会直接把 `HEAD`（以及它所指向的 `branch`，如果有的话）移动到目标 `commit`：

```shell
git merge feature1
```

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2b2486758a?w=494&h=376&f=gif&s=113911)

这种操作有一个专有称谓，叫做 "fast-forward"（快速前移）。

一般情况下，创建新的 `branch` 都是会和原 `branch` （例如上图中的 `master` ）并行开发的，不然没必要开 `branch` ，直接在原 `branch` 上开发就好。但事实上，上图中的情形其实很常见，因为这其实是 `pull` 操作的一种经典情形：本地的 `master` 没有新提交，而远端仓库中有同事提交了新内容到 `master`：

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2b2f15e16f?w=518&h=640&f=jpeg&s=38371)

那么这时如果在本地执行一次 `pull` 操作，就会由于 `HEAD` 落后于目标 `commit` （也就是远端的 `master`）而造成 "fast-forward"：

```shell
git pull
```

![](https://user-gold-cdn.xitu.io/2017/11/21/15fddc2b46c69d46?w=572&h=858&f=gif&s=412287)

简单解释一下上图中的 `origin/master` 和 `origin/HEAD` 是什么鬼：它们是对远端仓库的 `master` 和 `HEAD` 的本地镜像，在 `git pull` 的「两步走」中的第一步——` git fetch` 下载远端仓库内容时，这两个镜像引用得到了更新，也就是上面这个动图中的第一步：`origin/master` 和 `origin/HEAD` 移动到了最新的 `commit`。

> 为什么前面的图里面从来都没有这两个「镜像引用」？因为我没有画呀！其实它们是一直存在的。

而 `git pull` 的第二步操作 `merge` 的目标 `commit` ，是远端仓库的 `HEAD`，也就是 `origin/HEAD` ，所以 `git pull` 的第二步的完整内容是：

```shell
git merge origin/HEAD
```

因此 `HEAD` 就会带着 `master` 一起，也指向图中绿色的最新 `commit` 了。

## 小结

本节对 `merge` 进行了介绍，内容大概有这么几点：

1. `merge` 的含义：从两个 `commit`「分叉」的位置起，把目标 `commit` 的内容应用到当前 `commit`（`HEAD` 所指向的 `commit`），并生成一个新的 `commit`；
2. `merge` 的适用场景：
   1. 单独开发的 `branch` 用完了以后，合并回原先的 `branch`；
   2. `git pull`  的内部自动操作。
3. `merge` 的三种特殊情况：
   1. 冲突
      1. 原因：当前分支和目标分支修改了同一部分内容，Git 无法确定应该怎样合并；
      2. 应对方法：解决冲突后手动 `commit`。
   2. `HEAD` 领先于目标 `commit`：Git 什么也不做，空操作；
   3. `HEAD` 落后于目标 `commit`：fast-forward。