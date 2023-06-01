# Workspace 篇 - workspace 技巧

## 前言

我们总是习惯于先在 `IDE` 或者文本编辑器中修改代码，然后再进入 `Chorme` 中进行调试，那有没有想过直接就在 `Chrome` 中来修改我们的代码呢？ 对于这样的想法，`Chrome DevTools` 提供了哪些支持呢？

## 1. 在 `Chrome` 中修改你的文件

有时在代码执行的位置也是最容易编辑代码的位置（对于前端来说也就是浏览器）。如果你把项目的文件夹直接拖到 `Source` 面板，`DevTools` 会将你做出的修改同步到系统的文件中。

这对于快速修复代码非常方便！（我真的认识一个喜欢以这种方式做大部分编码的开发者）
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/29/167f5b37db4e23ac~tplv-t2oaga2asx-image.image)

等等，其实它可以更好...

## 2. `Workspace` 支持即时同步样式

正如我们刚才所说，一旦设置好了 `DevTools workspace`，就可以在 `Sources` 面板中编辑 `HTML` 和 `JavaScript`（或者甚至是 `TypeScript`，如果你有`sourcemaps`）文件，按 `ctrl + s` 后它将被保存 在文件系统中。

但是在样式方面它提供了更好的支持。 因为即使你只是在 *“元素”* 面板的 *“样式”* 部分中编辑样式规则，它也会立即同步。
请注意，是立刻！

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/29/167f5b37d2312b72~tplv-t2oaga2asx-image.image)

**"黑魔法!"**

## 3. 为新选择器选择目标位置

如果要向现有选择器添加新样式，很容易：只需在 `“元素”` 面板的 `“样式”` 部分中找到该选择器，然后开始编写 `CSS`。 但如果还没有这样的选择器，则需要按下`New Style Rule` 按钮。

当你使用工作区时，新样式规则的默认定位为 - `“inspector-stylesheet：1”` 如果你不想规则在这个位置显示，只需按住 `New Style Rule` 按钮，就可以看到一个列出所有 `CSS` 文件的选项。选择目的地，新规则就会保存在那里！

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/28/167f3538987666fb~tplv-t2oaga2asx-image.image)

## 4. `Workspace` 允许 `CSS` 注入！

设置工作区后，浏览器中所做的更改不仅会持久的保存到文件系统中，而且，`CSS`  的更改保存在文件系统后，立即就被浏览器选中并显示在你的页面上。**并不需要手动刷新。**

敲黑板：我们 `没有使用额外的工具` - 没有 `webpack` 的热更新模块或者其他东西 - 只有一个本地服务以及 `DevTools' workspace` 而已。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/29/167f5b37d2051cca~tplv-t2oaga2asx-image.image)