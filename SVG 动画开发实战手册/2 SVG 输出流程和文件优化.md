## SVG 文件导出与优化
上一章节讲了 SVG 的一些基本知识，这篇就来聊聊 SVG 文件的导出以及优化方面的一些知识。

当然，你完全可以手写 SVG，或者是使用 JavaScript 来绘制 SVG。不过，当你想使用 SVG 来开发一些动效的时候，你应该不会选择使用手写 SVG 这种古老原始的方法。还是使用诸如 Adobe Illustrator（简称AI）、Sketch 或者是 Inkscape 这样的专业的矢量设计工具来进行矢量图形设计，然后导出 SVG 代码。

下面主要是介绍使用 Adobe Illustrator 这个工具来导出 SVG。

## SVG 导出

### 文件另存为 SVG

使用 Adobe Illustrator 导出 SVG 最常用的方法是使用**文件 > 存储为**这个方法来导出 SVG 格式文件。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/2/28/16934025fb196c7a~tplv-t2oaga2asx-image.image)


当你选择保存为 SVG 格式的时候，会弹出一个对话框上面有一个 SVG  code 的按钮，点击它会在保存为 SVG 之前显示 SVG 的代码，这样就得到了这个文件的 SVG 代码，直接拷贝 SVG 代码就可以使用了。

过程如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676dbb1424cf428~tplv-t2oaga2asx-image.image)

当然这种方式导出来的 SVG 代码，是没有经过任何优化的。它会把很多的额外的信息包含进去，这样没什么问题，但是，当在 web 中使用的时候，它会增加 SVG 的体积，使用这种方法导出来的SVG比使用专门为 web 保存 SVG 的方法的体积要大很多。

所以在使用 AI 导出 SVG 后，要进行一些优化，确保它的体积保持在最小的状态，在第二部分会专门来讲 SVG 的优化。

### 复制粘贴方法

如果想要单独导出画布中特定图形的 SVG 代码，这里有一个更简单的方法，就是**编辑 > 复制**，然后就可以直接把 SVG 代码粘贴到你要粘贴到地方，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676dbb14228cdce~tplv-t2oaga2asx-image.image)

当然这个方法得到的 SVG 代码也是没有经过优化的，在正式的生产环境中最好是优化一下，这样可以大大的减少它的体积。

下面就来说说 SVG 的一些优化的方法。

## SVG 优化

### 减少路径的控制点

按照以往的经验来看，设计师在设计矢量图形的时候，往往会添加很多的控制点来设计图形。虽然最后能达到设计效果，但是在导出为 SVG 文件的时候，会产生很多冗余的节点数据。简单图形还好，如果是稍微复杂点的图形，则无疑会大大增加 SVG 文件的体积。

所以，在拿到设计师的矢量设计稿的时候，如果图形是使用钢笔工具或者是手绘的，那么在输出 SVG 代码前，可以使用 Illustrator 菜单栏上的 **对象>路径>简化**这个命令来优化图形的节点。当然优化节点的数量要根据具体的图形来决定，总的来说，最好是控制在90%左右，太少的话，可能会破坏原有的形状。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/10/16795e4121ef19ac~tplv-t2oaga2asx-image.image)

这是一种能快速减少文件体积的方法，当然，对一些非常复杂的图形来说，还是建议在开始设计的时候，尽量控制节点的数量。

### 使用合适的画布尺寸

在进行图形设计的时候，建议画布尺寸不要太大，因为画布越大意味着路径上的控制点也约多，从而导致导出的文件的体积过大。而画布尺寸太小，则有可能在导出的 SVG 代码中会存在很多的小数点。

所以，推荐画布的尺寸为100x100。因为矢量图形是可以无限放大缩小的，所以在导出文件后，我们可以任意的改变它的大小。

在 Illustrator 中，想要改变画布的大小也非常方便，在菜单栏上 **对象>画板>适合图稿边界** 就可以自动根据画布中的图形元素的边界自动的来调整画布的尺寸。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/10/16795e5a635df349~tplv-t2oaga2asx-image.image)

### 使用第三方工具进行优化

做完上面的这些基本的优化后，就可以使用 Illustrator 导出 SVG 代码文件，导出之后我们还可以使用一些专业的 SVG 优化工具来对它进行再一次的优化。

下面来推荐几个专业的 SVG 优化工具：

[SVGO-GUI](https://github.com/svg/svgo-gui)：这是一个基于 node 的优化工具，运行软件之后，直接把 SVG 文件拖入到软件中，它会自从帮你优化好 SVG 文件。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/2/1676dbb143b4affb~tplv-t2oaga2asx-image.image)
[SVGOMG](https://jakearchibald.github.io/svgomg/)：这是一个在线的优化工具，提供来非常多的选项来自定义优化 SVG 文件。


![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/10/16795e7c88abe967~tplv-t2oaga2asx-image.image)

SVG 优化大概就是这些，对于稍微复杂一些，节点多的图形，优化效果还是非常明显的。

SVG 的基本知识和优化就讲到这里，从下一章节开始，我们正式进入 SVG 动画开发的世界，来一步一步领略 SVG 动画开发的魅力。
