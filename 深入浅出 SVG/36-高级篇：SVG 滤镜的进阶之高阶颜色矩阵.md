在之前的《[初探 SVG 滤镜](https://juejin.cn/book/7341630791099383835/section/7366549423746187273)》课程中，我们已经领略了 SVG 滤镜的神奇之处，包括如何定义和运用这些滤镜效果。今天，我们将迈入 SVG 滤镜的高级领域——高阶颜色矩阵，即 `<feColorMatrix>` 滤镜。

  


SVG 滤镜为我们打开了图像效果的全新境界，但我想在这节课中着重介绍 `<feColorMatrix>` 滤镜。它允许我们以矩阵的形式精确地转换图像的每个像素的颜色。换句话说，它赋予了我们通过向图像的红色（R）、绿色（G）、蓝色（B）和 Alpha 通道添加不同量的红色、绿色、蓝色或 Alpha 来操纵图像通道的能力。

  


这意味着 `<feColorMatrix>` 滤镜为我们提供了更多的控制权，将 CSS 滤镜的能力提升到了一个新的水平，让我们能够更加显著地操控图像处理和特效。通过该滤镜，我们可以实现各种颜色效果，包括色彩校正、颜色偏移、色彩平衡等。

  


在接下来的内容中，我将带领你深入了解高阶颜色矩阵的工作原理和用法，包括如何构建和应用自定义矩阵，以及如何利用这种强大的技术实现各种令人惊叹的图像效果。让我们一起开始这段探索之旅吧！

  


## CSS 滤镜和混合模式不足之处

  


通常情况之下，说到滤镜，大家首先想到的是在 Photoshop 图形编辑软件。因为，最初通过滤镜来处理图像效果，基本上都是在 Photoshop 中完成。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f829376f34a24231bb332882a0ddd58c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1680&h=851&s=1754900&e=webp&b=2c242b)

  


在 Photoshop 图形编辑器中通过滤镜给图像添加艺术效果，这并没有任何问题。但对于大多数 Web 开发者来说是件棘手的事情。而且，你要是想根据用户的互动开启或关闭某个图形效果时，你不得不为此导出两张不同的图像文件，并通过 CSS 或 JavaScript 来切换它们。

  


庆幸的是，首先在 SVG 中有了类似 Photoshop 图像编辑器中的滤镜功能。现在，在 CSS 中也具备了这方面的能力。如果你经常编写 CSS ，[很有可能你已经接触过滤镜（filter）和混合模式（mix-blend-mode 或 background-blend-mode）](https://juejin.cn/book/7223230325122400288/section/7259669043622690853)。例如，CSS 的混合模式允许我们将背景和前景元素混合在一起，并且在图像上使用时可以创建一些有趣的效果，类似于 Photoshop 等图像编辑器的效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75012754de154a6cb1d82232f82ee9e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1090&h=654&s=3520831&e=gif&f=107&b=010101)

  


> Demo 地址：https://codepen.io/airen/full/oNRWMYP

  


另外，CSS 滤镜在混合模式无法完全满足我们需求的地方提供了更多的功能。你可以将多个滤镜组合在一起，来调整图片的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1a1693191dd4a7295adb2e187dff4a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1294&h=568&s=16786736&e=gif&f=160&b=354438)

  


> Demo 地址：https://codepen.io/airen/full/RwmVyEV

  


一个最为常见且有用的技巧是使用 `grayscale(100%)` 或 `saturate(0%)` 将彩色图像转换为黑白的，这在某些特殊的场合之下是非常有用的：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91565bdb45144bc2b1487eb066bafb64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=613&s=103626&e=jpg&b=f3f3f3)

  


相反呢？你能告诉浏览器给一张黑白的图像上色吗？

  


> 一张黑白的 JPG 图像的文件大小通常比等效的彩色照片小 `5% ~ 25%` （这取决于图片的压缩比例，JPG 对颜色通道的压缩要比亮度细节大得多）。对于无损图像格式，比如 PNG，文件大小的变化可能会更大。当性能成为问题时，这些额外的千字节可能很重要。想象一下，如果你有一个页面充满了个人头像。用户只会看到其中一些是彩色的，那为什么要消耗他们的数据流星发送彩色照片呢？滤镜还需要 CPU 进行处理和内存进行存储。只对个别照片进行滤镜处理，将其余部分保持为正常状态，难道不香吗？

  


虽然，使用 CSS 混合模式与其他颜色或图像相互混合，可以将一张黑白照片变成彩色照片，但这种融合的效果，很难达到你喜欢的颜色。这应该是 CSS 滤镜和混合模式的一大缺陷吧。这是因为 CSS 的滤镜和混合模式缺少一个关键特性，它们不能对颜色的每个通道进行单独操作。虽然 CSS 滤镜和混合模式是一种极好的工具，使用也非常方便，但它们只是从 SVG 滤镜派生出来的一种简捷方式，因此无法控制 RGBA 通道。

  


这意味着，要完全控制我们的图像，还是需要使用 SVG 滤镜。SVG 滤镜，尤其是 `<feColorMatrix>` 滤镜赋予我们更多能力，让我们能够将 CSS 滤镜和混合模式提升到一个新的层次，对图像处理和特效提供了更显著的控制权。

  


## 回顾一下 `<feColorMatrix>` 滤镜

  


