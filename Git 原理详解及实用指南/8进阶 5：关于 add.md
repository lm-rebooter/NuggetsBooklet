# 进阶 5：关于 add

前面说过了可以通过 `add` 来把改动的内容放进暂存区。这一节关于 `add` 再多说两点。都是基础的东西，但对新学 Git 的人可能有些用处。

## 1. add 后面加个点 "."：全部暂存

`add` 指令除了 `git add 文件名` 这种用法外，还可以使用 `add .` 来直接把工作目录下的所有改动全部放进暂存区：

```shell
git status
```

![](https://user-gold-cdn.xitu.io/2017/11/22/15fe36e3ee159b2e?w=623&h=341&f=jpeg&s=82623)

```shell
git add .
git status
```

![](https://user-gold-cdn.xitu.io/2017/11/22/15fe36e3ed623762?w=383&h=183&f=jpeg&s=46814)

这个用法没什么特别的好处，但就一个字：方便（咦？）。你在用的时候会更加深刻地体会到。

## 2. add 添加的是文件改动，而不是文件名

假如你修改了文件 `a.txt`，然后把它 `add` 进了暂存区：

```shell
git add a.txt
git status
```

![](https://user-gold-cdn.xitu.io/2017/11/22/15fe36e3ee50d1a6?w=386&h=149&f=jpeg&s=40273)

然后你又往 `a.txt` 里写了几行东西。这时候你再 `status` 一下的话：

```shell
git status
```

![](https://user-gold-cdn.xitu.io/2017/11/22/15fe36e3ed9f9877?w=618&h=221&f=jpeg&s=56939)

你会发现你的 `a.txt` 既在 "Changes to be commited" 的暂存区，又在 "Changes not staged for commit"。不用觉得奇怪，这是因为通过 `add` 添加进暂存区的不是文件名，而是具体的文件改动内容。你在 `add` 时的改动都被添加进了暂存区，但在 `add` 之后的新改动并不会自动被添加进暂存区。在这时如果你提交：

```shell
git commit
```

那么你那些新的改动是不会被提交的。

这种逻辑也许会让新学 Git 的人有点困惑和感到麻烦，但当你使用 Git 一段时间后，你会发现这种设计很巧妙，而且不但不麻烦，还很方便。具体的原因我就不长篇大论地说了，你以后慢慢体会吧。