`<feColorMatrix>` 滤镜是 [SVG 滤镜](https://juejin.cn/book/7341630791099383835/section/7366549423746187273#heading-9)家族中的重要一员（SVG 滤镜共有 17 种不同类型）。当涉及到颜色操作时，`<feColorMatrix>` 是你的最佳选择。它允许我们通过向图像的红色、绿色、蓝色和 Alpha 通道添加不同量的红色、绿色、蓝色或 Alpha 来操纵图像的每个像素，实现高度细致的颜色调整。

  


简单来说，`<feColorMatrix>` 滤镜可以对图像的每个像素进行颜色变换，允许我们对图像进行高度细致的颜色调整，例如色彩校正、色调分离、颜色偏移等效果。

  


`<feColorMatrix>` 滤镜包括 `in` 、`result` 、 `type` 和 `value` 等属性值：

  


-   **`in`** ：指定输入图像，可以是前一个滤镜效果的输出，也可以是图像本身
-   **`result`**：为当前滤镜操作的输出命名，这样可以在后续的滤镜操作中引用该结果
-   **`type`** ：可选值包括 `matrix`、`saturate`、`hueRotate` 和 `luminaceToAlpha` 。主要用于指定颜色矩阵操作的类型。其中关键字 `matrix` 将提供完整的 `5x4` 值矩阵，允许你对图像的每个像素进行变换； `saturate` 允许你调整图像的饱和度，它的值在 `0 ~ 1` 之间；`hueRotate` 允许你调整图像的色相，它的值在 `0 ~ 360` 度之间；`luminanceToAlpha` 允许你将图像的亮度值转换为 Alpha 通道值。
-   **`values`** ：其内容取决于 `type` 属性的值。对于 `matrix`，`values` 是由空格和 `/` 或逗号分隔的 `20` 个矩阵值的列表（`5x4` 值矩阵）；对于 `hueRotate`，`values` 是一个实数值（度数）；对于 `luminanceToAlpha`，`values` 不适用。如果未指定属性，则默认行为取决于属性 `type` 的值。如果是 `matrix`，则此属性默认为单位矩阵。如果是 `saturate`，则此属性默认为值 `1`，这会产生单位矩阵。如果是 `hueRotate`，则此属性默认为值 `0`，这会产生单位矩阵。

  


在这节课，我们将以 `type` 为 `matrix` 为主。例如，下面这个示例，我们使用 `<feColorMatrix>` 滤镜定义 CSS 滤镜中的 `sepia()` 的效果。

  


```XML
<svg class="sr-only">
    <def>
        <filter id="sepia">
           <feColorMatrix 
               values="0.393  0.769  0.189  0  0
                       0.349  0.686  0.168  0  0
                       0.272  0.534  0.131  0  0
                       0      0      0      1  0" 
               type="matrix"/>
        </filter>
    </def>
</svg>
```

  


上面的代码定义了一个 `100%` 褐色调的 SVG 滤镜效果（下图中右图的效果）。你可以对比一下，它与 CSS 滤镜中 `sepia(1)` 的效果（下图中左图的效果）的差异：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13b957bde4a4453b82454ec7f61a2ef0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1322&h=728&s=6850137&e=gif&f=156&b=070707)

  


> Demo 地址：https://codepen.io/airen/full/rNgmbbE

  


简单易行，对吧！你只需要调整 `matrix` 属性中的几个数字，就可以得到各种不同的图像效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1449fd13276a4c04b0d1e8642e4d2abf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1394&h=532&s=13568685&e=gif&f=353&b=211f1d)

  


> Demo 地址：https://codepen.io/airen/full/bGyWjZB

  


再对比一下下图：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a82890565054eaeaa77a0837f5bea03~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=654&s=840260&e=jpg&b=353730)

  


左侧是未使用任何滤镜的原始图片效果，右侧是使用了 SVG 的 `<feColorMatrix>` 滤镜的效果。

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="primitive">
            <feColorMatrix 
                type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0 "/>
        </filter>
    </defs>
</svg>
```

  


从效果上来看，两者并没有任何差异。事实却是如此，因为原始图像中`R` 、`G`、`B` 、`A` 通道的值默认都是 `1`。

  


这个时候，我想你有一点困惑了，既然调整 `<feColorMatrix>` 滤镜的 `matrix` 中的几个数值就能给图像着色，那么这个数字怎么调整？为了回答这个问题，我们接下来进入 `<feColorMatrix>` 滤镜中的颜色矩阵世界。

  


## 理解 `<feColorMatrix>` 的颜色矩阵

  


关于 `<feColorMatrix>` ，你需要理解的第一件事情就是，`values` 中的数字列表，它被称为“变换矩阵”，用于数学上表示维度或空间时使用，是一种非常复杂的、将数字和符号排列成矩形形状的行列。具体来说，是一个五列四行的矩阵：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3328737af6964527a7a529104767190c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2820&h=1344&s=1034139&e=jpg&b=2c7391)

  


简单的解释一下上图。

  


上图表示的是一个四行（分别代表 RGBA 四个颜色通道）五列（前三列代表 RGB 输入颜色，第四列代表 Alpha 通道，第五列代表常数）的矩阵。图中每个单元格中的数字代表颜色矩阵中的一个元素，用于决定每个颜色通道如何转换。

  


或者说，`x` 轴（行）代表输入图像（原始图像）的通道（`R`、`G`、`B` 和 `A`），`y` 轴（列）代表我们可以从这些通道中添加或移除的颜色。

  


对于任何像素，输出颜色是通过将该矩阵与输入像素相乘得到的。

  


> 顺便说一句：这仅适用于 `type="matrix"`。其他类型选项是 `saturate` 和 `hue-rotate`，它们采用单个数字值，以及 `luminanceToAlpha`，它不采用任何值。

  


注意，接下来的内容将会涉及到一些数学知识，例如矩阵乘法计算。如果你因为时间太久远，对这方面的知识略感模糊，可以借助下图来帮助你快速回忆这方面的知识：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a74cfa992b7342788b59da83c4374ec3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1318&h=654&s=1034175&e=gif&f=319&b=ffffff)

  


> Demo 地址：http://matrixmultiplication.xyz/

  


需要知道的是，`<feColorMatrix>` 滤镜是通过将 RGBA 输入颜色表示为一个向量，其中每个通道的值都已缩放到 `0 ~ 1` 的范围创建的。该向量与矩阵相乘，然后结果被转换为回来创建 RGBA 输出颜色。每个向量和矩阵都给出了额外的行和列，以便你可以按照固定量移动颜色。

  


颜色矩阵滤镜是通过将RGBa输入颜色表示为一个向量，其中每个通道的值都已缩放到0-1的范围来创建的。该向量与矩阵相乘，然后结果被转换回来创建RGBa输出颜色。每个向量和矩阵都给出了额外的行/列，以便您可以按固定量移动颜色，如果需要的话。

  


现在，我们使用矩阵方程式来描述 `<feColorMatrix>` 滤镜，看起来像这样：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a21ccc8c26af434bb3ee11fdcc14db52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3674&h=2147&s=2563387&e=jpg&b=2c7391)

  


最后一行的结果是 `1` ，因此你可以安全地忽略它。 在 `<feColorMatrix>` 属性中也会被忽略，因为它只指定了矩形的前四行（`4 × 5` 即四行五列矩阵）。

  


对于其他行，你正在创建每个 RGBA 输出值（`R2` 、`G2` 、`B2` 和 `A2`），作为 RGBA输入值（`R1` 、`G1` 、`B1` 和 `A1` ）与相应矩阵值相乘后加上一个常数的和。

  


通过这种方法，我们可以为任何具有 RGBA 值的颜色创建一个颜色滤镜！例如 `#09ec2f` 颜色，它对应的 RGBA 值是 `rgb(9 236 47)` ，即 `R = 9` 、`G = 236` 、 `B = 47` 和 `A = 1` 。 这些颜色通道的值都是在 `0 ~ 255` 之间的整数。在计算机中，这个范围是一个八位字节可以提供的范围。通过将这些颜色通道的值除以 `255`，将得到相应的向量值（`0 ~ 1`）：

  


```
#09ec2f 👉👉👉  rgb(9 236 47)
R = 9   👉👉👉 R = 9 ÷ 255 = 0.035
G = 236 👉👉👉 G = 236 ÷ 255 = 0.925
B = 47  👉👉👉 B = 47 ÷ 255 = 0.184
```

  


我们可以将这些向量值应用到 `<feColorMatrix>` 滤镜中：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2de08e1991a4e0584b56c9069e3ea42~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2820&h=1794&s=1432209&e=jpg&b=2c7391)

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="filter">
            <feColorMatrix 
                type="matrix"
                values="0.035 0      0     0 0
                        0     0.925  0     0 0
                        0     0      0.184 0 0
                        0     0      0     1 0 "/>
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5632d7424ad449dc99bee15682148a2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1204&h=628&s=4489731&e=gif&f=134&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/BaeZaXz

  


正如你所看到的一样，图像应用了这个滤镜之后，变成了绿色的！

  


我们再来看一个高亮到透明（luminanceToAlpha）的颜色矩阵示例：

  


```XML
<filter id="luminanceToAlpha">
    <feColorMatrix values="
         0       0        0       0  0
         0       0        0       0  0
         0       0        0       0  0
         0.2126  0.7152   0.0722  0  0" type="matrix" />
</filter>
```

  


它相当于以下矩阵：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c768cc07220477c90f48decadba2145~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3674&h=2147&s=1760079&e=jpg&b=2c7391)

  


因为前三行的值都是 `0` ，所以红色、绿色和蓝色通道的输出值也都是 `0` （即黑色）。Alpha 通道的输出是基于三个输入颜色通道的函数生成的：主要来自绿色，少量来自红色，以及来自蓝色的一点点。

  


此时，如果输入颜色是纯白色，即 `R1` 、`G1` 、`B1` 和 `A1` 的值都是 `1` ，那么 Alpha 通道值为 `1` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c89b9bf3d594b8fbfad334557f7b843~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4751&h=2147&s=2571510&e=jpg&b=2c7391)

  


则完全不透明。反之，如果输入的颜色是纯黑色，即 `R1` 、`G1` 和 `B1` 的值都为 `0` ，那么 Alpha 值为 `0` ：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae8bb51be3d14883a484813a852c4860~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=4751&h=2147&s=2616942&e=jpg&b=2c7391)

  


换句话说，就是完全透明。任何其他颜色都会在透明度上产生介于这两者之间的值。较亮的颜色会变得更不透明，而较暗的颜色会变得更透明。分配给 RGB 通道的具体数字旨在反映强烈红色、强烈绿色和强烈蓝色之间的亮度差异。

  


所以，回到开头的棕褐色矩阵，它是一个更为复杂的颜色矩阵：

  


```XML
<filter id="sepia">
    <feColorMatrix type="matrix"
        values="
            0.393  0.769  0.189  0  0
            0.349  0.686  0.168  0  0
            0.272  0.534  0.131  0  0
            0      0      0      1  0" />
 </filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99148cb00e904dfdb49872797d3223dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3674&h=2147&s=1912586&e=jpg&b=2c7391)

  


这个颜色矩阵有两个作用：它将彩色图像变为灰度图像（带有亮度调整），然后将该灰度图像着色成黄色。Alpha 通道不会改变：输出 `A2` 值恰好是输入 `A1` 通道的 `1` 倍。

  


当输入颜色为黑色时，输出仍然是黑色，因为所有数字都将乘以`0`。但是，当输入颜色为白色时，输出如下：

  


```
R2 = 0.393 × 1 + 0.769 × 1 + 0.189 × 1 = 1.351
G2 = 0.349 × 1 + 0.686 × 1 + 0.168 × 1 = 1.203
B2 = 0.272 × 1 + 0.534 × 1 + 0.131 × 1 = 0.937
```

  


因此，颜色是 ` rgb(135.1% 120% 93.7%  / 100%)` 。

  


注意，此时颜色的 `R` 和 `G` 通道的值超出来 `1` （即 `100%`），它们会被压缩以 `100%` ，结果就是白色的部分被转换为浅黄色。

  


如果稍微降低输入值，直到输出下降到 `1` 以下，将看不到红色和绿色通道的减少，因此你仍然会得到黄色，但不会那么苍白（因为蓝色通道将可见地减少）。

  


对于中等输入，每个通道的缩放值为 `0.5`，输出颜色将如下计算：

  


```
R2 = 0.393 × 0.5 + 0.769 × 0.5 + 0.189 × 0.5 = 0.6755
G2 = 0.349 × 0.5 + 0.686 × 0.5 + 0.168 × 0.5 = 0.6015
B2 = 0.272 × 0.5 + 0.534 × 0.5 + 0.131 × 0.5 = 0.4685
```

  


换句话说，它将是一种橙黄色的灰色，即 ` rgb(67.55% 60.15% 46.85%  / 100%)`。

  


如果你对颜色相关很熟悉，你可能会注意到中灰色（`gray`）输入的输出值恰好是白色输入的输出值的一半。当输入图片是灰色调时，红色、绿色和蓝色输入通道的值始终相同。因此，你可以通过将它写成以下形式来简化这个数学问题：

  


```
R2 = 1.351 × gray
G2 = 1.203 × gray
B2 = 0.937 × gray
```

  


为了创建具有相同结果的颜色矩阵，你可以将每个行中的一个 RGB 列设置为这些值，并将其他值设置为零：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/034d6ce380af46c6805b0748ef965446~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3674&h=2516&s=2154588&e=jpg&b=2c7391)

  


只要输入图像是灰度的，这些将与原始的棕褐色滤镜矩阵产生完全相同的结果。

  


在开始进入实战之前，有一个细节需要注意。你可能认为，为了创建一个 RGB 输入向量，每个通道的值为 `0.5` ，你应该使用 `rgb(50% 50% 50%)` （即 `#888` 或 `gray` ）。这对于 `<feColorMatrix>` 滤镜而言，没有任何问题，但对于 CSS `filter` 的 `sepia()` 函数是不对的。这是因为简写滤镜都使用 `sRGB` 颜色空间输入颜色缩放为计算中使用的值。

  


相较之下，SVG 滤镜默认使用输入RGB 值与矩阵数学中使用的值之间的直接数学转换

  


在我们回到演示之前，我应该插入一个警告。你可能认为，为了创建一个RGB输入向量，每个通道的值为 `0.5`，你应该使用`rgb(50%，50%，50%)`或`＃888`或`gray`。如果你使用的是`<feColorMatrix>`滤镜，你是对的，但如果你使用的是sepia()简写函数，你是错误的。这相是因为简写滤镜都使用sRGB颜色模型将输入颜色缩放为计算中使用的值。

  


当你使用 SVG 滤镜时，它默认会直接用输入的 RGB 值进行数学转换。这些值的转换方式可以通过 `color-interpolation-filters` 属性来控制。这个属性可以作为滤镜的一个属性或者一个可以继承的CSS属性来设置。它有两个选项：`linearRGB` 和 `sRGB` ：

  


-   `linearRGB`：表示用线性 RGB 颜色空间来进行转换，这种方式通常更准确
-   `sRGB`：表示用标准RGB颜色空间来进行转换，这种方式更常见

  


接下来的示例将使用 `sRGB`。`sRGB` 模式最有效地保留了输入图像各部分之间的亮度差异感知，但它对结果有显著影响，所以如果你使用相同的数值却得到了非常不同的效果，那可能就是原因所在。这也意味着颜色不能轻易地通过手工计算得出。特别是在定义精确生成特定中灰色输出颜色的滤镜时，这尤其棘手。如果你在浏览器中玩弄滤镜，这通常不是问题。然而，如果你试图在你的网页设计中匹配特定的颜色，你可能需要测试 `color-interpolation-filters: linearRGB;`。

  


## `<feColorMatrix>` 滤镜的使用

  


了解完 `<feColorMatrix>` 滤镜的颜色矩阵的转换之后，我们来看一些实际的使用用例。先从改变颜色通道值开始，我们尽可能的由简到复杂来深入了解它的使用方式。

  


### 改变 RGB 值

  


前面我们提到过，任何图像默认之下，它的 RGB 通道值都是 `1` 。这意味着，如果像下面这样使用 `<feColorMatrix>` 滤镜不会给图像带来任何变化：

  


```XML
<filter id="primitive" color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix"
        values="1   0   0   0   0
                0   1   0   0   0
                0   0   1   0   0
                0   0   0   1   0 "/>
</filter>
```

  


一旦你通过省略或混合颜色通道值，就可以对图像进行颜色化处理，例如：

  


```XML
<!-- 缺少 B 和 G 通道（只有 R 为 1） -->
<filter id="red" color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix" 
        values="1   0   0   0   0
                0   0   0   0   0
                0   0   0   0   0
                0   0   0   1   0 "/>
</filter>

<!-- 缺少 R 和 G 通道（只有 B 为 1） -->
<filter id="blue" color-interpolation-filters="sRGB">
   <feColorMatrix type="matrix" 
       values="0   0   0   0   0
                0   0   0   0   0
                0   0   1   0   0
                0   0   0   1   0 "/>
</filter>

<!-- 缺少 R 和 B 通道（只有 G 为 1） -->
<filter id="green" color-interpolation-filters="sRGB">
    <feColorMatrix  type="matrix"
        values="0   0   0   0   0
                0   1   0   0   0
                0   0   0   0   0
                0   0   0   1   0 "/>
</filter>

<!-- 缺少 B 通道（R 和 G 的混合）: 红 + 绿 = 黄-->
<filter id="yellow" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="1   0   0   0   0
                0   1   0   0   0
                0   0   0   0   0
                0   0   0   1   0 "/>
</filter>

<!-- 缺少 G 通道（R 和 B 的混合）:红 + 蓝 = 洋红 -->
<filter id="magenta" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="1   0   0   0   0
                0   0   0   0   0
                0   0   1   0   0
                0   0   0   1   0 "/>
</filter>

<!-- 缺少 R 通道（G 和 B 的混合）:绿 + 蓝 = 青 -->
<filter id="cyan" color-interpolation-filters="sRGB" >
    <feColorMatrix  type="matrix" 
        values="0   0   0   0   0
                0   1   0   0   0
                0   0   1   0   0
                0   0   0   1   0 "/>
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/451e022a359d4d8a88cf218bf3d6f640~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1126&h=710&s=4523590&e=gif&f=128&b=090909)

  


> Demo 地址：https://codepen.io/airen/full/abrwWNO

  


不难发现，RGB通道中某个通道去除之后，另外两个通道会保留，例如去除红色通道会保留着绿色和蓝色通道。当绿色和蓝色混合时，它们产生青色；红色和蓝色混合时产生洋红色；红色和绿色混合时产生黄色。

  


需要知道的是，当一个值缺失时，另外两个值会取而代之。因此，现在没有了绿色通道，就没有了白色、青色或黄色。然而，这些颜色实际上并没有消失，因为它们的亮度（或 Alpha）值尚未被触及。让我们看看下一步操作这些 alpha 通道会发生什么。

  


### 改变 Alpha 值

  


我们可以通过 Alpha 通道（第四列）调整阴影和高光色调。第四行影响整体 Alpha 通道，而第四列则影响每个通道的亮度。

  


```XML
<!-- 0.5 的不透明滤镜 -->
<filter id="alpha" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="1   0   0   0   0
                0   1   0   0   0
                0   0   1   0   0
                0   0   0   .5  0 "/>
</filter>

<!-- 增加绿色不透明度，使其达到整体不透明度的水平 -->
<filter id="hard-green" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="1   0   0   0   0
                0   1   0   1   0
                0   0   1   0   0
                0   0   0   1   0 "/>
</filter>

<!-- 增加红色和绿色不透明度，使其达到整体不透明度的水平 -->
<filter id="hard-yellow" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="1   0   0   1   0
                0   1   0   1   0
                0   0   1   0   0
                0   0   0   1   0 "/>
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9ca857a2c734d89bab8620f43e638c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1122&h=416&s=4963984&e=gif&f=135&b=090909)

  


> Demo 地址：https://codepen.io/airen/full/QWRgMKM

  


上面几个滤镜效果，仅是调整 Alpha 通道的效果。

  


在实际使用的时候，我们可以将上面两个示例的方式混合起来使用。例如，在缺少某个颜色通道的同时还可以调整 Alpha 通道。

  


```XML
<filter id="blue-shadow-magenta-highlight" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="1   0   0   0   0
                0   0   0   0   0
                0   0   1   1   0
                0   0   0   1   0 "/>
</filter>
```

  


非常明显，上面的代码缺省了绿色通道（`G=0`），并在蓝色级别添加了 `100%` 的 Alpha 通道。我们保留了红色值，但覆盖了阴影部分中的所有红色，因此暗色全部变为蓝色，而最亮的值中包含红色的部分变为蓝色和红色的混合色（洋红色）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42850838afe34fd69414c9cdf0fa2e09~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1278&h=560&s=10047523&e=gif&f=134&b=090909)

  


> Demo 地址：https://codepen.io/airen/full/abrwyLM

  


如果我们把蓝色级别的 Alpha 通道的值设置为一个小于 `0` 的值，比如 `-1` ，那么情况则相反。阴影部分会变成红色而不是蓝色：

  


```XML
<filter id="highlight" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="1   0   0   0   0
                0   0   0   0   0
                0   0   1   -1   0
                0   0   0   1   0 "/>
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc686812452f42cf9fbaa62eab3baf0c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1278&h=638&s=9091810&e=gif&f=114&b=080808)

  


> Demo 地址：https://codepen.io/airen/full/OJYgjvp

  


这个效果与只有红色通道的效果是相同的：

  


```XML
<filter id="highlight" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="1   0   0   0   0
                0   0   0   0   0
                0   0   0   0   0
                0   0   0   1   0 "/>
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7a0537a464549d3957f8d44a2fe9836~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1278&h=638&s=9091810&e=gif&f=114&b=080808)

  


> Demo 地址：https://codepen.io/airen/full/YzbQxvw

  


然而，将蓝色级别的 Alpha 通道的值改为 `0.5` 而不是 `-1`，可以让我们看到暗色中的颜色混合：

  


```XML
<filter id="filter" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="1   0   0   0   0
                0   0   0   0   0
                0   0   1  .5   0
                0   0   0   1   0 "/>
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ede578c6f7454db591120e6bcc347b0b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=644&s=9259848&e=gif&f=126&b=080808)

  


> Demo 地址：https://codepen.io/airen/full/ZENyJjm

  


### 通道溢出

  


我们可以通过第四行影响各个通道的整体 Alpha 值。例如，将一个或多个颜色通道的值设置得过高，以至于超出了正常范围，导致图像中的这些通道丢失细节并产生高亮区域。如下所示：

  


```XML
<filter id="filter" color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix"  
        values="1   0   0   0   0
                0   1   0   0   0
                0   0   1   0   0
                0   0  -2   1   0 "/>
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a291a4320de244a08b3db2e35055f35b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1278&h=646&s=11681696&e=gif&f=151&b=080808)

  


> Demo 地址：https://codepen.io/airen/full/yLWXoGR

  


处后的图片，看上去有点像相机底片的效果。这里还有一些通道混合的示例：

  


```XML
<filter id="no-g-red" color-interpolation-filters="sRGB" >
    <feColorMatrix  type="matrix" 
        values="1   1   0   0   0
                0   0   0   0   0
                0   0   1   0   0
                0   0   0   1   0 "/>
</filter>

<filter id="no-g-magenta" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="1   1   0   0   0
                0   0   0   0   0
                0   1   1   0   0
                0   0   0   1   0 "/>
</filter>

<filter id="yes-g-colorized-magenta" color-interpolation-filters="sRGB" >
    <feColorMatrix  type="matrix" 
        values="1   1   0   0   0
                0   1   0   0   0
                0   1   1   0   0
                0   0   0   1   0 "/>
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/482beebd972d4e7fbf911f2628a1a3f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1274&h=634&s=11970359&e=gif&f=168&b=080808)

  


> Demo 地址：https://codepen.io/airen/full/MWdovRZ

  


### **变亮和变暗**

  


通过将每个通道的 RGB 值设置为小于 `1`（即全自然强度）的值，可以创建变暗效果。要变亮，则将值增加到大于 `1`。

  


```XML
<filter id="darken" color-interpolation-filters="sRGB" >
    <feColorMatrix  type="matrix" 
        values=" 0.5   0     0     0   0
                 0     0.5   0     0   0
                 0     0     0.5   0   0
                 0     0     0     1   0 "/>
</filter>

<filter id="lighten" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="1.5   0     0     0   0
                0     1.5   0     0   0
                0     0     1.5   0   0
                0     0     0     1   0 "/>
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f4ffcc4afdb4ec3816b01ffff1d16f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1276&h=642&s=10723492&e=gif&f=133&b=080808)

  


> Demo 地址：https://codepen.io/airen/full/WNBOZNy

  


### **灰度**

  


通过仅接受某一阴影的像素值列，可以创建灰度效果。基于所应用的活动级别，有不同的灰度效果。这里我们进行通道操作，因为我们正在将图像灰度化。考虑以下示例：

  


```XML
<filter id="gray-on-light" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="1   0   0   0   0
                1   0   0   0   0
                1   0   0   0   0
                0   0   0   1   0 "/>
</filter>

<filter id="gray-on-mid" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="0   1   0   0   0
                0   1   0   0   0
                0   1   0   0   0
                0   0   0   1   0 "/>
</filter>

<filter id="gray-on-dark" color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix" 
        values="0   0   1   0   0
                0   0   1   0   0
                0   0   1   0   0
                0   0   0   1   0 "/>
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffd3d79613f64a0694ff8afd6e9e40dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1184&h=708&s=14614209&e=gif&f=159&b=0c0c0c)

  


> Demo 地址：https://codepen.io/airen/full/pomwWJq

  


### 单色着色

  


上面案例主要展示了如何通过改变颜色通道来调整图像的颜色。接下来的内容将会更具体一点。比如，单色着色。

  


假设你需要创建一个单色着色滤镜。例如，要创建一个从黑色到浅橙色 `#ffcca6`（大约为 `rgb(100% 80% 65%)`）的滤镜。你可以使用如下代码：

  


```XML
<filter id="monochrome"  color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix"
        values="1.00  0  0  0  0 
                0.80  0  0  0  0 
                0.65  0  0  0  0 
                0     0  0  1  0" />
</filter>

<!-- 或者 -->
<filter id="monochrome"  color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix"
        values="1.00  0     0     0  0 
                0     0.80  0     0  0 
                0     0     0.65  0  0 
                0     0     0     1  0" />
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fe73adb727f4f6196c15e65d6c97f4b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1254&h=668&s=7086449&e=gif&f=96&b=070707)

  


> Demo 地址：https://codepen.io/airen/full/oNRwGLz

  


如果你熟悉单色打印图像，这种效果实际上可能与单色图像的概念相反。在打印时，你通常控制图像暗部的颜色。因此，打印的单色图像会有一个从深色到白色的过渡。要在 RGB 彩色显示器上实现这种效果，我们需要回到基础的颜色矩阵方程：

  


```
R2 = Rr × R1 + Gr × G1 + Br × B1 + Ar × A1 + Mr × 1
G2 = Rg × R1 + Gg × G1 + Bg × B1 + Ag × A1 + Mg × 1
B2 = Rb × R1 + Gb × G1 + Bb × B1 + Ab × A1 + Mb × 1
A2 = Ra × R1 + Ga × G1 + Ba × B1 + Aa × A1 + Ma × 1
1 =  0  × R1 +  0 × G1 +  0 × B1 +  0 × A1 + 1 × 1
```

  


当输入颜色是黑色时，矩阵列中的 RGB 通道的值都会消失（与 RGB 输入通道中的 `0` 值相乘，其值为 `0`）。这个时候，你唯一可以控制的是最后一列的常数，即 `M` 列的值。所以你想要图像的暗部显示为浅橙色 `rgb(100% 80% 65%)` ，你需要一个看起来像下面这样的矩阵：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5c24aa9f4c54ba09415d4c5a2bfe66a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3674&h=1813&s=1331998&e=jpg&b=2c7391)

  


矩阵中 `?` 位置的数字在输入为黑色时没有任何影响。它们控制图像其余部分的效果。如果它们全为 `0` ，每个输入像素都会有相同的恒定输出，整个图像将变成 `#ffcca6` 颜色：

  


```XML
<filter id="filter1"  color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix"
        values="0 0 0 0 1.00 
                0 0 0 0 0.80 
                0 0 0 0 0.65 
                0 0 0 1 0" />
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc2d4776406a4c1a8b8c3a67029eff78~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=726&s=4144902&e=gif&f=91&b=070707)

  


这和 CSS 创建一个 `#ffcca6` 颜色填充区没有差异，所以这不是我们所期望的效果。

  


我们希望当输入为白色时输出颜色为白色（全为 `1` ），所以你可能会认为可以用 `1` 替换每个 `?`。然而，每个像素都有这些常数添加进去。添加这些常数后，你会得到一张曝光过度的图像，大部分较亮的细节都被洗掉了。

  


```XML
<filter id="filter1"  color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix"
        values="1 1 1 0 1.00 
                1 1 1 0 0.80 
                1 1 1 0 0.65 
                0 0 0 1 0" />
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5e82ddf14f14b1e85d745051720e3fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1174&h=656&s=4121933&e=gif&f=88&b=070707)

  


可以说，这个效果也不是我们所期望的。

  


相反，你需要计算为白色输入值创建白色最终值所需添加到每个通道的量。换句话说，`?` 被 `1` 减去用于黑色的常数颜色所代替：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed5a48a2c730452da44f0e1fbbf4e1c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3674&h=1813&s=1364232&e=jpg)

  


```XML
<filter id="filter1"  color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix"
        values="0    0 0 0 1.00 
                0.20 0 0 0 0.80 
                0.35 0 0 0 0.65 
                0    0 0 1 0" />
</filter>

<!-- 或者 -->
<filter id="filter2"  color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix"
     values="0 0    0     0 1.00 
             0 0.20 0     0 0.80 
             0 0    0.35  0 0.65 
             0 0    0     1 0" />
</filter>
```

  


使用这个矩阵，结果如下所示：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64a051fac22d492eabfc5da50cc6cf21~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1122&h=652&s=5826794&e=gif&f=100&b=080808)

  


> Demo 地址：https://codepen.io/airen/full/QWRgqJR

  


你可以尝试着在下面的示例中调整颜色，查看 `<feColorMatrix>` 滤镜给图像着色（单色）的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4c9ce2746524aa09dc4b1927034c081~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1162&h=670&s=7281435&e=gif&f=299&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/gOJRXbZ

  


### 双色调着色

  


前面，我们已经尝试了使用颜色矩阵滤镜创建了从黑到彩色的单色效果和彩色到白色的单色效果。接下来，我们来创建彩色到彩色的效果，即双色调着色。

  


实现这个效果的方法与彩色到白色矩阵的方法相同。你需要做的是将矩阵的常数列（最后一列）设置为你想要输入图像黑色部分显示的颜色值，然后将矩阵的其他列设置为这些颜色值与白色部分显示的颜色值之间的差值。这样可以实现黑色部分和白色部分在输出图像中的颜色转换。

  


例如，你要创建一个深蓝色 `#0d2680` （即 `rgb(5% 15% 50%)`）到浅橙色 `#f2a626` （即 `rgb(95% 65% 15%)`）的双色调滤镜效果，你可以使用像下面这样的矩阵：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c50f02014c3e4d30b04d7e8ab4f371b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3674&h=1813&s=1571420&e=jpg&b=2b7291)

  


```XML
<filter id="filter"  color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix"
        values="0.95 0 0 0 0.05 
                0.65 0 0 0 0.15 
                0.15 0 0 0 0.50 
                0    0 0 1 0" />
</filter>

<!-- 或者 -->
<filter id="filter"  color-interpolation-filters="sRGB" >
    <feColorMatrix type="matrix"
        values="0.95 0    0    0 0.05 
                0    0.65 0    0 0.15 
                0    0    0.15 0 0.50 
                0    0    0    1 0" />
</filter>
```

  


白色点将变成 `rgb(95%+5%, 65%+15%, 15%+50%)`。这与之前的浅橙色相同。然而，所有的中间灰色将介于该颜色和深蓝色之间。效果如下：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de15e623a9c444ce9b8b26db29fa9729~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1308&h=668&s=6261205&e=gif&f=119&b=060606)

  


> Demo 地址：https://codepen.io/airen/full/OJYgOrP

  


你也可以尝试在下面这个案例上选择你喜欢的颜色，查看图像应用不同颜色的双色调滤镜效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb346b9b020040f595f14a2f190dda74~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1308&h=686&s=7776316&e=gif&f=324&b=030303)

  


> Demo 地址：https://codepen.io/airen/full/JjqJOVm

  


当然，你选择的白点和黑点颜色不必是可以实现的颜色。你可以像“通道溢出”中展示的案例一样，将某个通道过度溢出或“欠曝光”（即负值）来调整颜色。例如下面这个示例，每个可选值都将在 `-10 ~ 10` 的范围，尝试调整每个通道的值，查看滤镜给图像带来的变化：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75783bcd664b46fcad3ca3e77585cc8d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1288&h=472&s=13139274&e=gif&f=392&b=201e1c)

  


> Demo 地址：https://codepen.io/airen/full/bGyWjZB

  


## 伽马校正着色

  


伽马校正是数字图像处理中常见的操作，用于对亮度或颜色强度进行非线性调整。通过对所有颜色通道应用相同的伽马校正，可以调整中间调的亮度，而不会使亮部或暗部过度曝光或欠曝光。如果分别对每个颜色通道进行伽马校正，可以在保持黑白平衡的同时，改变图像的整体色彩平衡。

  


`<feColorMatrix>` 的双色调着色可以看作是 `sRGB` 颜色空间中选择两种颜色，并在它们之间画一条直线。所有的灰度都映射到这条线上的一个值。如果你对这条线应用颜色特定的伽马因子，你可以在三维颜色空间中创建一条曲线。它可以从黑色开始，最终到达白色，但在此过程中可以通过红色、蓝色或绿色，而不是纯灰色。

  


不过，在 SVG 滤镜中，`<feColorMatrix>` 是不能应用伽马因子。庆幸的是，你可以使用 SVG 中的 `<feComponentTransfer>` 滤镜来实现。它支持对颜色通道进行各种不同的函数操作，但每次只能对一个通道进行操作。每个通道都有自己的元素来描述将要应用的转换函数：`<feFuncR>`、`<feFuncG>`、`<feFuncB>` 和 `<feFuncA>`。每个函数元素都有一个 `type` 属性来描述将使用的数学运算，然后各种其他属性提供每种类型的参数。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73a7ad75b9ac44c69ec5e713223feee0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=698&s=13077537&e=gif&f=165&b=f8f3f2)

  


> URL：https://yoksel.github.io/svg-filters/#/

  


对应的代码如下：

  


```XML
<filter id="filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feComponentTransfer x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="componentTransfer">
        <feFuncR type="identity"/>
        <feFuncG type="table" tableValues="0 1 0"/>
        <feFuncB type="linear" slope="1" intercept="0"/>
        <feFuncA type="identity"/>
    </feComponentTransfer>
</filter>
```

  


在这节课，我们不会对 `<feComponentTransfer>` 滤镜做更多的阐述。小册后面有一节课，将与大家一起探讨这个滤镜的使用。

  


## `<feColorMatrix>` 滤镜的其他使用方式

  


在介绍 `<feColorMatrix>` 滤镜的时候，我们提到过，它的 `type` 有多个值，除了上面聊的 `matrix` 值之外，还有 **`saturate`** 、**`hueRotate`** 和 **`luminanceToAlpha`**：

  


-   **`saturate`**：用来调整图像的饱和度。你可以通过一个参数值（`0 ~ 1` 之间）指定饱和度的程度。` 0  `表示完全去饱和（灰度），`1` 表示不改变饱和度。
-   **`hueRotate`**：用于旋转图像的色相。你可以通过一个角度值（单位是度）指定旋转的角度。这种方式可以改变图像的整体色调。
-   **`luminanceToAlpha`**：将图像的亮度值映射到 Alpha 通道，并将 RGB 通道设置为 `0`。这个效果通常用于将图像的亮度信息转化为透明度信息。

  


这三种类型的使用方式相对而言要简单的多，这里就不详细阐述，通过下面这个工具向大家展示它们的用法：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb9e3f2b0f8342dbb6a27c1d64f2e1e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3336&h=1522&s=697805&e=jpg&b=f7f7f7)

  


> URL：https://yoksel.github.io/svg-filters/#/

  


分别为这三个类型创建滤镜：

  


```XML
<!-- saturate -->
<filter id="saturate" color-interpolation-filters="sRGB">
    <feColorMatrix type="saturate" values="6" in="SourceGraphic" />
</filter>

<!-- hueRotate -->
<filter id="hueRotate" color-interpolation-filters="sRGB">
    <feColorMatrix type="hueRotate" values="183" in="SourceGraphic" />
</filter>

<!-- luminanceToAlpha -->
<filter id="luminanceToAlpha" color-interpolation-filters="sRGB">
    <feColorMatrix type="luminanceToAlpha" in="SourceGraphic" />
</filter>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9201b1c7e9474a489ea546f84602398f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1178&h=728&s=11999613&e=gif&f=108&b=fa8c6b)

  


> Demo 地址：https://codepen.io/airen/full/gOJRvjK

  


## 小结

  


SVG 滤镜是改变 Web 上图像效果的一种强大工具，尤其是通过 `<feColorMatrix>` ，可以进行复杂的颜色操作。相比之下，CSS 的滤镜（`filter`）、混合模式（`mix-blend-mode`）和遮罩（`mask`）也能实现类似效果，且实现更为简便。选择使用哪种方法时，需要根据项目实际需求来选择最为合适的的实现方式。